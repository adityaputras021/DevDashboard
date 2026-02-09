import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social_links"],
    queryFn: async (): Promise<SocialLink[]> => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data as SocialLink[]) ?? [];
    },
  });
}

export function useCreateSocialLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: Omit<SocialLink, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("social_links")
        .insert(link)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social_links"] });
      toast({ title: "Link added", description: "Social link has been created." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateSocialLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<SocialLink> & { id: string }) => {
      const { id, ...rest } = updates;
      const { data, error } = await supabase
        .from("social_links")
        .update(rest)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social_links"] });
      toast({ title: "Link updated", description: "Social link has been saved." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteSocialLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social_links"] });
      toast({ title: "Link deleted", description: "Social link has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
