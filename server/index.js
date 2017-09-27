/* eslint-disable no-console */
const express = require('express');

const app = express();

app.use(express.static('dist'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});
