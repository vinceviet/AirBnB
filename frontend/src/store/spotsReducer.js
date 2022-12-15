import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/loadSpots';
const SPOT_DETAILS = 'spots/spotDetails';
const CREATE_SPOT = 'spots/createSpot';
const EDIT_SPOT = 'spots/editSpot';
const DELETE_SPOT = 'spots/deleteSpot';

const load = spots => ({
    type: LOAD_SPOTS, spots
});

const details = spot => ({
    type: SPOT_DETAILS, spot
});

const create = newSpot => ({
    type: CREATE_SPOT, newSpot
});

const edit = spot => ({
    type: EDIT_SPOT, spot
});

const deleteSpot = spot => ({
    type: DELETE_SPOT, spot
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
        dispatch(details(spotDetails));
    };
};

export const createSpot = (newSpot, newImg) => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpot)
    });
    if (res.ok) {
        const spot = await res.json();
        dispatch(create(spot));
        // const res = await csrfFetch(`/api/spots/${spot.id}/images`,{
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(newImg)
        // });
        // if(res.ok){
        //     const img = await res.json();
        //     dispatch(create(img));
        //     console.log('createthunkimg', img)
        // }
        console.log('createthunk', spot);
        return spot
    };
};

export const editSpot = (spot) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    });
    if (res.ok) {
        const updatedSpot = await res.json();
        dispatch(edit(updatedSpot));
        return updatedSpot;
    };
};

export const thunkDeleteSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
        const spot = await res.json();
        dispatch(deleteSpot(spot));
    };
};

let initialState = {};

const spotsReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case LOAD_SPOTS:
            newState = {};
            const spotList = [...action.spots];
            spotList.forEach(spot => {
                newState[spot.id] = spot;
            });
            return newState
        case SPOT_DETAILS:
            newState = {};
            newState[action.spot.id] = action.spot;
            return newState;
        case CREATE_SPOT:
            newState[action.newSpot.id] = action.newSpot;
            return newState;
        case EDIT_SPOT:
            newState[action.spot.id] = action.spot;
            return newState;
        case DELETE_SPOT:
            delete newState[action.spot.id];
            return newState;
        default:
            return state;
    };
};

export default spotsReducer;
