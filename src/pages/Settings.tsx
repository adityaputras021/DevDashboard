import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { SocialLinksManager } from "@/components/admin/SocialLinksManager";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { isAdmin, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your dashboard content.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="links">Social Links</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileEditor />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsManager />
        </TabsContent>

        <TabsContent value="links">
          <SocialLinksManager />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
