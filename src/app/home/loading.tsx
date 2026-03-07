import { Skeleton } from "@/components/myComponents/Skeleton";

export default function Loading() {
    return (
        <div className="p-6">
            {/* Search info skeleton */}
            <div className="mb-6">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-32" />
            </div>

            {/* Masonry grid skeleton - Fixed pattern */}
            <div className="my-masonry-grid">
                {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                    <div key={col} className="my-masonry-grid_column">
                        {/* Different heights for each column */}
                        {col === 1 && (
                            <>
                                <Skeleton className="w-full h-64 rounded-lg mb-4" />
                                <Skeleton className="w-full h-48 rounded-lg mb-4" />
                                <Skeleton className="w-full h-80 rounded-lg mb-4" />
                            </>
                        )}
                        {col === 2 && (
                            <>
                                <Skeleton className="w-full h-56 rounded-lg mb-4" />
                                <Skeleton className="w-full h-72 rounded-lg mb-4" />
                                <Skeleton className="w-full h-40 rounded-lg mb-4" />
                            </>
                        )}
                        {col === 3 && (
                            <>
                                <Skeleton className="w-full h-80 rounded-lg mb-4" />
                                <Skeleton className="w-full h-56 rounded-lg mb-4" />
                                <Skeleton className="w-full h-64 rounded-lg mb-4" />
                            </>
                        )}
                        {col === 4 && (
                            <>
                                <Skeleton className="w-full h-48 rounded-lg mb-4" />
                                <Skeleton className="w-full h-80 rounded-lg mb-4" />
                                <Skeleton className="w-full h-56 rounded-lg mb-4" />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}