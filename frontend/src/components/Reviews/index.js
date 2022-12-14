import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReviews } from '../../store/reviewsReducer';
import '../SpotDetails/SpotDetails.css';


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
        <div className="review-header">
            <h2><i className="fas fa-sharp fa-solid fa-star fa-xs" /> {Number(avgStarRating).toFixed(1)} &middot; {numReviews} reviews</h2>
        </div>
            <div className="reviews-container">
                {reviews.map(review => {
                    return (
                        <div className="review-card">
                            <span>{review.User.firstName}</span><span id="rating"><i className="fas fa-sharp fa-solid fa-star fa-xs fa-align" /> {review.stars}</span><br />
                            <span id="date">{formatDate(review.createdAt)}</span>
                            <p id="review-body">{review.review}</p>
                        </div>
                    )
                })}
            </div>
        </>
    );
};

export default Reviews;
