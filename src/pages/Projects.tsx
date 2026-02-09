import { useState, useMemo } from "react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectsSkeleton } from "@/components/PageSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ProjectCard } from "@/components/ProjectCard";
import { TechBadge } from "@/components/TechBadge";
import { FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 9;

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => p.tech_stack_tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    if (!activeFilter) return projects;
    return projects.filter((p) => p.tech_stack_tags.includes(activeFilter));
  }, [projects, activeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  function handleFilterClick(tag: string) {
    setActiveFilter((prev) => (prev === tag ? null : tag));
    setCurrentPage(1);
  }

  if (isLoading) return <ProjectsSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Projects</h1>
        <p className="text-muted-foreground">A collection of my work and side projects.</p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <TechBadge
              key={tag}
              name={tag}
              active={activeFilter === tag}
              onClick={() => handleFilterClick(tag)}
            />
          ))}
          {activeFilter && (
            <Button variant="ghost" size="sm" onClick={() => { setActiveFilter(null); setCurrentPage(1); }}>
              Clear
            </Button>
          )}
        </div>
      )}

      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description={activeFilter ? "No projects match this filter." : "Projects haven't been added yet."}
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center text-sm text-muted-foreground font-mono px-3">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </motion.div>
  );
}
