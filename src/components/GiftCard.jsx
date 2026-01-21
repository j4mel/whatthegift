import React, { useState } from 'react';
import { ExternalLink, Tag } from 'lucide-react';

const GiftCard = ({ product, index }) => {
    const [imageStatus, setImageStatus] = useState('loading'); // loading, success, error
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const displayName = product.title || product.name;
    const keyword = encodeURIComponent(product.image_keyword || "gift");

    // Multi-layer image strategy
    const imageUrls = [
        `https://source.unsplash.com/800x800/?${keyword},product,minimal`,
        `https://loremflickr.com/800/800/${keyword},product/all?lock=${index}`,
        `https://images.unsplash.com/photo-1549463591-147604343a30?q=80&w=800&h=800&fit=crop` // Definitive fallback
    ];

    const currentUrl = imageUrls[currentImageIndex];

    const handleImageError = () => {
        if (currentImageIndex < imageUrls.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        } else {
            setImageStatus('error');
        }
    };

    const handleImageLoad = (e) => {
        // Unsplash Source sometimes returns a "blank" tracking pixel or 1x1 image if no match
        if (e.target.naturalWidth <= 1 && currentImageIndex < imageUrls.length - 1) {
            handleImageError();
        } else {
            setImageStatus('success');
        }
    };

    const link = generateAmazonLink(displayName);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col h-full bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-1"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                {/* Skeleton Loader */}
                {imageStatus === 'loading' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse" />
                )}

                <img
                    src={currentUrl}
                    alt={displayName}
                    className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${imageStatus === 'success' ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />

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
