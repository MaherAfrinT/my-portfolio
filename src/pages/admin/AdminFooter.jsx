import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { DEFAULT_SITE_CONFIG, COLLECTIONS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardContent } from '../../components/ui/Card';
import Circle from '@uiw/react-color-circle';
import { LucideIcons } from '../../lib/icon-map';

export function AdminFooter() {
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

  const handleSocialChange = (idx, field, value) => {
    const updatedSocials = [...(formData.socialLinks || [])];
    updatedSocials[idx] = { ...updatedSocials[idx], [field]: value };
    setFormData((prev) => ({
      ...prev,
      socialLinks: updatedSocials,
    }));
  };

  const addSocial = () => {
    const newSocial = { id: Date.now().toString(), platform: 'New Link', url: '', iconName: 'Link' };
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newSocial],
    }));
  };

  const removeSocial = (idx) => {
    const updatedSocials = formData.socialLinks.filter((_, i) => i !== idx);
    setFormData((prev) => ({
      ...prev,
      socialLinks: updatedSocials,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'config', 'main'), formData, { merge: true });
      setMessage('Footer settings saved successfully!');
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
      <h1 className="text-3xl font-bold">Footer & Layout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800">
            <h2 className="text-xl font-bold">Call to Action (CTA) Section</h2>
          </div>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Available for Work</label>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.isAvailableForWork || false}
                  onClick={() =>
                    handleChange({
                      target: {
                        name: 'isAvailableForWork',
                        value: !formData.isAvailableForWork,
                      },
                    })
                  }
                  className={`${
                    formData.isAvailableForWork ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      formData.isAvailableForWork ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {formData.isAvailableForWork ? 'Active (Green Dot)' : 'Inactive (Red Dot)'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Title</label>
              <Input
                name="ctaTitle"
                value={formData.ctaTitle || ''}
                onChange={handleChange}
                placeholder="Let's create your next big idea."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Button Text</label>
              <Input
                name="ctaButtonText"
                value={formData.ctaButtonText || ''}
                onChange={handleChange}
                placeholder="Contact Me"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800">
            <h2 className="text-xl font-bold">Social Links</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={addSocial}
              className="border-cyan-500/50 text-cyan-500 hover:bg-cyan-500/10"
            >
              <LucideIcons.Plus className="mr-2 h-4 w-4" /> Add Link
            </Button>
          </div>
          <CardContent className="space-y-6 pt-6">
            {(formData.socialLinks || []).map((social, idx) => (
              <div key={social.id || idx} className="flex flex-col gap-4 md:flex-row items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Platform Name</label>
                  <Input
                    value={social.platform || ''}
                    onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={social.url || ''}
                    onChange={(e) => handleSocialChange(idx, 'url', e.target.value)}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <label className="text-sm font-medium">Icon Name</label>
                  <Input
                    value={social.iconName || 'Link'}
                    onChange={(e) => handleSocialChange(idx, 'iconName', e.target.value)}
                    title="Lucide icon name (e.g. Github, Linkedin, Twitter, Youtube)"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => removeSocial(idx)}
                  className="mb-0.5 border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
                >
                  <LucideIcons.Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800">
            <h2 className="text-xl font-bold">Easter Eggs & Footer</h2>
          </div>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cat Accent Color</label>
                <div className="flex flex-col gap-4">
                  <Circle
                    colors={[
                      '#FFFF00', // Yellow
                      '#00E5FF', // Cyan
                      '#FF0055', // Pink
                      '#00FF00', // Green
                      '#FF9900', // Orange
                      '#9900FF', // Purple
                      '#FFFFFF', // White
                    ]}
                    color={formData.catAccentColor || '#FFFF00'}
                    onChange={(color) => {
                      handleChange({
                        target: { name: 'catAccentColor', value: color.hex },
                      });
                    }}
                  />
                  <Input
                    type="text"
                    name="catAccentColor"
                    value={formData.catAccentColor || '#FFFF00'}
                    onChange={handleChange}
                    className="font-mono w-40"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cat Message</label>
                <Textarea
                  name="catMessage"
                  value={formData.catMessage || ''}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  placeholder="You've reached the end!"
                />
              </div>
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
