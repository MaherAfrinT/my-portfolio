import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../lib/constants';

export function useAdminCareerForm(id) {
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    type: 'experience',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    skills: '',
    achievements: '',
  });

  useEffect(() => {
    async function fetchCareer() {
      if (!isEditing) return;
      try {
        const docRef = doc(db, COLLECTIONS.CAREER, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            ...data,
            startDate: data.startDate
              ? data.startDate.toDate().toISOString().split('T')[0]
              : '',
            endDate: data.endDate
              ? data.endDate.toDate().toISOString().split('T')[0]
              : '',
            skills: data.skills?.join(', ') || '',
            achievements: data.achievements?.join('\n') || '',
          });
        }
      } catch (err) {
        console.error('Failed to load career entry', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCareer();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        startDate: formData.startDate
          ? Timestamp.fromDate(new Date(formData.startDate))
          : null,
        endDate: formData.current
          ? null
          : formData.endDate
            ? Timestamp.fromDate(new Date(formData.endDate))
            : null,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        achievements: formData.achievements
          .split('\n')
          .map((a) => a.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        dataToSave.updatedAt = serverTimestamp();
        await setDoc(doc(db, COLLECTIONS.CAREER, id), dataToSave, { merge: true });
      } else {
        dataToSave.createdAt = serverTimestamp();
        await addDoc(collection(db, COLLECTIONS.CAREER), dataToSave);
      }
      navigate('/admin/career');
    } catch (err) {
      console.error('Failed to save', err);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return {
    isEditing,
    loading,
    saving,
    formData,
    handleChange,
    handleSubmit,
    navigate
  };
}
