import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReviews } from '../../store/reviewsReducer';
import './Reviews.css';


const Reviews = ({ spotId, spot }) => {
    const dispatch = useDispatch();
    const reviews = Object.values(useSelector(state => state.reviews));
    const { numReviews, avgStarRating } = spot;

    function formatDate(newDate) {
        const months = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December',
        }
        const d = newDate.split("-")
        const monthName = months[d[1]]
        const formatted = `${monthName} ${d[0]}`
        return formatted.toString()
    }

    useEffect(() => {
        dispatch(getReviews(spotId));
    }, []);

    if (!reviews) return null;

    return (
        <>
            <h2 id="review-top"><i className="fas fa-sharp fa-solid fa-star fa-xs" />{avgStarRating} &middot; {numReviews} reviews</h2>
            <div className="reviews-container">
                {reviews.map(review => {
                    return (
                        <div className="review-card">
                            <div className="review-header">
                                <span>{review.User.firstName}</span><br />
                                <span id="date">{formatDate(review.createdAt)}</span>
                            </div>
                            <p id="review-body">{review.review}</p>
                        </div>
                    )
                })}
            </div>
        </>
    );
};

export default Reviews;
