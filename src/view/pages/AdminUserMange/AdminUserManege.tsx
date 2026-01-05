import React, {type JSX, useEffect, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Trash2, Search, X, User, Mail, Key, Shield, UserCheck } from 'lucide-react';

import {
    fetchUsers,
    deleteUser,
    setSearchTerm,
    openViewModal,
    closeViewModal,
    clearError,
    type UserDto
} from '../../../slices/adminUserSlice.ts';
import type {RootReducerState} from "../../../slices/rootReducer.ts";

export function AdminUserManege() {
    const dispatch = useDispatch();


    const {
        users,
        loading,
        error,
        searchTerm,
        showViewModal,
        selectedUser
    } = useSelector((state: RootReducerState) => state.adminUser);


    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);


    const roleStats = useMemo(() => {
        const stats = users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return stats;
    }, [users]);


    useEffect(() => {
        dispatch(fetchUsers() as any);
    }, [dispatch]);


    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);


    const handleViewUser = (user: UserDto): void => {
        dispatch(openViewModal(user));
    };


    const handleCloseModal = (): void => {
        dispatch(closeViewModal());
    };


    const handleDeleteUser = async (user: UserDto): Promise<void> => {
        if (!window.confirm(`Are you sure you want to delete user "${user.name}" (${user.email})?`)) {
            return;
        }

        try {
            await dispatch(deleteUser(user.id) as any).unwrap();
            alert('User deleted successfully!');
        } catch (error) {
            console.log(error)

        }
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        dispatch(setSearchTerm(e.target.value));
    };


    const getRoleBadgeColor = (role: string): string => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'moderator':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'user':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };


    const getRoleIcon = (role: string): JSX.Element => {
        switch (role.toLowerCase()) {
            case 'admin':
                return <Shield className="w-4 h-4" />;
            case 'moderator':
                return <UserCheck className="w-4 h-4" />;
            case 'user':
                return <User className="w-4 h-4" />;
            default:
                return <User className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                <header className="relative">
                    <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <span className="mr-2">👥</span>
                        User Management
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                Manage
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Users</span>
                            </h1>
                            <p className="text-xl text-gray-600 mt-3">View and manage platform users</p>
                        </div>
                    </div>
                </header>


                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="group">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-2xl group-hover:scale-110 transition duration-300">
                                    <span className="text-2xl">👥</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Admins</p>
                                    <p className="text-3xl font-bold text-gray-900">{roleStats.admin || 0}</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-2xl group-hover:scale-110 transition duration-300">
                                    <span className="text-2xl">🛡️</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Regular Users</p>
                                    <p className="text-3xl font-bold text-gray-900">{roleStats.user || 0}</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-2xl group-hover:scale-110 transition duration-300">
                                    <span className="text-2xl">👤</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Search Results</p>
                                    <p className="text-3xl font-bold text-gray-900">{filteredUsers.length}</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-2xl group-hover:scale-110 transition duration-300">
                                    <span className="text-2xl">🔍</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-2xl mr-4">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">All Users</h3>
                                    <p className="text-gray-600">View and manage platform users</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    User ID
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className="text-gray-600">Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <span className="text-2xl">👤</span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                                {searchTerm ? 'No users found' : 'No users yet'}
                                            </h3>
                                            <p className="text-gray-500">
                                                {searchTerm
                                                    ? `No users match "${searchTerm}"`
                                                    : 'No users have been registered yet'
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-sm text-gray-600">{user.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                <span className="ml-1 capitalize">{user.role}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleViewUser(user)}
                                                    className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition duration-200"
                                                    title="View user details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition duration-200"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {showViewModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-2xl mr-4">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="space-y-6">

                                    <div className="flex items-center space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Key className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">User ID</p>
                                            <p className="font-mono text-sm text-gray-900">{selectedUser.id}</p>
                                        </div>
                                    </div>


                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Full Name</p>
                                            <p className="text-lg font-semibold text-gray-900">{selectedUser.name}</p>
                                        </div>
                                    </div>


                                    <div className="flex items-center space-x-3">
                                        <div className="bg-indigo-100 p-2 rounded-lg">
                                            <Mail className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                                            <p className="text-lg font-semibold text-gray-900">{selectedUser.email}</p>
                                        </div>
                                    </div>


                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${getRoleBadgeColor(selectedUser.role).replace('text-', 'text-').replace('bg-', 'bg-').replace('border-', '')}`}>
                                            {getRoleIcon(selectedUser.role)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Role</p>
                                            <p className="text-lg font-semibold text-gray-900 capitalize">{selectedUser.role}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};