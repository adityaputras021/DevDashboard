import { useProfile } from "@/hooks/useProfile";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { ProgressSkeleton } from "@/components/PageSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { StatCard } from "@/components/StatCard";
import { SocialLinkItem } from "@/components/SocialLinkItem";
import { TrendingUp, GitFork, Star, Users, BookOpen, Link as LinkIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
}

async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) throw new Error("Failed to fetch GitHub stats");
  const data = await res.json();

  // Fetch repos for star count
  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stargazers_count`);
  const repos = reposRes.ok ? await reposRes.json() : [];
  const total_stars = Array.isArray(repos)
    ? repos.reduce((sum: number, r: { stargazers_count: number }) => sum + r.stargazers_count, 0)
    : 0;

  return {
    public_repos: data.public_repos ?? 0,
    followers: data.followers ?? 0,
    following: data.following ?? 0,
    total_stars,
  };
}

export default function ProgressPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: socialLinks = [], isLoading: linksLoading } = useSocialLinks();

  const githubUsername = profile?.github_username || "";

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["github-stats", githubUsername],
    queryFn: () => fetchGitHubStats(githubUsername),
    enabled: !!githubUsername,
  });

  if (profileLoading || linksLoading) return <ProgressSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Progress</h1>
        <p className="text-muted-foreground">GitHub stats, learning profiles & social links.</p>
      </div>

      {/* GitHub Stats */}
      {githubUsername && (
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            GitHub Stats
          </h2>
          {statsLoading ? (
            <ProgressSkeleton />
          ) : stats ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Repositories" value={stats.public_repos} icon={GitFork} />
                <StatCard label="Stars" value={stats.total_stars} icon={Star} />
                <StatCard label="Followers" value={stats.followers} icon={Users} />
                <StatCard label="Following" value={stats.following} icon={BookOpen} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img
                  src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=transparent&hide_border=true&text_color=888&title_color=3b82f6&icon_color=3b82f6`}
                  alt="GitHub Stats"
                  className="w-full rounded-lg border border-border/50"
                  loading="lazy"
                />
                <img
                  src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=transparent&hide_border=true&text_color=888&title_color=3b82f6`}
                  alt="Top Languages"
                  className="w-full rounded-lg border border-border/50"
                  loading="lazy"
                />
              </div>
            </>
          ) : (
            <EmptyState
              icon={TrendingUp}
              title="No GitHub data"
              description="Could not load GitHub stats."
            />
          )}
        </section>
      )}

      {!githubUsername && (
        <EmptyState
          icon={TrendingUp}
          title="No GitHub username set"
          description="Set your GitHub username in Settings to see your stats here."
        />
      )}

      {/* Social Links */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
          Links & Profiles
        </h2>
        {socialLinks.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <SocialLinkItem key={link.id} link={link} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={LinkIcon}
            title="No social links"
            description="Social links haven't been added yet."
          />
        )}
      </section>
    </motion.div>
  );
}
