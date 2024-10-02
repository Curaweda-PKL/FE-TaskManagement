import React from "react";

interface DatesPopupProps {
  isDatesPopupOpen: boolean;
  selectedCardList: { title: string };
  handleCloseDatesPopup: () => void;
}

const DatesPopup: React.FC<DatesPopupProps> = ({ isDatesPopupOpen, selectedCardList, handleCloseDatesPopup }) => {
  if (!isDatesPopupOpen || !selectedCardList) return null;

  return (
    <div
      className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100"
      onClick={handleCloseDatesPopup}
    >
      <div
        className="bg-white text-black text-center p-4 rounded-sm shadow-lg w-64 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCloseDatesPopup}
          className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 text-sm"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-2">
          {selectedCardList.title} - Dates
        </h2>
        <div className="flex justify-between items-center mb-2">
          <button className="text-gray-500 text-sm">&lt;</button>
          <span className="text-gray-800 font-semibold text-sm">August 2024</span>
          <button className="text-gray-500 text-sm">&gt;</button>
        </div>
        <div className="grid grid-cols-7 text-center text-gray-600 text-xs mb-2">
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
              className={`py-1 text-xs ${index === 9 ? 'bg-blue-200 text-blue-600' : index === 25 ? 'bg-blue-600 text-white' : 'text-gray-800'
                } rounded-full hover:bg-gray-200`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center mb-2 text-sm">
          <label htmlFor="due-date-checkbox" className="text-xs font-semibold">Due Date</label>
        </div>
        <div className="flex space-x-2 mb-2">
          <input type="date" className="bg-gray-300 border-none p-1 rounded w-full text-xs" />
          <input type="time" className="bg-gray-300 border-none p-1 rounded w-full text-xs" />
        </div>
        <div className="flex flex-col mb-3 text-sm">
          <label htmlFor="reminder" className="mb-1 text-left text-xs font-semibold">Set Due Date Reminder</label>
          <select id="reminder" className="bg-gray-300 border-none p-1 rounded w-full text-xs text-gray-800">
            <option value="1">1 - Day before</option>
          </select>
        </div>
        <div className="flex flex-col mt-2 space-y-2"> {/* Menggunakan flex-col untuk menampilkan secara vertikal */}
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">Save</button>
          <button className="bg-gray-300 hover:bg-gray-500 px-3 py-1 rounded text-sm">Remove</button>
        </div>
      </div>
    </div>
  );
};

export default DatesPopup;
