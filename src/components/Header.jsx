import React from 'react';
import { Gift } from 'lucide-react';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 glass border-b border-white/20">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-xl group-hover:bg-emerald-600 transition-all duration-500 group-hover:rotate-6">
                        <Gift size={24} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                            WhatTheGift
                        </h1>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-1.5">
                            Corporate Edition
                        </span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI-Powered Gifting</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
