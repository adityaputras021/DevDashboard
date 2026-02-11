import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack_tags: string[];
  github_url: string | null;
  demo_url: string | null;
  thumbnail_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Omit<Project, "id" | "created_at" | "updated_at">) => {
      console.log("Sending project:", project); // DEBUG
      const { data, error } = await (supabase as any).from("projects").insert(project).select();
      if (error) {
        console.error("Insert error:", error); // DEBUG
        throw error;
      }
      console.log("Insert success:", data); // DEBUG
      return data;
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Deleted", description: "Project removed!" });
    },
  });
}