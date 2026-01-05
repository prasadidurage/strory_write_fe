import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { RootState, AppDispatch } from "../../../store/store.ts";
import { fetchStoriesByCategory } from "../../../slices/storySlice.ts";

export function CategorizeStories() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { categoryName } = useParams<{ categoryName: string }>();

    const { stories, loading, error } = useSelector((state: RootState) => state.story);

    useEffect(() => {
        if (categoryName) {
            dispatch(fetchStoriesByCategory(categoryName));
        }
    }, [dispatch, categoryName]);

    const handleReadStory = (storyId: string) => {
        navigate(`/story/${storyId}`);
    };

    return (
        <div className="min-h-screen bg-[#08080a] text-slate-200 selection:bg-purple-500/30">
            {/* Header Section with Dynamic Glow */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-purple-600/20 to-transparent blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto relative text-center space-y-8">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                        Exploring Genre
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">
                            Category: <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent italic">{categoryName}</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                            Immerse yourself in a curated collection of narratives. Each piece represents a unique voice in the world of {categoryName?.toLowerCase()}.
                        </p>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 pb-24">
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Retrieving Manuscripts...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-md mx-auto text-center p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem]">
                        <div className="text-3xl mb-4">🏮</div>
                        <h3 className="text-white font-bold mb-2">Transmission Interrupted</h3>
                        <p className="text-red-400/80 text-sm mb-6">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Retry Sync</button>
                    </div>
                )}

                {/* Stories Grid */}
                {!loading && !error && stories.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stories.map((story) => (
                            <div
                                key={story.id}
                                onClick={() => handleReadStory(story.id)}
                                className="group relative bg-[#121214] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-purple-500/30 transition-all duration-500 cursor-pointer flex flex-col h-full shadow-2xl"
                            >
                                {/* Visual Container */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    {story.imageUrl ? (
                                        <img
                                            src={story.imageUrl}
                                            alt={story.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-4xl">📖</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-60"></div>
                                    
                                    {/* Small Floating Category */}
                                    <div className="absolute top-5 left-5">
                                        <span className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                                            {story.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-purple-400 transition-colors tracking-tight leading-tight">
                                        {story.name}
                                    </h3>

                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                            {story.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-500 uppercase font-bold tracking-tighter leading-none">Author</p>
                                            <p className="text-xs text-slate-200 font-medium">{story.author}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="text-[10px] font-mono tracking-tighter">
                                                {new Date(story.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-purple-400 group-hover:gap-2 transition-all">
                                            Read <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && stories.length === 0 && (
                    <div className="text-center py-32 space-y-10">
                        <div className="relative inline-block">
                            <div className="text-8xl animate-bounce">🕳️</div>
                            <div className="absolute inset-0 bg-purple-500/20 blur-[50px] -z-10"></div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-white tracking-tighter">The Vault is Empty</h3>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium">No chronicles have been recorded in this category yet. Will you be the first to break the silence?</p>
                        </div>
                        <button 
                            onClick={() => navigate('/write')} 
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all transform hover:-translate-y-1"
                        >
                            ✍️ Begin Writing
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}