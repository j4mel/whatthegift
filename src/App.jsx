import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Wizard from './components/Wizard';

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Wizard />
        </main>

        <footer className="bg-white border-t border-gray-100 py-6 mt-8">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            <p className="mb-2">
              Som Amazon-associates tjänar jag pengar på kvalificerade köp.
            </p>
            <p>
              &copy; {new Date().getFullYear()} WhatTheGift. Alla rättigheter förbehållna.
            </p>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
}

export default App;
