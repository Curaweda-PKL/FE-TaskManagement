import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import DescriptionEditor from '../Component/descriptionEditor';
import ActivityEditor from '../Component/ActivityEditor';

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
    handleRemoveCustomField?: any;
    handleSelectChange?: any;
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
    handleDeleteChecklist?: any;
    handleToggleIsDone?: any;
    handleJoinClick?: any;
    handleOpenMemberPopup?: any;
    handleOpenLabelsPopup?: any;
    handleOpenDatesPopup?: any;
    handleOpenAttachPopup?: any;
    handleOpenCopyPopup?: any;
    handleDeleteCardList?: any;
    setIsCustomFieldModalOpen?: any;
}


const WorkspaceCardList: React.FC<WorkspaceCardListProps> = ({ editingListName, inputRef, selectedCardList, setSelectedCardList, handleUpdateListName, setEditingListName, handleClosePopup, labelColors, getContrastColor, inReviewPhoto, approvedPhoto, cardlistCustomFields, handleRemoveCustomField, handleSelectChange, attachments, handleAttachImage, handleDownloadAttachment, handleDeleteAttachmentClick, isDeleting, deleteError, checklistData, calculateChecklistPercentage, handleOpenChecklistPopup, setExistingChecklistData, handleDeleteChecklist, handleToggleIsDone, handleJoinClick, handleOpenMemberPopup, handleOpenLabelsPopup, handleOpenDatesPopup, handleOpenAttachPopup, handleOpenCopyPopup, handleDeleteCardList, setIsCustomFieldModalOpen }) => {
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                {editingListName ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={selectedCardList.name}
                        onChange={(e) => setSelectedCardList({ ...selectedCardList, name: e.target.value })}
                        onBlur={() => handleUpdateListName(selectedCardList.id, selectedCardList.name, selectedCardList.description, selectedCardList.score, selectedCardList.startDate, selectedCardList.endDate, selectedCardList.activity)}
                        autoFocus
                        className="text-xl font-semibold p-1 rounded text-black bg-white border-b-1 border-black"
                    />
                ) : (
                    <h2
                        className="text-[22px] font-semibold text-gray-800 cursor-pointer"
                        onClick={() => setEditingListName(true)}
                    >
                        {selectedCardList.name}
                    </h2>
                )}

                <button onClick={handleClosePopup} className="text-gray-700 hover:text-gray-700">
                    <i className="fas fa-times"></i>
                </button>
            </div>
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
                            <div className="flex flex-wrap">
                                {selectedCardList.members && selectedCardList.members.length > 0 ? (
                                    selectedCardList.members.map((member: any) => (
                                        <div key={member.userId} className="flex flex-col items-center">
                                            <img
                                                src={member.photoUrl || '/path/to/default/avatar.png'}
                                                alt={`Profile of ${member.userId}`}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </div>
                                    ))
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
                            {selectedCardList.inReviewById && !selectedCardList.approvedById && (
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
                                        Review at: {new Date(selectedCardList.inReviewAt).toLocaleString('id-ID', {
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
                                        Approved at: {new Date(selectedCardList.approvedAt).toLocaleString('id-ID', {
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
                        {cardlistCustomFields.map((field: any) => (
                            <div key={field.id} className="mb-2 rounded-md w-36">
                                <label className="text-black font-semibold text-[18px]">Custom Field</label>
                                <div className="flex items-center justify-between">
                                    <label className="block text-black text-sm font-medium">
                                        {field.customField.name}
                                    </label>
                                    <button
                                        onClick={() =>
                                            handleRemoveCustomField(field.customField.id, selectedCardList.id)
                                        }
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        <i className="fas fa-trash text-[12px]"></i>
                                    </button>
                                </div>
                                {field.customField.type === 'DROPDOWN' && (
                                    <select
                                        className="p-1 bg-gray-300 rounded w-full text-gray-800 mt-1"
                                        value={field.selectedValue || ""}
                                        onChange={(e) =>
                                            handleSelectChange(e, field.customField.id, selectedCardList.id)
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
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="flex-wrap">
                            {attachments.map((attachment: any, index: number) => (
                                <>
                                    <h2 className="text-black font-semibold text-lg">Attachment</h2>
                                    <div className='flex items-center text-black'>
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
                                                onClick={() => handleDeleteChecklist(data.id)}
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
                                        <p>Start Date: {data.startDate}</p>
                                        <p>End Date: {data.endDate}</p>
                                    </div>

                                    <ul className='mb-3'>
                                        {data.items.map((item: { isDone: boolean | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, itemIndex: Key | null | undefined) => (
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

                    <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black mb-4"
                        onClick={() => handleOpenAttachPopup(selectedCardList)}>
                        <i className="fas fa-paperclip"></i>Attachment
                    </div>

                    <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black"
                        onClick={() => handleOpenCopyPopup(selectedCardList)}>
                        <i className="fas fa-copy"></i>Copy
                    </div>
                    <>
                        <div
                            className="btn hover:bg-red-700 min-h-6 h-2 bg-red-500 rounded border-none justify-start text-black"
                            onClick={() => handleDeleteCardList(selectedCardList.id)}
                        >
                            <i className="fas fa-trash"></i>Delete
                        </div>
                    </>
                    <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none justify-start text-black">
                        <i className="fas fa-share"></i>Share
                    </div>

                    <div className="btn hover:bg-gray-400 min-h-6 h-2 bg-gray-300 rounded border-none jsutify-start text-black"
                        onClick={() => setIsCustomFieldModalOpen(true)}>
                        Custom Field
                    </div>
                </div>
            </div>
        </>
    )
}

export default WorkspaceCardList;