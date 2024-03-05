const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
require("dotenv").config();

const authMiddleware = async (req, res, next) =>{
    // console.log('authMiddleware lo headers  token request',req.header("Authorization"));
    const token = req.header("Authorization");

    if(!token){
        return res
        .status(401)
        .json({message: "Unauthorized HTTP, Token not provided"});
    }
    console.log('token from auth middleware', token);

    const jwtToken = token.replace("Bearer","").trim();

    try {

        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
        console.log("is verified",isVerified);
        
        const userData = await User.findOne({email:isVerified.email})

        req.user = userData;
        req.token = token;
        console.log('token from authMiddleware',req.token)
        req.userID = userData._id;

        next();

    } catch (error) {
        return res.status(401).json({message:"Unauthorized. Invalid token."});
    }

   
};

module.exports = authMiddleware;