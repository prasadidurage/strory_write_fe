import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { backendApi } from "../../../api.ts";

type FormData = {
    email: string;
    password: string;
};

export function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const authenticateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await backendApi.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            const responseData = response.data;
            let token = null;

            if (responseData.token) {
                token = responseData.token;
            } else if (responseData.accessToken) {
                token = responseData.accessToken;
            } else if (responseData.access_token) {
                token = responseData.access_token;
            } else if (responseData.authToken) {
                token = responseData.authToken;
            } else if (responseData.jwt) {
                token = responseData.jwt;
            } else if (responseData.jwtToken) {
                token = responseData.jwtToken;
            }

            if (token) {
                localStorage.setItem('token', token);
                const user = responseData.user || responseData.userInfo || responseData.userData;
                if (user) {
                    localStorage.setItem('userInfo', JSON.stringify(user));
                }

                const message = responseData.message || responseData.msg || "Successfully logged in!";
                // Custom success notification replace alerts for better UX
                alert(message);

                const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectTo);
            } else {
                alert("Login failed: No token received.");
            }

        } catch (error: any) {
            let errorMessage = "Login failed";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-purple-500/30">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="relative w-full max-w-[440px] z-10">
                {/* Back to Home Link */}
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-white transition-colors mb-8 group text-sm font-medium">
                    <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Showcase
                </Link>

                {/* Login Card */}
                <div className="bg-[#121214]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 border border-white/5 relative overflow-hidden">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Secure Access</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Welcome Back</h1>
                        <p className="text-slate-400 text-sm font-light">Continue your narrative journey.</p>
                    </div>

                    <form onSubmit={authenticateUser} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="name@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                                    required
                                    disabled={isLoading}
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">📧</span>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-[10px] font-bold text-purple-500 uppercase hover:text-purple-400 transition-colors">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                                    required
                                    disabled={isLoading}
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">🔒</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full group overflow-hidden mt-4"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 ${isLoading ? 'opacity-50' : 'group-hover:scale-105'}`}></div>
                            <div className="relative px-5 py-4 rounded-2xl flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="text-white font-bold uppercase tracking-[0.2em] text-xs">Authorize Access</span>
                                        <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-slate-500 text-sm">
                            New writer? {" "}
                            <Link to="/register" className="text-white font-bold hover:text-purple-400 transition-colors underline underline-offset-4 decoration-purple-500/30">
                                Create an Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Social Proof / Stats */}
                <div className="mt-8 flex justify-between px-6 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                    <div className="text-center">
                        <p className="text-xl font-black text-white">50K+</p>
                        <p className="text-[8px] uppercase font-bold tracking-[0.2em] text-slate-500">Writers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-black text-white">2M+</p>
                        <p className="text-[8px] uppercase font-bold tracking-[0.2em] text-slate-500">Stories</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-black text-white">10M+</p>
                        <p className="text-[8px] uppercase font-bold tracking-[0.2em] text-slate-500">Readers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}