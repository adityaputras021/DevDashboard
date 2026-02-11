import { useState } from "react";
import { useExperience, useCreateExperience, useDeleteExperience } from "@/hooks/useExperience";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash2, Plus } from "lucide-react";

export function ExperienceManager() {
  const { data: experiences, isLoading } = useExperience();
  const createExperience = useCreateExperience();
  const deleteExperience = useDeleteExperience();

  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createExperience.mutateAsync({
      company,
      position,
      location: location || null,
      start_date: startDate || null,
      end_date: isCurrent ? null : (endDate || null),
      is_current: isCurrent,
      description: description || null,
      display_order: 0,
    });
    
    // Reset form
    setCompany("");
    setPosition("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setDescription("");
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
        <h3 className="text-lg font-semibold">Experience</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isCurrent}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current"
                  checked={isCurrent}
                  onCheckedChange={(checked) => setIsCurrent(checked as boolean)}
                />
                <Label htmlFor="current" className="cursor-pointer">
                  I currently work here
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createExperience.isPending}>
                  {createExperience.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Experience
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
        {experiences && experiences.length > 0 ? (
          experiences.map((exp) => (
            <Card key={exp.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{exp.position}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </p>
                    {exp.start_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        {" - "}
                        {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present"}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-sm mt-2">{exp.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteExperience.mutate(exp.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No experience added yet
          </p>
        )}
      </div>
    </div>
  );
}