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

    return (
        <div className="max-w-2xl mx-auto">
            <Helmet>
                <title>WhatTheGift - Hitta den perfekta presenten med AI</title>
                <meta name="description" content="AI-driven presentgenerator. Hitta personliga presenter på några sekunder." />
            </Helmet>
            {/* Progress Bar */}
            <div className="mb-12 bg-slate-100 h-1 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 md:p-16 relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-16">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                {currentStep} / {STEPS.length}
                            </span>
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                                >
                                    <ChevronLeft size={14} />
                                    Bakåt
                                </button>
                            )}
                        </div>

                        <h2 className="text-4xl font-extrabold text-slate-900 mb-12 leading-[1.1] tracking-tight">
                            {currentStepData.question}
                        </h2>

                        <div className="grid grid-cols-1 gap-3">
                            {currentStepData.options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleOptionSelect(option)}
                                    className={`
                                        w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group
                                        ${answers[currentStep] === option
                                            ? 'border-emerald-500 bg-emerald-50/20 text-emerald-900'
                                            : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50 text-slate-600'}
                                    `}
                                >
                                    <span className="font-bold text-lg tracking-tight">{option}</span>
                                    <div className={`
                                        w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                                        ${answers[currentStep] === option
                                            ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]'
                                            : 'border-slate-200 group-hover:border-slate-300'}
                                    `}>
                                        {answers[currentStep] === option && (
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </div>
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
