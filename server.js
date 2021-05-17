const express  = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('assets'));

let allNotes = [];
// GET, POST and DELETE requests

app.get("/api/notes", function(err, res){
    try{
        allNotes = fs.readFileSync("./db/db.json","utf8");
        allNotes = JSON.parse(allNotes);
    } catch(err){
        console.log(err);
    }
    res.json(allNotes);
});

app.post("/api/notes", function(req,res){
    try{
        allNotes = fs.readFileSync("./db/db.json","utf8")

        allNotes = JSON.parse(allNotes);

        req.body.id = allNotes.length;
        allNotes.push(req.body);
        allNotes = JSON.stringify(allNotes);

        fs.writeFile("./db/db.json", allNotes, "utf8",function(err){
            if (err) throw err;
        });

        res.json(JSON.parse(allNotes));
    } catch (err){
        console.log(err);
    }
});

app.delete("/api/notes/:id", function(req,res){
    try {
        allNotes = fs.readFileSync("./db/db.json","utf8");
        allNotes = JSON.parse(allNotes);
        allNotes = allNotes.filter(function(node){
            return node.id != req.params.id;
        });
    
        allNotes = JSON.stringify(allNotes);
    
        fs.writeFile("./db/db.json", allNotes, "utf8", function(err){
            if (err) throw err;
        });

        res.send(JSON.parse(allNotes));

    } catch (err) {
        console.log(err);
    }
 
});

app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname,"assets/notes.html"));
});

app.get("*",function(req,res){
    res.sendFile(path.join(__dirname,"assets/index.html"));
});

app.get("/api/notes",function(req,res){
    return res.sendFile(path.join(__dirname,"db/db.json"));
})

app.listen(PORT, function(err){
    if(err) console.log(err);
    console.log("Server listening on PORT: " + PORT);
});