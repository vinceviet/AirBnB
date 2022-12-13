import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/loadSpots';
const SPOT_DETAILS = 'spots/spotDetails';
const CREATE_SPOT = 'spots/createSpot';

const load = spots => ({
    type: LOAD_SPOTS, spots
});

const details = spot => ({
    type: SPOT_DETAILS, spot
});

const create = newSpot => ({
    type: CREATE_SPOT, newSpot
});

export const getAllSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots');
    if (res.ok) {
        const spots = await res.json();
        dispatch(load(spots.Spots));
    };
};

export const getSpotDetails = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    if (res.ok) {
        const spotDetails = await res.json();
        console.log('fetch', spotDetails);
        dispatch(details(spotDetails));
    };
};

export const createSpot = (newSpot) => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpot)
    });
    if (res.ok) {
        const spot = await res.json();
        dispatch(create(spot));
        return spot
    };
};

let initialState = {};

const spotsReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case LOAD_SPOTS:
            const spotList = [...action.spots];
            spotList.forEach(spot => {
                newState[spot.id] = spot;
            });
            return newState
        case SPOT_DETAILS:
            newState[action.spot.id] = action.spot;
            return newState;
        case CREATE_SPOT:
            newState[action.newSpot.id] = action.newSpot;
            return newState;
        default:
            return state;
    };
};

export default spotsReducer;
