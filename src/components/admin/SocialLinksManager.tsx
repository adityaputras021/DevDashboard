import { useState } from "react";
import {
  useSocialLinks,
  useCreateSocialLink,
  useUpdateSocialLink,
  useDeleteSocialLink,
  type SocialLink,
} from "@/hooks/useSocialLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ICON_OPTIONS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "globe", label: "Website" },
  { value: "mail", label: "Email" },
  { value: "link", label: "Other" },
];

interface LinkFormData {
  platform: string;
  url: string;
  icon: string;
  display_order: number;
}

const emptyForm: LinkFormData = {
  platform: "",
  url: "",
  icon: "link",
  display_order: 0,
};

export function SocialLinksManager() {
  const { data: links = [], isLoading } = useSocialLinks();
  const createLink = useCreateSocialLink();
  const updateLink = useUpdateSocialLink();
  const deleteLink = useDeleteSocialLink();

  const [form, setForm] = useState<LinkFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEdit(link: SocialLink) {
    setForm({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      display_order: link.display_order,
    });
    setEditingId(link.id);
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!form.platform.trim() || !form.url.trim()) {
      toast({
        title: "Required fields",
        description: "Please enter a platform name and URL.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateLink.mutate({ id: editingId, ...form }, {
        onSuccess: () => setDialogOpen(false),
      });
    } else {
      createLink.mutate(form, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Social Links ({links.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Link" : "New Link"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Platform Name *</Label>
                <Input
                  value={form.platform}
                  onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
                  placeholder="e.g. LinkedIn"
                />
              </div>
              <div className="space-y-2">
                <Label>URL *</Label>
                <Input
                  value={form.url}
                  onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={form.icon} onValueChange={(v) => setForm((p) => ({ ...p, icon: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createLink.isPending || updateLink.isPending}
                className="w-full"
              >
                {(createLink.isPending || updateLink.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Add Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {links.map((link) => (
          <Card key={link.id} className="border-border/50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="min-w-0">
                <p className="font-medium">{link.platform}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link.url}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(link)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{link.platform}"?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteLink.mutate(link.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
