import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  display_order: number;
}

export function useEducation() {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("education")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data as Education[];
    },
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (edu: Omit<Education, "id">) => {
      const { error } = await (supabase as any).from("education").insert(edu);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast({ title: "Success", description: "Education added!" });
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("education").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast({ title: "Deleted", description: "Education removed!" });
    },
  });
}