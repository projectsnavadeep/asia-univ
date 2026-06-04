"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, BookOpen, GraduationCap, ChevronRight, MapPin, Star } from "lucide-react";
import { MOCK_UNIVERSITIES, FEATURED_ARTICLES, University, Article } from "../data";

type SuggestionPick =
  | { kind: "uni"; uni: University }
  | { kind: "article"; article: Article }
  | { kind: "view-all" };

function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-100 text-amber-900 dark:bg-cyber-yellow/20 dark:text-cyber-yellow px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

interface HomepageProps {
  onSearchSubmit: (query: string) => void;
  onUniversitySelect: (id: string) => void;
  onArticleSelect: (article: Article) => void;
  onViewChange: (view: string) => void;
}

export default function Homepage({
  onSearchSubmit,
  onUniversitySelect,
  onArticleSelect,
  onViewChange,
}: HomepageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{
    universities: University[];
    articles: Article[];
  }>({ universities: [], articles: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<"overall" | "research" | "employability">("overall");

  const suggestionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search auto-suggestions
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions({ universities: [], articles: [] });
      return;
    }

    const filteredUnis = MOCK_UNIVERSITIES.filter(
      (uni) =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.subjects.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5);

    const filteredArticles = FEATURED_ARTICLES.filter(
      (art) =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.contentSummary.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3);

    setSuggestions({ universities: filteredUnis, articles: filteredArticles });
  }, [searchQuery]);

  const flatSuggestions = useMemo((): SuggestionPick[] => {
    const items: SuggestionPick[] = [];
    suggestions.universities.forEach((uni) => items.push({ kind: "uni", uni }));
    suggestions.articles.forEach((article) => items.push({ kind: "article", article }));
    if (searchQuery.trim().length > 0) items.push({ kind: "view-all" });
    return items;
  }, [suggestions, searchQuery]);

  useEffect(() => {
    setActiveSuggestionIndex(-1);
  }, [searchQuery]);

  const activateSuggestion = useCallback(
    (item: SuggestionPick) => {
      if (item.kind === "uni") {
        onUniversitySelect(item.uni.id);
        setShowSuggestions(false);
      } else if (item.kind === "article") {
        onArticleSelect(item.article);
        setShowSuggestions(false);
      } else {
        onSearchSubmit(searchQuery);
        onViewChange("rankings");
        setShowSuggestions(false);
      }
    },
    [onArticleSelect, onSearchSubmit, onUniversitySelect, onViewChange, searchQuery]
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      return;
    }
    if (!showSuggestions || flatSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((i) => Math.min(i + 1, flatSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
      e.preventDefault();
      activateSuggestion(flatSuggestions[activeSuggestionIndex]);
    }
  };

  // Click outside listener to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      onViewChange("rankings");
      setShowSuggestions(false);
    }
  };

  // Get Top 5 Universities based on active metric tab
  const getTopFive = () => {
    const sorted = [...MOCK_UNIVERSITIES].sort((a, b) => {
      if (activeTab === "research") return b.research - a.research;
      if (activeTab === "employability") return b.employability - a.employability;
      return b.overall - a.overall;
    });
    return sorted.slice(0, 5);
  };

  return (
    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8 font-sans flex-grow">
      
      {/* Split Layout Screen */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-8 mb-16 border-b border-slate-200 dark:border-cyber-border/30 pb-16">
        
        {/* Left Pane (40% - Cols 1-4): Discovery & Typographic Search */}
        <div className="md:col-span-4 flex flex-col justify-center pr-0 md:pr-8 aur-hero-accent">
          <div className="mb-4">
            <span className="aur-caption">Academic Intelligence Hub</span>
          </div>
          <h2 className="aur-section-title text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.15] mb-5">
            Find World-Class Education in Asia.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-[15px] leading-relaxed mb-8 max-w-md">
            Filter institutional indicators, compare global rankings, and explore regional study models including medical careers in Central Asia.
          </p>

          {/* Search Box Container */}
          <div className="relative w-full" ref={suggestionRef}>
            <form onSubmit={handleSearchSubmit} className="flex">
              <div className="relative flex-grow">
                <input
                  ref={searchInputRef}
                  type="search"
                  role="combobox"
                  aria-expanded={showSuggestions && searchQuery.trim().length > 0}
                  aria-autocomplete="list"
                  placeholder="Search universities, locations, subjects..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full border border-slate-900 dark:border-cyber-border bg-white dark:bg-cyber-gray px-4 py-3 pl-11 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 dark:focus:ring-cyber-yellow dark:focus:border-cyber-yellow aur-focus-ring"
                />
                <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
              <button
                type="submit"
                className="aur-btn-primary px-6 py-3 border-y border-r border-slate-900 dark:border-cyber-yellow"
              >
                Search
              </button>
            </form>

            {/* Debounced Suggestion Dropdown */}
            {showSuggestions && searchQuery.trim().length > 0 && (
              <div
                role="listbox"
                className="absolute left-0 right-0 z-20 mt-1.5 border border-slate-950 dark:border-cyber-border/50 bg-white dark:bg-cyber-dark shadow-xl dark:shadow-2xl max-h-96 overflow-y-auto cyber-glass-light dark:cyber-glass"
              >
                {(() => {
                  let rowIndex = -1;
                  return (
                    <>
                      <div className="p-3 border-b border-slate-100 dark:border-cyber-border/30">
                        <div className="aur-caption flex items-center gap-1.5 mb-2 text-slate-400 dark:text-slate-500">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>Universities</span>
                        </div>
                        {suggestions.universities.length > 0 ? (
                          <ul className="space-y-1">
                            {suggestions.universities.map((uni) => {
                              rowIndex += 1;
                              const isActive = activeSuggestionIndex === rowIndex;
                              return (
                                <li key={uni.id} role="option" aria-selected={isActive}>
                                  <button
                                    type="button"
                                    onMouseEnter={() => setActiveSuggestionIndex(rowIndex)}
                                    onClick={() => activateSuggestion({ kind: "uni", uni })}
                                    className={`w-full text-left flex items-center justify-between p-2 transition-colors text-xs aur-focus-ring ${
                                      isActive
                                        ? "bg-amber-50 dark:bg-cyber-yellow/10 border-l-2 border-amber-700 dark:border-cyber-yellow"
                                        : "hover:bg-slate-50 dark:hover:bg-cyber-gray/40 border-l-2 border-transparent"
                                    }`}
                                  >
                                    <span className="font-semibold text-slate-800 dark:text-slate-100 truncate pr-4">
                                      {highlightMatch(uni.name, searchQuery)}
                                    </span>
                                    <span className="flex items-center text-[10px] text-slate-400 bg-slate-100 dark:bg-cyber-gray px-1.5 py-0.5 font-mono shrink-0">
                                      <MapPin className="h-2.5 w-2.5 mr-0.5" />
                                      {uni.location}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <div className="text-xs text-slate-400 p-2 italic">No universities found</div>
                        )}
                      </div>

                      <div className="p-3 border-b border-slate-100 dark:border-cyber-border/30">
                        <div className="aur-caption flex items-center gap-1.5 mb-2 text-slate-400 dark:text-slate-500">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Spotlights & Articles</span>
                        </div>
                        {suggestions.articles.length > 0 ? (
                          <ul className="space-y-1">
                            {suggestions.articles.map((art) => {
                              rowIndex += 1;
                              const isActive = activeSuggestionIndex === rowIndex;
                              return (
                                <li key={art.id} role="option" aria-selected={isActive}>
                                  <button
                                    type="button"
                                    onMouseEnter={() => setActiveSuggestionIndex(rowIndex)}
                                    onClick={() => activateSuggestion({ kind: "article", article: art })}
                                    className={`w-full text-left p-2 transition-colors text-xs block aur-focus-ring ${
                                      isActive
                                        ? "bg-amber-50 dark:bg-cyber-yellow/10 border-l-2 border-amber-700 dark:border-cyber-yellow"
                                        : "hover:bg-slate-50 dark:hover:bg-cyber-gray/40 border-l-2 border-transparent"
                                    }`}
                                  >
                                    <span className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                                      {highlightMatch(art.title, searchQuery)}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">{art.source}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <div className="text-xs text-slate-400 p-2 italic">No relevant articles found</div>
                        )}
                      </div>

                      <div className="bg-slate-50 dark:bg-cyber-gray/50 p-2 text-center border-t border-slate-100 dark:border-cyber-border/30">
                        {(() => {
                          rowIndex += 1;
                          const isActive = activeSuggestionIndex === rowIndex;
                          return (
                            <button
                              type="button"
                              onMouseEnter={() => setActiveSuggestionIndex(rowIndex)}
                              onClick={() => activateSuggestion({ kind: "view-all" })}
                              className={`inline-flex items-center aur-caption hover:text-amber-800 dark:hover:text-cyber-yellow-bright aur-focus-ring px-2 py-1 ${
                                isActive ? "text-amber-800 dark:text-cyber-yellow" : ""
                              }`}
                            >
                              View all rankings matching &quot;{searchQuery}&quot;
                              <ChevronRight className="h-3 w-3 ml-0.5" />
                            </button>
                          );
                        })()}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Quick-links / Popular Searches */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Trending:</span>
            {["Uzbekistan", "Medicine", "National Univ Singapore", "English medium"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  onSearchSubmit(tag);
                  onViewChange("rankings");
                }}
                className="aur-chip font-mono"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane (60% - Cols 5-10): Global Interactive Rank Card */}
        <div className="md:col-span-6 aur-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-cyber-border/40 pb-5 mb-5">
              <div className="aur-hero-accent pl-3">
                <h3 className="aur-section-title text-xl md:text-2xl">
                  Live Top 5 Universities
                </h3>
                <p className="aur-caption text-slate-400 dark:text-slate-500 mt-1">
                  Real-time Audited Academic Index
                </p>
              </div>
              <span className="flex items-center text-xs font-semibold text-amber-800 dark:text-cyber-yellow bg-gradient-to-r from-amber-50 to-amber-100/80 dark:from-cyber-yellow/10 dark:to-transparent px-3 py-1.5 border border-amber-200/80 dark:border-cyber-yellow/30 font-mono shadow-sm">
                <Star className="h-3.5 w-3.5 fill-amber-700 mr-1 shrink-0" />
                Rankings 2026
              </span>
            </div>

            {/* Quick Metrics Selector Tabs */}
            <div className="flex border-b border-slate-100 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
              {[
                { id: "overall", label: "Overall Score" },
                { id: "research", label: "Research Metric" },
                { id: "employability", label: "Employability Ratio" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`border-b-2 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 -mb-[1px] ${
                    activeTab === tab.id
                      ? "border-amber-700 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Micro Tabular View */}
            <div className="space-y-3">
              {getTopFive().map((uni, idx) => {
                const activeScore =
                  activeTab === "research"
                    ? uni.research
                    : activeTab === "employability"
                    ? uni.employability
                    : uni.overall;

                return (
                  <div
                    key={uni.id}
                    onClick={() => onUniversitySelect(uni.id)}
                    className="aur-top5-row group"
                  >
                    <div className="flex items-center space-x-3 truncate min-w-0">
                      <span
                        className={`aur-rank-badge shrink-0 ${
                          idx < 3 ? "aur-rank-badge--elite" : ""
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                          {uni.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {uni.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 shrink-0 font-mono">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          {activeScore.toFixed(1)}
                        </span>
                        <span className="text-[9px] text-slate-400 block uppercase tracking-wider">
                          Score
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium">
              * Filterable by Location, Program & Tuition.
            </span>
            <button
              onClick={() => onViewChange("rankings")}
              className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-amber-700 transition-colors inline-flex items-center"
            >
              Analyze All Universities
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Content Grid Header */}
      <div className="mb-8 border-b border-slate-900 pb-2 flex justify-between items-baseline">
        <h3 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
          Editorial Focus & Regional Briefings
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
          Featured Articles
        </span>
      </div>

      {/* 3-Column Editorial Grid Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-y border-slate-200">
        {FEATURED_ARTICLES.map((article, idx) => (
          <div
            key={article.id}
            onClick={() => onArticleSelect(article)}
            className={`py-8 cursor-pointer group flex flex-col justify-between h-full ${
              idx === 0 ? "md:pr-8" : idx === 1 ? "md:px-8" : "md:pl-8"
            }`}
          >
            <div>
              {/* Image Frame with Strict Aspect Ratio */}
              <div className="relative aspect-video w-full mb-6 border border-slate-200 overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />
              </div>

              {/* Metadata */}
              <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>

              {/* Headings in Lora */}
              <h4 className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug mb-2">
                {article.title}
              </h4>
              <p className="font-serif text-xs italic text-slate-500 mb-4 leading-normal">
                {article.subtitle}
              </p>

              {/* Body Summary */}
              <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-6">
                {article.contentSummary}
              </p>
            </div>

            <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-amber-700 transition-colors">
              <span>Read Full Report</span>
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
