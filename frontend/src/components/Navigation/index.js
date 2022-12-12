import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from "../../assets/onebnb-logo.png"
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="nav-links">
      <div>
        <NavLink id="home-link" exact to="/">
          <img id="home-logo" src={logo} alt="onebnb logo" />
           onebnb</NavLink>
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
