import React from 'react';
import { Gift } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
            <div className="container mx-auto px-4 py-5 flex items-center justify-center">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="bg-slate-900 p-2 rounded-lg text-white shadow-md group-hover:bg-emerald-600 transition-all duration-300">
                        <Gift size={22} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                            WhatTheGift
                        </h1>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                            Corporate Edition
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
