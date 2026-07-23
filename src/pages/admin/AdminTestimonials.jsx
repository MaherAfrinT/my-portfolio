import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAdminDelete } from '../../hooks/useAdminDelete';
import { COLLECTIONS } from '../../lib/constants';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export function AdminTestimonials() {
  const {
    data: testimonials,
    loading,
    error,
  } = useFirestoreCollection(COLLECTIONS.TESTIMONIALS, 'createdAt', 'desc');

  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.TESTIMONIALS);

  const [formData, setFormData] = useState({
    testimonialsTabTitle: '',
    testimonialsSectionTitle: '',
    testimonialsSectionSubtitle: ''
  });
  const [configLoading, setConfigLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchConfig() {
      try {
        const docRef = doc(db, COLLECTIONS.CONFIG, 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            testimonialsTabTitle: data.testimonialsTabTitle || '',
            testimonialsSectionTitle: data.testimonialsSectionTitle || '',
            testimonialsSectionSubtitle: data.testimonialsSectionSubtitle || ''
          });
        }
      } catch (err) {
        console.error('Failed to load config', err);
      } finally {
        setConfigLoading(false);
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

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, COLLECTIONS.CONFIG, 'main'), formData, { merge: true });
      setMessage('Settings saved!');
    } catch (err) {
      console.error('Failed to save config', err);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading || configLoading) return <div>Loading testimonials...</div>;
  if (error) return <div>Error loading testimonials.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Button as={Link} to="/admin/testimonials/new">
          Add New Testimonial
        </Button>
      </div>

      <Card className="mb-8">
        <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Testimonials Page Settings</h2>
          {message && <span className="text-sm font-bold text-green-500">{message}</span>}
        </div>
        <CardContent className="pt-6">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Testimonials Tab Title</label>
                <Input
                  name="testimonialsTabTitle"
                  value={formData.testimonialsTabTitle}
                  onChange={handleChange}
                  placeholder="Testimonials"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Testimonials Section Title</label>
                <Input
                  name="testimonialsSectionTitle"
                  value={formData.testimonialsSectionTitle}
                  onChange={handleChange}
                  placeholder="Testimonials"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Testimonials Section Subtitle</label>
                <Input
                  name="testimonialsSectionSubtitle"
                  value={formData.testimonialsSectionSubtitle}
                  onChange={handleChange}
                  placeholder="What people say about working with me."
                />
              </div>
            </div>
            <Button
              type="submit"
              isLoading={saving}
              className="bg-cyan-500 text-[#0e2a36] hover:bg-cyan-600"
            >
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto min-w-0">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt=""
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-500 dark:bg-slate-700">
                    {t.author.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold truncate">{t.author}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {t.position}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <Button
                  as={Link}
                  to={`/admin/testimonials/${t.id}`}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none justify-center"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(t.id, 'testimonial')}
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none justify-center"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {testimonials.length === 0 && (
          <div className="rounded-lg border border-dashed py-12 text-center text-slate-500">
            No testimonials found. Create one!
          </div>
        )}
      </div>
    </div>
  );
}
