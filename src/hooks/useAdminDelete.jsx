import { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2';

export function useAdminDelete(collectionName) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (id, title = 'item') => {
    const result = await Swal.fire({
      title: `Delete ${title}?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      setError(null);
      try {
        await deleteDoc(doc(db, collectionName, id));
        Swal.fire({
          title: 'Deleted!',
          text: `Your ${title} has been deleted.`,
          icon: 'success',
          confirmButtonColor: '#06b6d4',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error(`Error deleting from ${collectionName}:`, err);
        setError(`Failed to delete ${title}.`);
        Swal.fire({
          title: 'Error!',
          text: `Failed to delete ${title}.`,
          icon: 'error',
          confirmButtonColor: '#06b6d4'
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return { handleDelete, isDeleting, error };
}
