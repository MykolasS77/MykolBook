import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/register", (req, res) => {
    const email = req.body["email"];
    const password = req.body["password"];
    console.log(email);
    console.log(password);

    res.redirect("/");

});

app.listen(port, () => {
    console.log("Listening on port " + port);
});