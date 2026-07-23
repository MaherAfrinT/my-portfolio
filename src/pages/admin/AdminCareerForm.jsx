import React from 'react';
import { useParams } from 'react-router-dom';
import { useAdminCareerForm } from '../../hooks/useAdminCareerForm';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardContent } from '../../components/ui/Card';

export function AdminCareerForm() {
  const { id } = useParams();
  const {
    isEditing,
    loading,
    saving,
    formData,
    handleChange,
    handleSubmit,
    navigate
  } = useAdminCareerForm(id);

  const onFormSubmit = (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!formData.role?.trim()) emptyFields.push('Role / Title');
    if (!formData.company?.trim()) emptyFields.push('Company / Institution');
    if (!formData.startDate?.trim()) emptyFields.push('Start Date');
    if (!formData.current && !formData.endDate?.trim()) emptyFields.push('End Date');

    if (emptyFields.length > 0) {
      const confirmSave = window.confirm(
        `The following fields are empty:\n- ${emptyFields.join('\n- ')}\n\nAre you sure you want to save anyway?`
      );
      if (!confirmSave) return;
    }
    handleSubmit(e);
  };
  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Career' : 'New Career'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/admin/career')}>
          Cancel
        </Button>
      </div>

      <form onSubmit={onFormSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role / Title *</label>
                <Input
                  name="role"
                  value={formData.role || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Company / Institution *
                </label>
                <Input
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
                <select
                  name="type"
                  value={formData.type || 'experience'}
                  onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="experience">Experience</option>
                <option value="education">Education</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date *</label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleChange}
                  disabled={formData.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                name="current"
                checked={formData.current}
                onChange={handleChange}
                className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor="current" className="text-sm font-medium">
                Current Role
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Skills (comma separated)
              </label>
              <Input
                name="skills"
                value={formData.skills || ''}
                onChange={handleChange}
                placeholder="React, Node.js, Leadership"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Achievements (one per line)
              </label>
              <Textarea
                name="achievements"
                value={formData.achievements || ''}
                onChange={handleChange}
                className="min-h-[100px]"
                placeholder="- Improved performance&#10;- Built XYZ feature"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="min-h-[150px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={saving}>
            Save Entry
          </Button>
        </div>
      </form>
    </div>
  );
}
