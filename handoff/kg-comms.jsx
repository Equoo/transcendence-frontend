/* KeepGrouped — comms screens: Dashboard, Chat, DM */

const TOPICS = {
  annonces: "Infos importantes du groupe",
  "général": "Discussion libre",
  "entraînement": "Sessions & planning",
  raids: "Coordination des raids du soir",
  "loot-talk": "Butin, builds & échanges",
};

function ChatMessages({ msgs, day = "Aujourd’hui", onThread }) {
  return (
    <div className="msgs scroll">
      <div className="daysep"><span>{day}</span></div>
      {msgs.map((m, i) => (
        <div className="msg" key={i}>
          <Avatar name={m.name} size={40} />
          <div className="mb">
            <div className="mh"><span className="nm">{m.name}</span><span className="tm">{m.time}</span></div>
            <div className="mt">{m.text}</div>
            {m.react && <span className="react">{m.react}</span>}
            {m.thread && <div className="threadlink clickable" onClick={onThread}><Icon name="reply" size={14} />{m.thread} réponses · voir le fil</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Composer({ placeholder }) {
  return (
    <div className="composer">
      <div className="ce">{placeholder}</div>
      <div className="cbar">
        <IconBtn name="clip" size={18} />
        <IconBtn name="image" size={18} />
        <IconBtn name="smile" size={18} />
        <span className="sp" />
        <button className="send"><Icon name="send" size={17} /></button>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function DashboardScreen({ nav, go }) {
  const { group, events, channels, activity } = KG;
  const ev = events[0];
  const docs = [
    { t: "Guide débutant", m: "il y a 2 j · Alex" },
    { t: "Stratégies de raid", m: "hier · Nora" },
    { t: "Règles du groupe", m: "il y a 5 j · Alex" },
    { t: "Build & loadouts", m: "il y a 1 sem · Kai" },
  ];
  const kindIcon = { chat: "hash", calendar: "calendar", book: "book" };
  return (
    <main className="kg-main kg-fade">
      <div className="kg-topbar">
        <div className="f1"><h1>Accueil</h1><div className="sub">{group.name} · 142 membres · 11 en ligne</div></div>
        <Btn variant="ghost" icon="users">Inviter</Btn>
        <Btn variant="primary" icon="plus">Événement</Btn>
      </div>
      <div className="kg-content scroll">
        <div className="dash">
          {/* hero */}
          <div className="hero">
            <div className="hero-l">
              <div className="eyebrow">
                <Chip dot={KG.TYPE[ev.type]} tone="">{ev.type}</Chip>
                <Chip tone="plain"><Icon name="clock" size={14} />Ce soir · 21:00</Chip>
              </div>
              <h2>{ev.title}</h2>
              <div className="hero-loc"><Icon name="mapPin" size={16} /><span>{ev.locLabel}</span><span className="adaptag">lieu adaptable</span></div>
              <div className="hero-count">
                <div className="countdown">02:14:36<small>avant le départ</small></div>
                <Chip tone="good"><Icon name="users" size={14} />{ev.going}/{ev.capacity} inscrits</Chip>
              </div>
              <div className="hero-actions">
                <Btn variant="primary" icon="check" onClick={() => go({ screen: "event", eventId: ev.id })}>Je viens</Btn>
                <Btn variant="ghost">Peut-être</Btn>
                <Btn variant="plain" iconR="chevronRight" onClick={() => go({ screen: "event", eventId: ev.id })}>Détails</Btn>
              </div>
            </div>
            <Cover seed={ev.id} className="hero-r">
              <div className="rl"><Icon name="trophy" size={34} /><div style={{ fontSize: 18, marginTop: 8 }}>Boss final</div><div style={{ fontSize: 13, opacity: .85, fontWeight: 500 }}>cette semaine</div></div>
            </Cover>
          </div>

          {/* channels */}
          <div>
            <div className="sec-title">Vos channels <span className="more clickable" onClick={() => go({ screen: "chat", channel: "raids" })}>Tout voir</span></div>
            <div className="grid-4">
              {channels.slice(0, 4).map((c) => (
                <div className="card chan-card clickable" key={c.name} onClick={() => go({ screen: "chat", channel: c.name })}>
                  <div className="ch-h">{c.icon ? <Icon name={c.icon} size={16} className="hash" /> : <span className="hash">#</span>}{c.name}{c.unread ? <span className="count" style={{ marginLeft: "auto" }}>{c.unread}</span> : null}</div>
                  <div className="prev">{TOPICS[c.name]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* knowledge */}
          <div>
            <div className="sec-title">Connaissances récentes <span className="more clickable" onClick={() => go({ screen: "kb" })}>Ouvrir la base</span></div>
            <div className="grid-4">
              {docs.map((d, i) => (
                <div className="card doc-card clickable" key={i} onClick={() => go({ screen: "kb" })}>
                  <Cover seed={d.t} className="thumb" style={{ borderRadius: 0 }} />
                  <div className="dc-b"><div className="t">{d.t}</div><div className="m">{d.m}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* activity */}
          <div>
            <div className="sec-title">Activité récente</div>
            <div className="card card-pad">
              {activity.map((a, i) => (
                <div className="row gap12" key={i} style={{ padding: "11px 0", borderBottom: i < activity.length - 1 ? "1px solid var(--border)" : "0" }}>
                  <Avatar name={a.who} size={36} />
                  <div className="f1" style={{ fontSize: 14 }}><b style={{ fontFamily: "var(--font-head)" }}>{a.who}</b> <span className="t2">{a.what}</span> <b>{a.target}</b></div>
                  <span className="muted" style={{ fontSize: 12 }}>{a.time}</span>
                  <div style={{ color: "var(--muted)" }}><Icon name={kindIcon[a.kind]} size={16} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- Chat ---------------- */
function ChatScreen({ nav, go }) {
  const [thread, setThread] = useState(false);
  const ch = nav.channel || "raids";
  const online = KG.members.filter((m) => m.online);
  return (
    <main className="kg-main kg-fade">
      <div className="thread-head">
        <div className="ti">
          <div className="t"><span style={{ color: "var(--muted)" }}>#</span>{ch}</div>
          <div className="s">{TOPICS[ch]} · {KG.members.length} membres</div>
        </div>
        <span className="spacer f1" />
        <AvatarGroup people={online} size={30} max={4} />
        <IconBtn name="bell" /><IconBtn name="pin" /><IconBtn name="users" />
      </div>
      <div className="chat-wrap">
        <div className="chat-col">
          <ChatMessages msgs={KG.channelMsgs} onThread={() => setThread(true)} />
          <Composer placeholder={`Message à #${ch}…`} />
        </div>
        {thread && (
          <div className="thread-side kg-fade">
            <div className="ts-head">Fil de discussion <IconBtn name="x" size={18} onClick={() => setThread(false)} /></div>
            <div className="ts-body">
              <ChatMessagesPlain msgs={KG.threadMsgs} />
            </div>
            <Composer placeholder="Répondre au fil…" />
          </div>
        )}
      </div>
    </main>
  );
}
function ChatMessagesPlain({ msgs }) {
  return <div className="col gap16">{msgs.map((m, i) => (
    <div className="msg" key={i}><Avatar name={m.name} size={34} /><div className="mb"><div className="mh"><span className="nm">{m.name}</span><span className="tm">{m.time}</span></div><div className="mt" style={{ fontSize: 14 }}>{m.text}</div></div></div>
  ))}</div>;
}

/* ---------------- Direct messages ---------------- */
function DMScreen({ nav, go }) {
  const idx = nav.dmIdx || 0;
  const active = KG.dms[idx];
  return (
    <main className="kg-main kg-fade" style={{ flexDirection: "row" }}>
      <div className="dm-list">
        <div className="lh"><h2>Messages</h2><IconBtn name="edit" size={18} /></div>
        <div className="dm-scroll scroll">
          {KG.dms.map((d, i) => (
            <div className={"dm-row" + (i === idx ? " active" : "")} key={i} onClick={() => go({ dmIdx: i })}>
              <Avatar name={d.name} size={42} online={d.online} />
              <div className="di">
                <div className="top"><span className="nm">{d.name}</span><span className="tm">{d.time}</span></div>
                <div className={"pv" + (d.unread ? " un" : "")}>{d.preview}</div>
              </div>
              {d.unread ? <span className="badge">{d.unread}</span> : null}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-col">
        <div className="thread-head">
          <Avatar name={active.name} size={38} online={active.online} />
          <div className="ti"><div className="t">{active.name}</div><div className="s">{active.online ? "En ligne" : "Hors ligne"}</div></div>
          <span className="f1" />
          <IconBtn name="bell" /><IconBtn name="dots" />
        </div>
        <div className="msgs scroll">
          <div className="daysep"><span>Aujourd’hui</span></div>
          {KG.dmMsgs.map((m, i) => (
            <div key={i} className="row" style={{ justifyContent: m.me ? "flex-end" : "flex-start" }}>
              <div className={"ai-msg " + (m.me ? "user" : "bot")} style={{ maxWidth: "70%" }}>{m.text}<div style={{ fontSize: 11, opacity: .7, marginTop: 4, textAlign: "right" }}>{m.time}</div></div>
            </div>
          ))}
        </div>
        <Composer placeholder={`Message à ${active.name}…`} />
      </div>
    </main>
  );
}

Object.assign(window, { DashboardScreen, ChatScreen, DMScreen, ChatMessages, Composer });
