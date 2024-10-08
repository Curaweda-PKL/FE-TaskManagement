import React, { useState } from 'react';

interface CustomField {
  id: number;
  title: string;
  type: string;
  options?: string[];
}

interface CustomFieldSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomFieldSettings: React.FC<CustomFieldSettingsProps> = ({ isOpen, onClose }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: 1, title: 'Priority', type: 'dropdown', options: ['High', 'Medium', 'Low'] },
    { id: 2, title: 'Is Urgent', type: 'checkbox' },
    { id: 3, title: 'Story Points', type: 'number' }
  ]);
  
  const [newField, setNewField] = useState({
    title: '',
    type: '',
    options: ['']
  });

  if (!isOpen) return null;

  const handleAddOption = () => {
    setNewField(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index: number) => {
    setNewField(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setNewField(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleCreateField = () => {
    if (!newField.title || !newField.type) return;
    
    setCustomFields(prev => [...prev, {
      id: prev.length + 1,
      ...newField,
      options: newField.type === 'dropdown' ? newField.options.filter(opt => opt !== '') : undefined
    }]);
    
    setNewField({ title: '', type: '', options: [''] });
    setIsCreateModalOpen(false);
  };

  const handleDeleteField = (id: number) => {
    setCustomFields(prev => prev.filter(field => field.id !== id));
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg w-full max-w-2xl mx-4 p-6"
          onClick={stopPropagation}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Custom Fields</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="space-y-4">
            {customFields.map(field => (
              <div key={field.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <h4 className="font-medium">{field.title}</h4>
                  <p className="text-sm text-gray-600">Type: {field.type}</p>
                  {field.type === 'dropdown' && field.options && (
                    <p className="text-sm text-gray-600">
                      Options: {field.options.join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteField(field.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed p-4 rounded-lg hover:bg-gray-50"
            >
              <i className="fas fa-plus"></i>
              Add Custom Field
            </button>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-md mx-4 p-6"
            onClick={stopPropagation}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Custom Field</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Field Title</label>
                <input
                  type="text"
                  value={newField.title}
                  onChange={(e) => setNewField(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter field title"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Field Type</label>
                <select
                  value={newField.type}
                  onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value, options: [''] }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select field type</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="number">Number</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>

              {newField.type === 'dropdown' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Options</label>
                  {newField.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 p-2 border rounded-md"
                      />
                      <button
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddOption}
                    className="w-full p-2 border rounded-md hover:bg-gray-50"
                  >
                    Add Option
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateField}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create Field
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomFieldSettings;