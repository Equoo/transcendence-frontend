/* KeepGrouped — core atoms + mock data (exposed on window) */
const { useState, useEffect, useRef } = React;

/* ---------------- icons ---------------- */
const ICONS = {
  home: '<path d="M4 11 12 4l8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 9.5h17M8 3.5v4M16 3.5v4"/>',
  book: '<path d="M12 6c-1.6-1.2-4-2-7-2v14c3 0 5.4.8 7 2 1.6-1.2 4-2 7-2V4c-3 0-5.4.8-7 2Z"/><path d="M12 6v14"/>',
  chat: '<path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3.4V7a2 2 0 0 1 2-2Z"/>',
  bell: '<path d="M6 9.5a6 6 0 0 1 12 0c0 4.5 2 5.5 2 5.5H4s2-1 2-5.5Z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.6-3.6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  gear: '<circle cx="12" cy="12" r="3.1"/><path d="M12 3.6v2.1M12 18.3v2.1M3.6 12h2.1M18.3 12h2.1M5.9 5.9l1.5 1.5M16.6 16.6l1.5 1.5M18.1 5.9l-1.5 1.5M7.4 16.6l-1.5 1.5"/>',
  users: '<circle cx="9" cy="9" r="3.1"/><path d="M3.6 19c0-3 2.6-5 5.4-5s5.4 2 5.4 5"/><path d="M16 6.6a3 3 0 0 1 0 5.7M17.2 14c2.3.3 3.8 2.3 3.8 4.8"/>',
  hash: '<path d="M9.2 4 7.6 20M16.4 4 14.8 20M4.6 8.6h15M4.2 15.4h15"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  send: '<path d="M4.5 11.5 20 4l-7 16-2.4-7.4-6.1-1.1Z"/>',
  clip: '<path d="M18.5 11.5 12 18a3.8 3.8 0 0 1-5.4-5.3l7-7a2.5 2.5 0 0 1 3.5 3.5l-7 7a1.2 1.2 0 0 1-1.7-1.7l6.3-6.3"/>',
  pin: '<path d="M9 4h6l-1 5 3 3v2H7v-2l3-3-1-5Z"/><path d="M12 14v6"/>',
  sparkles: '<path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6Z"/><path d="M18.5 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z"/>',
  dots: '<circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>',
  mapPin: '<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  file: '<path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M14 3.5V8h4"/>',
  smile: '<circle cx="12" cy="12" r="8"/><path d="M8.8 14a4 4 0 0 0 6.4 0"/><circle cx="9.2" cy="10" r=".7" fill="currentColor" stroke="none"/><circle cx="14.8" cy="10" r=".7" fill="currentColor" stroke="none"/>',
  image: '<rect x="4" y="5" width="16" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.5"/><path d="m5 17 4.5-4 3 2.5L16 11l3 3.5"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
  shield: '<path d="M12 3.5 19 6v5c0 5-3.2 7.8-7 9.5C8.2 18.8 5 16 5 11V6Z"/>',
  sliders: '<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2.2"/><circle cx="9" cy="16" r="2.2"/>',
  folder: '<path d="M4 7a2 2 0 0 1 2-2h3.4l2 2H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/>',
  trophy: '<path d="M7.5 4h9v3a4.5 4.5 0 0 1-9 0Z"/><path d="M7.5 5H4.5v1a3 3 0 0 0 3 3M16.5 5h3v1a3 3 0 0 1-3 3M10 12.5v3M14 12.5v3M8 19.5h8"/>',
  edit: '<path d="M5 19h3l9-9-3-3-9 9Z"/><path d="m14 7 3 3"/>',
  logout: '<path d="M14 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M11 12h9M17 8l4 4-4 4"/>',
  megaphone: '<path d="M5 10v4a1.5 1.5 0 0 0 1.5 1.5H8l9 4V4.5l-9 4H6.5A1.5 1.5 0 0 0 5 10Z"/>',
  dumbbell: '<path d="M3 9.5v5M6 7.5v9M18 7.5v9M21 9.5v5M6 12h12"/>',
  reply: '<path d="M9 7 4 12l5 5M4 12h9a6 6 0 0 1 6 6"/>',
  globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.2 2.5 13.8 0 16M12 4c-2.5 2.2-2.5 13.8 0 16"/>',
};
function Icon({ name, size = 18, stroke = 1.9, style, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}
    dangerouslySetInnerHTML={{ __html: ICONS[name] || "" }} />;
}

/* ---------------- helpers ---------------- */
function hash(s) { let h = 0; s = String(s); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
const AV_COLORS = ["#e8743c", "#d98a2b", "#c8607f", "#6f9a3f", "#3f9e8f", "#5b7fd0", "#a86bd6", "#cf6452"];
const TYPE = { Raid: "#c8607f", "Entraînement": "#d98a2b", Sortie: "#3f9e8f", "Réunion": "#5b7fd0" };

function Avatar({ name = "?", initials, size = 36, online, style }) {
  const ini = initials || name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const c = AV_COLORS[hash(name) % AV_COLORS.length];
  return <span className="av" style={{ width: size, height: size, fontSize: Math.round(size * 0.4), background: c, ...style }}>{ini}{online && <span className="pres" />}</span>;
}
function AvatarGroup({ people, size = 30, max = 4 }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return <span className="av-grp">{shown.map((p, i) => <Avatar key={i} name={p.name || p} size={size} />)}
    {extra > 0 && <span className="av-more" style={{ width: size, height: size }}>+{extra}</span>}</span>;
}
function Chip({ tone, dot, children, lg, style, ...p }) {
  return <span className={`chip ${tone || ""} ${lg ? "chip-lg" : ""}`} style={style} {...p}>{dot && <span className="tdot" style={{ background: dot }} />}{children}</span>;
}
function Btn({ variant = "ghost", size, icon, iconR, children, ...p }) {
  return <button className={`btn btn-${variant} ${size ? "btn-" + size : ""}`} {...p}>
    {icon && <Icon name={icon} size={size === "lg" ? 18 : 16} />}{children}{iconR && <Icon name={iconR} size={16} />}</button>;
}
function IconBtn({ name, ghost, size = 19, ...p }) {
  return <button className={"iconbtn" + (ghost ? " ghost" : "")} {...p}><Icon name={name} size={size} /></button>;
}
function Cover({ seed = "x", style, children, className = "" }) {
  const h = hash(seed);
  const a = AV_COLORS[h % AV_COLORS.length], b = AV_COLORS[(h * 5 + 3) % AV_COLORS.length];
  return <div className={"cover " + className} style={{ background: `linear-gradient(135deg, ${a}, ${b})`, ...style }}>
    <div className="cv-pat" />
    <div className="cv-blob" style={{ width: 130, height: 130, background: "#fff", top: -34, right: -16 }} />
    <div className="cv-blob" style={{ width: 96, height: 96, background: b, bottom: -30, left: 28 }} />
    {children}
  </div>;
}

/* ---------------- mock data ---------------- */
const KG = {
  group: { name: "Night Owls", type: "Gaming / alliance" },
  me: { name: "Toi", initials: "TY" },
  members: [
    { name: "Alex Rune", role: "Admin", online: true },
    { name: "Maya Lin", role: "Modérateur", online: true },
    { name: "Kai Ortega", role: "Membre", online: false },
    { name: "Jo Park", role: "Membre", online: true },
    { name: "Lee Tran", role: "Membre", online: false },
    { name: "Nora Vidal", role: "Membre", online: true },
    { name: "Sam Roy", role: "Membre", online: false },
    { name: "Tao Beck", role: "Invité", online: false },
  ],
  channels: [
    { name: "annonces", icon: "megaphone" },
    { name: "général", unread: 3 },
    { name: "entraînement", icon: "dumbbell" },
    { name: "raids", unread: 12 },
    { name: "loot-talk" },
  ],
  events: [
    { id: "raid", title: "Raid — Donjon de Cendres", type: "Raid", date: "Jeudi 14 mai", time: "21:00 – 23:00", day: 14, locLabel: "Serveur EU-West", locValue: "Canal vocal #raid", going: 18, capacity: 25, org: "Alex Rune", desc: "On tente le boss final cette semaine. Compo équilibrée — pensez à vos consommables et arrivez 10 min avant pour le brief en vocal." },
    { id: "entr", title: "Entraînement fractionné", type: "Entraînement", date: "Vendredi 15 mai", time: "19:00", day: 15, locLabel: "Parc de la Tête d’Or", locValue: "Entrée principale", going: 9, capacity: null, org: "Maya Lin", desc: "Séance de fractionnés 30/30. Échauffement collectif puis 2 séries. Niveau libre." },
    { id: "sortie", title: "Sortie 10 km", type: "Sortie", date: "Samedi 16 mai", time: "09:00", day: 16, locLabel: "Berges du fleuve", locValue: "Pont Nord", going: 12, capacity: 30, org: "Jo Park", desc: "Sortie tranquille au bord de l’eau, allure conversation. Café à l’arrivée." },
    { id: "reunion", title: "Réunion hebdo", type: "Réunion", date: "Mercredi 21 mai", time: "18:00", day: 21, locLabel: "Visio", locValue: "Lien dans #annonces", going: 7, capacity: null, org: "Alex Rune", desc: "Point hebdo : bilan de la semaine, planning des prochains events, questions ouvertes." },
  ],
  calEvents: { 3: ["entr"], 7: ["raid"], 8: ["sortie"], 14: ["reunion", "raid"], 16: ["sortie"], 18: ["entr"], 21: ["raid"], 22: ["sortie"], 28: ["raid"] },
  channelMsgs: [
    { name: "Alex Rune", time: "20:41", text: "Brief du soir : on part sur la compo 3-1-1, deux soigneurs." },
    { name: "Maya Lin", time: "20:43", text: "Je prends soigneur. J’ai farm les potions cet aprem 💪", react: "👍 4" },
    { name: "Kai Ortega", time: "20:45", text: "Je peux tank si besoin, sinon DPS." },
    { name: "Jo Park", time: "20:52", text: "Présent ! Première fois sur ce donjon, des conseils ?", thread: 3 },
    { name: "Alex Rune", time: "20:54", text: "Reste groupé sur le boss 2, évite les zones rouges. On t’explique en vocal." },
    { name: "Nora Vidal", time: "20:58", text: "Hâte 🔥" },
  ],
  threadMsgs: [
    { name: "Alex Rune", time: "20:53", text: "Le boss 2 fait un AoE toutes les 20s." },
    { name: "Maya Lin", time: "20:55", text: "Et garde un cooldown pour la phase 3." },
  ],
  dms: [
    { name: "Alex Rune", preview: "On se cale pour le raid ?", time: "14:02", unread: 2, online: true },
    { name: "Maya Lin", preview: "Top, merci à toi !", time: "hier", online: true },
    { name: "Kai Ortega", preview: "Tu as les logs de la dernière ?", time: "lun." },
    { name: "Jo Park", preview: "à demain 👋", time: "12 mai" },
    { name: "Nora Vidal", preview: "😂😂😂", time: "10 mai" },
  ],
  dmMsgs: [
    { me: false, time: "13:58", text: "Salut ! Tu viens au raid de jeudi ?" },
    { me: true, time: "14:00", text: "Oui carrément, je prends quel rôle ?" },
    { me: false, time: "14:01", text: "On manque d’un soigneur si ça te dit." },
    { me: false, time: "14:02", text: "On se cale pour le raid ?" },
  ],
  activity: [
    { who: "Maya Lin", what: "a publié dans", target: "#raids", time: "il y a 12 min", kind: "chat" },
    { who: "Alex Rune", what: "a créé l’événement", target: "Raid — Donjon de Cendres", time: "il y a 1 h", kind: "calendar" },
    { who: "Nora Vidal", what: "a ajouté un document", target: "Stratégies de raid", time: "il y a 3 h", kind: "book" },
  ],
  kbTree: [
    { title: "Règles du groupe", icon: "shield" },
    { title: "Guides", icon: "book", children: [{ title: "Guide débutant" }, { title: "Stratégies de raid" }, { title: "Build & loadouts" }] },
    { title: "Comptes-rendus", icon: "file" },
    { title: "Ressources", icon: "folder" },
  ],
  TYPE, AV_COLORS, hash,
};

Object.assign(window, { React, useState, useEffect, useRef, Icon, Avatar, AvatarGroup, Chip, Btn, IconBtn, Cover, KG });
