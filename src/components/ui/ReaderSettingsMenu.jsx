import React, { useState } from 'react';
import { Minus, Plus, Settings2, X } from 'lucide-react';
import { useReaderSettings } from '../../hooks/useReaderSettings';
import { motion, AnimatePresence } from 'framer-motion';

export function ReaderSettingsMenu() {
  const { settings, updateSetting } = useReaderSettings();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] md:bottom-12 md:right-12">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-x-4 bottom-24 z-[100] mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl md:absolute md:inset-x-auto md:bottom-16 md:right-0 md:w-72 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Reader Settings
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-[#566e7a] dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Font Size */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500">
                  Font Size ({settings.fontSize}px)
                </label>
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
                  <button
                    onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                    className="flex flex-1 items-center justify-center rounded-lg py-2 text-[#566e7a] hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-mono text-sm font-medium">{settings.fontSize}</span>
                  <button
                    onClick={() => updateSetting('fontSize', Math.min(32, settings.fontSize + 2))}
                    className="flex flex-1 items-center justify-center rounded-lg py-2 text-[#566e7a] hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500">
                  Font Family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => updateSetting('fontFamily', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  <option value="default">Default (System)</option>
                  <option value="merriweather">Merriweather (Serif)</option>
                  <option value="lora">Lora (Serif)</option>
                  <option value="roboto">Roboto (Sans)</option>
                  <option value="open-sans">Open Sans (Sans)</option>
                </select>
              </div>

              {/* Theme */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSetting('theme', 'default')}
                    className={`rounded-xl border p-2 text-xs font-medium transition-colors ${
                      settings.theme === 'default'
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                    }`}
                  >
                    System
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'sepia')}
                    className={`rounded-xl border p-2 text-xs font-medium transition-colors ${
                      settings.theme === 'sepia'
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                    }`}
                    style={{ backgroundColor: settings.theme !== 'sepia' ? '#f4ecd8' : undefined, color: settings.theme !== 'sepia' ? '#5b4636' : undefined }}
                  >
                    Sepia
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`rounded-xl border p-2 text-xs font-medium transition-colors ${
                      settings.theme === 'dark'
                        ? 'border-slate-500 bg-slate-800 text-slate-100'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                    }`}
                    style={{ backgroundColor: settings.theme !== 'dark' ? '#1e1e20' : undefined, color: settings.theme !== 'dark' ? '#d4d4d6' : undefined }}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'eye-care')}
                    className={`rounded-xl border p-2 text-xs font-medium transition-colors ${
                      settings.theme === 'eye-care'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                    }`}
                    style={{ backgroundColor: settings.theme !== 'eye-care' ? '#cce8cf' : undefined, color: settings.theme !== 'eye-care' ? '#1f3d23' : undefined }}
                  >
                    Eye Care
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 w-full rounded-xl bg-cyan-500 py-3 text-sm font-bold text-white hover:bg-cyan-600 active:scale-[0.98]"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-white shadow-xl transition-transform hover:scale-110 hover:bg-cyan-600 active:scale-95"
      >
        <Settings2 className="h-5 w-5" />
      </button>
    </div>
  );
}
