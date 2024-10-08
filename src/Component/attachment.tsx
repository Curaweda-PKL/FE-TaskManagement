import React, { useState, useRef } from 'react';
import { createAttachment, fetchCardListAttachments } from '../hooks/fetchCardList';

interface AttachPopupProps {
  isAttachPopupOpen: boolean;
  selectedCardList: any;
  handleCloseAttachPopup: () => void;
  onAttachmentCreated: (newAttachment: any) => void;
}

const AttachPopup: React.FC<AttachPopupProps> = ({ 
  isAttachPopupOpen, 
  selectedCardList, 
  handleCloseAttachPopup,
  onAttachmentCreated 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAttachPopupOpen || !selectedCardList) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAttachmentName(file.name);
      setDisplayText(file.name);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedCardList) return;
    
    const cardListId = selectedCardList.id || selectedCardList._id;
    if (!cardListId) {
      console.error('No valid cardListId found');
      return;
    }
  
    setIsLoading(true);
    try {
      const finalAttachmentName = attachmentName || selectedFile.name;
      const response = await createAttachment(
        cardListId.toString(),
        selectedFile,
        finalAttachmentName
      );
      
      if (response && response.attachmentId) {
        const blobUrl = await fetchCardListAttachments(response.attachmentId);
        const newAttachment = {
          id: response.attachmentId,
          url: blobUrl,
          name: response.name || finalAttachmentName,
          displayText: displayText || finalAttachmentName
        };
        onAttachmentCreated(newAttachment);
      }
      
      handleCloseAttachPopup();
    } catch (err) {
      console.error('Failed to upload attachment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
      <div className="relative bg-white text-black p-4 rounded-lg shadow-lg w-80">
        <button
          onClick={handleCloseAttachPopup}
          className="absolute top-2 right-2 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-center text-sm font-bold mb-4">Attach</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Attach a file from your computer
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div 
            onClick={handleAttachClick}
            className="bg-gray-200 text-center text-sm p-4 rounded-lg cursor-pointer"
          >
            {selectedFile ? selectedFile.name : 'Choose a file'}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Attachment Name
          </label>
          <input
            type="text"
            value={attachmentName}
            onChange={(e) => setAttachmentName(e.target.value)}
            className="w-full bg-gray-200 text-sm p-2 py-3 rounded-lg"
            placeholder="Enter attachment name"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleCloseAttachPopup}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!selectedFile || isLoading}
            className={`${
              isLoading || !selectedFile 
                ? 'bg-purple-400' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white px-4 py-2 rounded`}
          >
            {isLoading ? 'Uploading...' : 'Insert'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachPopup;