const { Router } = require("express");
const express = require("express");
const app = express();
const router = express.Router();
const Note = require('../models/Notes') //schema part
const fetchuser = require("../middleware/fetchuser"); //from this middleware we will receieving user
const { body, validationResult } = require('express-validator');




router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }); //here we will get all the notes. find() - no matter the number of documents matched, a cursor is returned, never null.

        res.json(notes);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Some error occured");
    }
})





//Route 2 : this end point POST "/api/notes/addnote" . Here we will add note. login required. its taking 4 parameter
router.post("/addnote", fetchuser, [
    body('title', "Enter a Valid Title").isLength({ min: 3 }),
    body('description', "Description at least must be 5 chars").isLength({ min: 5 })
], async (req, res) => {
    //if there are errors then return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body; //taking user filled data

        const note = new Note({
            title, description, tag, user: req.user.id   //adding user filled data in database. 4 filled will be added
        })
        const savedNote = await note.save();   //saving to database
        res.json(savedNote);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Some error occured");
    }
})



//Route 3 : this end point PUT "/api/notes/updatenote" . Here we update an existing note. login required. its taking 3 parameter
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    //create a newNote object
    const newNote = {};
    //whatever user want to change only that we will change
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //first we will check wether the :id exists or not in data base
    const note = await Note.findById(req.params.id); //this will check user url id exists or not
    if (!note) {
        return res.status(404).send("Not Found");
    }

    //"note.user.toString()" is "id" of user entered and "req.user.id" is actual "id" of "logged in user". if both not matched that means the logged in user want to access another user data
    if (note.user.toString() != req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    //"req.params.id" means id which is in user url
    //if it comes to this part then that means the user is authorised and we can allow him to update
    const noteUpdated = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }); //here we are updating note
    res.json({ noteUpdated });
})


//Route 4 : this end point DELETE "/api/notes/deletenote" . Here we delete an existing note. login required. its taking 3 parameter
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body; //taking user filled data


    //first we will check wether the :id exists or not in database
    const note = await Note.findById(req.params.id); //this will check user url id exists or not
    if (!note) {
        return res.status(404).send("Not Found");
    }

    //"note.user.toString()" is "id" of user entered and "req.user.id" is actual "id" of "logged in user". if both not matched that means the logged in user want to access another user data
    if (note.user.toString() != req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    //"req.params.id" means id which is in user url
    //if it comes to this part then that means the user is authorised and we can allow him to delete
    const deletedNote = await Note.findByIdAndDelete(req.params.id); //here we are updating note
    res.json({ "success": "note has been deleted" });
})

module.exports = router;