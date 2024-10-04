import { useState } from 'react';
import { createCardListLabel } from '../hooks/ApiLabel';

interface EditLabelProps {
  onCloseCreate: () => void;
  funcfetchLabels: () => void;
  workspaceId: string
}

const EditLabel: React.FC<EditLabelProps> = ({ onCloseCreate, workspaceId, funcfetchLabels }) => {
  const [labelColor, setLabelColor] = useState('#ffffff');
  const [name, setName] = useState('');

  const handleCrateLabel = async (workspaceId: string, name: string, labelColor: string) => {
    try {
      await createCardListLabel(workspaceId, name, labelColor);
      await funcfetchLabels();
      onCloseCreate()
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="flex justify-center z-100 items-center fixed inset-0 bg-black bg-opacity-50" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-end">
          <i className="fas fa-times cursor-pointer text-black" onClick={onCloseCreate} />
        </div>
        {/* <h2 className="text-center text-lg font-semibold text-gray-900 mb-4">Edit Label</h2> */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-black border text-black bg-white rounded px-3 py-2 text-sm"
          />
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
              className="w-20 rounded px-3 py-2 text-sm bg-white border-black border text-black  "
              value={labelColor}
              onChange={(e) => setLabelColor(e.target.value)}
              placeholder="#hexcode"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="bg-purple-600 text-sm text-white font-medium py-1 px-10 rounded-lg hover:bg-purple-700"
            onClick={() => handleCrateLabel(workspaceId, name, labelColor)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLabel;
