import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { DEFAULT_SITE_CONFIG, COLLECTIONS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardContent } from '../../components/ui/Card';

export function AdminContactPage() {
  const [formData, setFormData] = useState(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchConfig() {
      try {
        const docRef = doc(db, COLLECTIONS.CONFIG, 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({ ...DEFAULT_SITE_CONFIG, ...data });
        }
      } catch (err) {
        console.error('Failed to load config', err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'config', 'main'), formData, { merge: true });
      setMessage('Contact page settings saved successfully!');
    } catch (err) {
      console.error('Failed to save config', err);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6 pb-24">
      <h1 className="text-3xl font-bold">Contact Page Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800">
            <h2 className="text-xl font-bold">Main Content</h2>
          </div>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title</label>
              <Textarea
                name="contactPageTitle"
                value={formData.contactPageTitle || ''}
                onChange={handleChange}
                placeholder="Let's start a project&#10;together"
                className="min-h-[100px]"
              />
              <p className="text-xs text-slate-500">Supports line breaks.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Page Avatar/Logo URL</label>
              <Input
                name="contactPageImage"
                value={formData.contactPageImage || ''}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-slate-500">Image to display above your description. If empty, it falls back to your Hero Image or name initial.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Description Text</label>
              <Textarea
                name="contactPageText"
                value={formData.contactPageText || ''}
                onChange={handleChange}
                className="min-h-[120px]"
                placeholder="My inbox is always open..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-6 z-10 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm font-bold text-green-500">{message}</div>
          <Button
            type="submit"
            isLoading={saving}
            className="bg-cyan-500 text-[#0e2a36] hover:bg-cyan-600"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
