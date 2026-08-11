import { Search } from "lucide-react"

function SearchBar() {
    return (
        <div className="mt-10 flex max-w-2xl border border-stone-300 bg-white">

            <div className="flex flex-1 items-center gap-3 px-4">
                <Search size={18} className="text-stone-400" />

                <input
                    type="text"
                    placeholder="Search by item, location or keyword..."
                    className="w-full bg-transparent py-3.5 text-sm text-[#171717] outline-none placeholder:text-stone-400"
                />
            </div>

            <button className="border-l border-stone-300 bg-[#171717] px-6 text-sm font-medium text-white transition hover:bg-stone-700">
                Search
            </button>

        </div>
    )
}

export default SearchBar