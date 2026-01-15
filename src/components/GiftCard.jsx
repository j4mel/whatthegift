import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { generateAmazonLink } from '../utils/affiliate';
import { motion } from 'framer-motion';

const GiftCard = ({ product, index }) => {
    const displayName = product.title || product.name;
    const searchTerm = encodeURIComponent(`professional corporate gift ${displayName}`);
    const link = generateAmazonLink(displayName);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-500 overflow-hidden flex flex-col h-full group"
        >
            <div className="relative w-full h-56 bg-slate-50 overflow-hidden">
                <img
                    src={`https://loremflickr.com/400/400/corporate,gift,${encodeURIComponent(displayName)}/all`}
                    alt={displayName}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1549463591-147604343a30?q=80&w=400&h=400&fit=crop";
                    }}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                    {product.price}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                    {displayName}
                </h3>
                <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed font-medium">
                    {product.description}
                </p>

                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                    <span>Se på Amazon</span>
                    <ExternalLink size={16} />
                </a>
            </div>
        </motion.div>
    );
};

export default GiftCard;
