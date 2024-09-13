import React from 'react';

const DatesPopup = ({ isDatesPopupOpen, selectedCardList, handleCloseDatesPopup }) => {
  if (!isDatesPopupOpen || !selectedCardList) return null;

  return (
    <div
      className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100"
      onClick={handleCloseDatesPopup}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-80 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCloseDatesPopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">
          {selectedCardList.title} - Dates
        </h2>
        <div className="flex justify-between items-center mb-4">
          <button className="text-gray-500">&lt;</button>
          <span className="text-gray-800 font-semibold">August 2024</span>
          <button className="text-gray-500">&gt;</button>
        </div>
        <div className="grid grid-cols-7 text-center text-gray-600 mb-4">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>

          {Array.from({ length: 31 }, (_, index) => (
            <button
              key={index}
              className={`py-2 ${index === 9 ? 'bg-blue-200 text-blue-600' : index === 25 ? 'bg-blue-600 text-white' : 'text-gray-800'
                } rounded-full hover:bg-gray-200`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center mb-4">
          <input type="checkbox" id="due-date-checkbox" className="mr-2" />
          <label htmlFor="due-date-checkbox" className="text-gray-700">Due Date</label>
        </div>
        <div className="flex space-x-2 mb-4">
          <input type="date" className="border border-gray-300 p-2 rounded w-full" placeholder="MM/DD/YYYY" />
          <input type="time" className="border border-gray-300 p-2 rounded w-full" />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="reminder" className="text-gray-700 mb-2">Set Due Date Reminder</label>
          <select id="reminder" className="border border-gray-300 p-2 rounded w-full text-gray-800">
            <option value="1">1 - Day before</option>
            {/* Additional options can be added here */}
          </select>
        </div>
        <div className="flex justify-between mt-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Save</button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Remove</button>
        </div>
      </div>
    </div>
  );
};

export default DatesPopup;
