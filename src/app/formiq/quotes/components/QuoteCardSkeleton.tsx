// Skeleton component for quote cards
export default function QuoteCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
      <div className="space-y-3">
        {/* Quote number skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        {/* Customer name skeleton */}
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        
        {/* Amount skeleton */}
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        
        {/* Status skeleton */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="h-2 bg-gray-200 rounded-full w-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Date skeleton */}
        <div className="h-3 bg-gray-200 rounded w-20 mt-2"></div>
      </div>
    </div>
  )
} 