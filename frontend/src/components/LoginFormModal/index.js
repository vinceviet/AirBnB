import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
// import SignupFormModal from "../SignupFormModal";
import "../../context/Forms.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          const validationErrors = [];
          if (data && data.message) {
            validationErrors.push(data.message)
            setErrors(validationErrors)
          }
          else if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  // const handleNewUserClick = () =>{
  //   closeModal.then(setModalContent(<SignupFormModal />))
  // }

  return (
    <div className="login-container">
      <header className="header">
        <button id="cancel-x" onClick={closeModal}>X</button>
        Log In
      </header>
      <li className="header-divider"></li>
      <h2>Welcome to Onebnb</h2>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          <input
            className="fields-top"
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="fields-bottom"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="field-buttons" type="submit">Continue</button>
      </form>
      {/* <span className="new-user-redirect">
          New User? <button id="new-user-redirect-button" onClick={handleNewUserClick}>Sign Up</button>
        </span> */}
    </div>
  );
}

export default LoginFormModal;
