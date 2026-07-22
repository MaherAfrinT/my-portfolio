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

export function AdminProjects() {
  const {
    data: projects,
    loading: projectsLoading,
    error: fetchError,
  } = useFirestoreCollection(COLLECTIONS.PROJECTS, 'createdAt', 'desc');

  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.PROJECTS);

  const [formData, setFormData] = useState({
    projectsPageTitle: '',
    projectsPageSubtitle: ''
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
            projectsPageTitle: data.projectsPageTitle || '',
            projectsPageSubtitle: data.projectsPageSubtitle || '',
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

  if (projectsLoading || configLoading) return <div>Loading...</div>;
  if (fetchError) return <div>Error loading projects.</div>;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button as={Link} to="/admin/projects/new">
          Add New Project
        </Button>
      </div>

      <Card>
        <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Projects Page Settings</h2>
          {message && <span className="text-sm font-bold text-green-500">{message}</span>}
        </div>
        <CardContent className="pt-6">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Projects Page Title</label>
              <Input
                name="projectsPageTitle"
                value={formData.projectsPageTitle}
                onChange={handleChange}
                placeholder="Selected Works"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Projects Page Subtitle</label>
              <Textarea
                name="projectsPageSubtitle"
                value={formData.projectsPageSubtitle}
                onChange={handleChange}
                placeholder="A collection of my recent projects..."
              />
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
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt=""
                    className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-slate-200 text-xs text-slate-500 dark:bg-slate-700">
                    No Img
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold truncate">{project.title}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {project.categories?.join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <Button
                  as={Link}
                  to={`/admin/projects/${project.id}`}
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none justify-center"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(project.id, 'project')}
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none justify-center"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <div className="rounded-lg border border-dashed py-12 text-center text-slate-500">
            No projects found. Create one!
          </div>
        )}
      </div>
    </div>
  );
}
