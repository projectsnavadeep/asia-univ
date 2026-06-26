"use client";

import React, { useMemo } from "react";
import { MOCK_UNIVERSITIES } from "../data";
import {
  GraduationCap,
  BarChart3,
  Award,
  TrendingUp,
} from "lucide-react";

// ── Vibrant color palette ──
const COLORS = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  pink: "#ec4899",
  cyan: "#06b6d4",
  indigo: "#6366f1",
};

const COUNTRY_COLORS: Record<string, string> = {
  India: COLORS.green,
  China: COLORS.red,
  Japan: COLORS.blue,
  "South Korea": COLORS.purple,
  Singapore: COLORS.amber,
  "Hong Kong": COLORS.pink,
  Malaysia: COLORS.cyan,
  Uzbekistan: COLORS.indigo,
};

function useAnalytics() {
  return useMemo(() => {
    const unis = MOCK_UNIVERSITIES;
    const count = unis.length;

    const avgOverall = +(unis.reduce((s, u) => s + u.overall, 0) / count).toFixed(1);
    const avgCitations = +(unis.reduce((s, u) => s + u.citations, 0) / count).toFixed(1);
    const avgEmployability = +(unis.reduce((s, u) => s + u.employability, 0) / count).toFixed(1);
    const medCount = unis.filter((u) => u.hasMedicine).length;
    const medPct = +((medCount / count) * 100).toFixed(0);

    const keyCountries = ["China", "Japan", "India", "South Korea", "Singapore"];
    const regionMap: Record<string, { count: number; totalScore: number; totalCitations: number; totalResearch: number; totalTeaching: number }> = {};
    unis.forEach((u) => {
      const country = keyCountries.includes(u.location) ? u.location : null;
      if (!country) return;
      if (!regionMap[country]) regionMap[country] = { count: 0, totalScore: 0, totalCitations: 0, totalResearch: 0, totalTeaching: 0 };
      regionMap[country].count++;
      regionMap[country].totalScore += u.overall;
      regionMap[country].totalCitations += u.citations;
      regionMap[country].totalResearch += u.research;
      regionMap[country].totalTeaching += u.teaching;
    });

    const countryData = keyCountries
      .filter((c) => regionMap[c])
      .map((country) => {
        const d = regionMap[country];
        return {
          country,
          institutions: d.count,
          avgScore: +(d.totalScore / d.count).toFixed(1),
          avgResearch: +(d.totalResearch / d.count).toFixed(1),
          avgCitations: +(d.totalCitations / d.count).toFixed(1),
          fill: COUNTRY_COLORS[country] || COLORS.blue,
        };
      });

    const radarData = [
      { metric: "Teaching", value: +(unis.reduce((s, u) => s + u.teaching, 0) / count).toFixed(1) },
      { metric: "Research", value: +(unis.reduce((s, u) => s + u.research, 0) / count).toFixed(1) },
      { metric: "Citations", value: +(unis.reduce((s, u) => s + u.citations, 0) / count).toFixed(1) },
      { metric: "Employability", value: +(unis.reduce((s, u) => s + u.employability, 0) / count).toFixed(1) },
      { metric: "Int'l Students", value: +(unis.reduce((s, u) => s + u.intlStudents, 0) / count).toFixed(1) },
    ];

    const sortedCountries = [...countryData].sort((a, b) => b.avgScore - a.avgScore);
    const topCountry = sortedCountries[0]?.country || "Asia";
    const researchLeader = [...countryData].sort((a, b) => b.avgResearch - a.avgResearch)[0]?.country || "Asia";
    const topInstitutions = [...countryData].sort((a, b) => b.institutions - a.institutions)[0]?.country || "Asia";

    return { count, avgOverall, avgCitations, avgEmployability, medCount, medPct, countryData, radarData, topCountry, researchLeader, topInstitutions };
  }, []);
}

export default function AnalyticsDashboard() {
  const a = useAnalytics();

  // Always light mode colors for charts
  const gridColor = "rgba(203, 213, 225, 0.6)";
  const textColor = "#64748b";
  const axisColor = "#e2e8f0";

  return (
    <div className="w-full space-y-6">

      {/* ── Header ── */}
      <div className="relative overflow-hidden p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-amber-50/40 to-white shadow-sm">
        <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-sky-100/50 blur-3xl" />
        <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
          Academic Intelligence
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
          Institutional Analytics Hub
        </h2>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
          Real-time aggregated insights from{" "}
          <strong className="text-slate-900">{a.count} audited institutions</strong>{" "}
          across Asia — derived from QS-methodology scoring data.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Institutions",
            val: String(a.count),
            desc: "Audited & Verified",
            icon: GraduationCap,
            accent: "#3b82f6",
            border: "#bfdbfe",
            bg: "#eff6ff",
          },
          {
            title: "Avg. Score",
            val: `${a.avgOverall}%`,
            desc: `Citations: ${a.avgCitations}%`,
            icon: BarChart3,
            accent: "#10b981",
            border: "#a7f3d0",
            bg: "#f0fdf4",
          },
          {
            title: "Employability",
            val: `${a.avgEmployability}%`,
            desc: "Employer reputation",
            icon: TrendingUp,
            accent: "#f97316",
            border: "#fed7aa",
            bg: "#fff7ed",
          },
          {
            title: "Medicine",
            val: `${a.medPct}%`,
            desc: `${a.medCount} institutions`,
            icon: Award,
            accent: "#8b5cf6",
            border: "#ddd6fe",
            bg: "#f5f3ff",
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="p-4 rounded-2xl border bg-gradient-to-br from-white via-slate-50 to-white shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl motion-safe:transform-gpu"
            style={{ borderColor: stat.border, backgroundColor: stat.bg }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.title}</span>
              <stat.icon className="h-5 w-5 opacity-70" style={{ color: stat.accent }} />
            </div>
            <span className="text-2xl font-bold text-slate-900 block">{stat.val}</span>
            <span className="text-[11px] text-slate-400 mt-1 block">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* ── Country Performance ── */}
      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">
              Country Performance
            </span>
            <p className="text-sm text-slate-500 max-w-xl">
              A horizontal overview of top regional performance and average scores in audited markets.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">
            Live market pulse
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="flex min-w-full gap-3 py-2">
            {a.countryData.map((entry) => (
              <div key={entry.country} className="min-w-[220px] rounded-3xl border border-slate-100 bg-gradient-to-b from-white via-slate-50 to-slate-100 p-4 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg motion-safe:transform-gpu">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 items-center justify-center rounded-full border border-slate-200" style={{ backgroundColor: entry.fill }} />
                    <span className="font-semibold text-slate-900">{entry.country}</span>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">{entry.institutions} unis</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2 font-semibold text-slate-900">
                      <span>Avg score</span>
                      <span>{entry.avgScore}%</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2 font-semibold text-slate-900">
                      <span>Avg research</span>
                      <span>{entry.avgResearch}%</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2 font-semibold text-slate-900">
                      <span>Avg citations</span>
                      <span>{entry.avgCitations}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Intelligence Highlights ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 p-6 rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-slate-500">
            Intelligence Highlights
          </span>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">
            Institutional analytics made actionable
          </h3>
          <p className="mt-3 text-sm text-slate-600 max-w-2xl leading-6">
            A concise executive summary crafted to support leadership decisions, without visual clutter. Focused on market strength, research leadership, and program trends.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Top quality market",
                value: a.topCountry,
                detail: "Highest average institutional score",
              },
              {
                title: "Research leader",
                value: a.researchLeader,
                detail: "Strongest average research impact",
              },
              {
                title: "Largest cluster",
                value: a.topInstitutions,
                detail: "Most audited institutions",
              },
              {
                title: "Medicine coverage",
                value: `${a.medPct}% of institutions`,
                detail: "Presence of medicine programs in the dataset",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl motion-safe:transform-gpu">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-slate-400">{item.title}</p>
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">Insight</span>
                </div>
                <p className="mt-3 text-xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-500">
                Section pulse
              </span>
              <h4 className="mt-2 text-lg font-semibold text-slate-900">Snapshot of the latest analytics</h4>
            </div>
            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700">
              Updated daily
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg motion-safe:transform-gpu">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">Audited institutions</p>
                <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-700">Live</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-900">{a.count}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg motion-safe:transform-gpu">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">Average employability</p>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">Stable</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-900">{a.avgEmployability}%</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg motion-safe:transform-gpu">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">Average score</p>
                <span className="rounded-full bg-sky-100 px-2 py-1 text-[11px] font-semibold text-sky-700">Benchmark</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-900">{a.avgOverall}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Country Summary Table ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Country Intelligence Summary
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Country", "Universities", "Avg Score", "Avg Citations", "Avg Research"].map((h) => (
                  <th key={h} className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {a.countryData.map((r) => (
                <tr key={r.country} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-5 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.fill }} />
                      {r.country}
                    </div>
                  </td>
                  <td className="py-3 px-5 font-mono text-slate-600">{r.institutions}</td>
                  <td className="py-3 px-5">
                    <span
                      className="font-mono font-bold"
                      style={{ color: r.avgScore >= 80 ? "#16a34a" : r.avgScore >= 65 ? "#d97706" : "#dc2626" }}
                    >
                      {r.avgScore}%
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono text-slate-600">{r.avgCitations}%</td>
                  <td className="py-3 px-5 font-mono text-slate-600">{r.avgResearch}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
