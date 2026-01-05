import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store.ts';
import {
    getAllCategories,
    toggleDropdown,
    selectCategory, closeDropdown
} from '../../../slices/homeSlice.ts';

// Icons using Lucide-style simple descriptions (You can also use React Icons here)
export function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const {
        categories,
        loading,
        isDropdownOpen,
    } = useSelector((state: RootState) => state.home);

    const handleToggleDropdown = () => {
        dispatch(toggleDropdown());
        if (!isDropdownOpen && categories.length === 0) {
            dispatch(getAllCategories());
        }
    };

    const handleSelectCategory = (category: any) => {
        dispatch(selectCategory(category));
        dispatch(closeDropdown());
        navigate(`/category/${category.name}`);
    };

    const features = [
        { icon: "🪄", title: "Intuitive Writing Tools", description: "Advanced editor with auto-save and distraction-free mode to unlock your true potential.", color: "from-purple-500/20 to-purple-900/20" },
        { icon: "💎", title: "Vibrant Community", description: "Engage with elite storytellers, receive constructive critiques, and elevate your craft.", color: "from-blue-500/20 to-blue-900/20" },
        { icon: "✨", title: "Recognition & Rewards", description: "Exclusive contests and reputation building tools for the modern digital author.", color: "from-amber-500/20 to-amber-900/20" },
        { icon: "🌐", title: "Global Reach", description: "Break language barriers and reach millions of readers across every continent.", color: "from-emerald-500/20 to-emerald-900/20" },
        { icon: "🤖", title: "AI Writing Assistant", description: "Next-gen AI to refine your grammar, style, and narrative flow in real-time.", color: "from-pink-500/20 to-pink-900/20" },
        { icon: "🔒", title: "IP Protection", description: "Blockchain-ready timestamping and robust copyright management for your safety.", color: "from-cyan-500/20 to-cyan-900/20" }
    ];

    const benefits = [
        { title: "Build Your Author Brand", description: "A high-end writer profile designed to showcase your portfolio and attract a loyal fan base.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop" },
        { title: "Monetize Your Stories", description: "Sophisticated revenue models including subscriptions and direct story support.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" },
        { title: "Learn & Improve", description: "Curated workshops led by industry leaders to polish your storytelling skills.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop" }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-slate-100 selection:bg-purple-500/30">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                <span className="flex h-2 w-2 rounded-full bg-purple-400"></span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">The Future of Writing</span>
                            </div>
                            
                            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                                Your Stories <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
                                    Matter.
                                </span>
                            </h1>

                            <p className="text-lg text-slate-400 leading-relaxed max-w-lg font-light">
                                Welcome to the premier dark-space for creators. Share your narrative with a global audience on a platform built for the elite storyteller.
                            </p>

                            <div className="flex flex-wrap gap-5">
                                <Link to="/startWriting" className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95 flex items-center">
                                    Start Writing
                                </Link>

                                <div className="relative">
                                    <button onClick={handleToggleDropdown} className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center backdrop-blur-sm">
                                        Success Stories
                                        <svg className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-4 w-64 bg-[#16161a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                                            {loading && <div className="p-4 text-xs text-slate-500 uppercase tracking-widest animate-pulse">Loading Categories...</div>}
                                            <div className="max-h-60 overflow-y-auto p-2">
                                                {categories.map((cat, i) => (
                                                    <button key={cat.id || i} onClick={() => handleSelectCategory(cat)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium border-b border-white/5 last:border-0">
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-12 pt-8">
                                <div><p className="text-3xl font-black text-white">50K+</p><p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Authors</p></div>
                                <div><p className="text-3xl font-black text-white">2M+</p><p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Stories</p></div>
                                <div><p className="text-3xl font-black text-white">10M+</p><p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Monthly</p></div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] opacity-20 blur-xl group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#16161a]">
                                <img src="/assets/imge/evgeny-starostin-magicbook2.gif" alt="Workspace" className="w-full h-[550px] object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            {/* Floating Stats */}
                            <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl px-8 py-5 rounded-3xl border border-white/20 shadow-2xl">
                                <p className="text-2xl font-black text-white">98% 🎯</p>
                                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Growth Rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-[#0a0a0c] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl lg:text-5xl font-black mb-6">Designed for <span className="text-purple-500">Excellence</span></h2>
                        <div className="h-1 w-20 bg-purple-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className={`p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br ${f.color} hover:border-white/20 transition-all duration-300 group`}>
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-purple-600 transition-all">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">{f.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm font-light">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-[#0f0f12]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-4xl font-black">Monetize Your <span className="text-blue-500 italic font-light tracking-tighter">Art</span></h2>
                        <p className="text-slate-500 mt-2">Professional pathways to creative independence.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {benefits.map((b, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative h-64 rounded-[2rem] overflow-hidden mb-6 border border-white/5 shadow-2xl">
                                    <img src={b.image} alt={b.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-transparent to-transparent opacity-80"></div>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{b.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed font-light">{b.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}