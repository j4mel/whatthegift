import React from 'react';
import { motion } from 'framer-motion';

const Processing = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-center p-8">
            <div className="relative mb-8">
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.7, 0.3],
                        rotate: 360,
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-32 h-32 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full blur-2xl absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
                />
                <motion.div
                    className="text-6xl relative z-10"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    🎁
                </motion.div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-3">AI:n tänker så det knakar...</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">Vi scannar av miljontals (okej, några stycken) produkter för att hitta den perfekta matchningen.</p>
        </div>
    );
};

export default Processing;
