import { useEffect, useState } from "react";
import { Plus, Users, UserPlus, Sparkles } from "lucide-react";
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
        if (!groups || groups.length < 1) fetchGroups();
    }, []);

    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        setIsGroupOpen(true);
    };

    if (!isGroupOpen) {
        return (
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 pb-28 space-y-6 min-h-screen">
                {loading === "postGroup" && <Loader />}

                {/* Header section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            <span>Group Expenses</span>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {groups.length} Groups
                            </span>
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Split bills, track shared balances, and settle up easily with friends
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-700 hover:to-teal-600 active:scale-98">
                        <Plus className="h-4 w-4" />
                        <span>Create Group</span>
                    </button>
                </div>

                {loading === "fetchGroups" && <Skeleton />}

                {loading === "" && groups.length > 0 && (
                    <div className="space-y-3">
                        {groups.map((group) => (
                            <GroupCard
                                key={group.id}
                                group={group}
                                onClick={(g) => handleGroupClick(g)}
                            />
                        ))}
                    </div>
                )}

                {loading === "" && groups.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center shadow-xs">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
                            <Users className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No groups created yet</h3>
                        <p className="mt-1 text-xs text-slate-500 max-w-sm">
                            Create your first group for roommates, trips, or events to start splitting expenses effortlessly!
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="mt-4 flex items-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-emerald-700 transition-all">
                            <Plus className="h-4 w-4" />
                            <span>Create First Group</span>
                        </button>
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