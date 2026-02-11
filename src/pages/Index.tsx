import { useProfile } from "@/hooks/useProfile";
import { useCertifications } from "@/hooks/useCertifications";
import { useEducation } from "@/hooks/useEducation";
import { useExperience } from "@/hooks/useExperience";
import { ProfileSkeleton } from "@/components/PageSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { Github, Linkedin, Twitter, Globe, Mail, Instagram } from "lucide-react";
import { TechBadge } from "@/components/TechBadge";
import { User, Award, GraduationCap, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: certifications } = useCertifications();
  const { data: education } = useEducation();
  const { data: experience } = useExperience();
  const { data: socialLinks } = useSocialLinks();  // ← TAMBAHKAN INI

  if (profileLoading) return <ProfileSkeleton />;

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
            {(profile.name || "??").slice(0, 2).toUpperCase()}
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

{socialLinks && socialLinks.length > 0 && (
  <section className="space-y-3">
    <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
      Connect
    </h2>
    <div className="flex flex-wrap gap-3">
      {socialLinks.map((link) => {
        const Icon = link.platform.toLowerCase() === 'github' ? Github :
                     link.platform.toLowerCase() === 'linkedin' ? Linkedin :
                     link.platform.toLowerCase() === 'twitter' ? Twitter :
                     link.platform.toLowerCase() === 'instagram' ? Instagram :
                     link.platform.toLowerCase() === 'email' ? Mail : Globe;

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{link.platform}</span>
          </a>
        );
      })}
    </div>
  </section>
)}
    
      {profile.tech_stack && profile.tech_stack.length > 0 && (
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

      {experience && experience.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <Card key={exp.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{exp.position}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {exp.company}
                    {exp.location ? ` • ${exp.location}` : ''}
                  </p>
                  {exp.start_date && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      {' - '}
                      {exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : 'Present')}
                    </p>
                  )}
                </CardHeader>
                {exp.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {education && education.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <Card key={edu.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{edu.degree}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {edu.institution}
                    {edu.field_of_study ? ` • ${edu.field_of_study}` : ''}
                  </p>
                  {(edu.start_date || edu.end_date) && (
                    <p className="text-xs text-muted-foreground">
                      {edu.start_date ? new Date(edu.start_date).getFullYear() : ''}
                      {edu.end_date ? ` - ${new Date(edu.end_date).getFullYear()}` : ''}
                    </p>
                  )}
                </CardHeader>
                {edu.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{edu.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {certifications && certifications.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((cert) => (
              <Card key={cert.id}>
                <CardHeader>
                  <CardTitle className="text-base">{cert.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  {cert.issue_date && (
                    <p className="text-xs text-muted-foreground">
                      Issued {new Date(cert.issue_date).toLocaleDateString()}
                    </p>
                  )}
                </CardHeader>
                {cert.credential_url && (
                <CardContent>
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View Credential
                  </a>
                </CardContent>
              )}
              </Card>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}