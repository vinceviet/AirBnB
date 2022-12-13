import { useParams, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetails } from '../../store/spotsReducer';
import { thunkDeleteSpot } from '../../store/spotsReducer';

const SpotDetails = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots[spotId]);

    useEffect(() => {
        console.log("details useeffect")
        dispatch(getSpotDetails(spotId))
    }, []);

    const deleteSpotHandler = (spotId) => {
        dispatch(thunkDeleteSpot(spotId));
        history.push('/');
    };

    if (!spot) return null;

    return (
        <div>
            <div className="spot-details">
                <h2>{spot.name}</h2>
                <img className="main-img" src={spot.url} alt={spot.url} />
                <span>{`Address: ${spot.address}, ${spot.city}, ${spot.state}, ${spot.country}`}</span>
                <span>{`Desription: ${spot.description}`}</span>
                <span>{`Price: ${spot.price}`}</span>
            </div>
            <div className="buttons">
                <button onClick={() => deleteSpotHandler(spot.id)}>Delete Spot</button>
            </div>
        </div>
    );
};

export default SpotDetails;
