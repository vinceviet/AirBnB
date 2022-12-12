import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spotsReducer';
import './HomePage.css'

export default function HomePage() {
    const dispatch = useDispatch();
    const spots = Object.values(useSelector(state => state.spots));
    console.log('homepage', spots);
    useEffect(() =>{
        dispatch(getAllSpots(spots))
    }, []);
    return (
        <div className="spots-list">
        {spots.map(spot => {
            return (
        <div>
            <NavLink to={`/api/spots/${spot.id}`}>
            <span>{spot.city}{spot.state}</span>
            <img src={spot.previewImage} alt="spot1-image" />
            <span>{spot.avgRating}</span>
            <span>{`$${spot.price}/night`}</span>
            </NavLink>
        </div>
)})}
        </div>
    );
};
