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


let initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    };
};

export default reviewReducer;
