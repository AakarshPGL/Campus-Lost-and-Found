import SearchBar from "./SearchBar"

function Hero() {
    return (
        <section className="bg-[#F7F7F5]">
            <div className="mx-auto max-w-6xl px-6 py-20">

                <div className="max-w-3xl">

                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                        Campus Lost & Found
                    </p>

                    <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#171717] md:text-6xl">
                        Lost something?
                        <br />
                        <span className="text-stone-400">
                            Find it here.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-stone-500">
                        Search items reported across campus or report something
                        you've found. A simple way to get belongings back where
                        they belong.
                    </p>

                    <SearchBar />

                    <div className="mt-5 flex gap-3">
                        <button className="bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700">
                            Report lost item
                        </button>

                        <button className="border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-stone-50">
                            Report found item
                        </button>
                    </div>

                </div>

            </div>
        </section>
    )
}

export default Hero