import React from 'react';

const SharePopup = ({ isSharePopupOpen }) => {
  if (!isSharePopupOpen) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
      <i className="fas fa-copy mr-2"></i>Link copied to clipboard!
    </div>
  );
};

export default SharePopup;
