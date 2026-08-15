const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const productAdminRoutes = require("./productAdminRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(routes);
app.use(productRoutes);
app.use(categoryRoutes);
app.use(productAdminRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend sklepu działa"
    });
});

app.listen(PORT, () => {
    console.log(`Backend działa na porcie ${PORT}`);
});
