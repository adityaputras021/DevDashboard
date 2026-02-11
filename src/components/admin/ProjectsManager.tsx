import { useState } from "react";
import { useProjects, useCreateProject, useDeleteProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Plus, ExternalLink } from "lucide-react";

export function ProjectsManager() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const techArray = techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await createProject.mutateAsync({
      title,
      description: description || null,
      tech_stack_tags: techArray,
      github_url: githubUrl || null,
      demo_url: demoUrl || null,
      thumbnail_url: thumbnailUrl || null,
      display_order: 0,
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setTechStack("");
    setGithubUrl("");
    setDemoUrl("");
    setThumbnailUrl("");
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Project"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your project..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                <Input
                  id="techStack"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input
                    id="demoUrl"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://demo.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createProject.isPending}>
                  {createProject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Project
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id}>
              {project.thumbnail_url && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{project.title}</h4>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    )}
                    {project.tech_stack_tags && project.tech_stack_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tech_stack_tags.map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          GitHub <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          Live Demo <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteProject.mutate(project.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8 col-span-2">
            No projects added yet
          </p>
        )}
      </div>
    </div>
  );
}