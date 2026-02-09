import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/TechBadge";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/hooks/useProjects";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      {project.thumbnail_url && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      {!project.thumbnail_url && (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <span className="text-muted-foreground font-mono text-sm">No preview</span>
        </div>
      )}
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg leading-tight">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack_tags.map((tag) => (
            <TechBadge key={tag} name={tag} />
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        {project.github_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-1.5 h-3.5 w-3.5" />
              Code
            </a>
          </Button>
        )}
        {project.demo_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
