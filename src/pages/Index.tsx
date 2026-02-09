import { useProfile } from "@/hooks/useProfile";
import { ProfileSkeleton } from "@/components/PageSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { TechBadge } from "@/components/TechBadge";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <EmptyState
        icon={User}
        title="No profile yet"
        description="The profile hasn't been set up. If you're the admin, head to Settings to create one."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <section className="flex flex-col sm:flex-row items-start gap-6">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.name} />
          <AvatarFallback className="text-2xl font-mono">
            {profile.name?.slice(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{profile.name || "Unnamed"}</h1>
          {profile.role_title && (
            <p className="text-lg text-primary font-mono font-medium">{profile.role_title}</p>
          )}
        </div>
      </section>

      {profile.bio && (
        <section>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">{profile.bio}</p>
        </section>
      )}

      {profile.tech_stack.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.tech_stack.map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
