import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import DemoUser from "../DemoUser";
import CreatSpotModal from "../CreateSpotModal";
import './Navigation.css';
import barsIcon from "../../assets/bars-solid.svg";
import userIcon from "../../assets/circle-user-solid.svg";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button id="menu-items" onClick={openMenu}>
        <img id="bars-icon" src={barsIcon} alt="fa-bars" />
        <img id="user-icon" src={userIcon} alt="user-icon" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li id="username">{user.username}</li>
            <li id="fullname">{user.firstName} {user.lastName}</li>
            <li id="email">{user.email}</li>
            <li className="dropdown-divider"></li>
            <div id="create-current-user">
              <OpenModalMenuItem
                itemText="Host your home"
                onItemClick={closeMenu}
                modalComponent={<CreatSpotModal />}
              />
            </div>
            <li>
              <button id="profile-logout" onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <div className="login-signup-container">
            <div id="login">
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>
            <div id="signup">
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </div>
            <li className="dropdown-divider"></li>
            <div id="demo-user">
              <OpenModalMenuItem
                itemText="Demo User"
                onItemClick={closeMenu}
                modalComponent={<DemoUser />}
              />
            </div>
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
