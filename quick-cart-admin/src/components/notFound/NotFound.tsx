import React from 'react';
import './notFound.scss';

const NotFound: React.FC = () => {
  return (
    <div className="notFoundContainer">
      <h1 className="notFoundTitle">404 - Page Not Found</h1>
      <p className="notFoundText">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
