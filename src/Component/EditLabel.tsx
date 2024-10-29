import { useState } from 'react';
import { createCardListLabel, updateCardListLabel } from '../hooks/ApiLabel';

interface EditLabelProps {
  onCloseCreate: () => void;
  funcfetchLabels: () => void;
  workspaceId: string;
  labelId?: string;
  initialName?: string;
  initialColor?: string;
  handlefetchCardListLabels?: () => void;
}

const EditLabel: React.FC<EditLabelProps> = ({
  onCloseCreate,
  workspaceId,
  funcfetchLabels,
  labelId,
  initialName,
  initialColor,
  handlefetchCardListLabels
}) => {
  const [labelColor, setLabelColor] = useState(initialColor || '#ffffff');
  const [name, setName] = useState(initialName || '');
  const [error, setError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 12) {
      setName(value);
      setError('');
    } else {
      setError('Label name cannot exceed 12 characters');
    }
  };

  const handleSubmit = async () => {
    if (name.trim() === '') {
      setError('Label name cannot be empty');
      return;
    }
    
    if (name.length > 12) {
      setError('Label name cannot exceed 12 characters');
      return;
    }

    try {
      if (labelId) {
        await updateCardListLabel(labelId, name, labelColor);
        if (handlefetchCardListLabels) {
          handlefetchCardListLabels();
        }
      } else {
        await createCardListLabel(workspaceId, name, labelColor);
      }
      await funcfetchLabels();
      onCloseCreate();
    } catch (err) {
      setError('Failed to save label');
    }
  };

  return (
    <div className="flex justify-center z-100 items-center fixed inset-0 bg-black bg-opacity-50" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-end">
          <i className="fas fa-times cursor-pointer text-black" onClick={onCloseCreate} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className={`w-full border ${error ? 'border-red-500' : 'border-black'} text-black bg-white rounded px-3 py-2 text-sm`}
            maxLength={12}
          />
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
              {error || `${name.length}/12 characters`}
            </span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Select a color</label>
          <div className="flex items-center gap-3 w-full">
            <input
              type="color"
              className="h-10 rounded w-1/2"
              value={labelColor}
              style={{ backgroundColor: labelColor, border: 'none' }}
              onChange={(e) => setLabelColor(e.target.value)}
            />
            <input
              type="text"
              className="w-20 rounded px-3 py-2 text-sm bg-white border-black border text-black"
              value={labelColor}
              onChange={(e) => setLabelColor(e.target.value)}
              placeholder="#hexcode"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex justify-between">
            <button
              className={`bg-purple-600 text-sm mr-5 text-white font-medium py-1 px-7 rounded-lg ${
                error ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
              onClick={handleSubmit}
              disabled={!!error}
            >
              {labelId ? 'Update' : 'Save'}
            </button>
            <button
              className="bg-gray-200 text-sm text-black font-medium py-1 px-7 rounded-lg hover:bg-purple-700"
              onClick={onCloseCreate}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLabel;