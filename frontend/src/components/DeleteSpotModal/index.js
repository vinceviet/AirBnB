import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { thunkDeleteSpot } from '../../store/spotsReducer';
import { useModal } from '../../context/Modal';
import "../../context/DeleteModal.css";

export default function DeleteSpotModal({ spot }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    const deleteSpotHandler = async (spotId) => {
        await dispatch(thunkDeleteSpot(spotId)).then(closeModal);
        history.push('/');
    };
    return (
        <div className="delete-container">
            <h1>Are you sure you want to delete: {spot.name}</h1>
            <div className="button-container">
                <button id="delete-button" onClick={() => deleteSpotHandler(spot.id)}>Delete Spot</button>
                <button id="cancel-button" onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
};
