import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Link2, Image, List, ChevronDown, Type } from 'lucide-react';
import { createActivity, updateActivity, getActivitiesByCardListId, fetchCardList, deleteActivity } from '../hooks/fetchCardList';
import { getProfilePhotoMember } from '../hooks/fetchWorkspace';
import useAuth from '../hooks/fetchAuth';

interface ActivityEditorProps {
  selectedCardList: any;
  initialActivity: string;
  onSave: (activity: string) => void;
  cardListId: string;
}

interface SavedActivity {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
  name?: string;
  photo?: string;
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
  const [savedActivities, setSavedActivities] = useState<SavedActivity[]>([]);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { getUserDataById } = useAuth(() => {}, () => {});
  const [userData, setUserData] = useState<{ [key: string]: { name: string; email: string } }>({});
  const [activities, setactivities] = useState(selectedCardList?.members);

  useEffect(() => {
    setActivity(initialActivity);
    setPrevActivity(initialActivity);
  }, [initialActivity]);

  useEffect(() => {
    fetchActivities();
  }, [cardListId]);

  useEffect(() => {
    activities?.forEach((member: { userId: any }) => {
      const id = member.userId;
      getUserDataById(id)
        .then((data: any) => {
          setUserData((prevUserData) => ({ ...prevUserData, [id]: data }));
        })
        .catch((error: any) => {
          console.error(error);
        });
    });
  }, [activities]);

  const fetchActivities = async () => {
    try {
      const activities = await getActivitiesByCardListId(cardListId);
      const activitiesWithPhotos = await Promise.all(
        activities.map(async (act: any) => {
          const photo = await getProfilePhotoMember(act.userId);
          return {
            id: act.id,
            content: act.activity,
            timestamp: new Date(act.createdAt).toLocaleString(),
            name: name,
            userId: act.userId,
            photo: photo
          };
        })
      );
      setSavedActivities(activitiesWithPhotos);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

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
    setEditingActivityId(null);
  };

  const handleSave = async () => {
    try {
      if (editingActivityId) {
        await updateActivity(editingActivityId, activity);
      } else {
        await createActivity(cardListId, activity);
      }
      onSave(activity);
      setPrevActivity(activity);
      setIsEditing(false);
      setActivity('');
      setEditingActivityId(null);
      await fetchActivities();
    } catch (error) {
      console.error('Failed to save activity:', error);
    }
  };

  const handleEdit = (savedActivity: SavedActivity) => {
    setIsEditing(true);
    setActivity(savedActivity.content);
    setPrevActivity(savedActivity.content);
    setEditingActivityId(savedActivity.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity(id);
      await fetchActivities();
    } catch (error) {
      console.error('Failed to delete activity:', error);
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

      <div className="mt-2 p-2">
        {savedActivities?.map((savedActivity) => (
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
            <div className="flex-grow">
              {userData[savedActivity.userId] && (
              <div className="flex items-center">
                <span className="font-medium text-[14px] pr-3">{userData[savedActivity?.userId].name}</span>
                <span className="text-[14px]">{savedActivity.content}</span>
              </div>
              )}
              <div className='flex flex-wrap text-[13px] gap-1 mt-1'>
              <span className="text-gray-500">{savedActivity.timestamp}</span>
                <button className="text-gray-500 hover:underline" onClick={() => handleEdit(savedActivity)}>
                  Edit
                </button>
                <span>•</span>
                <button className="text-gray-500 hover:underline" onClick={() => handleDelete(savedActivity.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityEditor;