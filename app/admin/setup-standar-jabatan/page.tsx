"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface StandarJabatan {
  id: string;
  standard: string;
  createdAt: string;
}

export default function SetupStandarJabatanPage() {
  const [items, setItems] = useState<StandarJabatan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [standard, setStandard] = useState<string>("");
  const [alert, setAlert] = useState<{ type: string; message: string }>({ type: "", message: "" });

  useEffect(() => {
    fetch("/api/standar")
      .then((r) => r.json())
      .then((data: StandarJabatan[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!standard.trim()) {
      setAlert({ type: "error", message: "Job standard is required" });
      return;
    }

    try {
      const res = await fetch("/api/standar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standard }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit standar");
      }

      const created: StandarJabatan = await res.json();
      setItems((prev) => [created, ...prev]);
      setAlert({ type: "success", message: "Standar Submitted" });
      setStandard("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit standar";
      setAlert({ type: "error", message });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="standar-page-nav">Setup Standar Jabatan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit job standard entries
          </p>
        </div>
      </div>
      <Separator />

      {alert.message && (
        <div
          data-testid={alert.type === "success" ? "standar-created-alert" : "standar-error-alert"}
          className={`rounded-md p-4 text-sm ${
            alert.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {alert.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Submit Job Standard</h2>
        </CardHeader>
        <CardContent>
          <form data-testid="standar-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="standard" className="text-sm font-medium">
                Job Standard
              </label>
              <Input
                id="standard"
                name="standard"
                data-testid="standar-input"
                placeholder="Enter job standard"
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
              />
            </div>
            <Button type="submit" data-testid="submit-standar-btn">
              Submit Standar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Submitted Standards</h2>
        </CardHeader>
        <CardContent>
          <div data-testid="standar-list-container">
            {loading ? (
              <p data-testid="standar-list-loading">Loading...</p>
            ) : items.length > 0 ? (
              <ul data-testid="standar-list" className="space-y-2">
                {items.map((item: StandarJabatan) => (
                  <li
                    key={item.id}
                    data-testid={`standar-item-${item.id}`}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <span>{item.standard}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="standar-list-empty" className="text-sm text-muted-foreground">
                No standards found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
