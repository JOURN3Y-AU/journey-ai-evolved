import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Page, PageFormData } from "@/types/page";

interface PageFormProps {
  page?: Page;
  onSubmit: (data: PageFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PageForm = ({ page, onSubmit, onCancel, isLoading }: PageFormProps) => {
  const [formData, setFormData] = useState<PageFormData>({
    title: page?.title || "",
    slug: page?.slug || "",
    path: page?.path || "",
    meta_description: page?.meta_description || "",
    priority: page?.priority || 0.8,
    change_frequency: page?.change_frequency || "monthly",
    is_published: page?.is_published ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !page ? generateSlugFromTitle(title) : prev.slug,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Page Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter page title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="page-slug"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="path">Path</Label>
          <Input
            id="path"
            value={formData.path}
            onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
            placeholder="/page-path"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            value={formData.meta_description}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
            placeholder="SEO meta description for this page"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseFloat(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">1.0 (Highest)</SelectItem>
                <SelectItem value="0.9">0.9 (High)</SelectItem>
                <SelectItem value="0.8">0.8 (Medium-High)</SelectItem>
                <SelectItem value="0.7">0.7 (Medium)</SelectItem>
                <SelectItem value="0.6">0.6 (Medium-Low)</SelectItem>
                <SelectItem value="0.5">0.5 (Low)</SelectItem>
                <SelectItem value="0.3">0.3 (Lowest)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="change_frequency">Change Frequency</Label>
            <Select
              value={formData.change_frequency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, change_frequency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
          />
          <Label htmlFor="is_published">Published</Label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : page ? "Update Page" : "Create Page"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};