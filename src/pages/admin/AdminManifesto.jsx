import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { COLLECTIONS, DEFAULT_SITE_CONFIG } from '../../lib/constants';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardContent } from '../../components/ui/Card';
import { Plus, Trash2 } from 'lucide-react';

export function AdminManifesto() {
  const [manifestoItems, setManifestoItems] = useState([]);
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
          if (Array.isArray(data.manifesto)) {
            setManifestoItems(data.manifesto);
          } else if (typeof data.manifesto === 'string' && data.manifesto) {
            setManifestoItems([data.manifesto]);
          } else {
            setManifestoItems([DEFAULT_SITE_CONFIG.manifesto]);
          }
        } else {
          setManifestoItems([DEFAULT_SITE_CONFIG.manifesto]);
        }
      } catch (err) {
        console.error('Failed to load config', err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleAddItem = () => {
    setManifestoItems([...manifestoItems, '']);
  };

  const handleRemoveItem = (index) => {
    setManifestoItems(manifestoItems.filter((_, i) => i !== index));
  };

  const handleChange = (index, value) => {
    const updated = [...manifestoItems];
    updated[index] = value;
    setManifestoItems(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const cleanedItems = manifestoItems.filter((item) => item.trim() !== '');
      await setDoc(
        doc(db, COLLECTIONS.CONFIG, 'main'),
        { manifesto: cleanedItems },
        { merge: true }
      );
      setManifestoItems(cleanedItems);
      setMessage('Manifesto saved successfully!');
    } catch (err) {
      console.error('Failed to save manifesto', err);
      setMessage('Failed to save manifesto.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Manifesto</h1>
        <Button onClick={handleAddItem} className="bg-cyan-500 text-slate-900 hover:bg-cyan-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Paragraph
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {manifestoItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="flex items-start gap-4 pt-6">
              <Textarea
                value={item}
                onChange={(e) => handleChange(index, e.target.value)}
                className="min-h-[100px]"
                placeholder="Enter a paragraph of your manifesto..."
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleRemoveItem(index)}
                className="mt-1 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {manifestoItems.length === 0 && (
          <div className="text-center text-slate-500">
            No manifesto paragraphs yet. Click "Add Paragraph" to start.
          </div>
        )}

        <div className="sticky bottom-6 z-10 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm font-bold text-green-500">{message}</div>
          <Button
            type="submit"
            isLoading={saving}
            className="bg-cyan-500 text-slate-900 hover:bg-cyan-600"
          >
            Save Manifesto
          </Button>
        </div>
      </form>
    </div>
  );
}
