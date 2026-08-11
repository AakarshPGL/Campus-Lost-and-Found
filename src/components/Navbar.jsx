import { Plus, UserRound, LogOut } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    const [user, setUser] = useState(null)

    useEffect(() => {
        const savedUser = localStorage.getItem("user")

        if (savedUser) {
            setUser(JSON.parse(savedUser))
        } else {
            setUser(null)
        }
    }, [location.pathname])

    function handleLogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        setUser(null)

        navigate("/")
    }

    return (
        <nav className="border-b border-stone-200 bg-white">

            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-8 w-8 items-center justify-center bg-[#171717] text-sm font-bold text-white">
                        L&F
                    </div>

                    <h1 className="text-[15px] font-semibold tracking-tight text-[#171717]">
                        Lost & Found
                    </h1>
                </Link>

                {/* Navigation */}

                <div className="flex items-center gap-7 text-sm">

                    <Link
                        to="/"
                        className="font-medium text-[#171717]"
                    >
                        Home
                    </Link>

                    <Link
                        to="/browse"
                        className="text-stone-500 transition hover:text-[#171717]"
                    >
                        Browse
                    </Link>

                    <Link
                        to="/report"
                        className="flex items-center gap-1.5 text-stone-500 transition hover:text-[#171717]"
                    >
                        <Plus size={15} />
                        Report Item
                    </Link>

                    {!user ? (

                        <Link
                            to="/login"
                            state={{
                                backgroundLocation: location,
                            }}
                            className="flex items-center gap-2 border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-[#171717] transition hover:bg-stone-50"
                        >
                            <UserRound size={15} />
                            Log in
                        </Link>

                    ) : (

                        <div className="flex items-center gap-3">

                            <span className="text-sm font-medium text-[#171717]">
                                Hi, {user.name}
                            </span>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-2 border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-[#171717] transition hover:bg-stone-50"
                            >
                                <LogOut size={15} />
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </nav>
    )
}

export default Navbar