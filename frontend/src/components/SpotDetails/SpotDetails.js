import { useParams, useHistory, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetails } from '../../store/spotsReducer';
import EditSpotModal from '../EditSpotModal';
import { useRef } from 'react';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from '../DeleteSpotModal';

const SpotDetails = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots[spotId]);
    const sessionUser = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    useEffect(() => {
        dispatch(getSpotDetails(spotId))
    }, []);

    if (!spot) return null;

    if (sessionUser.id === spot.ownerId) {
        return (
            <>
                <div className="spot-details">
                    <h2>{spot.name}</h2>
                    <img className="main-img" src={spot.url} alt={spot.url} />
                    <span>{`Address: ${spot.address}, ${spot.city}, ${spot.state}, ${spot.country}`}</span>
                    <span>{`Desription: ${spot.description}`}</span>
                    <span>{`Price: ${spot.price}`}</span>
                </div>
                <div className="delete-edit">
                    <OpenModalMenuItem
                        itemText="Delete Listing"
                        onItemClick={closeMenu}
                        modalComponent={<DeleteSpotModal spot={spot} />}
                    />
                    <OpenModalMenuItem
                        itemText="Modify Home"
                        onItemClick={closeMenu}
                        modalComponent={<EditSpotModal spotId={spotId} />}
                    />
                </div>
            </>
        );
    }
    else return (
        <div className="spot-details">
            <h2>{spot.name}</h2>
            <img className="main-img" src={spot.url} alt={spot.url} />
            <span>{`Address: ${spot.address}, ${spot.city}, ${spot.state}, ${spot.country}`}</span>
            <span>{`Desription: ${spot.description}`}</span>
            <span>{`Price: ${spot.price}`}</span>
        </div>
    );
};

export default SpotDetails;
