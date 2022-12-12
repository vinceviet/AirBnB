
const LOAD_SPOTS = 'spots/loadSpots';

const load = spots => ({
    type: LOAD_SPOTS, spots
});

export const getAllSpots = () => async disptach => {
    const res = await fetch('/api/spots');
    if (res.ok) {
        const spots = await res.json();
        dispatc(load(spots));
    };
};

const spotsReducer = (state, action) => {
    switch (action.type) {
        default:
            return state
    };
};

export default spotsReducer;
