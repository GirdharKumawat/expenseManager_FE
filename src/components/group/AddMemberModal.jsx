import { X, UserPlus } from "lucide-react";
import { useState } from "react";
import useGroup from "../../features/group/useGroup";

function AddMemberModal({ onClose, group }) {
    const [email, setemail] = useState("");
    const { postMember } = useGroup();

    function handleSubmit() {
        postMember({ email, group });
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="m-4 w-full max-w-md rounded-2xl bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Add Group Member</h2>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Information Message */}
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                        <div className="flex items-start space-x-2">
                            <UserPlus className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-blue-800">
                                    Add Existing User
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Members can only be added if they are already registered users of this app. 
                                    Please enter the email address of an existing user.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Member Email
                        </label>
                        <div className="space-y-2">
                            <div className="flex space-x-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                    className="flex-1 rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-slate-700 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!email.trim()}
                            className="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 font-medium text-white hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-50">
                            Add Member
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddMemberModal;
