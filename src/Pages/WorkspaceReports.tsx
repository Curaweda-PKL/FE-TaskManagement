import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { memberWorkspace, getWorkspace, getWorkspaceRanks, getBoardRanks } from '../hooks/fetchWorkspace';
import { X } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays } from 'date-fns';


interface CardList {
  name: string;
  status: string;
  score: number;
}

interface Card {
  [key: string]: {
    cardLists: CardList[];
  };
}

interface Board {
  [key: string]: {
    cards: Card;
  };
}

interface Member {
  rank: number;
  user: string;
  boards: Board;
  totalScore: number;
}

const WorkspaceReports: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(false);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  const formattedDateRange = `${format(startDate, 'd')} - ${format(endDate, 'd')} ${format(endDate, 'MMMM yyyy').toUpperCase()}`;

  const fetchMembers = useCallback(async (start: Date, end: Date) => {
    setIsLoading(true);
    try {
      const formattedStart = format(start, 'yyyy-MM-dd');
      const formattedEnd = format(end, 'yyyy-MM-dd');
      const data = await getWorkspaceRanks(workspaceId, formattedStart, formattedEnd);
      setMembers(data);
    } catch (error) {
      console.error('Failed to get workspace members', error);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchMembers(startDate, endDate);
  }, [currentDate]); // Fetch data when currentDate changes

  const handleNavigation = (direction: string) => {
    setCurrentDate((prevDate) => {
      return direction === 'next' ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1);
    });
  };


  const handleBoardClick = (boardKey: string, memberIndex: number) => {
    setSelectedBoard(boardKey);
    setSelectedMemberIndex(memberIndex);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedBoard(null);
    setSelectedMemberIndex(null);
  };

  const renderBoardContent = () => {
    if (selectedBoard === null || selectedMemberIndex === null) return null;

    const member = members[selectedMemberIndex];
    const board = member.boards[selectedBoard];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div className='flex justify-center'>
              <h3 className="text-xl font-semibold">{selectedBoard} Content</h3>
            </div>
            <button onClick={closePopup} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <div className="flex justify-between flex-wrap gap-4 p-4">
            {Object.entries(board.cards).map(([cardKey, card]) => (
              <div key={cardKey} className="w-full sm:w-1/2 md:w-64 bg-gray-100 border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-center mb-3">{cardKey}</h4>
                <ul className="space-y-2">
                  {card.cardLists.map((list, index) => (
                    <li key={index} className="flex justify-between shadow-sm bg-white p-2 rounded-xl items-center">
                      <span>{list.name}</span>
                      <span className="text-sm text-blue-600">
                        Score: {list.score}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className='bg-white py-4 px-5 min-h-screen text-black'>
      <h1 className='text-xl font-bold mb-5'>Reports</h1>
      <div className='container mx-auto md:px-4 px-0'>
        <h2 className='text-2xl font-bold text-gray-600'>YOUR PERFORMANCE THIS WEEK, <span className='text-yellow-400'>AVERAGE</span></h2>
        <p className='text-gray-700 mt-2'>Complete task to fill the performance bar!</p>
        <div className='flex items-center mt-4'>
          <div className='w-2/4 bg-gray-300 h-2 rounded-md'>
            <div className='bg-blue-500 h-2 rounded-md' style={{ width: '40%' }}></div>
          </div>
          <span className='ml-4'>2/5</span>
        </div>
        <p className='text-gray-500 mb-11'>Bar resetting in : 4d 12h</p>

        <div className='mb-4 flex items-center text-center w-full'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search...'
              className='bg-gray-200 text-gray-500 border-gray-400 rounded-xl px-3 py-2 pl-10 text-sm sm:w-52 w-28'
            />
            <i className='fas fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => handleNavigation('prev')} className="p-2" disabled={isLoading}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-lg">{formattedDateRange}</h2>
            <button onClick={() => handleNavigation('next')} className="p-2" disabled={isLoading}>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <h2 className='ml-auto lg:text-lg sm:text-sm text-xs text-gray-500 font-bold bg-gray-200 py-2 px-4 rounded-xl'>WEEK</h2>
        </div>

        <table className='min-w-full bg-white border border-gray-300 text-center'>
          <thead>
            <tr>
              <th className='px-1 sm:py-3 py-1 border border-black text-xs sm:text-sm font-bold text-gray-900'>RANK</th>
              <th className='px-1 sm:py-3 py-1 border border-black text-xs sm:text-sm font-bold text-gray-900'>USERS</th>
              <th className='px-1 sm:py-3 py-1 border border-black text-xs sm:text-sm font-bold text-gray-900'>TASK</th>
              <th className='px-1 sm:py-3 py-1 border border-black text-xs sm:text-sm font-bold text-gray-900'>SCORE</th>
              <th className='px-1 sm:py-3 py-1 border border-black text-xs sm:text-sm font-bold text-gray-900'>AVERAGE</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index}>
                <td className='px-1 sm:py-3 py-1 w-20 border border-black text-xs sm:text-sm'>{member.rank}</td>
                <td className='px-1 sm:py-3 py-1 w-15 border border-black text-xs sm:text-sm'>{member.user}</td>
                <td className='px-1 sm:py-3 py-1 w-72 border border-black text-xs sm:text-sm'>
                  <div className="flex flex-col gap-2">
                    {member.boards && typeof member.boards === 'object' ? (
                      Object.keys(member.boards).map((boardKey, boardIndex) => (
                        <div
                          key={boardIndex}
                          className='group relative p-1 h-10 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer overflow-hidden'
                          onClick={() => handleBoardClick(boardKey, index)}
                        >
                          <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200'></div>
                          <h5 className='text-white relative z-10 text-start'>{boardKey}</h5>
                        </div>
                      ))
                    ) : (
                      <span>No tasks available</span>
                    )}
                  </div>
                </td>
                <td className='px-1 sm:py-3 py-1 border border-black text-xs sm:text-sm'>{member.totalScore}</td>
                <td className='px-1 sm:py-3 py-1 border border-black text-xs sm:text-sm'>
                  {member.boards && Object.keys(member.boards).length > 0 ? (member.totalScore / Object.keys(member.boards).length).toFixed(2) : '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderBoardContent()}
      </div>
    </div>
  );
};

export default WorkspaceReports;
