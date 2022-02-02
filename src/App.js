import React, { useState } from 'react';
import validator from 'validator';
import './App.css';

function App() {
  const [signupInput, setSignupInput] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setSignupInput({
      ...signupInput,
      [event.target.name]: event.target.value
    })
  }

  const handleClick = (event) => {
    event.preventDefault();
    if(!validator.isEmail(signupInput.email)){
      setError(`The email you input is invalid`);
    }else if(signupInput.password.length < 5){
      setError(`The password you entered should contain at least 5 characters`);
    }else if(signupInput.password !== signupInput.confirmPassword){
      setError(`The password you entered should match the previous one`);
    }
  } 

  return (
    <div className="container my-5">
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            value={signupInput.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input type="password" className="form-control" name="password" id="password" value={signupInput.password}
            onChange={handleChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="confirm-password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            id="confirm-password"
            value={signupInput.confirmPassword}
            onChange={handleChange}
          />
        </div>
        {error && <p className='text-danger'>{error}</p>}
        <button type="submit" className="btn btn-primary" onClick={handleClick}>Submit</button>
      </form>
    </div>
  );
}

export default App;
