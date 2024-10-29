import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchBoards } from '../hooks/fetchBoard';
import { fetchCard } from '../hooks/fetchCard';
import { copyCardList } from '../hooks/ApiCopy';

interface Board {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  boardId: string;
  cardId: string;
  memberIds: string[]; // Pastikan ini adalah string[]
  includeMembers: boolean; // Tambahkan ini
  includeChecklists: boolean;
  includeCustomFields: boolean;
  includeAttachments: boolean;
  includeLabels: boolean;
}

interface SelectedCardList {
  id: string;
  members: {
    userId: string;
  }[];
}

interface Card {
  id: string;
  name: string;
  list?: any;
}

interface CopyPopupProps {
  isCopyPopupOpen: boolean;
  selectedCardList: SelectedCardList;
  workspaceId: any;
  close: () => void;
}

const CopyPopup: React.FC<CopyPopupProps> = ({
  isCopyPopupOpen,
  selectedCardList,
  workspaceId,
  close,
}) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    boardId: '',
    cardId: '',
    memberIds: [],
    includeMembers: false,
    includeChecklists: false,
    includeCustomFields: false,
    includeAttachments: false,
    includeLabels: false,
  });

  const handleCopyCardList = async () => {
    const memberIds = formData.includeMembers
      ? selectedCardList.members.map(member => member.userId)
      : [];
  
    const data = {
      sourceCardListId: selectedCardList.id,
      targetCardId: formData.cardId,
      name: formData.name,
      memberIds: memberIds,
      includeChecklists: formData.includeChecklists,
      includeCustomFields: formData.includeCustomFields,
      includeAttachments: formData.includeAttachments,
      includeLabels: formData.includeLabels,
    };
  
    try {
      const result = await copyCardList(data);
      console.log('Card list copied successfully:', result);
    } catch (error) {
      console.error('Error copying card list:', error);
    }
  };

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
          selectedCardList.members.forEach(member => {
            console.log("User  ID:", member.userId);
          });

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

          <div>
            <label className="block text-sm mb-2">Keep...</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox rounded text-purple-600"
                  checked={formData.includeMembers}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeMembers: e.target.checked }))}
                />
                <span className="ml-2 text-sm">Members</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox rounded text-purple-600"
                  checked={formData.includeChecklists}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeChecklists: e.target.checked }))}
                />
                <span className="ml-2 text-sm">Checklist</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox rounded text-purple-600"
                  checked={formData.includeCustomFields}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeCustomFields: e.target.checked }))}
                />
                <span className="ml-2 text-sm">Customfields</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox rounded text-purple-600"
                  checked={formData.includeAttachments}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeAttachments: e.target.checked }))}
                />
                <span className="ml-2 text-sm">Attachment</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox rounded text-purple-600"
                  checked={formData.includeLabels}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeLabels: e.target.checked }))}
                />
                <span className="ml-2 text-sm">Labels</span>
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
                      {card.name}
                    </option>
                  ))}
                </select>
                {cards.length === 0 && formData.boardId && (
                  <p className="text-xs text-red-500 mt-1">No cards available for this board</p>
                )}
              </div>
            </div>

          </div>

          <button
            className="w-full bg-purple-600 text-white rounded py-2 text-sm mt-4 hover:bg-purple-700"
            disabled={!formData.boardId || !formData.cardId}
            onClick={handleCopyCardList} // Panggil fungsi untuk menyalin daftar kartu
          >
            Create Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyPopup;