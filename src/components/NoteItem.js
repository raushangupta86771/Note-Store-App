import { React, useContext } from 'react';
import noteContext from "../context/notes/noteContext"

const NoteItem = (props) => {
    const context = useContext(noteContext); //for using imported note context
    const { deleteNote } = context;
    const { note, updateNote } = props; //distructuring from Notes.js from which we got note api as props
    return (
        <>
            <div className='col-md-3'>
                <div className="card my-3">
                    <div className="card-body">
                        <h5 className="card-title">{note.title}</h5>
                        <p className="card-text">{note.description}</p>
                        <i className="fas fa-trash-alt mx-2" onClick={() => { deleteNote(note._id) }}></i>
                        {/* //sending id in deleteNote function of noteState.js */}
                        <i className="fas fa-edit mx-2" onClick={() => updateNote(note)}></i>
                    </div>
                </div>
            </div>
        </>
    )
};

export default NoteItem;
