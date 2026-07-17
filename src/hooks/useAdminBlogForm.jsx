import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../lib/constants';

export function useAdminBlogForm(id) {
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    tags: '',
    coverImage: '',
    isPublished: false,
  });

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => {
      const oldAutoSlug = prev.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      return {
        ...prev,
        title,
        slug: !prev.slug || prev.slug === oldAutoSlug ? newSlug : prev.slug,
      };
    });
  };

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const docRef = doc(db, COLLECTIONS.BLOG, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            content: data.content || '',
            tags: data.tags?.join(', ') || '',
            coverImage: data.coverImage || '',
            isPublished: data.isPublished || false,
          });
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
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
      const postData = {
        title: formData.title,
        slug:
          formData.slug ||
          formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
        content: formData.content,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        coverImage: formData.coverImage,
        isPublished: formData.isPublished,
        updatedAt: serverTimestamp(),
      };

      if (isEditing) {
        const docRef = doc(db, COLLECTIONS.BLOG, id);
        if (formData.isPublished && !formData.publishedAt) {
          postData.publishedAt = serverTimestamp();
        }
        await updateDoc(docRef, postData);
      } else {
        postData.createdAt = serverTimestamp();
        if (formData.isPublished) {
          postData.publishedAt = serverTimestamp();
        }
        await addDoc(collection(db, COLLECTIONS.BLOG), postData);
      }

      navigate('/admin/blog');
    } catch (err) {
      console.error(err);
      setError('Failed to save post. Please try again.');
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
    handleTitleChange,
    handleChange,
    handleSubmit,
    navigate
  };
}
