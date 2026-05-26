import { useState, useEffect, useRef, createContext, useContext } from "react";
import CompetitorPage from "./CompetitorPage";
import ReviewAgent from "./ReviewAgent";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');`;

const ThemeContext = createContext({ dark: false });

const LIGHT = {
  navy:       "#0B1526",
  navyMid:    "#142038",
  navyLight:  "#1E3050",
  teal:       "#00C9A7",
  tealDim:    "#00A88A",
  tealGlow:   "rgba(0,201,167,0.12)",
  amber:      "#F5A623",
  amberDim:   "#E6920E",
  coral:      "#FF6058",
  coralDim:   "rgba(255,96,88,0.12)",
  violet:     "#7B61FF",
  bg:         "#F2F5FB",
  bgCard:     "#FFFFFF",
  border:     "#E4EAF4",
  borderDark: "#D0DAF0",
  textPri:    "#0B1526",
  textSec:    "#5E718D",
  textMut:    "#8FA3BF",
  green:      "#22C55E",
  greenDim:   "rgba(34,197,94,0.12)",
  redDim:     "rgba(255,96,88,0.12)",
};

const DARK = {
  navy:       "#0B1526",
  navyMid:    "#142038",
  navyLight:  "#1E3050",
  teal:       "#00C9A7",
  tealDim:    "#00A88A",
  tealGlow:   "rgba(0,201,167,0.18)",
  amber:      "#F5A623",
  amberDim:   "#E6920E",
  coral:      "#FF6058",
  coralDim:   "rgba(255,96,88,0.18)",
  violet:     "#7B61FF",
  bg:         "#0D1117",
  bgCard:     "#161B22",
  border:     "#30363D",
  borderDark: "#484F58",
  textPri:    "#E6EDF3",
  textSec:    "#8B949E",
  textMut:    "#6E7681",
  green:      "#22C55E",
  greenDim:   "rgba(34,197,94,0.18)",
  redDim:     "rgba(255,96,88,0.18)",
};

function useThemeColors() {
  const { dark } = useContext(ThemeContext);
  return dark ? DARK : LIGHT;
}

// Keep C as default for non-component code
const C = LIGHT;

const PLATFORMS = {
  amazon:     { label: "Amazon",     color: "#FF9900", bg: "#FFF4E0" },
  flipkart:   { label: "Flipkart",   color: "#2874F0", bg: "#EAF1FE" },
  google:     { label: "Google",     color: "#4285F4", bg: "#EAF1FE" },
  trustpilot: { label: "Trustpilot", color: "#00B67A", bg: "#E0F7F0" },
  meesho:     { label: "Meesho",     color: "#9B51E0", bg: "#F3EAFD" },
};

const PRODUCTS = [
  { id:1, name:"Wireless Noise-Cancelling Earbuds Pro", sku:"SKU-8821", category:"Electronics", platform:"amazon", rating:4.3, reviews:2841, sentiment:82, trend:+6.2, status:"healthy", img:"🎧",
    topIssue:"Battery life praised, fit issues in 12%", alerts:0 },
  { id:2, name:"Bamboo Fibre Yoga Mat — 6mm", sku:"SKU-3312", category:"Fitness", platform:"flipkart", rating:3.8, reviews:1204, sentiment:61, trend:-4.1, status:"watch", img:"🧘",
    topIssue:"Slippage complaints rising — packaging damage", alerts:2 },
  { id:3, name:"Cold Press Juicer 800W Titanium", sku:"SKU-5590", category:"Appliances", platform:"amazon", rating:4.6, reviews:3672, sentiment:91, trend:+11.3, status:"healthy", img:"🥤",
    topIssue:"Quiet motor & easy clean praised consistently", alerts:0 },
  { id:4, name:"SPF 50+ Mineral Sunscreen 100ml", sku:"SKU-7741", category:"Skincare", platform:"google", rating:2.9, reviews:887, sentiment:34, trend:-18.7, status:"critical", img:"🧴",
    topIssue:"White cast & pilling — 41% 1-2 star reviews", alerts:5 },
  { id:5, name:"Standing Desk Converter — Dual Monitor", sku:"SKU-2209", category:"Furniture", platform:"flipkart", rating:4.1, reviews:563, sentiment:74, trend:+2.8, status:"healthy", img:"🖥️",
    topIssue:"Stability appreciated; height range requested", alerts:1 },
  { id:6, name:"Organic Green Tea — 100 Bags", sku:"SKU-6634", category:"Food & Bev", platform:"trustpilot", rating:4.7, reviews:1893, sentiment:93, trend:+8.4, status:"healthy", img:"🍵",
    topIssue:"Aroma & freshness top-praised attributes", alerts:0 },
  { id:7, name:"Resistance Bands Set (5 levels)", sku:"SKU-4410", category:"Fitness", platform:"meesho", rating:4.0, reviews:2210, sentiment:68, trend:-1.2, status:"watch", img:"💪",
    topIssue:"Snapping at extreme stretch — durability concern", alerts:3 },
  { id:8, name:"Ceramic Hair Straightener 230°C", sku:"SKU-9981", category:"Beauty", platform:"amazon", rating:3.5, reviews:4421, sentiment:52, trend:-9.6, status:"watch", img:"💇",
    topIssue:"Heat damage reports — cord quality complaints", alerts:4 },
  { id:9, name:"Reusable Silicone Food Bags (12pk)", sku:"SKU-1175", category:"Kitchen", platform:"google", rating:4.5, reviews:731, sentiment:88, trend:+5.1, status:"healthy", img:"🥗",
    topIssue:"Seal quality & eco-value scored highest", alerts:0 },
];

const ALERTS = [
  { id:1, type:"critical", product:"SPF 50+ Mineral Sunscreen", msg:"Sentiment dropped 19% this week", time:"2h ago" },
  { id:2, type:"warning",  product:"Ceramic Hair Straightener", msg:"Negative reviews surging on Amazon", time:"5h ago" },
  { id:3, type:"warning",  product:"Resistance Bands Set",      msg:"Durability complaints up 34%", time:"1d ago" },
  { id:4, type:"info",     product:"Cold Press Juicer",         msg:"Sentiment crossed 90% threshold", time:"1d ago" },
];

const NAV = [
  { icon:"⬡", label:"Overview",    active: true  },
  { icon:"⬡", label:"Products",    active: false },
  { icon:"⬡", label:"Analytics",   active: false },
  { icon:"⬡", label:"Competitors",   active: false },
  { icon:"⬡", label:"Review Agent",  active: false },
  { icon:"⬡", label:"Reports",       active: false },
  { icon:"⬡", label:"Settings",      active: false },
];

const NAV_ICONS = {
  "Overview":    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  "Products":    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  "Analytics":   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  "Competitors": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  "Review Agent":<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>,
  "Reports":     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  "Settings":    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

function StarRating({ rating }) {
  const T = useThemeColors();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? T.amber : T.border}
          stroke={i <= Math.round(rating) ? T.amber : T.borderDark}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize:11, fontWeight:600, color:T.textPri, marginLeft:3, fontFamily:"'Sora',sans-serif" }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function SentimentBar({ value }) {
  const T = useThemeColors();
  const color = value >= 75 ? T.teal : value >= 50 ? T.amber : T.coral;
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
        <span style={{ fontSize:10, color:T.textSec, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>Sentiment</span>
        <span style={{ fontSize:12, fontWeight:700, color, fontFamily:"'Sora',sans-serif" }}>{value}%</span>
      </div>
      <div style={{ height:5, background:T.border, borderRadius:99, overflow:"hidden" }}>
        <div style={{
          height:"100%", width:`${value}%`, background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          borderRadius:99, transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"
        }}/>
      </div>
    </div>
  );
}

function TrendBadge({ value }) {
  const T = useThemeColors();
  const up = value >= 0;
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:3,
      padding:"3px 8px", borderRadius:99,
      background: up ? T.greenDim : T.redDim,
      color: up ? T.green : T.coral,
      fontSize:11, fontWeight:700, fontFamily:"'Sora',sans-serif"
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {up ? <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>
             : <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>}
      </svg>
      {Math.abs(value).toFixed(1)}%
    </div>
  );
}

function StatusDot({ status }) {
  const T = useThemeColors();
  const map = { healthy:T.green, watch:T.amber, critical:T.coral };
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
      <div style={{ width:7, height:7, borderRadius:"50%", background:map[status],
        boxShadow:`0 0 0 2px ${map[status]}30` }}/>
      <span style={{ fontSize:10, fontWeight:600, color:map[status],
        textTransform:"uppercase", letterSpacing:"0.06em", fontFamily:"'Sora',sans-serif" }}>
        {status}
      </span>
    </div>
  );
}

function PlatformBadge({ platform }) {
  const T = useThemeColors();
  const p = PLATFORMS[platform];
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 9px", borderRadius:99,
      background:p.bg, border:`1px solid ${p.color}28`
    }}>
      <div style={{ width:7, height:7, borderRadius:"50%", background:p.color }}/>
      <span style={{ fontSize:10, fontWeight:600, color:p.color, fontFamily:"'DM Sans',sans-serif" }}>{p.label}</span>
    </div>
  );
}

function ProductCard({ p, idx }) {
  const T = useThemeColors();
  const [hovered, setHovered] = useState(false);
  const statusBorder = { healthy:"transparent", watch:`${T.amber}50`, critical:`${T.coral}60` };
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:T.bgCard,
        border:`1px solid ${hovered ? T.borderDark : T.border}`,
        borderTop:`3px solid ${statusBorder[p.status] !== "transparent" ? statusBorder[p.status] : hovered ? T.teal : T.border}`,
        borderRadius:16, padding:"20px",
        cursor:"pointer",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(11,21,38,0.10)" : "0 2px 12px rgba(11,21,38,0.05)",
        transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
        animationDelay:`${idx * 60}ms`,
        position:"relative", overflow:"hidden",
      }}
    >
      {p.alerts > 0 && (
        <div style={{
          position:"absolute", top:14, right:14,
          background:T.coral, color:"#fff",
          width:20, height:20, borderRadius:"50%",
          fontSize:10, fontWeight:700, fontFamily:"'Sora',sans-serif",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 0 0 3px ${T.coralDim}`
        }}>{p.alerts}</div>
      )}

      <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:16 }}>
        <div style={{
          width:52, height:52, borderRadius:12, flexShrink:0,
          background:`linear-gradient(135deg, ${T.bg}, ${T.border})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:24, border:`1px solid ${T.border}`
        }}>{p.img}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:T.textPri, lineHeight:1.35,
            fontFamily:"'Sora',sans-serif", marginBottom:5,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {p.name}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, color:T.textMut, fontFamily:"'DM Sans',sans-serif" }}>{p.sku}</span>
            <span style={{ fontSize:10, color:T.textMut }}>·</span>
            <span style={{ fontSize:10, color:T.textSec, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>{p.category}</span>
          </div>
          <div style={{ marginTop:6 }}>
            <PlatformBadge platform={p.platform}/>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <StarRating rating={p.rating}/>
        <span style={{ fontSize:11, color:T.textMut, fontFamily:"'DM Sans',sans-serif" }}>
          {p.reviews.toLocaleString()} reviews
        </span>
      </div>

      <div style={{ marginBottom:14 }}>
        <SentimentBar value={p.sentiment}/>
      </div>

      <div style={{
        padding:"10px 12px", borderRadius:10,
        background:T.bg, marginBottom:14,
        border:`1px solid ${T.border}`
      }}>
        <div style={{ fontSize:10, color:T.textMut, fontFamily:"'DM Sans',sans-serif",
          fontWeight:500, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.05em" }}>
          Top insight
        </div>
        <div style={{ fontSize:11, color:T.textSec, fontFamily:"'DM Sans',sans-serif",
          lineHeight:1.5, fontStyle:"italic" }}>
          "{p.topIssue}"
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <StatusDot status={p.status}/>
        <TrendBadge value={p.trend}/>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, icon, color, trend }) {
  const T = useThemeColors();
  return (
    <div style={{
      background:T.bgCard, borderRadius:16, padding:"20px 22px",
      border:`1px solid ${T.border}`, flex:1, minWidth:0,
      boxShadow:"0 2px 12px rgba(11,21,38,0.04)",
      position:"relative", overflow:"hidden"
    }}>
      <div style={{
        position:"absolute", right:-10, top:-10,
        width:72, height:72, borderRadius:"50%",
        background:`${color}12`
      }}/>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ fontSize:12, fontWeight:500, color:T.textSec,
          fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.02em" }}>{label}</div>
        <div style={{ width:36, height:36, borderRadius:10,
          background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center",
          color, fontSize:16 }}>{icon}</div>
      </div>
      <div style={{ fontSize:28, fontWeight:700, color:T.textPri,
        fontFamily:"'Sora',sans-serif", marginBottom:4, letterSpacing:"-0.02em" }}>{value}</div>
      <div style={{ fontSize:11, color:T.textMut, fontFamily:"'DM Sans',sans-serif" }}>{sub}</div>
      {trend !== undefined && (
        <div style={{ marginTop:10 }}>
          <TrendBadge value={trend}/>
        </div>
      )}
    </div>
  );
}

export default function ReviewBridgeHome() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Overview");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState("30d");
  const [liveAlerts, setLiveAlerts] = useState(ALERTS);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("lumiq-dark-mode") === "true"; } catch { return false; }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("lumiq-user-details");
      return saved ? JSON.parse(saved) : {
        name: "Harsh Sharma",
        email: "harsh@novabrand.co",
        role: "Brand Analyst",
        plan: "Enterprise"
      };
    } catch {
      return {
        name: "Harsh Sharma",
        email: "harsh@novabrand.co",
        role: "Brand Analyst",
        plan: "Enterprise"
      };
    }
  });
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editUser, setEditUser] = useState({ ...user });
  const searchRef = useRef(null);

  const T = darkMode ? DARK : LIGHT;

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      try { localStorage.setItem("lumiq-dark-mode", String(next)); } catch {}
      return next;
    });
  };

  const dismissAlert = (id) => setLiveAlerts(prev => prev.filter(a => a.id !== id));

  useEffect(() => {
    const id = "lumiq-global-styles";
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }
    style.textContent = FONTS + `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'DM Sans', sans-serif; background: ${T.bg}; transition: background 0.3s; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 99px; }
      ::-webkit-scrollbar-thumb:hover { background: ${T.borderDark}; }
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0); }
      }
      .card-enter { animation: fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both; }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      .live-dot { animation: pulse 2s ease-in-out infinite; }
    `;
    setTimeout(() => setMounted(true), 50);
  }, [darkMode, T]);

  const tabs = [
    { key:"all",        label:"All Platforms", count:9 },
    { key:"amazon",     label:"Amazon",        count:3 },
    { key:"flipkart",   label:"Flipkart",      count:2 },
    { key:"google",     label:"Google",        count:2 },
    { key:"trustpilot", label:"Trustpilot",    count:1 },
    { key:"meesho",     label:"Meesho",        count:1 },
  ];

  const filtered = PRODUCTS.filter(p => {
    const matchTab = activeTab === "all" || p.platform === activeTab;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      || p.sku.toLowerCase().includes(search.toLowerCase())
      || p.category.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const criticalCount = PRODUCTS.filter(p => p.status === "critical").length;
  const watchCount    = PRODUCTS.filter(p => p.status === "watch").length;
  const avgSentiment  = Math.round(PRODUCTS.reduce((s,p) => s + p.sentiment, 0) / PRODUCTS.length);
  const avgRating     = (PRODUCTS.reduce((s,p) => s + p.rating, 0) / PRODUCTS.length).toFixed(1);

  return (
    <ThemeContext.Provider value={{ dark: darkMode }}>
    <div style={{ display:"flex", height:"100vh", background:T.bg, fontFamily:"'DM Sans',sans-serif", overflow:"hidden", transition:"background 0.3s" }}>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside style={{
        width:230, flexShrink:0,
        background:T.navy,
        display:"flex", flexDirection:"column",
        padding:"0",
        borderRight:"none",
        position:"relative", zIndex:10,
      }}>
        {/* Logo */}
        <div style={{ padding:"24px 22px 20px", borderBottom:`1px solid ${T.navyLight}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:`linear-gradient(135deg, ${T.teal}, ${T.tealDim})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 4px 14px ${T.tealGlow}`
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff",
                fontFamily:"'Sora',sans-serif", letterSpacing:"-0.01em" }}>LumIQ</div>
              <div style={{ fontSize:10, color:`${T.teal}bb`, fontFamily:"'DM Sans',sans-serif",
                fontWeight:500 }}>Review Intelligence</div>
            </div>
          </div>
        </div>

        {/* Brand chip */}
        <div style={{ padding:"14px 22px", borderBottom:`1px solid ${T.navyLight}` }}>
          <div style={{ fontSize:10, color:"#ffffff50", fontWeight:500,
            textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8,
            fontFamily:"'DM Sans',sans-serif" }}>Active Brand</div>
          <div style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"10px 12px", borderRadius:10,
            background:T.navyLight, border:`1px solid ${T.navyMid}`
          }}>
            <div style={{ width:28, height:28, borderRadius:8,
              background:`linear-gradient(135deg, #6366f1, #8b5cf6)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, color:"#fff", fontWeight:700, fontFamily:"'Sora',sans-serif" }}>N</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:"#fff",
                fontFamily:"'Sora',sans-serif" }}>NovaBrand Co.</div>
              <div style={{ fontSize:10, color:"#ffffff60", fontFamily:"'DM Sans',sans-serif" }}>Enterprise Plan</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"16px 14px", display:"flex", flexDirection:"column", gap:4, overflowY:"auto" }}>
          <div style={{ fontSize:10, color:"#ffffff40", fontWeight:500,
            textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8, paddingLeft:8,
            fontFamily:"'DM Sans',sans-serif" }}>Menu</div>
          {Object.keys(NAV_ICONS).map(item => {
            const isActive = activeNav === item;
            return (
              <button key={item} onClick={() => setActiveNav(item)} style={{
                display:"flex", alignItems:"center", gap:11,
                padding:"10px 12px", borderRadius:10, border:"none", cursor:"pointer",
                background: isActive ? T.tealGlow : "transparent",
                color: isActive ? T.teal : "#ffffff70",
                transition:"all 0.18s",
                width:"100%", textAlign:"left",
                borderLeft: isActive ? `2px solid ${T.teal}` : "2px solid transparent",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#ffffff08"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ flexShrink:0 }}>{NAV_ICONS[item]}</span>
                <span style={{ fontSize:13, fontWeight: isActive ? 600 : 400,
                  fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.01em" }}>{item}</span>
                {item === "Overview" && (
                  <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%",
                    background:T.teal }} className="live-dot"/>
                )}
              </button>
            );
          })}

          <div style={{ marginTop:16, fontSize:10, color:"#ffffff40", fontWeight:500,
            textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8, paddingLeft:8,
            fontFamily:"'DM Sans',sans-serif" }}>Alerts</div>
          <div style={{
            padding:"12px", borderRadius:10,
            background:`${T.coral}18`, border:`1px solid ${T.coral}30`
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:600, color:T.coral,
                fontFamily:"'Sora',sans-serif" }}>Active Issues</span>
              <div style={{ background:T.coral, color:"#fff", borderRadius:99,
                fontSize:10, fontWeight:700, padding:"1px 7px",
                fontFamily:"'Sora',sans-serif" }}>{criticalCount + watchCount}</div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:700, color:T.coral,
                  fontFamily:"'Sora',sans-serif" }}>{criticalCount}</div>
                <div style={{ fontSize:9, color:`${T.coral}90`,
                  fontFamily:"'DM Sans',sans-serif" }}>Critical</div>
              </div>
              <div style={{ width:1, background:`${T.coral}30` }}/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:700, color:T.amber,
                  fontFamily:"'Sora',sans-serif" }}>{watchCount}</div>
                <div style={{ fontSize:9, color:`${T.amber}90`,
                  fontFamily:"'DM Sans',sans-serif" }}>Watch</div>
              </div>
            </div>
          </div>
        </nav>
        {/* Profile */}
        <div style={{
          padding:"16px 22px", borderTop:`1px solid ${T.navyLight}`,
          display:"flex", alignItems:"center", gap:12
        }}>
          <div style={{
            width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.08)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:15, fontWeight:700, color:"#fff", fontFamily:"'Sora',sans-serif",
            border:`2px solid ${T.tealGlow}`
          }}>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#fff",
              fontFamily:"'Sora',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {user.name}
            </div>
            <div style={{ fontSize:10, color:"#ffffff50", fontFamily:"'DM Sans',sans-serif" }}>{user.role}</div>
          </div>
          <button style={{ background:"none", border:"none", cursor:"pointer", color:"#ffffff40", padding:4 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* Top Header */}
        <header style={{
          background:T.bgCard, borderBottom:`1px solid ${T.border}`,
          padding:"12px 28px", minHeight:82,
          display:"flex", alignItems:"center", gap:20, flexShrink:0,
          boxShadow:"0 1px 12px rgba(11,21,38,0.04)"
        }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:500, color:T.textSec, fontFamily:"'DM Sans',sans-serif", marginBottom:4 }}>
              Welcome {user.name.split(" ")[0] || "User"} 👋
            </div>
            <div style={{ fontSize:19, fontWeight:700, color:T.textPri,
              fontFamily:"'Sora',sans-serif", letterSpacing:"-0.01em" }}>
              Product Intelligence Overview
            </div>
          </div>

          {/* Date Range Picker */}
          <div style={{
            display:"flex", gap:3,
            background:T.bg, padding:4, borderRadius:10,
            border:`1px solid ${T.border}`
          }}>
            {[{key:"7d",label:"7D"},{key:"30d",label:"30D"},{key:"90d",label:"90D"},{key:"1y",label:"1Y"}].map(r => {
              const active = dateRange === r.key;
              return (
                <button key={r.key} onClick={() => setDateRange(r.key)} style={{
                  padding:"6px 12px", borderRadius:7, border:"none", cursor:"pointer",
                  background: active ? T.navy : "transparent",
                  color: active ? "#fff" : T.textSec,
                  fontSize:11, fontWeight: active ? 700 : 500,
                  fontFamily:"'Sora',sans-serif",
                  transition:"all 0.18s",
                  letterSpacing:"0.02em"
                }}>{r.label}</button>
              );
            })}
            <button style={{
              padding:"6px 10px", borderRadius:7, border:"none", cursor:"pointer",
              background:"transparent", color:T.textSec,
              fontSize:11, fontWeight:500, fontFamily:"'DM Sans',sans-serif",
              display:"flex", alignItems:"center", gap:5, transition:"all 0.18s"
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Custom
            </button>
          </div>

          {/* Search */}
          <div style={{ position:"relative", width:340 }}>
            <div style={{
              position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
              color: searchFocused ? T.teal : T.textMut, transition:"color 0.2s"
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search products, SKUs, categories…"
              style={{
                width:"100%", height:40, paddingLeft:40, paddingRight:16,
                border:`1.5px solid ${searchFocused ? T.teal : T.border}`,
                borderRadius:10, outline:"none",
                fontSize:13, fontFamily:"'DM Sans',sans-serif",
                color:T.textPri, background:searchFocused ? "#fff" : T.bg,
                transition:"all 0.2s",
                boxShadow: searchFocused ? `0 0 0 3px ${T.tealGlow}` : "none"
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{
                position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer",
                color:T.textMut, padding:2
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Live indicator */}
          <div style={{
            display:"flex", alignItems:"center", gap:7,
            padding:"6px 14px", borderRadius:99,
            background:T.greenDim, border:`1px solid ${T.green}30`
          }}>
            <div className="live-dot" style={{ width:7, height:7, borderRadius:"50%", background:T.green }}/>
            <span style={{ fontSize:11, fontWeight:600, color:T.green,
              fontFamily:"'DM Sans',sans-serif" }}>Live</span>
          </div>

          {/* Notif */}
          <div style={{ position:"relative" }}>
            <button style={{
              width:40, height:40, borderRadius:10, border:`1px solid ${T.border}`,
              background:T.bg, cursor:"pointer", display:"flex",
              alignItems:"center", justifyContent:"center", color:T.textSec
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div style={{
              position:"absolute", top:8, right:8,
              width:8, height:8, borderRadius:"50%",
              background:T.coral, border:"2px solid #fff"
            }}/>
          </div>

          {/* Avatar */}
          <div style={{
            width:40, height:40, borderRadius:10,
            background:`linear-gradient(135deg, ${T.teal}, #0099CC)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:15, fontWeight:700, color:"#fff", fontFamily:"'Sora',sans-serif",
            cursor:"pointer", border:`2px solid ${T.tealGlow}`
          }}>H</div>
        </header>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding: (activeNav === "Competitors" || activeNav === "Review Agent") ? "0" : "24px 28px" }}>

        {activeNav === "Settings" ? (
          /* ── Settings Panel ───────────────────────────────────── */
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:22, fontWeight:700, color:T.textPri,
                fontFamily:"'Sora',sans-serif", letterSpacing:"-0.01em", marginBottom:6 }}>Settings</div>
              <div style={{ fontSize:13, color:T.textSec, fontFamily:"'DM Sans',sans-serif" }}>
                Manage your preferences and account settings
              </div>
            </div>

            {/* Appearance Card */}
            <div style={{
              background:T.bgCard, borderRadius:16, border:`1px solid ${T.border}`,
              overflow:"hidden", boxShadow:"0 2px 12px rgba(11,21,38,0.04)", marginBottom:16
            }}>
              <div style={{
                padding:"18px 22px", borderBottom:`1px solid ${T.border}`,
                display:"flex", alignItems:"center", gap:10
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textPri} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                <span style={{ fontSize:14, fontWeight:600, color:T.textPri,
                  fontFamily:"'Sora',sans-serif" }}>Appearance</span>
              </div>
              <div style={{ padding:"20px 22px" }}>
                {/* Dark Mode Toggle */}
                <div style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"16px 18px", borderRadius:12,
                  background:T.bg, border:`1px solid ${T.border}`,
                  transition:"all 0.2s"
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{
                      width:42, height:42, borderRadius:12,
                      background: darkMode
                        ? "linear-gradient(135deg, #1a1a3e, #2d2b55)"
                        : "linear-gradient(135deg, #FFF4E0, #FFE4B5)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:20, border:`1px solid ${T.border}`,
                      transition:"all 0.3s"
                    }}>
                      {darkMode ? "🌙" : "☀️"}
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:T.textPri,
                        fontFamily:"'Sora',sans-serif", marginBottom:3 }}>
                        Dark Mode
                      </div>
                      <div style={{ fontSize:12, color:T.textSec, fontFamily:"'DM Sans',sans-serif" }}>
                        {darkMode ? "Dark theme is active" : "Switch to dark theme for reduced eye strain"}
                      </div>
                    </div>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    id="dark-mode-toggle"
                    onClick={toggleDarkMode}
                    style={{
                      width:52, height:28, borderRadius:99, border:"none", cursor:"pointer",
                      background: darkMode
                        ? `linear-gradient(135deg, ${T.teal}, ${T.tealDim})`
                        : T.border,
                      position:"relative",
                      transition:"background 0.3s cubic-bezier(0.4,0,0.2,1)",
                      boxShadow: darkMode ? `0 0 12px ${T.tealGlow}` : "inset 0 1px 3px rgba(0,0,0,0.1)",
                      flexShrink:0
                    }}
                  >
                    <div style={{
                      width:22, height:22, borderRadius:"50%",
                      background:"#fff",
                      position:"absolute", top:3,
                      left: darkMode ? 27 : 3,
                      transition:"left 0.3s cubic-bezier(0.4,0,0.2,1)",
                      boxShadow:"0 2px 6px rgba(0,0,0,0.2)"
                    }}/>
                  </button>
                </div>

                {/* Theme Preview */}
                <div style={{
                  marginTop:16, padding:"14px 18px", borderRadius:12,
                  background:`${T.teal}10`, border:`1px solid ${T.teal}25`,
                  display:"flex", alignItems:"center", gap:10
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                  </svg>
                  <span style={{ fontSize:12, color:T.teal, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>
                    Your theme preference is saved automatically and will persist across sessions.
                  </span>
                </div>
              </div>
            </div>

            {/* Account Card */}
            {!isEditingAccount ? (
              <div style={{
                background:T.bgCard, borderRadius:16, border:`1px solid ${T.border}`,
                overflow:"hidden", boxShadow:"0 2px 12px rgba(11,21,38,0.04)", marginBottom:16
              }}>
                <div style={{
                  padding:"18px 22px", borderBottom:`1px solid ${T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"space-between"
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textPri} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span style={{ fontSize:14, fontWeight:600, color:T.textPri,
                      fontFamily:"'Sora',sans-serif" }}>Account</span>
                  </div>
                  <button
                    onClick={() => {
                      setEditUser({ ...user });
                      setIsEditingAccount(true);
                    }}
                    style={{
                      background:"transparent", border:`1px solid ${T.border}`,
                      padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600,
                      color: T.teal, cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                      transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.background = `${T.teal}08`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = "transparent"; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                    Edit Details
                  </button>
                </div>
                <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:16 }}>
                  {[
                    { label:"Name", value:user.name },
                    { label:"Email", value:user.email },
                    { label:"Role", value:user.role },
                    { label:"Plan", value:user.plan },
                  ].map(item => (
                    <div key={item.label} style={{
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"12px 16px", borderRadius:10,
                      background:T.bg, border:`1px solid ${T.border}`
                    }}>
                      <span style={{ fontSize:12, color:T.textSec, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>{item.label}</span>
                      <span style={{ fontSize:13, color:T.textPri, fontFamily:"'Sora',sans-serif", fontWeight:600 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                background:T.bgCard, borderRadius:16, border:`1px solid ${T.border}`,
                overflow:"hidden", boxShadow:"0 2px 12px rgba(11,21,38,0.04)", marginBottom:16
              }}>
                <div style={{
                  padding:"18px 22px", borderBottom:`1px solid ${T.border}`,
                  display:"flex", alignItems:"center", gap:10
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textPri} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span style={{ fontSize:14, fontWeight:600, color:T.textPri,
                    fontFamily:"'Sora',sans-serif" }}>Edit Account Details</span>
                </div>
                <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:16 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <label style={{ fontSize:11, color:T.textSec, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>NAME</label>
                    <input
                      value={editUser.name}
                      onChange={e => setEditUser(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:8,
                        fontSize:13, fontFamily:"'DM Sans',sans-serif", color:T.textPri, background:T.bg,
                        outline:"none", transition:"border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = T.teal}
                      onBlur={e => e.target.style.borderColor = T.border}
                    />
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <label style={{ fontSize:11, color:T.textSec, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={e => setEditUser(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:8,
                        fontSize:13, fontFamily:"'DM Sans',sans-serif", color:T.textPri, background:T.bg,
                        outline:"none", transition:"border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = T.teal}
                      onBlur={e => e.target.style.borderColor = T.border}
                    />
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <label style={{ fontSize:11, color:T.textSec, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>ROLE</label>
                    <input
                      value={editUser.role}
                      onChange={e => setEditUser(prev => ({ ...prev, role: e.target.value }))}
                      style={{
                        padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:8,
                        fontSize:13, fontFamily:"'DM Sans',sans-serif", color:T.textPri, background:T.bg,
                        outline:"none", transition:"border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = T.teal}
                      onBlur={e => e.target.style.borderColor = T.border}
                    />
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <label style={{ fontSize:11, color:T.textSec, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>PLAN</label>
                    <select
                      value={editUser.plan}
                      onChange={e => setEditUser(prev => ({ ...prev, plan: e.target.value }))}
                      style={{
                        padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:8,
                        fontSize:13, fontFamily:"'DM Sans',sans-serif", color:T.textPri, background:T.bg,
                        outline:"none", cursor:"pointer"
                      }}
                    >
                      <option value="Free">Free</option>
                      <option value="Starter">Starter</option>
                      <option value="Professional">Professional</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:10 }}>
                    <button
                      onClick={() => setIsEditingAccount(false)}
                      style={{
                        padding:"8px 16px", borderRadius:8, border:`1px solid ${T.border}`,
                        background:"transparent", color:T.textSec, fontSize:13, fontWeight:500,
                        cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = T.textPri}
                      onMouseLeave={e => e.currentTarget.style.color = T.textSec}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setUser(editUser);
                        try { localStorage.setItem("lumiq-user-details", JSON.stringify(editUser)); } catch {}
                        setIsEditingAccount(false);
                      }}
                      style={{
                        padding:"8px 18px", borderRadius:8, border:"none",
                        background:`linear-gradient(135deg, ${T.teal}, ${T.tealDim})`,
                        color:"#fff", fontSize:13, fontWeight:600,
                        cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                        boxShadow:`0 2px 8px ${T.tealGlow}`
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Card */}
            <div style={{
              background:T.bgCard, borderRadius:16, border:`1px solid ${T.border}`,
              overflow:"hidden", boxShadow:"0 2px 12px rgba(11,21,38,0.04)"
            }}>
              <div style={{
                padding:"18px 22px", borderBottom:`1px solid ${T.border}`,
                display:"flex", alignItems:"center", gap:10
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textPri} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span style={{ fontSize:14, fontWeight:600, color:T.textPri,
                  fontFamily:"'Sora',sans-serif" }}>Notifications</span>
              </div>
              <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { label:"Email alerts for critical issues", enabled:true },
                  { label:"Weekly sentiment digest", enabled:true },
                  { label:"New review notifications", enabled:false },
                ].map((item, i) => (
                  <div key={i} style={{
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"12px 16px", borderRadius:10,
                    background:T.bg, border:`1px solid ${T.border}`
                  }}>
                    <span style={{ fontSize:12, color:T.textPri, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>{item.label}</span>
                    <div style={{
                      width:40, height:22, borderRadius:99,
                      background: item.enabled ? T.teal : T.border,
                      position:"relative", cursor:"pointer",
                      transition:"background 0.2s"
                    }}>
                      <div style={{
                        width:16, height:16, borderRadius:"50%", background:"#fff",
                        position:"absolute", top:3,
                        left: item.enabled ? 21 : 3,
                        transition:"left 0.2s",
                        boxShadow:"0 1px 3px rgba(0,0,0,0.15)"
                      }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeNav === "Competitors" ? (
          <CompetitorPage />
        ) : activeNav === "Review Agent" ? (
          <ReviewAgent />
        ) : (
          <>


          {/* KPI strip */}
          <div style={{ display:"flex", gap:16, marginBottom:24 }}>
            <KpiCard label="Total Products" value="9" sub="Across 5 platforms" icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            } color={T.violet} trend={+12.5}/>
            <KpiCard label="Avg Sentiment" value={`${avgSentiment}%`} sub="Across all reviews" icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            } color={T.teal} trend={+3.8}/>
            <KpiCard label="Avg Rating" value={avgRating} sub="Weighted average" icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            } color={T.amber} trend={-0.3}/>
            <KpiCard label="Alerts" value={String(ALERTS.length)} sub={`${criticalCount} critical · ${watchCount} watch`} icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            } color={T.coral}/>
          </div>

          <div style={{ display:"flex", gap:20 }}>

            {/* Left: tabs + grid */}
            <div style={{ flex:1, minWidth:0 }}>

              {/* Tabs + count */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{
                  display:"flex", gap:4,
                  background:T.bgCard, padding:5, borderRadius:12,
                  border:`1px solid ${T.border}`,
                  boxShadow:"0 1px 6px rgba(11,21,38,0.04)"
                }}>
                  {tabs.map(tab => {
                    const active = activeTab === tab.key;
                    return (
                      <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                        padding:"7px 14px", borderRadius:8, border:"none", cursor:"pointer",
                        background: active ? T.navy : "transparent",
                        color: active ? "#fff" : T.textSec,
                        fontSize:12, fontWeight: active ? 600 : 400,
                        fontFamily:"'DM Sans',sans-serif",
                        transition:"all 0.18s",
                        display:"flex", alignItems:"center", gap:6
                      }}>
                        {tab.label}
                        <span style={{
                          padding:"1px 6px", borderRadius:99,
                          background: active ? "rgba(255,255,255,0.15)" : T.bg,
                          color: active ? "rgba(255,255,255,0.85)" : T.textMut,
                          fontSize:10, fontWeight:600, fontFamily:"'Sora',sans-serif"
                        }}>{tab.count}</span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color:T.textMut, fontFamily:"'DM Sans',sans-serif" }}>
                    {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                  </span>
                  <button style={{
                    padding:"7px 14px", borderRadius:8,
                    border:`1px solid ${T.border}`, background:T.bgCard,
                    fontSize:12, color:T.textSec, cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif",
                    display:"flex", alignItems:"center", gap:6
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                    </svg>
                    Sort
                  </button>
                  <button style={{
                    padding:"7px 14px", borderRadius:8,
                    border:`1px solid ${T.border}`, background:T.bgCard,
                    fontSize:12, color:T.textSec, cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif",
                    display:"flex", alignItems:"center", gap:6
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                    </svg>
                    Filter
                  </button>
                </div>
              </div>

              {/* Product grid */}
              {filtered.length > 0 ? (
                <div style={{
                  display:"grid",
                  gridTemplateColumns:"repeat(auto-fill, minmax(286px, 1fr))",
                  gap:16
                }}>
                  {filtered.map((p, i) => (
                    <div key={p.id} className="card-enter"
                      style={{ animationDelay:`${i * 60}ms` }}>
                      <ProductCard p={p} idx={i}/>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign:"center", padding:"60px 20px",
                  background:T.bgCard, borderRadius:16, border:`1px solid ${T.border}`
                }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
                  <div style={{ fontSize:15, fontWeight:600, color:T.textPri,
                    fontFamily:"'Sora',sans-serif", marginBottom:6 }}>No products found</div>
                  <div style={{ fontSize:13, color:T.textMut, fontFamily:"'DM Sans',sans-serif" }}>
                    Try adjusting your search or filter
                  </div>
                </div>
              )}
            </div>

            {/* Right: Alerts Panel */}
            <aside style={{ width:300, flexShrink:0 }}>

              {/* Alerts */}
              <div style={{
                background:T.bgCard, borderRadius:16, border:`1px solid ${T.border}`,
                overflow:"hidden", marginBottom:16,
                boxShadow:"0 2px 12px rgba(11,21,38,0.04)"
              }}>
                <div style={{
                  padding:"16px 18px", borderBottom:`1px solid ${T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"space-between"
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:T.coral }} className="live-dot"/>
                    <span style={{ fontSize:13, fontWeight:600, color:T.textPri,
                      fontFamily:"'Sora',sans-serif" }}>Live Alerts</span>
                  </div>
                  <span style={{
                    fontSize:10, fontWeight:700, color:T.coral,
                    background:T.coralDim, padding:"2px 8px", borderRadius:99,
                    fontFamily:"'Sora',sans-serif"
                  }}>{liveAlerts.length} new</span>
                </div>
                <div>
                  {liveAlerts.length === 0 ? (
                    <div style={{ padding:"24px 18px", textAlign:"center" }}>
                      <div style={{ fontSize:20, marginBottom:6 }}>✅</div>
                      <div style={{ fontSize:12, color:T.textMut, fontFamily:"'DM Sans',sans-serif" }}>All clear — no active alerts</div>
                    </div>
                  ) : liveAlerts.map((a, i) => {
                    const ic = { critical:T.coral, warning:T.amber, info:T.teal }[a.type];
                    return (
                      <div key={a.id} style={{
                        padding:"13px 18px",
                        borderBottom: i < liveAlerts.length-1 ? `1px solid ${T.border}` : "none",
                        cursor:"pointer",
                        transition:"background 0.15s",
                        position:"relative"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.bg; e.currentTarget.querySelector('.dismiss-btn').style.opacity = '1'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.querySelector('.dismiss-btn').style.opacity = '0'; }}>
                        <div style={{ display:"flex", gap:10 }}>
                          <div style={{ width:7, height:7, borderRadius:"50%", background:ic,
                            marginTop:5, flexShrink:0 }}/>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:11, fontWeight:600, color:T.textPri,
                              fontFamily:"'Sora',sans-serif", marginBottom:3,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {a.product}
                            </div>
                            <div style={{ fontSize:11, color:T.textSec,
                              fontFamily:"'DM Sans',sans-serif", lineHeight:1.4, marginBottom:4 }}>
                              {a.msg}
                            </div>
                            <div style={{ fontSize:10, color:T.textMut,
                              fontFamily:"'DM Sans',sans-serif" }}>{a.time}</div>
                          </div>
                          <button className="dismiss-btn" onClick={(e) => { e.stopPropagation(); dismissAlert(a.id); }} style={{
                            position:"absolute", top:10, right:12,
                            width:22, height:22, borderRadius:6,
                            border:`1px solid ${T.border}`, background:T.bgCard,
                            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                            color:T.textMut, opacity:0, transition:"opacity 0.15s, background 0.15s",
                            fontSize:12, fontWeight:600, lineHeight:1, padding:0
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = T.coralDim}
                          onMouseLeave={e => e.currentTarget.style.background = T.bgCard}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Platform Sentiment */}
              <div style={{
                background:T.bgCard, borderRadius:16, border:`1px solid ${T.border}`,
                overflow:"hidden", boxShadow:"0 2px 12px rgba(11,21,38,0.04)"
              }}>
                <div style={{ padding:"16px 18px", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:13, fontWeight:600, color:T.textPri,
                    fontFamily:"'Sora',sans-serif" }}>Sentiment by Platform</span>
                </div>
                <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:14 }}>
                  {Object.entries(PLATFORMS).map(([key, p]) => {
                    const platProducts = PRODUCTS.filter(pr => pr.platform === key);
                    if (platProducts.length === 0) return null;
                    const avgSent = Math.round(platProducts.reduce((s, pr) => s + pr.sentiment, 0) / platProducts.length);
                    const sentColor = avgSent >= 75 ? T.teal : avgSent >= 50 ? T.amber : T.coral;
                    return (
                      <div key={key}>
                        <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"center", marginBottom:6 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <div style={{ width:8, height:8, borderRadius:"50%", background:p.color }}/>
                            <span style={{ fontSize:12, fontWeight:500, color:T.textPri,
                              fontFamily:"'DM Sans',sans-serif" }}>{p.label}</span>
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:sentColor,
                            fontFamily:"'Sora',sans-serif" }}>{avgSent}%</span>
                        </div>
                        <div style={{ height:5, background:T.border, borderRadius:99, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${avgSent}%`, borderRadius:99,
                            background:`linear-gradient(90deg, ${sentColor}, ${sentColor}bb)`,
                            transition:"width 1s cubic-bezier(0.4,0,0.2,1)" }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </aside>
          </div>

          {/* Footer */}
          <div style={{ marginTop:28, paddingTop:18, borderTop:`1px solid ${T.border}`,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:11, color:T.textMut, fontFamily:"'DM Sans',sans-serif" }}>
              Last synced · 2 minutes ago
            </span>
            <span style={{ fontSize:11, color:T.textMut, fontFamily:"'DM Sans',sans-serif" }}>
              LumIQ v1.0
            </span>
          </div>
          </>
        )}
        </div>
      </main>

      {/* Floating Generate Report Button */}
      <button style={{
        position:"fixed", bottom:28, right:32, zIndex:100,
        padding:"13px 26px", borderRadius:14,
        background:`linear-gradient(135deg, ${T.teal}, ${T.tealDim})`,
        border:"none", cursor:"pointer",
        color:"#fff", fontSize:14, fontWeight:700,
        fontFamily:"'Sora',sans-serif",
        display:"flex", alignItems:"center", gap:10,
        boxShadow:`0 8px 30px rgba(0,201,167,0.35), 0 2px 8px rgba(0,0,0,0.10)`,
        transition:"transform 0.2s, box-shadow 0.2s",
        letterSpacing:"-0.01em"
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,201,167,0.45), 0 4px 12px rgba(0,0,0,0.12)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,201,167,0.35), 0 2px 8px rgba(0,0,0,0.10)`; }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        Generate Report
      </button>
    </div>
    </ThemeContext.Provider>
  );
}
