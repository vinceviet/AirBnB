
const LOAD_SPOTS = 'spots/loadSpots';

const load = spots => ({
    type: LOAD_SPOTS, spots
});

export const getAllSpots = () => async dispatch => {
    const res = await fetch('/api/spots');
    if (res.ok) {
        const spots = await res.json();
        dispatch(load(spots));
    };
};

const spotsReducer = (state, action) => {
    switch (action.type) {
        default:
            return state
    };
};

export default spotsReducer;
