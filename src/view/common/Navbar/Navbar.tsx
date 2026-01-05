import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function Navbar() {
    const [userrole, setUserRole] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // User role ලබා ගැනීම
        const userInfoString = localStorage.getItem("userInfo");
        if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            setUserRole(userInfo.role);
        }

        // Scroll කිරීමේදී Navbar එකේ ස්වභාවය වෙනස් කිරීමට
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Start Writing", path: "/startWriting" },
        { name: "My Stories", path: "/myStories" },
        { name: "Rules", path: "/rules" },
    ];

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
            scrolled 
            ? "bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800 py-3" 
            : "bg-transparent py-5"
        }`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center group">
                        <div className="relative">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
                                📚
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0F172A] animate-pulse"></div>
                        </div>
                        <span className="ml-3 text-2xl font-black tracking-tighter text-white">
                            Story<span className="text-indigo-500">Verse</span>
                        </span>
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-1 bg-slate-800/40 p-1 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                        isActive 
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        
                        {userrole === "ADMIN" && (
                            <Link
                                to="/admin"
                                className="px-5 py-2 rounded-xl text-sm font-bold text-amber-400 hover:bg-amber-400/10 transition-all"
                            >
                                Dashboard ⚡
                            </Link>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <button className="relative inline-flex items-center justify-center px-7 py-2.5 overflow-hidden font-bold text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-500 group shadow-lg shadow-indigo-500/25 active:scale-95">
                                <span className="relative">Sign In</span>
                            </button>
                        </Link>
                        
                        {/* Mobile Menu Toggle (Optional visual) */}
                        <button className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg text-white">
                            <span className="text-xl">☰</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}