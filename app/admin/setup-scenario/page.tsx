"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Scenario {
  id: string;
  details: string;
  createdAt: string;
}

export default function SetupScenarioPage() {
  const [items, setItems] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [details, setDetails] = useState<string>("");
  const [alert, setAlert] = useState<{ type: string; message: string }>({ type: "", message: "" });

  useEffect(() => {
    fetch("/api/scenario")
      .then((r) => r.json())
      .then((data: Scenario[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!details.trim()) {
      setAlert({ type: "error", message: "Scenario details are required" });
      return;
    }

    try {
      const res = await fetch("/api/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit scenario");
      }

      const created: Scenario = await res.json();
      setItems((prev) => [created, ...prev]);
      setAlert({ type: "success", message: "Scenario Submitted" });
      setDetails("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit scenario";
      setAlert({ type: "error", message });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="scenario-page-nav">Setup Scenario</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit scenario entries
          </p>
        </div>
      </div>
      <Separator />

      {alert.message && (
        <div
          data-testid={alert.type === "success" ? "scenario-created-alert" : "scenario-error-alert"}
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
          <h2 className="text-lg font-semibold">Submit Scenario</h2>
        </CardHeader>
        <CardContent>
          <form data-testid="scenario-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="details" className="text-sm font-medium">
                Scenario Details
              </label>
              <Input
                id="details"
                name="details"
                data-testid="scenario-input"
                placeholder="Enter scenario details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
            <Button type="submit" data-testid="submit-scenario-btn">
              Submit Scenario
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Submitted Scenarios</h2>
        </CardHeader>
        <CardContent>
          <div data-testid="scenario-list-container">
            {loading ? (
              <p data-testid="scenario-list-loading">Loading...</p>
            ) : items.length > 0 ? (
              <ul data-testid="scenario-list" className="space-y-2">
                {items.map((item: Scenario) => (
                  <li
                    key={item.id}
                    data-testid={`scenario-item-${item.id}`}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <span>{item.details}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="scenario-list-empty" className="text-sm text-muted-foreground">
                No scenarios found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
