import React from 'react';
import { motion } from 'framer-motion';

const Processing = () => {
    const messages = [
        "AI:n tänker så det knakar...",
        "Scannar av de bästa alternativen...",
        "Hittar presenter som imponerar...",
        "Nästan klar nu..."
    ];

    const [msgIndex, setMsgIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] w-full text-center p-8">
            <div className="relative mb-12">
                <motion.div
                    animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.1, 0.3, 0.1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="w-48 h-48 bg-emerald-400 rounded-[3rem] blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />

                <div className="relative z-10">
                    <motion.div
                        className="text-7xl mb-4"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        🎁
                    </motion.div>

                    <div className="flex gap-1 justify-center">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.h2
                    key={msgIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-3xl font-extrabold text-slate-900 mb-4 h-10 tracking-tight"
                >
                    {messages[msgIndex]}
                </motion.h2>
            </AnimatePresence>
            <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                Vi matchar din profil med de mest uppskattade företagspresenterna på marknaden.
            </p>
        </div>
    );
};

export default Processing;
