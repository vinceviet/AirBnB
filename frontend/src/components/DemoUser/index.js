import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DemoUser.css";

function DemoUser() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("Demomon");
    const [password, setPassword] = useState("demomon");
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(sessionActions.login({ credential, password })).then(closeModal);
        setCredential("");
        setPassword("");
        return
    };

    return (
        <div className="demo-container">
            <h1>Demo User Login</h1>
            <form onSubmit={handleSubmit}>
                <button id="demo-button" type="submit">Log In</button>
            </form>
        </div>
    );
}

export default DemoUser;
