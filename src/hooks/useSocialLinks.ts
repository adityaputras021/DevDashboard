import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  display_order: number;
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social_links"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("social_links")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as SocialLink[];
    },
  });
}

export function useCreateSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (link: Omit<SocialLink, "id">) => {
      const { error } = await (supabase as any).from("social_links").insert(link);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social_links"] });
      toast({ title: "Success", description: "Social link added!" });
    },
  });
}

export function useDeleteSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("social_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social_links"] });
      toast({ title: "Deleted", description: "Social link removed!" });
    },
  });
}