import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editSpot } from '../../store/spotsReducer';
import { useModal } from '../../context/Modal';
import './EditSpot.css';

export default function EditSpotModal({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const spot = useSelector(state => state.spots)

    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);
    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [price, setPrice] = useState(spot.prcie);
    const [lat, setLat] = useState(33.3333);
    const [lng, setLng] = useState(22.2222);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const editedSpot = {
            id: spotId, address, city, state, country, name, description, price, lat, lng,
        }
        await dispatch(editSpot(editedSpot))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    };

    return (
        <div className="edit-spot-container">
            <header className="signup-header">
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
                        className="edit-fields-top"
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="edit-fields"
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="edit-fields"
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="edit-fields"
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="edit-fields"
                        type="text"
                        placeholder="Home Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="edit-fields"
                        type="text"
                        placeholder="Describe your home"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        className="edit-fields-bottom"
                        type="text"
                        placeholder="Set price per night"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
                <button id="edit-button" type="submit">Modify Listing</button>
            </form>
        </div>
    );

};
