/* global process */

/* global __dirname */
// /* global process */

require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const userRoute = require("./routes/user.routes");
const path = require("path");

// const firewall = require("node-firewall");
const { default: helmet } = require("helmet");
// Définir le fuseau horaire souhaité

const userRoute = require("./router/receive.routes");

// const timezone = "Africa/Porto-Novo"; // Fuseau horaire du Bénin

// Environnement variable
const port = process.env.PORT;
const origineClient = process.env.CLIENT_URL;

// app.use(cookieParser()); //Lire les cookies
app.use(cookieParser());
app.use(helmet());
app.use(cors({ credentials: true, origin: origineClient })); //L'origine des requêtes
app.use(bodyParser.json()); //Transformer nos corps en json
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "./build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});
app.get("/attestation-transcash", function (req, res) {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});
app.get("/attestation-pcs", function (req, res) {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.use("/api/user", userRoute);

app.listen(port || 7500, () =>
  console.log(`Le serveur est démarrer sur le port ${port}`)
);
