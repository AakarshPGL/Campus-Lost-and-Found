import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SearchBar() {
    const [search, setSearch] = useState("")
    const navigate = useNavigate()

    function handleSearch(e) {
        e.preventDefault()

        if (!search.trim()) {
            navigate("/browse")
            return
        }

        navigate(
            `/browse?search=${encodeURIComponent(search.trim())}`
        )
    }

    return (
        <motion.form
            onSubmit={handleSearch}
            whileFocus={{ scale: 1.01 }}
            className="mt-10 flex w-full max-w-2xl overflow-hidden rounded-xl border border-stone-300 bg-white shadow-sm transition-shadow focus-within:border-blue-500 focus-within:shadow-md"
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

            <motion.button
                type="submit"
                whileHover={{
                    backgroundColor: "#292929",
                }}
                whileTap={{ scale: 0.97 }}
                className="shrink-0 bg-[#171717] px-7 text-[15px] font-semibold text-white transition"
            >
                Search
            </motion.button>
        </motion.form>
    )
}

export default SearchBar