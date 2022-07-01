import React, { useContext, useEffect } from 'react';
import noteContext from '../context/notes/noteContext';
import { useHistory } from 'react-router-dom';

const About = () => {
    const context = useContext(noteContext);
    const { getUser,user } = context;
    let history = useHistory();

    // const a = useContext(noteContext);
    // useEffect(() => {
    //     a.update();
    //     // eslint-disable-next-line
    // }, []);
    useEffect(() => { //for showing all the notes. which we fetched from mongoDb
        if (localStorage.getItem('token')) {
            getUser();
        }
        else {
            history.push("/login");
        }
        // eslint-disable-next-line
    }, []);

    return <div>
        {/* <h1>This is about {a.state.name} and his age is {a.state.age}</h1> */}
        {/* "a.state.name" is using to fetch updated api object value */}

        <h1>Email : {user.email}</h1>
        <h1>Name : {user.name}</h1>
    </div>;
};


export default About;