import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Signup = (props) => {

  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    const response = await fetch('http://localhost:5000/api/auth/createUser', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password }),
    });
    const json = await response.json();
    console.log(json);
    localStorage.setItem('token', json.authToken);
    history.push("/"); //redirecting to "/" endpoint
    props.showAlert("Created account successfully","success");
  }

  const onchange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return <>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={onchange} name='name' />
      </div>
      <div className="mb-3">
        <label htmlFor="emaill" className="form-label">Email address</label>
        <input type="email" className="form-control" id="emaill" aria-describedby="emailHelp" onChange={onchange} name='email' />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" className="form-control" id="password" onChange={onchange} name='password' minLength={5} required/>
      </div>
      <div className="mb-3">
        <label htmlFor="cpassword" className="form-label">Confirm Password</label>
        <input type="password" className="form-control" id="cpassword" onChange={onchange} name='cpassword' minLength={5} required/>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  </>;
};

export default Signup;
