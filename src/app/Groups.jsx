import { useEffect, useState } from "react";
import { Plus,   Users } from "lucide-react";
import GroupCard from "../components/group/GroupCard";
import CreateGroupModal from "../components/group/CreateGroupModal";
import GroupDetailPage from "../components/group/GroupDetailPage";
import { useSelector } from "react-redux";
import Loader from "../components/ui/Loader";
import useGroup from "../features/group/useGroup";
import Skeleton from "../components/ui/Skeleton";

function Groups() {
    const { loading, groups } = useSelector((state) => state.group);
     
    const { fetchGroups } = useGroup();

    const [isGroupOpen, setIsGroupOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState({});


    useEffect(() => {
         
        fetchGroups();
    }, [ ]);

    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        setIsGroupOpen(true);
    };

    if (!isGroupOpen) {
        return (
            <div className="mb-4 min-h-screen bg-gray-50">
                <div className="bg-white p-4 text-black">
                    {loading === "postGroup" && <Loader />}

                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Groups</h1>
                        <button
                            onClick={() => {
                                setShowCreateModal(true);
                            }}
                            className="flex rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700">
                            <Plus className="h- w-5" /> <span className="ms-2">Create Group</span>
                        </button>
                    </div>
                </div>
              

                {loading === "fetchGroups" && <Skeleton />}

                {loading === "" && groups.length > 0 && (
                    <div className="space-y-4 p-4">
                        {groups.map((group) => (
                            <GroupCard key={group.id} group={group} onClick={(group)=>{
                                handleGroupClick(group)
                            }} />
                        ))}
                    </div>
                )}

                {loading === "" && groups.length === 0 && (
                    <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-green-600 bg-green-50 p-6 text-center shadow-sm mx-4">
                        <Users className="mb-3 h-10 w-10 text-green-500" />
                        <p className="text-lg font-semibold text-green-700">No groups found</p>
                        <p className="mt-1 text-sm text-green-600">
                            Create your first group to start splitting expenses!
                        </p>
                    </div>
                )}

                <CreateGroupModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                />
            </div>
        );
    } else {
        return (
            <GroupDetailPage
                currGroup={selectedGroup}
                onBack={() => {
                    setSelectedGroup(null);
                    setIsGroupOpen(false);
                }}
            />
        );
    }
}

export default Groups;






                // <div className="space-y-3 p-4">
                //     {invites.map((invite) => (
                //         <div
                //             key={invite.id}
                //             className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                //             <div className="flex items-center justify-between">
                //                 <div className="flex-1">
                //                     <p className="text-sm text-amber-800">
                //                         You've been invited to join{" "}
                //                         <span className="font-medium">'{invite.groupName}'</span> by{" "}
                //                         {invite.invitedBy}
                //                     </p>
                //                 </div>
                //                 <div className="ml-3 flex items-center space-x-2">
                //                     <button
                //                         onClick={() => handleJoinGroup(invite.id)}
                //                         className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                //                         Join
                //                     </button>
                //                     <button
                //                         onClick={() => handleDismissInvite(invite.id)}
                //                         className="p-1 text-amber-600 hover:text-amber-700">
                //                         <X className="h-4 w-4" />
                //                     </button>
                //                 </div>
                //             </div>
                //         </div>
                //     ))}
                // </div>  