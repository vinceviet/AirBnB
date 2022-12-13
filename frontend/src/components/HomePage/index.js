import { NavLink, Route, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spotsReducer';
import { getSpotDetails } from '../../store/spotsReducer';
import './HomePage.css'
import SpotDetails from '../SpotDetails/SpotDetails';

export default function HomePage() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spots = Object.values(useSelector(state => state.spots));

    useEffect(() => {
        dispatch(getAllSpots(spots))
    }, []);

    useEffect(() => {
        dispatch(getSpotDetails(spotId))
    }, [spotId]);

    return (
        <>
            <div className="spots-list">
                {spots.map(spot => {
                    return (
                        <div>
                            <NavLink key={spot.name} className="spot-cards" to={`/api/spots/${spot.id}`}>
                                <img className="item1" src={spot.previewImage} alt={spot.previewImage} />
                                <span className="item2">{`${spot.city}, ${spot.state}`}</span>
                                <span className="item3"><i class="fas fa-sharp fa-solid fa-star" />{spot.avgRating}</span>
                                <span className="item4">{`$${spot.price} night`}</span>
                            </NavLink>
                        </div>
                    )
                })}
            </div>
            <Route path="/api/spots/:spotId">
                <SpotDetails />
            </Route>
        </>
    );
};
