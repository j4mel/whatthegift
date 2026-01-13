import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, RefreshCcw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Processing from './Processing';
import GiftCard from './GiftCard';
import { getSuggestions } from '../utils/affiliate';

const STEPS = [
    {
        id: 1,
        question: "Vem är mottagaren?",
        options: ["Partner", "Vän", "Barn", "Kollega", "Förälder", "Syskon"]
    },
    {
        id: 2,
        question: "Vad är intresset?",
        options: ["Teknik", "Matlagning", "Gaming", "Trädgård", "Inredning", "Sport"]
    },
    {
        id: 3,
        question: "Vilket är tillfället?",
        options: ["Födelsedag", "Bröllop", "Bara för att", "Inflyttning", "Jul"]
    },
    {
        id: 4,
        question: "Budgetnivå?",
        options: ["Budget", "Mellan", "Premium"]
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

    const startProcessing = () => {
        setIsProcessing(true);
        // Simulate AI thinking time
        setTimeout(() => {
            const results = getSuggestions(answers[2], answers[4]);
            setSuggestions(results);
            setIsProcessing(false);
            setShowResults(true);
        }, 2500);
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block p-2 px-4 bg-green-100 text-green-700 rounded-full font-medium mb-4"
                    >
                        Hittade {suggestions.length} perfekta presenter!
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        För din {answers[1].toLowerCase()} som gillar {answers[2].toLowerCase()}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {suggestions.map((item, index) => (
                        <GiftCard key={index} product={item} index={index} />
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={resetWizard}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 font-medium transition-colors px-6 py-3 rounded-xl hover:bg-purple-50"
                    >
                        <RefreshCcw size={18} />
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
            <div className="mb-8 bg-gray-200 h-2 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden"
                >
                    {/* Decorative background circle */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-0" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-sm font-bold text-purple-500 uppercase tracking-wider">
                                Fråga {currentStep} av {STEPS.length}
                            </span>
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                            )}
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-8 leading-tight">
                            {currentStepData.question}
                        </h2>

                        <div className="grid grid-cols-1 gap-3">
                            {currentStepData.options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleOptionSelect(option)}
                                    className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                    ${answers[currentStep] === option
                                            ? 'border-purple-500 bg-purple-50 text-purple-900'
                                            : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50 text-gray-700'}
                  `}
                                >
                                    <span className="font-semibold">{option}</span>
                                    <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${answers[currentStep] === option
                                            ? 'border-purple-500 bg-purple-500'
                                            : 'border-gray-300 group-hover:border-purple-300'}
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
