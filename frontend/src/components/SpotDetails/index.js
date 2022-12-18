import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetails } from '../../store/spotsReducer';
import EditSpotModal from '../EditSpotModal';
import { useRef } from 'react';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from '../DeleteSpotModal';
import Reviews from '../Reviews';
import CreateReviewModal from '../CreateReviewModal';
import './SpotDetails.css';
import DeleteReviewModal from '../DeleteReviewModal';

const SpotDetails = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots[spotId]);
    const reviews = Object.values(useSelector(state => state.reviews));
    const sessionUser = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    let url;
    if (!spot) url = null
    else if (!spot.SpotImages) url = null
    else url = spot.SpotImages[0].url

    let firstName;
    if (!spot) firstName = null;
    else if (!spot.Owner) firstName = null;
    else firstName = spot.Owner.firstName;

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

    return (
        <div className="spot-details-container">
            <div className="details-header-container">
                <h2 id="name">{spot.name}</h2>
                <p id="spot-info">
                    <span><i className="fas fa-sharp fa-solid fa-star fa-xs" /> {Number(spot.avgStarRating).toFixed(1)} &middot;</span>
                    <span>{spot.numReviews} Reviews &middot;</span>
                    <span>{`${spot.city}, ${spot.state}, ${spot.country}`}</span>
                </p>
            </div>
            <div className="img-container">
                <img id="main-img" src={url} alt={url} />
                <div className="sub-images">
                    <img className="sub-img1" src="https://a0.muscache.com/im/pictures/a738ad73-642e-47a9-b1c1-9cf7e12fa39c.jpg?im_w=720" alt="img" />
                    <img className="sub-img2" src="https://a0.muscache.com/im/pictures/62b1d46f-3630-49aa-8888-4ffcdf592a03.jpg?im_w=720" alt="img" />
                    <img className="sub-img3" src="https://a0.muscache.com/im/pictures/cdc4da03-11db-4d4c-8c29-232b6b8d3311.jpg?im_w=720" alt="img" />
                    <img className="sub-img4" src="https://a0.muscache.com/im/pictures/b7c661f3-1b24-4725-808b-ec3d9031a078.jpg?im_w=720" alt="img" />
                </div>
            </div>
            <div className="description-and-buttons-container">
                <div className="description-container">
                    <h3>Entire Spot hosted by {firstName}</h3>
                    <p id="beds">4 guests &middot; 2 bedrooms &middot; 3 beds &middot; 2 bath</p>
                    <p id="descript">{`${spot.description}`}</p>
                    <li id="divider"></li>
                </div>
                <div className="price-and-buttons-container">
                    <div className='review-info-container'>
                        <span id="price">{`$${spot.price}`}</span><span id="night">night</span>
                        <div className="review-inbox">
                            <span><i className="fas fa-sharp fa-solid fa-star fa-xs" /> {Number(spot.avgStarRating).toFixed(1)} &middot;</span>
                            <span> {`${spot.numReviews} Reviews`}</span>
                        </div>
                    </div>
                    {sessionUser && sessionUser.id === spot.ownerId && (
                        <div className="owner-buttons">
                            <div className="detail-page-buttons">
                                <OpenModalMenuItem
                                    itemText="Modify Listing"
                                    onItemClick={closeMenu}
                                    modalComponent={<EditSpotModal spotId={spotId} user={sessionUser} />}
                                />
                            </div>
                            <div className="detail-page-buttons">
                                <OpenModalMenuItem
                                    itemText="Delete Listing"
                                    onItemClick={closeMenu}
                                    modalComponent={<DeleteSpotModal spot={spot} />}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="reviews">
                <Reviews spotId={spotId} spot={spot} />
            </div>
            <div className="review-buttons">
                {sessionUser && sessionUser.id !== spot.ownerId && (
                    <>
                        <div className="detail-page-buttons">
                            <OpenModalMenuItem
                                itemText="Create a Review"
                                onItemClick={closeMenu}
                                modalComponent={<CreateReviewModal spotId={spotId} user={sessionUser} />}
                            />
                        </div>
                        {sessionUser && reviews.find(review => sessionUser.id === review.userId) && (
                            <div className="detail-page-buttons">
                                <OpenModalMenuItem
                                    itemText="Delete Review"
                                    onItemClick={closeMenu}
                                    modalComponent={<DeleteReviewModal reviews={reviews} user={sessionUser} spotId={spotId} />}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SpotDetails;
