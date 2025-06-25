const User = require("../models/User");
const Poll = require("../models/Poll");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

};

//Register User
exports.registerUser = async (req, res) => {
    const { fullName, username, email, password, profileImageUrl } = req.body;

    //Validation: Check for missing fields
    if(!fullName || !username || !email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }

    //validation: check username format
    //Allows alphanumeric characters and hypens only
    const usernameRegex = /^[a-zA-Z0-9-0]+$/;
    if(!usernameRegex.test(username)){
        return res.status(400).json({
            message:
            "Invalid username. Only alphanumeric characters and hypens are allowed. No spaces are permitted."
        });
    }
    try{
        //check if email already exists
         const existingUser = await User.findOne({ email });
         if (existingUser){
            return res.status(400).json({ message: "Email already in use" });
         }
         //Check if username already exists
         const existingUsername = await User.findOne({ username });
         if(existingUsername){
            return res 
             .status(400)
             .json({ message: "Username not available. Try another one."});
         }

         //create the user
         const user = await User.create({
            fullName,
            username,
            email,
            password,
            profileImageUrl
         });

         res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
         });
    }catch(err){
           res
             .status(500)
             .json ({ message: "Error regising user", error: err.message });
    }
};

//Login User
exports.loginUser = async (req, res) => {
    const {  email, password } = req.body;
    
    //Validation: Check for missing fields
    if(!email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }
    try{
        const user = await User.findOne({email});
        if (!user || !(await user.comparePassword(password))){
            return res.status(400).json({ message: "Invalid credentials" });
        }


        //Create polls created by the user
        const totalPollsCreated = await Poll.countDocuments({ creator: user._id });
        
        //Count polls the user has voted in
        const totalPollsVotes = await Poll.countDocuments({
            voters: user._id,
        });

        //Get the count of bookmarked polls
      const totalpollsBookmarked = Array.isArray(user.bookmarkedPolls) ? user.bookmarkedPolls.length : 0;

        res
         .status(200)
         .json({
            id: user._id,
            user: {
                ...user.toObject(),
                totalPollsCreated ,
                totalPollsVotes,
                totalpollsBookmarked,
            },
            token: generateToken(user._id),
         });
    }catch (err){
        res
             .status(500)
             .json ({ message: "Error login user", error: err.message });
    }
    
}


//Register User
exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
    
//Add the new attributes to the response
const userInfo = {
    ...user.toObject(),
    totalPollsCreated : 0,
    totalPollsVotes : 0,
    totalpollsBookmarked : 0,
};

res.status(200).json(userInfo);
}
  catch (err){
        res
             .status(500)
             .json ({ message: "Error login user", error: err.message });
    }
};