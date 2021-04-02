const mongoose = require('mongoose') //npm moduel that allows us to create models(tables) with mongodb


mongoose.connect(process.env.MONGDB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})





//to turn on mongodb in command p "C:\Users\Ilan Lieberman\mongodb\bin\mongod.exe" --dbpath="/Users/Ilan Lieberman/mongodb-data"