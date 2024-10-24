import React, { useEffect, useState } from 'react';
import Sticker from '../assets/Media/sticker.svg';
import { getHighlightWorkspace, postHighlightCommentReply } from '../hooks/ApiHighlight';
import { useParams } from 'react-router-dom';


const WorkspaceHighlights: React.FC = () => {
  const [highlightUser, setHighlightUser] = useState<any>(null);
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [content, setContent] = useState<string>('');

  const handleSave = async (highlight: any) => {
    await postHighlightCommentReply(highlight.id, content);
    await fetchHighlightUser();
    setReplyStates((prev) => ({ ...prev, [highlight.id]: false }));
    setContent('');
  };

  const fetchHighlightUser = async () => {
    if (workspaceId) {
      const user = await getHighlightWorkspace(workspaceId); // Menggunakan workspaceId
      setHighlightUser(user);
    }
  };
  useEffect(() => {
    fetchHighlightUser();
  }, [workspaceId]);

  const [replyStates, setReplyStates] = useState<{ [key: number]: boolean }>({});

  const toggleReply = (index: number) => {
    setReplyStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('highlightsDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('highlightsDismissed', 'true');
    setIsDismissed(true);
  };
  return (
    <div>
      <div className="max-w-md mt-8 font-sans text-black">
        {!isDismissed && (
          <div className="max-w-md mt-8 font-sans text-black">
            <div className="bg-white border shadow-md mb-4">
              <div className="flex p-7">
                <div className="bg-red-500 w-28 h-auto flex flex-col justify-between p-2">
                </div>
                <div className="ml-4 flex flex-col justify-between">
                  <h2 className="text-lg font-bold mb-2">Highlights</h2>
                  <p className="text-sm text-gray-600 mb-3">Stay up to date with activity from your workspace and boards</p>
                  <button
                    className="w-full py-2 font-semibold bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    onClick={handleDismiss}
                  >
                    Got it! Dismiss this
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='flex flex-col gap-10'>
          {(highlightUser || []).map((highlight: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-orange-400 p-5">
                <div className='bg-gray-200 p-3 rounded-lg'>
                  <span className="font-semibold text-gray-600">{highlight.cardList.name}</span>
                  <div className="flex items-center text-xs mt-1">
                    <i className="fas fa-eye text-xs text-gray-600 mr-2" />
                    <span className="ml-2 bg-yellow-200 text-yellow-800 border-yellow-800 border px-2 py-0.5 rounded-full text-xs">
                      <i className='fas fa-clock mr-2' />Sep 12 - Sep 13
                    </span>
                    <i className="fas fa-message text-xs text-gray-600 ml-4" />
                    <span className="ml-1">{highlight.replies?.length || 0}</span>
                  </div>
                </div>
                <p className="text-md mt-3 text-white">
                  {highlight.workspace.name} <span className='ml-2 mr-2'>|</span>{highlight.board.name} : {highlight.card.name}
                </p>
              </div>

              <div className="p-4 border-black border rounded-b-lg">
                {/* Main comment */}
                <div className="flex items-start">
                  <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold">{highlight.author.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(highlight.createdAt)}</p>
                    <p className="mt-2 text-sm">{highlight.content}</p>
                    {highlight.sticker && <img className='mt-2' src={highlight.sticker} alt="Sticker" />}
                  </div>
                </div>

                {/* Replies section */}
                {highlight.replies && highlight.replies.length > 0 && (
                  <div className="ml-12 mt-4 space-y-4 border-l-2 border-gray-200">
                    {highlight.replies
                      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((reply: any) => (
                        <div key={reply.id} className="flex items-start pl-4">
                          <img src="https://via.placeholder.com/40" alt="User " className="w-8 h-8 rounded-full" />
                          <div className="ml-3 flex-1">
                            <p className="font-semibold text-sm">{reply.user.name}</p>
                            <p className="text-xs text-gray-500">{formatDate(reply.createdAt)}</p>
                            <p className="mt-1 text-sm">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Reply button */}
                <button
                  onClick={() => toggleReply(index)}
                  className="mt-3 flex w-[99%] p-2 items-center justify-center text-sm text-gray-600 bg-gray-200 hover:text-gray-800"
                >
                  <i className="fas fa-paper-plane mr-2" />
                  Reply
                </button>

                {/* Reply Input Section */}
                {replyStates[index] && (
                  <div className="mt-3 flex items-start gap-3 border-t pt-3">
                    <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="relative w-full">
                        <textarea
                          placeholder="Ketik pesan anda..."
                          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                          rows={3}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            onClick={() => {
                              setReplyStates((prev) => ({ ...prev, [index]: false }));
                              setContent('');
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-orange-500"
                            onClick={() => handleSave(highlight)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    /*<div className="bg-white min-h-screen">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="bg-white rounded-lg shadow-sm mr-80">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-full h-48">
                <img src={Wolf} alt="Workspace Highlight" className="w-full h-full object-cover rounded-t-lg" />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Stay up to date</h2>
                <p className="text-gray-600 max-w-md">
                  Invite people to boards and cards, leave comments, add due dates, and we'll show the most important activity here.
                </p>
              </div>
            </div>
          </div>
        </div>
        <SideTask />
      </div>*/
  );
};

export default WorkspaceHighlights;