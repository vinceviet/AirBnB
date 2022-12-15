import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';


const Reviews = () => {
    const dispatch = useDispatch();
    const {spotId} = useParams();
    

    return (
        <h6>test</h6>
    );
};

export default Reviews;
