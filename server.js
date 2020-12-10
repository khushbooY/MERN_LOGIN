const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;
const dbConnected = require("./config/db")
const path = require('path')
app.use(express.static(path.join(__dirname, 'build')));

var cors = require('cors')

app.use(cors())

dbConnected();
// Init Middleware 
app.use(express.json({
    extended: false
}));



app.use('/sign_up', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));




app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})


