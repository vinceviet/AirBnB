import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './EditSpot.css';

export default function EditSpotModal() {
    const {spotId} = useParams();
    const spot = useSelector(state=> state.spots[spotId]);

    return(
        <></>
    );
};
