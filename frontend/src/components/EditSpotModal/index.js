import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editSpot } from '../../store/spotsReducer';
import { useModal } from '../../context/Modal';
import "../../context/Forms.css";

export default function EditSpotModal({ spotId, sessionUser }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const spot = useSelector(state => state.spots[spotId])

    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);
    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [price, setPrice] = useState(spot.price);
    const [SpotImages, setSpotImages] = useState(spot.SpotImages)
    const [lat, setLat] = useState(33.3333);
    const [lng, setLng] = useState(22.2222);
    const [Owner, setOwner] = useState(spot.Owner);
    const [starRating, setStarRating] = useState(spot.avgStarRating);
    const [numReviews, setNumReviews] = useState(spot.numReviews);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const editedSpot = {
            id: spotId, address, city, state, country, name, description, price,
            lat, lng, Owner, SpotImages, starRating, numReviews
        }
        await dispatch(editSpot(editedSpot))
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
                Modify Listing
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
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="fields"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="fields-bottom"
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
                <button className="field-buttons" type="submit">Modify Listing</button>
            </form>
        </div>
    );

};
