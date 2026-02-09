import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Globe,
  Mail,
  Youtube,
  Link as LinkIcon,
} from "lucide-react";
import type { SocialLink } from "@/hooks/useSocialLinks";

const iconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  globe: Globe,
  mail: Mail,
  youtube: Youtube,
  link: LinkIcon,
};

interface SocialLinkItemProps {
  link: SocialLink;
}

export function SocialLinkItem({ link }: SocialLinkItemProps) {
  const Icon = iconMap[link.icon] || LinkIcon;

  return (
    <Button variant="outline" size="sm" className="gap-2" asChild>
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        <Icon className="h-4 w-4" />
        {link.platform}
      </a>
    </Button>
  );
}
