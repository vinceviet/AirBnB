import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeleteSpot } from '../../store/spotsReducer';
import { useModal } from '../../context/Modal';
import './DeleteSpot.css';

export default function DeleteSpotModal() {
return (
    <div>

    <h1>Are you sure you want to delete:</h1>

    <button onClick={() => deleteSpotHandler(spot.id)}>Delete Spot</button>
    </div>
)
};
