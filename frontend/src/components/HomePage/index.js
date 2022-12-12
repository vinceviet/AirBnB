// import { NavLink } from 'react-router-dom';
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
        <>
        {spots.map(spot => {
            return (
        <div>
            {spot.previewImage}
        </div>
)})}
        </>
    );
};
