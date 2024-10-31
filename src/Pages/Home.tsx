import React, { useEffect, useState } from 'react';
import { getHighlightUser, postHighlightCommentReply } from '../hooks/ApiHighlight';
import { getProfilePhotoMember } from '../hooks/fetchWorkspace';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config/baseUrl';
import Wolf from '../assets/Media/wolf.png';

const Home: React.FC = () => {
  const [highlightUser, setHighlightUser] = useState<any>(null);
  const [content, setContent] = useState<string>('');
  const [profilePhotos, setProfilePhotos] = useState<{ [key: string]: string }>({});
  const [replyStates, setReplyStates] = useState<{ [key: number]: boolean }>({});
  const [isDismissed, setIsDismissed] = useState(false);
  const [mePhoto, setMePhoto] = useState('https://via.placeholder.com/40');

  const handleSave = async (highlight: any) => {
    await postHighlightCommentReply(highlight.id, content);
    await fetchHighlightUser();
    setReplyStates((prev) => ({ ...prev, [highlight.id]: false }));
    setContent('');
  };

  const fetchHighlightUser = async () => {
    const user = await getHighlightUser();
    setHighlightUser(user);
    if (user) {
      await fetchProfilePhotos(user);
    }
  };

  useEffect(() => {
    fetchHighlightUser();
  }, []);

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

  const fetchProfilePhotos = async (highlights: any[]) => {
    const photos: { [key: string]: string } = {};

    for (const highlight of highlights) {
      if (highlight.author.id) {
        const photo = await getProfilePhotoMember(highlight.author.id);
        photos[highlight.author.id] = photo;
      }
      
      if (highlight.replies) {
        for (const reply of highlight.replies) {
          if (reply.user.id) {
            const photo = await getProfilePhotoMember(reply.user.id);
            photos[reply.user.id] = photo;
          }
        }
      }
    }

    setProfilePhotos(photos);
  };

  useEffect(() => {
    const getProfilePhoto = async (): Promise<string> => {
      try {
        const response = await axios.get(
          `${config}/user/get-PhotoProfile`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob'
          }
        );

        const blobUrl = URL.createObjectURL(response.data);
        setMePhoto(blobUrl);
        return blobUrl;
      } catch (error: any) {
        console.error('Failed to fetch profile photo:', error);
        throw new Error(error.response?.data?.error || 'Failed to fetch profile photo. Please try again.');
      }
    };

    getProfilePhoto();
  }, []);

  const hasHighlights = highlightUser && highlightUser.length > 0;

  return (
    <div className="min-h-screen">
      <div className="pt-10 pb-8">
      {!hasHighlights && (
        <div className="bg-white w-[500px] min-h-screen">
        <div className="mx-auto px-8">
          <div className="bg-white w-full rounded-lg shadow-md mr-80">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-full h-48">
                <img src={Wolf} alt="Workspace Highlight" className="w-full h-full object-cover rounded-t-lg" />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4 text-black">Stay up to date</h2>
                <p className="text-gray-600 max-w-md">
                  Invite people to boards and cards, leave comments, add due dates, and we'll show the most important activity here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

        <div className="max-w-3xl mx-auto">
          {!isDismissed && (
            <div className="bg-white border shadow-md mb-6 rounded-lg">
              <div className="flex p-7">
                <div className="bg-red-500 w-28 h-auto flex flex-col justify-between p-2 rounded-l" />
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
          )}

          <div className="flex flex-col text-black gap-6 max-w-md ">
            {(highlightUser || []).map((highlight: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-orange-400 p-5">
                  <Link to={`/L/workspace/${highlight.workspace.id}/board/${highlight.board.id}/cardList/${highlight.cardList.id}`}>
                    <div className="bg-gray-200 p-3 rounded-lg hover:bg-gray-300">
                      <span className="font-semibold text-gray-600">{highlight.cardList.name}</span>
                      <div className="flex items-center text-xs mt-1">
                       <span className=" bg-yellow-200 text-yellow-800 border-yellow-800 border px-2 py-0.5 rounded-full text-xs">
                        <i className='fas fa-clock mr-2' />
                        {highlight.cardList.startDate ? new Date(highlight.cardList.startDate).toLocaleDateString() : 'No Deadline'}
                        {highlight.cardList.endDate ? ` - ${new Date(highlight.cardList.endDate).toLocaleDateString()}` : ''}
                      </span>
                        <i className="fas fa-message text-xs text-gray-600 ml-4" />
                        <span className="ml-1">{highlight.replies?.length + 1 || 0}</span>
                      </div>
                    </div>
                  </Link>
                  <p className="text-md mt-3 text-white">
                    {highlight.workspace.name} <span className="ml-2 mr-2">|</span>{highlight.board.name} : {highlight.card.name}
                  </p>
                </div>

                <div className="p-4 border-black border rounded-b-lg">
                  <div className="flex items-start">
                    <img
                      src={profilePhotos[highlight.author.id] || "https://via.placeholder.com/40"}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold">{highlight.author.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(highlight.createdAt)}</p>
                      <p className="mt-2 text-sm">{highlight.content}</p>
                      {highlight.sticker && <img className="mt-2" src={highlight.sticker} alt="Sticker" />}
                    </div>
                  </div>

                  {highlight.replies && highlight.replies.length > 0 && (
                    <div className="ml-12 mt-4 space-y-4 border-l-2 border-gray-200">
                      {highlight.replies
                        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((reply: any) => (
                          <div key={reply.id} className="flex items-start pl-4">
                            <img
                              src={profilePhotos[reply.user.id]}
                              alt="User"
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="ml-3 flex-1">
                              <p className="font-semibold text-sm">{reply.user.name}</p>
                              <p className="text-xs text-gray-500">{formatDate(reply.createdAt)}</p>
                              <p className="mt-1 text-sm">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  <button
                    onClick={() => toggleReply(index)}
                    className="mt-3 flex w-[99%] p-2 items-center justify-center text-sm text-gray-600 bg-gray-200 hover:text-gray-800"
                  >
                    <i className="fas fa-paper-plane mr-2" />
                    Reply
                  </button>

                  {replyStates[index] && (
                    <div className="mt-3 flex items-start gap-3 border-t pt-3">
                      <img src={mePhoto} alt="User" className="w-10 h-10 rounded-full" />
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
    </div>
  );
};

export default Home;