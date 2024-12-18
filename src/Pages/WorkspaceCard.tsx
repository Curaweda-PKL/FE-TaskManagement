import { useState, useEffect, useRef, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { Route, useNavigate, Routes, useParams, Router, Link } from 'react-router-dom';
import { memberWorkspace, getProfilePhotoMember } from '../hooks/fetchWorkspace';
import { fetchBoards } from '../hooks/fetchBoard';
import { fetchCard, createCard, deleteCard, updateCard } from '../hooks/fetchCard';
import { fetchCardList, createCardList, updateCardList, deleteCardList, joinCardList, fetchCardListAttachments, deleteAttachment, updateCardListStatus, setCardListInReview, setCardListApproved } from '../hooks/fetchCardList';
import { fetchCardlistCustomFields, addCardlistCustomField, removeCardlistCustomField, updateCardlistCustomFieldValue } from '../hooks/fetchCustomFields'
import CreateCard from '../Component/createCard';
import MemberPopup from '../Component/member';
import LabelsPopup from '../Component/label';
import EditLabel from '../Component/EditLabel';
import ChecklistPopup from '../Component/checklist';
import DatesPopup from '../Component/dates';
import AttachPopup from '../Component/attachment';
import SubmitPopup from '../Component/submit';
import CopyPopup from '../Component/copy';
import DeleteConfirmation from '../Component/DeleteConfirmation';
import config from '../config/baseUrl';
import io from 'socket.io-client';
import useAuth from '../hooks/fetchAuth';
import { fetchLabels, fetchCardListLabels } from '../hooks/ApiLabel';
import DescriptionEditor from '../Component/descriptionEditor'
import ActivityEditor from '../Component/ActivityEditor';
import { takeCardListChecklist, deleteChecklist, updateChecklist } from '../hooks/ApiChecklist';
import CustomFieldSettings from '../Component/customField';
import { format } from 'date-fns';
import WorkspaceCardList from './WorkspaceCardList';

interface Attachment {
  name: ReactNode;
  id: string;
  url: string;
}
interface ChecklistData {
  id: string;
  items: any;
  endDate: ReactNode;
  startDate: ReactNode;
  name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
}

interface LabelColor {
  color: string; // Assuming color is a string (e.g., hex code)
  name: string;  // Assuming name is a string
}

interface CustomFieldOption {
  id: string; // or number, depending on your data
  value: string;
}

interface CustomField {
  id: string; // or number
  name: string;
  type: 'DROPDOWN' | 'OTHER_TYPE';
  options?: Array<{
    id: string | number;
    value: string;
  }>;
}

interface CardlistCustomField {
  id: string; // or number
  customField: CustomField;
  selectedValue?: string; // or any type based on your logic
}

interface ActiveCardRect {
  top: number;
  left: number;
  right: number;
  width: number;
  height: number;
}

interface editingCard {
  id: string;
  name: string;
  color: string;
}

interface selectedImage {
  url: string;
  name: string;
}

const WorkspaceProject = () => {
  const onSuccess = () => {
  };

  const onLogout = () => {
  };
  const { userData } = useAuth(onSuccess, onLogout);

  const handleJoinClick = async (cardListId: string) => {
    try {
      const { id } = userData;
      await joinCardList(cardListId, id);
      const updatedMemberPhoto = await getProfilePhotoMember(id);
      setCardData((prevCardData) =>
        prevCardData.map((card) => ({
          ...card,
          cardList: card.cardList.map((list: { id: string; members: any; }) => {
            if (list.id === cardListId) {
              return {
                ...list,
                members: [
                  ...(Array.isArray(list.members) ? list.members : []), // Ensure members is an array
                  { userId: id, photoUrl: updatedMemberPhoto }
                ]
              };
            }
            return list;
          })
        }))
      );
      setSelectedCardList((prevSelected: { id: string; members: any; }) => {
        if (prevSelected && prevSelected.id === cardListId) {
          return {
            ...prevSelected,
            members: [
              ...(Array.isArray(prevSelected.members) ? prevSelected.members : []), // Ensure members is an array
              { userId: id, photoUrl: updatedMemberPhoto }
            ]
          };
        }
        return prevSelected;
      });

    } catch (error) {
      console.error('Failed to join card list:', error);
    }
  };

  const calculateChecklistPercentage = (items: any[]) => {
    if (!items || items.length === 0) return 0;
    const completedItems = items.filter(item => item.isDone).length;
    return Math.round((completedItems / items.length) * 100);
  };


  const { workspaceId, boardId } = useParams<{ workspaceId: string; boardId: string }>();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [visibleMembers, setVisibleMembers] = useState<any[]>([]);
  const [remainingCount, setRemainingCount] = useState<number>(0);
  const [boardName, setBoardName] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [cardData, setCardData] = useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);
  const [isMemberBoardPopupOpen, setIsMemberBoardPopupOpen] = useState(false);
  const [isLabelsPopupOpen, setIsLabelsPopupOpen] = useState(false);
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [isEditLabelOpen, setIsEditLabelOpen] = useState(false);
  const [isChecklistPopupOpen, setIsChecklistPopupOpen] = useState(false);
  const [isDatesPopupOpen, setIsDatesPopupOpen] = useState(false);
  const [isAttachPopupOpen, setIsAttachPopupOpen] = useState(false);
  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState(false);
  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [selectedCardList, setSelectedCardList] = useState<any | null>([]);
  const [editingCard, setEditingCard] = useState<editingCard | null>(null);
  const [activeCardRect, setActiveCardRect] = useState<ActiveCardRect | null>(null);
  const [isEditCard, setIsEditCard] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteCardlist, setDeleteCardlist] = useState(false);
  const [cardListToDelete, setCardListToDelete] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [editingListName, setEditingListName] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteAttachmentConfirmation, setShowDeleteAttachmentConfirmation] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState<Attachment | null>(null);
  const [selectedImage, setSelectedImage] = useState<selectedImage | null>(null);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [cardlistCustomFields, setCardlistCustomFields] = useState<CardlistCustomField[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentBgColor, setCurrentBgColor] = useState<string>('bg-white');
  const MAX_VISIBLE_MEMBERS = 2

  const [isCopied, setIsCopied] = useState(false);

  const handleShareClick = () => {
    const currentOrigin = window.location.origin;
    const url = `${currentOrigin}/L/workspace/${workspaceId}/board/${boardId}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((error) => {
          console.error('Failed to copy to clipboard:', error);
          // Fallback: Buat input tersembunyi dan salin isinya
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
      // Fallback: Buat input tersembunyi dan salin isinya
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

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const fetchedMembers = await memberWorkspace(workspaceId);

        const membersWithPhotos = await Promise.all(
          fetchedMembers.map(async (member: any) => {
            const photoProfile = await getProfilePhotoMember(member.id);
            return {
              ...member,
              photoProfile,
            };
          })
        );

        setMembers(membersWithPhotos);
        setVisibleMembers(membersWithPhotos.slice(0, MAX_VISIBLE_MEMBERS));
        setRemainingCount(membersWithPhotos.length - MAX_VISIBLE_MEMBERS);
      } catch (error) {
        console.error('Failed to fetch workspace members:', error);
      }
    };

    fetchMembers();
  }, [workspaceId]);


  const handleDeletePopUp = (card: any) => {
    setShowDeleteConfirmation(true);
    setCurrentCard(card);
  }

  const handleCancelPopUp = () => {
    setShowDeleteConfirmation(false);
  }

  const handleOpenCreateCard = () => {
    setIsCreateCardOpen(true);
  };

  const handleCloseCreateCard = () => {
    setIsCreateCardOpen(false);
    setCurrentCard(null);
  };

  const handleOpenEditCard = (card: any) => {
    setCurrentCard(card);
    setIsEditCardOpen(true);
  };

  const handleCloseEditCard = () => {
    setIsEditCardOpen(false);
    setCurrentCard(null);
  };

  const handlePopUpCard = (cardList: any, event: any) => {
    const rect = event.currentTarget.closest('li').getBoundingClientRect();
    setActiveCardRect(rect);
    setIsEditCard(true);
    setIsPopupOpen(false);
    setEditingCard(cardList);
  }

  const handleArchive = () => {
    setIsArchived(true);
  };

  const handleSendToBoard = () => {
    setIsArchived(false);
  };

  const handleOpenMemberPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsMemberPopupOpen(true);
    setIsEditCard(false);
  };

  const handleCloseMemberPopup = () => {
    setIsMemberPopupOpen(false);
  };

  const handleOpenLabelsPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsLabelsPopupOpen(true);
    setIsEditCard(false);
  };

  const handleCloseLabelsPopup = () => {
    setIsLabelsPopupOpen(false);
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [existingChecklistData, setExistingChecklistData] = useState<ChecklistData | null>(null);

  const handleOpenChecklistPopup = (cardList: any, isEditMode: boolean = false, existingChecklistData?: any) => {
    setSelectedCardList(cardList);
    setIsChecklistPopupOpen(true);
    setIsEditMode(isEditMode);
    setExistingChecklistData(existingChecklistData);
  };

  const handleCloseChecklistPopup = () => {
    setIsChecklistPopupOpen(false);
  };

  const handleOpenDatesPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsDatesPopupOpen(true);
    setIsEditCard(false);
  };

  const handleCloseDatesPopup = () => {
    setIsDatesPopupOpen(false);
    setIsEditCard(false);
  };

  const handleOpenAttachPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsAttachPopupOpen(true);
  };

  const handleCloseAttachPopup = () => {
    setIsAttachPopupOpen(false);
  };

  const handleOpenSubmitPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsSubmitPopupOpen(true);
  };

  const handleCloseSubmitPopup = () => {
    setIsSubmitPopupOpen(false);
    setIsCopyPopupOpen(false);
  };

  const handleOpenCopyPopup = (cardList: any) => {
    setSelectedCardList(cardList);
    setIsCopyPopupOpen(true)
  };

  const handleCreateNewLabel = () => {
    setIsEditLabelOpen(true);
  };

  const handleCloseEditLabel = () => {
    setIsEditLabelOpen(false);
  };

  const handleDeleteAttachmentClick = (attachment: any) => {
    setAttachmentToDelete(attachment);
    setShowDeleteAttachmentConfirmation(true);
  };

  const confirmDeleteAttachment = async () => {
    if (attachmentToDelete) {
      await handleDeleteAttachment(attachmentToDelete.id);
      setShowDeleteAttachmentConfirmation(false);
      setAttachmentToDelete(null);
    }
  };

  const cancelDeleteAttachment = () => {
    setShowDeleteAttachmentConfirmation(false);
    setAttachmentToDelete(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [labelColors, setLabelColors] = useState<LabelColor[]>([]);

  useEffect(() => {
    const handlefetchCardListLabels = async () => {
      try {
        const labels = await fetchCardListLabels(selectedCardList?.id);
        const colors = labels.map((label: { label: { color: any; }; }) => label.label);
        setLabelColors(colors);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedCardList) {
      handlefetchCardListLabels();
    }
  }, [selectedCardList]);

  const handlefetchCardListLabels = async () => {
    try {
      const labels = await fetchCardListLabels(selectedCardList?.id);
      const colors = labels.map((label: { label: { color: any; }; }) => label.label);
      setLabelColors(colors);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchData = async () => {
    try {
      const boardData = await fetchBoards(workspaceId);
      setBoards(boardData);
      const board = boardData.find((b: any) => b.id === boardId);
      setBoardName(board ? board.name : 'Project');

      if (boardId) {
        const cardResponse = await fetchCard(boardId);
        if (cardResponse && cardResponse) {
          const updatedCardData = await Promise.all(
            cardResponse.map(async (card: any) => {
              if (card && card.id) {
                const cardListData = await fetchCardList(card.id);
                const cardListWithAttachments = await Promise.all(
                  cardListData.map(async (cardList: any) => {
                    if (cardList.attachments && cardList.attachments.length > 0) {
                      const attachmentDetails = await Promise.all(
                        cardList.attachments.map((attachment: any) =>
                          fetchCardListAttachments(attachment.attachmentId)
                        )
                      );
                      return { ...cardList, attachmentDetails };
                    }
                    return { ...cardList, attachmentDetails: [] };
                  })
                );
                return { ...card, cardList: cardListWithAttachments };
              }
              return { ...card, cardList: [] };
            })
          );
          setCardData(updatedCardData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boardData = await fetchBoards(workspaceId);
        setBoards(boardData);
        const board = boardData.find((b: { id: string; name: string }) => b.id === boardId);
        setBoardName(board ? board.name : 'Project');

        const currentBoard = boardData.find((b: { id: string; name: string; backgroundColor: string }) => b.id === boardId);

        // Set board name
        setBoardName(currentBoard ? currentBoard.name : 'Project');

        // Set backgroundColor dari board yang aktif
        setCurrentBgColor(currentBoard?.backgroundColor || 'bg-white');

        if (boardId) {
          // const socket = io(config);

          // socket.on(`board/${boardId}`, () => {
          //   fetchData();
          // });

          // return () => {
          //   socket.off(`board/${boardId}`);
          //   socket.disconnect();
          // };
          const cardResponse = await fetchCard(boardId);
          if (cardResponse) {
            const updatedCardData = await Promise.all(
              cardResponse.map(async (card: { id: string }) => {
                if (card && card.id) {
                  const cardListData = await fetchCardList(card.id);
                  // const processedCustomFields = processCustomFields(cardListData);
                  // setCardlistCustomFields(processedCustomFields);
                  const cardList = Array.isArray(cardListData) ? cardListData : [cardListData];

                  const updatedCardList = await Promise.all(cardList.map(async (list) => {

                    if (list.members && list.members.length > 0) {
                      const membersWithPhotos = await Promise.all(
                        list.members.map(async (member: { userId: string }) => {
                          const photoUrl = await getProfilePhotoMember(member.userId).catch(error => {
                            console.error(`Error fetching photo for user ${member.userId}:`, error);
                            return null;
                          });
                          return { ...member, photoUrl };
                        })
                      );
                      return { ...list, members: membersWithPhotos };
                    }
                    return list;
                  }));

                  const cardListWithAttachments = await Promise.all(
                    updatedCardList.map(async (cardList: any) => {
                      if (cardList.attachments && cardList.attachments.length > 0) {
                        const attachmentDetails = await Promise.all(
                          cardList.attachments.map((attachment: { attachmentId: string }) =>
                            fetchCardListAttachments(attachment.attachmentId)
                          )
                        );
                        return { ...cardList, attachmentDetails };
                      }
                      return { ...cardList, attachmentDetails: [] };
                    })
                  );

                  const cardListWithCustomFields = await Promise.all(
                    cardListWithAttachments.map(async (cardList: any) => {

                      return { ...cardList };
                    })
                  );

                  return {
                    ...card,
                    cardList: cardListWithCustomFields
                  };
                }
                return { ...card, cardList: [] };
              })
            );

            setCardData(updatedCardData);
            // const socket = io(config);

            // socket.on(`board/${boardId}`, () => {
            //   console.log(`Board updated for board ${boardId}`);
            //   fetchData();
            // });

          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [workspaceId, boardId]);

  const [cardIdsSocket, setCardIdsSocket] = useState<string[]>([]); // Ubah menjadi array
  const [cardData2, setCardData2] = useState<any[]>([]); // Inisialisasi cardData

  // Ref untuk menyimpan nilai terbaru dari cardIdsSocket
  const cardIdsSocketRef = useRef(cardIdsSocket);
  const cardData2Ref = useRef(cardData2); // Ref for storing the latest cardData2


  useEffect(() => {
    cardData2Ref.current = cardData2;
  }, [cardData2]);
  // Update ref setiap kali cardIdsSocket berubah
  useEffect(() => {
    cardIdsSocketRef.current = cardIdsSocket;
  }, [cardIdsSocket]);

  const selectedCardListRef = useRef(null);

  useEffect(() => {
    if (!boardId) return; // Hentikan jika boardId belum diatur

    const socket = io(config);

    // Listener untuk event socket
    socket.on(`board/${boardId}`, async () => {
      try {
        const updatedCardData = await Promise.all(
          cardData2Ref.current.map(async (card: { id: string }) => {
            if (card && card.id) {
              const cardListData = await fetchCardList(card.id);
              const cardList = Array.isArray(cardListData) ? cardListData : [cardListData];
              const updatedCardList = await Promise.all(cardList.map(async (list) => {
                // Create an object to store all updates
                const updates: any = { ...list };

                // Handle members update if they exist
                if (list.members && list.members.length > 0) {
                  const membersWithPhotos = await Promise.all(
                    list.members.map(async (member: { userId: string }) => {
                      const photoUrl = await getProfilePhotoMember(member.userId).catch(error => {
                        console.error(`Error fetching photo for user ${member.userId}:`, error);
                        return null;
                      });
                      return { ...member, photoUrl };
                    })
                  );
                  updates.members = membersWithPhotos;
                }

                if (list.customFields && list.customFields.length > 0) {
                  updates.customFields = list.customFields;
                }

                return updates;
              }));

              return { ...card, cardList: updatedCardList };
            }
            return { ...card, cardList: [] };
          })
        );
        setCardData(updatedCardData);

        if (selectedCardList && selectedCardList.id) {
          const allCardlistData = Object.values(updatedCardData).flatMap((entry) => entry.cardList || []);

          const updatedSelectedData = allCardlistData.find((item) => item.id === selectedCardList.id);


          setSelectedCardList({ ...updatedSelectedData })


        }

        console.log("here")

      } catch (error) {
        console.error('Error fetching card:', error);
      }


    });

    return () => {
      socket.off(`board/${boardId}`);
      socket.disconnect();
    };
  }, [boardId, selectedCardList]);

  const fetchData2 = async () => {
    try {
      const boardData = await fetchBoards(workspaceId);
      const board = boardData.find((b: { id: string; name: string }) => b.id === boardId);
      setBoardName(board ? board.name : 'Project');

      if (boardId) {
        const cardResponse = await fetchCard(boardId);
        setCardData2(cardResponse);

        if (cardResponse) {
          const updatedCardData = await Promise.all(
            cardResponse.map(async (card: { id: string }) => {
              if (card && card.id) {
                const cardListData = await fetchCardList(card.id);
                setCardIdsSocket(prevIds => {
                  if (!prevIds.includes(card.id)) {
                    return [...prevIds, card.id];
                  }
                  return prevIds;
                });

                const cardList = Array.isArray(cardListData) ? cardListData : [cardListData];

                const updatedCardList = await Promise.all(cardList.map(async (list) => {
                  if (list.members && list.members.length > 0) {
                    const membersWithPhotos = await Promise.all(
                      list.members.map(async (member: { userId: string }) => {
                        const photoUrl = await getProfilePhotoMember(member.userId).catch(error => {
                          console.error(`Error fetching photo for user ${member.userId}:`, error);
                          return null;
                        });
                        return { ...member, photoUrl };
                      })
                    );
                    return { ...list, members: membersWithPhotos };
                  }
                  return list;
                }));

                return { ...card, cardList: updatedCardList };
              }
              return { ...card, cardList: [] };
            })
          );

          setCardData(updatedCardData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData2();
  }, [boardId]);

  const handleUpdateStatusCardlist = async (cardlistId: string, status: string) => {
    try {
      switch (status) {
        case 'APPROVED':
          setCardListApproved(cardlistId);
          break;
        case 'IN_REVIEW':
          setCardListInReview(cardlistId);
          break;
        default:
          await updateCardListStatus(cardlistId, status);
      }
      await fetchData2();
    } catch (error) {
      console.error('Error updating cardlist status:', error);
    }
  };
  const handleCreateCard = async (cardName: string) => {
    try {
      await createCard(boardId, cardName);
      const updatedCardData = await fetchCard(boardId);
      if (updatedCardData && updatedCardData) {
        const updatedCardWithLists = await Promise.all(
          updatedCardData.map(async (card: any) => {
            if (card && card.id) {
              const cardListData = await fetchCardList(card.id);
              return { ...card, cardList: cardListData || [] };
            }
            return { ...card, cardList: [] };
          })
        );
        setCardData(updatedCardWithLists);
      }
    } catch (error) {
      console.error('Error creating or fetching cards:', error);
    }
  };

  const handleEditCard = async (cardId: any, cardName: string) => {
    try {
      await updateCard(cardId, cardName);
      const updatedCardData = await fetchCard(boardId);
      if (updatedCardData) {
        const updatedCardWithLists = await Promise.all(
          updatedCardData.map(async (card: any) => {
            if (card && card.id) {
              const cardListData = await fetchCardList(card.id);
              return { ...card, cardList: cardListData || [] };
            }
            return { ...card, cardList: [] };
          })
        );
        setCardData(updatedCardWithLists);
      }
    } catch (error) {
      console.error('Error updating or fetching cards:', error);
    }
  };

  const handleDeleteCard = async (cardId: any) => {
    setCardToDelete(cardId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteCard = async () => {
    try {
      await deleteCard(cardToDelete);
      const updatedCardData = cardData.filter((card: any) => card.id !== cardToDelete);
      setCardData(updatedCardData);
      handleClosePopup();
    } catch (error) {
      console.error("Error deleting card:", error);
    } finally {
      setShowDeleteConfirmation(false);
      setCardToDelete(null);
    }
  };
  const currentPath = window.location.pathname;



  const cancelDeleteCardList = () => {
    setDeleteCardlist(false);
    setCardListToDelete(null);
  };

  const handleAddCardList = async (cardId: any) => {
    try {
      const defaultListName = 'New List';
      const newCardList = await createCardList(cardId, defaultListName, '', 0, '', '', '');

      // Update the cardData state
      const updatedCardData = await cardData.map(card => {
        if (card.id === cardId) {
          return { ...card, cardList: [...card.cardList, newCardList] };
        }
        return card;
      });

      await setCardData(updatedCardData); // Update cardData state

      // Set the selectedCardList directly after creating the new card list
      await setSelectedCardList(newCardList);

      await setIsPopupOpen(true);
      await navigate(`/L/workspace/${workspaceId}/board/${boardId}/cardList/${newCardList.id}`);
    } catch (error) {
      console.error("Failed to add card list:", error);
    }
  };



  const handleUpdateListName = async (id: any, description: any, score: any, newName: any, startDate?: any, endDate?: any, activity?: any) => {
    try {
      await updateCardList(id, description, score, newName, startDate, endDate, activity);
      await fetchData();
      const updatedCardData = cardData.map(card => ({
        ...card,
        cardList: card?.cardList?.map((list: { id: any; }) =>
          list?.id === listId ? { ...list, name: newName } : list
        )
      }));
      setCardData(updatedCardData);
      setEditingListName(false);
    } catch (error) {
      console.error("Failed to update list name:", error);
    }
  };

  const handleDeleteCardList = async (cardListId: any) => {
    setCardListToDelete(cardListId);
    setDeleteCardlist(true);
  };

  const confirmDeleteCardList = async () => {
    try {
      await deleteCardList(cardListToDelete);
      const updatedCardData = cardData.map(card => ({
        ...card,
        cardList: card.cardList.filter((list: any) => list.id !== cardListToDelete)
      }));
      setCardData(updatedCardData);
      handleClosePopup();
    } catch (error) {
      console.error("Error deleting card list:", error);
    } finally {
      localStorage.removeItem('oncardList');
      navigate(`/workspace/${workspaceId}/board/${boardId}`);
      setShowDeleteConfirmation(false);
      setCardListToDelete(null);
    }
    setDeleteCardlist(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        handleUpdateListName(selectedCardList.id, selectedCardList.name, selectedCardList.score, selectedCardList.description);
      }
    };

    if (editingListName) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingListName, selectedCardList]);

  const [inReviewPhoto, setInReviewPhoto] = useState(null);
  const [approvedPhoto, setapprovedPhoto] = useState(null);

  const navigate = useNavigate()

  const handleOpenPopup = async (cardList: any) => {
    setEditingListName(false);
    setSelectedCardList(cardList);
    setIsPopupOpen(true);
    setEditingListName(false);
    setCardlistCustomFields(cardList.customFields);
    setAttachments(cardList.attachmentDetails || []);
    navigate(`/workspace/${workspaceId}/board/${boardId}/cardList/${cardList.id}`);

    if (cardList.inReviewById) {
      const photo = await getProfilePhotoMember(cardList.inReviewById);
      setInReviewPhoto(photo);
    }

    if (cardList.approvedById) {
      const photo = await getProfilePhotoMember(cardList.approvedById);
      setapprovedPhoto(photo);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCardList(null);
    setEditingListName(false);
  };

  useEffect(() => {
    const cardListData = localStorage.getItem('oncardList');

    if (cardListData) {
      const onCardListId = cardListData.toString();

      cardData.forEach((card) => {
        if (card.cardList) {
          card.cardList.forEach((cardList: any) => {
            if (cardList.id === onCardListId) {
              handleOpenPopup(cardList);
            }
          });
        }
      });
    } else {
      console.log("tidak ada");
    }
  }, [cardData]);

  const [labels, setLabels] = useState([]);
  useEffect(() => {
    const funcfetchLabels = async () => {
      try {
        const labels = await fetchLabels(workspaceId ?? '');
        setLabels(labels);
      } catch (error) {
        console.error(error);
      }
    };
    funcfetchLabels();
  }, [workspaceId]);

  const funcfetchLabels = async () => {
    try {
      const labels = await fetchLabels(workspaceId ?? '');
      setLabels(labels);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCustomFieldClick = async (customField: CustomField) => {
    if (customField.type) {
      try {
        const response = await addCardlistCustomField(selectedCardList.id, customField.id);
        const newField: CardlistCustomField = {
          customField: {
            ...customField,
            options: customField.options || []
          },
          value: "",
        };
        setCardlistCustomFields(prevFields => [...prevFields, newField]);
      } catch (error) {
        console.error('Error adding custom field:', error);
      }
    }
  };

  const handleRemoveCustomField = async (cardListOnCustomFieldId: string | number, cardlistId: any) => {
    try {
      await removeCardlistCustomField(cardListOnCustomFieldId, cardlistId);
      setCardlistCustomFields(prevFields =>
        prevFields.filter(field => field.customField.id !== cardListOnCustomFieldId)
      );
    } catch (error) {
      console.error('Error removing custom field:', error);
    }
  };

  const confirmRemoveCustomField = () => {
    handleRemoveCustomField(customFieldIdToDelete, selectedCardList.id);
    setDeleteCustomFieldModal(false);
  };

  const cancelRemoveCustomField = () => {
    setDeleteCustomFieldModal(false);
  };

  const openDeleteConfirmationCustomField = (fieldId: string) => {
    setCustomFieldIdToDelete(fieldId);
    setDeleteCustomFieldModal(true);
  };

  const handleInputChange = async (
    cardListId: string | number,
    customFieldId: string | number,
    newValue: string
  ) => {
    try {
      const response = await updateCardlistCustomFieldValue(cardListId, customFieldId, newValue);
      console.log("Custom field updated successfully:", response);

      setCardlistCustomFields(prevFields =>
        prevFields.map((field) =>
          field.customField.id === customFieldId
            ? { ...field, value: newValue }
            : field
        )
      );
    } catch (error) {
      console.error("Failed to update custom field value:", error);
    }
  };

  useEffect(() => {
    if (isPopupOpen && selectedCardList) {
      const fetchAttachments = async () => {
        try {
          const attachmentPromises = selectedCardList.attachments?.map(async (attachment: any) => {
            const blobUrl = await fetchCardListAttachments(attachment.attachmentId);
            return {
              id: attachment.attachmentId,
              url: blobUrl,
              name: attachment.attachment.name
            };
          });
          const fetchedAttachments = await Promise?.all(attachmentPromises);
          setAttachments(fetchedAttachments);
        } catch (error) {
          console.error('Error fetching attachments:', error);
        }
      };
      fetchAttachments();
    }
  }, [isPopupOpen, selectedCardList]);

  const handleAttachmentCreated = (newAttachment: any) => {
    setCardData(prevCardData =>
      prevCardData.map(card => {
        if (card.id === selectedCardList.cardId) {
          return {
            ...card,
            cardList: card.cardList.map((list: any) =>
              list.id === selectedCardList.id
                ? {
                  ...list,
                  attachmentDetails: [...(list.attachmentDetails || []), newAttachment],
                  attachments: [...(list.attachments || []), {
                    attachmentId: newAttachment.id,
                    attachment: {
                      id: newAttachment.id,
                      url: newAttachment.url,
                      name: newAttachment.name
                    }
                  }]
                }
                : list
            )
          };
        }
        return card;
      })
    );
    setAttachments(prevAttachments => [...prevAttachments, newAttachment]);
  };

  const handleAttachImage = (attachment: any) => {
    setSelectedImage(attachment);
  };

  const handleDownloadAttachment = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!selectedCardList || !selectedCardList.id) {
      console.error('No card list selected');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await deleteAttachment(selectedCardList.id, attachmentId);

      if (response.success) {
        setAttachments(prevAttachments =>
          prevAttachments.filter(attachment => attachment.id !== attachmentId)
        );
        await fetchData();
      } else {
        console.error('Delete attachment failed:', response.message, response.error);
        setDeleteError(response.message);
      }
    } catch (error) {
      console.error('Error deleting attachment:', error);
      setDeleteError('An unexpected error occurred while deleting the attachment');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveDates = (startDate: any, endDate: any) => {
    const updatedCardData = cardData.map(card => {
      const updatedCardList = card.cardList.map((cardList: any) => {
        if (cardList.id === selectedCardList.id) {
          return { ...cardList, startDate, endDate };
        }
        return cardList;
      });
      return { ...card, cardList: updatedCardList };
    });
    setCardData(updatedCardData);
    handleCloseDatesPopup();
  };


  const [checklistData, setChecklistData] = useState<{
    id: string;
    items: any;
    endDate: ReactNode;
    startDate: ReactNode; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined
  }[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await takeCardListChecklist(selectedCardList.id);
        setChecklistData(response);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedCardList) {
      fetchData();
    }
  }, [selectedCardList]);

  const handleTakeCardlistChecklist = async () => {
    try {
      const response = await takeCardListChecklist(selectedCardList.id);
      setChecklistData(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteChecklist = async (checklistId: string) => {
    try {
      await deleteChecklist(checklistId);
      handleTakeCardlistChecklist();
    } catch (error) {
      console.error("Error deleting checklist:", error);
    }
  };
  const [deleteCustomFieldModal, setDeleteCustomFieldModal] = useState(false);
  const [customFieldIdToDelete, setCustomFieldIdToDelete] = useState('');
  const [deleteChecklistModal, setDeleteChecklistModal] = useState(false);
  const [checklistIdToDelete, setChecklistIdToDelete] = useState('');

  const confirmDeleteChecklist = () => {
    handleDeleteChecklist(checklistIdToDelete);
    setDeleteChecklistModal(false);
  };

  const cancelDeleteChecklist = () => {
    setDeleteChecklistModal(false);
  };

  const openDeleteConfirmation = (checklistId: string) => {
    setChecklistIdToDelete(checklistId);
    setDeleteChecklistModal(true);
  };
  const handleToggleIsDone = async (checklistData: any, itemIndex: number, isChecked: boolean, idChecklist: string) => {
    // Find the original item's index in the unsorted array
    const sortedItems = [...checklistData.items].sort((a, b) =>
      String(a.name).localeCompare(String(b.name))
    );
    const item = sortedItems[itemIndex];
    const originalIndex = checklistData.items.findIndex((originalItem: any) =>
      originalItem.name === item.name
    );

    const updatedItems = [...checklistData.items];
    updatedItems[originalIndex].isDone = isChecked;

    const data = {
      idChecklist: idChecklist,
      checklistData: {
        name: checklistData.name,
        startDate: checklistData.startDate,
        endDate: checklistData.endDate,
        items: updatedItems,
      },
    };
    await updateChecklist(data);
    handleTakeCardlistChecklist();
  };



  const getContrastColor = (hexColor: any) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  useEffect(() => {
    fetchData()
    fetchData2()
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [workspaceId, boardId]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-bars loading-lg h-screen z-20"></span>
      </div>
    );
  }

  return (
    <>
      <header className="flex bg-gray-100 p-3 justify-between items-center">
        <div className="flex items-center space-x-7">
          <h1 className="text-xl text-black font-medium">{boardName}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {visibleMembers.map((member, index) => (
              <div
                key={member.id}
                className="flex flex-col items-center"
                style={{ marginLeft: index > 0 ? '-8px' : '0' }}
              >
                <img
                  src={member.photoProfile || '/path/to/default/avatar.png'}
                  alt={member.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white cursor-pointer"
                />
              </div>
            ))}

            {remainingCount > 0 && (
              <div
                className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center cursor-pointer"
                style={{ marginLeft: '-8px' }}
                onClick={() => setIsMemberBoardPopupOpen(true)}
              >
                <span className="text-xs font-semibold text-gray-600">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>

          <button
            className="bg-gray-100 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center"
            onClick={handleShareClick}
          >
            <i className="fas fa-sharp fa-regular fa-share-nodes w-4 h-4 mr-2" />
            {isCopied ? 'Copied!' : 'Share'}
          </button>

        </div>
      </header>

      {isMemberBoardPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">Card Members</h2>
              <button
                onClick={() => setIsMemberBoardPopupOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-3">
              {members.map(member => (
                <div key={member.id} className="flex items-center space-x-3 bg-slate-300 rounded p-1 text-slate-900">
                  <img
                    src={member.photoProfile || '/path/to/default/avatar.png'}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <main className="h-[89%] w-full flex-1 overflow-x-auto">
        <div className={`flex px-4 py-4 ${currentBgColor} min-w-full w-max h-max min-h-full`}>
          {cardData.length === 0 ? (
            <p className="mr-6">No cards available</p>
          ) : (
            cardData.map((card, index) => (
              <div key={index} className="relative bg-white rounded-2xl shadow-xl border p-4 mr-1 w-64 h-fit flex-shrink-0">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setDropdownOpen(dropdownOpen === index ? null : index)}
                >
                  <i className="fas fa-ellipsis-h"></i>
                </button>

                <h2 className="text-xl text-center mb-6 text-gray-700">{card?.name}</h2>
                <ul className="space-y-2">
                  {card.cardList && card.cardList?.map((cardList: any, index: any) => (
                    <li
                      key={index}
                      className="relative bg-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-200 transition-colors duration-300 group"
                      onClick={() => {
                        handleOpenPopup(cardList);
                        localStorage.setItem('oncardList', cardList.id);
                      }}
                    >
                      <div className=" justify-between items-start">
                        <div className='grid grid-cols-3 gap-1'>
                          {cardList.labels?.map((label: any, index: any) =>
                            <div key={index} style={{ background: label.label.color }} className="w-full h-2 rounded-sm"></div>
                          )}
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className="text-black text-sm">{cardList?.name}</span>
                          <p
                            className={`text-xs px-2 rounded-sm ${cardList?.score === 5 ? 'text-red-600 bg-red-100' :
                              cardList?.score === 4 ? 'text-orange-600 bg-orange-100' :
                                cardList?.score === 3 ? 'text-yellow-600 bg-yellow-100' :
                                  cardList?.score === 2 ? 'text-blue-600 bg-blue-100' :
                                    cardList?.score === 1 ? 'text-green-600 bg-green-100' :
                                      'text-gray-500 bg-gray-300'
                              }`}
                          >
                            {cardList?.score}
                          </p>
                        </div>
                        <button
                          className="absolute right-2 top-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePopUpCard(cardList, e);
                          }}
                        >
                          <i className="fas fa-pencil-alt text-xs"></i>
                        </button>
                      </div>
                      <div className='flex justify-end mt-2'>
                        <div className='flex justify-between w-full'>
                          <select
                            value={cardList?.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              handleUpdateStatusCardlist(cardList.id, newStatus);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-black bg-white"
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                            <option value="IN_REVIEW">In Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="NOT_SURE">Not Sure</option>
                          </select>
                          {cardList?.startDate && cardList?.endDate && (
                            <div className="bg-green-300 py-[1px] px-[2px] rounded-[2px] text-[9px] font-medium text-gray-600">
                              {`${format(new Date(cardList.endDate), 'PP')}`}
                            </div>
                          )}
                          <div className='flex -space-x-1'>
                            {cardList.members && cardList.members.length > 0 &&
                              cardList.members.slice(0, 3).map((member: any) => (
                                <img
                                  key={member.userId}
                                  src={member.photoUrl || '/path/to/default/avatar.png'}
                                  alt={`Profile of member ${member.userId}`}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              ))
                            }
                            {cardList.members && cardList.members.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 ml-1">
                                +{cardList.members.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  className="text-gray-500 hover:text-gray-700 mt-6 w-full text-left text-sm"
                  onClick={() => handleAddCardList(card.id)}
                >
                  + Add list
                </button>
                <div className="absolute top-10 right-2 z-20" >
                  {dropdownOpen === index && (
                    <div className="w-28 bg-white shadow-xl rounded-lg" ref={dropdownRef}>
                      <ul className="py-2">
                        <li
                          className="px-4 py-2 rounded-t-lg hover:bg-gray-100 cursor-pointer text-gray-700"
                          onClick={() => handleOpenEditCard(card)}
                        >
                          Edit
                        </li>
                        <li
                          className="px-4 py-2 rounded-b-lg hover:bg-gray-100 hover:text-red-500 cursor-pointer text-gray-700"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <button
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl h-10 w-64 text-sm group hover:bg-gray-200 transition-colors duration-300 flex items-center flex-shrink-0"
            onClick={handleOpenCreateCard}
          >
            <i className="fas fa-plus h-3 w-3 mr-3 group-hover:text-purple-500 transition-colors duration-300"></i>
            <p className="group-hover:text-purple-500 transition-colors duration-300">
              Add Card
            </p>
          </button>
        </div>
      </main>

      {isCreateCardOpen && (
        <CreateCard
          workspaceId={workspaceId}
          boardId={boardId}
          onClose={handleCloseCreateCard}
          onCreateCard={handleCreateCard}
          onUpdateCard={handleEditCard}
          initialData={currentCard || { id: '', name: '' }}
          isEditing={false}
        />
      )}

      {isEditCardOpen && (
        <CreateCard
          workspaceId={workspaceId}
          boardId={boardId}
          onClose={handleCloseEditCard}
          onCreateCard={handleCreateCard}
          onUpdateCard={handleEditCard}
          initialData={currentCard || { id: '', name: '' }}
          isEditing={true}
        />
      )}
      {/* 
      {isPopupOpen && selectedCardList && (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-30 overflow-y-auto pt-4 pb-1">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[650px] my-auto mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6">
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


                <button onClick={handleClosePopup} className="text-gray-700 hover:text-gray-700">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="cardlist flex gap-4 max768:flex-col">
                <div className="cardliststart w-full max768:w-full flex-[3]">
                  <div className='flex items-center'>
                    <div className="flex items-center flex-wrap gap-[7px]">
                      {labelColors?.map((color, index) => (
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
                    {cardlistCustomFields.map((field) => (
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
                            {field.customField.options.map((opt) => (
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
                      {attachments.map((attachment, index) => (
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
                    {checklistData?.map((data, index) => {
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
            </div>
          </div>
        </div>
      )} */}



      <Routes>
        <Route
          path="cardList/:id"
          element={
            <>
              <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-30 overflow-y-auto pt-4 pb-1">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-[650px] my-auto mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
                  <div className="sticky top-0 bg-white z-10 p-6">
                    <WorkspaceCardList
                      editingListName={editingListName}
                      inputRef={inputRef}
                      selectedCardList={selectedCardList}
                      setSelectedCardList={setSelectedCardList}
                      handleUpdateListName={handleUpdateListName}
                      setEditingListName={setEditingListName}
                      handleClosePopup={handleClosePopup}
                      labelColors={labelColors}
                      getContrastColor={getContrastColor}
                      inReviewPhoto={inReviewPhoto}
                      approvedPhoto={approvedPhoto}
                      cardlistCustomFields={cardlistCustomFields}
                      openDeleteConfirmationCustomField={openDeleteConfirmationCustomField}
                      handleInputChange={handleInputChange}
                      attachments={attachments}
                      handleAttachImage={handleAttachImage}
                      handleDownloadAttachment={handleDownloadAttachment}
                      handleDeleteAttachmentClick={handleDeleteAttachmentClick}
                      isDeleting={isDeleting}
                      deleteError={deleteError}
                      checklistData={checklistData}
                      calculateChecklistPercentage={calculateChecklistPercentage}
                      handleOpenChecklistPopup={handleOpenChecklistPopup}
                      setExistingChecklistData={setExistingChecklistData}
                      handleToggleIsDone={handleToggleIsDone}
                      openDeleteConfirmation={openDeleteConfirmation}
                      handleJoinClick={handleJoinClick}
                      handleOpenMemberPopup={handleOpenMemberPopup}
                      handleOpenLabelsPopup={handleOpenLabelsPopup}
                      handleOpenDatesPopup={handleOpenDatesPopup}
                      handleOpenAttachPopup={handleOpenAttachPopup}
                      handleOpenCopyPopup={handleOpenCopyPopup}
                      handleDeleteCardList={handleDeleteCardList}
                      setIsCustomFieldModalOpen={setIsCustomFieldModalOpen}
                      isCopied={isCopied}
                      workspaceId={workspaceId}
                      boardId={boardId}
                    />
                  </div>
                </div>
              </div>
            </>
          }
        />
      </Routes>

      <div className='text-black'>
        <CustomFieldSettings
          isOpen={isCustomFieldModalOpen}
          onClose={() => setIsCustomFieldModalOpen(false)}
          workspaceId={workspaceId}
          onCustomFieldClick={handleCustomFieldClick}
        />
      </div>

      {
        isEditCard && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
              <div
                className="absolute bg-white rounded-md items-center"
                style={{
                  top: `${activeCardRect?.top}px`,
                  left: `${activeCardRect?.left}px`,
                  width: `${activeCardRect?.width}px`,
                  height: `${activeCardRect?.height}px`,
                }}
              >
                {editingCard && (
                  <>
                    <div className="flex items-center px-3 py-2 mb-5 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300">
                      <div className={`w-2 h-2 rounded-full ${editingCard?.color} mr-2`}></div>
                      <span className="text-black text-sm">{editingCard?.name}</span>
                    </div>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditCard(false);
                      }}
                      className="block rounded-md py-2 w-24 mb-2 text-sm text-center text-white bg-purple-500 hover:bg-purple-600"
                    >
                      Save
                    </a>
                  </>
                )}
              </div>
            </div>

            <div
              className="fixed z-20"
              style={{
                top: `${activeCardRect?.top}px`,
                left: `${activeCardRect?.right}px`,
              }}
            >
              <div className="py-1 ml-5" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <a href="#" className="block mb-3 px-4 py-2 text-sm rounded-md shadow-lg text-gray-700 bg-white hover:bg-gray-100" onClick={() => {
                  handleOpenPopup(editingCard);
                }}>Open Card</a>
                <a href="#" className="block my-3 px-4 py-2 text-sm rounded-md shadow-lg text-gray-700 bg-white hover:bg-gray-100" onClick={() => {
                  handleOpenLabelsPopup(editingCard);
                }}>Edit Labels</a>
                <a href="#" className="block my-3 px-4 py-2 text-sm rounded-md shadow-lg text-gray-700 bg-white hover:bg-gray-100" onClick={() => {
                  handleOpenMemberPopup(editingCard);
                }}>Change Member</a>
                <a href="#" className="block my-3 px-4 py-2 text-sm rounded-md shadow-lg text-gray-700 bg-white hover:bg-gray-100" onClick={() => {
                  handleOpenDatesPopup(editingCard);
                }}>Edit Dates</a>
              </div>
            </div>
          </>
        )
      }

      {
        selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 overflow-auto">
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="object-fit max-h-screen"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          </div>
        )
      }

      {
        showDeleteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <DeleteConfirmation
              onDelete={confirmDeleteCard}
              onCancel={handleCancelPopUp}
              itemType="card"
            />
          </div>
        )
      }

      {
        showDeleteAttachmentConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <DeleteConfirmation
              onDelete={confirmDeleteAttachment}
              onCancel={cancelDeleteAttachment}
              itemType="attachment"
            />
          </div>
        )
      }

      {
        deleteCardlist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <DeleteConfirmation
              onDelete={confirmDeleteCardList}
              onCancel={cancelDeleteCardList}
              itemType="cardlist"
            />
          </div>
        )
      }

      {
        isMemberPopupOpen && selectedCardList && (
          <MemberPopup
            selectedCardList={selectedCardList}
            isMemberPopupOpen={isMemberPopupOpen}
            handleCloseMemberPopup={handleCloseMemberPopup}
          />
        )
      }

      {
        isLabelsPopupOpen && selectedCardList && (
          <div className='overflow-auto'>
            <LabelsPopup
              isOpen={isLabelsPopupOpen}
              onClose={handleCloseLabelsPopup}
              labels={labels}
              onCreateNewLabel={handleCreateNewLabel}
              cardlistId={selectedCardList.id}
              workspaceId={workspaceId !== undefined ? workspaceId : ''}
              funcfetchLabels={funcfetchLabels}
              handlefetchCardListLabels={handlefetchCardListLabels}
              fetchData2={fetchData2}
            />
          </div>
        )
      }

      {
        isEditLabelOpen && (
          <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <EditLabel
              labelName=""
              labelColor="#000000"
              labelPercentage={100}
              onSave={handleCloseEditLabel}
              onCancel={handleCloseEditLabel}
              fetchCard={fetchData2}
            />
          </div>
        )
      }

      {
        isChecklistPopupOpen && selectedCardList && (
          <div>
            <ChecklistPopup
              isOpen={true}
              onClose={handleCloseChecklistPopup}
              selectedCardList={selectedCardList}
              handleTakeCardlistChecklist={handleTakeCardlistChecklist}
              isEditMode={isEditMode}
              existingChecklistData={existingChecklistData}
            />
          </div>
        )
      }

      {
        isDatesPopupOpen && selectedCardList && (
          <DatesPopup
            isDatesPopupOpen={isDatesPopupOpen}
            selectedCardList={selectedCardList}
            handleCloseDatesPopup={handleCloseDatesPopup}
            onSave={handleSaveDates}
          />
        )
      }

      {
        isAttachPopupOpen && selectedCardList && (
          <AttachPopup
            isAttachPopupOpen={isAttachPopupOpen}
            selectedCardList={selectedCardList}
            handleCloseAttachPopup={handleCloseAttachPopup}
            onAttachmentCreated={handleAttachmentCreated}
          />
        )
      }

      {
        isSubmitPopupOpen && selectedCardList && (
          <SubmitPopup
            isSubmitPopupOpen={isSubmitPopupOpen}
            selectedCardList={selectedCardList}
            handleCloseSubmitPopup={handleCloseSubmitPopup}
          />
        )
      }

      {
        isCopyPopupOpen && selectedCardList && (
          <CopyPopup
            isCopyPopupOpen={isCopyPopupOpen}
            selectedCardList={selectedCardList}
            workspaceId={workspaceId}
            close={handleCloseSubmitPopup}
          />
        )
      }
      {deleteChecklistModal &&
        (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <DeleteConfirmation
              onDelete={() => confirmDeleteChecklist()}
              onCancel={cancelDeleteChecklist}
              itemType="checklist"
            />
          </div>
        )
      }
      {deleteCustomFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <DeleteConfirmation
            onDelete={confirmRemoveCustomField}
            onCancel={cancelRemoveCustomField}
            itemType="customfield"
          />
        </div>
      )}
    </>
  );
};

export default WorkspaceProject;