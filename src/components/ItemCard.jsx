import { useNavigate } from "react-router-dom"

function ItemCard({ id, name, status, location, time, imageUrl }) {
    const navigate = useNavigate()
    console.log("ITEM ID:", id)

    const getTimeAgo = (dateString) => {
        if (!dateString) return "Recently"

        const now = new Date()
        const date = new Date(dateString)

        const diffInSeconds = Math.floor(
            (now - date) / 1000
        )

        if (diffInSeconds < 60) {
            return "just now"
        }

        const diffInMinutes = Math.floor(
            diffInSeconds / 60
        )

        if (diffInMinutes < 60) {
            return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"
                } ago`
        }

        const diffInHours = Math.floor(
            diffInMinutes / 60
        )

        if (diffInHours < 24) {
            return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"
                } ago`
        }

        const diffInDays = Math.floor(
            diffInHours / 24
        )

        if (diffInDays === 1) {
            return "yesterday"
        }

        return `${diffInDays} days ago`
    }

    return (
        <div
            onClick={() => navigate(`/items/${id}`)}
            className="cursor-pointer overflow-hidden border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
        >

            <div className="flex h-56 items-center justify-center bg-stone-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-sm text-stone-400">
                        No image
                    </span>
                )}
            </div>

            <div className="p-5">

                <div className="flex items-start justify-between gap-4">

                    <h2 className="text-lg font-semibold text-[#171717]">
                        {name}
                    </h2>

                    <span
                        className={`text-xs font-semibold uppercase tracking-wide ${status === "Lost"
                            ? "text-red-600"
                            : "text-emerald-600"
                            }`}
                    >
                        {status}
                    </span>

                </div>

                <p className="mt-3 text-sm text-stone-500">
                    📍 {location}
                </p>

                <p className="mt-1 text-sm text-stone-400">
                    Reported {getTimeAgo(time)}
                </p>

            </div>

        </div>
    )
}

export default ItemCard