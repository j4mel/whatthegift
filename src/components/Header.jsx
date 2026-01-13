import React from 'react';
import { Gift } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
            <div className="container mx-auto px-4 py-4 flex items-center justify-center">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="bg-gradient-to-tr from-purple-600 to-pink-500 p-2 rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Gift size={24} />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                        WhatTheGift
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
