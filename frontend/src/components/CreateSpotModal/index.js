import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createSpot } from "../../store/spotsReducer";
import './CreateSpot.css';

export default function CreatSpotModal() {
    const dispatch = useDispatch();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [lat, setLat] = useState(33.3333);
    const [lng, setLng] = useState(22.2222);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newSpot = {
            address, city, state, country, name, description, price, lat, lng, previewImage
        }

        await dispatch(createSpot(newSpot))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    };

    return (
        <div className="create-container">
            <header className="signup-header">
                <button id="cancel-x" onClick={closeModal}>X</button>
                Create a listing
            </header>
            <li className="header-divider"></li>
            <h1>Home Information</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <label>
                    <input
                        className="create-fields-top"
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="create-fields"
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="create-fields"
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="create-fields"
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="create-fields"
                        type="text"
                        placeholder="Home Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="create-fields"
                        type="text"
                        placeholder="Describe your home"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="create-fields"
                        type="text"
                        placeholder="Set price per night"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="create-fields-bottom"
                        type="url"
                        placeholder="Preview Image URL"
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                        required
                    />
                </label>
                <button id="create-button" type="submit">Create listing</button>
            </form>
        </div>
    );
};
