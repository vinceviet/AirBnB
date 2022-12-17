import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReview } from "../../store/reviewsReducer";
import "../../context/Forms.css";

export default function CreateReviewModal({ spot, user }) {
    const dispatch = useDispatch();
    // const { id, avgStarRatin, numReviews } = spot
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    // const [avgStarRating, setAvgStarRating] = useState(spot.avgStarRating);
    // const [numReviews, setNumReviews] = useState(spot.numReviews);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = { review, stars }

        await dispatch(createReview(spot.id, user, newReview))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                const validationErrors = [];
                if (data && data.errors) setErrors(data.errors);
                if (data && data.message) {
                    validationErrors.push(data.message);
                    setErrors(validationErrors);
                };
            });

    };

    return (
        <div className="login-container">
            <header className="header">
                <button id="cancel-x" onClick={closeModal}>X</button>
                Create a Review
            </header>
            <li className="header-divider"></li>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <label>
                    <input
                        className="fields-top"
                        type="text"
                        placeholder="Review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="fields-bottom"
                        type="number"
                        placeholder="Rate your stay"
                        min="1"
                        max="5"
                        value={stars}
                        onChange={(e) => setStars(e.target.value)}
                        required
                    />
                </label>
                <button className="field-buttons" type="submit">Create Review</button>
            </form>
        </div>
    );
};
