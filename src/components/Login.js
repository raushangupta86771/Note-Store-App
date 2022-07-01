import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        const json = await response.json();
        console.log(json.authToken);
        if (json.success) {
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged in successfully", "success");
            console.log("logged in..")
            history.push("/"); //redirecting to "/" endpoint
        }
        else {
            props.showAlert("Invalid Credentials", "danger");
        }
    }

    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return <>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="emaill" aria-describedby="emailHelp" placeholder="Enter email" name='email' value={credentials.email} onChange={onchange} />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="passwordl" className="form-control" id="email" name='password' placeholder="Password" value={credentials.password} onChange={onchange} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </>;
};

export default Login;
