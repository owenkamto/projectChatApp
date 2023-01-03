const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async(req, res) =>{
    const {name, email, password, phone} = req.body;

    if(!name || !email || !password || !phone){
        res.status(400);
        throw new Error("Please enter all the fields")
    }
    const emailExists = await User.findOne({ email });
    if (emailExists){
        throw new Error("Email already exist")
    }

    const phoneExists = await User.findOne({ phone });
    if (emailExists){
        throw new Error("Phone number already exist")
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
    })
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: generateToken(user._id)
        })
    } else {
        throw new Error("Failed to create the user")
    }
});

const authUser = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: generateToken(user._id)
        })
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password")
    }
})

// /api/user?search=<smth>
const allUsers = asyncHandler(async(req, res) =>{
    const keyword = req.query.search ? 
    {
        $or: [
            { phone: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ], 
    } : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
})

const renameUser = asyncHandler(async (req, res) => {
    const { userId, name } = req.body;

    const updatedName = await User.findByIdAndUpdate(
        userId,
        {
        name: name,
        },
        {
        new: true,
        }
    )

    if (!updatedName) {
        res.status(404);
        throw new Error("User Not Found");
    } else {
        res.json(updatedName);
    }
})

module.exports = {registerUser, authUser, allUsers, renameUser};