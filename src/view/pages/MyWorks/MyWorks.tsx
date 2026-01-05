import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import type { RootReducerState } from "../../../slices/rootReducer.ts";
import {
    deleteStory,
    loadUserStories,
    setEditingStory,
    setSelectedStory,
    setUpdateData,
    updateStory,
    clearError
} from "../../../slices/myWorkSlice.ts";

interface Story {
    id: string;
    name: string;
    category: string;
    author: string;
    authorEmail: string;
    content: string;
    imageUrl: string;
    createdAt: Date;
}

export function MyWorks() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        stories,
        loading,
        error,
        userEmail,
        selectedStory,
        editingStory,
        updateData,
        isUpdating
    } = useSelector((state: RootReducerState) => state.myWork);

    useEffect(() => {
        dispatch(loadUserStories() as any);
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const handleDeleteStory = async (storyId: string) => {
        if (!storyId) return;
        if (!window.confirm('Are you sure you want to delete this story?')) return;
        try {
            await dispatch(deleteStory(storyId) as any).unwrap();
        } catch (error: any) {
            alert(`Error: ${error}`);
        }
    };

    const handleEditStory = (story: Story) => {
        if (!story?.id) return;
        dispatch(setEditingStory(story));
    };

    const handleUpdateStory = async () => {
        if (!editingStory?.id) return;
        try {
            await dispatch(updateStory({ storyId: editingStory.id, updateData }) as any).unwrap();
            navigate("/");
        } catch (error: any) {
            alert(`Error: ${error}`);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 pb-20 selection:bg-indigo-500/30">
            {/* Header Section */}
            <header className="bg-[#1E293B]/50 backdrop-blur-md border-b border-slate-800 pt-16 pb-12 px-6 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="text-indigo-400 font-bold tracking-widest text-[10px] uppercase bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/20">
                                Creator Studio
                            </span>
                            <h1 className="text-4xl font-black mt-3 tracking-tight text-white">
                                My <span className="text-indigo-500">Works</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-800/50 p-2 pr-5 rounded-2xl border border-slate-700 shadow-xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
                                {userEmail?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Verified Author</p>
                                <p className="text-sm font-bold text-slate-200">{userEmail}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 mt-12">
                {stories.length === 0 ? (
                    <div className="bg-[#1E293B] rounded-3xl p-20 text-center border border-slate-800 shadow-2xl">
                        <div className="text-6xl mb-6">🌑</div>
                        <h3 className="text-2xl font-bold text-white">The library is empty</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">Your dark masterpieces haven't been written yet. Start your journey today.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stories.map((story) => (
                            <article key={story.id} className="bg-[#1E293B] rounded-[2rem] overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all duration-500 group shadow-lg">
                                <div className="relative h-56 overflow-hidden">
                                    {story.imageUrl ? (
                                        <img src={story.imageUrl} alt={story.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                            <span className="text-5xl opacity-20">📖</span>
                                        </div>
                                    )}
                                    <div className="absolute top-5 left-5">
                                        <span className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-2xl">
                                            {story.category}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent"></div>
                                </div>

                                <div className="p-8 -mt-8 relative z-10">
                                    <h3 className="text-xl font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">
                                        {story.name}
                                    </h3>
                                    <p className="text-slate-400 text-sm mt-4 leading-relaxed line-clamp-2 opacity-80">
                                        {story.content}
                                    </p>
                                    
                                    <div className="mt-8 pt-5 border-t border-slate-800/50 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                                        <span className="flex items-center gap-1.5"><span className="text-indigo-500 text-base">📅</span> {formatDate(story.createdAt)}</span>
                                        <span className="bg-slate-800 px-2 py-1 rounded">#{story.id.slice(-4)}</span>
                                    </div>

                                    <div className="grid grid-cols-5 gap-2 mt-6">
                                        <button 
                                            onClick={() => dispatch(setSelectedStory(story))}
                                            className="col-span-3 bg-white text-[#0F172A] text-[11px] font-black uppercase py-4 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95"
                                        >
                                            Read Story
                                        </button>
                                        <button 
                                            onClick={() => handleEditStory(story)}
                                            className="bg-slate-800 text-slate-300 rounded-2xl hover:bg-amber-500/10 hover:text-amber-500 border border-slate-700 transition-all flex items-center justify-center"
                                        >
                                            <span className="text-lg">✏️</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteStory(story.id)}
                                            className="bg-slate-800 text-slate-300 rounded-2xl hover:bg-rose-500/10 hover:text-rose-500 border border-slate-700 transition-all flex items-center justify-center"
                                        >
                                            <span className="text-lg">🗑️</span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            {/* Read Modal */}
            {selectedStory && (
                <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-xl flex items-center justify-center p-6 z-[100]">
                    <div className="bg-[#1E293B] rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-800 animate-in fade-in zoom-in duration-300">
                        <div className="p-10 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-8">
                                <span className="bg-indigo-500/10 text-indigo-400 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-tighter border border-indigo-500/20">{selectedStory.category}</span>
                                <button onClick={() => dispatch(setSelectedStory(null))} className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-rose-500/20 hover:text-rose-500 rounded-full transition-all text-slate-400 font-bold">✕</button>
                            </div>
                            <h2 className="text-4xl font-black text-white leading-tight mb-4">{selectedStory.name}</h2>
                            <p className="text-slate-500 font-bold text-sm mb-10">By {selectedStory.author} • Author ID: {selectedStory.authorEmail}</p>
                            {selectedStory.imageUrl && (
                                <img src={selectedStory.imageUrl} className="w-full h-80 object-cover rounded-3xl mb-10 shadow-2xl opacity-90 border border-slate-700" alt="" />
                            )}
                            <div className="text-slate-300 leading-relaxed text-xl whitespace-pre-wrap font-serif">
                                {selectedStory.content}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal (Dark) */}
            {editingStory && (
                <div className="fixed inset-0 bg-[#0F172A]/95 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
                    <div className="bg-[#1E293B] rounded-[3rem] shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-800">
                        <div className="px-10 py-8 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-white">Edit Masterpiece</h2>
                            <button onClick={() => dispatch(setEditingStory(null))} className="text-slate-500 hover:text-white transition-colors">✕</button>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block px-1">Story Title</label>
                                    <input 
                                        type="text" 
                                        value={updateData.name} 
                                        onChange={(e) => dispatch(setUpdateData({ name: e.target.value }))}
                                        className="w-full bg-[#0F172A] border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white font-medium" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block px-1">Genre/Category</label>
                                    <input 
                                        type="text" 
                                        value={updateData.category} 
                                        onChange={(e) => dispatch(setUpdateData({ category: e.target.value }))}
                                        className="w-full bg-[#0F172A] border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white font-medium" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block px-1">Visual URL</label>
                                <input 
                                    type="text" 
                                    value={updateData.imageUrl} 
                                    onChange={(e) => dispatch(setUpdateData({ imageUrl: e.target.value }))}
                                    className="w-full bg-[#0F172A] border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-400 text-sm" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block px-1">Content Body</label>
                                <textarea 
                                    rows={5}
                                    value={updateData.content} 
                                    onChange={(e) => dispatch(setUpdateData({ content: e.target.value }))}
                                    className="w-full bg-[#0F172A] border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-300 leading-relaxed resize-none" 
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => dispatch(setEditingStory(null))} className="flex-1 py-5 rounded-2xl font-bold text-slate-500 hover:text-slate-200 transition-all">Discard Changes</button>
                                <button 
                                    onClick={handleUpdateStory} 
                                    disabled={isUpdating}
                                    className="flex-[2] bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-tighter shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
                                >
                                    {isUpdating ? 'Synchronizing...' : 'Update Story'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}