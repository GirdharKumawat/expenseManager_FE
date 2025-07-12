 import {Users} from 'lucide-react'

const GroupCard = ({ group, onClick }) => (
  <div 
    onClick={()=>{onClick(group)}}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">{group.name}</h3>
          <p className="text-sm text-slate-600">{group.members} members</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-slate-600">Total ₹{group.totalExpense.toLocaleString()}</p>
        <div className={`text-sm font-medium mt-2 ${group.userBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {group.userBalance === 0 ? (
            <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-full text-xs">All settled up!</span>
          ) : group.userBalance > 0 ? (
            <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">You are owed ₹{group.userBalance.toLocaleString()}</span>
          ) : (
            <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">You owe ₹{Math.abs(group.userBalance).toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
    <div className="text-xs text-slate-500">
      Created by {group.createdBy}
    </div>
  </div>
);

export default GroupCard;