import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Link2, Image, List, ChevronDown, Type } from 'lucide-react';
import { createActivity, updateActivity, getActivitiesByCardListId, deleteActivity, createComment, updateComment, getCommentByCardListId, deleteComment } from '../hooks/fetchCardList';
import config from '../config/baseUrl';
import { getProfilePhotoMember } from '../hooks/fetchWorkspace';
import axios from 'axios';

interface ActivityEditorProps {
  selectedCardList: any;
  initialActivity: string;
  onSave: (activity: string) => void;
  cardListId: string;
}

interface SavedItem {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
  name?: string;
  photo?: string;
  type: 'activity' | 'comment';
}

const ActivityEditor: React.FC<ActivityEditorProps> = ({ selectedCardList, initialActivity, onSave, cardListId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activity, setActivity] = useState(initialActivity);
  const [prevActivity, setPrevActivity] = useState(initialActivity);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemType, setEditingItemType] = useState<'activity' | 'comment' | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const headingOptions = [
    { label: 'Normal text', value: 'normal' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
  ];

  const listOptions = [
    { label: 'Bullet List', value: 'bullet' },
    { label: 'Number List', value: 'number' },
  ];

  useEffect(() => {
    setActivity(initialActivity);
    setPrevActivity(initialActivity);
  }, [initialActivity]);

  useEffect(() => {
    fetchAllItems();
  }, [cardListId]);

  // useEffect(() => {
  //   selectedCardList?.members?.forEach((member: { userId: any }) => {
  //     const id = member.userId;
  //     getUserDataById(id)
  //       .then((data: any) => {
  //         setUserData((prevUserData) => ({ ...prevUserData, [id]: data }));
  //       })
  //       .catch((error: any) => {
  //         console.error(error);
  //       });
  //   });
  // }, [selectedCardList]);

  const getUserDataById = async (id: string | number): Promise<any> => {
    try {
      const response = await axios.get(`${config}/user/user-data/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user data by id:', error);
      return null;
    }
  };

  const fetchAllItems = async () => {
    try {
      const [activities, comments] = await Promise.all([
        getActivitiesByCardListId(cardListId),
        getCommentByCardListId(cardListId)
      ]);

      const processedActivities = await Promise.all(
        activities.map(async (act: any) => {
          const photo = await getProfilePhotoMember(act.userId);
          const userData = await getUserDataById(act.userId); // Fetch user data
          return {
            id: act.id,
            content: act.activity,
            timestamp: new Date(act.date).toLocaleString(),
            userId: act.userId,
            photo: photo,
            name: userData ? userData.name : '', // Add name field
            type: 'activity' as const,
            replies: [] // No replies for activities
          };
        })
      );

      const processedComments = await Promise.all(
        comments.map(async (comment: any) => {
          const photo = await getProfilePhotoMember(comment.userId);
          const userData = await getUserDataById(comment.userId); // Fetch user data
          const replies = comment.replies || []; // Assuming replies are included in the comment object
          return {
            id: comment.id,
            content: comment.content,
            timestamp: new Date(comment.createdAt).toLocaleString(),
            userId: comment.userId,
            photo: photo,
            name: userData ? userData.name : '', // Add name field
            type: 'comment' as const,
            replies: await Promise.all(
              replies.map(async (reply: any) => {
                const replyPhoto = await getProfilePhotoMember(reply.userId);
                const replyUserData = await getUserDataById(reply.userId); // Fetch user data for reply
                return {
                  id: reply.id,
                  content: reply.content,
                  timestamp: new Date(reply.createdAt).toLocaleString(),
                  userId: reply.userId,
                  photo: replyPhoto,
                  name: replyUserData ? replyUserData.name : ''
                };
              })
            )
          };
        })
      );

      const allItems = [...processedActivities, ...processedComments]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setSavedItems(allItems);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const getSelectedText = () => {
    const textarea = textareaRef.current;
    return textarea?.value.substring(textarea.selectionStart, textarea.selectionEnd) || '';
  };

  const replaceSelectedText = (replacementText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText =
      activity.substring(0, start) +
      replacementText +
      activity.substring(end);

    setActivity(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + replacementText.length,
        start + replacementText.length
      );
    }, 0);
  };

  const applyTextStyle = (type: string) => {
    const selectedText = getSelectedText();
    if (!selectedText) return;

    let formattedText = '';
    switch (type) {
      case 'h1':
        formattedText = `\n# ${selectedText}\n`;
        break;
      case 'h2':
        formattedText = `\n## ${selectedText}\n`;
        break;
      case 'h3':
        formattedText = `\n### ${selectedText}\n`;
        break;
      case 'normal':
        formattedText = selectedText.replace(/^#+\s/, '');
        break;
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'bullet':
        formattedText = selectedText
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
        break;
      case 'number':
        formattedText = selectedText
          .split('\n')
          .map((line, index) => `${index + 1}. ${line}`)
          .join('\n');
        break;
      default:
        formattedText = selectedText;
    }

    replaceSelectedText(formattedText);
  };

  const handleInsertLink = () => {
    if (linkUrl && linkText) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      const selectedText = getSelectedText();
      if (selectedText) {
        replaceSelectedText(linkMarkdown);
      } else {
        setActivity(activity + linkMarkdown);
      }
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  const renderFormattedActivity = (text: string) => {
    let formatted = text;

    formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold">$1</h1>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold">$1</h2>');
    formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold">$1</h3>');

    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/^- (.*$)/gm, '• $1<br>');
    formatted = formatted.replace(/^\d+\. (.*$)/gm, (match, p1, offset, string) => {
      const num = string.substring(0, offset).split('\n').filter(line => /^\d+\./.test(line)).length + 1;
      return `${num}. ${p1}<br>`;
    });
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank">$1</a>');

    return formatted.replace(/\n/g, '<br/>');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setActivity(prevActivity);
    setEditingItemId(null);
    setEditingItemType(null);
  };

  const handleSave = async () => {
    try {
      if (editingItemId && editingItemType) {
        if (editingItemType === 'comment') {
          await updateComment(editingItemId, activity);
        } else {
          await updateActivity(editingItemId, activity);
        }
      } else {
        await createComment(cardListId, activity);
      }

      onSave(activity);
      setIsEditing(false);
      setActivity('');
      setEditingItemId(null);
      setEditingItemType(null);
      await fetchAllItems();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleEdit = (savedItem: SavedItem) => {
    setIsEditing(true);
    setActivity(savedItem.content);
    setEditingItemId(savedItem.id);
    setEditingItemType(savedItem.type);
  };

  const handleDelete = async (id: string, type: 'activity' | 'comment') => {
    try {
      if (type === 'comment') {
        await deleteComment(id);
      } else {
        await deleteActivity(id);
      }
      await fetchAllItems();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="w-full mb-4">
      <h2 className="text-black mb-3 font-semibold text-lg">Activity</h2>

      {!isEditing ? (
        <div
          className="bg-gray-300 text-gray-600 py-1 px-2 rounded min-h-[35px] cursor-pointer break-words overflow-hidden"
          onClick={() => setIsEditing(true)}
        >
          <span className="text-gray-600">Write an Activity...</span>
        </div>
      ) : (
        <div className="border rounded">
          <div className="flex items-center gap-2 p-2 border-b bg-gray-100">
            <div className="relative">
              <button
                className="flex items-center gap-1 p-1 hover:bg-gray-300 rounded"
                onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
              >
                <Type size={16} />
                <ChevronDown size={16} />
              </button>
              {showHeadingDropdown && (
                <div className="absolute bg-white border mt-1 rounded shadow-md">
                  {headingOptions.map((option) => (
                    <button
                      key={option.value}
                      className="block text-left px-4 py-2 hover:bg-gray-100 w-full"
                      onClick={() => {
                        applyTextStyle(option.value);
                        setShowHeadingDropdown(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="p-1 hover:bg-gray-200 rounded"
              onClick={() => applyTextStyle('bold')}
            >
              <Bold size={16} />
            </button>

            <button
              className="p-1 hover:bg-gray-200 rounded"
              onClick={() => applyTextStyle('italic')}
            >
              <Italic size={16} />
            </button>

            <div className="relative">
              <button
                className="flex items-center gap-1 p-1 hover:bg-gray-200 rounded"
                onClick={() => setShowListDropdown(!showListDropdown)}
              >
                <List size={16} />
                <ChevronDown size={16} />
              </button>
              {showListDropdown && (
                <div className="absolute bg-white border mt-1 rounded shadow-md">
                  {listOptions.map((option) => (
                    <button
                      key={option.value}
                      className="block text-left px-4 py-2 hover:bg-gray-100 w-full"
                      onClick={() => {
                        applyTextStyle(option.value);
                        setShowListDropdown(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="p-1 hover:bg-gray-200 rounded"
              onClick={() => setShowLinkDialog(true)}
            >
              <Link2 size={16} />
            </button>

            <button
              className="p-1 hover:bg-gray-200 rounded"
              onClick={() => applyTextStyle('image')}
            >
              <Image size={16} />
            </button>

            {showLinkDialog && (
              <div className="absolute bg-white border p-4 rounded shadow-md">
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Enter URL"
                    className="border p-1 rounded"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Enter link text"
                    className="border p-1 rounded"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                  />
                  <div className="flex justify-between">
                    <button
                      className="p-1 bg-blue-500 text-white rounded"
                      onClick={handleInsertLink}
                    >
                      Insert Link
                    </button>
                    <button
                      className="p-1 bg-red-500 text-white rounded"
                      onClick={() => setShowLinkDialog(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <textarea
            ref={textareaRef}
            className="w-full p-1 bg-gray-300 h-40 resize-none"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
          <div className="flex justify-between p-2">
            <button
              className="bg-gray-300 hover:bg-gray-400 p-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col mt-3 gap-2">
        {savedItems?.map((savedActivity: any) => (
          <div key={savedActivity?.id} className='text-gray-800 mb-2 flex items-start'>
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center overflow-hidden">
              {savedActivity.photo ? (
                <img
                  src={savedActivity.photo}
                  alt={`${savedActivity.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 font-bold">
                  {savedActivity.name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-grow mt-[-5px]">
              <div className={`flex ${savedActivity.type === 'comment' ? 'flex-col' : ''}`}>
                <span className="font-medium text-[14px] pr-1 ">{savedActivity.name}</span>
                <span className={`text-[14px] ${savedActivity.type === 'comment' ? 'bg-gray-300 p-1 rounded-md' : 'text-gray-600 italic'}`}>
                  {savedActivity.content}
                </span>
              </div>
              <div className='flex flex-wrap text-[12px] gap-1 mt-1 justify-between'>
                <span className={`text-gray-500 ${savedActivity.type === 'comment' ? '' : '-mt-1'}`}>{savedActivity.timestamp}</span>
                <div className='flex gap-1'>
                  {savedActivity.type === 'comment' && (
                    <>
                      <button className="text-gray-500 hover:underline" onClick={() => handleEdit(savedActivity)}>
                        Edit
                      </button>
                      <span>•</span>
                      <button className="text-gray-500 hover:underline" onClick={() => handleDelete(savedActivity.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* Menampilkan balasan di bawah komentar */}
              {savedActivity.type === 'comment' && savedActivity.replies?.length > 0 && (
                <div className="ml-4 mt-2">
                  {savedActivity.replies.map((reply: any) => (
                    <div key={reply.id} className='text-gray-800 mb-2 flex items-start'>
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center overflow-hidden">
                        {reply.photo ? (
                          <img
                            src={reply.photo}
                            alt={`${reply.name}'s profile`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 font-bold">
                            {reply.name?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-grow mt-[-5px]">
                        <div className={`flex flex-col`}>
                          <span className="font-medium text-[14px] pr-1 ">{reply.name}</span>
                          <span className={`text-[14px] bg-gray-300 p-1 rounded-md`}>
                            {reply.content}
                          </span>
                        </div>
                        <div className='flex flex-wrap text-[12px] gap-1 mt-1 justify-between'>
                          <span className={`text-gray-500`}>{reply.timestamp}</span>
                          <div className='flex gap-1'>
                            <button className="text-gray-500 hover:underline" onClick={() => handleEdit(reply)}>
                              Edit
                            </button>
                            <span>•</span>
                            <button className="text-gray-500 hover:underline" onClick={() => handleDelete(reply.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityEditor;