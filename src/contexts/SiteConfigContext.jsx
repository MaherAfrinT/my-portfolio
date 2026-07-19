import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_SITE_CONFIG } from '../lib/constants';

const SiteConfigContext = createContext();

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to real-time updates for site config
    const unsubscribe = onSnapshot(
      doc(db, 'config', 'main'),
      (docSnap) => {
        if (docSnap.exists()) {
          setConfig({ ...DEFAULT_SITE_CONFIG, ...docSnap.data() });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching site config:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loading }}>
      {!loading ? children : (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-[#030712]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
        </div>
      )}
    </SiteConfigContext.Provider>
  );
}

export const useSiteConfig = () => useContext(SiteConfigContext);
