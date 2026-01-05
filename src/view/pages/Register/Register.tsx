import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store.ts';
import {
    registerUser,
    updateFormField,
    clearForm,
    clearError,
    resetSuccess
} from '../../../slices/registerSlice.ts';

export function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {
        name,
        email,
        password,
        termsAccepted,
        loading,
        error,
        success
    } = useSelector((state: RootState) => state.register);

    useEffect(() => {
        if (success) {
            alert('🎉 Account created successfully! You can now sign in.');
            navigate('/login');
            dispatch(resetSuccess());
        }
    }, [success, navigate, dispatch]);

    useEffect(() => {
        dispatch(clearError());
        return () => {
            dispatch(clearForm());
        };
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name: fieldName, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        dispatch(updateFormField({ field: fieldName, value: fieldValue }));
    };

    const validateForm = (): boolean => {
        if (!name.trim()) { alert('Full name is required'); return false; }
        if (!email.trim()) { alert('Email is required'); return false; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { alert('Please enter a valid email address'); return false; }
        if (!password.trim()) { alert('Password is required'); return false; }
        if (password.length < 6) { alert('Password should be at least 6 characters long'); return false; }
        if (!termsAccepted) { alert('Please accept the Terms of Service and Privacy Policy'); return false; }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        dispatch(registerUser({ name, email, password, role: 'USER' }));
    };

    return (
        <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden selection:bg-purple-500/30">
            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/15 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <div className="relative w-full max-w-[480px] z-10">
                {/* Header Link */}
                <div className="flex justify-between items-center mb-8">
                    <Link to="/" className="inline-flex items-center text-slate-500 hover:text-white transition-colors group text-sm font-medium">
                        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back
                    </Link>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Step 01 — Account Creation</span>
                </div>

                {/* Main Card */}
                <div className="bg-[#121214]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 border border-white/5 relative overflow-hidden">
                    {/* Progress Bar Mockup */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-full opacity-50"></div>
                    </div>

                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-3">Begin Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Journey</span></h1>
                        <p className="text-slate-400 text-sm font-light">Join the elite circle of digital storytellers.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                value={name}
                                onChange={handleInputChange}
                                placeholder="E.g. John Doe"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                                disabled={loading}
                            />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleInputChange}
                                placeholder="name@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                                disabled={loading}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Create Password</label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={handleInputChange}
                                placeholder="Min. 6 characters"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                                disabled={loading}
                            />
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 py-2">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={termsAccepted}
                                    onChange={handleInputChange}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/10 bg-white/5 transition-all checked:bg-purple-600"
                                    disabled={loading}
                                />
                                <svg className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <label className="text-[11px] text-slate-500 leading-tight">
                                I agree to the <button type="button" className="text-slate-300 hover:text-white transition-colors font-bold">Terms of Service</button> and <button type="button" className="text-slate-300 hover:text-white transition-colors font-bold">Privacy Policy</button>.
                            </label>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                                <span className="text-lg">⚠️</span>
                                <p className="text-xs font-bold text-red-400 uppercase tracking-wider">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ${loading ? 'opacity-50' : 'group-hover:scale-105'}`}></div>
                            <div className="relative px-5 py-4 rounded-2xl flex items-center justify-center gap-3">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span className="text-white font-bold uppercase tracking-[0.2em] text-xs">Initialize Account</span>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm font-light">
                            Already a member? {" "}
                            <Link to="/login" className="text-white font-bold hover:text-blue-400 transition-colors underline underline-offset-4 decoration-white/10">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom Trust Icons */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="bg-[#121214]/50 border border-white/5 p-4 rounded-3xl text-center">
                        <span className="text-lg block mb-1">✍️</span>
                        <p className="text-[8px] uppercase font-bold tracking-widest text-slate-500">Free Tools</p>
                    </div>
                    <div className="bg-[#121214]/50 border border-white/5 p-4 rounded-3xl text-center">
                        <span className="text-lg block mb-1">🌍</span>
                        <p className="text-[8px] uppercase font-bold tracking-widest text-slate-500">Global Hub</p>
                    </div>
                    <div className="bg-[#121214]/50 border border-white/5 p-4 rounded-3xl text-center">
                        <span className="text-lg block mb-1">🛡️</span>
                        <p className="text-[8px] uppercase font-bold tracking-widest text-slate-500">Encrypted</p>
                    </div>
                </div>
            </div>
        </div>
    );
}