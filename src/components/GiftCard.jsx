import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { generateAmazonLink } from '../utils/affiliate';
import { motion } from 'framer-motion';

const GiftCard = ({ product, index }) => {
    const displayName = product.title || product.name;
    // SVG Content from Gemini
    const svgContent = product.image_svg;
    const backupImageUrl = `https://images.unsplash.com/photo-1549463591-147604343a30?q=80&w=800&h=800&fit=crop`;

    const link = generateAmazonLink(displayName);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col h-full bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-1"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                {svgContent ? (
                    <div
                        className="h-full w-full flex items-center justify-center p-8 transition-transform duration-700 group-hover:scale-105"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                ) : (
                    <img
                        src={backupImageUrl}
                        alt={displayName}
                        className="h-full w-full object-cover transition-opacity duration-700 group-hover:scale-110"
                    />
                )}

                <div className="absolute top-4 right-4 glass px-4 py-2 rounded-2xl text-xs font-bold text-slate-900 border border-white/40 shadow-sm z-10">
                    {product.price}
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors tracking-tight leading-tight">
                    {displayName}
                </h3>
                <p className="text-slate-500 text-sm mb-8 flex-grow leading-relaxed line-clamp-3">
                    {product.description}
                </p>

                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full overflow-hidden group/btn"
                >
                    <div className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 group-hover/btn:bg-emerald-600 group-hover/btn:scale-[1.02] active:scale-[0.98]">
                        <span className="tracking-tight">Se på Amazon</span>
                        <ExternalLink size={16} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </div>
                </a>
            </div>
        </motion.div>
    );
};

export default GiftCard;
