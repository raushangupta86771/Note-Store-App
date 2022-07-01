import React, { useContext, useState } from 'react';
import noteContext from "../context/notes/noteContext"

const AddNote = () => {
    const context = useContext(noteContext); //for using imported note context
    const { addNote } = context; //using note app data. 
    const [note, setNote] = useState({ title: "", description: "", tag: "" }); //this is doing for onchange. initially all three values are empty

    const handleClick = (e) => {
        e.preventDefault(); //protecting page to not reload while clicking on submit button
        addNote(note.title, note.description, note.tag);
        setNote({ title: "", description: "", tag: "default" }); //notes khaali kar do agar add ho gya to
    }

    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value }) //iska matlab agar pahle jo value hai usko rahne do. aur jo bhi change ho rha uske name ko value ke barabar kar do
    }

    return <div>
        <div className="container my-3">
            <h2>Add a Note</h2>

            <form className='my-3'>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" aria-describedby="emailHelp" onChange={onchange} name='title' value={note.title} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name='description' onChange={onchange} value={note.description} />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name='tag' onChange={onchange} value={note.tag} />
                </div>
                <button type="submit" disabled={note.title.length < 5 || note.description.length < 5} className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    </div>;
};

export default AddNote;
