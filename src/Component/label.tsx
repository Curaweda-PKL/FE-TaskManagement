import { addLabelToCardList, fetchCardListLabels, deleteLabelFromWorkspace, removeLabelFromCardList } from "../hooks/ApiLabel";
import { useEffect, useState } from 'react';
import EditLabel from "./EditLabel";

interface LabelProps {
  isOpen: any;
  onClose: any;
  labels: any;
  onCreateNewLabel: any;
  cardlistId: string;
  workspaceId: string;
  funcfetchLabels: () => void;
  handlefetchCardListLabels: () =>  void;
  fetchData2: () => void;
}

const LabelsPopup: React.FC<LabelProps> = ({ isOpen, onClose, labels, funcfetchLabels, handlefetchCardListLabels, cardlistId, workspaceId, fetchData2 }) => {
  if (!isOpen) return null;

  const [openEdit, setOpenEdit] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState<string | undefined>(undefined);

  const handleEditLabel = (labelId: string) => {
    setEditingLabelId(labelId);
    setOpenEdit(true);
  };

  const [openCreate, setOpenCreate] = useState(false);


  const handleDeleteCardlist = async (cardlistLabelId: string) => {
    await deleteLabelFromWorkspace(cardlistLabelId)
    funcfetchLabels();
    handlefetchCardListLabels();
    fetchData2();
  }


  const handleAddLabel = async (labelId: string) => {
    try {
      await addLabelToCardList(cardlistId, labelId);
      getCardListLabels();
      fetchData2()
      console.log('Label berhasil ditambahkan ke card list');
    } catch (error) {
      console.error('Gagal menambahkan label ke card list:', error);
    }
  };

  const handleRemoveLabel = async (labelId: string) => {
    try {
      await removeLabelFromCardList(labelId, cardlistId);
      getCardListLabels();
      fetchData2();
    } catch (error) {
      console.error('Gagal meremove label dari card list:', error);
    }
  };

  const [labelsData, setLabelsData] = useState<{
    labelId: any; id: string
  }[]>([]);
  useEffect(() => {
    const getCardListLabels = async () => {
      try {
        const response = await fetchCardListLabels(cardlistId);
        setLabelsData(response);
        handlefetchCardListLabels()
      } catch (error) {
        console.error(error);
      }
    };
    getCardListLabels();
  }, [cardlistId]);

  const getCardListLabels = async () => {
    try {
      const response = await fetchCardListLabels(cardlistId);
      setLabelsData(response);
      handlefetchCardListLabels();
    } catch (error) {
      console.error(error);
    }
  };

  const getContrastColor = (hexColor:any) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <>
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
                    checked={labelsData.some((ldata) => ldata.labelId === label.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleAddLabel(label.id);
                      } else {
                        handleRemoveLabel(label.id);
                      }
                    }}
                  />
                  <div style={{ backgroundColor: label.color, color: getContrastColor(label.color) }} className={`w-full h-8 rounded-md flex items-center px-2`} onClick={() => handleEditLabel(label.id)}>
                    <span className="font-semibold">{label.name}</span>
                  </div>
                </div>
                <button className="ml-2 text-gray-400 hover:text-gray-600">
                  <i className="fas fa-trash text-red-500" onClick={() => handleDeleteCardlist(label.id)}></i>

                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 w-full py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800 font-semibold"
            onClick={() => setOpenCreate(true)}
          >
            Create new label
          </button>
        </div>
      </div>
      {openCreate && (
      <EditLabel
        onCloseCreate={() => setOpenCreate(false)}
        workspaceId={workspaceId}
        funcfetchLabels={funcfetchLabels}
      />
    )}

    {openEdit && (
      <EditLabel
        onCloseCreate={() => setOpenEdit(false)}
        workspaceId={workspaceId}
        funcfetchLabels={funcfetchLabels}
        labelId={editingLabelId}
        initialName={labels.find((label: { id: string | null; }) => label.id === editingLabelId)?.name}
        initialColor={labels.find((label: { id: string | null; }) => label.id === editingLabelId)?.color}
        handlefetchCardListLabels={handlefetchCardListLabels}
      />
    )}
    </>
  );
};

export default LabelsPopup;
