import React, { useEffect, useRef, useState } from 'react';

const AdSenseAd = ({ 
  slot, 
  format = 'auto', 
  width, 
  height, 
  className = '',
  style = {},
  responsive = true 
}) => {
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Only load AdSense if enabled and configured
    if (!import.meta.env.VITE_ADSENSE_ENABLED || !import.meta.env.VITE_ADSENSE_PUBLISHER_ID) {
      return;
    }

    try {
      // Load AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Initialize ad when script is ready
      const initializeAd = () => {
        if (adRef.current && window.adsbygoogle) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdLoaded(true);
            setAdError(false);
          } catch (error) {
            console.error('AdSense error:', error);
            setAdError(true);
          }
        }
      };

      // Wait a bit for script to load
      const timeout = setTimeout(initializeAd, 100);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error('AdSense initialization error:', error);
      setAdError(true);
    }
  }, [slot, format]);

  // Don't render if AdSense is not configured
  if (!import.meta.env.VITE_ADSENSE_ENABLED || !import.meta.env.VITE_ADSENSE_PUBLISHER_ID) {
    return null;
  }

  const adStyle = {
    display: responsive ? 'block' : 'inline-block',
    width: width || (responsive ? '100%' : 'auto'),
    height: height || (responsive ? 'auto' : 'auto'),
    ...style
  };

  return (
    <div 
      className={`adsense-ad-container ${className}`}
      style={{ 
        textAlign: 'center',
        overflow: 'hidden',
        ...adStyle
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={import.meta.env.VITE_ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-ad-test={import.meta.env.DEV ? 'on' : 'off'}
      />
      {adError && (
        <div className="ad-error" style={{ 
          padding: '8px', 
          fontSize: '12px', 
          color: '#666',
          background: '#f5f5f5',
          border: '1px solid #ddd'
        }}>
          Ad not available
        </div>
      )}
    </div>
  );
};

export default AdSenseAd;
