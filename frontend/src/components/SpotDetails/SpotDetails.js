import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetails } from '../../store/spotsReducer';

const SpotDetails = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots[spotId - 1]);

    useEffect(() => {
        console.log("details useeffect")
        dispatch(getSpotDetails(spot))
    }, [spot]);

    return (
        <div className="spot-details">
            <h2>{spot.name}</h2>
            <img className="main-img" src={spot.previewImage} alt={spot.previewImage} />
            <span>{`Address: ${spot.address}, ${spot.city}, ${spot.state}, ${spot.country}`}</span>
            <span>{`Desription: ${spot.description}`}</span>
            <span>{`Price: ${spot.price}`}</span>
        </div>
    );
};

export default SpotDetails;
