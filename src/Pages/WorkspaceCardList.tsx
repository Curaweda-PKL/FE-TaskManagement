import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import DescriptionEditor from '../Component/descriptionEditor';
import ActivityEditor from '../Component/ActivityEditor';
import { useNavigate } from 'react-router-dom'

interface WorkspaceCardListProps {
    editingListName?: boolean;
    inputRef?: any;
    selectedCardList?: any;
    setSelectedCardList?: any;
    handleUpdateListName?: any;
    setEditingListName?: any;
    handleClosePopup?: any;
    labelColors?: any;
    getContrastColor?: any;
    inReviewPhoto?: any;
    approvedPhoto?: any;
    cardlistCustomFields?: any;
    openDeleteConfirmationCustomField?: any;
    handleInputChange?: any;
    attachments?: any;
    handleAttachImage?: any;
    handleDownloadAttachment?: any;
    handleDeleteAttachmentClick?: any;
    isDeleting?: any;
    deleteError?: any;
    checklistData?: any;
    calculateChecklistPercentage?: any;
    handleOpenChecklistPopup?: any;
    setExistingChecklistData?: any;
    openDeleteConfirmation?: any;
    handleToggleIsDone?: any;
    handleJoinClick?: any;
    handleOpenMemberPopup?: any;
    handleOpenLabelsPopup?: any;
    handleOpenDatesPopup?: any;
    handleOpenAttachPopup?: any;
    handleOpenCopyPopup?: any;
    handleDeleteCardList?: any;
    setIsCustomFieldModalOpen?: any;
    workspaceId?: any;
    boardId?: any;
}


const WorkspaceCardList: React.FC<WorkspaceCardListProps> = ({ editingListName, inputRef, selectedCardList, setSelectedCardList, handleUpdateListName, setEditingListName, handleClosePopup, labelColors, getContrastColor, inReviewPhoto, approvedPhoto, cardlistCustomFields, openDeleteConfirmationCustomField, handleInputChange, attachments, handleAttachImage, handleDownloadAttachment, handleDeleteAttachmentClick, isDeleting, deleteError, checklistData, calculateChecklistPercentage, handleOpenChecklistPopup, setExistingChecklistData, openDeleteConfirmation, handleToggleIsDone, handleJoinClick, handleOpenMemberPopup, handleOpenLabelsPopup, handleOpenDatesPopup, handleOpenAttachPopup, handleOpenCopyPopup, handleDeleteCardList, setIsCustomFieldModalOpen, workspaceId, boardId }) => {
    const MAX_VISIBLE_MEMBERS = 2;
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);

    const handleShareClick = () => {
        const currentOrigin = window.location.origin;
        const url = `${currentOrigin}/L/workspace/${workspaceId}/board/${boardId}/cardList/${selectedCardList.id}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                })
                .catch((error) => {
                    console.error('Failed to copy to clipboard:', error);
                    const tempInput = document.createElement('textarea');
                    tempInput.value = url;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                });
        } else {
            const tempInput = document.createElement('textarea');
            tempInput.value = url;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };
    
    const formatTimestamp = (timestamp: any) => {
        const date = new Date(timestamp);
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
    
        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        
        return formattedDate;
    }
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                {editingListName ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={selectedCardList.name}
                        onChange={(e) => {
                            const capitalizeWords = (str: string) =>
                                str.replace(/\b\w/g, (char: string) => char.toUpperCase());
                            setSelectedCardList({
                                ...selectedCardList,
                                name: capitalizeWords(e.target.value),
                            });
                        }}
                        onBlur={() =>
                            handleUpdateListName(
                                selectedCardList.id,
                                selectedCardList.name,
                                selectedCardList.description,
                                selectedCardList.score,
                                selectedCardList.startDate,
                                selectedCardList.endDate,
                                selectedCardList.activity
                            )
                        }
                        autoFocus
                        className="text-xl font-semibold p-1 rounded text-black bg-white border-b-1 border-black"
                    />
                ) : (
                    <h2
                        className="text-[22px] font-semibold text-gray-800 cursor-pointer"
                        onClick={() => setEditingListName(true)}
                    >
                        {selectedCardList?.name}
                    </h2>
                )}

                <button onClick={() => {
                    localStorage.removeItem('oncardList');
                    navigate(`/workspace/${workspaceId}/board/${boardId}`);
                }} className="text-gray-700 hover:text-gray-700">

                    <i className="fas fa-times"></i>
                </button>
            </div >
            <div className="cardlist flex gap-4 max768:flex-col">
                <div className="cardliststart w-full max768:w-full flex-[3]">
                    <div className='flex items-center'>
                        <div className="flex items-center flex-wrap gap-[7px]">
                            {labelColors?.map((color: any, index: number) => (
                                <div key={index} style={{ backgroundColor: color.color, color: getContrastColor(color.color) }} className={`memberColor flex justify-center items-center font-medium text-sm p-1 h-6 w-[101px] rounded`}>
                                    {color.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-1 flex items-start justify-between">
                        <div>
                            <h2 className="text-black mb-1 font-semibold text-[18px]">Members</h2>
                            <div className="flex flex-wrap items-center">
                                {selectedCardList.members && selectedCardList.members.length > 0 ? (
                                    <>
                                        {selectedCardList.members.slice(0, MAX_VISIBLE_MEMBERS).map((member: any) => (
                                            <div key={member.userId} className="flex flex-col items-center mr-[-8px]">
                                                <img
                                                    src={member.photoUrl || '/path/to/default/avatar.png'}
                                                    alt={`Profile of ${member.userId}`}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                                />
                                            </div>
                                        ))}

                                        {selectedCardList.members.length > MAX_VISIBLE_MEMBERS && (
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 ml-2">
                                                <span className="text-gray-600 font-medium">
                                                    +{selectedCardList.members.length - MAX_VISIBLE_MEMBERS}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                ) : null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="score-select" className="block text-black text-sm font-medium">
                                Score
                            </label>
                            <select
                                id="score-select"
                                value={selectedCardList.score}
                                onChange={(e) => {
                                    const newScore = parseInt(e.target.value, 10);
                                    setSelectedCardList({ ...selectedCardList, score: newScore });
                                    handleUpdateListName(
                                        selectedCardList.id,
                                        selectedCardList.name,
                                        selectedCardList.description,
                                        newScore,
                                        selectedCardList.startDate,
                                        selectedCardList.endDate,
                                        selectedCardList.activity
                                    );
                                }}
                                className="border bg-gray-300 rounded p-1 text-black"
                            >
                                <option value="" disabled>
                                    Select Score
                                </option>
                                {[0, 1, 2, 3, 4, 5].map((score) => (
                                    <option key={score} value={score}>
                                        {score}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <DescriptionEditor
                            initialDescription={selectedCardList.description}
                            onSave={(description: any) => {
                                setSelectedCardList({ ...selectedCardList, description });
                                handleUpdateListName(selectedCardList.id, selectedCardList.name, description, selectedCardList.score);
                            }} cardListId={''} />
                    </div>

                    <div>
                        <h2 className="text-black mb-1 font-semibold text-[18px]">Details</h2>
                        <div className='flex flex-col gap-3'>
                            {selectedCardList.inReviewById && (
                                <div className='text-black text-sm'>
                                    <div>In Review By</div>
                                    <div className='flex gap-2 items-center'>
                                        {inReviewPhoto && (
                                            <img
                                                src={inReviewPhoto}
                                                alt="Profile Photo"
                                                className="w-8 h-8 rounded-full"
                                            />
                                        )}
                                        <div className='flex flex-col'>
                                            <span>
                                                {selectedCardList.inReviewBy.name}
                                            </span>
                                            <span className='text-[10px]'>
                                                {selectedCardList.inReviewBy.email}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='text-[10px]'>
                                        Review at: {new Date(selectedCardList.inReviewAt).toLocaleString('en-US', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            timeZone: 'Asia/Jakarta',
                                        })}
                                    </div>
                                </div>
                            )}
                            {selectedCardList.approvedById && (
                                <div className='text-black text-sm'>
                                    <div>Approved By</div>
                                    <div className='flex gap-2 items-center'>
                                        {approvedPhoto && (
                                            <img
                                                src={approvedPhoto}
                                                alt="Profile Photo"
                                                className="w-8 h-8 rounded-full"
                                            />
                                        )}
                                        <div className='flex flex-col'>
                                            <span>
                                                {selectedCardList.approvedBy.name}
                                            </span>
                                            <span className='text-[10px]'>
                                                {selectedCardList.approvedBy.email}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='text-[10px]'>
                                        Approved at: {new Date(selectedCardList.approvedAt).toLocaleString('en-US', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            timeZone: 'Asia/Jakarta',
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        <label className="text-black font-semibold text-[18px] mb-2 w-full">Custom Field</label>
                        {cardlistCustomFields?.map((field: any) => (
                            <div key={field.id} className="mb-4 mr-2 rounded-md w-32">
                                <div className="flex items-center justify-between">
                                    <label className="block text-black text-sm font-medium">
                                        {field.customField.name}
                                    </label>
                                    <button
                                        onClick={() =>
                                            openDeleteConfirmationCustomField(field.customField.id, selectedCardList.id)
                                        }
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        <i className="fas fa-trash text-[12px]"></i>
                                    </button>
                                </div>

                                {field.customField.type === 'DROPDOWN' && (
                                    <select
                                        className="p-1 bg-gray-300 rounded w-full text-gray-800 mt-1"
                                        value={field.value || ""}
                                        onChange={(e) =>
                                            handleInputChange(selectedCardList.id, field.customField.id, e.target.value)
                                        }
                                    >
                                        <option value="" disabled>
                                            {field.value}
                                        </option>
                                        {field.customField.options.map((opt: any) => (
                                            <option key={opt.id} value={opt.value}>
                                                {opt.value}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {field.customField.type === 'TEXT' && (
                                    <input
                                        type="text"
                                        className="p-1 bg-gray-300 rounded w-full text-gray-800 mt-1"
                                        placeholder="Enter text"
                                        defaultValue={field.value}
                                        onFocus={(e) => e.target.select()}
                                        onBlur={(e) =>
                                            handleInputChange(selectedCardList.id, field.customField.id, e.target.value)
                                        }
                                    />
                                )}

                                {field.customField.type === 'NUMBER' && (
                                    <input
                                        type="number"
                                        className="p-1 bg-gray-300 rounded w-full text-gray-800 mt-1"
                                        placeholder="Enter Number"
                                        defaultValue={field.value}
                                        onFocus={(e) => e.target.select()}
                                        onBlur={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(Number(value)) || value === '') {
                                                handleInputChange(selectedCardList.id, field.customField.id, value);
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>




                    <div>
                        <div className="flex-wrap">
                            <h2 className="text-black font-semibold text-lg">Attachment</h2>
                            {attachments.map((attachment: any, index: number) => (
                                <>

                                    <div className='flex items-center mb-1 text-black'>
                                        <div className='flex bg-gray-200 p-0 w-28 h-16 items-center justify-center'
                                            onClick={() => handleAttachImage(attachment)}>
                                            <img
                                                key={index}
                                                src={attachment.url}
                                                alt={`Attachment ${index + 1}`}
                                                className="max-w-28 max-h-16 object-cover rounded"
                                            />
                                        </div>
                                        <div className='ml-5 text-gray-800 text-sm'>
                                            <p className="font-semibold text-base">{attachment.name}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <button className="underline"
                                                    onClick={() => handleDownloadAttachment(attachment)}>Download</button>
                                                <button
                                                    className="underline"
                                                    onClick={() => handleDeleteAttachmentClick(attachment)}
                                                    disabled={isDeleting}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ))}
                            {deleteError && <p className="text-red-500 text-sm mt-1">{deleteError}</p>}
                        </div>
                    </div>
                    <div className="activity flex flex-col justify-between mt-2 text-gray-800">
                        {checklistData?.map((data: any, index: number) => {
                            const completionPercentage = calculateChecklistPercentage(data.items);
                            const sortedItems = [...data.items].sort((a, b) =>
                                String(a.name).localeCompare(String(b.name))
                            );
                            return (
                                <div key={index} className="checklist-item">
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center'>
                                            <i className='fa-regular fa-square-check mr-3 text-lg'></i>
                                            <h1 className='text-md items-center'>{data.name}</h1>
                                        </div>
                                        <div className='flex gap-1 items-center'>
                                            <span className="text-sm text-gray-800 mr-2">{completionPercentage}%</span>
                                            <i
                                                className="fa-regular fa-pen-to-square hover:text-blue-500 cursor-pointer"
                                                onClick={() => handleOpenChecklistPopup(selectedCardList, true, () => setExistingChecklistData(data))}
                                            ></i>
                                            <i
                                                className="fa-regular fa-trash-can hover:text-red-500 cursor-pointer"
                                                onClick={() => openDeleteConfirmation(data.id)}
                                            ></i>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2.5 flex items-center">
                                        <div
                                            className="bg-blue-600 h-1 rounded-full"
                                            style={{
                                                width: `${completionPercentage}%`,
                                            }}
                                        ></div>
                                    </div>

                                    <div className='flex justify-between text-[10px] mb-2'>
                                    <p>Start Date: {formatTimestamp(data.startDate)}</p>
                                    <p>End Date: {formatTimestamp(data.endDate)}</p>
                                    </div>

                                    <ul className='mb-3'>
                                        {sortedItems.map((item: { isDone: boolean | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, itemIndex: Key | null | undefined) => (
                                            <li key={itemIndex} className="flex items-center mb-1">
                                                <input
                                                    type="checkbox"
                                                    id={`checklist-item-${index}-${itemIndex}`}
                                                    checked={item.isDone}
                                                    onChange={(e) => handleToggleIsDone(data, itemIndex as number, e.target.checked, data.id)}
                                                    className="w-4 h-4 mr-3 rounded border-gray-300"
                                                />
                                                <label
                                                    htmlFor={`checklist-item-${index}-${itemIndex}`}
                                                    className={`text-sm ${item.isDone ? 'line-through text-gray-500' : 'text-gray-700'}`}
                                                >
                                                    {item.name}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4">
                        {/* <ActivityEditor
                            initialActivity={selectedCardList.activity || ''}
                            cardListId={selectedCardList.id || ''}
                            onSave={(activity: any) => {
                                setSelectedCardList({ ...selectedCardList, activity });
                                handleUpdateListName(
                                    selectedCardList.id,
                                    selectedCardList.name,
                                    selectedCardList.description,
                                    selectedCardList.score,
                                    selectedCardList.startDate,
                                    selectedCardList.endDate,
                                    activity
                                );
                            }}
                        /> */}
                        <ActivityEditor
                            initialActivity={selectedCardList.activity || ''}
                            cardListId={selectedCardList.id || ''}
                            onSave={(activity: any) => {
                                setSelectedCardList({ ...selectedCardList, activity });
                                handleUpdateListName(
                                    selectedCardList.id,
                                    selectedCardList.name,
                                    selectedCardList.description,
                                    selectedCardList.score,
                                    selectedCardList.startDate,
                                    selectedCardList.endDate,
                                    activity
                                );
                            }}
                            selectedCardList={selectedCardList} // Tambahkan prop ini
                        />
                    </div>
                </div>
                <div className="cardlistend flex flex-col w-full gap-4 justify-start max768:ml-0 flex-[1]">
                    <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mb-1" onClick={() => handleJoinClick(selectedCardList.id)}>
                        <i className="fas fa-user"></i>Join
                    </div>
                    <div className="border-b border-black"></div>

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

                    <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                        onClick={() => handleOpenAttachPopup(selectedCardList)}>
                        <i className="fas fa-paperclip"></i>Attachment
                    </div>
                    <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none jsutify-start text-black  mb-4"
                        onClick={() => setIsCustomFieldModalOpen(true)}>
                        Custom Field
                    </div>

                    <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                        onClick={() => handleOpenCopyPopup(selectedCardList)}>
                        <i className="fas fa-copy"></i>Copy
                    </div>
                    <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black" onClick={handleShareClick}>
                        <i className="fas fa-share"></i>{isCopied ? 'Copied!' : 'Share'}
                    </div>
                    <>
                        <div
                            className="btn hover:bg-red-700 min-h-6 h-2 bg-red-500 rounded border-none justify-start text-black"
                            onClick={() => handleDeleteCardList(selectedCardList.id)}
                        >
                            <i className="fas fa-trash"></i>Delete
                        </div>
                    </>
                </div>
            </div>
        </>
    )
}

export default WorkspaceCardList;