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

export function AdminSettings() {
  const [formData, setFormData] = useState(DEFAULT_SITE_CONFIG);
  const [typewriterStr, setTypewriterStr] = useState('');
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
          setTypewriterStr(
            data.typewriterWords?.join('\n') ||
              DEFAULT_SITE_CONFIG.typewriterWords.join('\n')
          );
        } else {
          setTypewriterStr(DEFAULT_SITE_CONFIG.typewriterWords.join('\n'));
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

  const handleNavLinkChange = (idx, field, value) => {
    const updatedLinks = [...(formData.navLinks || [])];
    updatedLinks[idx] = { ...updatedLinks[idx], [field]: value };
    setFormData((prev) => ({
      ...prev,
      navLinks: updatedLinks,
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

  const addNavLink = () => {
    const newLink = { id: Date.now().toString(), path: '/', label: 'New Link' };
    setFormData((prev) => ({
      ...prev,
      navLinks: [...(prev.navLinks || []), newLink],
    }));
  };

  const removeNavLink = (idx) => {
    const updatedLinks = formData.navLinks.filter((_, i) => i !== idx);
    setFormData((prev) => ({
      ...prev,
      navLinks: updatedLinks,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const parsedTypewriter = typewriterStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const dataToSave = {
        ...formData,
        typewriterWords: parsedTypewriter,
      };

      // Merge so we don't overwrite skills array if it exists
      await setDoc(doc(db, 'config', 'main'), dataToSave, { merge: true });

      setMessage('Settings saved successfully!');
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
      <h1 className="text-3xl font-bold">Site Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800">
            <h2 className="text-xl font-bold">General</h2>
          </div>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Greeting Text</label>
                <Input
                  name="greetingText"
                  value={formData.greetingText}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hero Prefix</label>
                <Input
                  name="heroPrefix"
                  value={formData.heroPrefix}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Typewriter Words (one per line)
                </label>
                <Textarea
                  value={typewriterStr}
                  onChange={(e) => setTypewriterStr(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hero Image URL</label>
                <Input
                  name="heroImageUrl"
                  value={formData.heroImageUrl || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/hero.webp"
                />
                <p className="text-xs text-slate-500">
                  Optional. Replaces the default hero animation.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">About Image URL</label>
                <Input
                  name="aboutImageUrl"
                  value={formData.aboutImageUrl || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/about.webp"
                />
                <p className="text-xs text-slate-500">
                  Optional. Displays an image in the About section.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline</label>
              <Input
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Resume Link (Google Drive / PDF URL)
              </label>
              <Input
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">About Text</label>
              <Textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800">
            <h2 className="text-xl font-bold">Section Visibility</h2>
            <p className="text-sm text-slate-500">Toggle which sections appear on the Home Page and Career Page.</p>
          </div>
          <CardContent className="space-y-4 pt-6">
            {Object.keys(formData.sectionVisibility || DEFAULT_SITE_CONFIG.sectionVisibility || {}).map((sectionKey) => (
              <label key={sectionKey} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                  checked={formData.sectionVisibility?.[sectionKey] ?? true}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      sectionVisibility: {
                        ...(prev.sectionVisibility || DEFAULT_SITE_CONFIG.sectionVisibility),
                        [sectionKey]: e.target.checked
                      }
                    }));
                  }}
                />
                <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                  {sectionKey.replace(/([A-Z])/g, ' $1').trim()} Section
                </span>
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800">
            <h2 className="text-xl font-bold">Navigation Links</h2>
          </div>
          <CardContent className="space-y-4 pt-6">
            {(formData.navLinks || []).map((link, idx) => (
              <div key={link.id || idx} className="flex items-center gap-4 border border-slate-200 p-4 rounded-lg dark:border-slate-800">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-medium">Label</label>
                  <Input value={link.label} onChange={(e) => handleNavLinkChange(idx, 'label', e.target.value)} />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-medium">Path</label>
                  <Input value={link.path} onChange={(e) => handleNavLinkChange(idx, 'path', e.target.value)} />
                </div>
                <Button type="button" variant="danger" size="sm" onClick={() => removeNavLink(idx)} className="mt-6">
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addNavLink}>
              + Add Navigation Link
            </Button>
          </CardContent>
        </Card>

        <div className="sticky bottom-6 z-10 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm font-bold text-green-500">{message}</div>
          <Button
            type="submit"
            isLoading={saving}
            className="bg-cyan-500 text-slate-900 hover:bg-cyan-600"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
