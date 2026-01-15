import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { generateAmazonLink } from '../utils/affiliate';
import { motion } from 'framer-motion';

const GiftCard = ({ product, index }) => {
    const displayName = product.title || product.name;
    // Use a clean search term for high-quality professional photos
    const searchTopic = encodeURIComponent(displayName);
    const imageUrl = `https://source.unsplash.com/featured/800x800?corporate,gift,${searchTopic}`;
    // Fallback using Unsplash Source redirect pattern (often works better when concatenated)
    const backupImageUrl = `https://images.unsplash.com/photo-1549463591-147604343a30?q=80&w=400&h=400&fit=crop`;

    const link = generateAmazonLink(displayName);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, ease: "circOut" }}
            className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden flex flex-col h-full group"
        >
            <div className="relative w-full h-64 bg-slate-50 overflow-hidden">
                <img
                    src={`https://loremflickr.com/g/600/600/gift,${searchTopic}/all`}
                    alt={displayName}
                    className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-105"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = backupImageUrl;
                    }}
                />
                <div className="absolute top-4 right-4 backdrop-blur-md bg-white/70 px-4 py-1.5 rounded-full text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
                    {product.price}
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors tracking-tight leading-tight">
                    {displayName}
                </h3>
                <p className="text-slate-500 text-sm mb-8 flex-grow leading-relaxed">
                    {product.description}
                </p>

                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-100"
                >
                    <span className="tracking-tight">Se på Amazon</span>
                    <ExternalLink size={16} />
                </a>
            </div>
        </motion.div>
    );
};

export default GiftCard;
