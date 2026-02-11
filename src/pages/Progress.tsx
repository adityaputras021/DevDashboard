import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, GitBranch, Star, Users, BookOpen, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GitHubStats {
  repos: number;
  stars: number;
  followers: number;
  following: number;
}

export default function Progress() {
  const { data: profile, isLoading } = useProfile();
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({
    stats: false,
    langs: false,
    streak: false,
    activity: false,
  });

  const githubUsername = profile?.github_username || "";

  useEffect(() => {
    if (githubUsername) {
      setLoadingStats(true);
      setError(false);
      
      fetch(`https://api.github.com/users/${githubUsername}`)
        .then(res => {
          if (!res.ok) throw new Error('User not found');
          return res.json();
        })
        .then(data => {
          setStats({
            repos: data.public_repos || 0,
            stars: 0,
            followers: data.followers || 0,
            following: data.following || 0,
          });
          setError(false);
        })
        .catch(() => {
          setError(true);
          setStats({ repos: 0, stars: 0, followers: 0, following: 0 });
        })
        .finally(() => setLoadingStats(false));
    } else {
      setLoadingStats(false);
    }
  }, [githubUsername]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!githubUsername) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Progress</h1>
          <p className="text-muted-foreground">GitHub stats & coding activity.</p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please add your GitHub username in <a href="/settings" className="underline">Settings</a> to see your stats.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Progress</h1>
        <p className="text-muted-foreground">
          GitHub stats for <span className="text-primary font-mono">@{githubUsername}</span>
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            GitHub username "{githubUsername}" not found. Please check your username in Settings.
          </AlertDescription>
        </Alert>
      )}

      {/* GitHub Stats Cards */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
          Overview
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {loadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.repos || 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Repositories</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {loadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.stars || 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Stars</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {loadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.followers || 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {loadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.following || 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GitHub Stats Images */}
<div className="grid gap-4 md:grid-cols-2">
<Card className="overflow-hidden border-muted/30 bg-card">
  <CardContent className="p-0 min-h-[195px] flex items-center justify-center">

      {!imagesLoaded.stats && (
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      )}
      <img
        // Tambahkan bg_color=0d1117 agar menyatu dengan kartu
        src={`https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${githubUsername}&theme=transparent&title_color=ffffff&text_color=ffffff`}
        alt="GitHub Stats"
        className={`w-full h-auto object-contain ${imagesLoaded.stats ? 'block' : 'hidden'}`}
        onLoad={() => setImagesLoaded(prev => ({ ...prev, stats: true }))}
        onError={(e) => {
          setImagesLoaded(prev => ({ ...prev, stats: true }));
          e.currentTarget.style.display = 'none';
        }}
      />
    </CardContent>
  </Card>

  <Card className="overflow-hidden border-muted/20">
    <CardContent className="p-0 bg-[#0d1117] min-h-[195px] flex items-center justify-center">
      {!imagesLoaded.langs && (
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      )}
      <img
        // Gunakan parameter warna yang sama dengan stats sebelumnya
        src={`https://github-readme-stats-eight-theta.vercel.app/api?username=${githubUsername}&show_icons=true&theme=dark&hide_border=true&bg_color=0d1117&title_color=58a6ff&icon_color=58a6ff&text_color=c9d1d9`}
        alt="Top Languages"
        className={`w-full h-auto object-contain ${imagesLoaded.langs ? 'block' : 'hidden'}`}
        onLoad={() => setImagesLoaded(prev => ({ ...prev, langs: true }))}
        onError={(e) => {
          setImagesLoaded(prev => ({ ...prev, langs: true }));
          e.currentTarget.style.display = 'none';
        }}
      />
    </CardContent>
  </Card>
</div>
        {/* GitHub Streak */}
        <Card className="overflow-hidden">
          <CardContent className="p-0 bg-[#0d1117] min-h-[200px] flex items-center justify-center">
            {!imagesLoaded.streak && (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            )}
            <img
              src={`https://streak-stats.demolab.com/?user=${githubUsername}&theme=dark&hide_border=true&background=0d1117&ring=58a6ff&fire=58a6ff&currStreakLabel=58a6ff&date_format=M%20j%5B%2C%20Y%5D`}
              alt="GitHub Streak"
              className={`w-full max-w-3xl ${imagesLoaded.streak ? 'block' : 'hidden'}`}
              onLoad={() => setImagesLoaded(prev => ({ ...prev, streak: true }))}
              onError={(e) => {
                setImagesLoaded(prev => ({ ...prev, streak: true }));
                e.currentTarget.style.display = 'none';
              }}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}