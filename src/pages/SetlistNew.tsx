import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useCreateSetlistMutation } from "@/hooks/useSetlists";

export function SetlistNew() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const createMutation = useCreateSetlistMutation(user?.uid);

  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !name.trim()) return;

    createMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: (setlistId) => {
          navigate({ to: "/setlists/$setlistId", params: { setlistId } });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <p className="text-muted-foreground py-12 text-center">Loading...</p>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>New setlist</CardTitle>
        <CardDescription>
          Create a setlist to group songs for practice or performance.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (required)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunday Service"
              required
              autoFocus
              aria-required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create setlist"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/setlists" })}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
