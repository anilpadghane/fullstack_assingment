var express = require('express');
const app = express();


app.use(express.urlencoded({ extended: true }));

app.use(express.json());


// url
var url = require('url');

// static data serve
app.use(express.static('public/'));


// 
var exe = require('./connection');

// file upload
var upload = require('express-fileupload')
app.use(upload())



// express session
var session = require('express-session');

// import sendOTp
const sendOTP = require('./email');


app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'sjfkadfdhj'
}))


app.get('/', (req, res) => {
    res.render('home.ejs');
})


app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/signup', (req, res) => {
    res.render('signup.ejs')
})


app.post('/saveform', async (req, res) => {

    try {
        // Check if a file is uploaded
        let filename = req.files && req.files.image ? new Date().getTime() + "_" + req.files.image.name : null;

        // Move file to uploads directory if exists
        if (filename) {
            req.files.image.mv('public/uploads/' + filename);
        }

        

    let sql = `INSERT INTO twitter (username,useremail, userpassword, usermobile, image) VALUES (?, ?, ?, ?,?)`;
        const values = [
            req.body.username,
            req.body.useremail,
            req.body.userpassword,
            req.body.usermobile,
            filename || null  // If no file is uploaded, store NULL
        ];
    
        const result = await exe(sql, values);
        console.log("Insert result:", result);

        res.send(`<script>alert('Signup Successful!'); window.location.href='/login';</script>`);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Something went wrong!");
    }
   

})

app.post('/logindata', async (req, res) => {

    var sql = `select * from twitter where useremail='${req.body.useremail}' And userpassword='${req.body.userpassword}'`;
    const result = await exe(sql);

    if (result.length > 0) {

        // session id store
        req.session.login_id = result[0].twit_id;


        var otp = Math.trunc(Math.random() * 10000);


        // store  otp in a session 
        req.session.otp = otp;

         sendOTP(result[0].useremail,otp)

            console.log(sendOTP)
       
        console.log(req.body);
       

        res.redirect('/accept_otp')
      

    }

    else {
        res.send(`<script>
            
            alert('Invalid Login Credentials..')
            window.location.href='/login';

            // or
            // window.assign('/login')
            </script>`)
    }


})



// accpete otp
app.get('/accept_otp', (req, res) => {


    if (req.session.login_id) {
        res.render('accept_otp.ejs')


    }

    else {
        res.redirect('/login')
    }
})


app.post('/otpverified', (req, res) => {

    var sessionotp = req.session.otp;
    var userotp = req.body.otp;

    if (sessionotp == userotp) {


        req.session.twit_id=req.session.login_id

        res.redirect('/profile')
       
        

    }

    else
    {
        res.send(`<script>
            alert('invalid OTP')
            window.location.href='/accept_otp'
            
            </script>`)
    }



})




app.get('/profile', async (req, res) => {
    if (req.session.twit_id) {
        try {
            // Fetch only the logged-in user's profile
            const sql = `SELECT * FROM twitter WHERE twit_id = ?`;
            const data = await exe(sql, [req.session.twit_id]); // Pass twit_id as a parameter

            // Log for debugging
            console.log("Logged-in User Profile Data:", data);

            // Pass `data` to EJS
            res.render('profile.ejs', { data: data });
        } catch (error) {
            console.error("Error fetching profile data:", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.redirect('/login'); // Redirect if not logged in
    }
});



//logout
app.get('/logout',(req,res)=>{
req.session.destroy((err)=>{
    if(err)
    {
        console.log(err)
        return res.status(400).send("err")
    }


res.redirect('/login')
})
})
 

app.get('/edit/:id', async (req, res) => {

    try {


        var id = req.params.id;

        var sql = `select * from twitter where twit_id='${id}'`;
        const result = await exe(sql);

        console.log(result)

        const obj = { data: result[0] }

        // res.send(result)
        res.render('edit.ejs', obj)



    }

    catch (err) {
        console.log(err)
    }

})


app.post('/updateform', async (req, res) => {
    try {
        let filename = req.body.image; // Keep the old image if no new one is uploaded

        if (req.files && req.files.image) {
            let uploadedImage = req.files.image;
            filename = new Date().getTime() + "_" + uploadedImage.name;
            await uploadedImage.mv('public/uploads/' + filename); // Save the new image
        }

        // Use a single UPDATE query to update all fields at once
        let sql = `UPDATE twitter 
                   SET useremail = ?, 
                       usermobile = ?, 
                       username = ?, 
                       image = ? 
                   WHERE twit_id = ?`;

        // Execute the query with parameterized values
        await exe(sql, [req.body.useremail, req.body.usermobile, req.body.username, filename, req.body.twit_id]);

        // Ensure that res.redirect is called only once
        res.redirect('/profile');  
    } catch (err) {
        console.error("Error updating user:", err);
        if (!res.headersSent) {
            res.status(500).send("Error updating user");
        }
    }
});
app.get('/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;

        // Delete user from database
        let sql = `DELETE FROM twitter WHERE twit_id = ?`;
        await exe(sql, [id]);

        console.log(`User with ID ${id} deleted successfully.`);

        // Destroy session and redirect to login page
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destroy error:", err);
            }
            res.redirect('/login'); // Redirect to login page after deletion
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
});


const HOST = '127.0.0.1';
const PORT = 3001 || process.env.PORT;


app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT} `)
})


