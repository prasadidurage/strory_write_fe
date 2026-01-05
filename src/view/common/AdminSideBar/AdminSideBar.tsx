

import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AdminSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/admin/main', label: 'Dashboard', icon: '📊' },
        { path: '/admin/category', label: 'Category', icon: '📖' },
        { path: '/admin/user', label: 'User', icon: '👥' },
        { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <nav className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-2xl border-r border-indigo-200">
            {/* Header Section */}
            <div className="mb-8">
                <div className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <span className="mr-2">⚡</span>
                    Admin Portal
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-3">
                    Control Panel
                </h2>
            </div>

            {/* Navigation Items */}
            <ul className="space-y-2 mb-8">
                {navItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={`group flex items-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                                location.pathname === item.path
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl border border-indigo-300'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 hover:border hover:border-indigo-200'
                            }`}
                        >
                            <div className={`p-3 rounded-xl mr-4 transition-all duration-300 ${
                                location.pathname === item.path
                                    ? 'bg-white/20 shadow-inner'
                                    : 'bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:scale-110 group-hover:shadow-md'
                            }`}>
                                <span className="text-xl">{item.icon}</span>
                            </div>
                            <span className="font-semibold text-base">{item.label}</span>
                        </Link>
                    </li>
                ))}

                {/* Back Button */}
                <li>
                    <button
                        onClick={handleBackClick}
                        className="group flex items-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 hover:border hover:border-red-200 w-full"
                    >
                        <div className="p-3 rounded-xl mr-4 transition-all duration-300 bg-gradient-to-br from-red-100 to-pink-100 group-hover:scale-110 group-hover:shadow-md">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-base">Back to Home</span>
                    </button>
                </li>
            </ul>

            {/* Admin Profile Card */}
            <div className="mt-auto bg-white rounded-3xl shadow-xl p-6 border border-indigo-100">
                <div className="text-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl">👑</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-1">Admin User</div>
                    <div className="text-sm text-gray-500 bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-full inline-block">
                        Super User Access
                    </div>
                </div>
            </div>
        </nav>
    );
}