const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.use("/api/products", require("./routes/products"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.info(`Listening on Port ${port}`);
});
