import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkspaceRanks } from '../hooks/fetchWorkspace';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { useMemo } from 'react';
import { getTaskBar } from '../hooks/ApiReport';

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
  const { workspaceId } = useParams<{ workspaceId: any }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRangeType, setDateRangeType] = useState<'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [taskBarData, setTaskBarData] = useState<any | null>(null)

  useEffect(() => {
    const handlegetTaskBarData = async () => {
      setTaskBarData(await getTaskBar(workspaceId))

    }
    handlegetTaskBarData()
  }, []);

  const data = taskBarData
  const statusCounts = data?.statusCounts || [];
  const allTaskCount = data?.allTaskCount || 0;

  // Calculate completed tasks (DONE or APPROVED status)
  const completedTasks = statusCounts.reduce((total: any, item: { status: string; count: any; }) => {
    if (item?.status === 'DONE' || item?.status === 'APPROVED') {
      return total + (item.count || 0);
    }
    return total;
  }, 0);

  // Calculate completion percentage, handle division by zero
  const completionPercentage = allTaskCount === 0 ? 0 : (completedTasks / allTaskCount) * 100;

  // Determine performance level
  const getPerformanceLevel = () => {
    if (allTaskCount === 0) return { text: 'NO TASKS YET', color: 'text-gray-500' };
    if (completionPercentage >= 80) return { text: 'EXCELLENT', color: 'text-green-500' };
    if (completionPercentage >= 60) return { text: 'GOOD', color: 'text-blue-500' };
    if (completionPercentage >= 40) return { text: 'AVERAGE', color: 'text-yellow-500' };
    return { text: 'NEEDS IMPROVEMENT', color: 'text-red-500' };
  };

  const performance = getPerformanceLevel();

  const startDate = useMemo(() => {
    return dateRangeType === 'week'
      ? startOfWeek(currentDate, { weekStartsOn: 1 })
      : startOfMonth(currentDate);
  }, [dateRangeType, currentDate]);

  const endDate = useMemo(() => {
    return dateRangeType === 'week'
      ? endOfWeek(currentDate, { weekStartsOn: 1 })
      : endOfMonth(currentDate);
  }, [dateRangeType, currentDate]);

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
  }, [dateRangeType, startDate, endDate, fetchMembers]);

  const handleDateRangeChange = () => {
    setDateRangeType(dateRangeType === 'week' ? 'month' : 'week');
  };

  const formattedDateRange = `${format(startDate, 'd')} - ${format(endDate, 'd')} ${format(endDate, 'MMMM yyyy').toUpperCase()}`;

  const handleNavigation = (direction: 'next' | 'prev') => {
    setCurrentDate((prevDate) => {
      if (dateRangeType === 'month') {
        return direction === 'next' ? addMonths(prevDate, 1) : subMonths(prevDate, 1);
      } else {
        return direction === 'next' ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1);
      }
    });
  };

  const filteredMembers = members.filter((member) => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    return searchTerms.every((term: string) => {
      return (
        member.user.toLowerCase().includes(term) ||
        member.rank.toString().toLowerCase().includes(term) ||
        (member.boards && typeof member.boards === 'object' &&
          Object.keys(member.boards).some((boardKey) =>
            boardKey.toLowerCase().includes(term)
          )
        )
      );
    });
  });

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
    if (!isPopupOpen || selectedBoard === null || selectedMemberIndex === null) return null;

    const member = members[selectedMemberIndex];
    const board = member.boards[selectedBoard];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div className='flex justify-center'>
              <h3 className="text-xl font-semibold">{selectedBoard}</h3>
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
                    <li key={index} className="flex flex-col shadow-sm bg-white p-2 rounded-xl items-start gap-2">
                      <span>{list.name}</span>
                      <div className='flex justify-between w-full'>
                        <span className="text-xs">
                          Status: <span className='text-green-600'>{list.status}</span>
                        </span>
                        <span className="text-xs">
                          Score: <span className='text-red-600'>{list.score}</span>
                        </span>
                      </div>
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

  const renderControls = () => (
    <div className='flex items-center max850:w-full'>
      <div className="flex items-center space-x-4">
        <button onClick={() => handleNavigation('prev')} className="" disabled={isLoading}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="font-bold sm:text-lg text-md">
          {formattedDateRange}
        </h2>
        <button onClick={() => handleNavigation('next')} className="" disabled={isLoading}>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <button
        className={`btn bg-purple-500 btn-sm sm:btn-md hover:bg-purple-800 border-none text-white font-bold ${dateRangeType === 'month' ? 'active' : ''}`}
        onClick={handleDateRangeChange}
      >
        {dateRangeType === 'month' ? 'MONTH' : 'WEEK'}
      </button>
    </div>
  );

  const renderTableContent = () => {
    if (!members || members.length === 0) {
      return (
        <div className='container mx-auto md:px-4 px-0'>
          <div className='mb-4 flex justify-end w-full min-w-1 mt-10'>
            {renderControls()}
          </div>
          <div className="bg-white p-8 mt-4">
            <div className="flex flex-col items-center justify-center py-12">
              <i className='fas fa-sharp fa-light fa-table text-4xl text-gray-400 mb-3'></i>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">No Reports Available</h2>
              <p className="text-gray-500">There are no reports for this period. Please check again later.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='container mx-auto md:px-4 px-0'>
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-gray-700 text-lg font-medium">
                YOUR PERFORMANCE THIS WEEK, <span className={performance.color}>{performance.text}</span>
              </h2>
              <p className="text-gray-600 text-sm">
                {allTaskCount === 0
                  ? "No tasks assigned yet. Tasks will appear here when assigned."
                  : "Complete task to fill the performance bar!"}
              </p>
            </div>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                className={`${allTaskCount === 0 ? 'bg-gray-400' : 'bg-blue-500'}`}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className='flex justify-between'>
            <div className="text-sm text-gray-600">
              Bar resetting in: {data?.resettingIn || 'N/A'}
            </div>
            <div className="text-gray-600 right-0 relative">
              {completedTasks}/{allTaskCount}
            </div>
          </div>
        </div>
        <div className='mb-4 flex sm:items-center text-center w-full min-w-1 mt-10 gap-5 sm:flex-row justify-between max850:flex-col-reverse'>
          <div className='relative justify-start max850:w-full'>
            <input
              type='text'
              placeholder='Search...'
              className='bg-gray-200 text-gray-500 border-gray-400 rounded-xl px-3 py-2 pl-10 text-sm w-full'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className='fas fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
          </div>
          {renderControls()}
        </div>
        <div className='w-full overflow-auto'>
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
              {filteredMembers.map((member, index) => (
                <tr key={index}>
                  <td className='px-1 sm:py-3 py-1 w-20 border border-black text-xs sm:text-sm'>{member.rank}</td>
                  <td className='px-1 sm:py-3 py-1 w-15 border border-black text-xs sm:text-sm'>{member.user}</td>
                  <td className='px-1 sm:py-3 py-1 w-72 border border-black text-xs sm:text-sm'>
                    <div className='text-start'>Boards:</div>
                    <div className="flex flex-wrap gap-2">
                      {member.boards && typeof member.boards === 'object' ? (
                        Object.keys(member.boards).map((boardKey, boardIndex) => (
                          <h5 key={boardIndex} onClick={() => handleBoardClick(boardKey, index)} className='underline cursor-pointer text-start'>
                            {boardKey},
                          </h5>
                        ))
                      ) : (
                        <span>No tasks available</span>
                      )}
                    </div>
                  </td>
                  <td className='px-1 sm:py-3 py-1 border border-black text-xs sm:text-sm'>{member.totalScore}</td>
                  <td className='px-1 sm:py-3 py-1 border border-black text-xs sm:text-sm'>
                    {member.boards && Object.keys(member.boards).length > 0
                      ? ((member.totalScore +
                        Object.values(member.boards).reduce((acc, board) =>
                          acc + Object.values(board.cards).reduce((cardAcc, card) =>
                            cardAcc + card.cardLists.length, 0), 0)) / 2
                      ).toFixed(2)
                      : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className='bg-white py-4 px-5 min-h-screen text-black'>
      <div>
        <h1 className='text-xl font-bold mb-5'>Reports</h1>
        {renderTableContent()}
        {renderBoardContent()}
      </div>
    </div>
  );
};
export default WorkspaceReports;