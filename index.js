import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

app.use(
    session({
      secret: "TOPSECRETWORD",
      resave: false,
      saveUninitialized: true,
    })
  );

const db = new pg.Client({
  user: "postgres",
  password: "123456",
  host: "localhost",
  port: 5432,
  database: "MykolBook", //change user, password and database parameters accordingly
});

let email;
let password;
let username;
let data;
let posts;
let confirmPassword;
let saltRounds = 10;
let createPost = false;

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
    res.render("index.ejs");
 
});

app.get("/login", async (req, res) => {
    console.log(req.user);
    
    if (req.isAuthenticated()) {
    username = req.user.user_name;
    const posts = await db.query(`SELECT * FROM ${username.toLowerCase()} `)
      res.render("user.ejs",{
        data: req.user,
        posts: posts.rows,
        createPost: createPost
      });
    } else {
      console.log("error login in");
      res.redirect("/");
    }
  });

app.post("/register", async (req, res) => {

    email = req.body["email"];
    password = req.body["password1"];
    confirmPassword = req.body["confirmPassword"]
    username = req.body["username1"];

    console.log(password);
    console.log(confirmPassword);

    
    data = await db.query("SELECT * FROM users WHERE user_name = $1", [username]);


    if(password !== confirmPassword){
        console.log("Passwords do not match!");
        let noMatch = "Passwords do not match!";
        res.render("index.ejs", {
            error_message: noMatch
        });
    }
    else if(data.rows[0] === undefined){

        bcrypt.hash(password, saltRounds, async (err, hash) => {

            await db.query(
                "INSERT INTO users (user_name, user_password, user_email) VALUES ($1, $2, $3)", 
                [username, hash, email]  
                );
        
                await db.query(`CREATE TABLE ${username} (id SERIAL PRIMARY KEY, post_title TEXT, posts TEXT, date TEXT)`);
        
                let message = "User created!";
        
                res.render("index.ejs", {
                    message: message
                });
        });    
    }
    else{
        
        console.log("Username already exists. Please think of another username!")
        let userTaken = "Username already exists. Please think of another username!";
        res.render("index.ejs", {
            error_message: userTaken
        });   
    }
});

app.post("/login", 

    passport.authenticate("local", {
        successRedirect: "/login",
        failureRedirect: "/",
      })

);

app.post("/createPost", (req, res) => {
  console.log("sveiki");
  createPost = true;
  res.redirect("/login");
})


app.post("/newPost", async (req, res) => {

    const date = new Date();
    const postDate = date.toLocaleString('en-GB', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric"});
    const title = req.body["postTitle"];
    const text = req.body["postText"];
    console.log(username);
   
    await db.query(`INSERT INTO ${username.toLowerCase()} (posts, post_title, date) VALUES ($1, $2, $3)`, [text, title, postDate]); 

    data = await db.query("SELECT * FROM users WHERE user_name = $1", [username]);
    posts = await db.query(`SELECT posts, post_title, date FROM ${username.toLowerCase()}`);
   
    console.log(posts.rows);

    createPost = false;
    res.redirect("/login");  

});

app.post("/cancel", (req, res) => {
  createPost = false;
  res.redirect("/login")
})

//cia gali but klaida, jeigu is tikro privalo but username ir password. Issiaiskinti ka daryt kitokiais atvejais. Register ir login dabar username ir password tokie patys name, gali klaidu but.

    passport.use(
        new Strategy(async function verify(username, password, cb) {
           try{
             const result = await db.query("SELECT * FROM users WHERE user_name = $1 ", [
               username]);
            
            if(result.rows[0] === undefined){
                return cb("User not found");
            }
            else{

                username = result.rows[0];
                const hashedPasswordCheck = result.rows[0].user_password;

                bcrypt.compare(password, hashedPasswordCheck, (err, valid) => {

                    if (err) {
                        //Error with password check
                        console.error("Error comparing passwords:", err);
                        return cb(err);
                      } 
                    else if(valid){
                        return cb(null, username);
                    }
                    else {
                        //Did not pass password check
                        return cb(null, false);
                      }
                
                })
            }

            }
            catch(err){
                console.log(err);
            }
    }));
            
      passport.serializeUser((user, cb) => {
        cb(null, user);
      });
      passport.deserializeUser((user, cb) => {
        cb(null, user);
      });

app.listen(port, () => {
    console.log("Listening on port " + port);
});

