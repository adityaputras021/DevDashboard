import { useState } from "react";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  type Project,
} from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProjectFormData {
  title: string;
  description: string;
  tech_stack_tags: string;
  github_url: string;
  demo_url: string;
  thumbnail_url: string;
  display_order: number;
}

const emptyForm: ProjectFormData = {
  title: "",
  description: "",
  tech_stack_tags: "",
  github_url: "",
  demo_url: "",
  thumbnail_url: "",
  display_order: 0,
};

export function ProjectsManager() {
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [form, setForm] = useState<ProjectFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEdit(project: Project) {
    setForm({
      title: project.title,
      description: project.description,
      tech_stack_tags: project.tech_stack_tags.join(", "),
      github_url: project.github_url || "",
      demo_url: project.demo_url || "",
      thumbnail_url: project.thumbnail_url || "",
      display_order: project.display_order,
    });
    setEditingId(project.id);
    setDialogOpen(true);
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("project-thumbnails")
      .upload(path, file, { upsert: true });

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("project-thumbnails").getPublicUrl(path);
    setForm((prev) => ({ ...prev, thumbnail_url: urlData.publicUrl }));
    setUploading(false);
  }

  function handleSubmit() {
    if (!form.title.trim()) {
      toast({ title: "Title required", description: "Please enter a project title.", variant: "destructive" });
      return;
    }

    const tags = form.tech_stack_tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      description: form.description,
      tech_stack_tags: tags,
      github_url: form.github_url || null,
      demo_url: form.demo_url || null,
      thumbnail_url: form.thumbnail_url || null,
      display_order: form.display_order,
    };

    if (editingId) {
      updateProject.mutate({ id: editingId, ...payload }, {
        onSuccess: () => setDialogOpen(false),
      });
    } else {
      createProject.mutate(payload, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects ({projects.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Tech Stack (comma-separated)</Label>
                <Input value={form.tech_stack_tags} onChange={(e) => setForm((p) => ({ ...p, tech_stack_tags: e.target.value }))} placeholder="React, TypeScript" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input value={form.github_url} onChange={(e) => setForm((p) => ({ ...p, github_url: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Demo URL</Label>
                  <Input value={form.demo_url} onChange={(e) => setForm((p) => ({ ...p, demo_url: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <div className="flex items-center gap-2">
                  <Input value={form.thumbnail_url} onChange={(e) => setForm((p) => ({ ...p, thumbnail_url: e.target.value }))} placeholder="URL or upload" className="flex-1" />
                  <Label htmlFor="thumb-upload" className="cursor-pointer">
                    <Button variant="outline" size="icon" asChild disabled={uploading}>
                      <span>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}</span>
                    </Button>
                  </Label>
                  <input id="thumb-upload" type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                </div>
                {form.thumbnail_url && (
                  <img src={form.thumbnail_url} alt="Thumbnail preview" className="mt-2 h-24 w-auto rounded border border-border" />
                )}
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createProject.isPending || updateProject.isPending}
                className="w-full"
              >
                {(createProject.isPending || updateProject.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {projects.map((project) => (
          <Card key={project.id} className="border-border/50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 min-w-0">
                {project.thumbnail_url && (
                  <img src={project.thumbnail_url} alt="" className="h-10 w-14 rounded object-cover border border-border/50" />
                )}
                <div className="min-w-0">
                  <p className="font-medium truncate">{project.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">Order: {project.display_order}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(project)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{project.title}"?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteProject.mutate(project.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
