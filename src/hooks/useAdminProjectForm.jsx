import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../lib/constants';
import { isValidUrl } from '../lib/utils';

export function useAdminProjectForm(id) {
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    coverImage: '',
    githubUrl: '',
    liveUrl: '',
    categories: '',
    techStack: '',
  });

  useEffect(() => {
    async function fetchProject() {
      if (!isEditing) return;
      try {
        const docRef = doc(db, COLLECTIONS.PROJECTS, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            ...data,
            categories: data.categories?.join(', ') || '',
            techStack: data.techStack?.join(', ') || '',
          });
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Failed to load project', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title) {
      setError('Title is required');
      return;
    }
    if (!isValidUrl(formData.githubUrl)) {
      setError('Invalid GitHub URL');
      return;
    }
    if (!isValidUrl(formData.liveUrl)) {
      setError('Invalid Live URL');
      return;
    }
    if (!isValidUrl(formData.coverImage)) {
      setError('Invalid Cover Image URL');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        categories: formData.categories
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        techStack: formData.techStack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        dataToSave.updatedAt = serverTimestamp();
        await setDoc(doc(db, COLLECTIONS.PROJECTS, id), dataToSave, { merge: true });
      } else {
        dataToSave.createdAt = serverTimestamp();
        await addDoc(collection(db, COLLECTIONS.PROJECTS), dataToSave);
      }
      navigate('/admin/projects');
    } catch (err) {
      console.error('Failed to save project', err);
      setError('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return {
    isEditing,
    loading,
    saving,
    error,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    navigate
  };
}
