import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  password: "123456",
  host: "localhost",
  port: 5432,
  database: "MykolBook",
});

let email;
let password;
let username;
let data;
let posts;

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.post("/register", async (req, res) => {

    email = req.body["email"];
    password = req.body["password"];
    username = req.body["username"];
    
    console.log(username);
    console.log(email);
    console.log(password);

    
    data = await db.query("SELECT * FROM users WHERE user_name = $1", [username]);

    console.log(data.rows[0]);
    

    if(data.rows[0] === undefined){
       await db.query(
        "INSERT INTO users (user_name, user_password, user_email) VALUES ($1, $2, $3)", 
        [username, password, email]  
        );

        await db.query(`CREATE TABLE ${username} (id SERIAL PRIMARY KEY, posts TEXT)`);

        console.log("User created!");
        res.redirect("/");
    }
    else{
        
        console.log("Username already exists. Please think of another user name!")
        let userTaken = "Username already exists. Please think of another user name!";
        res.render("index.ejs", {
            error_message: userTaken
        });
        // res.redirect("/")
    }

});

app.post("/login", async (req, res) => {

    password = req.body["passwordLogin"];
    username = req.body["userLogin"];
    
    console.log(username);
    console.log(password);

    data = await db.query("SELECT * FROM users WHERE user_name = $1 AND user_password = $2", [username, password]); 

    console.log(username.toLowerCase());
    console.log(data.rows[0]);
    
    if(data.rows[0] === undefined){
    
        console.log("Username or password does not exist.");
        let incorrect_UP = "Username or password does not exist.";
        res.render("index.ejs", {
            error_message: incorrect_UP
        });

    }
    else{    
        
        data = await db.query("SELECT * FROM users WHERE user_name = $1 AND user_password = $2", [username,password]);
        posts = await db.query(`SELECT posts FROM ${username.toLowerCase()}`);

        res.render("user.ejs", {
            data: data.rows[0],
            posts: posts.rows
        });
    }
     
});

app.post("/newPost", async (req, res) => {
    const text = req.body["postText"];
    console.log(username.toLowerCase());
    console.log(text);
    await db.query(`INSERT INTO ${username.toLowerCase()} (posts) VALUES ($1)`, [text]); 

    data = await db.query("SELECT * FROM users WHERE user_name = $1 AND user_password = $2", [username,password]);
    posts = await db.query(`SELECT posts FROM ${username.toLowerCase()}`);

    res.render("user.ejs", {
        data: data.rows[0],
        posts: posts.rows
    });    

});


app.listen(port, () => {
    console.log("Listening on port " + port);
});

