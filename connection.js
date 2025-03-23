var mysql=require('mysql2');
var util=require('util');

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'instagram_db',
    password:'',
    port:3306
})

connection.connect((err)=>{
    if(err) throw err
})

var exe=util.promisify(connection.query).bind(connection);


module.exports=exe;