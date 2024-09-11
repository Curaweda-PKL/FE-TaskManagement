import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBoards } from '../hooks/fetchBoard';
import EditLabel from '../Component/EditLabel';

const WorkspaceProject = () => {
  const { workspaceId, boardId } = useParams<{ workspaceId: string; boardId: string }>();
  const [boardName, setBoardName] = useState<string>('');
  const [boards, setBoards] = useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);
  const [isLabelsPopupOpen, setIsLabelsPopupOpen] = useState(false);
  const [isEditLabelOpen, setIsEditLabelOpen] = useState(false);
  const [isChecklistPopupOpen, setIsChecklistPopupOpen] = useState(false); 
  const [isDatesPopupOpen, setIsDatesPopupOpen] = useState(false);
  const [isAttachPopupOpen, setIsAttachPopupOpen] = useState(false);
  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState(false);
  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState(false);
  const [isArchivePopupOpen, setIsArchivePopupOpen] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [selectedCardList, setSelectedCardList] = useState(null);

  useEffect(() => {
    const getBoards = async () => {
      if (workspaceId) {
        try {
          const data = await fetchBoards(workspaceId);
          setBoards(data);
          const board = data.find((b: any) => b.id === boardId);
          setBoardName(board ? board.name : 'Project');
        } catch (error) {
          console.error('Failed to fetch boards:', error);
        }
      }
    };

    getBoards();
  }, [workspaceId, boardId]);

  const data = {
    card: [
      {
        workspace: "workspace1",
        color: "bg-red-500",
        cardList: [
          {
            members: [
              { name: 'fursan' },
              { name: 'satriya' }
            ],
            title: 'cardList1'
          },
          {
            members: [],
            title: 'cardList2'
          }
        ]
      },
      {
        workspace: "workspace1",
        color: "bg-red-500",
        cardList: [
          {
            members: [
              { name: 'fursan' },
              { name: 'satriya' }
            ],
            title: 'cardList1'
          },
          {
            members: [],
            title: 'cardList2'
          }
        ]
      },
      {
        workspace: "workspace2",
        color: "bg-yellow-500",
        cardList: [
          {
            members: [
              { name: 'Rayndra' },
              { name: 'Ajib' }
            ],
            title: 'cardList1'
          },
          {
            members: [
              { name: 'Salwa' },
              { name: 'Masnur' }
            ],
            title: 'cardList2'
          }
        ]
      }
    ]
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
    setSelectedCardList(null);
  };

  const handleOpenLabelsPopup = (cardList) => {
    setSelectedCardList(cardList);
    setIsLabelsPopupOpen(true);
  };

  const handleCloseLabelsPopup = () => {
    setIsLabelsPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenChecklistPopup = (cardList) => {
    setSelectedCardList(cardList);
    setIsChecklistPopupOpen(true);
  };

  const handleCloseChecklistPopup = () => {
    setIsChecklistPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenDatesPopup = (cardlist) => {
    setSelectedCardList(cardlist);
    setIsDatesPopupOpen(true);
  };

  const handleCloseDatesPopup = () => {
    setIsDatesPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenAttachPopup = (cardlist) => {
    setSelectedCardList(cardlist);
    setIsAttachPopupOpen(true);
  };

  const handleCloseAttachPopup = () => {
    setIsAttachPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenSubmitPopup = (cardlist) => {
    setSelectedCardList(cardlist);
    setIsSubmitPopupOpen(true);
  };

  const handleCloseSubmitPopup = () => {
    setIsSubmitPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenCopyPopup = (cardlist) => {
    setSelectedCardList(cardlist);
    setIsCopyPopupOpen(true);
  };

  const handleCloseCopyPopup = () => {
    setIsCopyPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenArchivePopup = (cardlist) => {
    setSelectedCardList(cardlist);
    setIsArchivePopupOpen(true);
  };

  const handleCloseArchivePopup = () => {
    setIsArchivePopupOpen(false);
    setSelectedCardList(null);
  };

  const handleButtonClick = () => {
    setIsArchived(!isArchived); 
  };

  const handleOpenSharePopup = (cardlist) => {
    setSelectedCardList(cardlist);
    setIsSharePopupOpen(true);
  };

  const handleCloseSharePopup = () => {
    setIsSharePopupOpen(false);
    setSelectedCardList(null);
  };

  const handleCreateNewLabel = () => {
    setIsEditLabelOpen(true);
  };

  const handleCloseEditLabel = () => {
    setIsEditLabelOpen(false);
  };
  
  return (
    <>
      <header className="fixed right-0 flex justify-between h-16 w-full bg-gray-100 p-4 items-center mb-6">
        <div className="flex items-center space-x-7">
          <h1 className="text-xl md:ml-64 text-black font-medium">{boardName}</h1>
        </div>
        <div className="flex items-center space-x-4">
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
        <button className="bg-white text-gray-700 px-3 py-1.5 rounded-lg shadow-md text-sm font-medium flex items-center">
        <i className="fa-solid mr-2 fa-share-nodes"></i>
          Share
        </button>
        </div>
      </header>
    <div className="m-h-screen">
      <main className="flex x px-8 bg-white mb-4">
        {data.card.map((workspace, index) => (
          <div key={index} className="bg-white mt-24 rounded-2xl shadow-xl border p-4 mr-4 min-w-64">
            <h2 className="text-xl text-center mb-6 text-gray-700">{workspace.workspace}</h2>
            <ul className="space-y-2">
              {workspace.cardList.map((cardList, index) => (
                <li
                  key={index}
                  className="bg-gray-100 rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition-colors duration-300"
                  onClick={() => handleOpenPopup(cardList)}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${workspace.color} mr-2`}></div>
                    <span className="text-black text-sm">{cardList.title}</span>
                  </div>
                  <button className="text-gray-400">
                    <i className="fas fa-pencil-alt h-3 w-3"></i>
                  </button>
                </li>
              ))}
            </ul>
            <button className="text-gray-500 hover:bg-gray-200 rounded-lg px-3 py-2 hover:text-gray-700 mt-6 w-full text-left text-sm transition-colors duration-300">
              + Add card
            </button>
          </div>
        ))}
        <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl h-fit min-w-44 text-sm group hover:bg-gray-200 transition-colors duration-300 flex items-center mt-24">
          <i className="fas fa-plus h-3 w-3 mr-3 group-hover:text-purple-500 transition-colors duration-300"></i>
          <p className='group-hover:text-purple-500 transition-colors duration-300'>
            Add Another List
          </p>
        </button>
      </main>

      {isPopupOpen && selectedCardList && (
        <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-5 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[500px] overflow-auto w-full max-w-[650px] max768:max-w-[400px]">
            <div className="navbarPopup flex flex-row w-full text-black justify-between">
              <h2 className="navbarPopup-start text-xl font-bold p-2 mb-4">
                {selectedCardList.title}
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
                  <div className='grid grid-cols-2 gap-2 mb-10'>
                    <div>
                      <h4 className="text-black text-[12px] font-semibold">Effort</h4>
                      <select className='rounded-md bg-gray-300 text-black w-full text-sm font-semibold py-1 px-2' name="" id="">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="text-black text-[12px] font-semibold">Status</h4>
                      <select className='rounded-md bg-gray-300 text-black w-full text-sm font-semibold py-1 px-2' name="" id="">
                        <option value="1">To Do</option>
                        <option value="2">In Progress</option>
                        <option value="3">Done</option>
                        <option value="4">In Review</option>
                        <option value="5">Approved</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="text-black text-[12px] font-semibold">Risk</h4>
                      <select className='rounded-md bg-gray-300 text-black w-full text-sm font-semibold py-1 px-2' name="" id="">
                        <option value="1">Highest</option>
                        <option value="2">High</option>
                        <option value="3">Medium</option>
                        <option value="4">Low</option>
                        <option value="5">Lowest</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="text-black text-[12px] font-semibold">Project</h4>
                      <select className='rounded-md bg-gray-300 text-black w-full text-sm font-semibold py-1 px-2' name="" id="">
                      </select>
                    </div>
                  </div>
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
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mt-1" onClick={() => handleOpenMemberPopup(selectedCardList)}>
                  <i className="fas fa-user"></i>Member
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" onClick={() => handleOpenLabelsPopup(selectedCardList)}>
                  <i className="fas fa-tag"></i>Labels
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" onClick={() => handleOpenChecklistPopup(selectedCardList)}>
                  <i className="fas fa-check-square"></i>Checklist
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" onClick={() => handleOpenDatesPopup(selectedCardList)}>
                  <i className="fas fa-clock"></i>Dates
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mb-4" onClick={() => handleOpenAttachPopup(selectedCardList)}>
                  <i className="fas fa-paperclip"></i>Attachment
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" onClick={() => handleOpenSubmitPopup(selectedCardList)}>
                  <i className="fas fa-file-upload"></i>Submit
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" onClick={() => handleOpenCopyPopup(selectedCardList)}>
                  <i className="fas fa-copy"></i>Copy
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" onClick={() => handleOpenArchivePopup(selectedCardList)}>
                  <i className="fas fa-archive"></i>Archive
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" onClick={()=> handleOpenSharePopup(selectedCardList)}>
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

{isMemberPopupOpen && selectedCardList && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Members of {selectedCardList.title}</h2>
            <ul className="space-y-2">
              {selectedCardList.members.map((member, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{member.name}</span>
                  <button className="ml-2">
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                </li>
              ))}
            </ul>
            <button className="mt-4 bg-gray-300 text-black p-2 rounded w-full">Add new member</button>
            <button
              onClick={handleCloseMemberPopup}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

{isLabelsPopupOpen && selectedCardList && (
        <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg h-fit w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={handleCloseLabelsPopup}
            >
              <i className="fas fa-times"></i>
            </button>

            <h2 className="text-lg font-bold mb-4 text-center">Label</h2>
            <ul className="space-y-2">
              {[
                { name: 'Level 5', color: 'bg-purple-500' },
                { name: 'Level 4', color: 'bg-red-500' },
                { name: 'Level 3', color: 'bg-orange-400' },
                { name: 'Level 2', color: 'bg-yellow-300' },
                { name: 'Level 1', color: 'bg-green-500' },
              ].map((label, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center w-full">
                    <input type="checkbox" className="mr-2 accent-gray-500" />
                    <div className={`w-full h-8 rounded-md ${label.color} flex items-center px-2`}>
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
              onClick={handleCreateNewLabel}
            >
              Create new label
            </button>
          </div>
        </div>
      )}

{isChecklistPopupOpen && selectedCardList && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
    <div className="relative bg-white p-4 rounded-lg shadow-lg w-80">
      <button 
        onClick={handleCloseChecklistPopup} 
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <h2 className="text-center text-sm font-bold mb-4">Add Checklist</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input 
          type="text" 
          placeholder="Checklist" 
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      <div className="flex justify-center mt-4">
        <button 
          onClick={handleCloseChecklistPopup} 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  </div>
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



{isDatesPopupOpen && selectedCardList && (
  <div
    className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100"
    onClick={handleCloseDatesPopup} 
  >
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-80 relative"
      onClick={(e) => e.stopPropagation()} 
    >
      <button
        onClick={handleCloseDatesPopup}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <h2 className="text-xl font-bold mb-4">
        {selectedCardList.title} - Dates
      </h2>
      <div className="flex justify-between items-center mb-4">
        <button className="text-gray-500">&lt;</button>
        <span className="text-gray-800 font-semibold">August 2024</span>
        <button className="text-gray-500">&gt;</button>
      </div>
      <div className="grid grid-cols-7 text-center text-gray-600 mb-4">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>

        {Array.from({ length: 31 }, (_, index) => (
          <button
            key={index}
            className={`py-2 ${
              index === 9 ? 'bg-blue-200 text-blue-600' : index === 25 ? 'bg-blue-600 text-white' : 'text-gray-800'
            } rounded-full hover:bg-gray-200`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="flex items-center mb-4">
        <input type="checkbox" id="due-date-checkbox" className="mr-2" />
        <label htmlFor="due-date-checkbox" className="text-gray-700">Due Date</label>
      </div>
      <div className="flex space-x-2 mb-4">
        <input type="date" className="border border-gray-300 p-2 rounded w-full" placeholder="MM/DD/YYYY" />
        <input type="time" className="border border-gray-300 p-2 rounded w-full" />
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="reminder" className="text-gray-700 mb-2">Set Due Date Reminder</label>
        <select id="reminder" className="border border-gray-300 p-2 rounded w-full text-gray-800">
          <option value="1">1 - Day before</option>
          {/* Additional options can be added here */}
        </select>
      </div>
      <div className="flex justify-between mt-4">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Save</button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Remove</button>
      </div>
    </div>
  </div>
)}


{isAttachPopupOpen && selectedCardList && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
    <div className="relative bg-white p-4 rounded-lg shadow-lg w-80">
      <button 
        onClick={handleCloseAttachPopup} 
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <h2 className="text-center text-sm font-bold mb-4">Attach</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attach a file from your computer
        </label>
        <div className="bg-gray-200 text-center text-gray-600 text-sm p-4 rounded-lg cursor-pointer">
          Choose a file
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search or paste a link
        </label>
        <div className="bg-gray-200 text-sm p-2 rounded-lg cursor-pointer">
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Display text (optional)
        </label>
        <div className="bg-gray-200 text-sm p-2 rounded-lg cursor-pointer">
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <button 
          onClick={handleCloseAttachPopup} 
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
          Insert
        </button>
      </div>
    </div>
  </div>
)}


{isSubmitPopupOpen && selectedCardList && (
  <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
    <div className="relative bg-white p-4 rounded-lg shadow-lg w-80">
      <button
      onClick={handleCloseSubmitPopup} 
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <h2 className="text-center text-sm font-bold mb-4">Submit</h2>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-2">Your work</span>
        <div className="bg-gray-200 text-center text-gray-600 text-sm p-4 rounded-lg cursor-pointer">
          Add or create
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={handleCloseSubmitPopup} 
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded"
        >
          Mark as done
        </button>
      </div>
    </div>
  </div>
)}


{isCopyPopupOpen && selectedCardList && (
  <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 className="text-center text-sm font-bold mb-4">Card Copy</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input 
          type="text" 
          className="block w-full text-sm text-gray-500 bg-gray-200 rounded-lg focus:outline-none" 
          placeholder="Akhson" 
          disabled
        />
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-2">Keep...</span>
        <div className="space-y-2">
          <div className="flex items-center">
            <input type="checkbox" checked className="form-checkbox h-4 w-4 text-purple-600 rounded" />
            <label className="ml-2 text-sm text-gray-700">Members</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" checked className="form-checkbox h-4 w-4 text-purple-600 rounded" />
            <label className="ml-2 text-sm text-gray-700">Attachments</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" checked className="form-checkbox h-4 w-4 text-purple-600 rounded" />
            <label className="ml-2 text-sm text-gray-700">Comments</label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Copy to...</label>
        <input 
          type="text" 
          className="block w-full text-sm text-gray-500 bg-gray-200 rounded-lg focus:outline-none mb-4" 
          placeholder="Project 1" 
          disabled
        />
        <div className="flex justify-between space-x-2">
          <select className="block w-1/2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none">
            <option>Team</option>
          </select>
          <select className="block w-1/2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none">
            <option>1</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button 
          onClick={handleCloseCopyPopup} 
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded"
        >
          Create
        </button>
      </div>
    </div>
  </div>
)}

{isArchivePopupOpen && selectedCardList && (
   <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100"> 
   <div className="bg-white p-6 rounded-lg shadow-lg w-96"> 
    <h2 className="text-xl font-bold mb-4">{selectedCardList.title} - Archive</h2> 
    <p className="mb-4 text-sm text-gray-700"> Are you sure you want to archive this card? You can restore it later from the archived items. </p> 
    <div className="flex justify-end gap-2 mt-4"> 
      <button onClick={handleCloseArchivePopup} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded" > Cancel </button>
       <button onClick={handleOpenArchivePopup} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" > Delete </button> 
       </div> 
       </div> 
       </div>
        )}

  {isSharePopupOpen && (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
    <i className="fas fa-copy mr-2"></i>Link copied to clipboard!
  </div>
)}

<button 
  onClick={() => {
    navigator.clipboard.writeText(selectedCardList.link); // Copy link to clipboard
    handleOpenSharePopup(); // Show notification popup
    setTimeout(handleCloseSharePopup, 3000); // Automatically close popup after 3 seconds
  }} 
  >
</button>
    </div>
    </>
  );
};

export default WorkspaceProject;  
