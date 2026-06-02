/* KeepGrouped — events screens: Calendar, Event detail */

const WD = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const TYPES = ["Raid", "Entraînement", "Sortie", "Réunion"];

function CalendarScreen({ nav, go }) {
  const [sel, setSel] = useState(14);
  const [off, setOff] = useState({ Raid: true, "Entraînement": true, Sortie: true, "Réunion": true });
  const offset = 4; // May 2026 starts Friday-ish (illustrative)
  const cells = [];
  for (let i = 0; i < 35; i++) {
    const d = i - offset + 1;
    cells.push(d >= 1 && d <= 31 ? d : null);
  }
  const evById = Object.fromEntries(KG.events.map((e) => [e.id, e]));
  const dayEvents = (d) => (KG.calEvents[d] || []).map((id) => evById[id]).filter((e) => e && off[e.type]);
  const selEvents = dayEvents(sel);

  return (
    <main className="kg-main kg-fade">
      <div className="kg-topbar">
        <div className="f1"><h1>Calendrier</h1><div className="sub">Mai 2026</div></div>
        <div className="row" style={{ gap: 4 }}><IconBtn name="chevronLeft" size={18} /><IconBtn name="chevronRight" size={18} /></div>
        <div className="seg"><button className="on">Mois</button><button>Semaine</button><button>Liste</button></div>
        <Btn variant="primary" icon="plus">Événement</Btn>
      </div>
      <div className="kg-content scroll" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="cal-wrap">
          <div className="cal-main">
            <div className="cal-toolbar">
              <div className="filterchips">
                {TYPES.map((t) => (
                  <div key={t} className={"fchip" + (off[t] ? "" : " off")} onClick={() => setOff((o) => ({ ...o, [t]: !o[t] }))}>
                    <span className="tdot" style={{ background: KG.TYPE[t] }} />{t}
                  </div>
                ))}
                <div className="fchip" style={{ borderStyle: "dashed", color: "var(--muted)" }}><Icon name="plus" size={13} />type</div>
              </div>
            </div>
            <div className="month">
              <div className="wd">{WD.map((w) => <span key={w}>{w}</span>)}</div>
              <div className="grid">
                {cells.map((d, i) => (
                  <div key={i} className={"cell" + (d === null ? " dim" : "") + (d === 14 ? " today" : "") + (d === sel ? " sel" : "")}
                    onClick={() => d && setSel(d)}>
                    <span className="dn">{d || ""}</span>
                    {d && dayEvents(d).map((e) => (
                      <div key={e.id} className="ev-pill clickable" style={{ borderLeftColor: KG.TYPE[e.type] }}
                        onClick={(ev) => { ev.stopPropagation(); go({ screen: "event", eventId: e.id }); }}>
                        {e.title.split(" — ")[0]}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="cal-side scroll">
            <div className="sec-title" style={{ marginBottom: 4 }}><span>{sel} mai · {selEvents.length} évén.</span></div>
            {selEvents.length === 0 && <div className="card card-pad muted" style={{ fontSize: 14 }}>Aucun événement ce jour.</div>}
            {selEvents.map((e) => (
              <div className="evd clickable" key={e.id} onClick={() => go({ screen: "event", eventId: e.id })}>
                <div className="row between"><Chip dot={KG.TYPE[e.type]}>{e.type}</Chip><span className="muted" style={{ fontSize: 13 }}>{e.time.split(" ")[0]}</span></div>
                <div className="ttl">{e.title}</div>
                <div className="row gap8 muted" style={{ fontSize: 13 }}><Icon name="mapPin" size={14} />{e.locLabel}<span className="adaptag">adaptable</span></div>
                <div className="row between" style={{ marginTop: 2 }}>
                  <AvatarGroup people={KG.members.slice(0, 5)} size={26} max={4} />
                  <Btn variant="soft" size="sm" icon="check">RSVP</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- Event detail ---------------- */
function EventScreen({ nav, go }) {
  const ev = KG.events.find((e) => e.id === nav.eventId) || KG.events[0];
  const [rsvp, setRsvp] = useState(null);
  return (
    <main className="kg-main kg-fade">
      <div className="thread-head">
        <IconBtn name="arrowLeft" size={19} onClick={() => go({ screen: "calendar" })} />
        <div className="ti">
          <div className="t"><Chip dot={KG.TYPE[ev.type]}>{ev.type}</Chip>{ev.title}</div>
          <div className="s">{ev.date} · {ev.time}</div>
        </div>
        <span className="f1" />
        <Btn variant={rsvp === "yes" ? "primary" : "soft"} icon="check" onClick={() => setRsvp("yes")}>Je viens</Btn>
        <Btn variant="ghost" onClick={() => setRsvp("maybe")}>Peut-être</Btn>
      </div>
      <div className="ev-detail">
        <div className="ev-info scroll">
          <Cover seed={ev.id} className="ecover" />
          <div className="ev-block"><div className="h">Quand</div><div className="v">{ev.date}<br />{ev.time}</div></div>
          <div className="ev-block">
            <div className="h">Lieu <span className="adaptag">champ adaptable</span></div>
            <div className="locbox">
              <Cover seed={"loc" + ev.id} className="map" style={{ borderRadius: 0 }}>
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff", zIndex: 2 }}><Icon name="mapPin" size={26} /></div>
              </Cover>
              <div className="lb-foot"><Icon name="globe" size={16} className="muted" /><div><div style={{ fontWeight: 600 }}>{ev.locLabel}</div><div className="muted" style={{ fontSize: 12.5 }}>{ev.locValue}</div></div></div>
            </div>
          </div>
          <div className="ev-block"><div className="h">Description</div><div className="v">{ev.desc}</div></div>
          <div className="ev-block">
            <div className="h">Participants · {ev.going}{ev.capacity ? "/" + ev.capacity : ""}</div>
            <div className="row gap10 wrap"><AvatarGroup people={KG.members} size={34} max={6} /></div>
          </div>
          <div className="ev-block"><div className="h">Organisé par</div><div className="row gap10"><Avatar name={ev.org} size={32} /><span style={{ fontWeight: 600, fontSize: 14 }}>{ev.org}</span></div></div>
          <div className="ev-block">
            <div className="h">Fichiers</div>
            <div className="filelist">
              {[["strat.pdf", "PDF · 1,2 Mo"], ["compo.png", "Image · 340 Ko"]].map(([fn, fm]) => (
                <div className="filerow" key={fn}><div className="fic"><Icon name="file" size={17} /></div><div className="f1"><div className="fn">{fn}</div><div className="fm">{fm}</div></div></div>
              ))}
            </div>
          </div>
        </div>
        <div className="chat-col">
          <div className="thread-head" style={{ paddingTop: 13, paddingBottom: 13 }}>
            <Icon name="chat" size={18} className="muted" />
            <div className="ti"><div className="t" style={{ fontSize: 15 }}>Discussion de l’événement</div><div className="s"># {ev.id}-chat</div></div>
          </div>
          <ChatMessages msgs={KG.channelMsgs} />
          <Composer placeholder="Message à l’événement…" />
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { CalendarScreen, EventScreen });
