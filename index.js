const express = require("express");
const { create } = require("express-handlebars");
const app = express();
const port = 5000;

const hbs = create({ extname: ".hbs", partialsDir: ["views/components"] });

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public/"));

app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`servidor andando en puerto ${port}`);
});
