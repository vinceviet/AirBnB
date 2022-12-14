import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spotsReducer';
import './HomePage.css';

export default function HomePage() {
    const dispatch = useDispatch();
    const spots = Object.values(useSelector(state => state.spots));
    useEffect(() => {
        dispatch(getAllSpots(spots));
    }, []);

    return (
            <div className="spots-list">
                {spots.map(spot => {
                    return (
                        <div>
                            <NavLink key={spot.name} className="spot-cards" to={`/spots/${spot.id}`}>
                                <img className="item1" src={spot.previewImage} alt={spot.previewImage} />
                                <span className="item2">{`${spot.city}, ${spot.state}`}</span>
                                <span className="item3"><i className="fas fa-sharp fa-solid fa-star fa-xs" /> {spot.avgRating}</span>
                                <span className="item4">{`$${spot.price} night`}</span>
                            </NavLink>
                        </div>
                    )
                })}
            </div>
    );
};
