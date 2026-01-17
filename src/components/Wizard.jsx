import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RefreshCcw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Processing from './Processing';
import GiftCard from './GiftCard';

const STEPS = [
    {
        id: 1,
        question: "Vem är mottagaren?",
        options: ["Personal", "Kund", "Event"]
    },
    {
        id: 2,
        question: "Vad är er budget per gåva?",
        options: ["Under 500 kr", "500-1000 kr", "1000 kr+"]
    },
    {
        id: 3,
        question: "Vilken profil söker ni?",
        options: ["Hållbart/Eko", "Teknik/Kontor", "Lyx/Hem"]
    }
];

const Wizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [answers, setAnswers] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const handleOptionSelect = (option) => {
        setAnswers(prev => ({ ...prev, [currentStep]: option }));

        // Auto-advance after small delay for better UX
        setTimeout(() => {
            handleNext();
        }, 250);
    };

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            startProcessing();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const startProcessing = async () => {
        setIsProcessing(true);

        try {
            const response = await fetch('/api/generate-gifts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipient: answers[1],
                    budget: answers[2],
                    profile: answers[3]
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch suggestions');
            }

            const results = await response.json();
            setSuggestions(results);
            setShowResults(true);
        } catch (error) {
            console.error("Error fetching gifts:", error);
            alert(`Något gick fel: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetWizard = () => {
        setCurrentStep(1);
        setAnswers({});
        setShowResults(false);
        setSuggestions([]);
    };

    if (isProcessing) {
        return <Processing />;
    }

    if (showResults) {
        return (
            <div className="max-w-4xl mx-auto">
                <Helmet>
                    <title>Perfekta Presenter till {answers[1]} | WhatTheGift</title>
                    <meta name="description" content={`Hittade ${suggestions.length} presentförslag till ${answers[1]} som gillar ${answers[2]}.`} />
                </Helmet>
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block p-1 px-3 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-100"
                    >
                        Rekommenderade gåvor
                    </motion.div>
                    <h2 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                        Företagsgåvor för {answers[1].toLowerCase()}
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">Baserat på profil: {answers[3].toLowerCase()}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {suggestions.map((item, index) => (
                        <GiftCard key={index} product={item} index={index} />
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <button
                        onClick={startProcessing}
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                    >
                        <RefreshCcw size={18} />
                        Hämta 3 nya förslag
                    </button>
                    <button
                        onClick={resetWizard}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors px-6 py-3 rounded-xl hover:bg-slate-50"
                    >
                        Börja om
                    </button>
                </div>
            </div>
        );
    }

    const currentStepData = STEPS[currentStep - 1];
    const progress = ((currentStep - 1) / STEPS.length) * 100;

    if (showResults) {
        return (
            <div className="max-w-6xl mx-auto px-4">
                <Helmet>
                    <title>Perfekta Presenter till {answers[1]} | WhatTheGift</title>
                    <meta name="description" content={`Hittade ${suggestions.length} presentförslag till ${answers[1]} som gillar ${answers[2]}.`} />
                </Helmet>
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-6 border border-emerald-100/50"
                    >
                        Rekommenderade gåvor
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-4">
                        Företagsgåvor för <span className="text-emerald-600">{answers[1].toLowerCase()}</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium">Baserat på profil: <span className="text-slate-900 uppercase tracking-wide text-sm">{answers[3]}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {suggestions.map((item, index) => (
                        <GiftCard key={index} product={item} index={index} />
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <button
                        onClick={startProcessing}
                        className="group relative inline-flex items-center gap-3 bg-emerald-600 text-white font-bold py-4 px-10 rounded-2xl hover:bg-emerald-700 transition-all duration-300 active:scale-95 shadow-xl shadow-emerald-200/50 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <RefreshCcw size={20} className="relative z-10 transition-transform duration-500 group-hover:rotate-180" />
                        <span className="relative z-10">Hämta 3 nya förslag</span>
                    </button>
                    <button
                        onClick={resetWizard}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all px-8 py-4 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100"
                    >
                        Börja om
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Helmet>
                <title>WhatTheGift - Hitta den perfekta presenten med AI</title>
                <meta name="description" content="AI-driven presentgenerator. Hitta personliga presenter på några sekunder." />
            </Helmet>

            <div className="mb-12">
                <div className="flex justify-end items-center mb-4 px-2">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{Math.round(progress)}% komplett</span>
                </div>
                <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden p-[1px]">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="glass rounded-[2.5rem] p-10 md:p-16 relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-white/60"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-16">
                            <div className="flex gap-1.5">
                                {STEPS.map((step) => (
                                    <div
                                        key={step.id}
                                        className={`w-12 h-1 rounded-full transition-all duration-500 ${step.id <= currentStep ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                    />
                                ))}
                            </div>
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="text-slate-400 hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest py-2 px-4 rounded-xl hover:bg-slate-50"
                                >
                                    <ChevronLeft size={14} />
                                    Bakåt
                                </button>
                            )}
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-12 leading-[1.1] tracking-tight">
                            {currentStepData.question}
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {currentStepData.options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleOptionSelect(option)}
                                    className={`
                                        w-full text-left p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 flex items-center justify-between group relative overflow-hidden
                                        ${answers[currentStep] === option
                                            ? 'border-emerald-500 bg-emerald-50/30 text-emerald-900 shadow-[0_12px_24px_-8px_rgba(16,185,129,0.15)]'
                                            : 'border-white/40 bg-white/40 hover:border-emerald-200 hover:bg-white text-slate-600 hover:text-slate-900'}
                                    `}
                                >
                                    <span className="font-bold text-xl tracking-tight relative z-10">{option}</span>
                                    <div className={`
                                        w-8 h-8 rounded-full border-2 transition-all duration-500 flex items-center justify-center relative z-10
                                        ${answers[currentStep] === option
                                            ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]'
                                            : 'border-slate-200 group-hover:border-emerald-300'}
                                    `}>
                                        {answers[currentStep] === option && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-2.5 h-2.5 bg-white rounded-full"
                                            />
                                        )}
                                    </div>
                                    {answers[currentStep] !== option && (
                                        <div className="absolute inset-0 bg-emerald-50 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out opacity-20" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Wizard;
