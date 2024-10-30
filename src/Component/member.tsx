import React, { useEffect, useState } from "react";
import useAuth from "../hooks/fetchAuth";
import { outCardList, getMemberCardList, assignMemberToCardList } from "../hooks/fetchCardList";
import { memberWorkspace, getProfilePhotoMember } from "../hooks/fetchWorkspace";
import { useParams } from "react-router-dom";

interface MemberPopupProps {
  selectedCardList: any;
  isMemberPopupOpen: any;
  handleCloseMemberPopup: any;
}

interface workspaceMember {
  id: string
  name: string
  email: string
}

const MemberPopup: React.FC<MemberPopupProps> = ({ selectedCardList, isMemberPopupOpen, handleCloseMemberPopup }) => {
  if (!isMemberPopupOpen || !selectedCardList) return null;

  const onSuccess = () => { };
  const onLogout = () => { };
  const { workspaceId } = useParams<{ workspaceId: any }>();

  const [profilePhotos, setProfilePhotos] = useState<{ [key: string]: string }>({});
  const [workspaceMember, setWorkspaceMember] = useState<workspaceMember[]>([]);
  const [userData, setUserData] = useState<{ [key: string]: { name: string; email: string } }>({});
  const [updatedMembers, setUpdatedMembers] = useState(selectedCardList.members);
  const [searchTerm, setSearchTerm] = useState("");

  const { getUserDataById } = useAuth(onSuccess, onLogout);

  useEffect(() => {
    const getMemberWorkspace = async () => {
      const data = await memberWorkspace(workspaceId);
      setWorkspaceMember(data);

      const photos: { [key: string]: string } = {};
      for (const member of data) {
        const photoUrl = await getProfilePhotoMember(member.id);
        if (photoUrl) {
          photos[member.id] = photoUrl;
        }
      }
      setProfilePhotos(photos);
    };

    getMemberWorkspace();
  }, [workspaceId]);

  useEffect(() => {
    updatedMembers?.forEach((member: { userId: any }) => {
      const id = member.userId;
      getUserDataById(id)
        .then((data: any) => {
          setUserData((prevUserData) => ({ ...prevUserData, [id]: data }));
        })
        .catch((error: any) => {
          console.error(error);
        });
    });
  }, [updatedMembers]);

  const cardListId = selectedCardList.id;

  const handleRemoveMember = async (userId: string) => {
    const filteredMembers = updatedMembers?.filter((member: any) => member?.userId !== userId);
    setUpdatedMembers(filteredMembers);
    try {
      await outCardList(cardListId, userId);
      const updatedCardList = await getMemberCardList(cardListId);
      setUpdatedMembers(updatedCardList.members);
      setUserData((prevUserData) => {
        const updatedUserData = { ...prevUserData };
        delete updatedUserData[userId];
        return updatedUserData;
      });
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleAssignMember = async (userId: string) => {
    await assignMemberToCardList(selectedCardList.id, userId);
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const filteredUpdatedMembers = updatedMembers?.filter((member) => {
    const memberData = userData[member.userId];
    return (
      (memberData?.name && memberData.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (memberData?.email && memberData.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const filteredWorkspaceMembers = workspaceMember.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-72 p-4 rounded-lg shadow-lg text-gray-900">
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-center w-full">
            <h2 className="text-lg font-medium">Member</h2>
          </div>
          <button onClick={handleCloseMemberPopup} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search member"
            className="w-full py-2 px-3 bg-gray-200 rounded-md text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <ul className="space-y-2 mb-2">
          {filteredUpdatedMembers?.map((member: any, index: any) => (
            <li key={index} className="flex items-center px-2 py-1 bg-gray-200 rounded-md">
              <img
                alt={`Profile of ${member.userId}`}
                src={member.photoUrl || "/path/to/default/avatar.png"}
                className="fas fa-user bg-gray-100 text-xs rounded-full text-gray-400 w-8 h-8 mr-2 flex items-center justify-center"
              />
              <span className="text-sm w-full">
                {userData[member.userId] && (
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col">
                      <span>
                        {userData[member?.userId]?.name}
                      </span>
                      <span>
                        {userData[member?.userId]?.email?.length > 20 ? userData[member?.userId]?.email.slice(0, 20) + '...' : userData[member?.userId]?.email}
                      </span>
                    </div>
                    <div className="relative">
                      <button
                        className="absolute right-0 top-2 text-gray-500 hover:text-gray-700"
                        onClick={() => { handleRemoveMember(member?.userId); handleCloseMemberPopup(); }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                )}
              </span>
            </li>
          ))}
        </ul>

        <div>
          <h3 className="text-sm font-normal mb-2">Workspace members</h3>
          <ul className="space-y-2">
            {filteredWorkspaceMembers.map((member, index) => {
              const isAssigned = updatedMembers?.some((updatedMember: { userId: any; }) => updatedMember.userId === member.id);

              return (
                <li key={index} className="flex justify-between py-2 px-3 bg-gray-200 rounded-md">
                  <div className="flex items-center">
                    <img
                      src={profilePhotos[member.id] || 'default-profile-pic-url'}
                      alt={`${member.name}'s profile`}
                      className="bg-gray-100 rounded-full w-6 h-6 mr-2"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm truncate">{member.name}</span>
                      <span className="text-sm truncate">{member.email.length > 20 ? member.email.slice(0, 20) + '...' : member.email}</span>
                    </div>
                  </div>
                  {!isAssigned && (
                    <div className="relative">
                      <button
                        className={`btn btn-sm absolute right-0 top-1 ${isAssigned ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-800'} text-white border-none font-normal text-[12px]`}
                        disabled={isAssigned}
                        onClick={() => {
                          handleAssignMember(member.id);
                          handleCloseMemberPopup();
                        }}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemberPopup;