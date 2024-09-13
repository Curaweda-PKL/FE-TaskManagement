import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBoards } from '../hooks/fetchBoard';
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

  const handleOpenLabelsPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsLabelsPopupOpen(true);
  };

  const handleCloseLabelsPopup = () => {
    setIsLabelsPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenChecklistPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsChecklistPopupOpen(true);
  };

  const handleCloseChecklistPopup = () => {
    setIsChecklistPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenDatesPopup = (cardlist: any) => {
    setSelectedCardList(cardlist);
    setIsDatesPopupOpen(true);
  };

  const handleCloseDatesPopup = () => {
    setIsDatesPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenAttachPopup = (cardlist: any) => {
    setSelectedCardList(cardlist);
    setIsAttachPopupOpen(true);
  };

  const handleCloseAttachPopup = () => {
    setIsAttachPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenSubmitPopup = (cardlist: any) => {
    setSelectedCardList(cardlist);
    setIsSubmitPopupOpen(true);
  };

  const handleCloseSubmitPopup = () => {
    setIsSubmitPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenCopyPopup = (cardlist: any) => {
    setSelectedCardList(cardlist);
    setIsCopyPopupOpen(true);
  };

  const handleCloseCopyPopup = () => {
    setIsCopyPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenArchivePopup = (cardlist: any) => {
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

  const handleOpenSharePopup = (cardlist: any) => {
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

  const labels = [
    { name: 'Level 5', color: 'bg-purple-500' },
    { name: 'Level 4', color: 'bg-red-500' },
    { name: 'Level 3', color: 'bg-orange-400' },
    { name: 'Level 2', color: 'bg-yellow-300' },
    { name: 'Level 1', color: 'bg-green-500' },
  ];

  return (
    <div className="m-h-screen">
      <header className="flex bg-gray-100 p-4 justify-between items-center mb-6">
        <div className="flex items-center space-x-7">
          <h1 className="text-xl text-black font-medium">{boardName}</h1>
          <div className="flex -space-x-1">
          </div>
        </div>
        <button className="bg-purple-600 text-white px-4 py-1 rounded text-sm">
          Share
        </button>
      </header>

      <main className="flex px-8 bg-white mb-4">
        {data.card.map((workspace, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-xl border p-4 mr-4 w-64">
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
            <button className="text-gray-500 hover:text-gray-700 mt-6 w-full text-left text-sm">
              + Add card
            </button>
          </div>
        ))}
        <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl h-10 w-44 text-sm group hover:bg-gray-200 transition-colors duration-300 flex items-center">
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

                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" 
                onClick={() => handleOpenArchivePopup(selectedCardList)}>
                  <i className="fas fa-archive"></i>Archive
                </div>

                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" 
                onClick={() => handleOpenSharePopup(selectedCardList)}>
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
         isAttachPopupOpen={isArchivePopupOpen}
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
       handleCloseCopyPopup={handleCloseSubmitPopup}
       />
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
        <SharePopup
        isSharePopupOpen={isSharePopupOpen}
        />
      )}

      <button
        onClick={() => {
          navigator.clipboard.writeText(selectedCardList.link); 
          handleOpenSharePopup(); 
          setTimeout(handleCloseSharePopup, 3000); 
        }}
      >
      </button>
    </div>
  );
};

export default WorkspaceProject;  
