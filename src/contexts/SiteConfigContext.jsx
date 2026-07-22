import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_SITE_CONFIG } from '../lib/constants';

const SiteConfigContext = createContext();

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeConfig = () => {};
    let unsubscribeSkills = () => {};

    // Listen to real-time updates for site config
    unsubscribeConfig = onSnapshot(
      doc(db, 'config', 'main'),
      (docSnap) => {
        setConfig((prev) => ({
          ...prev,
          ...(docSnap.exists() ? docSnap.data() : {}),
        }));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching site config:', error);
        setLoading(false);
      }
    );

    // Listen to real-time updates for skills collection
    import('firebase/firestore').then(({ collection, query, orderBy }) => {
      const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
      unsubscribeSkills = onSnapshot(
        q,
        (snapshot) => {
          const fetchedSkills = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setConfig((prev) => ({ ...prev, skills: fetchedSkills }));
        },
        (error) => {
          console.error('Error fetching skills:', error);
        }
      );
    });

    return () => {
      unsubscribeConfig();
      unsubscribeSkills();
    };
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
