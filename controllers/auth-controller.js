const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

// *------------------------
// USER REGISTRATION LOGIC
// *-------------------------

const register = async (req,res,next) =>{
    try {
        const {username,email,password}= req.body;

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message:"Email already exists"});
        }

        const userCreated = await User.create({
            username,
            email,
            password,
        });

        res.status(201).json({
            msg : "Registration successful",
            token: await userCreated.generateToken(), 
            userId:userCreated._id.toString(),
        });
    } catch (error) {
        // res.status(500).json({msg: 'internal server error'});
        next(error);
    }
};
// *------------------------
// USER LOGIN LOGIC
// *-------------------------

const login = async (req,res) =>{
    try {
        console.log(req.body);
        const {email,password} = req.body;

        const userExist = await User.findOne({email});

        if(!userExist){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        // compare password
        const user = await userExist.comparePassword(password);
        console.log("user from login",user);
        
        if(user){
            res.status(200).json({
                msg : "Login Successful",
                token: await userExist.generateToken(), 
                userId:userExist._id.toString(),
            });
        }else{
            res.status(401).json({message : "Invalid email or password"});
        }

    } catch (error) {
        next(error);
    }

}
// *------------------------
// USER UPDATE LOGIC
// *-------------------------


const updateUser = async (req, res) => {
    console.log('from updateUser', req.body);
    const { username, oldPassword, password } = req.body;
    console.log('from updateUser params', req.params);
    const { id: userId } = req.params;

    try {
        const userExist = await User.findById(userId);

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    
        // Compare old password
        const isPasswordMatch = await userExist.comparePassword(oldPassword);
        console.log("after compare password in update",isPasswordMatch);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        // Encrypt new password
        const saltRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRound);

        // Update user with new username and encrypted password
        const userUpdate = await User.findOneAndUpdate(
            { _id: userId },
            { username, password: hashedPassword },
            { new: true }
        );

        if (userUpdate) {
            res.status(200).json({ message: "Update Successful" });
        } else {
            res.status(500).json({ message: "Update unsuccessful" });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// *-----------------------------
// USER  LOGIC - to send user data
// *------------------------------

const user = async (req, res) =>{
    try {
        const userData = req.user;
        // console.log(userData);
        return res.status(200).json({userData});
    } catch (error) {
        console.log(`error from the user route ${error}`);
    }
}


module.exports = {register, login, updateUser, user};