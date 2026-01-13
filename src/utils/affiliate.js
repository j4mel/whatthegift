export const generateAmazonLink = (productName) => {
    const TAG = 'whatthegift-21';
    const encodedProduct = encodeURIComponent(productName);
    return `https://www.amazon.se/s?k=${encodedProduct}&tag=${TAG}`;
};

export const MOCK_SUGGESTIONS = {
    'Teknik': [
        { name: 'Brusreducerande Hörlurar', description: 'Stäng ute världen och njut.', image: 'https://m.media-amazon.com/images/I/51b74QYDUFL._AC_UL320_.jpg' },
        { name: 'Smart Powerbank', description: 'Aldrig slut på batteri igen.', image: 'https://m.media-amazon.com/images/I/517mji2KCYL._AC_UL320_.jpg' },
        { name: 'Bluetooth Tracker', description: 'Hitta dina saker enkelt.', image: 'https://m.media-amazon.com/images/I/61VF7oj9gIL._AC_UL320_.jpg' },
        { name: 'Smart Högtalare', description: 'Röststyrd assistent för hemmet.', image: 'https://m.media-amazon.com/images/I/51b74QYDUFL._AC_UL320_.jpg' }
    ],
    'Matlagning': [
        { name: 'Kockkniv i Damaskusstål', description: 'För den seriösa hemmakocken.', image: 'https://m.media-amazon.com/images/I/81QdMTJvTaL._AC_UL320_.jpg' },
        { name: 'Sous Vide Cirkulator', description: 'Perfekt tillagat kött varje gång.', image: 'https://m.media-amazon.com/images/I/81QdMTJvTaL._AC_UL320_.jpg' },
        { name: 'Digital Kökstermometer', description: 'Exakt temperaturkoll.', image: 'https://m.media-amazon.com/images/I/81QdMTJvTaL._AC_UL320_.jpg' },
        { name: 'Snyggt Förkläde', description: 'Stil i köket.', image: 'https://m.media-amazon.com/images/I/81QdMTJvTaL._AC_UL320_.jpg' }
    ],
    'Gaming': [
        { name: 'Mekaniskt Tangentbord', description: 'Klickande känsla och snabb respons.', image: 'https://m.media-amazon.com/images/I/61St-jAeGIL._AC_UL320_.jpg' },
        { name: 'RGB Musmatta', description: 'Lyser upp setupen.', image: 'https://m.media-amazon.com/images/I/61St-jAeGIL._AC_UL320_.jpg' },
        { name: 'Ergonomisk Gamingmus', description: 'Spela bekvämt i timmar.', image: 'https://m.media-amazon.com/images/I/61St-jAeGIL._AC_UL320_.jpg' },
        { name: 'Headset hållare', description: 'Ordning och reda på skrivbordet.', image: 'https://m.media-amazon.com/images/I/61St-jAeGIL._AC_UL320_.jpg' }
    ],
    'Trädgård': [
        { name: 'Ergonomisk Sekatör', description: 'Klipp grenar utan ansträngning.' }, // No image scraped for this one, leaving it blank or using fallback logic
        { name: 'Smarta Växtsensorer', description: 'Koll på fukt och ljus.' },
        { name: 'Hängmatta', description: 'Avkoppling i grönskan.' },
        { name: 'Fågelmatare', description: 'Liv och rörelse i trädgården.' }
    ]
};

export const getSuggestions = (interest, budget) => {
    const items = MOCK_SUGGESTIONS[interest] || MOCK_SUGGESTIONS['Teknik']; // Fallback
    // In a real app, we would filter by budget too. 
    // For now, we return a random subset or all.
    return items.slice(0, 3);
};
