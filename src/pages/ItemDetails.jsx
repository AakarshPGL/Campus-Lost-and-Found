import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

function ItemDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showContact, setShowContact] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        async function fetchItem() {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/items/${id}`
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
            <main className="min-h-[calc(100vh-73px)] bg-[#F7F7F5] px-6 py-16">
                <div className="mx-auto max-w-5xl text-center">
                    <p className="text-sm text-stone-500">
                        Loading report...
                    </p>
                </div>
            </main>
        )
    }

    if (error || !item) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-[#F7F7F5] px-6 py-16">
                <div className="mx-auto max-w-5xl text-center">

                    <p className="text-sm text-red-600">
                        {error || "Item not found"}
                    </p>

                    <button
                        onClick={() => navigate("/browse")}
                        className="mt-6 bg-[#171717] px-5 py-3 text-sm font-medium text-white"
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

    return (
        <main className="min-h-[calc(100vh-73px)] bg-[#F7F7F5] px-6 py-14">

            <div className="mx-auto max-w-5xl">

                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 text-sm font-medium text-stone-500 hover:text-[#171717]"
                >
                    ← Back
                </button>

                <div className="grid gap-10 md:grid-cols-2">

                    {/* Image */}

                    <div className="overflow-hidden border border-stone-200 bg-white">

                        <div className="flex min-h-[420px] items-center justify-center bg-stone-100">

                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="h-full max-h-[600px] w-full object-cover"
                                />
                            ) : (
                                <span className="text-sm text-stone-400">
                                    No image available
                                </span>
                            )}

                        </div>

                    </div>

                    {/* Details */}

                    <div>

                        <div className="flex items-start justify-between gap-5">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                                    {item.category}
                                </p>

                                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#171717]">
                                    {item.name}
                                </h1>

                            </div>

                            <span
                                className={`mt-1 text-xs font-semibold uppercase tracking-wide ${isFound
                                        ? "text-emerald-600"
                                        : "text-red-600"
                                    }`}
                            >
                                {item.type}
                            </span>

                        </div>

                        <div className="mt-8 space-y-5">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                    Description
                                </p>

                                <p className="mt-2 text-sm leading-6 text-stone-600">
                                    {item.description}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                    Location
                                </p>

                                <p className="mt-2 text-sm text-stone-600">
                                    📍 {item.location}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                    Date
                                </p>

                                <p className="mt-2 text-sm text-stone-600">
                                    {formattedDate}
                                </p>
                            </div>

                        </div>

                        {/* Contact action */}

                        <div className="mt-10 border-t border-stone-200 pt-6">

                            <button
                                type="button"
                                onClick={() => setShowContact(true)}
                                className="w-full bg-[#171717] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700"
                            >
                                {isFound
                                    ? "I think this is my item"
                                    : "I found this item"}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* Contact Modal */}

            {showContact && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
                    onClick={() => setShowContact(false)}
                >

                    <div
                        className="w-full max-w-md bg-white p-7 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Header */}

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                                    {isFound
                                        ? "Claim this item"
                                        : "Contact reporter"}
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold text-[#171717]">
                                    {isFound
                                        ? "I think this is my item"
                                        : "I found this item"}
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() => setShowContact(false)}
                                className="text-2xl leading-none text-stone-400 hover:text-stone-700"
                            >
                                ×
                            </button>

                        </div>

                        {/* Explanation */}

                        <p className="mt-5 text-sm leading-6 text-stone-500">
                            {isFound
                                ? "Describe identifying details that can help the reporter verify that this item belongs to you."
                                : "Tell the owner where or how you found this item and provide any useful details."}
                        </p>

                        {/* Message */}

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="5"
                            placeholder={
                                isFound
                                    ? "e.g. This is my wallet. It contains my college ID and a small photo inside."
                                    : "e.g. I found this near the library entrance around 3 PM."
                            }
                            className="mt-5 w-full resize-none border border-stone-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />

                        {/* Buttons */}

                        <div className="mt-5 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => {
                                    setShowContact(false)
                                    setMessage("")
                                }}
                                className="border border-stone-300 px-5 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={!message.trim()}
                                className="bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isFound
                                    ? "Send claim"
                                    : "Send message"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </main>
    )
}

export default ItemDetails