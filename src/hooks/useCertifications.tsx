import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_url: string | null;
  image_url: string | null;
  display_order: number;
}

export function useCertifications() {
  return useQuery({
    queryKey: ["certifications"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("certifications")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Certification[];
    },
  });
}

export function useCreateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cert: Omit<Certification, "id">) => {
      const { error } = await (supabase as any).from("certifications").insert(cert);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      toast({ title: "Success", description: "Certification added!" });
    },
  });
}

export function useDeleteCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("certifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      toast({ title: "Deleted", description: "Certification removed!" });
    },
  });
}