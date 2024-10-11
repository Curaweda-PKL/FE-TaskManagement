import { useState, useRef } from 'react';
import DescriptionEditor from '../Component/descriptionEditor';

interface CardListPopupProps {
    isOpen: any,
    selectedCardList: any,
    onClose: any,
    onUpdateListName: any,
    onJoin: any,
    onOpenMemberPopup: any,
    onOpenLabelsPopup: any,
    onOpenChecklistPopup: any,
    onOpenDatesPopup: any,
    onOpenAttachPopup: any,
    onOpenSubmitPopup: any,
    onOpenCopyPopup: any,
    onArchive: any,
    onSendToBoard: any,
    onDeleteCardList: any,
    isArchived: any
}

interface Attachment {
    id: string;
    url: string;
  }

const CardListPopup: React.FC<CardListPopupProps> = ({
    isOpen,
    selectedCardList,
    onClose,
    onUpdateListName,
    onJoin,
    onOpenMemberPopup,
    onOpenLabelsPopup,
    onOpenChecklistPopup,
    onOpenDatesPopup,
    onOpenSubmitPopup,
    onOpenCopyPopup,
    onArchive,
    onSendToBoard,
    onDeleteCardList,
    isArchived = false
}) => {
    const [editingListName, setEditingListName] = useState(false);
    const [selectCardList, setSelectedCardList] = useState(selectedCardList);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const inputRef = useRef(null);

    if (!isOpen || !selectedCardList) return null;

    const fetchData = async () => {
        try {
          const boardData = await fetchBoards(workspaceId);
          setBoards(boardData);
          const board = boardData.find((b: any) => b.id === boardId);
          setBoardName(board ? board.name : 'Project');
    
          if (boardId) {
            const cardResponse = await fetchCard(boardId);
            if (cardResponse && cardResponse) {
              const updatedCardData = await Promise.all(
                cardResponse.map(async (card: any) => {
                  if (card && card.id) {
                    const cardListData = await fetchCardList(card.id);
                    const cardListWithAttachments = await Promise.all(
                      cardListData.map(async (cardList: any) => {
                        if (cardList.attachments && cardList.attachments.length > 0) {
                          const attachmentDetails = await Promise.all(
                            cardList.attachments.map((attachment: any) =>
                              fetchCardListAttachments(attachment.attachmentId)
                            )
                          );
                          return { ...cardList, attachmentDetails };
                        }
                        return { ...cardList, attachmentDetails: [] };
                      })
                    );
                    return { ...card, cardList: cardListWithAttachments };
                  }
                  return { ...card, cardList: [] };
                })
              );
              setCardData(updatedCardData);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    const handleUpdateListName = () => {
        setEditingListName(false);
        onUpdateListName(selectCardList.id, selectCardList.name, selectCardList.description, selectCardList.score);
    };

    const handleDeleteAttachment = async (attachmentId: string) => {
        if (!selectedCardList || !selectedCardList.id) {
          console.error('No card list selected');
          return;
        }
        
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
          const response = await deleteAttachment(selectedCardList.id, attachmentId);
          
          if (response.success) {
            setAttachments(prevAttachments => 
              prevAttachments.filter(attachment => attachment.id !== attachmentId)
            );
            await fetchData(); // Refresh the data
          } else {
            console.error('Delete attachment failed:', response.message, response.error);
            setDeleteError(response.message);
          }
        } catch (error) {
          console.error('Error deleting attachment:', error);
          setDeleteError('An unexpected error occurred while deleting the attachment');
        } finally {
          setIsDeleting(false);
        }
      };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[650px]">
                <div className="flex justify-between items-center mb-4">
                    {editingListName ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={selectCardList.name}
                            onChange={(e) => setSelectedCardList({ ...selectCardList, name: e.target.value })}
                            onBlur={handleUpdateListName}
                            autoFocus
                            className="text-xl font-semibold p-1 rounded text-black bg-white border-b-1 border-black"
                        />
                    ) : (
                        <h2
                            className="text-xl font-semibold text-gray-800 cursor-pointer"
                            onClick={() => setEditingListName(true)}
                        >
                            {selectCardList.name}
                        </h2>
                    )}
                    <button onClick={onClose} className="text-gray-700 hover:text-gray-700">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="cardlist flex gap-10 max768:flex-col">
                    <div className="cardliststart w-full max768:w-full flex-[3]">
                        <div className="flex flex-row gap-10 mb-3">
                            <div className="memberColor h-6 w-12 bg-red-500 rounded"></div>
                            <div className="btn hover:bg-gray-400 min-h-6 h-2 rounded w-fit bg-gray-300 border-none text-black">
                                <i className="fas fa-eye"></i>Activity
                            </div>
                        </div>

                        <div className="mt-4">
                            <h2 className="text-black mb-3 font-semibold text-lg">Members</h2>
                            <div className="flex flex-wrap gap-2">
                                {selectCardList.members && selectCardList.members.length > 0 ? (
                                    selectCardList.members.map((member: any) => (
                                        <div key={member.userId} className="flex flex-col items-center">
                                            <img
                                                src={member.photoUrl || '/path/to/default/avatar.png'}
                                                alt={`Profile of ${member.userId}`}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No members assigned to this card</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <DescriptionEditor
                                initialDescription={selectCardList.description}
                                onSave={(description: any) => {
                                    setSelectedCardList({ ...selectCardList, description });
                                    onUpdateListName(selectCardList.id, selectCardList.name, description, selectCardList.score);
                                }}
                            />
                        </div>

                        <div>
                            <h2 className="text-black mb-3 font-semibold text-lg">Details</h2>
                        </div>
                        <div className="activity flex justify-between mb-3">
                            <span className="text-black text-lg font-semibold">Activity</span>
                            <div className="btn hover:bg-gray-400 btn-neutral h-6 min-h-6 bg-gray-300 border-none text-black rounded-md">
                                Show Details
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            className="h-7 w-full rounded text-sm p-2 bg-gray-300 text-black font-semibold"
                        />
                    </div>

                    <div className="cardlistend flex flex-col w-full gap-3 justify-start max768:ml-0 flex-[1]">
                        <div
                            className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mb-1"
                            onClick={() => onJoin(selectCardList.id)}
                        >
                            <i className="fas fa-user"></i>Join
                        </div>
                        <div className="border-b-2 border-black"></div>

                        <div
                            className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mt-1"
                            onClick={() => onOpenMemberPopup(selectCardList)}
                        >
                            <i className="fas fa-user"></i>Member
                        </div>

                        <div
                            className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                            onClick={() => onOpenLabelsPopup(selectCardList)}
                        >
                            <i className="fas fa-tag"></i>Labels
                        </div>

                        <div
                            className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                            onClick={() => onOpenChecklistPopup(selectCardList)}
                        >
                            <i className="fas fa-check-square"></i> Checklist
                        </div>

                        <div
                            className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                            onClick={() => onOpenDatesPopup(selectCardList)}
                        >
                            <i className="fas fa-clock"></i>Dates
                        </div>

                        <div>
                            <div className="flex-wrap gap-2">
                                <h2 className="text-black mb-3 font-semibold text-lg">Attachment</h2>
                                {attachments.map((attachment, index) => (
                                    <>
                                        <div className='flex items-center text-black'>
                                            <div className='flex bg-gray-200 my-5 p-0 w-28 h-16 items-center justify-center'>
                                                <img
                                                    key={index}
                                                    src={attachment.url}
                                                    alt={`Attachment ${index + 1}`}
                                                    className="max-w-28 max-h-16 object-cover rounded"
                                                />
                                            </div>
                                            <div className='ml-5 text-gray-800 text-sm'>
                                                <p className="font-semibold text-base">{attachment.name}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <p className="text-gray-500">Added 1 mt</p>
                                                    <button className="underline">Comment</button>
                                                    <button className="underline">Download</button>
                                                    <button
                                                        className="underline"
                                                        onClick={() => handleDeleteAttachment(attachment.id)}
                                                        disabled={isDeleting}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button className="underline">Edit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))}
                                {deleteError && <p className="text-red-500 text-sm mt-1">{deleteError}</p>}
                                {attachments.length === 0 && (
                                    <p className="text-gray-500">No attachment</p>
                                )}
                            </div>
                        </div>

                        <div
                            className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                            onClick={() => onOpenSubmitPopup(selectCardList)}
                        >
                            <i className="fas fa-file-upload"></i>Submit
                        </div>

                        <div
                            className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                            onClick={() => onOpenCopyPopup(selectCardList)}
                        >
                            <i className="fas fa-copy"></i>Copy
                        </div>

                        {!isArchived ? (
                            <div
                                className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                                onClick={onArchive}
                            >
                                <i className="fas fa-archive"></i>Archive
                            </div>
                        ) : (
                            <>
                                <div
                                    className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black pr-0"
                                    onClick={onSendToBoard}
                                >
                                    <i className="fas fa-undo"></i>Send to board
                                </div>
                                <div
                                    className="btn hover:bg-red-700 min-h-6 h-2 bg-red-500 rounded border-none justify-start text-black"
                                    onClick={() => onDeleteCardList(selectCardList.id)}
                                >
                                    <i className="fas fa-trash"></i>Delete
                                </div>
                            </>
                        )}

                        <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black">
                            <i className="fas fa-share"></i>Share
                        </div>

                        <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black">
                            Custom Field
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardListPopup;