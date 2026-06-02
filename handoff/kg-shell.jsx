/* KeepGrouped — app shell: sidebar, router, tweaks */

const FONT_PAIRS = {
  "Chaleureux": ['"Bricolage Grotesque"', '"Figtree"'],
  "Géométrique": ['"Outfit"', '"Outfit"'],
  "Techno": ['"Space Grotesk"', '"Figtree"'],
};
const RADII = { "Net": ["10px", "8px", "14px"], "Doux": ["18px", "12px", "26px"], "Rond": ["26px", "16px", "34px"] };
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": "#e8743c",
  "fontPair": "Chaleureux",
  "radius": "Doux"
}/*EDITMODE-END*/;

function Sidebar({ nav, go, onOnboard }) {
  const { group, channels, events, dms } = KG;
  const dmUnread = dms.reduce((s, d) => s + (d.unread || 0), 0);
  const navItems = [
    ["home", "home", "Accueil"],
    ["calendar", "calendar", "Calendrier"],
    ["kb", "book", "Connaissances"],
    ["dm", "chat", "Messages privés", dmUnread],
  ];
  return (
    <aside className="kg-side">
      <div className="kg-side-head clickable">
        <div className="kg-glyph">NO</div>
        <div className="f1"><div className="nm">{group.name}</div><div className="tp">{group.type}</div></div>
        <Icon name="chevronDown" className="chev" size={18} />
      </div>
      <div className="kg-search clickable"><Icon name="search" size={16} /><span>Rechercher…</span></div>
      <div className="kg-side-scroll scroll">
        {navItems.map(([id, ic, label, count]) => (
          <div key={id} className={"kg-nav" + (nav.screen === id ? " active" : "")} onClick={() => go({ screen: id })}>
            <Icon name={ic} size={18} className="ico" /><span>{label}</span>
            {count ? <span className="count">{count}</span> : null}
          </div>
        ))}
        <div className="kg-seclabel">Channels <button><Icon name="plus" size={14} /></button></div>
        {channels.map((c) => (
          <div key={c.name} className={"kg-chan" + (nav.screen === "chat" && nav.channel === c.name ? " active" : "")} onClick={() => go({ screen: "chat", channel: c.name })}>
            {c.icon ? <Icon name={c.icon} size={16} className="hash" /> : <span className="hash">#</span>}
            <span className="f1">{c.name}</span>
            {c.unread ? <span className="count">{c.unread}</span> : null}
          </div>
        ))}
        <div className="kg-seclabel">À venir</div>
        {events.slice(0, 3).map((e) => (
          <div key={e.id} className="kg-chan" onClick={() => go({ screen: "event", eventId: e.id })}>
            <span className="tdot" style={{ width: 9, height: 9, borderRadius: 9, background: KG.TYPE[e.type], flex: "none" }} />
            <span className="f1" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</span>
          </div>
        ))}
      </div>
      <div className="kg-side-foot">
        <Avatar name="Toi" initials="TY" size={34} online />
        <div className="f1"><div className="nm">Toi</div><div className="st">En ligne</div></div>
        <button className="gear" title="Accueil guidé" onClick={onOnboard}><Icon name="sparkles" size={18} /></button>
        <button className="gear" title="Admin" onClick={() => go({ area: "admin", adminSection: "overview" })}><Icon name="gear" size={18} /></button>
      </div>
    </aside>
  );
}

function AppMain({ nav, go }) {
  switch (nav.screen) {
    case "calendar": return <CalendarScreen nav={nav} go={go} />;
    case "event": return <EventScreen nav={nav} go={go} />;
    case "chat": return <ChatScreen nav={nav} go={go} />;
    case "dm": return <DMScreen nav={nav} go={go} />;
    case "kb": return <KnowledgeScreen nav={nav} go={go} />;
    default: return <DashboardScreen nav={nav} go={go} />;
  }
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [nav, setNav] = useState({ area: "app", screen: "home", channel: "raids", dmIdx: 0, eventId: "raid", adminSection: "overview" });
  const go = (patch) => setNav((n) => ({ ...n, ...patch }));

  useEffect(() => {
    const r = document.documentElement;
    r.dataset.theme = t.dark ? "dark" : "light";
    r.style.setProperty("--accent", t.accent);
    const fp = FONT_PAIRS[t.fontPair] || FONT_PAIRS["Chaleureux"];
    r.style.setProperty("--font-head", fp[0] + ", system-ui, sans-serif");
    r.style.setProperty("--font-body", fp[1] + ", system-ui, sans-serif");
    const rd = RADII[t.radius] || RADII["Doux"];
    r.style.setProperty("--r", rd[0]); r.style.setProperty("--r-sm", rd[1]); r.style.setProperty("--r-lg", rd[2]);
  }, [t]);

  let body;
  if (nav.area === "onboarding") body = <OnboardingScreen go={go} />;
  else if (nav.area === "admin") body = <AdminArea nav={nav} go={go} />;
  else body = <React.Fragment>
    <Sidebar nav={nav} go={go} onOnboard={() => go({ area: "onboarding" })} />
    <AppMain key={[nav.screen, nav.channel, nav.dmIdx, nav.eventId].join("|")} nav={nav} go={go} />
  </React.Fragment>;

  return (
    <div className="kg-app">
      {body}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Thème" />
        <TweakToggle label="Mode sombre" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakColor label="Accent" value={t.accent} options={["#e8743c", "#d98a2b", "#c8607f", "#5b7fd0"]} onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Typographie & formes" />
        <TweakSelect label="Police" value={t.fontPair} options={Object.keys(FONT_PAIRS)} onChange={(v) => setTweak("fontPair", v)} />
        <TweakRadio label="Coins" value={t.radius} options={Object.keys(RADII)} onChange={(v) => setTweak("radius", v)} />
      </TweaksPanel>
    </div>
  );
}

Object.assign(window, { App, Sidebar });
