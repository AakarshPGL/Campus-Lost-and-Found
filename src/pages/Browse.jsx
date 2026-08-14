import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import ItemCard from "../components/ItemCard"

function Browse() {
    const [searchParams] = useSearchParams()

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    )
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
        const query = search.toLowerCase()

        const matchesSearch =
            item.name.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)

        const matchesFilter =
            filter === "All" || item.type === filter

        return matchesSearch && matchesFilter
    })

    return (
        <main className="min-h-screen bg-[#F5F1E8] px-6 pb-20 pt-32 lg:px-12 lg:pt-36">

            <div className="mx-auto max-w-[1400px]">

                {/* Header */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                        Browse
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#171717] md:text-5xl">
                        Find what you're looking for.
                    </h1>

                    <p className="mt-4 text-[16px] leading-7 text-stone-600">
                        Search through items reported by students across campus.
                    </p>
                </motion.div>


                {/* Search */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-10 flex w-full max-w-3xl overflow-hidden rounded-xl border border-stone-300 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:shadow-md"
                >
                    <div className="flex min-w-0 flex-1 items-center gap-3 px-4">

                        <Search
                            size={19}
                            className="shrink-0 text-stone-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search by item, location or keyword..."
                            className="w-full bg-transparent py-4 text-[15px] text-[#171717] outline-none placeholder:text-stone-400"
                        />

                    </div>

                    <div className="hidden items-center bg-[#171717] px-7 text-[15px] font-semibold text-white sm:flex">
                        Search
                    </div>

                </motion.div>


                {/* Filters */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-7 flex flex-wrap gap-2"
                >
                    {["All", "Lost", "Found"].map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setFilter(option)}
                            className={`rounded-lg px-5 py-2.5 text-[15px] font-medium transition-all duration-200 ${filter === option
                                    ? "bg-[#171717] text-white shadow-sm"
                                    : "border border-stone-300 bg-white/70 text-stone-600 hover:bg-white hover:text-[#171717]"
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </motion.div>


                {/* Reports */}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-14"
                >

                    <div className="mb-7 flex items-end justify-between">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                                Reports
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
                                {filteredItems.length}{" "}
                                {filteredItems.length === 1
                                    ? "report"
                                    : "reports"}
                            </h2>

                        </div>

                        <span className="text-sm text-stone-500">
                            Most recent
                        </span>

                    </div>


                    {/* Loading */}

                    {loading ? (

                        <div className="py-20 text-center">

                            <p className="text-[15px] text-stone-500">
                                Loading reports...
                            </p>

                        </div>

                    ) : filteredItems.length > 0 ? (

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

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

                        <div className="rounded-xl border border-dashed border-stone-300 bg-white/50 py-20 text-center">

                            <p className="text-[16px] font-medium text-stone-700">
                                No items found
                            </p>

                            <p className="mt-2 text-[15px] text-stone-400">
                                Try a different search term or filter.
                            </p>

                        </div>

                    )}

                </motion.div>

            </div>

        </main>
    )
}

export default Browse