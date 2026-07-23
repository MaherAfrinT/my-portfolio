import React from 'react';
import { useParams } from 'react-router-dom';
import { useAdminCertificationForm } from '../../hooks/useAdminCertificationForm';
import { Button } from '../../components/ui/Button';

export function AdminCertificationForm() {
  const { id } = useParams();
  const {
    isEditing,
    loading,
    error,
    formData,
    handleChange,
    handleSubmit,
    navigate
  } = useAdminCertificationForm(id);

  const onFormSubmit = (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!formData.title?.trim()) emptyFields.push('Short Title');
    if (!formData.fullName?.trim()) emptyFields.push('Full Name');
    if (!formData.issuer?.trim()) emptyFields.push('Issuer');
    if (!formData.description?.trim()) emptyFields.push('Description');

    if (emptyFields.length > 0) {
      const confirmSave = window.confirm(
        `The following fields are empty:\n- ${emptyFields.join('\n- ')}\n\nAre you sure you want to save anyway?`
      );
      if (!confirmSave) return;
    }
    handleSubmit(e);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/certifications')}
          className="px-2"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#0e2a36] dark:text-white">
            {isEditing ? 'Edit Certification' : 'New Certification'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details for the certification
          </p>
        </div>
      </div>

      <form
        onSubmit={onFormSubmit}
        className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#385361] dark:text-slate-300">
              Short Title (e.g. CCNA)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#385361] dark:text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#385361] dark:text-slate-300">
              Issuer (e.g. Cisco, AWS)
            </label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer || ''}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#385361] dark:text-slate-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags || ''}
              onChange={handleChange}
              placeholder="Networking, Cloud, Security"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#385361] dark:text-slate-300">
              Issued Date (e.g. Jun 2024)
            </label>
            <input
              type="text"
              name="issuedDate"
              value={formData.issuedDate || ''}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#385361] dark:text-slate-300">
              Expiry Date (Optional)
            </label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate || ''}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 border-t border-slate-200 pt-6 md:grid-cols-2 dark:border-slate-800">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#385361] dark:text-slate-300">
              Badge Image URL
            </label>
            <p className="mb-2 text-xs text-slate-500">
              Paste a URL from Imgur, GitHub, or any public image host.
            </p>
            <input
              type="url"
              name="badgeUrl"
              value={formData.badgeUrl || ''}
              onChange={handleChange}
              placeholder="https://i.imgur.com/..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            {formData.badgeUrl && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="mb-2 text-xs font-medium text-slate-500">
                  Preview:
                </p>
                <img
                  src={formData.badgeUrl}
                  alt="Badge Preview"
                  className="h-16 object-contain"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#385361] dark:text-slate-300">
              Verification URL
            </label>
            <p className="mb-2 text-xs text-slate-500">
              Link to Credly or official verification page.
            </p>
            <input
              type="url"
              name="verifyUrl"
              value={formData.verifyUrl || ''}
              onChange={handleChange}
              placeholder="https://www.credly.com/badges/..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-200 pt-6 dark:border-slate-800">
          <label className="text-sm font-medium text-[#385361] dark:text-slate-300">
            Description (Markdown Supported)
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={10}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            placeholder="Write a detailed description of what you learned, the exam requirements, etc."
          />
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/certifications')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[120px]">
            {loading ? 'Saving...' : 'Save Certification'}
          </Button>
        </div>
      </form>
    </div>
  );
}
