"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Kamus {
  id: string;
  templateFile: string;
  createdAt: string;
}

export default function SetupKamusPage() {
  const [items, setItems] = useState<Kamus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [templateFile, setTemplateFile] = useState<string>("");
  const [alert, setAlert] = useState<{ type: string; message: string }>({ type: "", message: "" });

  useEffect(() => {
    fetch("/api/kamus")
      .then((r) => r.json())
      .then((data: Kamus[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!templateFile.trim()) {
      setAlert({ type: "error", message: "Template file is required" });
      return;
    }

    try {
      const res = await fetch("/api/kamus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateFile }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit kamus");
      }

      const created: Kamus = await res.json();
      setItems((prev) => [created, ...prev]);
      setAlert({ type: "success", message: "Kamus Submitted" });
      setTemplateFile("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit kamus";
      setAlert({ type: "error", message });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="kamus-page-nav">Setup Kamus</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit dictionary entries using a predefined template
          </p>
        </div>
      </div>
      <Separator />

      {alert.message && (
        <div
          data-testid={alert.type === "success" ? "kamus-created-alert" : "kamus-error-alert"}
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
          <h2 className="text-lg font-semibold">Submit Kamus by Template</h2>
        </CardHeader>
        <CardContent>
          <form data-testid="kamus-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="templateFile" className="text-sm font-medium">
                Template File
              </label>
              <Input
                id="templateFile"
                name="templateFile"
                data-testid="kamus-template-input"
                placeholder="Enter template file name"
                value={templateFile}
                onChange={(e) => setTemplateFile(e.target.value)}
              />
            </div>
            <Button type="submit" data-testid="submit-kamus-btn">
              Submit Kamus
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Submitted Kamus</h2>
        </CardHeader>
        <CardContent>
          <div data-testid="kamus-list-container">
            {loading ? (
              <p data-testid="kamus-list-loading">Loading...</p>
            ) : items.length > 0 ? (
              <ul data-testid="kamus-list" className="space-y-2">
                {items.map((item: Kamus) => (
                  <li
                    key={item.id}
                    data-testid={`kamus-item-${item.id}`}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <span>{item.templateFile}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="kamus-list-empty" className="text-sm text-muted-foreground">
                No kamus entries found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
