"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Kamus {
  id: string;
  templateFile: string;
  createdAt: string;
}

interface StandarJabatan {
  id: string;
  standard: string;
  createdAt: string;
}

interface Scenario {
  id: string;
  details: string;
  createdAt: string;
}

export default function KamusPotensiKompetensiPage() {
  const [kamusList, setKamusList] = useState<Kamus[]>([]);
  const [standarList, setStandarList] = useState<StandarJabatan[]>([]);
  const [scenarioList, setScenarioList] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/kamus").then((r) => r.json()),
      fetch("/api/standar").then((r) => r.json()),
      fetch("/api/scenario").then((r) => r.json()),
    ])
      .then(([kamus, standar, scenario]: [Kamus[], StandarJabatan[], Scenario[]]) => {
        setKamusList(kamus);
        setStandarList(standar);
        setScenarioList(scenario);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="kpk-page-nav">
            Kamus Potensi & Kompetensi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Insights on potential and competency measurements
          </p>
        </div>
      </div>
      <Separator />

      {loading ? (
        <p data-testid="kpk-loading">Loading...</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Kamus</h2>
                  <Badge variant="secondary">{kamusList.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div data-testid="kpk-kamus-container">
                  {kamusList.length > 0 ? (
                    <ul className="space-y-2">
                      {kamusList.map((item: Kamus) => (
                        <li key={item.id} className="rounded-md border p-2 text-sm">
                          {item.templateFile}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No kamus entries</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Standar Jabatan</h2>
                  <Badge variant="secondary">{standarList.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div data-testid="kpk-standar-container">
                  {standarList.length > 0 ? (
                    <ul className="space-y-2">
                      {standarList.map((item: StandarJabatan) => (
                        <li key={item.id} className="rounded-md border p-2 text-sm">
                          {item.standard}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No standards</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Scenario</h2>
                  <Badge variant="secondary">{scenarioList.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div data-testid="kpk-scenario-container">
                  {scenarioList.length > 0 ? (
                    <ul className="space-y-2">
                      {scenarioList.map((item: Scenario) => (
                        <li key={item.id} className="rounded-md border p-2 text-sm">
                          {item.details}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No scenarios</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Summary</h2>
            </CardHeader>
            <CardContent>
              <div data-testid="kpk-summary" className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md border p-4 text-center">
                  <p className="text-3xl font-bold">{kamusList.length}</p>
                  <p className="text-sm text-muted-foreground">Total Kamus</p>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-3xl font-bold">{standarList.length}</p>
                  <p className="text-sm text-muted-foreground">Total Standar</p>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-3xl font-bold">{scenarioList.length}</p>
                  <p className="text-sm text-muted-foreground">Total Scenario</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
