import { useState } from "react";
import { useEducation, useCreateEducation, useDeleteEducation } from "@/hooks/useEducation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Plus } from "lucide-react";

export function EducationManager() {
  const { data: educations, isLoading } = useEducation();
  const createEducation = useCreateEducation();
  const deleteEducation = useDeleteEducation();

  const [showForm, setShowForm] = useState(false);
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEducation.mutateAsync({
      institution,
      degree,
      field_of_study: fieldOfStudy || null,
      start_date: startDate || null,
      end_date: endDate || null,
      description: description || null,
      display_order: 0,
    });
    
    // Reset form
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setStartDate("");
    setEndDate("");
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
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Education</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree *</Label>
                  <Input
                    id="degree"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="Bachelor of Science"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Input
                  id="fieldOfStudy"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="Computer Science"
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
                  />
                </div>
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
                <Button type="submit" disabled={createEducation.isPending}>
                  {createEducation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Education
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
        {educations && educations.length > 0 ? (
          educations.map((edu) => (
            <Card key={edu.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution} {edu.field_of_study && `• ${edu.field_of_study}`}
                    </p>
                    {(edu.start_date || edu.end_date) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {edu.start_date && new Date(edu.start_date).getFullYear()}
                        {edu.end_date && ` - ${new Date(edu.end_date).getFullYear()}`}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-sm mt-2">{edu.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEducation.mutate(edu.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No education added yet
          </p>
        )}
      </div>
    </div>
  );
}