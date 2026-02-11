import { useState } from "react";
import { useCertifications, useCreateCertification, useDeleteCertification } from "@/hooks/useCertifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Plus } from "lucide-react";

export function CertificationsManager() {
  const { data: certifications, isLoading } = useCertifications();
  const createCertification = useCreateCertification();
  const deleteCertification = useDeleteCertification();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCertification.mutateAsync({
      title,
      issuer,
      issue_date: issueDate || null,
      credential_url: credentialUrl || null,
      image_url: null,
      display_order: 0,
    });
    
    // Reset form
    setTitle("");
    setIssuer("");
    setIssueDate("");
    setCredentialUrl("");
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
        <h3 className="text-lg font-semibold">Certifications</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Certification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuer *</Label>
                  <Input
                    id="issuer"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Amazon Web Services"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credentialUrl">Credential URL</Label>
                  <Input
                    id="credentialUrl"
                    value={credentialUrl}
                    onChange={(e) => setCredentialUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createCertification.isPending}>
                  {createCertification.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Certification
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-2 md:grid-cols-2">
        {certifications && certifications.length > 0 ? (
          certifications.map((cert) => (
            <Card key={cert.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{cert.title}</h4>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    {cert.issue_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Issued {new Date(cert.issue_date).toLocaleDateString()}
                      </p>
                    )}
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-1 inline-block"
                      >
                        View Credential
                      </a>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCertification.mutate(cert.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8 col-span-2">
            No certifications added yet
          </p>
        )}
      </div>
    </div>
  );
}