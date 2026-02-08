import React, { createContext, useContext, useState, useEffect } from 'react';
import AdSenseAd from './AdSenseAd';

const AdContext = createContext();

export const AdProvider = ({ children }) => {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [headerAdClosed, setHeaderAdClosed] = useState(false);
  const [footerAdClosed, setFooterAdClosed] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedHeaderAdClosed = localStorage.getItem('headerAdClosed');
    const savedFooterAdClosed = localStorage.getItem('footerAdClosed');
    const savedAdsEnabled = localStorage.getItem('adsEnabled');

    if (savedHeaderAdClosed === 'true') setHeaderAdClosed(true);
    if (savedFooterAdClosed === 'true') setFooterAdClosed(true);
    if (savedAdsEnabled === 'false') setAdsEnabled(false);
  }, []);

  const closeHeaderAd = () => {
    setHeaderAdClosed(true);
    localStorage.setItem('headerAdClosed', 'true');
  };

  const closeFooterAd = () => {
    setFooterAdClosed(true);
    localStorage.setItem('footerAdClosed', 'true');
  };

  const toggleAds = () => {
    const newState = !adsEnabled;
    setAdsEnabled(newState);
    localStorage.setItem('adsEnabled', newState.toString());
  };

  const setQuizMode = (enabled) => {
    setIsQuizMode(enabled);
  };

  const value = {
    adsEnabled,
    headerAdClosed,
    footerAdClosed,
    isQuizMode,
    closeHeaderAd,
    closeFooterAd,
    toggleAds,
    setQuizMode,
  };

  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};

// Sticky Header Ad Component
export const StickyHeaderAd = () => {
  const { adsEnabled, headerAdClosed, closeHeaderAd, isQuizMode } = useAds();

  if (!adsEnabled || headerAdClosed || isQuizMode) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="relative">
        <button
          onClick={closeHeaderAd}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Close ad"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <AdSenseAd
          slot="1234567890" // Replace with your actual ad slot
          format="horizontal"
          height={90}
          className="w-full"
          style={{ maxHeight: '90px' }}
        />
      </div>
    </div>
  );
};

// Sticky Footer Ad Component
export const StickyFooterAd = () => {
  const { adsEnabled, footerAdClosed, closeFooterAd, isQuizMode } = useAds();

  if (!adsEnabled || footerAdClosed || isQuizMode) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="relative">
        <button
          onClick={closeFooterAd}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Close ad"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <AdSenseAd
          slot="0987654321" // Replace with your actual ad slot
          format="horizontal"
          height={90}
          className="w-full"
          style={{ maxHeight: '90px' }}
        />
      </div>
      {/* Add padding to prevent content overlap */}
      <div className="h-20"></div>
    </div>
  );
};

// In-content Ad for between sections
export const InContentAd = ({ slot = "1111111111", className = "" }) => {
  const { adsEnabled, isQuizMode } = useAds();

  if (!adsEnabled || isQuizMode) {
    return null;
  }

  return (
    <div className={`my-6 ${className}`}>
      <AdSenseAd
        slot={slot}
        format="rectangle"
        width={300}
        height={250}
        className="mx-auto"
      />
    </div>
  );
};
