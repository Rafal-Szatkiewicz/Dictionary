const express = require('express');
const product = require('./api/product');
app = express();

app.use("/", product);

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});