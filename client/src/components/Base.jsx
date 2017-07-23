import React from 'react';
import PropTypes from 'prop-types'; 
import { Link, IndexLink } from 'react-router';

const Base = ({ children }) => (
  <div>
    <div className="top-bar">
      <div className="top-bar-left">
        <IndexLink to="/">React App</IndexLink>
      </div>

      {localStorage.getItem('token') !== null && (
        <div className="top-bar-right">
          <Link to="/logout">Log out</Link>
        </div>
      )}

    </div>

    {children}

  </div>
);

Base.propTypes = {
  children: PropTypes.object.isRequired
};

export default Base;