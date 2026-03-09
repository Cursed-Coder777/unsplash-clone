export default function Loading() {
    return (
        <div className="container mx-auto p-4">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                    <div key={item} className="space-y-4">
                        <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}