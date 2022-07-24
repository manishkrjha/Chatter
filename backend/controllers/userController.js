const asyncHandler = require("express-async-handler");
const User = require("../data/models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler( async (req, res) => {

    //Getting data from frontend
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter all the mandatory fields");
    }

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("The user already exists!");
    }

    const user = await User.create({
        name, 
        email,
        password, 
        pic
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }else{
        res.status(400)
        throw new Error("Failed to create new user");
    }
});

const authUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if(user && await (await user.matchPassword(password))){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        })
    }else{
        res.status(400)
        throw new Error("Invalid name or password");
    }
});

//sending the call as Queries
// /api/users?search=sergio
// $options: i means that the data can be both uppercase or lowercase 
const allUsers = asyncHandler( async (req, res) => {
    const keyword = req.query.search ?
    {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
}); 

//exporting like this because not a default export
module.exports = {registerUser, authUser, allUsers};
