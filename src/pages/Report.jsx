import { useRef, useState } from "react"
import { Upload, MapPin, CalendarDays } from "lucide-react"

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
                "http://localhost:5000/api/items",
                {
                    method: "POST",
                    body: data,
                }
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to submit report"
                )
            }

            console.log("Server response:", result)

            // Clear form after successful submission
            setFormData({
                type: "Lost",
                name: "",
                category: "Electronics",
                description: "",
                location: "",
                date: "",
                image: null,
            })

            // Clear actual file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }

            // Show success toast
            setToast({
                type: "success",
                title: "Report submitted",
                message: "Your report was submitted successfully.",
            })

            // Automatically remove toast after 3 seconds
            setTimeout(() => {
                setToast(null)
            }, 3000)

        } catch (error) {
            console.error("Error submitting report:", error)

            // Show error toast
            setToast({
                type: "error",
                title: "Submission failed",
                message: "Something went wrong. Please try again.",
            })

            setTimeout(() => {
                setToast(null)
            }, 3000)

        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-[calc(100vh-73px)] bg-[#F7F7F5] px-6 py-12">

            {/* Toast notification */}

            {toast && (
                <div
                    className={`fixed right-6 top-6 z-50 flex w-[360px] items-start gap-3 rounded-xl border bg-white px-5 py-4 shadow-xl ${toast.type === "success"
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

                </div>
            )}

            <div className="mx-auto max-w-4xl">

                <div className="mb-10">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        Report an item
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#171717]">
                        Help reunite an item with its owner.
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-stone-500">
                        Tell us what happened and provide enough details for someone
                        to identify and recover the item.
                    </p>

                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Report type */}

                    <section className="border border-stone-200 bg-white p-7">

                        <h2 className="text-base font-semibold text-[#171717]">
                            Report type
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                            Are you looking for something or have you found something?
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        type: "Lost",
                                    }))
                                }
                                className={`border px-5 py-4 text-left transition ${formData.type === "Lost"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-stone-200 hover:border-stone-400"
                                    }`}
                            >
                                <p className="text-sm font-semibold">
                                    I lost an item
                                </p>

                                <p className="mt-1 text-xs text-stone-500">
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
                                className={`border px-5 py-4 text-left transition ${formData.type === "Found"
                                        ? "border-emerald-600 bg-emerald-50"
                                        : "border-stone-200 hover:border-stone-400"
                                    }`}
                            >
                                <p className="text-sm font-semibold">
                                    I found an item
                                </p>

                                <p className="mt-1 text-xs text-stone-500">
                                    Help someone recover their belongings.
                                </p>
                            </button>

                        </div>

                    </section>

                    {/* Item details */}

                    <section className="border border-stone-200 bg-white p-7">

                        <h2 className="text-base font-semibold text-[#171717]">
                            Item details
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                            Give the item a name and describe it clearly.
                        </p>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                            <div>

                                <label className="text-sm font-medium text-stone-700">
                                    Item name
                                </label>

                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. Black leather wallet"
                                    className="mt-2 w-full border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />

                            </div>

                            <div>

                                <label className="text-sm font-medium text-stone-700">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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

                            <label className="text-sm font-medium text-stone-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Describe the item, its color, brand, unique marks, or anything else that could help identify it."
                                className="mt-2 w-full resize-none border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />

                        </div>

                    </section>

                    {/* Location */}

                    <section className="border border-stone-200 bg-white p-7">

                        <h2 className="text-base font-semibold text-[#171717]">
                            Where and when?
                        </h2>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                            <div>

                                <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                                    <MapPin size={15} />
                                    Location
                                </label>

                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. Central Library"
                                    className="mt-2 w-full border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />

                            </div>

                            <div>

                                <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                                    <CalendarDays size={15} />
                                    Date
                                </label>

                                <input
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    type="date"
                                    className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />

                            </div>

                        </div>

                    </section>

                    {/* Image */}

                    <section className="border border-stone-200 bg-white p-7">

                        <h2 className="text-base font-semibold text-[#171717]">
                            Add a photo
                        </h2>

                        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/30">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm">
                                <Upload size={20} />
                            </div>

                            <p className="mt-4 text-sm font-medium text-stone-700">
                                {formData.image
                                    ? formData.image.name
                                    : "Click to upload a photo"}
                            </p>

                            <p className="mt-1 text-xs text-stone-400">
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

                    </section>

                    {/* Submit */}

                    <div className="flex items-center justify-between border-t border-stone-200 pt-6">

                        <p className="text-sm text-stone-500">
                            Reporting as{" "}
                            <span className="font-semibold text-[#171717]">
                                {formData.type}
                            </span>
                        </p>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#171717] px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit report"}
                        </button>

                    </div>

                </form>

            </div>
        </main>
    )
}

export default Report