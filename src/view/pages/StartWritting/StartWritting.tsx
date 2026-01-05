import React, { useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store.ts';
import { getAllCategories } from '../../../slices/homeSlice.ts';
import {
    createStoryRequest,
    sendStoryConfirmationEmail,
    updateFormField,
    clearForm,
    clearError,
    resetSuccess,
    setUserFromToken
} from '../../../slices/startWritingSlice.ts';

// Logic functions remain identical to preserve functionality
const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = decodeJWT(token);
        if (!decoded || !decoded.exp) return true;
        return decoded.exp <= Math.floor(Date.now() / 1000);
    } catch (error) {
        return true;
    }
};

const performAutoLogout = (navigate: any, dispatch: any, message: string = 'Your session has expired.') => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('refreshToken');
    dispatch(clearForm());
    alert(message);
    navigate('/login');
};

export function StartWritting() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const intervalRef = useRef<number | null>(null);
    const warningShownRef = useRef<boolean>(false);
    const storyDataRef = useRef<any>(null);

    const { categories, loading: categoriesLoading } = useSelector((state: RootState) => state.home);
    const {
        name, category, content, imageUrl, author, authorEmail,
        createdAt, loading, error, success, isAuthenticated, emailSending
    } = useSelector((state: RootState) => state.write);

    const checkTokenExpiry = useCallback(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            performAutoLogout(navigate, dispatch, 'Please log in to continue.');
            return;
        }
        if (isTokenExpired(token)) {
            performAutoLogout(navigate, dispatch, 'Your session has expired. Please log in again.');
            return;
        }
        const decoded = decodeJWT(token);
        if (decoded && decoded.exp) {
            const timeUntilExpiry = decoded.exp - Math.floor(Date.now() / 1000);
            if (timeUntilExpiry <= 300 && timeUntilExpiry > 0 && !warningShownRef.current) {
                warningShownRef.current = true;
                alert(`Your session will expire in ${Math.ceil(timeUntilExpiry / 60)} minute(s).`);
            }
            if (timeUntilExpiry > 300) warningShownRef.current = false;
        }
    }, [navigate, dispatch]);

    useEffect(() => {
        checkTokenExpiry();
        intervalRef.current = setInterval(checkTokenExpiry, 60000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [checkTokenExpiry]);

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
            performAutoLogout(navigate, dispatch, 'Please log in to write a story');
            return;
        }
        const decodedToken = decodeJWT(token);
        if (decodedToken) {
            const userEmail = decodedToken.email || decodedToken.sub || '';
            const username = decodedToken.username || decodedToken.name || userEmail.split('@')[0] || 'Anonymous';
            dispatch(setUserFromToken({ email: userEmail, username: username }));
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        if (categories.length === 0) dispatch(getAllCategories());
    }, [dispatch, categories.length]);

    useEffect(() => {
        if (success && !emailSending && storyDataRef.current) {
            dispatch(sendStoryConfirmationEmail({
                userEmail: storyDataRef.current.authorEmail,
                userName: storyDataRef.current.author,
                storyTitle: storyDataRef.current.name
            }));
            storyDataRef.current = null;
        }
    }, [success, emailSending, dispatch]);

    useEffect(() => {
        if (success && !emailSending && !storyDataRef.current) {
            setTimeout(() => {
                navigate('/');
                dispatch(resetSuccess());
            }, 1000);
        }
    }, [success, emailSending, navigate, dispatch]);

    useEffect(() => {
        dispatch(clearError());
        return () => { dispatch(clearForm()); };
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name: fieldName, value } = e.target;
        dispatch(updateFormField({ field: fieldName, value }));
    };

    const validateForm = (): boolean => {
        if (!name.trim()) { alert('Title is required'); return false; }
        if (!category) { alert('Category is required'); return false; }
        if (content.trim().length < 100) { alert('Content must be at least 100 characters'); return false; }
        if (!imageUrl.trim()) { alert('Cover image is required'); return false; }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        storyDataRef.current = { name, author, authorEmail };
        dispatch(createStoryRequest({ name, category, content, imageUrl, author, authorEmail, createdAt }));
    };

    const sessionInfo = (() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return null;
        const decoded = decodeJWT(token);
        if (!decoded || !decoded.exp) return null;
        const timeUntilExpiry = decoded.exp - Math.floor(Date.now() / 1000);
        if (timeUntilExpiry <= 0) return null;
        return { 
            hours: Math.floor(timeUntilExpiry / 3600), 
            minutes: Math.floor((timeUntilExpiry % 3600) / 60),
            seconds: timeUntilExpiry
        };
    })();

    if (!isAuthenticated) return (
        <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#08080a] text-slate-200 selection:bg-purple-500/30">
            {/* Top Navigation & Session Bar */}
            <div className="sticky top-0 z-50">
                {sessionInfo && (
                    <div className={`py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${sessionInfo.seconds <= 300 ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-400'}`}>
                        {sessionInfo.seconds <= 300 ? '⚠️ Warning: Session Expiring Soon - Save Your Work' : `🔐 Secure Session: ${sessionInfo.hours}h ${sessionInfo.minutes}m Remaining`}
                    </div>
                )}
                
                <nav className="bg-[#121214]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <h1 className="text-xl font-black tracking-tighter text-white">Create <span className="text-blue-500">Story</span></h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${emailSending ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                {emailSending ? 'Syncing...' : 'Autosave Active'}
                            </span>
                        </div>
                    </div>
                </nav>
            </div>

            <main className="max-w-5xl mx-auto px-6 py-10">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Editor Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#121214] border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={handleInputChange}
                                placeholder="Story Title..."
                                className="w-full bg-transparent text-4xl font-black text-white placeholder:text-slate-800 outline-none mb-8 border-b border-white/5 pb-4 focus:border-blue-500/50 transition-colors"
                            />
                            
                            <textarea
                                name="content"
                                value={content}
                                onChange={handleInputChange}
                                placeholder="Once upon a time..."
                                className="w-full bg-transparent min-h-[500px] text-lg text-slate-300 placeholder:text-slate-800 outline-none resize-none leading-relaxed"
                            />
                            
                            <div className="flex items-center justify-between pt-6 border-t border-white/5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                <span>Markdown Supported</span>
                                <span>{content.length} Characters</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar Settings */}
                    <div className="space-y-6">
                        {/* Category & Image Card */}
                        <div className="bg-[#121214] border border-white/5 rounded-[2rem] p-6 space-y-6 shadow-xl">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Publishing Category</label>
                                <select
                                    name="category"
                                    value={category}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-[#121214]">Choose Genre</option>
                                    {categories.map((cat, idx) => (
                                        <option key={idx} value={cat.name} className="bg-[#121214]">{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Cover Artwork URL</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={imageUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 transition-all"
                                />
                                {imageUrl && (
                                    <div className="relative group rounded-xl overflow-hidden aspect-video bg-white/5 border border-white/10">
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => e.currentTarget.style.display='none'} />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter">Preview Aspect</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Author Info Card */}
                        <div className="bg-[#121214] border border-white/5 rounded-[2rem] p-6 space-y-4 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 blur-[40px] rounded-full"></div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3">Metadata</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-slate-500 uppercase font-bold tracking-tighter">Author</span>
                                    <span className="text-slate-200 font-mono">{author}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-slate-500 uppercase font-bold tracking-tighter">Identity</span>
                                    <span className="text-slate-200 font-mono text-[9px]">{authorEmail}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-slate-500 uppercase font-bold tracking-tighter">Timestamp</span>
                                    <span className="text-slate-200 font-mono">{new Date(createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Publish Actions */}
                        <div className="space-y-3 pt-4">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-bold text-red-400 uppercase tracking-wider">
                                    Error: {error}
                                </div>
                            )}
                            
                            <button
                                type="submit"
                                disabled={loading || emailSending}
                                className="w-full relative group overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ${loading ? 'opacity-50' : 'group-hover:scale-105'}`}></div>
                                <div className="relative px-5 py-4 rounded-2xl flex items-center justify-center gap-3">
                                    {(loading || emailSending) ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <span className="text-white font-bold uppercase tracking-[0.2em] text-xs">Publish Story</span>
                                    )}
                                </div>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="w-full py-4 rounded-2xl border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
                            >
                                Save Draft
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}