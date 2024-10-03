import { addLabelToCardList, fetchCardlistLabel } from "../hooks/ApiLabel";
import { useEffect } from 'react';

interface LabelProps {
  isOpen: any;
  onClose: any;
  labels: any;
  onCreateNewLabel: any;
  cardlistId: string;
}

const LabelsPopup: React.FC<LabelProps> = ({ isOpen, onClose, labels, onCreateNewLabel, cardlistId }) => {
  if (!isOpen) return null;

  const handleAddLabel = async (labelId: string) => {
    try {
      await addLabelToCardList(cardlistId, labelId);
      console.log('Label berhasil ditambahkan ke card list');
    } catch (error) {
      console.error('Gagal menambahkan label ke card list:', error);
    }
  };

  useEffect(() => {
    const getCardListLabels = async () => {
      try {
        await fetchCardlistLabel(cardlistId);
      } catch (error) {
        console.error(error);
      }
    };
    getCardListLabels();
  }, [cardlistId]);




  return (
    <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg h-fit w-72 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-lg font-bold mb-4 text-black   text-center">Label</h2>
        <ul className="space-y-2">
          {labels.map((label: any, index: any) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center w-full">
                <input
                  type="checkbox"
                  className="mr-2 accent-gray-500"
                  value={label.id}
                  onChange={() => handleAddLabel(label.id)}
                />
                <div className={`w-full h-8 rounded-md bg-[${label.color}] flex items-center px-2`}>
                  <span className="text-white font-semibold">{label.name}</span>
                </div>
              </div>
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <i className="fas fa-pencil-alt"></i>
              </button>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 w-full py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800 font-semibold"
          onClick={onCreateNewLabel}
        >
          Create new label
        </button>
      </div>
    </div>
  );
};

export default LabelsPopup;
