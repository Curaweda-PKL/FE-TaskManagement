import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { fetchBoards } from '../hooks/fetchBoard';
import { fetchCard } from '../hooks/fetchCard';
import config from '../config/baseUrl';

interface Board {
  id: string;
  name: string;
}

interface Card {
  id: string;
  title: string;
  list?: any;
}

interface CopyPopupProps {
  isCopyPopupOpen: boolean;
  selectedCardList: any[];
  workspaceId: any;
  close: () => void;
}

const CopyPopup: React.FC<CopyPopupProps> = ({
  isCopyPopupOpen,
  selectedCardList,
  workspaceId,
  close
}) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [formData, setFormData] = useState({
    name: 'Copy of List',
    members: false,
    attachments: false,
    comments: false,
    boardId: '',
    cardId: '',
    position: '1'
  });

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsData = await fetchBoards(workspaceId);
        console.log('Boards Data:', boardsData);
        setBoards(boardsData);
        if (boardsData.length > 0) {
          setFormData(prev => ({ ...prev, boardId: boardsData[0].id }));
        }
      } catch (error) {
        console.error('Error loading boards:', error);
      }
    };

    if (workspaceId) {
      loadBoards();
    }
  }, [workspaceId]);

  useEffect(() => {
    const loadCards = async () => {
      if (formData.boardId) {
        try {
          const response = await fetchCard(formData.boardId);
          console.log('Raw Card Response:', response);

          const cardsData = Array.isArray(response) ? response : response.data || [];

          console.log('Processed Cards Data:', cardsData);
          setCards(cardsData);

          if (cardsData.length > 0) {
            setFormData(prev => ({ ...prev, cardId: cardsData[0].id }));
          }
        } catch (error) {
          console.error('Error loading cards:', error);
        }
      }
    };

    loadCards();
  }, [formData.boardId]);

  const handleCheckboxChange = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleCreate = async () => {
    try {
      const copyData = (selectedCardList || []).map(item => ({
        ...item,
        members: formData.members ? item.members : [],
        attachments: formData.attachments ? item.attachments : [],
        comments: formData.comments ? item.comments : [],
        boardId: formData.boardId,
        cardId: formData.cardId,
      }));

      console.log('Copying data:', copyData);

      await axios.post(`${config}/cardlist/copy`, {
        items: copyData,
        destinationBoardId: formData.boardId,
        destinationCardId: formData.cardId,
        name: formData.name,
      }, {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      close();
    } catch (error) {
      console.error('Error copying card list:', error);
    }
  };



  if (!isCopyPopupOpen || !selectedCardList) return null;

  return (
    <div className="fixed text-gray-800 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-80 relative">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-sm">Card List Copy</h2>
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">

          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-100 rounded p-2 text-sm"
            />
          </div>

          {/* Keep Section */}
          <div>
            <label className="block text-sm mb-2">Keep...</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.members}
                  onChange={() => handleCheckboxChange('members')}
                  className="form-checkbox rounded text-purple-600"
                />
                <span className="ml-2 text-sm">Members</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.attachments}
                  onChange={() => handleCheckboxChange('attachments')}
                  className="form-checkbox rounded text-purple-600"
                />
                <span className="ml-2 text-sm">Attachments</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.comments}
                  onChange={() => handleCheckboxChange('comments')}
                  className="form-checkbox rounded text-purple-600"
                />
                <span className="ml-2 text-sm">Comments</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Board</label>
            <select
              value={formData.boardId}
              onChange={(e) => setFormData(prev => ({ ...prev, boardId: e.target.value, cardId: '' }))}
              className="w-full bg-gray-100 rounded p-2 text-sm mb-3"
            >
              <option value="">Select a board</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm mb-1">Card</label>
                <select
                  className="w-full border bg-gray-200 rounded p-1.5 text-sm"
                  value={formData.cardId}
                  onChange={(e) => setFormData(prev => ({ ...prev, cardId: e.target.value }))}
                >
                  <option value="">Select a card</option>
                  {cards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.title}
                    </option>
                  ))}
                </select>
                {cards.length === 0 && formData.boardId && (
                  <p className="text-xs text-red-500 mt-1">No cards available for this board</p>
                )}
              </div>
              <div className="w-24">
                <label className="block text-sm mb-1">Position</label>
                <select
                  className="w-full border bg-gray-200 rounded p-1.5 text-sm"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="w-full bg-purple-600 text-white rounded py-2 text-sm mt-4 hover:bg-purple-700"
            disabled={!formData.boardId || !formData.cardId}
          >
            Create Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyPopup;