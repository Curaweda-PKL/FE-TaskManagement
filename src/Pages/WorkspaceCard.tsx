import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBoards } from '../hooks/fetchBoard';
import { fetchCard, createCard, deleteCard, updateCard } from '../hooks/fetchCard';
import { fetchCardList, createCardList, updateCardList, deleteCardList } from '../hooks/fetchCardList';
import CreateCard from '../Component/createCard';
import MemberPopup from '../Component/member';
import LabelsPopup from '../Component/label';
import EditLabel from '../Component/EditLabel';
import ChecklistPopup from '../Component/checklist';
import DatesPopup from '../Component/dates';
import AttachPopup from '../Component/attachment';
import SubmitPopup from '../Component/submit';
import CopyPopup from '../Component/copy';
import SharePopup from '../Component/share';


const WorkspaceProject = () => {
  const { workspaceId, boardId } = useParams<{ workspaceId: string; boardId: string }>();
  const [boardName, setBoardName] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [isAddingList, setIsAddingList] = useState({});
  const [newListName, setNewListName] = useState({});
  const [cardData, setCardData] = useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);
  const [isLabelsPopupOpen, setIsLabelsPopupOpen] = useState(false);
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [isEditLabelOpen, setIsEditLabelOpen] = useState(false);
  const [isChecklistPopupOpen, setIsChecklistPopupOpen] = useState(false);
  const [isDatesPopupOpen, setIsDatesPopupOpen] = useState(false);
  const [isAttachPopupOpen, setIsAttachPopupOpen] = useState(false);
  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState(false);
  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [selectedCardList, setSelectedCardList] = useState<any | null>(null);
  const [editingCard, setEditingCard] = useState(null);
  const [activeCardRect, setActiveCardRect] = useState(null);
  const [isEditCard, setIsEditCard] = useState(false);

  const handleOpenCreateCard = () => {
    setIsCreateCardOpen(true);
  };

  const handleCloseCreateCard = () => {
    setIsCreateCardOpen(false);
    setCurrentCard(null);
  };

  const handleOpenEditCard = (card: any) => {
    setCurrentCard(card);
    setIsEditCardOpen(true);
  };

  const handleCloseEditCard = () => {
    setIsEditCardOpen(false);
    setCurrentCard(null);
  };

  const handlePopUpCard = (cardList: any, event: any) => {
    const rect = event.currentTarget.closest('li').getBoundingClientRect();
    setActiveCardRect(rect);
    setIsEditCard(true);
    setIsPopupOpen(false);
    setEditingCard(cardList);
  }

  const handleArchive = () => {
    setIsArchived(true);
  };

  const handleSendToBoard = () => {
    setIsArchived(false);
  };

  const handleOpenPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenMemberPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsMemberPopupOpen(true);
  };

  const handleCloseMemberPopup = () => {
    setIsMemberPopupOpen(false);
  };

  const handleOpenLabelsPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsLabelsPopupOpen(true);
  };

  const handleCloseLabelsPopup = () => {
    setIsLabelsPopupOpen(false);
  };

  const handleOpenChecklistPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsChecklistPopupOpen(true);
  };

  const handleCloseChecklistPopup = () => {
    setIsChecklistPopupOpen(false);
  };

  const handleOpenDatesPopup = (cardlist: any) => {
    setSelectedCardList(cardlist);
    setIsDatesPopupOpen(true);
  };

  const handleCloseDatesPopup = () => {
    setIsDatesPopupOpen(false);
  };

  const handleOpenAttachPopup = (cardlist: any) => {
    setSelectedCardList(cardlist);
    setIsAttachPopupOpen(true);
  };

  const handleCloseAttachPopup = () => {
    setIsAttachPopupOpen(false);
  };

  const handleOpenSubmitPopup = (cardlist: any) => {
    setSelectedCardList(cardlist);
    setIsSubmitPopupOpen(true);
  };

  const handleCloseSubmitPopup = () => {
    setIsSubmitPopupOpen(false);
    setIsCopyPopupOpen(false);
  };

  const handleOpenCopyPopup = (cardlist: any) => {
    setSelectedCardList(cardlist);
    setIsCopyPopupOpen(true)
  };

  const handleOpenSharePopup = (cardlist: any) => {
    setSelectedCardList(cardlist);
    setIsSharePopupOpen(true);
  };

  const handleCreateNewLabel = () => {
    setIsEditLabelOpen(true);
  };

  const handleCloseEditLabel = () => {
    setIsEditLabelOpen(false);
  };


  const labels = [
    { name: 'Level 5', color: 'bg-purple-500' },
    { name: 'Level 4', color: 'bg-red-500' },
    { name: 'Level 3', color: 'bg-orange-400' },
    { name: 'Level 2', color: 'bg-yellow-300' },
    { name: 'Level 1', color: 'bg-green-500' },
  ];

  if (cardData) console.log(cardData)

  useEffect(() => {
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
                  return { ...card, cardList: cardListData || [] };
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

    fetchData();
  }, [workspaceId, boardId]);

  const handleCreateCard = async (cardName: string) => {
    try {
      await createCard(boardId, cardName);
      const updatedCardData = await fetchCard(boardId);
      if (updatedCardData && updatedCardData) {
        const updatedCardWithLists = await Promise.all(
          updatedCardData.map(async (card: any) => {
            if (card && card.id) {
              const cardListData = await fetchCardList(card.id);
              return { ...card, cardList: cardListData || [] };
            }
            return { ...card, cardList: [] };
          })
        );
        setCardData(updatedCardWithLists);
      }
    } catch (error) {
      console.error('Error creating or fetching cards:', error);
    }
  };

  const handleEditCard = async (cardId: any, cardName: string) => {
    try {
      await updateCard(cardId, cardName);
      const updatedCardData = await fetchCard(boardId);
      if (updatedCardData) {
        const updatedCardWithLists = await Promise.all(
          updatedCardData.map(async (card: any) => {
            if (card && card.id) {
              const cardListData = await fetchCardList(card.id);
              return { ...card, cardList: cardListData || [] };
            }
            return { ...card, cardList: [] };
          })
        );
        setCardData(updatedCardWithLists);
      }
    } catch (error) {
      console.error('Error updating or fetching cards:', error);
    }
  };

  const handleDeleteCard = async (card: any) => {
    try {
      await deleteCard(card.id);
      const updatedCardData = cardData.filter((item: any) => item.id !== card.id);
      setCardData(updatedCardData);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleDeleteCardList = async (card: any) => {
    try {
      await deleteCardList(card.id);
      const updatedCardData = cardData.filter((item: any) => item.id !== card.id);
      setCardData(updatedCardData);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleAddCardList = async (cardId: any, listName: string) => {
    if (listName.trim() === '') return;

    try {
      const newCardList = await createCardList(cardId, boardId, listName, '', 0, '', '');
      const updatedCardData = cardData.map(card => {
        if (card.cardId === cardId) {
          return { ...card, cardList: [...card.cardList, newCardList] };
        }
        return card;
      });

      setCardData(updatedCardData);
      setNewListName('');
      setIsAddingList(false);
    } catch (error) {
      console.error("Failed to add card list:", error);
    }
  };

  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex bg-gray-100 p-4 mb-9 justify-between items-center">
        <div className="flex items-center space-x-7">
          <h1 className="text-xl text-black font-medium">{boardName}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            <img className="w-8 h-8 rounded-full border-2 border-white" src="/api/placeholder/32/32" alt="User avatar" />
            <img className="w-8 h-8 rounded-full border-2 border-white" src="/api/placeholder/32/32" alt="User avatar" />
            <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600">+1</span>
            </div>
          </div>
          <button className="bg-gray-100 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm font-medium flex items-center">
            <i className="fas fa-share-nodes mr-2" />
            Share
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto">
        <div className="flex px-8 bg-white mb-4 h-full">
          {cardData.length === 0 ? (
            <p className="mr-6">No cards available</p>
          ) : (
            cardData.map((card, index) => (
              <div key={index} className="relative bg-white rounded-2xl shadow-xl border p-4 mr-4 w-64 flex-shrink-0">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setDropdownOpen(dropdownOpen === index ? null : index)}
                >
                  <i className="fas fa-ellipsis-h"></i>
                </button>
                <h2 className="text-xl text-center mb-6 text-gray-700">{card?.name}</h2>
                <ul className="space-y-2">
                  {card.cardList?.map((cardList: any, index: any) => (
                    <li
                      key={index}
                      className="bg-gray-100 rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition-colors duration-300"
                      onClick={() => handleOpenPopup(cardList)}
                    >
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${card?.color} mr-2`}></div>
                        <span className="text-black text-sm">{cardList?.name}</span>
                      </div>
                      <button className="text-gray-400">
                        <i className="fas fa-pencil-alt h-3 w-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePopUpCard(cardList, e);
                          }}></i>
                      </button>
                    </li>
                  ))}
                </ul>

                <button className="text-gray-500 hover:text-gray-700 mt-6 w-full text-left text-sm">
                  + Add list
                </button>
                <div className="relative">
                  {dropdownOpen === index && (
                    <div className="absolute right-0 w-28 bg-white shadow-xl rounded-lg z-10">
                      <ul className="py-2">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                          onClick={() => handleOpenEditCard(card)}
                        >
                          Edit
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                          onClick={() => handleDeleteCard(card)}
                        >
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <button
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl h-10 w-44 text-sm group hover:bg-gray-200 transition-colors duration-300 flex items-center flex-shrink-0"
            onClick={handleOpenCreateCard}
          >
            <i className="fas fa-plus h-3 w-3 mr-3 group-hover:text-purple-500 transition-colors duration-300"></i>
            <p className="group-hover:text-purple-500 transition-colors duration-300">
              Add Card
            </p>
          </button>
        </div>
      </main>

      {isCreateCardOpen && (
        <CreateCard
          workspaceId={workspaceId}
          boardId={boardId}
          onClose={handleCloseCreateCard}
          onCreateCard={handleCreateCard}
          onUpdateCard={handleEditCard}
          initialData={currentCard}
          isEditing={false}
        />
      )}

      {isEditCardOpen && (
        <CreateCard
          workspaceId={workspaceId}
          boardId={boardId}
          onClose={handleCloseEditCard}
          onCreateCard={handleCreateCard}
          onUpdateCard={handleEditCard}
          initialData={currentCard}
          isEditing={true}
        />
      )}

      {isPopupOpen && selectedCardList && (
        <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[500px] overflow-auto w-full max-w-[650px] max768:max-w-[400px]">
            <div className="navbarPopup flex flex-row w-full text-black justify-between">
              <h2 className="navbarPopup-start text-xl font-bold p-2 mb-4">
                {selectedCardList.name}
              </h2>
              <div
                className="bg-transparent border-hidden close text-lg text-black font-bold hover:bg-white"
                onClick={handleClosePopup}
              >
                <i className="fas fa-x"></i>
              </div>
            </div>
            <div className="cardlist flex gap-10 max768:flex-col">
              <div className="cardliststart w-full max768:w-full flex-[3]">
                <div className="flex flex-row gap-10 mb-3">
                  <div className="memberColor h-6 w-12 bg-red-500 rounded"></div>
                  <div className="btn hover:bg-gray-400 min-h-6 h-2 rounded w-fit bg-gray-300 border-none text-black">
                    <i className="fas fa-eye"></i>Activity
                  </div>
                </div>
                <div>
                  <h2 className="text-black mb-3 font-semibold text-lg">Description</h2>
                  <textarea
                    placeholder="Add more detail description..."
                    className="bg-grey-200 w-full h-12 mb-7 rounded text-sm pl-2 pt-1 bg-gray-300 text-black font-semibold justify-end items-start"
                  ></textarea>
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
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mb-1">
                  <i className="fas fa-user"></i>Join
                </div>
                <div className="border-b-2 border-black"></div>

                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mt-1"
                  onClick={() => handleOpenMemberPopup(selectedCardList)}>
                  <i className="fas fa-user"></i>Member
                </div>

                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                  onClick={() => handleOpenLabelsPopup(selectedCardList)}>
                  <i className="fas fa-tag"></i>Labels
                </div>


                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                  onClick={() => handleOpenChecklistPopup(selectedCardList)}>
                  <i className="fas fa-check-square"></i> Checklist
                </div>

                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                  onClick={() => handleOpenDatesPopup(selectedCardList)}>
                  <i className="fas fa-clock"></i>Dates
                </div>

                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mb-4"
                  onClick={() => handleOpenAttachPopup(selectedCardList)}>
                  <i className="fas fa-paperclip"></i>Attachment
                </div>

                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                  onClick={() => handleOpenSubmitPopup(selectedCardList)}>
                  <i className="fas fa-file-upload"></i>Submit
                </div>

                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                  onClick={() => handleOpenCopyPopup(selectedCardList)}>
                  <i className="fas fa-copy"></i>Copy
                </div>
                {!isArchived ? (
                  <div
                    className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                    onClick={handleArchive}
                  >
                    <i className="fas fa-archive"></i>Archive
                  </div>
                ) : (
                  <>
                    <div
                      className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black pr-0"
                      onClick={handleSendToBoard}
                    >
                      <i className="fas fa-undo"></i>Send to board
                    </div>
                    <div
                      className="btn hover:bg-red-700 min-h-6 h-2 bg-red-500 rounded border-none justify-start text-black"
                      onClick={handleDeleteCardList}
                    >
                      <i className="fas fa-trash"></i>Delete
                    </div>
                  </>
                )}
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" onClick={() => handleOpenSharePopup(selectedCardList)}>
                  <i className="fas fa-share"></i>Share
                </div>

                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none jsutify-start text-black">
                  Custom Field
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {isEditCard && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
            <div
              className="absolute bg-white rounded-md items-center"
              style={{
                top: `${activeCardRect.top}px`,
                left: `${activeCardRect.left}px`,
                width: `${activeCardRect.width}px`,
                height: `${activeCardRect.height}px`,
              }}
            >
              {editingCard && (
                <>
                  <div className="flex items-center px-3 py-2 mb-5 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300">
                    <div className={`w-2 h-2 rounded-full ${editingCard.color} mr-2`}></div>
                    <span className="text-black text-sm">{editingCard.name}</span>
                  </div>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditCard(false);
                    }}
                    className="block rounded-md py-2 w-24 mb-2 text-sm text-center text-white bg-purple-500 hover:bg-purple-600"
                  >
                    Save
                  </a>
                </>
              )}
            </div>
          </div>

          <div
            className="fixed z-20"
            style={{
              top: `${activeCardRect.top - 50}px`,
              left: `${activeCardRect.right}px`,
            }}
          >
            <div className="py-1 ml-5" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <a href="#" className="block mb-3 px-4 py-2 text-sm rounded-md shadow-lg text-gray-700 bg-white hover:bg-gray-100" onClick={() => {
                handleOpenPopup(editingCard);
              }}>Open Card</a>
              <a href="#" className="block my-3 px-4 py-2 text-sm rounded-md shadow-lg text-gray-700 bg-white hover:bg-gray-100" onClick={() => {
                handleOpenLabelsPopup(editingCard);
              }}>Edit Labels</a>
              <a href="#" className="block my-3 px-4 py-2 text-sm rounded-md shadow-lg text-gray-700 bg-white hover:bg-gray-100" onClick={() => {
                handleOpenMemberPopup(editingCard);
              }}>Change Member</a>
              <a href="#" className="block my-3 px-4 py-2 text-sm rounded-md shadow-lg text-gray-700 bg-white hover:bg-gray-100" onClick={() => {
                handleOpenDatesPopup(editingCard);
              }}>Edit Dates</a>
            </div>
          </div>
        </>
      )}

      {isMemberPopupOpen && selectedCardList && (
        <MemberPopup
          selectedCardList={selectedCardList}
          isMemberPopupOpen={isMemberPopupOpen}
          handleCloseMemberPopup={handleCloseMemberPopup}
        />
      )}

      {isLabelsPopupOpen && selectedCardList && (
        <LabelsPopup
          isOpen={isLabelsPopupOpen}
          onClose={handleCloseLabelsPopup}
          labels={labels}
          onCreateNewLabel={handleCreateNewLabel}
        />
      )}

      {isEditLabelOpen && (
        <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <EditLabel
            labelName=""
            labelColor="#000000"
            labelPercentage={100}
            onSave={handleCloseEditLabel}
            onCancel={handleCloseEditLabel}
          />
        </div>
      )}

      {isChecklistPopupOpen && selectedCardList && (
        <div>
          <ChecklistPopup
            isOpen={isChecklistPopupOpen}
            onClose={handleCloseChecklistPopup}
            selectedCardList={selectedCardList}
          />
        </div>
      )}

      {isDatesPopupOpen && selectedCardList && (
        <DatesPopup
          isDatesPopupOpen={isDatesPopupOpen}
          selectedCardList={selectedCardList}
          handleCloseDatesPopup={handleCloseDatesPopup}
        />
      )}

      {isAttachPopupOpen && selectedCardList && (
        <AttachPopup
          isAttachPopupOpen={isAttachPopupOpen}
          selectedCardList={selectedCardList}
          handleCloseAttachPopup={handleCloseAttachPopup}
        />
      )}

      {isSubmitPopupOpen && selectedCardList && (
        <SubmitPopup
          isSubmitPopupOpen={isSubmitPopupOpen}
          selectedCardList={selectedCardList}
          handleCloseSubmitPopup={handleCloseSubmitPopup}
        />
      )}

      {isCopyPopupOpen && selectedCardList && (
        <CopyPopup
          isCopyPopupOpen={isCopyPopupOpen}
          selectedCardList={selectedCardList}
          close={handleCloseSubmitPopup}
        />
      )}

      {isSharePopupOpen && (
        <SharePopup
          isSharePopupOpen={isSharePopupOpen}
        />
      )}
    </div>
  );
};

export default WorkspaceProject;  
