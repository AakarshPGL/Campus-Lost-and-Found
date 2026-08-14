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

                setItems(latestThree)

            } catch (error) {
                console.error(
                    "Error fetching items:",
                    error
                )

            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [])


    return (
        <>

            {/* =============================== */}
            {/* HERO */}
            {/* =============================== */}

            <Hero />


            {/* =============================== */}
            {/* RECENT REPORTS */}
            {/* =============================== */}

            <main className="bg-[#F5F1E8]">

                <div className="mx-auto max-w-[1400px] px-8 py-20 lg:px-12">

                    {/* Section Header */}

                    <div className="mb-8 flex items-end justify-between">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                                Latest
                            </p>

                            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">
                                Recent reports
                            </h2>

                            <p className="mt-2 text-sm text-stone-500">
                                Recently reported items across campus.
                            </p>

                        </div>


                        {/* View All */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/browse")
                            }
                            className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-stone-400 hover:text-[#171717] hover:shadow-md"
                        >
                            View all →
                        </button>

                    </div>


                    {/* =============================== */}
                    {/* REPORTS */}
                    {/* =============================== */}

                    {loading ? (

                        <div className="py-16 text-center">

                            <p className="text-sm text-stone-500">
                                Loading reports...
                            </p>

                        </div>

                    ) : items.length > 0 ? (

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {items.map((item) => (

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

                        <div className="border border-dashed border-stone-300 bg-white py-16 text-center">

                            <p className="font-medium text-stone-700">
                                No reports yet
                            </p>

                            <p className="mt-2 text-sm text-stone-400">
                                Be the first to report an item.
                            </p>

                        </div>

                    )}

                </div>

            </main>

        </>
    )
}

export default Home