import { Badge } from "@/components/ui/badge";

interface TechBadgeProps {
  name: string;
  onClick?: () => void;
  active?: boolean;
}

export function TechBadge({ name, onClick, active }: TechBadgeProps) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={`font-mono text-xs cursor-${onClick ? "pointer" : "default"} transition-colors`}
      onClick={onClick}
    >
      {name}
    </Badge>
  );
}
