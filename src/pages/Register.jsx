import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"

function Register() {
    const navigate = useNavigate()
    const location = useLocation()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    function getBackgroundLocation() {
        return location.state?.backgroundLocation || {
            pathname: "/",
        }
    }

    function closeRegister() {
        navigate(-1)
    }

    function goToLogin() {
        navigate("/login", {
            state: {
                backgroundLocation: getBackgroundLocation(),
            },
        })
    }

    async function handleRegister(e) {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                )
            }

            navigate("/login", {
                state: {
                    backgroundLocation:
                        getBackgroundLocation(),
                },
            })
        } catch (error) {
            console.error(
                "Registration error:",
                error
            )

            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 backdrop-blur-sm"
            onClick={closeRegister}
        >
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-[#FDFCF9] p-7 shadow-2xl sm:p-8"
            >

                {/* Close */}

                <button
                    type="button"
                    onClick={closeRegister}
                    className="absolute right-5 top-5 text-xl leading-none text-stone-400 transition hover:text-stone-700"
                >
                    ×
                </button>


                {/* Header */}

                <div className="text-center">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                        Get started
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">
                        Create account
                    </h1>

                    <p className="mt-3 text-[15px] text-stone-500">
                        Create an account to manage your reports.
                    </p>

                </div>


                {/* Form */}

                <form
                    onSubmit={handleRegister}
                    className="mt-7"
                >

                    {/* Name */}

                    <div>
                        <label className="text-[15px] font-medium text-stone-700">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Your name"
                            required
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>


                    {/* Email */}

                    <div className="mt-4">
                        <label className="text-[15px] font-medium text-stone-700">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="you@example.com"
                            required
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>


                    {/* Password */}

                    <div className="mt-4">
                        <label className="text-[15px] font-medium text-stone-700">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Create a password"
                            required
                            minLength={6}
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>


                    {/* Confirm Password */}

                    <div className="mt-4">
                        <label className="text-[15px] font-medium text-stone-700">
                            Confirm password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Enter password again"
                            required
                            minLength={6}
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>


                    {/* Error */}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    height: "auto",
                                }}
                                exit={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                className="mt-4 overflow-hidden rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>


                    {/* Register */}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-5 w-full rounded-xl bg-[#171717] px-6 py-3.5 text-[15px] font-semibold text-white shadow-md transition hover:bg-stone-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </motion.button>


                    {/* Login */}

                    <p className="mt-6 text-center text-[15px] text-stone-500">
                        Already have an account?{" "}

                        <button
                            type="button"
                            onClick={goToLogin}
                            className="font-semibold text-blue-700 hover:underline"
                        >
                            Login
                        </button>
                    </p>

                </form>

            </motion.div>
        </div>
    )
}

export default Register