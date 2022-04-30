const mongoose = require('mongoose')

const url_offline = "mongodb://localhost/SocialDB"

//CONNECTING TO MONGODB DATABASE
mongoose.connect(url_offline).then(()=>{
    console.log('Database is connected successfully')
}).catch((err)=>{
    console.log('an error occured', err)
})