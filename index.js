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



db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/register", async (req, res) => {
    const email = req.body["email"];
    const password = req.body["password"];
    const username = req.body["username"];
    
    console.log(username);
    console.log(email);
    console.log(password);
    
    await db.query(
        "INSERT INTO users (user_name, user_password, user_email) VALUES ($1, $2, $3)", 
        [username, password, email]
    );
    // await db.query(
    //     "INSERT INTO users (user_password) VALUES ($1)", 
    //     [password]
    // );
    // await db.query(
    //     "INSERT INTO users (user_email) VALUES ($1)", 
    //     [email]
    // );

    res.redirect("/");

});



app.listen(port, () => {
    console.log("Listening on port " + port);
});