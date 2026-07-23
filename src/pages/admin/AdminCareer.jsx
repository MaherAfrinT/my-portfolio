import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAdminDelete } from '../../hooks/useAdminDelete';
import { COLLECTIONS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { formatDate } from '../../lib/utils';

export function AdminCareer() {
  const { data: career, loading } = useFirestoreCollection(
    COLLECTIONS.CAREER,
    'startDate',
    'desc'
  );

  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.CAREER);

  const [formData, setFormData] = useState({
    careerPageTitle: '',
    careerPageSubtitle: '',
    experienceTabTitle: ''
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
            careerPageTitle: data.careerPageTitle || '',
            careerPageSubtitle: data.careerPageSubtitle || '',
            experienceTabTitle: data.experienceTabTitle || ''
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

  if (loading || configLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Career & Education</h1>
        <Button as={Link} to="/admin/career/new">
          Add New Entry
        </Button>
      </div>

      <Card>
        <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Career Page Settings</h2>
          {message && <span className="text-sm font-bold text-green-500">{message}</span>}
        </div>
        <CardContent className="pt-6">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Career Page Title</label>
                <Input
                  name="careerPageTitle"
                  value={formData.careerPageTitle}
                  onChange={handleChange}
                  placeholder="Career Journey"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Career Page Subtitle</label>
                <Input
                  name="careerPageSubtitle"
                  value={formData.careerPageSubtitle}
                  onChange={handleChange}
                  placeholder="My professional journey and education."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Tab Title</label>
                <Input
                  name="experienceTabTitle"
                  value={formData.experienceTabTitle}
                  onChange={handleChange}
                  placeholder="Experience"
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
        {career.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold truncate">{item.role}</h3>
                <div className="text-sm text-slate-500 truncate">
                  {item.company} |{' '}
                  {item.type === 'education' ? 'Education' : 'Experience'}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {formatDate(item.startDate)} -{' '}
                  {item.current ? 'Present' : formatDate(item.endDate)}
                </div>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <Button
                  as={Link}
                  to={`/admin/career/${item.id}`}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none justify-center"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item.id, 'career entry')}
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none justify-center"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {career.length === 0 && (
          <div className="rounded-lg border border-dashed py-12 text-center text-slate-500">
            No career entries found.
          </div>
        )}
      </div>
    </div>
  );
}
