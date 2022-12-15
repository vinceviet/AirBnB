import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/loadReviews';
const ADD_REVIEW = 'reviews/addReviews';
const DELETE_REVIEW = 'reviews/deleteReviews';

const load = reviews => ({
    type: LOAD_REVIEWS, reviews
});

const add = review => ({
    type: ADD_REVIEW, review
});

const remove = review => ({
    type: DELETE_REVIEW, review
});

export const getReviews = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (res.ok) {
        const reviews = await res.json();
        dispatch(load(reviews));
    };
};


let initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS:
            let newState = {};
            const reviewList = [...action.reviews];
            reviewList.forEach(review => {
                newState[review.id] = review;
            });
            return newState;
        default:
            return state;
    };
};

export default reviewReducer;
