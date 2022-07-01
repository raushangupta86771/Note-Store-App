import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import noteContext from "../context/notes/noteContext"
import AddNote from './AddNote';
import NoteItem from './NoteItem';

const Notes = () => {
    const context = useContext(noteContext); //for using imported note context
    const { notes, getNotes, editNote } = context; //using note app data. 
    let history = useHistory();

    useEffect(() => { //for showing all the notes. which we fetched from mongoDb
        if (localStorage.getItem('token')) {
            getNotes();
        }
        else {
            history.push("/login");
        }
        // eslint-disable-next-line
    }, []);
    console.log(notes);

    const ref = useRef(null);
    const closeRef = useRef(null);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" }); //this is doing for onchange. initially all three values are empty

    const updateNote = (currNote) => {
        ref.current.click(); //for clicking on modal button after clicking on edit button
        setNote({ id: currNote._id, etitle: currNote.title, edescription: currNote.description, etag: currNote.tag });
    }


    const handleClick = (e) => {
        e.preventDefault(); //protecting page to not reload while clicking on submit button
        editNote(note.id, note.etitle, note.edescription, note.etag);
        closeRef.current.click(); //for closing the tab after clicking on update button
    }

    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value }) //iska matlab agar pahle jo value hai usko rahne do. aur jo bhi change ho rha uske name ko value ke barabar kar do
    }

    return <>
        <AddNote />

        <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal" ref={ref}>
            Launch demo modal
        </button>
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form className='my-3'>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input type="text" className="form-control" id="etitle" aria-describedby="emailHelp" onChange={onchange} name='etitle' value={note.etitle} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <input type="text" className="form-control" id="edescription" name='edescription' onChange={onchange} value={note.edescription} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="etag" className="form-label">Tag</label>
                                <input type="text" className="form-control" id="etag" name='etag' onChange={onchange} value={note.etag} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={closeRef}>Close</button>
                        <button type="button" disabled={note.etitle.length < 5 || note.edescription.length < 5} className="btn btn-primary" onClick={handleClick}>Update Note</button>
                    </div>
                </div>
            </div>
        </div>


        <div className="row my-3">
            <h2>You Notes</h2>
            <div className="container mx-2">
                {notes.length === 0 && 'No notes to display'}
            </div>
            {notes.map((note) => {
                return <NoteItem key={note._id} updateNote={updateNote} note={note} />
            })}
        </div>
    </>
};

export default Notes;
