
const LOAD_SPOTS = 'spots/loadSpots';

const load = spots => ({
    type: LOAD_SPOTS, spots
});

export const getAllSpots = () => async dispatch => {
    const res = await fetch('/api/spots');
    if (res.ok) {
        const spots = await res.json();
        console.log('fetch', spots.Spots)
        dispatch(load(spots.Spots));
    };
};

const spotsReducer = (state = {}, action) => {
    let newState = { ...state }
    switch (action.type) {
        case LOAD_SPOTS:
            newState = action.spots
            return newState
        default:
            return state
    };
};

export default spotsReducer;
