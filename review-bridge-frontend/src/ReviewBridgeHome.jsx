import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');`;

const C = {
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
  { icon:"⬡", label:"Competitors", active: false },
  { icon:"⬡", label:"Reports",     active: false },
  { icon:"⬡", label:"Settings",    active: false },
];

const NAV_ICONS = {
  "Overview":    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  "Products":    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  "Analytics":   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  "Competitors": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  "Reports":     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  "Settings":    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

function StarRating({ rating }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? C.amber : "#E4EAF4"}
          stroke={i <= Math.round(rating) ? C.amber : "#D0DAF0"}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize:11, fontWeight:600, color:C.textPri, marginLeft:3, fontFamily:"'Sora',sans-serif" }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function SentimentBar({ value }) {
  const color = value >= 75 ? C.teal : value >= 50 ? C.amber : C.coral;
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
        <span style={{ fontSize:10, color:C.textSec, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>Sentiment</span>
        <span style={{ fontSize:12, fontWeight:700, color, fontFamily:"'Sora',sans-serif" }}>{value}%</span>
      </div>
      <div style={{ height:5, background:C.border, borderRadius:99, overflow:"hidden" }}>
        <div style={{
          height:"100%", width:`${value}%`, background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          borderRadius:99, transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"
        }}/>
      </div>
    </div>
  );
}

function TrendBadge({ value }) {
  const up = value >= 0;
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:3,
      padding:"3px 8px", borderRadius:99,
      background: up ? C.greenDim : C.redDim,
      color: up ? C.green : C.coral,
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
  const map = { healthy:C.green, watch:C.amber, critical:C.coral };
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
  const [hovered, setHovered] = useState(false);
  const statusBorder = { healthy:"transparent", watch:`${C.amber}50`, critical:`${C.coral}60` };
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:C.bgCard,
        border:`1px solid ${hovered ? C.borderDark : C.border}`,
        borderTop:`3px solid ${statusBorder[p.status] !== "transparent" ? statusBorder[p.status] : hovered ? C.teal : C.border}`,
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
          background:C.coral, color:"#fff",
          width:20, height:20, borderRadius:"50%",
          fontSize:10, fontWeight:700, fontFamily:"'Sora',sans-serif",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 0 0 3px ${C.coralDim}`
        }}>{p.alerts}</div>
      )}

      <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:16 }}>
        <div style={{
          width:52, height:52, borderRadius:12, flexShrink:0,
          background:`linear-gradient(135deg, ${C.bg}, ${C.border})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:24, border:`1px solid ${C.border}`
        }}>{p.img}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.textPri, lineHeight:1.35,
            fontFamily:"'Sora',sans-serif", marginBottom:5,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {p.name}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, color:C.textMut, fontFamily:"'DM Sans',sans-serif" }}>{p.sku}</span>
            <span style={{ fontSize:10, color:C.textMut }}>·</span>
            <span style={{ fontSize:10, color:C.textSec, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>{p.category}</span>
          </div>
          <div style={{ marginTop:6 }}>
            <PlatformBadge platform={p.platform}/>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <StarRating rating={p.rating}/>
        <span style={{ fontSize:11, color:C.textMut, fontFamily:"'DM Sans',sans-serif" }}>
          {p.reviews.toLocaleString()} reviews
        </span>
      </div>

      <div style={{ marginBottom:14 }}>
        <SentimentBar value={p.sentiment}/>
      </div>

      <div style={{
        padding:"10px 12px", borderRadius:10,
        background:C.bg, marginBottom:14,
        border:`1px solid ${C.border}`
      }}>
        <div style={{ fontSize:10, color:C.textMut, fontFamily:"'DM Sans',sans-serif",
          fontWeight:500, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.05em" }}>
          Top insight
        </div>
        <div style={{ fontSize:11, color:C.textSec, fontFamily:"'DM Sans',sans-serif",
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
  return (
    <div style={{
      background:C.bgCard, borderRadius:16, padding:"20px 22px",
      border:`1px solid ${C.border}`, flex:1, minWidth:0,
      boxShadow:"0 2px 12px rgba(11,21,38,0.04)",
      position:"relative", overflow:"hidden"
    }}>
      <div style={{
        position:"absolute", right:-10, top:-10,
        width:72, height:72, borderRadius:"50%",
        background:`${color}12`
      }}/>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ fontSize:12, fontWeight:500, color:C.textSec,
          fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.02em" }}>{label}</div>
        <div style={{ width:36, height:36, borderRadius:10,
          background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center",
          color, fontSize:16 }}>{icon}</div>
      </div>
      <div style={{ fontSize:28, fontWeight:700, color:C.textPri,
        fontFamily:"'Sora',sans-serif", marginBottom:4, letterSpacing:"-0.02em" }}>{value}</div>
      <div style={{ fontSize:11, color:C.textMut, fontFamily:"'DM Sans',sans-serif" }}>{sub}</div>
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
  const searchRef = useRef(null);

  const dismissAlert = (id) => setLiveAlerts(prev => prev.filter(a => a.id !== id));

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'DM Sans', sans-serif; background: ${C.bg}; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
      ::-webkit-scrollbar-thumb:hover { background: ${C.borderDark}; }
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0); }
      }
      .card-enter { animation: fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both; }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      .live-dot { animation: pulse 2s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
    setTimeout(() => setMounted(true), 50);
  }, []);

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
    <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside style={{
        width:230, flexShrink:0,
        background:C.navy,
        display:"flex", flexDirection:"column",
        padding:"0",
        borderRight:"none",
        position:"relative", zIndex:10,
      }}>
        {/* Logo */}
        <div style={{ padding:"24px 22px 20px", borderBottom:`1px solid ${C.navyLight}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:`linear-gradient(135deg, ${C.teal}, ${C.tealDim})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 4px 14px ${C.tealGlow}`
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff",
                fontFamily:"'Sora',sans-serif", letterSpacing:"-0.01em" }}>LumIQ</div>
              <div style={{ fontSize:10, color:`${C.teal}bb`, fontFamily:"'DM Sans',sans-serif",
                fontWeight:500 }}>Review Intelligence</div>
            </div>
          </div>
        </div>

        {/* Brand chip */}
        <div style={{ padding:"14px 22px", borderBottom:`1px solid ${C.navyLight}` }}>
          <div style={{ fontSize:10, color:"#ffffff50", fontWeight:500,
            textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8,
            fontFamily:"'DM Sans',sans-serif" }}>Active Brand</div>
          <div style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"10px 12px", borderRadius:10,
            background:C.navyLight, border:`1px solid ${C.navyMid}`
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
                background: isActive ? C.tealGlow : "transparent",
                color: isActive ? C.teal : "#ffffff70",
                transition:"all 0.18s",
                width:"100%", textAlign:"left",
                borderLeft: isActive ? `2px solid ${C.teal}` : "2px solid transparent",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#ffffff08"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ flexShrink:0 }}>{NAV_ICONS[item]}</span>
                <span style={{ fontSize:13, fontWeight: isActive ? 600 : 400,
                  fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.01em" }}>{item}</span>
                {item === "Overview" && (
                  <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%",
                    background:C.teal }} className="live-dot"/>
                )}
              </button>
            );
          })}

          <div style={{ marginTop:16, fontSize:10, color:"#ffffff40", fontWeight:500,
            textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8, paddingLeft:8,
            fontFamily:"'DM Sans',sans-serif" }}>Alerts</div>
          <div style={{
            padding:"12px", borderRadius:10,
            background:`${C.coral}18`, border:`1px solid ${C.coral}30`
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:600, color:C.coral,
                fontFamily:"'Sora',sans-serif" }}>Active Issues</span>
              <div style={{ background:C.coral, color:"#fff", borderRadius:99,
                fontSize:10, fontWeight:700, padding:"1px 7px",
                fontFamily:"'Sora',sans-serif" }}>{criticalCount + watchCount}</div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:700, color:C.coral,
                  fontFamily:"'Sora',sans-serif" }}>{criticalCount}</div>
                <div style={{ fontSize:9, color:`${C.coral}90`,
                  fontFamily:"'DM Sans',sans-serif" }}>Critical</div>
              </div>
              <div style={{ width:1, background:`${C.coral}30` }}/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:700, color:C.amber,
                  fontFamily:"'Sora',sans-serif" }}>{watchCount}</div>
                <div style={{ fontSize:9, color:`${C.amber}90`,
                  fontFamily:"'DM Sans',sans-serif" }}>Watch</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Profile */}
        <div style={{
          padding:"16px 22px", borderTop:`1px solid ${C.navyLight}`,
          display:"flex", alignItems:"center", gap:12
        }}>
          <div style={{
            width:38, height:38, borderRadius:10, flexShrink:0,
            background:`linear-gradient(135deg, ${C.teal}, #0099CC)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:15, fontWeight:700, color:"#fff", fontFamily:"'Sora',sans-serif",
            border:`2px solid ${C.tealGlow}`
          }}>H</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#fff",
              fontFamily:"'Sora',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              Harsh Sharma
            </div>
            <div style={{ fontSize:10, color:"#ffffff50", fontFamily:"'DM Sans',sans-serif" }}>Brand Analyst</div>
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
          background:C.bgCard, borderBottom:`1px solid ${C.border}`,
          padding:"12px 28px", minHeight:82,
          display:"flex", alignItems:"center", gap:20, flexShrink:0,
          boxShadow:"0 1px 12px rgba(11,21,38,0.04)"
        }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:500, color:C.textSec, fontFamily:"'DM Sans',sans-serif", marginBottom:4 }}>
              Welcome Harsh 👋
            </div>
            <div style={{ fontSize:19, fontWeight:700, color:C.textPri,
              fontFamily:"'Sora',sans-serif", letterSpacing:"-0.01em" }}>
              Product Intelligence Overview
            </div>
          </div>

          {/* Date Range Picker */}
          <div style={{
            display:"flex", gap:3,
            background:C.bg, padding:4, borderRadius:10,
            border:`1px solid ${C.border}`
          }}>
            {[{key:"7d",label:"7D"},{key:"30d",label:"30D"},{key:"90d",label:"90D"},{key:"1y",label:"1Y"}].map(r => {
              const active = dateRange === r.key;
              return (
                <button key={r.key} onClick={() => setDateRange(r.key)} style={{
                  padding:"6px 12px", borderRadius:7, border:"none", cursor:"pointer",
                  background: active ? C.navy : "transparent",
                  color: active ? "#fff" : C.textSec,
                  fontSize:11, fontWeight: active ? 700 : 500,
                  fontFamily:"'Sora',sans-serif",
                  transition:"all 0.18s",
                  letterSpacing:"0.02em"
                }}>{r.label}</button>
              );
            })}
            <button style={{
              padding:"6px 10px", borderRadius:7, border:"none", cursor:"pointer",
              background:"transparent", color:C.textSec,
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
              color: searchFocused ? C.teal : C.textMut, transition:"color 0.2s"
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
                border:`1.5px solid ${searchFocused ? C.teal : C.border}`,
                borderRadius:10, outline:"none",
                fontSize:13, fontFamily:"'DM Sans',sans-serif",
                color:C.textPri, background:searchFocused ? "#fff" : C.bg,
                transition:"all 0.2s",
                boxShadow: searchFocused ? `0 0 0 3px ${C.tealGlow}` : "none"
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{
                position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer",
                color:C.textMut, padding:2
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
            background:C.greenDim, border:`1px solid ${C.green}30`
          }}>
            <div className="live-dot" style={{ width:7, height:7, borderRadius:"50%", background:C.green }}/>
            <span style={{ fontSize:11, fontWeight:600, color:C.green,
              fontFamily:"'DM Sans',sans-serif" }}>Live</span>
          </div>

          {/* Notif */}
          <div style={{ position:"relative" }}>
            <button style={{
              width:40, height:40, borderRadius:10, border:`1px solid ${C.border}`,
              background:C.bg, cursor:"pointer", display:"flex",
              alignItems:"center", justifyContent:"center", color:C.textSec
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div style={{
              position:"absolute", top:8, right:8,
              width:8, height:8, borderRadius:"50%",
              background:C.coral, border:"2px solid #fff"
            }}/>
          </div>

          {/* Avatar */}
          <div style={{
            width:40, height:40, borderRadius:10,
            background:`linear-gradient(135deg, ${C.teal}, #0099CC)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:15, fontWeight:700, color:"#fff", fontFamily:"'Sora',sans-serif",
            cursor:"pointer", border:`2px solid ${C.tealGlow}`
          }}>H</div>
        </header>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>

          {/* KPI strip */}
          <div style={{ display:"flex", gap:16, marginBottom:24 }}>
            <KpiCard label="Total Products" value="9" sub="Across 5 platforms" icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            } color={C.violet} trend={+12.5}/>
            <KpiCard label="Avg Sentiment" value={`${avgSentiment}%`} sub="Across all reviews" icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            } color={C.teal} trend={+3.8}/>
            <KpiCard label="Avg Rating" value={avgRating} sub="Weighted average" icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            } color={C.amber} trend={-0.3}/>
            <KpiCard label="Alerts" value={String(ALERTS.length)} sub={`${criticalCount} critical · ${watchCount} watch`} icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            } color={C.coral}/>
          </div>

          <div style={{ display:"flex", gap:20 }}>

            {/* Left: tabs + grid */}
            <div style={{ flex:1, minWidth:0 }}>

              {/* Tabs + count */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{
                  display:"flex", gap:4,
                  background:C.bgCard, padding:5, borderRadius:12,
                  border:`1px solid ${C.border}`,
                  boxShadow:"0 1px 6px rgba(11,21,38,0.04)"
                }}>
                  {tabs.map(tab => {
                    const active = activeTab === tab.key;
                    return (
                      <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                        padding:"7px 14px", borderRadius:8, border:"none", cursor:"pointer",
                        background: active ? C.navy : "transparent",
                        color: active ? "#fff" : C.textSec,
                        fontSize:12, fontWeight: active ? 600 : 400,
                        fontFamily:"'DM Sans',sans-serif",
                        transition:"all 0.18s",
                        display:"flex", alignItems:"center", gap:6
                      }}>
                        {tab.label}
                        <span style={{
                          padding:"1px 6px", borderRadius:99,
                          background: active ? "rgba(255,255,255,0.15)" : C.bg,
                          color: active ? "rgba(255,255,255,0.85)" : C.textMut,
                          fontSize:10, fontWeight:600, fontFamily:"'Sora',sans-serif"
                        }}>{tab.count}</span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color:C.textMut, fontFamily:"'DM Sans',sans-serif" }}>
                    {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                  </span>
                  <button style={{
                    padding:"7px 14px", borderRadius:8,
                    border:`1px solid ${C.border}`, background:C.bgCard,
                    fontSize:12, color:C.textSec, cursor:"pointer",
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
                    border:`1px solid ${C.border}`, background:C.bgCard,
                    fontSize:12, color:C.textSec, cursor:"pointer",
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
                  background:C.bgCard, borderRadius:16, border:`1px solid ${C.border}`
                }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
                  <div style={{ fontSize:15, fontWeight:600, color:C.textPri,
                    fontFamily:"'Sora',sans-serif", marginBottom:6 }}>No products found</div>
                  <div style={{ fontSize:13, color:C.textMut, fontFamily:"'DM Sans',sans-serif" }}>
                    Try adjusting your search or filter
                  </div>
                </div>
              )}
            </div>

            {/* Right: Alerts Panel */}
            <aside style={{ width:300, flexShrink:0 }}>

              {/* Alerts */}
              <div style={{
                background:C.bgCard, borderRadius:16, border:`1px solid ${C.border}`,
                overflow:"hidden", marginBottom:16,
                boxShadow:"0 2px 12px rgba(11,21,38,0.04)"
              }}>
                <div style={{
                  padding:"16px 18px", borderBottom:`1px solid ${C.border}`,
                  display:"flex", alignItems:"center", justifyContent:"space-between"
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:C.coral }} className="live-dot"/>
                    <span style={{ fontSize:13, fontWeight:600, color:C.textPri,
                      fontFamily:"'Sora',sans-serif" }}>Live Alerts</span>
                  </div>
                  <span style={{
                    fontSize:10, fontWeight:700, color:C.coral,
                    background:C.coralDim, padding:"2px 8px", borderRadius:99,
                    fontFamily:"'Sora',sans-serif"
                  }}>{liveAlerts.length} new</span>
                </div>
                <div>
                  {liveAlerts.length === 0 ? (
                    <div style={{ padding:"24px 18px", textAlign:"center" }}>
                      <div style={{ fontSize:20, marginBottom:6 }}>✅</div>
                      <div style={{ fontSize:12, color:C.textMut, fontFamily:"'DM Sans',sans-serif" }}>All clear — no active alerts</div>
                    </div>
                  ) : liveAlerts.map((a, i) => {
                    const ic = { critical:C.coral, warning:C.amber, info:C.teal }[a.type];
                    return (
                      <div key={a.id} style={{
                        padding:"13px 18px",
                        borderBottom: i < liveAlerts.length-1 ? `1px solid ${C.border}` : "none",
                        cursor:"pointer",
                        transition:"background 0.15s",
                        position:"relative"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.bg; e.currentTarget.querySelector('.dismiss-btn').style.opacity = '1'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.querySelector('.dismiss-btn').style.opacity = '0'; }}>
                        <div style={{ display:"flex", gap:10 }}>
                          <div style={{ width:7, height:7, borderRadius:"50%", background:ic,
                            marginTop:5, flexShrink:0 }}/>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:11, fontWeight:600, color:C.textPri,
                              fontFamily:"'Sora',sans-serif", marginBottom:3,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {a.product}
                            </div>
                            <div style={{ fontSize:11, color:C.textSec,
                              fontFamily:"'DM Sans',sans-serif", lineHeight:1.4, marginBottom:4 }}>
                              {a.msg}
                            </div>
                            <div style={{ fontSize:10, color:C.textMut,
                              fontFamily:"'DM Sans',sans-serif" }}>{a.time}</div>
                          </div>
                          <button className="dismiss-btn" onClick={(e) => { e.stopPropagation(); dismissAlert(a.id); }} style={{
                            position:"absolute", top:10, right:12,
                            width:22, height:22, borderRadius:6,
                            border:`1px solid ${C.border}`, background:C.bgCard,
                            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                            color:C.textMut, opacity:0, transition:"opacity 0.15s, background 0.15s",
                            fontSize:12, fontWeight:600, lineHeight:1, padding:0
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = C.coralDim}
                          onMouseLeave={e => e.currentTarget.style.background = C.bgCard}>
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
                background:C.bgCard, borderRadius:16, border:`1px solid ${C.border}`,
                overflow:"hidden", boxShadow:"0 2px 12px rgba(11,21,38,0.04)"
              }}>
                <div style={{ padding:"16px 18px", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.textPri,
                    fontFamily:"'Sora',sans-serif" }}>Sentiment by Platform</span>
                </div>
                <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:14 }}>
                  {Object.entries(PLATFORMS).map(([key, p]) => {
                    const platProducts = PRODUCTS.filter(pr => pr.platform === key);
                    if (platProducts.length === 0) return null;
                    const avgSent = Math.round(platProducts.reduce((s, pr) => s + pr.sentiment, 0) / platProducts.length);
                    const sentColor = avgSent >= 75 ? C.teal : avgSent >= 50 ? C.amber : C.coral;
                    return (
                      <div key={key}>
                        <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"center", marginBottom:6 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <div style={{ width:8, height:8, borderRadius:"50%", background:p.color }}/>
                            <span style={{ fontSize:12, fontWeight:500, color:C.textPri,
                              fontFamily:"'DM Sans',sans-serif" }}>{p.label}</span>
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:sentColor,
                            fontFamily:"'Sora',sans-serif" }}>{avgSent}%</span>
                        </div>
                        <div style={{ height:5, background:C.border, borderRadius:99, overflow:"hidden" }}>
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
          <div style={{ marginTop:28, paddingTop:18, borderTop:`1px solid ${C.border}`,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:11, color:C.textMut, fontFamily:"'DM Sans',sans-serif" }}>
              Last synced · 2 minutes ago
            </span>
            <span style={{ fontSize:11, color:C.textMut, fontFamily:"'DM Sans',sans-serif" }}>
              LumIQ v1.0
            </span>
          </div>

        </div>
      </main>

      {/* Floating Generate Report Button */}
      <button style={{
        position:"fixed", bottom:28, right:32, zIndex:100,
        padding:"13px 26px", borderRadius:14,
        background:`linear-gradient(135deg, ${C.teal}, ${C.tealDim})`,
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
  );
}
