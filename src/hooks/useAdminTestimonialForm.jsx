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

export function useAdminTestimonialForm(id) {
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    author: '',
    position: '',
    quote: '',
    avatarUrl: '',
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTestimonial() {
      if (!isEditing) return;
      try {
        const docRef = doc(db, COLLECTIONS.TESTIMONIALS, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            author: data.author || '',
            position: data.position || '',
            quote: data.quote || '',
            avatarUrl: data.avatarUrl || '',
          });
        } else {
          setError('Testimonial not found.');
        }
      } catch (err) {
        console.error('Error fetching testimonial:', err);
        setError('Error loading testimonial data.');
      } finally {
        setLoading(false);
      }
    }
    loadTestimonial();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const dataToSave = { ...formData };

      if (isEditing) {
        await setDoc(doc(db, COLLECTIONS.TESTIMONIALS, id), dataToSave, { merge: true });
      } else {
        dataToSave.createdAt = serverTimestamp();
        await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), dataToSave);
      }
      navigate('/admin/testimonials');
    } catch (err) {
      console.error('Error saving testimonial:', err);
      setError('Failed to save testimonial.');
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
