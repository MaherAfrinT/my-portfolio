import { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export function useAdminDelete(collectionName) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (id, title = 'item') => {
    if (window.confirm(`Are you sure you want to delete this ${title}?`)) {
      setIsDeleting(true);
      setError(null);
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (err) {
        console.error(`Error deleting from ${collectionName}:`, err);
        setError(`Failed to delete ${title}.`);
        alert(`Failed to delete ${title}.`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return { handleDelete, isDeleting, error };
}
