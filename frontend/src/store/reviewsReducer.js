import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/loadReviews';
const ADD_REVIEW = 'reviews/addReviews';
const DELETE_REVIEW = 'reviews/deleteReviews';

const load = reviews => ({
    type: LOAD_REVIEWS, reviews
});

const add = (review) => ({
    type: ADD_REVIEW, review
});

const remove = (review, reviewId) => ({
    type: DELETE_REVIEW, review, reviewId
});

export const getReviews = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (res.ok) {
        const reviews = await res.json();
        dispatch(load(reviews));
    };
};

export const createReview = (spotId, user, review) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    });
    if (res.ok) {
        const review = await res.json();
        review.spotId = spotId;
        review.User = user;
        dispatch(add(review))
        return review;
    };
};

export const deleteReview = (reviewId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
        const review = await res.json();
        dispatch(remove(review, reviewId));
    };
};

let initialState = {};

const reviewReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case LOAD_REVIEWS:
            newState = {};
            const reviewList = action.reviews.Reviews;
            reviewList.forEach(review => {
                newState[review.id] = review;
            });
            return newState;
        case ADD_REVIEW:
            newState[action.review.id] = action.review;
            return newState;
        case DELETE_REVIEW:
            delete newState[action.reviewId];
            return newState;
        default:
            return state;
    };
};

export default reviewReducer;
