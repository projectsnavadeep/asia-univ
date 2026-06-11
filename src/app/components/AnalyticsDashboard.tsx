"use client";

import React, { useMemo } from "react";
import { BarChart3, GraduationCap, HeartPulse, MapPinned } from "lucide-react";
import { MOCK_UNIVERSITIES } from "../data";

export default function AnalyticsDashboard() {
  const analytics = useMemo(() => {
    const total = MOCK_UNIVERSITIES.length;
    const averageScore =
      MOCK_UNIVERSITIES.reduce((sum, uni) => sum + uni.overall, 0) / total;
    const medicineCount = MOCK_UNIVERSITIES.filter((uni) => uni.hasMedicine).length;
    const countryCount = new Set(MOCK_UNIVERSITIES.map((uni) => uni.location)).size;
    const topCountries = Array.from(
      MOCK_UNIVERSITIES.reduce((map, uni) => {
        map.set(uni.location, (map.get(uni.location) ?? 0) + 1);
        return map;
      }, new Map<string, number>())
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { total, averageScore, medicineCount, countryCount, topCountries };
  }, []);

  const stats = [
    {
      title: "Index Institutions",
      value: analytics.total,
      detail: "Audited university records",
      icon: GraduationCap,
    },
    {
      title: "Average Score",
      value: analytics.averageScore.toFixed(1),
      detail: "Overall ranking mean",
      icon: BarChart3,
    },
    {
      title: "Medical Programs",
      value: analytics.medicineCount,
      detail: "Medicine-ready institutions",
      icon: HeartPulse,
    },
    {
      title: "Countries",
      value: analytics.countryCount,
      detail: "Regional coverage",
      icon: MapPinned,
    },
  ];

  return (
    <div className="p-6 border border-slate-200 dark:border-cyber-border rounded-xl bg-slate-50/50 dark:bg-cyber-dark/40 shadow-sm space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-cyber-yellow">
          Academic Intelligence
        </span>
        <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
          Institutional Analytics Hub
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Live summary of ranking metrics across the current university dataset.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="p-4 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-cyber-gray rounded-lg shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                  {stat.title}
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">
                  {stat.value}
                </span>
              </div>
              <stat.icon className="h-5 w-5 text-amber-700 dark:text-cyber-yellow" />
            </div>
            <span className="text-[9px] text-slate-400 dark:text-slate-550 block mt-2">
              {stat.detail}
            </span>
          </div>
        ))}
      </div>

      <div className="border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-cyber-gray rounded-lg p-4">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-4">
          Country Distribution
        </span>
        <div className="space-y-3">
          {analytics.topCountries.map(([country, count]) => {
            const width = `${Math.max(8, (count / analytics.total) * 100)}%`;
            return (
              <div key={country} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {country}
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {count}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-700 dark:bg-cyber-yellow rounded-full"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
