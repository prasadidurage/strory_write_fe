

export const Dashboard = () => {
    return (


        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
            <div className="space-y-8">
                <header className="relative">
                    <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <span className="mr-2">📊</span>
                        Analytics Overview
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        Admin
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Dashboard</span>
                    </h1>
                    <p className="text-xl text-gray-600 mt-3">Welcome back! Here's what's happening with your platform.</p>
                </header>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="group">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900">3</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-2xl group-hover:scale-110 transition duration-300">
                                    <span className="text-2xl">👥</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="group">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Total Stories</p>
                                    <p className="text-3xl font-bold text-gray-900">8</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-2xl group-hover:scale-110 transition duration-300">
                                    <span className="text-2xl">📖</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="group">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Total Categories</p>
                                    <p className="text-3xl font-bold text-gray-900">4</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-2xl group-hover:scale-110 transition duration-300">
                                    <span className="text-2xl">⚡</span>
                                </div>
                            </div>

                        </div>
                    </div>


                </div>


                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-2xl mr-4">
                            <span className="text-2xl">🔥</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
                            <p className="text-gray-600">Latest platform updates and user actions</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                            <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-3 rounded-xl">
                                <span className="text-xl">👤</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">New user registered</p>
                                <p className="text-sm text-gray-600">Sarah Johnson joined the platform</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">2 minutes ago</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                            <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-3 rounded-xl">
                                <span className="text-xl">📖</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">New story published</p>
                                <p className="text-sm text-gray-600">"The Mystery of the Lost Kingdom" by Alex Chen</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">15 minutes ago</p>
                            </div>
                        </div>



                    </div>
                </div>


            </div>
        </div>
    );
};