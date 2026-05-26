import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
//  BACKEND INTEGRATION MAP
//  Every API call is clearly marked. Replace MOCK_* constants
//  with real fetch() calls to your FastAPI endpoints.
//
//  GET /api/competitors?brand_id=:id          → competitor list
//  GET /api/competitors/:id/products          → competitor products
//  GET /api/compare?p1=:sku&p2=:sku           → side-by-side data
//  GET /api/reviews?product_id=:id&limit=5    → sample reviews
//  POST /api/competitors { brand_id, name, url } → add competitor
// ─────────────────────────────────────────────────────────────

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');`;

// ── Design tokens ───────────────────────────────────────────
const T = {
  bg:       "#060D1A",
  bg2:      "#0A1525",
  bg3:      "#0F1E35",
  surface:  "#132038",
  surface2: "#1A2A46",
  border:   "rgba(255,255,255,0.07)",
  border2:  "rgba(255,255,255,0.13)",
  teal:     "#00C9A7",
  tealDim:  "rgba(0,201,167,0.1)",
  teal2:    "rgba(0,201,167,0.18)",
  amber:    "#F5A623",
  amberDim: "rgba(245,166,35,0.12)",
  violet:   "#8B7FFF",
  coral:    "#FF6B6B",
  coralDim: "rgba(255,107,107,0.1)",
  green:    "#22C55E",
  greenDim: "rgba(34,197,94,0.1)",
  text:     "#E8F0FF",
  text2:    "#7A90AD",
  text3:    "#3D5470",
  h:        "'Bricolage Grotesque', sans-serif",
  b:        "'Plus Jakarta Sans', sans-serif",
};

// ── Competitor colors (each gets a unique identity) ─────────
const COMP_COLORS = ["#E07B54","#A78BFA","#38BDF8","#F472B6","#8B7FFF"];

// ══════════════════════════════════════════════════════════════
//  MOCK DATA  —  replace with API responses
// ══════════════════════════════════════════════════════════════
const MOCK_YOUR_BRAND = {
  id: "b1", name: "NovaBrand Co.", logo: "N",
  overallSentiment: 78, avgRating: 4.2, totalReviews: 14820,
  products: [
    { id:"p1", name:"Wireless Earbuds Pro",     sku:"SKU-8821", category:"Electronics", sentiment:82, rating:4.3, reviews:2841, trend:+6.2 },
    { id:"p2", name:"Cold Press Juicer 800W",   sku:"SKU-5590", category:"Appliances",  sentiment:91, rating:4.6, reviews:3672, trend:+11.3 },
    { id:"p3", name:"SPF 50+ Sunscreen 100ml",  sku:"SKU-7741", category:"Skincare",    sentiment:34, rating:2.9, reviews:887,  trend:-18.7 },
    { id:"p4", name:"Bamboo Yoga Mat 6mm",      sku:"SKU-3312", category:"Fitness",     sentiment:61, rating:3.8, reviews:1204, trend:-4.1 },
    { id:"p5", name:"DNA Ancestry Test Kit",    sku:"SKU-1092", category:"Biotech",     sentiment:88, rating:4.5, reviews:1043, trend:+4.5 },
  ]
};

const MOCK_COMPETITORS = [
  {
    id:"c1", name:"ZenAudio India", color:COMP_COLORS[0], logo:"Z",
    overallSentiment:72, avgRating:4.0, totalReviews:22400, market:"Electronics",
    tagline:"Affordable audio & wearables",
    products:[
      { id:"cp1", name:"ZenBuds X1 Pro",     sentiment:74, rating:4.0, reviews:8200, trend:+2.1 },
      { id:"cp2", name:"ZenBuds Ultra",       sentiment:68, rating:3.8, reviews:4100, trend:-3.4 },
      { id:"cp3", name:"ZenHeadphones NC200", sentiment:79, rating:4.2, reviews:6100, trend:+5.0 },
    ]
  },
  {
    id:"c2", name:"PureLife Wellness", color:COMP_COLORS[1], logo:"P",
    overallSentiment:81, avgRating:4.3, totalReviews:18600, market:"Health & Beauty",
    tagline:"Premium skincare & wellness",
    products:[
      { id:"cp4", name:"Clear Shield SPF 60",   sentiment:77, rating:4.1, reviews:5200, trend:+8.3 },
      { id:"cp5", name:"HydraGlow Sunscreen",   sentiment:84, rating:4.5, reviews:3900, trend:+12.1 },
      { id:"cp6", name:"Pure Vitamin C Serum",  sentiment:88, rating:4.7, reviews:7100, trend:+9.4 },
    ]
  },
  {
    id:"c3", name:"FitCore Gear", color:COMP_COLORS[2], logo:"F",
    overallSentiment:69, avgRating:3.9, totalReviews:9800, market:"Fitness",
    tagline:"Sports & fitness equipment",
    products:[
      { id:"cp7", name:"FitMat Premium 8mm", sentiment:71, rating:4.0, reviews:3200, trend:+1.2 },
      { id:"cp8", name:"FitMat Lite 4mm",    sentiment:65, rating:3.7, reviews:2400, trend:-2.8 },
    ]
  },
  {
    id:"c4", name:"KitchenCraft Pro", color:COMP_COLORS[3], logo:"K",
    overallSentiment:85, avgRating:4.5, totalReviews:31200, market:"Appliances",
    tagline:"Professional kitchen appliances",
    products:[
      { id:"cp9",  name:"SlowPress Juicer 900W", sentiment:88, rating:4.6, reviews:12400, trend:+7.8 },
      { id:"cp10", name:"ColdMaster Juicer 750W",sentiment:82, rating:4.3, reviews:8800,  trend:+3.2 },
    ]
  },
  {
    id:"c5", name:"GeneGuard Biotech", color:COMP_COLORS[4], logo:"G",
    overallSentiment:82, avgRating:4.4, totalReviews:12500, market:"Biotech",
    tagline:"Personalised genetics & health kits",
    products:[
      { id:"cp11", name:"GeneScan Ancestry & Health", sentiment:84, rating:4.4, reviews:6200, trend:+3.6 },
      { id:"cp12", name:"GeneScan Carrier Status Kit", sentiment:80, rating:4.2, reviews:4100, trend:+1.5 }
    ]
  }
];

// Mock detailed comparison data
const MOCK_COMPARISON = {
  "p5_cp11": {
    yourTopPraise:    ["Highly detailed ancestry breakdown", "Simple cheek-swab collection", "Fast 2-week processing"],
    yourTopIssues:    ["Privacy concerns", "App interface clunky", "Premium pricing"],
    theirTopPraise:   ["Comprehensive health reports", "Easy to register kit", "Good customer support"],
    theirTopIssues:   ["Took 6 weeks for results", "Reports hard to interpret", "Confusing raw data export"],
    yourReviews: [
      { text:"The ancestry breakdown was amazingly detailed. Understood my maternal lineage completely. Swab was super simple.", rating:5, platform:"Amazon", date:"2d ago" },
      { text:"Concerned about where my genetic data is stored. The app requires too many permissions.", rating:3, platform:"Google", date:"4d ago" },
      { text:"Got my results in exactly 12 days. Very impressed with the quick turnaround.", rating:5, platform:"Amazon", date:"1w ago" },
    ],
    theirReviews: [
      { text:"Loved the health reports, but it took almost 7 weeks to get the email that my results were ready.", rating:3, platform:"Amazon", date:"3d ago" },
      { text:"The report uses too much medical jargon. I had to Google half the terms to understand my risk levels.", rating:2, platform:"Google", date:"5d ago" },
      { text:"Excellent customer support when my kit got lost in the mail. They sent a replacement free.", rating:4, platform:"Amazon", date:"1w ago" },
    ],
    aiAnalysis: {
      verdict: "🏆 Processing Speed Advantage — You are beating them on convenience.",
      summary: "Your DNA Ancestry Test Kit is capturing significant market share due to your 2-week turnaround time (which customers praise heavily) compared to GeneScan's 6-week delay. However, GeneGuard's genetic health reporting is perceived as more comprehensive. Your primary threat is data privacy concerns and clunky app UX, which accounts for 24% of your negative feedback. If you clarify your data deletion policy and streamline app onboarding, you will secure a dominant market lead.",
      actions: [
        { priority:"high",  text:"Launch a prominent 'Privacy-First' marketing campaign highlighting your strict data-encryption & 1-click deletion options." },
        { priority:"high",  text:"Redesign the genetic report dashboard in your mobile app to resolve clunky navigation issues." },
        { priority:"med",   text:"Introduce basic wellness and health reports to directly challenge GeneGuard's feature set." },
        { priority:"low",   text:"Highlight the 2-week turnaround advantage in Amazon product listings." },
      ]
    }
  },
  "p1_cp1": {
    yourTopPraise:    ["Excellent sound quality","Long battery life","Comfortable fit"],
    yourTopIssues:    ["Bluetooth range","Touch controls unreliable","Case build quality"],
    theirTopPraise:   ["Great value for money","Simple pairing","Decent sound"],
    theirTopIssues:   ["Audio quality drops after 3 months","No noise cancellation","Loose fit"],
    yourReviews: [
      { text:"Amazing sound quality, bass is deep and clear. Battery lasts all day easily.", rating:5, platform:"Amazon", date:"3d ago" },
      { text:"The touch controls keep misfiring. Really frustrating for a ₹3K product.", rating:2, platform:"Flipkart", date:"5d ago" },
      { text:"Best earbuds I have owned. Call quality is superb too.", rating:5, platform:"Amazon", date:"1w ago" },
    ],
    theirReviews: [
      { text:"Good enough for the price. Sound is okay but nothing special.", rating:3, platform:"Amazon", date:"4d ago" },
      { text:"Started crackling in the right earbud after 2 months. Very disappointed.", rating:1, platform:"Flipkart", date:"6d ago" },
      { text:"Pairing is easy and battery is decent. Would recommend for budget buyers.", rating:4, platform:"Amazon", date:"1w ago" },
    ],
    aiAnalysis: {
      verdict: "You Win on Quality. They Win on Value Perception.",
      summary: "Your Wireless Earbuds Pro has significantly higher sentiment (82% vs 74%) and commands a premium position — customers consistently praise sound quality and battery life. However, your touch control issues are generating 18% of all negative reviews and dragging your score. Fix this one issue and your sentiment could reach 90%+. ZenBuds X1 Pro is winning with budget-conscious buyers who don't need premium features. They aren't a threat on quality — but their review volume (8,200 vs 2,841) means they rank higher on platform search, which affects discovery.",
      actions: [
        { priority:"high",  text:"Fix touch control firmware — 18% of your 1-star reviews cite this alone. One update could add 6–8 sentiment points." },
        { priority:"high",  text:"Generate more reviews — their 8,200 vs your 2,841 means they outrank you in search. Run a review request campaign." },
        { priority:"med",   text:"Lean into battery life messaging — it's your #1 praised feature and their #3 complained issue. Make it prominent in listings." },
        { priority:"low",   text:"Improve case build quality — minor complaint but mentioned in 9% of reviews. Easy win on materials." },
      ]
    }
  },
  "p3_cp4": {
    yourTopPraise:   ["Lightweight texture","Non-greasy finish","Fragrance-free"],
    yourTopIssues:   ["Severe white cast","Pills under makeup","Expensive for quantity"],
    theirTopPraise:  ["No white cast","Moisturising","Good for sensitive skin"],
    theirTopIssues:  ["Slightly sticky","Expensive","Takes time to absorb"],
    yourReviews:[
      { text:"Terrible white cast. Looks like I applied chalk on my face. Returning this.", rating:1, platform:"Flipkart", date:"2d ago"},
      { text:"No fragrance, love that. But yes the white cast is real on deeper skin tones.", rating:3, platform:"Amazon", date:"4d ago"},
      { text:"Very lightweight for SPF. Good for oily skin types.", rating:4, platform:"Google", date:"6d ago"},
    ],
    theirReviews:[
      { text:"Finally an SPF that doesn't leave white cast on brown skin! Absolutely love it.", rating:5, platform:"Amazon", date:"3d ago"},
      { text:"A bit sticky but works great. My skin feels protected without the chalky look.", rating:4, platform:"Flipkart", date:"5d ago"},
      { text:"Pricey but worth it for the no white cast formula.", rating:4, platform:"Amazon", date:"1w ago"},
    ],
    aiAnalysis: {
      verdict: "⚠️ Critical Gap — Their Formula Solves Your #1 Problem.",
      summary: "This is your most urgent competitive threat. PureLife's Clear Shield SPF 60 directly addresses the white cast issue that's destroying your sunscreen's reputation (41% of your 1-star reviews mention white cast). They have 77% sentiment vs your 34% — a 43-point gap. Indian consumers with deeper skin tones are specifically switching from your product to theirs. Your formulation needs to change. This is not a marketing problem — it's a product problem.",
      actions: [
        { priority:"high",  text:"Reformulate with UV filters that work on deeper skin tones (Tinosorb M/S instead of zinc oxide). This is non-negotiable." },
        { priority:"high",  text:"Until reformulation: reposition product explicitly for lighter skin tones only. Wrong targeting is generating wrong reviews." },
        { priority:"med",   text:"Consider launching a 'Invisible SPF' variant targeting Indian skin tones — PureLife proves there's clear demand and willingness to pay." },
        { priority:"low",   text:"Address pilling issue — second biggest complaint and easy fix with formulation tweaks." },
      ]
    }
  }
};

// ══════════════════════════════════════════════════════════════
//  SMALL COMPONENTS
// ══════════════════════════════════════════════════════════════
const s = (obj) => obj; // identity for inline style objects

function Pill({ children, type="neutral" }) {
  const map = {
    green:  { bg:"rgba(34,197,94,0.12)",   color:"#22C55E" },
    red:    { bg:"rgba(255,107,107,0.12)", color:"#FF6B6B" },
    amber:  { bg:"rgba(245,166,35,0.12)",  color:"#F5A623" },
    teal:   { bg:"rgba(0,201,167,0.12)",   color:"#00C9A7" },
    neutral:{ bg:"rgba(255,255,255,0.07)", color:"#7A90AD" },
  };
  const c = map[type] || map.neutral;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 9px", borderRadius:99,
      background:c.bg, color:c.color, fontSize:11, fontWeight:600, fontFamily:T.b }}>
      {children}
    </span>
  );
}

function SentimentBar({ value, color, height=6, animate=true }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW(value), 80); }, [value]);
  const c = color || (value >= 75 ? T.teal : value >= 50 ? T.amber : T.coral);
  return (
    <div style={{ height, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${animate ? w : value}%`, background:c,
        borderRadius:99, transition:"width 0.9s cubic-bezier(0.4,0,0.2,1)" }}/>
    </div>
  );
}

function TrendBadge({ v }) {
  const up = v >= 0;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:3, padding:"2px 8px",
      borderRadius:99, background: up ? T.greenDim : T.coralDim,
      color: up ? T.green : T.coral, fontSize:11, fontWeight:700, fontFamily:T.b }}>
      {up ? "↑" : "↓"} {Math.abs(v)}%
    </span>
  );
}

function Stars({ rating }) {
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? T.amber : "rgba(255,255,255,0.12)"}
          stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize:12, fontWeight:700, color:T.text, marginLeft:4, fontFamily:T.h }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function Avatar({ letter, color, size=36 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:10, flexShrink:0,
      background:`linear-gradient(135deg, ${color}, ${color}88)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:T.h, fontWeight:800, fontSize:size*0.42, color:"#fff",
      boxShadow:`0 4px 14px ${color}30` }}>
      {letter}
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, margin:"28px 0 20px" }}>
      <div style={{ flex:1, height:1, background:T.border }}/>
      <span style={{ fontSize:11, fontWeight:600, color:T.text3, textTransform:"uppercase",
        letterSpacing:"0.08em", fontFamily:T.b, whiteSpace:"nowrap" }}>{label}</span>
      <div style={{ flex:1, height:1, background:T.border }}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  LOADING SKELETON
// ══════════════════════════════════════════════════════════════
function Skeleton({ w="100%", h=14, r=6, style={} }) {
  return (
    <div style={{ width:w, height:h, borderRadius:r,
      background:"linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 100%)",
      backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite",
      flexShrink:0, ...style }}/>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function CompetitorPage() {
  const [selectedComp,   setSelectedComp]   = useState(MOCK_COMPETITORS[0]);
  const [yourProduct,    setYourProduct]    = useState(MOCK_YOUR_BRAND.products[0]);
  const [theirProduct,   setTheirProduct]   = useState(MOCK_COMPETITORS[0].products[0]);
  const [comparing,      setComparing]      = useState(false);
  const [compData,       setCompData]       = useState(null);
  const [loadingComp,    setLoadingComp]    = useState(false);
  const [addModal,       setAddModal]       = useState(false);
  const [activeTab,      setActiveTab]      = useState("overview"); // overview | compare | reviews | insights
  const [mounted,        setMounted]        = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + `
      *{box-sizing:border-box;margin:0;padding:0}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:99px}
      @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      .card-hover:hover{transform:translateY(-3px)!important;border-color:rgba(255,255,255,0.14)!important}
      .row-hover:hover{background:rgba(255,255,255,0.03)!important}
    `;
    document.head.appendChild(style);
    setTimeout(() => setMounted(true), 60);
  }, []);

  // Simulate loading comparison — replace with:
  // fetch(`/api/compare?p1=${yourProduct.id}&p2=${theirProduct.id}`)
  function loadComparison(yp, tp) {
    setLoadingComp(true);
    setCompData(null);
    setActiveTab("overview");
    setTimeout(() => {
      const key = `${yp.id}_${tp.id}`;
      const fallback = Object.values(MOCK_COMPARISON)[0];
      setCompData(MOCK_COMPARISON[key] || fallback);
      setLoadingComp(false);
      setComparing(true);
      setActiveTab("overview");
    }, 900);
  }

  function handleCompare() {
    loadComparison(yourProduct, theirProduct);
  }

  function handleSelectComp(comp) {
    setSelectedComp(comp);
    setTheirProduct(comp.products[0]);
    setComparing(false);
    setCompData(null);
  }

  const priorityColors = { high: T.coral, med: T.amber, low: T.teal };
  const priorityLabels = { high:"High priority", med:"Medium", low:"Nice to have" };

  return (
    <div style={{ background:T.bg, minHeight:"100vh", fontFamily:T.b, color:T.text,
      opacity: mounted ? 1 : 0, transition:"opacity 0.4s" }}>

      {/* ── Page Header ─────────────────────────────────── */}
      <div style={{ padding:"28px 32px 0", animation:"fadeUp 0.5s ease both" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:T.teal, animation:"pulse 2s infinite" }}/>
              <span style={{ fontSize:11, fontWeight:600, color:T.teal, textTransform:"uppercase",
                letterSpacing:"0.08em", fontFamily:T.b }}>Competitor Intelligence</span>
            </div>
            <h1 style={{ fontFamily:T.h, fontSize:28, fontWeight:800, color:T.text,
              letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:6 }}>
              Market Comparison
            </h1>
            <p style={{ fontSize:14, color:T.text2, lineHeight:1.6 }}>
              See how your products stack up against the competition — platform by platform, review by review.
            </p>
          </div>
          <div style={{ display:"flex", gap:10, flexShrink:0 }}>
            <button onClick={() => setAddModal(true)} style={{
              display:"flex", alignItems:"center", gap:7, padding:"10px 18px",
              background:T.surface, border:`1px solid ${T.border2}`, borderRadius:10,
              color:T.text2, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:T.b,
              transition:"all .2s"
            }}
            onMouseEnter={e=>{e.currentTarget.style.background=T.surface2;e.currentTarget.style.color=T.text}}
            onMouseLeave={e=>{e.currentTarget.style.background=T.surface;e.currentTarget.style.color=T.text2}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Competitor
            </button>
            <button style={{
              display:"flex", alignItems:"center", gap:7, padding:"10px 18px",
              background:T.amber, border:"none", borderRadius:10,
              color:"#080E1A", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:T.b,
              transition:"all .2s"
            }}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 32px 40px", display:"flex", gap:22 }}>

        {/* ── LEFT: Competitor Roster ────────────────────── */}
        <div style={{ width:250, flexShrink:0 }}>
          <div style={{ fontSize:11, fontWeight:600, color:T.text3, textTransform:"uppercase",
            letterSpacing:"0.08em", marginBottom:12, fontFamily:T.b }}>
            Tracked Competitors
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {MOCK_COMPETITORS.map((comp, i) => {
              const isActive = selectedComp.id === comp.id;
              const delta = comp.overallSentiment - MOCK_YOUR_BRAND.overallSentiment;
              return (
                <div key={comp.id} onClick={() => handleSelectComp(comp)}
                  className="card-hover"
                  style={{
                    background: isActive ? T.surface2 : T.bg3,
                    border: `1.5px solid ${isActive ? comp.color + "50" : T.border}`,
                    borderRadius:14, padding:"14px 14px", cursor:"pointer",
                    transition:"all .2s", animation:`fadeUp 0.5s ease ${i * 0.07}s both`,
                    boxShadow: isActive ? `0 0 0 1px ${comp.color}20, 0 8px 24px rgba(0,0,0,0.2)` : "none"
                  }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <Avatar letter={comp.logo} color={comp.color} size={34}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:T.text,
                        fontFamily:T.h, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {comp.name}
                      </div>
                      <div style={{ fontSize:11, color:T.text3, fontFamily:T.b }}>{comp.market}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <span style={{ fontSize:11, color:T.text3 }}>Sentiment</span>
                    <span style={{ fontSize:13, fontWeight:700, color: comp.overallSentiment > 75 ? T.teal : comp.overallSentiment > 50 ? T.amber : T.coral, fontFamily:T.h }}>{comp.overallSentiment}%</span>
                  </div>
                  <SentimentBar value={comp.overallSentiment} color={comp.color} height={4}/>
                  <div style={{ marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:11, color:T.text3 }}>{comp.products.length} products tracked</span>
                    <Pill type={delta > 0 ? "red" : "green"}>
                      {delta > 0 ? `They +${delta}` : `You +${Math.abs(delta)}`}
                    </Pill>
                  </div>
                </div>
              );
            })}

            {/* Add competitor ghost card */}
            <div onClick={() => setAddModal(true)} style={{
              background:"transparent", border:`1.5px dashed ${T.border}`,
              borderRadius:14, padding:"14px", cursor:"pointer", transition:"all .2s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              minHeight:54, color:T.text3, fontSize:13
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.border2;e.currentTarget.style.color=T.text2}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text3}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add competitor
            </div>
          </div>
        </div>

        {/* ── RIGHT: Main Panel ─────────────────────────── */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* Competitor summary banner */}
          <div style={{ background:T.bg3, border:`1px solid ${selectedComp.color}30`,
            borderRadius:16, padding:"20px 24px", marginBottom:20,
            animation:"fadeUp 0.5s ease 0.1s both",
            boxShadow:`0 0 40px ${selectedComp.color}08` }}>
            <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
              <Avatar letter={selectedComp.logo} color={selectedComp.color} size={52}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:T.h, fontSize:20, fontWeight:800, color:T.text,
                  letterSpacing:"-0.02em", marginBottom:3 }}>{selectedComp.name}</div>
                <div style={{ fontSize:13, color:T.text2 }}>{selectedComp.tagline}</div>
              </div>
              {/* KPIs */}
              {[
                { label:"Sentiment", value:`${selectedComp.overallSentiment}%`, color: selectedComp.overallSentiment > 75 ? T.teal : T.amber },
                { label:"Avg Rating", value:selectedComp.avgRating.toFixed(1), color:T.amber },
                { label:"Total Reviews", value:selectedComp.totalReviews.toLocaleString(), color:T.text },
                { label:"Products", value:selectedComp.products.length, color:T.text },
              ].map((kpi,i) => (
                <div key={i} style={{ textAlign:"center", padding:"10px 18px",
                  background:`rgba(255,255,255,0.04)`, borderRadius:10,
                  border:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:T.h, fontSize:22, fontWeight:800, color:kpi.color,
                    letterSpacing:"-0.02em", lineHeight:1 }}>{kpi.value}</div>
                  <div style={{ fontSize:11, color:T.text3, marginTop:3, fontFamily:T.b }}>{kpi.label}</div>
                </div>
              ))}

              {/* vs Your brand */}
              <div style={{ padding:"10px 14px", background:`${selectedComp.color}12`,
                border:`1px solid ${selectedComp.color}25`, borderRadius:10, textAlign:"center" }}>
                <div style={{ fontSize:11, color:T.text3, marginBottom:3 }}>vs Your Brand</div>
                {(() => {
                  const delta = selectedComp.overallSentiment - MOCK_YOUR_BRAND.overallSentiment;
                  return (
                    <div style={{ fontFamily:T.h, fontSize:16, fontWeight:800,
                      color: delta > 0 ? T.coral : T.green }}>
                      {delta > 0 ? `−${delta}` : `+${Math.abs(delta)}`}pts
                    </div>
                  );
                })()}
                <div style={{ fontSize:10, color:T.text3, marginTop:1 }}>Sentiment gap</div>
              </div>
            </div>
          </div>

          {/* Product selector + Compare CTA */}
          <div style={{ background:T.bg3, border:`1px solid ${T.border}`, borderRadius:16,
            padding:"20px 24px", marginBottom:20, animation:"fadeUp 0.5s ease 0.15s both" }}>
            <div style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:16, fontFamily:T.h }}>
              Choose products to compare head-to-head
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr auto", gap:12, alignItems:"end" }}>
              {/* Your product */}
              <div>
                <div style={{ fontSize:11, color:T.text3, marginBottom:6, textTransform:"uppercase",
                  letterSpacing:".06em", fontWeight:600 }}>Your product</div>
                <select value={yourProduct.id} onChange={e => {
                  const p = MOCK_YOUR_BRAND.products.find(x => x.id === e.target.value);
                  setYourProduct(p); setComparing(false);
                }} style={{
                  width:"100%", padding:"10px 12px", background:T.surface, border:`1.5px solid ${T.border2}`,
                  borderRadius:10, color:T.text, fontSize:13, fontFamily:T.b, cursor:"pointer", outline:"none"
                }}>
                  {MOCK_YOUR_BRAND.products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div style={{ marginTop:8, display:"flex", gap:6, alignItems:"center" }}>
                  <Stars rating={yourProduct.rating}/>
                  <span style={{ fontSize:11, color:T.text3 }}>({yourProduct.reviews.toLocaleString()})</span>
                  <TrendBadge v={yourProduct.trend}/>
                </div>
              </div>

              {/* VS badge */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
                padding:"0 4px", paddingBottom:28 }}>
                <div style={{ width:36, height:36, borderRadius:"50%",
                  background:`linear-gradient(135deg, ${T.teal}, ${T.violet})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:T.h, fontWeight:800, fontSize:11, color:"#fff" }}>VS</div>
              </div>

              {/* Their product */}
              <div>
                <div style={{ fontSize:11, color:T.text3, marginBottom:6, textTransform:"uppercase",
                  letterSpacing:".06em", fontWeight:600 }}>
                  {selectedComp.name}'s product
                </div>
                <select value={theirProduct.id} onChange={e => {
                  const p = selectedComp.products.find(x => x.id === e.target.value);
                  setTheirProduct(p); setComparing(false);
                }} style={{
                  width:"100%", padding:"10px 12px", background:T.surface, border:`1.5px solid ${selectedComp.color}40`,
                  borderRadius:10, color:T.text, fontSize:13, fontFamily:T.b, cursor:"pointer", outline:"none"
                }}>
                  {selectedComp.products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div style={{ marginTop:8, display:"flex", gap:6, alignItems:"center" }}>
                  <Stars rating={theirProduct.rating}/>
                  <span style={{ fontSize:11, color:T.text3 }}>({theirProduct.reviews.toLocaleString()})</span>
                  <TrendBadge v={theirProduct.trend}/>
                </div>
              </div>

              {/* Compare button */}
              <div style={{ paddingBottom:28 }}>
                <button onClick={handleCompare} disabled={loadingComp} style={{
                  padding:"10px 20px", background: loadingComp ? T.surface2 : T.teal,
                  border:"none", borderRadius:10, color: loadingComp ? T.text2 : "#060D1A",
                  fontSize:13, fontWeight:700, cursor: loadingComp ? "wait" : "pointer",
                  fontFamily:T.b, transition:"all .2s", whiteSpace:"nowrap",
                  display:"flex", alignItems:"center", gap:7
                }}>
                  {loadingComp ? (
                    <><span style={{ animation:"pulse 1s infinite" }}>●</span> Analysing…</>
                  ) : (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Compare</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Comparison Results ─────────────────────────── */}
          {loadingComp && (
            <div style={{ background:T.bg3, border:`1px solid ${T.border}`, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <Skeleton h={20} w="40%"/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {[...Array(4)].map((_,i) => <Skeleton key={i} h={80} r={12}/>)}
                </div>
                <Skeleton h={120} r={12}/>
              </div>
            </div>
          )}

          {comparing && compData && !loadingComp && (
            <div style={{ animation:"fadeUp 0.5s ease both" }}>

              {/* Tab navigation */}
              <div style={{ display:"flex", gap:4, marginBottom:16, padding:4,
                background:T.bg3, borderRadius:12, border:`1px solid ${T.border}`,
                width:"fit-content" }}>
                {[
                  { key:"overview", label:"Overview" },
                  { key:"topics",   label:"Top Topics" },
                  { key:"reviews",  label:"Real Reviews" },
                  { key:"insights", label:"AI Insights" },
                ].map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                    padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer",
                    background: activeTab === t.key ? T.surface2 : "transparent",
                    color: activeTab === t.key ? T.text : T.text2,
                    fontSize:13, fontWeight: activeTab === t.key ? 600 : 400,
                    fontFamily:T.b, transition:"all .18s",
                    boxShadow: activeTab === t.key ? "0 1px 4px rgba(0,0,0,0.2)" : "none"
                  }}>{t.label}</button>
                ))}
              </div>

              {/* ── TAB: OVERVIEW ────────────────────────── */}
              {activeTab === "overview" && (
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  {/* Side-by-side scorecard */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:0,
                    background:T.bg3, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>

                    {/* Your product */}
                    <div style={{ padding:"22px 24px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                        <div style={{ width:10, height:10, borderRadius:"50%", background:T.teal, flexShrink:0 }}/>
                        <span style={{ fontSize:12, fontWeight:600, color:T.teal, fontFamily:T.b,
                          textTransform:"uppercase", letterSpacing:"0.06em" }}>Your Product</span>
                      </div>
                      <div style={{ fontFamily:T.h, fontSize:17, fontWeight:700, color:T.text,
                        marginBottom:16, lineHeight:1.3 }}>{yourProduct.name}</div>
                      {[
                        { label:"Sentiment score", val:`${yourProduct.sentiment}%`, color: yourProduct.sentiment > 75 ? T.teal : yourProduct.sentiment > 50 ? T.amber : T.coral, barColor:T.teal, pct:yourProduct.sentiment },
                        { label:"Star rating",     val:yourProduct.rating.toFixed(1), color:T.amber, barColor:T.amber, pct:yourProduct.rating*20 },
                        { label:"Total reviews",   val:yourProduct.reviews.toLocaleString(), color:T.text, barColor:T.violet, pct:Math.min(100,(yourProduct.reviews/10000)*100) },
                      ].map((m,i) => (
                        <div key={i} style={{ marginBottom:14 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                            <span style={{ fontSize:12, color:T.text2 }}>{m.label}</span>
                            <span style={{ fontSize:14, fontWeight:700, color:m.color, fontFamily:T.h }}>{m.val}</span>
                          </div>
                          <SentimentBar value={m.pct} color={m.barColor} height={5}/>
                        </div>
                      ))}
                      <TrendBadge v={yourProduct.trend}/>
                      <span style={{ fontSize:11, color:T.text3, marginLeft:6 }}>7-day trend</span>
                    </div>

                    {/* Divider */}
                    <div style={{ width:1, background:T.border, position:"relative" }}>
                      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                        width:32, height:32, borderRadius:"50%", background:T.bg3,
                        border:`1px solid ${T.border2}`, display:"flex", alignItems:"center", justifyContent:"center",
                        fontFamily:T.h, fontWeight:800, fontSize:11, color:T.text3 }}>VS</div>
                    </div>

                    {/* Their product */}
                    <div style={{ padding:"22px 24px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                        <div style={{ width:10, height:10, borderRadius:"50%", background:selectedComp.color, flexShrink:0 }}/>
                        <span style={{ fontSize:12, fontWeight:600, color:selectedComp.color, fontFamily:T.b,
                          textTransform:"uppercase", letterSpacing:"0.06em" }}>{selectedComp.name}</span>
                      </div>
                      <div style={{ fontFamily:T.h, fontSize:17, fontWeight:700, color:T.text,
                        marginBottom:16, lineHeight:1.3 }}>{theirProduct.name}</div>
                      {[
                        { label:"Sentiment score", val:`${theirProduct.sentiment}%`, color: theirProduct.sentiment > 75 ? T.teal : theirProduct.sentiment > 50 ? T.amber : T.coral, barColor:selectedComp.color, pct:theirProduct.sentiment },
                        { label:"Star rating",     val:theirProduct.rating.toFixed(1), color:T.amber, barColor:T.amber, pct:theirProduct.rating*20 },
                        { label:"Total reviews",   val:theirProduct.reviews.toLocaleString(), color:T.text, barColor:selectedComp.color, pct:Math.min(100,(theirProduct.reviews/10000)*100) },
                      ].map((m,i) => (
                        <div key={i} style={{ marginBottom:14 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                            <span style={{ fontSize:12, color:T.text2 }}>{m.label}</span>
                            <span style={{ fontSize:14, fontWeight:700, color:m.color, fontFamily:T.h }}>{m.val}</span>
                          </div>
                          <SentimentBar value={m.pct} color={m.barColor} height={5}/>
                        </div>
                      ))}
                      <TrendBadge v={theirProduct.trend}/>
                      <span style={{ fontSize:11, color:T.text3, marginLeft:6 }}>7-day trend</span>
                    </div>
                  </div>

                  {/* Who wins where */}
                  <div style={{ background:T.bg3, border:`1px solid ${T.border}`, borderRadius:16, padding:"20px 24px" }}>
                    <div style={{ fontSize:14, fontWeight:600, color:T.text, fontFamily:T.h, marginBottom:16 }}>
                      Who wins on what?
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                      {[
                        { label:"Sentiment", yours:yourProduct.sentiment, theirs:theirProduct.sentiment, unit:"%" },
                        { label:"Rating",    yours:yourProduct.rating,    theirs:theirProduct.rating, unit:"★" },
                        { label:"Reviews",   yours:yourProduct.reviews,   theirs:theirProduct.reviews, unit:"" },
                        { label:"7d Trend",  yours:yourProduct.trend,     theirs:theirProduct.trend, unit:"%" },
                      ].map((item,i) => {
                        const youWin = item.yours > item.theirs;
                        const delta = item.yours - item.theirs;
                        return (
                          <div key={i} style={{ padding:"14px 16px", borderRadius:12,
                            background: youWin ? "rgba(0,201,167,0.06)" : `${selectedComp.color}08`,
                            border:`1px solid ${youWin ? "rgba(0,201,167,0.18)" : selectedComp.color+"20"}` }}>
                            <div style={{ fontSize:11, color:T.text3, marginBottom:8, fontWeight:500 }}>{item.label}</div>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                              <div>
                                <div style={{ fontSize:10, color:T.teal, marginBottom:2 }}>You</div>
                                <div style={{ fontFamily:T.h, fontSize:16, fontWeight:800, color:T.text }}>
                                  {typeof item.yours === "number" && item.yours < 100 && item.unit === "%" ? item.yours+"%" :
                                   item.yours >= 1000 ? (item.yours/1000).toFixed(1)+"K" :
                                   item.yours+item.unit}
                                </div>
                              </div>
                              <div style={{ textAlign:"right" }}>
                                <div style={{ fontSize:10, color:selectedComp.color, marginBottom:2 }}>Them</div>
                                <div style={{ fontFamily:T.h, fontSize:16, fontWeight:800, color:T.text }}>
                                  {typeof item.theirs === "number" && item.theirs < 100 && item.unit === "%" ? item.theirs+"%" :
                                   item.theirs >= 1000 ? (item.theirs/1000).toFixed(1)+"K" :
                                   item.theirs+item.unit}
                                </div>
                              </div>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                              <div style={{ fontSize:11, fontWeight:700,
                                color: youWin ? T.teal : T.coral }}>
                                {youWin ? "You lead" : "They lead"}
                              </div>
                              <div style={{ fontSize:11, color:T.text3 }}>
                                by {Math.abs(typeof delta === "number" ? 
                                  (delta > 1000 ? (delta/1000).toFixed(1)+"K" : delta.toFixed(delta%1===0?0:1)) : delta)}{item.unit}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: TOPICS ──────────────────────────── */}
              {activeTab === "topics" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {[
                    { title:`What ${yourProduct.name.split(" ").slice(0,2).join(" ")} customers love`, items:compData.yourTopPraise, color:T.teal, icon:"👍" },
                    { title:`What ${theirProduct.name.split(" ").slice(0,2).join(" ")} customers love`, items:compData.theirTopPraise, color:selectedComp.color, icon:"👍" },
                    { title:`Top complaints — Your product`, items:compData.yourTopIssues, color:T.coral, icon:"⚠️" },
                    { title:`Top complaints — ${selectedComp.name}`, items:compData.theirTopIssues, color:selectedComp.color, icon:"⚠️" },
                  ].map((section, si) => (
                    <div key={si} style={{ background:T.bg3, border:`1px solid ${T.border}`,
                      borderRadius:16, padding:"18px 20px" }}>
                      <div style={{ fontSize:13, fontWeight:600, color:T.text, fontFamily:T.h,
                        marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
                        <span>{section.icon}</span> {section.title}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {section.items.map((item, ii) => (
                          <div key={ii} style={{ display:"flex", alignItems:"center", gap:10,
                            padding:"9px 12px", background:"rgba(255,255,255,0.03)",
                            borderRadius:8, border:`1px solid ${T.border}` }}>
                            <div style={{ width:6, height:6, borderRadius:"50%",
                              background:section.color, flexShrink:0 }}/>
                            <span style={{ fontSize:13, color:T.text2, fontFamily:T.b, lineHeight:1.4 }}>{item}</span>
                            {/* Backend: replace with real topic frequency %  */}
                            <span style={{ marginLeft:"auto", fontSize:11, color:T.text3 }}>
                              {[22,17,13,9,6][ii]}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB: REVIEWS ─────────────────────────── */}
              {activeTab === "reviews" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {[
                    { label:"Your Reviews", reviews:compData.yourReviews, color:T.teal },
                    { label:`${selectedComp.name}'s Reviews`, reviews:compData.theirReviews, color:selectedComp.color },
                  ].map((side, si) => (
                    <div key={si}>
                      <div style={{ fontSize:12, fontWeight:600, color:side.color, textTransform:"uppercase",
                        letterSpacing:".06em", marginBottom:10, fontFamily:T.b }}>
                        {side.label}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {side.reviews.map((rv, ri) => (
                          <div key={ri} style={{ background:T.bg3, border:`1px solid ${T.border}`,
                            borderRadius:14, padding:"16px 18px", transition:"border-color .2s" }}
                            className="card-hover">
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                              <Stars rating={rv.rating}/>
                              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                                <Pill type={rv.platform==="Amazon"?"amber":rv.platform==="Flipkart"?"teal":"neutral"}>
                                  {rv.platform}
                                </Pill>
                                <span style={{ fontSize:11, color:T.text3 }}>{rv.date}</span>
                              </div>
                            </div>
                            <p style={{ fontSize:13, color:T.text2, lineHeight:1.65,
                              fontFamily:T.b, fontStyle:"italic" }}>
                              "{rv.text}"
                            </p>
                            {/* Backend: attach sentiment tag per review from model */}
                            <div style={{ marginTop:10 }}>
                              <Pill type={rv.rating >= 4 ? "green" : rv.rating === 3 ? "amber" : "red"}>
                                {rv.rating >= 4 ? "Positive" : rv.rating === 3 ? "Neutral" : "Negative"}
                              </Pill>
                            </div>
                          </div>
                        ))}
                        <button style={{
                          width:"100%", padding:"10px", background:"transparent",
                          border:`1px dashed ${T.border}`, borderRadius:10,
                          color:T.text3, fontSize:12, cursor:"pointer", fontFamily:T.b,
                          transition:"all .2s"
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=T.border2;e.currentTarget.style.color=T.text2}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text3}}>
                          Load more reviews →
                          {/* Backend: GET /api/reviews?product_id=:id&offset=3 */}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB: AI INSIGHTS ─────────────────────── */}
              {activeTab === "insights" && (
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                  {/* Main verdict */}
                  <div style={{ background:T.bg3, border:`1px solid ${T.border2}`,
                    borderRadius:16, padding:"22px 26px",
                    boxShadow:`0 0 40px ${T.teal}06` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:T.tealDim,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🤖</div>
                      <div>
                        <div style={{ fontSize:11, fontWeight:600, color:T.teal, textTransform:"uppercase",
                          letterSpacing:"0.06em", fontFamily:T.b }}>LumIQ AI Analysis</div>
                        <div style={{ fontSize:16, fontWeight:700, color:T.text, fontFamily:T.h }}>
                          {compData.aiAnalysis.verdict}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize:14, color:T.text2, lineHeight:1.8, fontFamily:T.b }}>
                      {compData.aiAnalysis.summary}
                    </p>
                  </div>

                  {/* Action recommendations */}
                  <div style={{ background:T.bg3, border:`1px solid ${T.border}`, borderRadius:16, padding:"20px 24px" }}>
                    <div style={{ fontSize:14, fontWeight:600, color:T.text, fontFamily:T.h, marginBottom:16 }}>
                      What to do about it — in order of impact
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {compData.aiAnalysis.actions.map((action, ai) => (
                        <div key={ai} style={{ display:"flex", gap:14, alignItems:"flex-start",
                          padding:"14px 16px", borderRadius:12,
                          background: ai === 0 ? `${priorityColors[action.priority]}08` : "rgba(255,255,255,0.02)",
                          border:`1px solid ${ai === 0 ? priorityColors[action.priority]+"25" : T.border}`,
                          transition:"all .2s" }} className="card-hover">
                          <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
                            background:`${priorityColors[action.priority]}15`,
                            border:`1px solid ${priorityColors[action.priority]}40`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontFamily:T.h, fontWeight:800, fontSize:12,
                            color:priorityColors[action.priority] }}>{ai+1}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                              <Pill type={action.priority === "high" ? "red" : action.priority === "med" ? "amber" : "teal"}>
                                {priorityLabels[action.priority]}
                              </Pill>
                            </div>
                            <p style={{ fontSize:13, color:T.text, lineHeight:1.65, fontFamily:T.b }}>
                              {action.text}
                            </p>
                          </div>
                          <button style={{ flexShrink:0, padding:"6px 12px", borderRadius:7,
                            background:T.surface, border:`1px solid ${T.border}`,
                            color:T.text2, fontSize:12, cursor:"pointer", fontFamily:T.b,
                            transition:"all .2s", whiteSpace:"nowrap"
                          }}
                          onMouseEnter={e=>{e.currentTarget.style.background=T.surface2}}
                          onMouseLeave={e=>{e.currentTarget.style.background=T.surface}}>
                            Mark done
                            {/* Backend: POST /api/actions/:id/complete */}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Opportunity score */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                    {[
                      { label:"Opportunity score",  val:"High", icon:"🎯", color:T.teal,  sub:"Strong gap to exploit" },
                      { label:"Threat level",        val:compData.aiAnalysis.verdict.includes("⚠️") ? "Critical" : "Moderate", icon:"⚡", color:compData.aiAnalysis.verdict.includes("⚠️") ? T.coral : T.amber, sub:"Monitor weekly" },
                      { label:"Est. sentiment gain", val:"+8–14pts", icon:"📈", color:T.green, sub:"If top issues fixed" },
                    ].map((kpi,i) => (
                      <div key={i} style={{ padding:"16px 18px", background:T.bg3,
                        border:`1px solid ${T.border}`, borderRadius:14, textAlign:"center" }}>
                        <div style={{ fontSize:22, marginBottom:8 }}>{kpi.icon}</div>
                        <div style={{ fontSize:11, color:T.text3, marginBottom:4 }}>{kpi.label}</div>
                        <div style={{ fontFamily:T.h, fontSize:20, fontWeight:800, color:kpi.color }}>{kpi.val}</div>
                        <div style={{ fontSize:11, color:T.text3, marginTop:4 }}>{kpi.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state — no comparison selected yet */}
          {!comparing && !loadingComp && (
            <div style={{ background:T.bg3, border:`1px dashed ${T.border}`,
              borderRadius:16, padding:"60px 40px", textAlign:"center",
              animation:"fadeIn 0.4s ease both" }}>
              <div style={{ fontSize:44, marginBottom:16 }}>🔍</div>
              <div style={{ fontFamily:T.h, fontSize:20, fontWeight:700, color:T.text, marginBottom:8 }}>
                Select products and click Compare
              </div>
              <p style={{ fontSize:14, color:T.text2, lineHeight:1.65, maxWidth:400, margin:"0 auto 20px" }}>
                Choose one of your products and one from <strong style={{color:T.text}}>{selectedComp.name}</strong> — LumIQ will run a full side-by-side analysis of reviews, sentiment, topics, and what to do next.
              </p>
              <button onClick={handleCompare} style={{
                padding:"11px 24px", background:T.teal, border:"none", borderRadius:10,
                color:"#060D1A", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:T.b
              }}>
                Run comparison now →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Competitor Modal ─────────────────────── */}
      {addModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(4,8,18,0.85)",
          backdropFilter:"blur(12px)", zIndex:999, display:"flex",
          alignItems:"center", justifyContent:"center", animation:"fadeIn 0.2s ease" }}
          onClick={e => { if(e.target === e.currentTarget) setAddModal(false); }}>
          <div style={{ background:"#0D1828", border:`1px solid ${T.border2}`, borderRadius:20,
            width:440, padding:28, boxShadow:"0 40px 120px rgba(0,0,0,0.6)",
            animation:"fadeUp 0.3s ease" }}>
            <div style={{ fontFamily:T.h, fontSize:19, fontWeight:800, color:T.text, marginBottom:4 }}>
              Add a competitor
            </div>
            <div style={{ fontSize:13, color:T.text2, marginBottom:22 }}>
              LumIQ will start tracking their products and reviews immediately.
            </div>
            {/* Backend: POST /api/competitors { brand_id, name, url, platforms } */}
            {[
              { label:"Competitor brand name", placeholder:"e.g. ZenAudio India", type:"text" },
              { label:"Their website / brand URL", placeholder:"e.g. zenaudio.in", type:"url" },
            ].map((f,i) => (
              <div key={i} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:600, color:T.text2, display:"block",
                  marginBottom:6, fontFamily:T.b }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} style={{
                  width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.05)",
                  border:`1.5px solid ${T.border2}`, borderRadius:10,
                  fontSize:14, fontFamily:T.b, color:T.text, outline:"none"
                }}/>
              </div>
            ))}
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:600, color:T.text2, display:"block",
                marginBottom:8, fontFamily:T.b }}>Platforms to track</label>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["Amazon","Flipkart","Google","Meesho","Nykaa"].map(p => (
                  <label key={p} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px",
                    background:T.surface, border:`1px solid ${T.border2}`, borderRadius:8,
                    cursor:"pointer", fontSize:13, color:T.text2, fontFamily:T.b }}>
                    <input type="checkbox" defaultChecked={p==="Amazon"||p==="Flipkart"} style={{ accentColor:T.teal }}/>
                    {p}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setAddModal(false)} style={{
                flex:1, padding:"11px", background:T.surface, border:`1px solid ${T.border2}`,
                borderRadius:10, color:T.text2, fontSize:14, cursor:"pointer", fontFamily:T.b
              }}>Cancel</button>
              <button onClick={() => setAddModal(false)} style={{
                flex:2, padding:"11px", background:T.teal, border:"none",
                borderRadius:10, color:"#060D1A", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:T.b
              }}>Start tracking →</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
