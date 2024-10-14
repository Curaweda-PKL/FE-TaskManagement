import React, { useState } from "react";
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DatesPopupProps {
  isDatesPopupOpen: boolean;
  selectedCardList: { title: string };
  handleCloseDatesPopup: () => void;
}

const DatesPopup: React.FC<DatesPopupProps> = ({ isDatesPopupOpen, selectedCardList, handleCloseDatesPopup }) => {
  if (!isDatesPopupOpen || !selectedCardList) return null;

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<string>('');
  const [dueTime, setDueTime] = useState<string>('');
  const [reminder, setReminder] = useState<string>('1');

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving dates:", { startDate, endDate, dueDate, dueTime, reminder });
    handleCloseDatesPopup();
  };

  const handleRemove = () => {
    // Implement remove logic here
    setStartDate(undefined);
    setEndDate(undefined);
    setDueDate('');
    setDueTime('');
    setReminder('1');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-fit max-w-[750px] my-auto mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-6 border-b">
          <div className="justify-center items-center mb-4">
            <button
              onClick={handleCloseDatesPopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-center text-sm font-bold mb-4">{selectedCardList.title} - Dates</h2>

            <div className="flex justify-between mt-10">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Start Date
                </label>
                <DayPicker
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  footer={startDate ? <p>{format(startDate, 'PP')}</p> : <p>Please pick a day.</p>}
                  className="text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  End Date
                </label>
                <DayPicker
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  footer={endDate ? <p>{format(endDate, 'PP')}</p> : <p>Please pick a day.</p>}
                  className="text-black"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="due-date-checkbox" className="text-sm font-semibold">Due Date</label>
              <div className="flex space-x-2 mt-2">
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-gray-100 border border-gray-300 p-1 rounded w-full text-sm" 
                />
                <input 
                  type="time" 
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="bg-gray-100 border border-gray-300 p-1 rounded w-full text-sm" 
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="reminder" className="block text-sm font-semibold mb-2">Set Due Date Reminder</label>
              <select 
                id="reminder" 
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="bg-gray-100 border border-gray-300 p-1 rounded w-full text-sm text-gray-800"
              >
                <option value="1">1 day before</option>
                <option value="2">2 days before</option>
                <option value="3">3 days before</option>
                <option value="7">1 week before</option>
              </select>
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <button onClick={handleRemove} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm">
                Remove
              </button>
              <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatesPopup;