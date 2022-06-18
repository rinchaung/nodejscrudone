const path  = require(`path`);
const ejs   = require(`ejs`);
const mysql = require(`mysql`);
const express = require(`express`);
const bodyParser = require(`body-parser`);
const app   = express();

//Create Database Connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'nodejscrud'
});

//Mysql Connection
db.connect((err)=>{
    if(!!err){
        console.log(err);
    }else{
        console.log(`Mysql Database is connecting!...`);  
    }
});

//Create DB
app.get('/createdb', (req, res) =>{
    let sql = 'CREATE DATABASE nodejscrud';
    db.query(sql, (err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
        }    
        res.send('Database is created!');
    });
});

//Set views file
app.set(`views`,path.join(__dirname,`views`));

//Set view engine ejs
app.set(`view engine`, `ejs`);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Home page
app.get('/',(req,res)=>{
    //res.send(`Nodejs CRUD with Mysql and Express!...`);
    let sql = `SELECT * FROM users`;
    let query = db.query(sql, (err,rows) => {
    if(err) console.log(err);
    res.render(`user_index`,{
        title : `Nodejs CRUD with Mysql and Express!`,
        users : rows
    });
    });
});

//Add page
app.get('/add',(req,res)=>{
    res.render(`user_add`,{
        title : `Nodejs CRUD with Mysql and Express!`
    });
});

//Create Route
app.post('/save',(req,res)=>{
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql  = "INSERT INTO users SET ?";
    let query = db.query(sql,data,(err,results)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});


//Edit Route
app.get('/edit/:userId',(req,res)=>{
    const userId = req.params.userId;
    let sql      = `Select * from users where id = ${userId}`;
    let query    = db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
        }
        res.render(`user_edit`,{
            title : `Nodejs CRUD Operation using with mysql and expressjs`,
            user  : result[0]
        })
    });
});

//Update Route
app.post('/update',(req,res)=>{         
    const userId = req.body.id;
    let sql  = "update users SET name='"+req.body.name+"', email='"+req.body.email+"', phone_no='"+req.body.phone_no+"' where id = "+userId;
    let query = db.query(sql,(err,results)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});

//Delete Route
app.get('/delete/:userId',(req,res)=>{
    const userId = req.params.userId;
    let sql      = `DELETE from users where id = ${userId}`;
    let query    = db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
        }
        res.redirect(`/`);
    });
});

//Server Listening at port 3000
app.listen('3000',()=>{
    console.log(`Server is running at port 3000!...`);
});