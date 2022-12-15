import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetails } from '../../store/spotsReducer';
import EditSpotModal from '../EditSpotModal';
import { useRef } from 'react';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from '../DeleteSpotModal';
import './SpotDetails.css';

const SpotDetails = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots[spotId]);
    const sessionUser = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    console.log(spot);

    let url;
    if (!spot) url = null
    else url = spot.SpotImages[0].url

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
    if (sessionUser && sessionUser.id === spot.ownerId) {
        return (
            <>
                <div className="spot-details">
                    <h2 id="name">{spot.name}</h2>
                    <p className="spot-info">
                        <span><i className="fas fa-sharp fa-solid fa-star fa-xs" /> {spot.avgStarRating} &middot;</span>
                        <span>{spot.numReviews} Reviews &middot;</span>
                        <span>{`${spot.city}, ${spot.state}, ${spot.country}`}</span>
                    </p>
                    <img className="main-img" src={url} alt={url} />
                    <div className="sub-images">
                        <img className="sub-img1" src="https://a0.muscache.com/im/pictures/a738ad73-642e-47a9-b1c1-9cf7e12fa39c.jpg?im_w=720" alt="img" />
                        <img className="sub-img2" src="https://a0.muscache.com/im/pictures/62b1d46f-3630-49aa-8888-4ffcdf592a03.jpg?im_w=720" alt="img" />
                        <img className="sub-img3" src="https://a0.muscache.com/im/pictures/cdc4da03-11db-4d4c-8c29-232b6b8d3311.jpg?im_w=720" alt="img" />
                        <img className="sub-img4" src="https://a0.muscache.com/im/pictures/b7c661f3-1b24-4725-808b-ec3d9031a078.jpg?im_w=720" alt="img" />
                    </div>
                    <div className="descripton">
                        <h3>Entire Spot hosted by {spot.Owner.firstName}</h3>
                        <p id="beds">4 guests &middot; 2 bedrooms &middot; 3 beds &middot; 2 bath</p>
                        <li className="header-divider"></li>
                        <p id="descript">{`${spot.description}`}</p>
                    </div>
                    <tb className="price">
                        <span>{`$${spot.price}`}</span><span id="night">night</span>
                    </tb>
                </div>
                <div className="delete-edit">
                    <div className="delete-edit-button">
                        <OpenModalMenuItem
                            itemText="Modify Listing"
                            onItemClick={closeMenu}
                            modalComponent={<EditSpotModal spotId={spotId} />}
                        />
                    </div>
                    <div className="delete-edit-button">
                        <OpenModalMenuItem
                            itemText="Delete Listing"
                            onItemClick={closeMenu}
                            modalComponent={<DeleteSpotModal spot={spot} />}
                        />
                    </div>
                </div>
            </>
        );
    }
    else return (
        <div className="spot-details">
            <h2 id="name">{spot.name}</h2>
            <p className="spot-info">
                <span><i className="fas fa-sharp fa-solid fa-star fa-xs" /> {spot.avgStarRating} &middot;</span>
                <span>{spot.numReviews} Reviews &middot;</span>
                <span>{`${spot.city}, ${spot.state}, ${spot.country}`}</span>
            </p>
            <img className="main-img" src={url} alt={url} />
            <div className="sub-images">
                <img className="sub-img1" src="https://a0.muscache.com/im/pictures/a738ad73-642e-47a9-b1c1-9cf7e12fa39c.jpg?im_w=720" alt="img" />
                <img className="sub-img2" src="https://a0.muscache.com/im/pictures/62b1d46f-3630-49aa-8888-4ffcdf592a03.jpg?im_w=720" alt="img" />
                <img className="sub-img3" src="https://a0.muscache.com/im/pictures/cdc4da03-11db-4d4c-8c29-232b6b8d3311.jpg?im_w=720" alt="img" />
                <img className="sub-img4" src="https://a0.muscache.com/im/pictures/b7c661f3-1b24-4725-808b-ec3d9031a078.jpg?im_w=720" alt="img" />
            </div>
            <div className="descripton">
                <h3>Entire Spot hosted by {spot.Owner.firstName}</h3>
                <p id="beds">4 guests &middot; 2 bedrooms &middot; 3 beds &middot; 2 bath</p>
                <li className="header-divider"></li>
                <p id="descript">{`${spot.description}`}</p>
            </div>
            <tb className="price">
                <span>{`$${spot.price}`}</span><span id="night">night</span>
            </tb>
        </div>
    );
};

export default SpotDetails;
