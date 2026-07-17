import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../lib/constants';

export function useAdminJournalForm(id) {
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    category: 'Philosophy',
    content: '',
    isPublished: false,
  });

  useEffect(() => {
    async function fetchEntry() {
      if (!id) return;
      try {
        const docRef = doc(db, COLLECTIONS.JOURNAL, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();

          let dateStr = '';
          if (data.date?.toDate) {
            dateStr = data.date.toDate().toISOString().split('T')[0];
          } else if (data.date) {
            dateStr = new Date(data.date).toISOString().split('T')[0];
          }

          setFormData({
            date: dateStr || new Date().toISOString().split('T')[0],
            title: data.title || '',
            category: data.category || 'Philosophy',
            content: data.content || data.note || '', // fallback to note if migrating
            isPublished: data.isPublished || false,
          });
        } else {
          setError('Entry not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch entry');
      } finally {
        setLoading(false);
      }
    }
    fetchEntry();
  }, [id]);

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
    setError('');

    try {
      const [year, month, day] = formData.date.split('-');
      const entryDate = new Date(year, month - 1, day, 12, 0, 0);

      const entryData = {
        date: Timestamp.fromDate(entryDate),
        title: formData.title,
        category: formData.category,
        content: formData.content,
        isPublished: formData.isPublished,
        updatedAt: Timestamp.now(),
      };

      if (!isEditing) {
        entryData.createdAt = Timestamp.now();
      }

      if (isEditing) {
        const docRef = doc(db, COLLECTIONS.JOURNAL, id);
        await updateDoc(docRef, entryData);
      } else {
        await addDoc(collection(db, COLLECTIONS.JOURNAL), entryData);
      }

      navigate('/admin/journal');
    } catch (err) {
      console.error(err);
      setError('Failed to save entry. Please try again.');
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
    handleChange,
    handleSubmit,
    navigate
  };
}
