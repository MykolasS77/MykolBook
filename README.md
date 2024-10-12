This is a web app which lets you to create an account and make blog posts.  

REQUIREMENTS:
1.Node.js with nodemon
2.pgAdmin 4
3.gitBash
4.IDE of choice (duh)

GUIDE:
1.Download the files. 
2.In gitBash terminal, "cd" to where you've extracted the files and run "npm i" command.
3.In pgAdmin4, create a new database named "MykolBook". 
4.Copy code from "table.sql". Click on "Query Tool" in pgAdmin, paste it and click "Execute/Refresh". A new table called "users" should have appeared in schemas -> public -> tables. 
5.In the "index.js" file, change user and password parameters of "pg.Client" if needed. If the database you've created has a different name, change it as well. 
6.Run "nodemon index.js" command in gitBash terminal. 
7.Open your web browser and type "localhost:3000" in search bar. 
