import {UserPlus,X,Minus } from 'lucide-react'
import { useState } from 'react';
import useGroup from '../../features/group/useGroup'
const CreateGroupModal = ({ isOpen, onClose}) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [memberEmails, setMemberEmails] = useState(['']);

  const {postGroup} = useGroup();

  const addMemberField = () => {
    setMemberEmails([...memberEmails, '']);
  };

  const removeMemberField = (index) => {
    setMemberEmails(prev => prev.filter((_, i) => i !== index));
  };

  const updateMemberEmail = (index, email) => {
    setMemberEmails(prev => prev.map((item, i) => i === index ? email : item));
  };

  const handleSubmit = () => {
    if (groupName.trim() && description.trim()) {
      
      postGroup({
        name:groupName.trim(),
        description:description.trim()
      })
      setGroupName('');
      setDescription('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 m-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Create Group</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter group name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Group Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter group Description"
            />
          </div>
          
          {/* <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Member Emails</label>
            <div className="space-y-2">
              {memberEmails.map((email, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateMemberEmail(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter email address"
                  />
                  {memberEmails.length > 1 && (
                    <button
                      onClick={() => removeMemberField(index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addMemberField}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            </div>
          </div> */}
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!groupName.trim() || !description.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;