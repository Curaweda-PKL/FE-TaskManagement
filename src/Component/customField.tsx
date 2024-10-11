import React, { useState, useEffect } from 'react';
import { 
  fetchCustomFields, 
  createCustomField,
  createCustomFieldOption,
  deleteCustomField,
  deleteCustomFieldOption
} from '../hooks/fetchCustomFields';

interface CustomField {
  id: number;
  name: string;
  type: string;
  options?: { id: number; value: []; color: string; }[];
}

interface CustomFieldSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: any;
  onCustomFieldClick: (field: CustomField) => void;
}

const CustomFieldSettings: React.FC<CustomFieldSettingsProps> = ({ isOpen, onClose, workspaceId, onCustomFieldClick }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [newField, setNewField] = useState({
    title: '',
    type: '',
    options: ['']
  });

  const [currentFieldId, setCurrentFieldId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCustomFields();
    }
  }, [isOpen, workspaceId]);

  const loadCustomFields = async () => {
    try {
      setLoading(true);
      const fields = await fetchCustomFields(workspaceId);
      setCustomFields(fields);
    } catch (err) {
      setError('Failed to load custom fields');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomFieldClick = (field: CustomField) => {
    onCustomFieldClick(field);
  };

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

  const handleCreateField = async () => {
    if (!newField.title || !newField.type) return;
    
    try {
      setLoading(true);
      const createdField = await createCustomField(
        workspaceId,
        newField.title,
        newField.type,
        newField.type === 'DROPDOWN' ? 'multiple' : 'single'
      );

      if (newField.type === 'DROPDOWN') {
        setCurrentFieldId(createdField.id);
        setIsOptionsModalOpen(true);
      } else {
        await loadCustomFields();
        setIsCreateModalOpen(false);
        setNewField({ title: '', type: '', options: [''] });
      }
    } catch (err) {
      setError('Failed to create custom field');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOptions = async () => {
    if (!currentFieldId) return;

    try {
      setLoading(true);
      const validOptions = newField.options.filter(opt => opt !== '');
      
      for (const option of validOptions) {
        await createCustomFieldOption( currentFieldId, option, '#000000');
      }

      await loadCustomFields();
      setIsOptionsModalOpen(false);
      setIsCreateModalOpen(false);
      setNewField({ title: '', type: '', options: [''] });
      setCurrentFieldId(null);
    } catch (err) {
      setError('Failed to create options');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteField = async (id: number) => {
    try {
      setLoading(true);
      await deleteCustomField(id);
      await loadCustomFields();
    } catch (err) {
      setError('Failed to delete custom field');
    } finally {
      setLoading(false);
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg w-full max-w-sm max-h-[90vh] mx-4 overflow-y-auto"
          onClick={stopPropagation}
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Custom Fields</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="space-y-2 p-4">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              customFields.map(field => (
                <div key={field.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md"
                onClick={() => handleCustomFieldClick(field)}
                >
                  <div>
                    <h4 className="font-medium">{field.name}</h4>
                    <p className="text-sm text-gray-600">Type: {field.type}</p>
                    {field.type === 'DROPDOWN' && field.options && (
                      <p className="text-sm text-gray-600">
                        Options: {field.options.map(opt => opt.value).join(', ')}
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
              ))
            )}
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-700 transition duration-300 w-full"
            >
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
            className="bg-white rounded-lg w-full max-w-md mx-4"
            onClick={stopPropagation}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Create Custom Field</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <label className="block text-sm font-medium mb-1">Field Title</label>
                <input
                  type="text"
                  value={newField.title}
                  onChange={(e) => setNewField(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter field title"
                  className="w-full bg-gray-300 px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Field Type</label>
                <select
                  value={newField.type}
                  onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-gray-300 p-2 border rounded-md"
                >
                  <option value="">Select field type</option>
                  <option value="DROPDOWN">Dropdown</option>
                  <option value="NUMBER">Number</option>
                  <option value="CHECKBOX">Checkbox</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateField}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOptionsModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setIsOptionsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-md mx-4"
            onClick={stopPropagation}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Add Options</h2>
              <button 
                onClick={() => setIsOptionsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4 p-4">
              {newField.options.map((opt, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder="Enter option"
                    className="w-full bg-gray-300 px-4 py-2 border rounded-md"
                  />
                  <button 
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}

              <button 
                onClick={handleAddOption}
                className="text-purple-600 hover:underline"
              >
                + Add Option
              </button>

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsOptionsModalOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateOptions}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  Create Options
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
