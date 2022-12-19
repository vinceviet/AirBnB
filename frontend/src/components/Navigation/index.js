import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import logo from "../../assets/onebnb-logo.png"
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const location = useLocation();

  let active = false;
  if(location.pathname === '/' || location.pathname === '/spots') active = true;

  return (
    <div className={active ? "nav-links" : "spot-details-nav-links"}>
      <div>
        <NavLink exact to="/">
          <img id="home-logo" src={logo} alt="onebnb logo" />
        </NavLink>
      </div>
      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>

  );
}

export default Navigation;
