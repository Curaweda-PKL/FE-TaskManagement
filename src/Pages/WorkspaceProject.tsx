import { useState } from 'react';

const WorkspaceProject = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);
  const [selectedCardList, setSelectedCardList] = useState(null);

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

  const handleOpenPopup = (cardList : any) => {
    setSelectedCardList(cardList);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCardList(null);
  };

  const handleOpenMemberPopup = (cardList : any) => {
    setSelectedCardList(cardList);
    setIsMemberPopupOpen(true);
  };

  const handleCloseMemberPopup = () => {
    setIsMemberPopupOpen(false);
    setSelectedCardList(null);
  };

  return (
    <div className="m-h-screen">
      <header className="flex bg-gray-100 p-4 justify-between items-center mb-6">
        <div className="flex items-center space-x-7">
          <h1 className="text-xl text-black font-medium">Project 1</h1>
          <i className="fas fa-star text-gray-400"></i>
          <div className="flex -space-x-1">
            <i className="fas fa-user-friends text-gray-400"></i>
          </div>
        </div>
        <button className="bg-purple-600 text-white px-4 py-1 rounded text-sm">
          Share
        </button>
      </header>

      <main className="flex px-8 bg-white mb-4">
        {data.card.map((workspace, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-xl border p-4 mr-4 w-64">
            <h2 className="text-xl text-center p-5 mb-4 text-gray-700">{workspace.workspace}</h2>
            <ul className="space-y-2">
              {workspace.cardList.map((cardList, index) => (
                <li
                  key={index}
                  className="bg-gray-100 rounded-full p-2 flex justify-between items-center btn"
                  onClick={() => handleOpenPopup(cardList)}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${workspace.color} mr-2`}></div>
                    <span className="text-black text-sm">{cardList.title}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
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
        <button className="bg-gray-200 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl h-10 w-44 text-sm">
          <i className="fas fa-plus h-3 w-3 mr-3"></i>
          Add another list
        </button>
      </main>

      {isPopupOpen && selectedCardList && (
        <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
          <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
            <div className="navbarPopup flex flex-row w-full text-black justify-between">
              <h2 className="navbarPopup-start text-xl font-bold p-2 mb-4">
                {selectedCardList.title}
              </h2>
              <div
                className="btn bg-transparent border-hidden close text-lg text-black font-bold hover:bg-white"
                onClick={handleClosePopup}
              >
                <i className="fas fa-x"></i>
              </div>
            </div>
            <div className="cardlist flex flex-row">
              <div className="cardliststart">
                <div className="flex flex-row gap-10 mb-3">
                  <div className="memberColor h-6 w-12 bg-red-500 rounded"></div>
                  <div className="btn hover:bg-gray-400 min-h-6 h-2 rounded w-fit bg-gray-300 border-none text-black">
                    <i className="fas fa-eye"></i>Activity
                  </div>
                </div>
                <h2 className="text-black mb-3 font-semibold">Description</h2>
                <textarea
                  placeholder="Add more detail description..."
                  className="bg-grey-200 w-80 h-12 mb-6 rounded text-[11px] pl-2 pt-1 bg-gray-300 text-black font-semibold justify-end items-start"
                ></textarea>
                <div className="activity flex gap-36">
                  <span className="text-black font-semibold">Activity</span>
                  <div className="btn hover:bg-gray-400 btn-neutral h-6 min-h-6 bg-gray-300 border-none text-black">
                    Show Details
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="h-7 w-80 mt-6 rounded text-xs p-2 bg-gray-300 text-black font-semibold"
                />
              </div>
              <div className="cardlistend flex flex-col gap-1 pl-20 justify-start">
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mb-1">
                  <i className="fas fa-user"></i>Join
                </div>
                <div className="border-b-2 border-black"></div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mt-1" onClick={() => handleOpenMemberPopup(selectedCardList)}>
                  <i className="fas fa-user"></i>Member
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black">
                  <i className="fas fa-tag"></i>Labels
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black">
                  <i className="fas fa-check-square"></i>Checklist
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black">
                  <i className="fas fa-clock"></i>Dates
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mb-4">
                  <i className="fas fa-paperclip"></i>Attachment
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black">
                  <i className="fas fa-file-upload"></i>Submit
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black">
                  <i className="fas fa-copy"></i>Copy
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black">
                  <i className="fas fa-archive"></i>Archive
                </div>
                <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black">
                  <i className="fas fa-share"></i>Share
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMemberPopupOpen && selectedCardList && (
        <div className="containerPopup fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-100">
          <div className="bg-white p-6 rounded-lg shadow-lg h-fit mr-44 w-96">
            <div className="navbarPopup flex flex-row text-black justify-between">
              <h2 className="navbarPopup-start text-xl font-bold justify-center h-11">
                Members
              </h2>
              <div
                className="btn bg-transparent border-hidden close text-lg text-black font-bold hover:bg-white"
                onClick={handleCloseMemberPopup}
              >
                <i className="fas fa-times"></i>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search members"
              className="rounded h-10 text-sm p-2 mb-4 bg-gray-300 text-black font-semibold"
            />
            <ul>
              {selectedCardList.members.length > 0 ? (
                selectedCardList.members.map((member, index) => (
                  <li key={index} className="text-black mb-2 p-3 h-10 flex items-center bg-gray-400 rounded">
                    <i className="fas fa-user mr-2"></i>{member.name}
                  </li>
                ))
              ) : (
                <li className="text-black">No members in this card.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceProject;
