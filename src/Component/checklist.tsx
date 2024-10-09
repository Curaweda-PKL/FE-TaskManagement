import React, { useState } from "react";

import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { createChecklist } from "../hooks/ApiChecklist";


interface ChecklistPopupProps {
  isOpen: any;
  onClose: any;
  selectedCardList: any;
}

const ChecklistPopup: React.FC<ChecklistPopupProps> = ({ isOpen, onClose, selectedCardList }) => {
  if (!isOpen || !selectedCardList) return null;

  const [items, setItems] = useState(['']);
  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleInputChange = (index: number, value: string) => {
    setItems(items.map((item, i) => (i === index ? value : item)));
  };

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const [title, setTitle] = useState('');

  const handleCreateChecklist = async () => {
    const checklistDataWrapper = {
      checklistData: {
        cardListId: selectedCardList.id,
        name: title,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        items: items.map((item) => ({ name: item, isDone: false })),
      },
    };
  
    try {
      const response = await createChecklist(checklistDataWrapper);
      console.log(response);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-fit max-w-[750px] my-auto mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-6 border-b">
          <div className="justify-center items-center mb-4">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-center text-sm font-bold mb-4">Add Checklist</h2>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full p-1 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-center mt-4 flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Item
                </label>
                {items.map((item, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder="Item Name"
                      className="w-full p-1 border border-gray-300 bg-white rounded-lg focus:outline"
                    />
                  </div>
                ))}
                <button onClick={handleAddItem} className="btn btn-sm w-20 text-[12px] bg-purple-600 hover:bg-purple-700 text-white border-none">
                  Add Item
                </button>
              </div>

              <div className="flex justify-between mt-10">
                <label className="block text-sm font-medium text-black">
                  Start Date
                </label>
                <label className="block text-sm font-medium text-gray-700 ">
                  End Date
                </label>
              </div>

              <div className=" flex-col mt-4 gap-2">
                <DayPicker
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  footer={startDate ? <p>{format(startDate, 'PP')}</p> : <p>Please pick a day.</p>}
                  className="text-black"
                />

                <DayPicker
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  footer={endDate ? <p>{format(endDate, 'PP')}</p> : <p>Please pick a day.</p>}
                  className="text-black"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={handleCreateChecklist} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistPopup;
