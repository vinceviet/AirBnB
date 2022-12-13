import React, { useState , useEffect} from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './CreateSpot.css';

function CreatSpotModal() {
    const dispatch = useDispatch();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    // const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();

    };

    return (
        <div className="create-spot-inputs">
            <h1>Home Information</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <label>
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </label><br />
                <label>
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </label><br />
                <label>
                    <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                </label><br />
                <label>
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </label><br />
                <label>
                    <input
                        type="text"
                        placeholder="Home Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label><br />
                <label>
                    <input
                        type="text"
                        placeholder="Describe your home"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label><br />
                <label>
                    <input
                        type="text"
                        placeholder="Set price per night"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>
                <button id="signup-button" type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default CreateSpotModal;
