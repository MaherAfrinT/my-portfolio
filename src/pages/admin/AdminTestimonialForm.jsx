import React from 'react';
import { useParams } from 'react-router-dom';
import { useAdminTestimonialForm } from '../../hooks/useAdminTestimonialForm';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardContent } from '../../components/ui/Card';

export function AdminTestimonialForm() {
  const { id } = useParams();
  const {
    isEditing,
    loading,
    saving,
    error,
    formData,
    handleChange,
    handleSubmit,
    navigate
  } = useAdminTestimonialForm(id);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Testimonial' : 'New Testimonial'}
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/testimonials')}
        >
          Cancel
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-100 p-4 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="border-b border-slate-200 px-6 pt-6 pb-2 dark:border-slate-800">
            <h2 className="text-xl font-bold">Testimonial Details</h2>
          </div>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Author Name</label>
              <Input
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Jane Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Position / Company</label>
              <Input
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="CEO at TechCorp"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-slate-500">
                Optional. You can safely paste an image link from GitHub, Google
                Drive (if public), Imgur, or any other host. This will not make
                the website vulnerable. Leave blank to show the person's
                initial.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reference Work URL</label>
              <Input
                name="referenceUrl"
                value={formData.referenceUrl}
                onChange={handleChange}
                placeholder="https://example.com or /projects/my-project"
              />
              <p className="text-xs text-slate-500">
                Optional. Link to the related website, or to one of your project pages (e.g., /projects/project-id).
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quote</label>
              <Textarea
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                required
                className="min-h-[150px]"
                placeholder="What they said..."
              />
            </div>

            <div className="pt-4">
              <Button type="submit" isLoading={saving} className="w-full">
                {isEditing ? 'Update Testimonial' : 'Create Testimonial'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
