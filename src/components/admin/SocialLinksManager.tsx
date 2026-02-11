import { useState } from "react";
import { useSocialLinks, useCreateSocialLink, useDeleteSocialLink } from "@/hooks/useSocialLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SocialLinksManager() {
  const { data: socialLinks, isLoading } = useSocialLinks();
  const createLink = useCreateSocialLink();
  const deleteLink = useDeleteSocialLink();

  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLink.mutateAsync({
      platform,
      url,
      icon: null,
      display_order: 0,
    });
    
    setPlatform("");
    setUrl("");
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Social Links</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Social Link</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select value={platform} onValueChange={setPlatform} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GitHub">GitHub</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Youtube">Youtube</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createLink.isPending}>
                  {createLink.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Link
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {socialLinks && socialLinks.length > 0 ? (
          socialLinks.map((link) => (
            <Card key={link.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{link.platform}</h4>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {link.url}
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLink.mutate(link.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No social links added yet
          </p>
        )}
      </div>
    </div>
  );
}