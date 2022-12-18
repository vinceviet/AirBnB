import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { createSpot } from "../../store/spotsReducer";
import "../../context/Forms.css";

export default function CreatSpotModal() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [url, setUrl] = useState("");
    // const [url, setUrl] = useState("https://a0.muscache.com/im/pictures/miso/Hosting-54377075/original/7522445e-f002-44d0-805a-46a0ce1af323.jpeg?im_w=720");
    const [lat, setLat] = useState(33.3333);
    const [lng, setLng] = useState(22.2222);
    const [avgStarRating, setAvgStarRating] = useState(0);
    const [numReviews, setNumReviews] = useState(0);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newSpot = {
            address, city, state, country, name, description, price, lat, lng,
        }
        const newImg = { url, preview: true };
        const reviewInfo = { avgStarRating, numReviews }

        await dispatch(createSpot(newSpot, newImg, reviewInfo, history))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    };

    return (
        <div className="container">
            <header className="header">
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
                        className="fields-top"
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="text"
                        placeholder="Home Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="text"
                        placeholder="Describe your home"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="number"
                        placeholder="Set price per night: must be a number greater then 1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="fields-bottom"
                        type="url"
                        placeholder="Preview Image URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </label>
                <button className="field-buttons" type="submit">Create listing</button>
            </form>
        </div>
    );
};
