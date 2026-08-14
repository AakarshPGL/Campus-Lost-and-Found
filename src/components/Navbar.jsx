import { Plus, UserRound, LogOut, ClipboardList, Menu, X } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        setUser(savedUser ? JSON.parse(savedUser) : null)
    }, [location.pathname])

    useEffect(() => {
        setMenuOpen(false)
    }, [location.pathname])

    function handleLogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        setMenuOpen(false)
        navigate("/")
    }

    const isActive = (path) => location.pathname === path

    return (
        <nav className="absolute left-0 right-0 top-0 z-50 px-4 pt-3 sm:px-5 sm:pt-4 lg:px-8">

            <div className="mx-auto w-full max-w-[1500px]">

                {/* Main Glass Navbar */}

                <div className="relative flex h-[68px] items-center justify-between overflow-hidden rounded-2xl border border-white/35 bg-white/25 px-4 shadow-xl shadow-stone-900/5 backdrop-blur-2xl backdrop-saturate-150 sm:px-6 lg:px-8">

                    {/* Glass highlight */}

                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 via-transparent to-white/5" />


                    {/* Logo */}

                    <Link
                        to="/"
                        className="relative z-10 flex shrink-0 items-center gap-3"
                    >

                        <img
                            src="/logo.jpeg"
                            alt="Lost & Found"
                            className="h-10 w-10 rounded-xl object-cover shadow-sm"
                        />

                        <div>

                            <h1 className="text-[16px] font-semibold tracking-tight text-[#171717]">
                                Lost & Found
                            </h1>

                            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-stone-500">
                                Campus
                            </p>

                        </div>

                    </Link>


                    {/* Desktop Navigation */}

                    <div className="relative z-10 hidden items-center gap-1.5 lg:flex">

                        <Link
                            to="/"
                            className={`rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition ${isActive("/")
                                    ? "bg-white/55 text-[#171717] shadow-sm"
                                    : "text-stone-600 hover:bg-white/25 hover:text-[#171717]"
                                }`}
                        >
                            Home
                        </Link>


                        <Link
                            to="/browse"
                            className={`rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition ${isActive("/browse")
                                    ? "bg-white/55 text-[#171717] shadow-sm"
                                    : "text-stone-600 hover:bg-white/25 hover:text-[#171717]"
                                }`}
                        >
                            Browse
                        </Link>


                        <Link
                            to="/report"
                            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition ${isActive("/report")
                                    ? "bg-blue-50/65 text-blue-700 shadow-sm"
                                    : "text-stone-600 hover:bg-white/25 hover:text-[#171717]"
                                }`}
                        >
                            <Plus size={16} />
                            Report Item
                        </Link>


                        {user && (

                            <Link
                                to="/my-reports"
                                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition ${isActive("/my-reports")
                                        ? "bg-blue-50/65 text-blue-700 shadow-sm"
                                        : "text-stone-600 hover:bg-white/25 hover:text-[#171717]"
                                    }`}
                            >
                                <ClipboardList size={16} />
                                My Reports
                            </Link>

                        )}


                        <div className="ml-2 flex items-center gap-3 border-l border-white/35 pl-4">

                            {!user ? (

                                <Link
                                    to="/login"
                                    state={{
                                        backgroundLocation: location,
                                    }}
                                    className="flex items-center gap-2 rounded-xl bg-[#171717]/90 px-5 py-2.5 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-stone-700"
                                >
                                    <UserRound size={16} />
                                    Log in
                                </Link>

                            ) : (

                                <>

                                    <div className="text-right">

                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-stone-500">
                                            Signed in as
                                        </p>

                                        <p className="mt-0.5 max-w-[130px] truncate text-[15px] font-semibold text-[#171717]">
                                            {user.name}
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 rounded-xl border border-white/45 bg-white/30 px-4 py-2.5 text-[15px] font-medium text-stone-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/50 hover:text-[#171717]"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>

                                </>

                            )}

                        </div>

                    </div>


                    {/* Mobile Menu Button */}

                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/45 bg-white/30 text-stone-700 shadow-sm backdrop-blur-xl transition hover:bg-white/50 lg:hidden"
                    >
                        {menuOpen ? (
                            <X size={21} />
                        ) : (
                            <Menu size={21} />
                        )}
                    </button>

                </div>


                {/* Mobile Menu */}

                {menuOpen && (

                    <div className="mt-2 overflow-hidden rounded-2xl border border-white/40 bg-white/35 p-3 shadow-xl shadow-stone-900/10 backdrop-blur-2xl backdrop-saturate-150 lg:hidden">

                        <Link
                            to="/"
                            className={`flex rounded-xl px-4 py-3 text-[16px] font-medium ${isActive("/")
                                    ? "bg-white/55 text-[#171717] shadow-sm"
                                    : "text-stone-600 hover:bg-white/35"
                                }`}
                        >
                            Home
                        </Link>


                        <Link
                            to="/browse"
                            className={`mt-1 flex rounded-xl px-4 py-3 text-[16px] font-medium ${isActive("/browse")
                                    ? "bg-white/55 text-[#171717] shadow-sm"
                                    : "text-stone-600 hover:bg-white/35"
                                }`}
                        >
                            Browse
                        </Link>


                        <Link
                            to="/report"
                            className={`mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-[16px] font-medium ${isActive("/report")
                                    ? "bg-blue-50/65 text-blue-700"
                                    : "text-stone-600 hover:bg-white/35"
                                }`}
                        >
                            <Plus size={18} />
                            Report Item
                        </Link>


                        {user && (

                            <Link
                                to="/my-reports"
                                className={`mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-[16px] font-medium ${isActive("/my-reports")
                                        ? "bg-blue-50/65 text-blue-700"
                                        : "text-stone-600 hover:bg-white/35"
                                    }`}
                            >
                                <ClipboardList size={18} />
                                My Reports
                            </Link>

                        )}


                        <div className="my-3 border-t border-white/35" />


                        {!user ? (

                            <Link
                                to="/login"
                                state={{
                                    backgroundLocation: location,
                                }}
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#171717]/90 px-4 py-3 text-[16px] font-semibold text-white"
                            >
                                <UserRound size={18} />
                                Log in
                            </Link>

                        ) : (

                            <>

                                <div className="mb-3 px-4">

                                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-stone-400">
                                        Signed in as
                                    </p>

                                    <p className="mt-1 text-[16px] font-semibold text-[#171717]">
                                        {user.name}
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/45 bg-white/30 px-4 py-3 text-[16px] font-medium text-stone-600 transition hover:bg-white/50"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>

                            </>

                        )}

                    </div>

                )}

            </div>

        </nav>
    )
}

export default Navbar