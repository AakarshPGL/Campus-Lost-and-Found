import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"

function MyReports() {
    const navigate = useNavigate()
    const location = useLocation()

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedItem, setSelectedItem] = useState(null)
    const [resolving, setResolving] = useState(false)

    async function fetchMyReports() {
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/login", {
                    state: { backgroundLocation: location },
                })
                return
            }

            const response = await fetch(
                "http://localhost:5000/api/my-reports",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch reports"
                )
            }

            setItems(data)
        } catch (error) {
            console.error("Error fetching my reports:", error)
            setError(
                error.message || "Failed to load your reports"
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyReports()
    }, [])

    function openResolveConfirmation(item) {
        setSelectedItem(item)
    }

    function closeResolveConfirmation() {
        if (!resolving) {
            setSelectedItem(null)
        }
    }

    async function resolveReport() {
        if (!selectedItem) return

        setResolving(true)

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                `http://localhost:5000/api/items/${selectedItem._id}/resolve`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to resolve report"
                )
            }

            setItems((currentItems) =>
                currentItems.map((item) =>
                    item._id === selectedItem._id
                        ? { ...item, status: "Resolved" }
                        : item
                )
            )

            setSelectedItem(null)
        } catch (error) {
            console.error("Error resolving report:", error)
            alert(
                error.message || "Failed to resolve report"
            )
        } finally {
            setResolving(false)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F5F1E8] px-6 pb-20 pt-32 lg:px-12 lg:pt-36">
                <div className="mx-auto max-w-[1100px]">
                    <p className="text-[15px] text-stone-500">
                        Loading your reports...
                    </p>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen bg-[#F5F1E8] px-6 pb-20 pt-32 lg:px-12 lg:pt-36">
                <div className="mx-auto max-w-[1100px]">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                        <p className="text-[15px] text-red-600">
                            {error}
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    const activeItems = items.filter(
        (item) => item.status !== "Resolved"
    )

    const resolvedItems = items.filter(
        (item) => item.status === "Resolved"
    )

    function ReportCard({ item, resolved }) {
        const formattedDate = item.date
            ? new Date(item.date).toLocaleDateString()
            : "Not provided"

        const isFound = item.type === "Found"

        return (
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${resolved
                        ? "border-stone-200 opacity-80"
                        : "border-stone-200"
                    }`}
            >
                <div className="flex flex-col md:flex-row">

                    {/* Image */}

                    <div className="h-56 w-full shrink-0 bg-stone-100 md:h-auto md:w-52">
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-stone-400">
                                No image
                            </div>
                        )}
                    </div>


                    {/* Details */}

                    <div className="flex flex-1 flex-col p-6">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                                    {item.category}
                                </p>

                                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#171717]">
                                    {item.name}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2">

                                <span
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${isFound
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-red-50 text-red-600"
                                        }`}
                                >
                                    {item.type}
                                </span>

                                {resolved && (
                                    <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
                                        ✓ Resolved
                                    </span>
                                )}

                            </div>

                        </div>


                        <div className="mt-5 space-y-2 text-[15px] text-stone-500">
                            <p>📍 {item.location}</p>
                            <p>📅 {formattedDate}</p>
                        </div>


                        <div className="mt-7 flex flex-wrap gap-3">

                            <motion.button
                                type="button"
                                onClick={() =>
                                    navigate(`/items/${item._id}`)
                                }
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="rounded-lg border border-stone-300 px-4 py-2.5 text-[14px] font-medium text-stone-700 transition hover:bg-stone-50"
                            >
                                View Report
                            </motion.button>

                            {!resolved && (
                                <motion.button
                                    type="button"
                                    onClick={() =>
                                        openResolveConfirmation(item)
                                    }
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="rounded-lg bg-[#171717] px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-stone-700"
                                >
                                    Mark as Resolved
                                </motion.button>
                            )}

                        </div>

                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <main className="min-h-screen bg-[#F5F1E8] px-5 pb-24 pt-32 sm:px-6 lg:px-12 lg:pt-36">

            <div className="mx-auto max-w-[1100px]">

                {/* Header */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                        Your activity
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#171717] md:text-5xl">
                        My Reports
                    </h1>

                    <p className="mt-4 text-[16px] leading-7 text-stone-600">
                        Manage the items you have reported.
                    </p>
                </motion.div>


                {/* Active */}

                <section className="mt-12">

                    <div className="flex items-end justify-between">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                                Current
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
                                Active Reports
                            </h2>

                            <p className="mt-2 text-[15px] text-stone-500">
                                Reports that are still active.
                            </p>
                        </div>

                        <span className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-stone-600 shadow-sm">
                            {activeItems.length}
                        </span>

                    </div>


                    {activeItems.length === 0 ? (

                        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white/50 px-6 py-14 text-center">

                            <h3 className="text-lg font-semibold text-[#171717]">
                                No active reports
                            </h3>

                            <p className="mt-2 text-[15px] text-stone-500">
                                You don't have any active reports.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/report")}
                                className="mt-6 rounded-lg bg-[#171717] px-5 py-3 text-[15px] font-medium text-white transition hover:bg-stone-700"
                            >
                                Report an Item
                            </button>

                        </div>

                    ) : (

                        <div className="mt-6 space-y-5">
                            {activeItems.map((item) => (
                                <ReportCard
                                    key={item._id}
                                    item={item}
                                    resolved={false}
                                />
                            ))}
                        </div>

                    )}

                </section>


                {/* Resolved */}

                <section className="mt-16">

                    <div className="flex items-end justify-between">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                                History
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
                                Resolved Reports
                            </h2>

                            <p className="mt-2 text-[15px] text-stone-500">
                                Reports you have already resolved.
                            </p>
                        </div>

                        <span className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-stone-600 shadow-sm">
                            {resolvedItems.length}
                        </span>

                    </div>


                    {resolvedItems.length === 0 ? (

                        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white/40 px-6 py-12 text-center">
                            <p className="text-[15px] text-stone-500">
                                No resolved reports yet.
                            </p>
                        </div>

                    ) : (

                        <div className="mt-6 space-y-5">
                            {resolvedItems.map((item) => (
                                <ReportCard
                                    key={item._id}
                                    item={item}
                                    resolved={true}
                                />
                            ))}
                        </div>

                    )}

                </section>

            </div>


            {/* Resolve Confirmation */}

            <AnimatePresence>
                {selectedItem && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
                        onClick={closeResolveConfirmation}
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
                            className="w-full max-w-md rounded-2xl border border-stone-200 bg-[#FDFCF9] p-7 shadow-2xl"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                                Confirm action
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
                                Mark as resolved?
                            </h2>

                            <p className="mt-3 text-[15px] leading-6 text-stone-500">
                                Are you sure you want to mark{" "}
                                <span className="font-semibold text-stone-700">
                                    {selectedItem.name}
                                </span>{" "}
                                as resolved? It will move to your resolved reports.
                            </p>

                            <div className="mt-7 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={closeResolveConfirmation}
                                    disabled={resolving}
                                    className="rounded-lg border border-stone-300 px-5 py-2.5 text-[14px] font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <motion.button
                                    type="button"
                                    onClick={resolveReport}
                                    disabled={resolving}
                                    whileTap={{ scale: 0.97 }}
                                    className="rounded-lg bg-[#171717] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {resolving
                                        ? "Resolving..."
                                        : "Yes, Resolve"}
                                </motion.button>

                            </div>

                        </motion.div>

                    </motion.div>

                )}
            </AnimatePresence>

        </main>
    )
}

export default MyReports