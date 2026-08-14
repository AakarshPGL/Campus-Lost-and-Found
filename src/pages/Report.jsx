import { useRef, useState } from "react"
import { Upload, MapPin, CalendarDays } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function Report() {
    const [formData, setFormData] = useState({
        type: "Lost",
        name: "",
        category: "Electronics",
        description: "",
        location: "",
        date: "",
        image: null,
    })

    const [submitting, setSubmitting] = useState(false)
    const [toast, setToast] = useState(null)
    const fileInputRef = useRef(null)

    function handleChange(e) {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (submitting) return

        const token = localStorage.getItem("token")

        if (!token) {
            setToast({
                type: "error",
                title: "Login required",
                message: "Please login before submitting a report.",
            })

            setTimeout(() => setToast(null), 3000)
            return
        }

        setSubmitting(true)

        try {
            const data = new FormData()

            data.append("type", formData.type)
            data.append("name", formData.name)
            data.append("category", formData.category)
            data.append("description", formData.description)
            data.append("location", formData.location)
            data.append("date", formData.date)

            if (formData.image) {
                data.append("image", formData.image)
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/items`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                }
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to submit report"
                )
            }

            setFormData({
                type: "Lost",
                name: "",
                category: "Electronics",
                description: "",
                location: "",
                date: "",
                image: null,
            })

            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }

            setToast({
                type: "success",
                title: "Report submitted",
                message: "Your report was submitted successfully.",
            })

            setTimeout(() => setToast(null), 3000)

        } catch (error) {
            console.error("Error submitting report:", error)

            setToast({
                type: "error",
                title: "Submission failed",
                message: error.message || "Something went wrong. Please try again.",
            })

            setTimeout(() => setToast(null), 3000)

        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#F5F1E8] px-5 pb-24 pt-32 sm:px-6 lg:px-12 lg:pt-36">

            {/* Toast */}

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: -20, x: 20 }}
                        className={`fixed right-5 top-24 z-50 flex w-[calc(100%-40px)] max-w-[360px] items-start gap-3 rounded-xl border bg-white px-5 py-4 shadow-xl ${toast.type === "success"
                            ? "border-emerald-200"
                            : "border-red-200"
                            }`}
                    >
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${toast.type === "success"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-red-100 text-red-600"
                                }`}
                        >
                            {toast.type === "success" ? "✓" : "!"}
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-[#171717]">
                                {toast.title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-stone-500">
                                {toast.message}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            className="text-lg leading-none text-stone-400 hover:text-stone-700"
                        >
                            ×
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>


            <div className="mx-auto max-w-[1000px]">

                {/* Header */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                        Report an item
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#171717] md:text-5xl">
                        Help reunite an item with its owner.
                    </h1>

                    <p className="mt-5 max-w-2xl text-[16px] leading-7 text-stone-600">
                        Tell us what happened and provide enough details for someone
                        to identify and recover the item.
                    </p>
                </motion.div>


                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Report type */}

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                        <h2 className="text-xl font-semibold text-[#171717]">
                            Report type
                        </h2>

                        <p className="mt-2 text-[15px] text-stone-500">
                            Are you looking for something or have you found something?
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        type: "Lost",
                                    }))
                                }
                                className={`rounded-xl border p-5 text-left transition-all duration-200 ${formData.type === "Lost"
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                                    }`}
                            >
                                <p className="text-[16px] font-semibold text-[#171717]">
                                    I lost an item
                                </p>

                                <p className="mt-1.5 text-sm text-stone-500">
                                    Help me find something I lost.
                                </p>
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        type: "Found",
                                    }))
                                }
                                className={`rounded-xl border p-5 text-left transition-all duration-200 ${formData.type === "Found"
                                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                                    : "border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                                    }`}
                            >
                                <p className="text-[16px] font-semibold text-[#171717]">
                                    I found an item
                                </p>

                                <p className="mt-1.5 text-sm text-stone-500">
                                    Help someone recover their belongings.
                                </p>
                            </button>

                        </div>
                    </motion.section>


                    {/* Item details */}

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                        <h2 className="text-xl font-semibold text-[#171717]">
                            Item details
                        </h2>

                        <p className="mt-2 text-[15px] text-stone-500">
                            Give the item a name and describe it clearly.
                        </p>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="text-[15px] font-medium text-stone-700">
                                    Item name
                                </label>

                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. Black leather wallet"
                                    required
                                    className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />
                            </div>


                            <div>
                                <label className="text-[15px] font-medium text-stone-700">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                >
                                    <option>Electronics</option>
                                    <option>Bags</option>
                                    <option>Documents</option>
                                    <option>Accessories</option>
                                    <option>Clothing</option>
                                    <option>Others</option>
                                </select>
                            </div>

                        </div>


                        <div className="mt-5">

                            <label className="text-[15px] font-medium text-stone-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                required
                                placeholder="Describe the item, its color, brand, unique marks, or anything else that could help identify it."
                                className="mt-2 w-full resize-none rounded-xl border border-stone-300 px-4 py-3.5 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />

                        </div>
                    </motion.section>


                    {/* Location */}

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                        <h2 className="text-xl font-semibold text-[#171717]">
                            Where and when?
                        </h2>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="flex items-center gap-2 text-[15px] font-medium text-stone-700">
                                    <MapPin size={16} />
                                    Location
                                </label>

                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. Central Library"
                                    required
                                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3.5 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />
                            </div>


                            <div>
                                <label className="flex items-center gap-2 text-[15px] font-medium text-stone-700">
                                    <CalendarDays size={16} />
                                    Date
                                </label>

                                <input
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    type="date"
                                    required
                                    className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />
                            </div>

                        </div>
                    </motion.section>


                    {/* Image */}

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                        <h2 className="text-xl font-semibold text-[#171717]">
                            Add a photo
                        </h2>

                        <p className="mt-2 text-[15px] text-stone-500">
                            A clear photo makes it much easier to identify the item.
                        </p>

                        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center transition hover:border-blue-400 hover:bg-blue-50/30">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm">
                                <Upload size={21} />
                            </div>

                            <p className="mt-4 text-[15px] font-semibold text-stone-700">
                                {formData.image
                                    ? formData.image.name
                                    : "Click to upload a photo"}
                            </p>

                            <p className="mt-1.5 text-sm text-stone-400">
                                {formData.image
                                    ? "Photo selected successfully"
                                    : "PNG or JPG · Maximum 5MB"}
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        image: e.target.files[0] || null,
                                    }))
                                }
                            />

                        </label>
                    </motion.section>


                    {/* Submit */}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col gap-5 border-t border-stone-300/60 pt-7 sm:flex-row sm:items-center sm:justify-between"
                    >

                        <p className="text-[15px] text-stone-500">
                            Reporting as{" "}
                            <span className="font-semibold text-[#171717]">
                                {formData.type}
                            </span>
                        </p>

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="rounded-xl bg-[#171717] px-7 py-3.5 text-[15px] font-semibold text-white shadow-md transition hover:bg-stone-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Submitting..." : "Submit report"}
                        </motion.button>

                    </motion.div>

                </form>

            </div>
        </main>
    )
}

export default Report