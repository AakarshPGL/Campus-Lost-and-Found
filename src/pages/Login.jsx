import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const googleButtonRef = useRef(null)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    function redirectAfterLogin() {
        const backgroundLocation = location.state?.backgroundLocation

        if (backgroundLocation) {
            navigate(
                backgroundLocation.pathname +
                backgroundLocation.search +
                backgroundLocation.hash,
                { replace: true }
            )
        } else {
            navigate("/", { replace: true })
        }
    }

    useEffect(() => {
        function initializeGoogle() {
            if (!window.google || !googleButtonRef.current) return

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleLogin,
            })

            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                {
                    theme: "outline",
                    size: "large",
                    width: 300,
                    text: "continue_with",
                    shape: "rectangular",
                }
            )
        }

        if (window.google) {
            initializeGoogle()
        } else {
            const timer = setInterval(() => {
                if (window.google) {
                    clearInterval(timer)
                    initializeGoogle()
                }
            }, 100)

            return () => clearInterval(timer)
        }
    }, [])

    async function handleGoogleLogin(response) {
        setError("")
        setGoogleLoading(true)

        try {
            const result = await fetch(
                "http://localhost:5000/api/auth/google",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        credential: response.credential,
                    }),
                }
            )

            const data = await result.json()

            if (!result.ok) {
                throw new Error(
                    data.message || "Google login failed"
                )
            }

            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            redirectAfterLogin()
        } catch (error) {
            console.error("Google login error:", error)
            setError(error.message || "Google login failed")
        } finally {
            setGoogleLoading(false)
        }
    }

    function closeLogin() {
        navigate(-1)
    }

    async function handleLogin(e) {
        e.preventDefault()

        setError("")
        setLoading(true)

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                )
            }

            localStorage.setItem("token", data.token)
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            )

            redirectAfterLogin()
        } catch (error) {
            console.error("Login error:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    function goToRegister() {
        navigate("/register", {
            state: {
                backgroundLocation:
                    location.state?.backgroundLocation ||
                    location,
            },
        })
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 backdrop-blur-sm"
            onClick={closeLogin}
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
                    onClick={closeLogin}
                    className="absolute right-5 top-5 text-xl leading-none text-stone-400 transition hover:text-stone-700"
                >
                    ×
                </button>


                {/* Header */}

                <div className="text-center">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                        Welcome back
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">
                        Login
                    </h1>

                    <p className="mt-3 text-[15px] text-stone-500">
                        Login to manage your reports.
                    </p>

                </div>


                {/* Google */}

                <div className="mt-7 flex justify-center">
                    <div ref={googleButtonRef} />
                </div>

                {googleLoading && (
                    <p className="mt-2 text-center text-xs text-stone-400">
                        Signing in with Google...
                    </p>
                )}


                {/* Divider */}

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-stone-200" />

                    <span className="text-xs text-stone-400">
                        OR
                    </span>

                    <div className="h-px flex-1 bg-stone-200" />
                </div>


                {/* Form */}

                <form onSubmit={handleLogin}>

                    <div>
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
                            placeholder="Enter your password"
                            required
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>


                    {/* Error */}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 overflow-hidden rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>


                    {/* Login */}

                    <motion.button
                        type="submit"
                        disabled={loading || googleLoading}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-5 w-full rounded-xl bg-[#171717] px-6 py-3.5 text-[15px] font-semibold text-white shadow-md transition hover:bg-stone-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </motion.button>


                    {/* Register */}

                    <p className="mt-6 text-center text-[15px] text-stone-500">
                        Don't have an account?{" "}

                        <button
                            type="button"
                            onClick={goToRegister}
                            className="font-semibold text-blue-700 hover:underline"
                        >
                            Create one
                        </button>
                    </p>

                </form>

            </motion.div>
        </div>
    )
}

export default Login