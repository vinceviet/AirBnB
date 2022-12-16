import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReview } from "../../store/reviewsReducer";
import "./CreateReview.css";

export default function CreateReviewModal({ spotId, user }) {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(1);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = { review, stars }

        await dispatch(createReview(spotId,user, newReview))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    };

    return (
        <div className="create-review-container">
            <header className="create-review-header">
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
                        className="review-fields-top"
                        type="text"
                        placeholder="Review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </label>
                <label> Rate your stay
                    <input
                        className="review-fields-bottom"
                        type="number"
                        min="1"
                        max="5"
                        value={stars}
                        onChange={(e) => setStars(e.target.value)}
                        required
                    />
                </label>
                <button id="create-review-button" type="submit">Create Review</button>
            </form>
        </div>
    );
};
