
const LOAD_SPOTS = 'spots/loadSpots';
const SPOT_DETAILS = 'spots/spotDetails';

const load = spots => ({
    type: LOAD_SPOTS, spots
});

const details = spot => ({
    type: SPOT_DETAILS, spot
})

export const getAllSpots = () => async dispatch => {
    const res = await fetch('/api/spots');
    if (res.ok) {
        const spots = await res.json();
        dispatch(load(spots.Spots));
    };
};

export const getSpotDetails = (spotId) => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}`);
    if (res.ok) {
        const spotDetails = await res.json();
        console.log('fetch', spotDetails);
        dispatch(details(spotDetails));
    };
};

const spotsReducer = (state = {}, action) => {
    let newState = { ...state }
    switch (action.type) {
        case LOAD_SPOTS:
            // newState = action.spots;
            return {...state, ...action.spots}
        case SPOT_DETAILS:
            console.log('action spot Id', action.spot.id)
            newState = action.spot;
            return newState;
        default:
            return state;
    };
};

export default spotsReducer;
