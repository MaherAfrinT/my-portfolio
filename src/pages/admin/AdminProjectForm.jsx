import React from 'react';
import { useParams } from 'react-router-dom';
import { useAdminProjectForm } from '../../hooks/useAdminProjectForm';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { MarkdownEditor } from '../../components/admin/MarkdownEditor';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Card, CardContent } from '../../components/ui/Card';

export function AdminProjectForm() {
  const { id } = useParams();
  const {
    isEditing,
    loading,
    saving,
    error,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    navigate
  } = useAdminProjectForm(id);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Project' : 'New Project'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/admin/projects')}>
          Cancel
        </Button>
      </div>

      {error && <div className="text-red-500 font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Summary (Short description)
              </label>
              <Textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub URL</label>
                <Input
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Live URL</label>
                <Input
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Categories (comma separated)
                </label>
                <Input
                  name="categories"
                  value={formData.categories}
                  onChange={handleChange}
                  placeholder="Web, Mobile, Open Source"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tech Stack (comma separated)
                </label>
                <Input
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="React, Firebase, Tailwind"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image URL</label>
              <Input
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://imgur.com/... or https://unsplash.com/..."
              />
              <p className="text-xs text-slate-500">
                Paste an image link from Imgur, Unsplash, or GitHub. Or use the
                uploader below.
              </p>
              <div className="mt-4">
                <ImageUploader
                  folder="projects"
                  onUploadSuccess={(url) =>
                    setFormData((prev) => ({ ...prev, coverImage: url }))
                  }
                />
              </div>
              {formData.coverImage && (
                <div className="mt-2">
                  <img
                    src={formData.coverImage}
                    alt="Cover Preview"
                    className="h-32 rounded-md object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Full Description (Markdown)
              </label>
              <MarkdownEditor
                value={formData.description}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, description: val }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={saving}>
            Save Project
          </Button>
        </div>
      </form>
    </div>
  );
}
