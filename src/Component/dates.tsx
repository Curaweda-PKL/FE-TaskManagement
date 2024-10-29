import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { updateCardList } from "../hooks/fetchCardList";
import { Activity } from "phosphor-react";

interface DatesPopupProps {
  isDatesPopupOpen: boolean;
  selectedCardList: {
    id: any;
    title: string;
    score: number;
    description: string;
    startDate?: string;
    endDate?: string;
    dueTime?: string;
    reminder?: string;
  };
  handleCloseDatesPopup: () => void;
}

const DatesPopup: React.FC<DatesPopupProps> = ({
  isDatesPopupOpen,
  selectedCardList,
  handleCloseDatesPopup,
}) => {
  if (!isDatesPopupOpen || !selectedCardList) return null;

  const [startDate, setStartDate] = useState<Date | undefined>(
    selectedCardList.startDate ? new Date(selectedCardList.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    selectedCardList.endDate ? new Date(selectedCardList.endDate) : undefined
  );
  const [dueDate, setDueDate] = useState<string>(
    selectedCardList.endDate ? format(new Date(selectedCardList.endDate), "yyyy-MM-dd") : ""
  );
  const [dueTime, setDueTime] = useState<string>(selectedCardList.dueTime || "");
  const [reminder, setReminder] = useState<string>(selectedCardList.reminder || "1");

  const [startDateChecked, setStartDateChecked] = useState<boolean>(false);
  const [endDateChecked, setEndDateChecked] = useState<boolean>(false);

  useEffect(() => {
    if (endDate) {
      setDueDate(format(endDate, "yyyy-MM-dd"));
    }
  }, [endDate]);

  useEffect(() => {
    if (dueDate) {
      const newEndDate = new Date(`${dueDate}T${dueTime || "00:00"}`);
      setEndDate(newEndDate);
    }
  }, [dueDate, dueTime]);

  useEffect(() => {
    if (startDateChecked) {
      setStartDate(new Date());
    }
  }, [startDateChecked]);

  useEffect(() => {
    if (endDateChecked) {
      setEndDate(new Date());
    }
  }, [endDateChecked]);

  const handleSave = async () => {
    try {
      await updateCardList(
        selectedCardList.id,
        selectedCardList.title,
        selectedCardList.description,
        selectedCardList.score,
        startDate?.toISOString(),
        endDate?.toISOString(),
        Activity
      );
      handleCloseDatesPopup();
    } catch (error) {
      console.error("Error updating card list:", error);
    }
  };

  const handleRemove = async () => {
    try {
      await updateCardList(
        selectedCardList.id,
        selectedCardList.title,
        selectedCardList.description,
        selectedCardList.score,
        null,
        null,
        Activity
      );
      handleCloseDatesPopup();
    } catch (error) {
      console.error("Error updating card list:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
      <div className="bg-white rounded-lg shadow-lg w-90 p-4 max-w-lg">
        <div className="max-h-[75vh] overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-gray-800 font-semibold">Dates</h2>
            <button
              onClick={handleCloseDatesPopup}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <DayPicker
            mode="single"
            selected={!endDateChecked ? endDate : undefined}
            onSelect={setEndDate}
            className="mx-auto text-gray-800"
          />

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={startDateChecked}
                onChange={(e) => setStartDateChecked(e.target.checked)}
              />
              <input
                type="date"
                value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                disabled={startDateChecked}
                className="w-full p-1 bg-gray-300 text-gray-800 border rounded"
              />
            </div>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={endDateChecked}
                onChange={(e) => setEndDateChecked(e.target.checked)}
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={endDateChecked}
                className="w-1/2 p-1 bg-gray-300 text-gray-800 border rounded"
              />
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-1/2 p-1 bg-gray-300 text-gray-800 border rounded"
              />
            </div>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Set Due Date Reminder
            </label>
            <select
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full p-1 bg-gray-300 text-gray-800 border rounded"
            >
              <option value="1">1 - Day before</option>
              <option value="2">2 - Days before</option>
              <option value="3">3 - Days before</option>
              <option value="7">1 - Week before</option>
            </select>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={handleSave}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={handleRemove}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatesPopup;
