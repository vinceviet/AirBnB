// import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SpotDetails = () => {
    const { spotId } = useParams;
    const spot = useSelector(state => state.spots[spotId]);
    console.log('spotdetail', spot);

    return (
        <div className="spot-details">
            <h2>{spot.name}</h2>
            <img src={spot.previewImage} alt={spot.previewImage} />
            <span>{`Address: ${spot.address}, ${spot.city}, ${spot.state}, ${spot.country}`}</span>
            <span>{`Desription: ${spot.description}`}</span>
            <span>{`Price: ${spot.price}`}</span>
        </div>
    );
};

export default SpotDetails;
