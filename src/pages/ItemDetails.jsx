import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useParams, useLocation } from "react-router-dom"

function ItemDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showContact, setShowContact] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        async function fetchItem() {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/items/${id}`
                )

                if (!response.ok) {
                    throw new Error("Item not found")
                }

                const data = await response.json()
                setItem(data)

            } catch (error) {
                console.error("Error fetching item:", error)
                setError("Unable to load this report.")
            } finally {
                setLoading(false)
            }
        }

        fetchItem()
    }, [id])

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F5F1E8] px-6 pb-20 pt-32">
                <div className="mx-auto max-w-[1200px] text-center">
                    <p className="text-[15px] text-stone-500">
                        Loading report...
                    </p>
                </div>
            </main>
        )
    }

    if (error || !item) {
        return (
            <main className="min-h-screen bg-[#F5F1E8] px-6 pb-20 pt-32">
                <div className="mx-auto max-w-[1200px] text-center">

                    <p className="text-[15px] text-red-600">
                        {error || "Item not found"}
                    </p>

                    <button
                        onClick={() => navigate("/browse")}
                        className="mt-6 rounded-lg bg-[#171717] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-stone-700"
                    >
                        Back to Browse
                    </button>

                </div>
            </main>
        )
    }

    const formattedDate = item.date
        ? new Date(item.date).toLocaleDateString()
        : "Not provided"

    const isFound = item.type === "Found"
    const isResolved = item.status === "Resolved"

    const currentUser = JSON.parse(
        localStorage.getItem("user") || "null"
    )

    const isReporter =
        currentUser?.email &&
        item.reportedBy?.email &&
        currentUser.email === item.reportedBy.email

    function handleContactClick() {
        const token = localStorage.getItem("token")

        if (!token) {
            navigate("/login", {
                state: {
                    backgroundLocation: location,
                },
            })

            return
        }

        setShowContact(true)
    }

    function sendMessage() {
        if (!message.trim()) return

        const reporterEmail = item.reportedBy?.email

        if (!reporterEmail) {
            alert("Reporter email is not available for this report.")
            return
        }

        const subject = isFound
            ? `Claim regarding your ${item.name} report`
            : `Regarding your lost ${item.name}`

        const body = `${message.trim()}

Item: ${item.name}
Location: ${item.location}
Date: ${formattedDate}`

        const gmailUrl =
            `https://mail.google.com/mail/?view=cm&fs=1` +
            `&to=${encodeURIComponent(reporterEmail)}` +
            `&su=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`

        window.open(gmailUrl, "_blank")

        setShowContact(false)
        setMessage("")
    }

    return (
        <main className="min-h-screen bg-[#F5F1E8] px-6 pb-24 pt-32 lg:px-12 lg:pt-36">

            <div className="mx-auto max-w-[1200px]">

                {/* Back */}

                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="mb-8 text-[15px] font-medium text-stone-500 transition hover:text-[#171717]"
                >
                    ← Back
                </motion.button>


                {/* Main */}

                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">

                    {/* Image */}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
                    >

                        <div className="flex min-h-[360px] items-center justify-center bg-stone-100 sm:min-h-[500px]">

                            {item.imageUrl ? (

                                <motion.img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    initial={{ scale: 1.03 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.7 }}
                                    className="h-full max-h-[650px] w-full object-cover"
                                />

                            ) : (

                                <span className="text-[15px] text-stone-400">
                                    No image available
                                </span>

                            )}

                        </div>

                    </motion.div>


                    {/* Details */}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.1,
                        }}
                        className="flex flex-col justify-center"
                    >

                        <div className="flex items-start justify-between gap-5">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                                    {item.category}
                                </p>

                                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#171717] md:text-5xl">
                                    {item.name}
                                </h1>

                            </div>


                            <div className="flex shrink-0 flex-col items-end gap-2">

                                <span
                                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide ${isFound
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-600"
                                        }`}
                                >
                                    {item.type}
                                </span>

                                {isResolved && (
                                    <span className="rounded-full bg-stone-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
                                        ✓ Resolved
                                    </span>
                                )}

                            </div>

                        </div>


                        {/* Information */}

                        <div className="mt-9 space-y-7">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                                    Description
                                </p>

                                <p className="mt-2 text-[16px] leading-7 text-stone-600">
                                    {item.description}
                                </p>

                            </div>


                            <div className="grid gap-5 sm:grid-cols-2">

                                <div className="rounded-xl border border-stone-200/80 bg-white/50 p-4">

                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                                        Location
                                    </p>

                                    <p className="mt-2 text-[15px] font-medium text-stone-700">
                                        📍 {item.location}
                                    </p>

                                </div>


                                <div className="rounded-xl border border-stone-200/80 bg-white/50 p-4">

                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                                        Date
                                    </p>

                                    <p className="mt-2 text-[15px] font-medium text-stone-700">
                                        {formattedDate}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Claim / Reporter section */}

                        <div className="mt-10 border-t border-stone-300/60 pt-7">

                            {isResolved ? (

                                <div className="rounded-xl border border-stone-200 bg-white/60 px-5 py-5">

                                    <p className="text-[15px] font-semibold text-stone-700">
                                        ✓ Report Resolved
                                    </p>

                                    <p className="mt-2 text-[15px] leading-6 text-stone-500">
                                        This report has already been marked as resolved.
                                    </p>

                                </div>

                            ) : isReporter ? (

                                <div className="flex items-center justify-between gap-6">

                                    <div>
                                        <p className="text-[15px] font-semibold text-stone-700">
                                            ✓ This is your report
                                        </p>

                                        <p className="mt-1 text-[14px] leading-6 text-stone-500">
                                            You reported this item.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/my-reports")
                                        }
                                        className="shrink-0 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-700 hover:shadow-md"
                                    >
                                        Manage report
                                    </button>

                                </div>

                            ) : (

                                <motion.button
                                    type="button"
                                    onClick={handleContactClick}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full rounded-xl bg-[#171717] px-6 py-4 text-[15px] font-semibold text-white shadow-md transition hover:bg-stone-700 hover:shadow-lg"
                                >
                                    {isFound
                                        ? "I think this is my item"
                                        : "I found this item"}
                                </motion.button>

                            )}

                        </div>

                    </motion.div>

                </div>

            </div>


            {/* Contact Modal */}

            <AnimatePresence>

                {showContact && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
                        onClick={() =>
                            setShowContact(false)
                        }
                    >

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                                scale: 0.97,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 10,
                                scale: 0.97,
                            }}
                            transition={{ duration: 0.25 }}
                            className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-7 shadow-2xl"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                                        {isFound
                                            ? "Claim this item"
                                            : "Contact reporter"}
                                    </p>

                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
                                        {isFound
                                            ? "I think this is my item"
                                            : "I found this item"}
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowContact(false)
                                    }
                                    className="text-2xl leading-none text-stone-400 transition hover:text-stone-700"
                                >
                                    ×
                                </button>

                            </div>


                            <p className="mt-5 text-[15px] leading-6 text-stone-500">
                                {isFound
                                    ? "Describe identifying details that can help the reporter verify that this item belongs to you."
                                    : "Tell the owner where or how you found this item and provide any useful details."}
                            </p>


                            <textarea
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                rows="5"
                                placeholder={
                                    isFound
                                        ? "e.g. This is my wallet. It contains my college ID and a small photo inside."
                                        : "e.g. I found this near the library entrance around 3 PM."
                                }
                                className="mt-5 w-full resize-none rounded-xl border border-stone-300 px-4 py-3 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />


                            <div className="mt-5 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowContact(false)
                                        setMessage("")
                                    }}
                                    className="rounded-xl border border-stone-300 px-5 py-3 text-[15px] font-medium text-stone-600 transition hover:bg-stone-50"
                                >
                                    Cancel
                                </button>


                                <motion.button
                                    type="button"
                                    disabled={!message.trim()}
                                    onClick={sendMessage}
                                    whileTap={{ scale: 0.97 }}
                                    className="rounded-xl bg-[#171717] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {isFound
                                        ? "Send claim"
                                        : "Send message"}
                                </motion.button>

                            </div>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

        </main>
    )
}

export default ItemDetails