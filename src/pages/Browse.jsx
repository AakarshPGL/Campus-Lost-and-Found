import { Search, SlidersHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import ItemCard from "../components/ItemCard"

function Browse() {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("All")
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/items"
                )

                const data = await response.json()

                setItems(data)
            } catch (error) {
                console.error("Error fetching items:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [])

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.location.toLowerCase().includes(search.toLowerCase())

        const matchesFilter =
            filter === "All" || item.type === filter

        return matchesSearch && matchesFilter
    })

    return (
        <main className="min-h-[calc(100vh-73px)] bg-[#F7F7F5] px-6 py-14">

            <div className="mx-auto max-w-6xl">

                {/* Header */}

                <div className="max-w-2xl">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        Browse
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#171717]">
                        Find what you're looking for.
                    </h1>

                    <p className="mt-4 text-stone-500">
                        Search through items reported by students across campus.
                    </p>

                </div>

                {/* Search */}

                <div className="mt-10 flex max-w-3xl border border-stone-300 bg-white">

                    <div className="flex flex-1 items-center gap-3 px-4">

                        <Search
                            size={18}
                            className="text-stone-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by item or location..."
                            className="w-full bg-transparent py-3.5 text-sm outline-none"
                        />

                    </div>

                    <button
                        type="button"
                        className="border-l border-stone-300 px-5 text-stone-500"
                    >
                        <SlidersHorizontal size={18} />
                    </button>

                </div>

                {/* Filters */}

                <div className="mt-8 flex gap-2">

                    {["All", "Lost", "Found"].map((option) => (

                        <button
                            key={option}
                            type="button"
                            onClick={() => setFilter(option)}
                            className={`px-4 py-2 text-sm font-medium transition ${filter === option
                                ? "bg-[#171717] text-white"
                                : "border border-stone-300 bg-white text-stone-600 hover:bg-stone-50"
                                }`}
                        >
                            {option}
                        </button>

                    ))}

                </div>

                {/* Reports */}

                <div className="mt-12">

                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-xl font-semibold text-[#171717]">
                            {filteredItems.length} reports
                        </h2>

                        <span className="text-sm text-stone-400">
                            Most recent
                        </span>

                    </div>

                    {/* Loading */}

                    {loading ? (

                        <div className="py-16 text-center">

                            <p className="text-sm text-stone-500">
                                Loading reports...
                            </p>

                        </div>

                    ) : filteredItems.length > 0 ? (

                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                            {filteredItems.map((item) => (

                                <ItemCard
                                    key={item._id}
                                    id={item._id}
                                    name={item.name}
                                    status={item.type}
                                    location={item.location}
                                    time={item.createdAt}
                                    imageUrl={item.imageUrl}
                                />

                            ))}

                        </div>

                    ) : (

                        <div className="border border-dashed border-stone-300 py-16 text-center">

                            <p className="font-medium text-stone-700">
                                No items found
                            </p>

                            <p className="mt-2 text-sm text-stone-400">
                                Try a different search term.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </main>
    )
}

export default Browse