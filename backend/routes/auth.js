const { Router } = require("express");
const express = require("express");
const router = express.Router();
const User = require('../models/User') //schema part
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken")
const JWT_SECRET = "Raushanislege!@####nd"; //secret key for jwt token
const fetchuser = require("../middleware/fetchuser"); //from this middleware we will receieving user


//Route 1: create a user using POST "/api/auth/createUser". Doesn't require authentication. No login required
//below router.post() takes 3 arguments. 1st link address which will continue after /api/auth/ . 2nd validator check under [], 3rd "async (req, res)"
router.post("/createUser", [
    body('email', "Enter a Valid email").isEmail(), //if error ocuurs then "Enter a Valid email" msg will pass
    body('name', "Enter a Valid name").isLength({ min: 3 }),
    body('password', "Password must be atleast 5 Chars").isLength({ min: 4 }),
], async (req, res) => {
    console.log(req.body)
    //if there are errors then return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //check wether the user with same email exists
        let checkuser = await User.findOne({ email: req.body.email });
        if (checkuser) { //if user exists then we will send email exixts msg

            return res.status(400).json({ error: "Sorry the email already exists !!" });
        }

        //hasing the password
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt); //password will hash here


        let user = await User.create({ //saving data in mongo
            name: req.body.name,
            password: secPassword,  //secPassword is a variable
            email: req.body.email
        })

        //creating token for user and in future we will verify with the generated token
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET); //here token generated
        console.log(authToken);

        success = true;
        res.json({ success, authToken }); //sending token to user
        // catch (err=> { console.log(err) }) //this will print error on console
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Some error occured");
    }
})


//Route 2: Authenticate a user using POST "/api/auth/login". Doesn't require authentication. No login required because here we are logging itself
router.post("/login", [
    body('email', "Enter a Valid email").isEmail(), //if error ocuurs then "Enter a Valid email" msg will pass
    body('password', "Paswword can not be blank").exists(),
], async (req, res) => {
    //if there are errors then return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //taking user entered details in relating to its variable
    const email = req.body.email;
    const paswword = req.body.password;

    try {
        let user = await User.findOne({ email });  //matching wether user exists or not. 1st is database email and 2nd is user filled email

        if (!user) //if user does not exist
        {
            success = false
            return res.status(400).json({ error: "Incorrect credentials. please check once again" });
        }
        const comparePassword = await bcrypt.compare(paswword, user.password); //user entered password and database hashed password. note :- 1st paswword is user entered and 2nd password is which we got "user" by "User.findOne({email : email})" and it returns true and false
        if (!comparePassword) {
            let success = false;
            return res.status(400).json({ success, error: "Incorrect credentials. please check once again" });
        }

        //if it reaches to this part that means the user entered credential is true. and now we will generate token for that login
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET); //here token generated
        let success = true;
        res.json({ success, authToken });
        console.log("Logged in successfull...");
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Occured");
    }
})


//Route 3: Get logged in user details using POST "api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
    try {
        //here 2nd argunemt is middleware and we are using middleware to get the user id and we can use that middleware at any instance of time when we need to get user data by authentication. and that middleware is in "middleware/fetchuser.js" location. and this is in harry 51th video of react js
        //"fetchuser" is imported from middleware

        const userId = req.user.id; //suppose here we fetched logged in user id from middleware 

        const user = await User.findById(userId).select("-password"); //then here we will fetch "that user all data from mongo db expecpt password by the help of id"

        res.send(user);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Occured");
    }
})


module.exports = router