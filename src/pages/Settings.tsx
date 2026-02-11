import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Loader2 } from "lucide-react";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { EducationManager } from "@/components/admin/EducationManager";
import { CertificationsManager } from "@/components/admin/CertificationsManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { SocialLinksManager } from "@/components/admin/SocialLinksManager";

const Settings = () => {
  const { user, signOut, isAdmin, isLoading: authLoading } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please login to access settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/auth"} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        {isAdmin && (
          <div className="flex items-center gap-2 mt-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Admin Access</span>
          </div>
        )}
      </div>

      {!isAdmin && (
        <Alert className="mb-6">
          <AlertDescription>
            You need admin access to edit the portfolio. Contact the site administrator.
          </AlertDescription>
        </Alert>
      )}

      {isAdmin ? (
        <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>
      
        <TabsContent value="profile">
          <ProfileEditor />
        </TabsContent>
      
        <TabsContent value="experience">
          <Card>
            <CardContent className="pt-6">
              <ExperienceManager />
            </CardContent>
          </Card>
        </TabsContent>
      
        <TabsContent value="education">
          <Card>
            <CardContent className="pt-6">
              <EducationManager />
            </CardContent>
          </Card>
        </TabsContent>
      
        <TabsContent value="certifications">
          <Card>
            <CardContent className="pt-6">
              <CertificationsManager />
            </CardContent>
          </Card>
        </TabsContent>
      
        <TabsContent value="projects">
          <Card>
            <CardContent className="pt-6">
              <ProjectsManager />
            </CardContent>
          </Card>
        </TabsContent>
      
        <TabsContent value="social">
          <Card>
            <CardContent className="pt-6">
              <SocialLinksManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      ) : null}

      {/* Account Settings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <Label>Role</Label>
            <p className="text-sm">
              {isAdmin ? (
                <Badge variant="default">Admin</Badge>
              ) : (
                <Badge variant="secondary">User</Badge>
              )}
            </p>
          </div>
          <Button variant="destructive" onClick={signOut}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;