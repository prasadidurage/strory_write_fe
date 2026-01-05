


import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    setSearchTerm,
    updateFormField,
    openAddModal,
    openEditModal,
    closeModal,
    clearError,
    type CategoryDto
} from '../../../slices/adminCategorySlice';
import type {RootReducerState} from "../../../slices/rootReducer.ts";

export function ManageCategories() {
    const dispatch = useDispatch();


    const {
        categories,
        loading,
        submitting,
        error,
        searchTerm,
        showModal,
        editingCategory,
        formData
    } = useSelector((state: RootReducerState) => state.adminCategory);


    const filteredCategories = useMemo(() => {
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);


    useEffect(() => {
        dispatch(fetchCategories() as any);
    }, [dispatch]);


    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);


    const handleAddCategory = (): void => {
        dispatch(openAddModal());
    };


    const handleEditCategory = (category: CategoryDto): void => {
        dispatch(openEditModal(category));
    };


    const handleCloseModal = (): void => {
        dispatch(closeModal());
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.description.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            if (editingCategory) {

                await dispatch(updateCategory({
                    id: editingCategory.id,
                    categoryData: formData
                }) as any).unwrap();
                alert('Category updated successfully!');
            } else {

                await dispatch(createCategory(formData) as any).unwrap();
                alert('Category added successfully!');
            }
        } catch (error) {
            console.log(error)

        }
    };


    const handleDeleteCategory = async (category: CategoryDto): Promise<void> => {
        if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
            return;
        }

        try {
            await dispatch(deleteCategory(category.id) as any).unwrap();
            alert('Category deleted successfully!');
        } catch (error) {
            console.log(error)

        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        dispatch(updateFormField({ name: name as keyof typeof formData, value }));
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        dispatch(setSearchTerm(e.target.value));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                <header className="relative">
                    <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <span className="mr-2">📚</span>
                        Category Management
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                Manage
                                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Categories</span>
                            </h1>
                            <p className="text-xl text-gray-600 mt-3">Organize your platform content with custom categories</p>
                        </div>
                        <button
                            onClick={handleAddCategory}
                            className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center font-semibold"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Category
                        </button>
                    </div>
                </header>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Total Categories</p>
                                    <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-2xl group-hover:scale-110 transition duration-300">
                                    <span className="text-2xl">📚</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Active Categories</p>
                                    <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-2xl group-hover:scale-110 transition duration-300">
                                    <span className="text-2xl">✅</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Search Results</p>
                                    <p className="text-3xl font-bold text-gray-900">{filteredCategories.length}</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-2xl group-hover:scale-110 transition duration-300">
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
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-2xl mr-4">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">All Categories</h3>
                                    <p className="text-gray-600">Manage your content categories</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Category Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                                            <span className="text-gray-600">Loading categories...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <span className="text-2xl">📂</span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                                {searchTerm ? 'No categories found' : 'No categories yet'}
                                            </h3>
                                            <p className="text-gray-500 mb-6">
                                                {searchTerm
                                                    ? `No categories match "${searchTerm}"`
                                                    : 'Get started by adding your first category'
                                                }
                                            </p>
                                            {!searchTerm && (
                                                <button
                                                    onClick={handleAddCategory}
                                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transform hover:scale-105 transition duration-300 flex items-center font-semibold"
                                                >
                                                    <Plus className="w-5 h-5 mr-2" />
                                                    Add First Category
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600 max-w-xs truncate">{category.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditCategory(category)}
                                                    className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition duration-200"
                                                    title="Edit category"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category)}
                                                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition duration-200"
                                                    title="Delete category"
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


                {showModal && (
                    <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center">
                                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-2xl mr-4">
                                        <span className="text-2xl">{editingCategory ? '✏️' : '➕'}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                                    </h3>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter category name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Enter category description"
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}