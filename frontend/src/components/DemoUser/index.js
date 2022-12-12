import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

function DemoUser() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("Mugiwara");
    const [password, setPassword] = useState("nakama4life");
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(sessionActions.login({ credential, password })).then(closeModal);
        setCredential("");
        setPassword("");
        return
    };

    return (
        <div id="login-inputs">
            <h1>Demo User Login</h1>
            <form onSubmit={handleSubmit}>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default DemoUser;
