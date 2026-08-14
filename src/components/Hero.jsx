import SearchBar from "./SearchBar"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

function Hero() {
    const navigate = useNavigate()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.65,
                ease: "easeOut",
            },
        },
    }

    return (
        <section className="bg-[#F5F1E8]">

            <div className="mx-auto max-w-[1400px] px-8 py-24 lg:px-12 lg:py-28">

                <motion.div
                    className="max-w-3xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >

                    {/* Eyebrow */}

                    <motion.p
                        variants={itemVariants}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"
                    >
                        Campus Lost & Found
                    </motion.p>


                    {/* Heading */}

                    <motion.h1
                        variants={itemVariants}
                        className="mt-5 text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#171717] md:text-6xl lg:text-7xl"
                    >
                        Lost something?

                        <br />

                        <span className="text-stone-400">
                            Find it here.
                        </span>
                    </motion.h1>


                    {/* Description */}

                    <motion.p
                        variants={itemVariants}
                        className="mt-7 max-w-xl text-base leading-7 text-stone-600 md:text-[17px]"
                    >
                        Search items reported across campus or report something
                        you've found. A simple way to get belongings back where
                        they belong.
                    </motion.p>


                    {/* Search */}

                    <motion.div
                        variants={itemVariants}
                        className="mt-8"
                    >
                        <SearchBar />
                    </motion.div>


                    {/* Buttons */}

                    <motion.div
                        variants={itemVariants}
                        className="mt-5 flex flex-wrap gap-3"
                    >

                        <motion.button
                            type="button"
                            onClick={() => navigate("/report")}
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-lg bg-[#171717] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-700 hover:shadow-md"
                        >
                            Report lost item
                        </motion.button>


                        <motion.button
                            type="button"
                            onClick={() => navigate("/report")}
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-[#171717] shadow-sm transition hover:bg-stone-50 hover:shadow-md"
                        >
                            Report found item
                        </motion.button>

                    </motion.div>

                </motion.div>

            </div>

        </section>
    )
}

export default Hero