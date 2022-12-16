import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviewsReducer';

export default function DeleteReviewModal({ reviews, user, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const review = reviews.find(review => review.userId === user.id);

    const deleteReviewHandler = async (review) => {
        await dispatch(deleteReview(review)).then(closeModal);
    };

    return (
        <div className="delete-container">
            <h1>Are you sure you want to delete your review?</h1>
            <div className="button-container">
                <button id="delete-button" onClick={() => deleteReviewHandler(review.id)}>Delete Review</button>
                <button id="cancel-button" onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
};
