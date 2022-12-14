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
    const [lat, setLat] = useState(33.3333);
    const [lng, setLng] = useState(22.2222);
    // const [previewImage, setPreviewImage] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:https://icons8.com/icon/tNcJ7GGjHsUq/house&usqp=CAU");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newSpot = {
            address, city, state, country, name, description, price, lat, lng
        }

        await dispatch(createSpot(newSpot))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
            console.log('newSpot', newSpot)
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
                <button type="submit">Create listing</button>
            </form>
        </div>
    );
};
