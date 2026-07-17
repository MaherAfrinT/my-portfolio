import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

/**
 * Hybrid Image Handler
 * ────────────────────
 * PRIMARY  → Paste a URL from Imgur, Unsplash, Google Drive, etc.
 * INACTIVE → Firebase Storage file-upload (commented-out, enable via toggle).
 */
export function ImageUploader({ onUploadSuccess }) {
  const [urlValue, setUrlValue] = useState('');
  const [error, setError] = useState(null);

  // ── Active Mode: URL Input ──────────────────────────────────
  const isValidUrl = (str) => {
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleUrlSubmit = () => {
    setError(null);

    if (!urlValue.trim()) {
      setError('Please enter an image URL.');
      return;
    }

    if (!isValidUrl(urlValue.trim())) {
      setError('Please enter a valid URL (https://…).');
      return;
    }

    if (onUploadSuccess) {
      onUploadSuccess(urlValue.trim());
    }
    setUrlValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUrlSubmit();
    }
  };

  return (
    <div className="space-y-3 rounded-lg border-2 border-dashed border-slate-300 p-6 dark:border-slate-700">
      {/* ── URL Input (Active) ─────────────────────────────── */}
      <div className="flex gap-2">
        <Input
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste image URL (Imgur, Unsplash, Google Drive…)"
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={handleUrlSubmit}>
          Add Image
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Supports any public image URL. Paste a link and click{' '}
        <strong>Add Image</strong> or press{' '}
        <kbd className="rounded bg-slate-200 px-1 py-0.5 text-[10px] dark:bg-slate-700">
          Enter
        </kbd>
        .
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ▼▼▼  FIREBASE STORAGE FILE-UPLOAD (INACTIVE)  ▼▼▼
// ───────────────────────────────────────────────────────────────
// To re-enable:
//   1.  Enable Firebase Storage in your Firebase Console.
//   2.  Uncomment `getStorage` in src/firebase.js.
//   3.  Swap <ImageUploader /> for <FirebaseImageUploader /> below.
// ───────────────────────────────────────────────────────────────
//
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { storage } from '../../firebase';
//
// export function FirebaseImageUploader({ onUploadSuccess, folder = 'uploads' }) {
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState(null);
//
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//
//     if (!file.type.startsWith('image/')) {
//       setError('Please select an image file');
//       return;
//     }
//
//     if (file.size > 5 * 1024 * 1024) {
//       setError('File size must be less than 5MB');
//       return;
//     }
//
//     setError(null);
//     setUploading(true);
//
//     const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);
//
//     uploadTask.on('state_changed',
//       (snapshot) => {
//         const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setProgress(p);
//       },
//       (err) => {
//         console.error("Upload error:", err);
//         setError("Failed to upload image.");
//         setUploading(false);
//       },
//       async () => {
//         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//         setUploading(false);
//         setProgress(0);
//         if (onUploadSuccess) {
//           onUploadSuccess(downloadURL);
//         }
//       }
//     );
//   };
//
//   return (
//     <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center">
//       {uploading ? (
//         <div className="space-y-2">
//           <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
//             <div className="bg-cyan-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
//           </div>
//           <p className="text-sm text-slate-500 dark:text-slate-400">Uploading {Math.round(progress)}%</p>
//         </div>
//       ) : (
//         <div>
//           <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
//           <label htmlFor="image-upload">
//             <Button variant="outline" className="cursor-pointer" as="span"
//               onClick={() => document.getElementById('image-upload').click()}>
//               Select Image
//             </Button>
//           </label>
//           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//           <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Max 5MB. JPG, PNG, GIF, WebP.</p>
//         </div>
//       )}
//     </div>
//   );
// }
//
// ▲▲▲  END FIREBASE STORAGE SECTION  ▲▲▲
// ═══════════════════════════════════════════════════════════════
