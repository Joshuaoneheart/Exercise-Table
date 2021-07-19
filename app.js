const express = require("express")
const app = express();

app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");
app.set('views', __dirname);
app.use(express.static(__dirname))

app.get("/", function(req, res){
  res.render("index.html", {"title": "台大台科大操練表系統"});
})

app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running...")
)
