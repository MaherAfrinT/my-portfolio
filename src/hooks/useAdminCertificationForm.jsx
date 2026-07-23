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

export function useAdminCertificationForm(id) {
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    issuer: '',
    description: '',
    badgeUrl: '',
    verifyUrl: '',
    issuedDate: '',
    expiryDate: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!isEditing) return;
      try {
        const docRef = doc(db, COLLECTIONS.CERTIFICATIONS, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            ...data,
            tags: data.tags ? data.tags.join(', ') : '',
          });
        }
      } catch (err) {
        setError('Failed to load certification data');
        console.error(err);
      }
    }
    loadData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.badgeUrl && !isValidUrl(formData.badgeUrl)) {
      setError('Invalid Badge URL');
      return;
    }
    if (formData.verifyUrl && !isValidUrl(formData.verifyUrl)) {
      setError('Invalid Verification URL');
      return;
    }

    setLoading(true);
    try {
      const tagsArray = (formData.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const certData = {
        ...formData,
        tags: tagsArray,
        updatedAt: serverTimestamp(),
      };

      if (isEditing) {
        await setDoc(doc(db, COLLECTIONS.CERTIFICATIONS, id), certData, { merge: true });
      } else {
        certData.createdAt = serverTimestamp();
        await addDoc(collection(db, COLLECTIONS.CERTIFICATIONS), certData);
      }

      navigate('/admin/certifications');
    } catch (err) {
      console.error('Error saving certification:', err);
      setError('Failed to save certification');
    } finally {
      setLoading(false);
    }
  };

  return {
    isEditing,
    loading,
    error,
    formData,
    handleChange,
    handleSubmit,
    navigate
  };
}
