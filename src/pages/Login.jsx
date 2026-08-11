import { useState } from "react"
import {
    Link,
    useNavigate,
    useLocation,
} from "react-router-dom"

function Login() {
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

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

            navigate("/", {
                replace: true,
                state: null,
            })

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
                    location.state?.backgroundLocation || location,
            },
        })
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-6 backdrop-blur-[2px]"
            onClick={closeLogin}
        >

            {/* Login box */}

            <div
                className="relative w-full max-w-sm border border-stone-200 bg-white p-7 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Close button */}

                <button
                    type="button"
                    onClick={closeLogin}
                    className="absolute right-4 top-4 text-xl leading-none text-stone-400 transition hover:text-stone-700"
                >
                    ×
                </button>

                {/* Header */}

                <div className="text-center">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        Welcome back
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">
                        Login
                    </h1>

                    <p className="mt-3 text-sm text-stone-500">
                        Login to manage your reports.
                    </p>

                </div>

                {/* Form */}

                <form
                    onSubmit={handleLogin}
                    className="mt-7"
                >

                    {/* Email */}

                    <div>

                        <label className="text-sm font-medium text-stone-700">
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
                            className="mt-2 w-full border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />

                    </div>

                    {/* Password */}

                    <div className="mt-4">

                        <label className="text-sm font-medium text-stone-700">
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
                            className="mt-2 w-full border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Login */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-5 w-full bg-[#171717] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                    {/* Register */}

                    <p className="mt-5 text-center text-sm text-stone-500">
                        Don't have an account?{" "}

                        <button
                            type="button"
                            onClick={goToRegister}
                            className="font-medium text-blue-700 hover:underline"
                        >
                            Create one
                        </button>

                    </p>

                </form>

            </div>

        </div>
    )
}

export default Login