import { X, Trash2, AlertTriangle } from "lucide-react";

const DeleteGroupModal = ({ group, onConfirm, onClose, isLoading }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md transform rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Delete Group</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        disabled={isLoading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Warning Icon */}
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>

                    {/* Group Info */}
                    <div className="mb-6 rounded-lg bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">{group.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {group.membersList.length} members • ₹{group.totalExpense.toLocaleString()} total
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                <span className="text-sm font-medium text-emerald-600">
                                    {group.name.charAt(0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="mb-6 text-center">
                        <p className="text-gray-600 mb-2">
                            Are you sure you want to delete this group?
                        </p>
                        <p className="text-sm text-red-600 font-medium">
                            This action cannot be undone. All expenses and member data will be permanently deleted.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>Deleting...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete Group</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteGroupModal;
