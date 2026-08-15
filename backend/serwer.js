const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(routes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend sklepu działa"
  });
});

app.listen(PORT, () => {
  console.log(`Backend działa na porcie ${PORT}`);
});
