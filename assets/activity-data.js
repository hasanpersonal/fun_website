/* ==========================================================================
   Hasan's Web — activity data
   This is the single source of truth for every number on the site.
   Edit the values here and the home page + /activity.html update themselves.

   status    → "live" | "progress" | "planning" | "content"
   progress  → 0–100 (percent complete)
   ========================================================================== */
window.ACTIVITY = {
  updated: "November 2026",

  /* Headline numbers (used by KPI cards, hero strip and the dashboard card) */
  summary: {
    completed: 7,
    inProgress: 3,
    planning: 1,
    gamesLive: 3,
    videos: 6,
    projects: 11
  },

  /* Donut: how the whole portfolio is distributed */
  status: [
    { label: "Completed & shipped", value: 7, color: "#34d399" },
    { label: "In progress", value: 3, color: "#fbbf24" },
    { label: "Planning / next", value: 1, color: "#8b5cf6" }
  ],

  /* Bars: commits + content pushed per week (oldest → newest) */
  weekly: [
    { label: "W1", value: 4, note: "4 pushes · setup" },
    { label: "W2", value: 9, note: "9 pushes · layout revamp" },
    { label: "W3", value: 6, note: "6 pushes · game fixes" },
    { label: "W4", value: 14, note: "14 pushes · dashboard" },
    { label: "W5", value: 11, note: "11 pushes · video pages" },
    { label: "W6", value: 18, note: "18 pushes · arcade v2" },
    { label: "W7", value: 7, note: "7 pushes · polish" },
    { label: "W8", value: 21, note: "21 pushes · activity report" }
  ],

  /* Heatmap: 20 weeks of daily activity, generated from a fixed seed */
  heatmap: { weeks: 20, seed: 7 },

  /* Radial meters per discipline */
  categories: [
    { label: "Web apps", value: 78, count: 4, color: "#22d3ee" },
    { label: "Games", value: 64, count: 3, color: "#a78bfa" },
    { label: "Content", value: 52, count: 4, color: "#34d399" }
  ],

  /* Per-project completion — powers the activity report progress list */
  projects: [
    {
      name: "Cyber Archery 3.0",
      category: "Game",
      status: "live",
      progress: 100,
      url: "https://hasanpersonal.github.io/archer",
      icon: "fa-solid fa-crosshairs",
      accent: "#a78bfa"
    },
    {
      name: "Neon CRace",
      category: "Game",
      status: "live",
      progress: 100,
      url: "https://hasanpersonal.github.io/car",
      icon: "fa-solid fa-car-side",
      accent: "#fb7185"
    },
    {
      name: "Dinamic Tube",
      category: "Web app",
      status: "live",
      progress: 100,
      url: "https://hasanpersonal.github.io/Dinamic-",
      icon: "fa-solid fa-tower-broadcast",
      accent: "#f43f5e"
    },
    {
      name: "Hasan's Web (this site)",
      category: "Web app",
      status: "live",
      progress: 100,
      url: "index.html",
      icon: "fa-solid fa-globe",
      accent: "#22d3ee"
    },
    {
      name: "YouTube Screening Room",
      category: "Content",
      status: "live",
      progress: 100,
      url: "page1.html",
      icon: "fa-brands fa-youtube",
      accent: "#f97316"
    },
    {
      name: "Drive Video Vault",
      category: "Content",
      status: "live",
      progress: 100,
      url: "page2.html",
      icon: "fa-brands fa-google-drive",
      accent: "#38bdf8"
    },
    {
      name: "UNO Table",
      category: "Game",
      status: "progress",
      progress: 75,
      url: "https://hasanpersonal.github.io/uno",
      icon: "fa-solid fa-layer-group",
      accent: "#fbbf24"
    },
    {
      name: "Activity Report 2.0",
      category: "Web app",
      status: "progress",
      progress: 88,
      url: "activity.html",
      icon: "fa-solid fa-chart-pie",
      accent: "#8b5cf6"
    },
    {
      name: "Video Library expansion",
      category: "Content",
      status: "progress",
      progress: 45,
      url: "page1.html",
      icon: "fa-solid fa-clapperboard",
      accent: "#34d399"
    },
    {
      name: "Untitled arcade game",
      category: "Game",
      status: "planning",
      progress: 15,
      url: "game.html",
      icon: "fa-solid fa-dice",
      accent: "#818cf8"
    }
  ],

  /* Recent activity feed */
  timeline: [
    {
      date: "Nov 01, 2026",
      title: "Launched the activity report",
      desc: "A living dashboard for projects, progress and shipped work.",
      color: "#34d399"
    },
    {
      date: "Oct 26, 2026",
      title: "Rebuilt the whole site",
      desc: "New design system, shared stylesheet and a faster navigation.",
      color: "#8b5cf6"
    },
    {
      date: "Oct 18, 2026",
      title: "UNO Table reached 75%",
      desc: "Multiplayer turn logic finished, working on the win screen.",
      color: "#fbbf24"
    },
    {
      date: "Oct 09, 2026",
      title: "Neon CRace shipped",
      desc: "60-second arcade racer, playable straight from the browser.",
      color: "#fb7185"
    },
    {
      date: "Sep 28, 2026",
      title: "Video library opened",
      desc: "YouTube and Drive collections live on their own pages.",
      color: "#22d3ee"
    }
  ]
};
