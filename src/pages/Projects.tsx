import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Github } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { motion } from "framer-motion";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={Github}
        title="No projects yet"
        description="Projects haven't been added. If you're the admin, head to Settings to add some."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground">Showcase of my work and side projects.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
              {project.thumbnail_url && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {project.description}
                    </p>
                  )}
                  {project.tech_stack_tags && project.tech_stack_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack_tags.map((tech, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {project.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button size="sm" asChild>
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}