import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

function ItemCard({
    id,
    name,
    status,
    location,
    time,
    imageUrl,
}) {
    const navigate = useNavigate()


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
            return `${diffInMinutes} ${diffInMinutes === 1
                    ? "minute"
                    : "minutes"
                } ago`
        }

        const diffInHours = Math.floor(
            diffInMinutes / 60
        )

        if (diffInHours < 24) {
            return `${diffInHours} ${diffInHours === 1
                    ? "hour"
                    : "hours"
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


    const isLost = status === "Lost"


    return (
        <motion.div
            onClick={() =>
                navigate(`/items/${id}`)
            }

            initial={{
                opacity: 0,
                y: 20,
            }}

            whileInView={{
                opacity: 1,
                y: 0,
            }}

            viewport={{
                once: true,
                amount: 0.2,
            }}

            whileHover={{
                y: -6,
            }}

            transition={{
                duration: 0.45,
                ease: "easeOut",
            }}

            className="group cursor-pointer overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
        >

            {/* =============================== */}
            {/* IMAGE */}
            {/* =============================== */}

            <div className="relative h-60 overflow-hidden bg-stone-100">

                {imageUrl ? (

                    <motion.img
                        src={imageUrl}
                        alt={name}

                        initial={{
                            scale: 1,
                        }}

                        whileHover={{
                            scale: 1.06,
                        }}

                        transition={{
                            duration: 0.5,
                            ease: "easeOut",
                        }}

                        className="h-full w-full object-cover"
                    />

                ) : (

                    <div className="flex h-full items-center justify-center">

                        <span className="text-[15px] text-stone-400">
                            No image available
                        </span>

                    </div>

                )}


                {/* Status */}

                <div
                    className={`absolute right-4 top-4 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide shadow-sm backdrop-blur-sm ${isLost
                            ? "bg-red-50/95 text-red-600"
                            : "bg-emerald-50/95 text-emerald-600"
                        }`}
                >
                    {status}
                </div>

            </div>


            {/* =============================== */}
            {/* CONTENT */}
            {/* =============================== */}

            <div className="p-6">

                {/* Item name */}

                <h2 className="line-clamp-1 text-xl font-semibold tracking-tight text-[#171717] transition-colors duration-200 group-hover:text-blue-700">
                    {name}
                </h2>


                {/* Location */}

                <div className="mt-4 flex items-center gap-2.5">

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm">
                        📍
                    </span>

                    <p className="line-clamp-1 text-[15px] text-stone-500">
                        {location}
                    </p>

                </div>


                {/* Time */}

                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">

                    <p className="text-sm text-stone-400">
                        Reported {getTimeAgo(time)}
                    </p>

                    <motion.span
                        className="text-base font-medium text-stone-400"
                        whileHover={{
                            x: 3,
                        }}
                    >
                        →
                    </motion.span>

                </div>

            </div>

        </motion.div>
    )
}

export default ItemCard