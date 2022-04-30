//importing or requireing the database
require("./DbConfiq/db")

//import the express module
const express = require('express')
//creating a port for the server
const port = 7890;


const app = express()
app.use(express.json())

app.use('/api', require('./Routes/UserRoute'))


// connecting to the server
app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})