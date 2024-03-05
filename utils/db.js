const mongoose = require('mongoose');
require("dotenv").config();


const URI = process.env.MONGODB_URI;

const connectDb = async () =>{
    try {
        await mongoose.connect(URI);
        console.log('connection successful to DB');
    } catch (error) {
        console.log('database connection failed');
        process.exit(0);
    }
}

module.exports = connectDb;