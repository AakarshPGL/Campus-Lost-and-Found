import Hero from "../components/Hero"
import ItemCard from "../components/ItemCard"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Home() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/items"
                )

                const data = await response.json()

                const latestThree = data.slice(0, 3)

                console.log("TOTAL ITEMS FROM API:", data.length)
                console.log("LATEST THREE:", latestThree.length)

                setItems(latestThree)

            } catch (error) {
                console.error("Error fetching items:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [])

    console.log("HOME ITEMS BEING RENDERED:", items.length)

    return (
        <>
            <Hero />

            <main className="mx-auto max-w-6xl px-6 py-16">

                <div className="mb-7 flex items-end justify-between">

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                            Latest
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
                            Recent reports
                        </h2>

                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/browse")}
                        className="text-sm font-medium text-stone-500 transition hover:text-[#171717]"
                    >
                        View all →
                    </button>

                </div>

                {loading ? (

                    <p className="text-sm text-stone-500">
                        Loading reports...
                    </p>

                ) : items.length > 0 ? (

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                        {items.slice(0, 3).map((item) => (

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
                            No reports yet
                        </p>

                        <p className="mt-2 text-sm text-stone-400">
                            Be the first to report an item.
                        </p>

                    </div>

                )}

            </main>
        </>
    )
}

export default Home