import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function ProfileEditor() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [bio, setBio] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setRoleTitle(profile.role_title);
      setBio(profile.bio);
      setTechStack(profile.tech_stack.join(", "));
      setGithubUsername(profile.github_username);
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(urlData.publicUrl);
    setUploading(false);
  }

  function handleSave() {
    if (!profile) return;

    const techArray = techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    updateProfile.mutate({
      id: profile.id,
      name,
      role_title: roleTitle,
      bio,
      tech_stack: techArray,
      github_username: githubUsername,
      avatar_url: avatarUrl,
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-muted-foreground">No profile found. Please sign up first.</p>;
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback className="font-mono">{(name || "??").slice(0, 2).toUpperCase()}</AvatarFallback>          </Avatar>
          <div>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild disabled={uploading}>
                <span>
                  {uploading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  {uploading ? "Uploading..." : "Upload Photo"}
                </span>
              </Button>
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role / Title</Label>
            <Input id="role" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="e.g. C# Developer" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tech-stack">Tech Stack (comma-separated)</Label>
          <Input id="tech-stack" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, TypeScript, C#, PostgreSQL" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub Username</Label>
          <Input id="github" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="octocat" />
        </div>

        <Button onClick={handleSave} disabled={updateProfile.isPending}>
          {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
