export function Footer() {
    return (
        <footer className="bg-[#0F172A] text-slate-300 py-16 border-t border-slate-800/50 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center group cursor-default">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                📚
                            </div>
                            <span className="ml-4 text-2xl font-black tracking-tighter text-white">
                                Story<span className="text-indigo-500">Verse</span>
                            </span>
                        </div>
                        <p className="text-slate-400 leading-relaxed max-w-xs">
                            Empowering the next generation of writers to craft masterpieces and share them with the world.
                        </p>
                        <div className="flex space-x-3">
                            {['❤️', '👥', '🌍'].map((emoji, idx) => (
                                <button key={idx} className="w-10 h-10 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-center hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1">
                                    <span className="text-sm">{emoji}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {[
                        {
                            title: "Platform",
                            links: ["Writing Tools", "Publishing", "Analytics", "Monetization"]
                        },
                        {
                            title: "Community",
                            links: ["Writer Forums", "Challenges", "Success Stories", "Events"]
                        },
                        {
                            title: "Support",
                            links: ["Help Center", "Writing Guide", "Contact Us", "Privacy Policy"]
                        }
                    ].map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-7 px-1 border-l-2 border-indigo-500 ml-1">
                                &nbsp;&nbsp;{section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-300 text-sm flex items-center group">
                                            <span className="w-0 group-hover:w-2 h-px bg-indigo-500 mr-0 group-hover:mr-2 transition-all"></span>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-medium text-slate-500 tracking-wide">
                        &copy; 2026 <span className="text-slate-400">StoryVerse Inc.</span> Crafted with passion for creators.
                    </p>
                    <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <a href="#" className="hover:text-white transition-colors">Status</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}