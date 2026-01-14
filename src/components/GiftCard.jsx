import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { generateAmazonLink } from '../utils/affiliate';
import { motion } from 'framer-motion';

const GiftCard = ({ product, index }) => {
    // Use AI-provided search term if available, otherwise fallback to title/name
    const searchTerm = product.amazonSearchTerm || product.title || product.name;
    const link = generateAmazonLink(searchTerm);
    const displayName = product.title || product.name;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100 h-full transform hover:-translate-y-1"
        >
            <div className="w-full h-48 mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-4">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={displayName}
                        className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center text-orange-500">
                        <Tag size={32} />
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">{displayName}</h3>
            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{product.description}</p>

            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all active:scale-95 shadow-md shadow-orange-200"
            >
                <span>Köp på Amazon</span>
                <ExternalLink size={18} />
            </a>
        </motion.div>
    );
};

export default GiftCard;
