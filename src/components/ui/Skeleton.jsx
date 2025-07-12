import React from 'react'
import { Users } from "lucide-react";

const GroupCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded-full w-28"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-20"></div>
    </div>
  );
};
 



function Skeleton() {
  return (
<div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-full space-y-4">
        {[1, 2, 3].map((i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    </div>
   )
}

export default Skeleton