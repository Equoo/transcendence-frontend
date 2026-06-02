/* KeepGrouped — Admin area (overview, members, modules, events, settings) */

const ADM_NAV = [
  ["overview", "grid", "Vue d’ensemble"],
  ["members", "users", "Membres & rôles"],
  ["modules", "sliders", "Modules & tables"],
  ["events", "calendar", "Événements"],
  ["settings", "gear", "Paramètres"],
];
const ROLE_TONE = { Admin: "accent", "Modérateur": "good" };

function AdminArea({ nav, go }) {
  const sec = nav.adminSection || "overview";
  return (
    <React.Fragment>
      <aside className="adm-side">
        <div className="ah"><Icon name="shield" size={20} style={{ color: "var(--accent)" }} />Admin <span className="badge">Night Owls</span></div>
        <div className="adm-nav">
          {ADM_NAV.map(([id, ic, label]) => (
            <div key={id} className={"kg-nav" + (sec === id ? " active" : "")} onClick={() => go({ adminSection: id })}>
              <Icon name={ic} size={18} className="ico" /><span>{label}</span>
            </div>
          ))}
        </div>
        <div className="adm-foot"><div className="kg-nav" onClick={() => go({ area: "app", screen: "home" })}><Icon name="arrowLeft" size={18} className="ico" /><span>Retour à l’app</span></div></div>
      </aside>
      <AdminMain key={sec} sec={sec} />
    </React.Fragment>
  );
}

function AdminMain({ sec }) {
  if (sec === "members") return <AdminMembers />;
  if (sec === "modules") return <AdminModules />;
  if (sec === "events") return <AdminEvents />;
  if (sec === "settings") return <AdminSettings />;
  return <AdminOverview />;
}

function AdminOverview() {
  const stats = [["142", "Membres", "+6 cette semaine"], ["8", "Événements à venir", null], ["3", "Signalements", null], ["12", "Channels", null], ["56", "Documents", null], ["98%", "Activité", null]];
  return (
    <main className="kg-main kg-fade">
      <div className="kg-topbar"><div className="f1"><h1>Vue d’ensemble</h1><div className="sub">Night Owls · espace admin</div></div><Btn variant="primary" icon="plus">Événement</Btn></div>
      <div className="kg-content scroll">
        <div className="dash">
          <div className="statgrid">
            {stats.map(([n, l, d], i) => <div className="card statcard" key={i}><div className="n">{n}</div><div className="l">{l}</div>{d && <div className="d">{d}</div>}</div>)}
          </div>
          <div className="grid-3" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
            <div className="card card-pad"><div className="sec-title">Activité récente</div>
              {KG.activity.concat(KG.activity.slice(0, 1)).map((a, i) => (
                <div className="row gap12" key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <Avatar name={a.who} size={34} /><div className="f1" style={{ fontSize: 14 }}><b className="fhead">{a.who}</b> <span className="t2">{a.what}</span> <b>{a.target}</b></div><span className="muted" style={{ fontSize: 12 }}>{a.time}</span>
                </div>
              ))}
            </div>
            <div className="card card-pad"><div className="sec-title">Actions rapides</div>
              <div className="col gap10">
                {[["users", "Inviter un membre"], ["sliders", "Créer un module"], ["shield", "Gérer les rôles"], ["calendar", "Ajouter un événement"]].map(([ic, l]) => (
                  <div className="row gap12 clickable" key={l} style={{ padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--border)" }}><Icon name={ic} size={17} className="muted" /><span style={{ fontWeight: 600, fontSize: 14 }}>{l}</span><span className="mla muted"><Icon name="chevronRight" size={16} /></span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminMembers() {
  return (
    <main className="kg-main kg-fade">
      <div className="kg-topbar"><div className="f1"><h1>Membres & rôles</h1><div className="sub">142 membres · 8 affichés</div></div>
        <div className="kg-search clickable" style={{ margin: 0, width: 220 }}><Icon name="search" size={16} /><span>Rechercher…</span></div>
        <Btn variant="primary" icon="plus">Inviter</Btn>
      </div>
      <div className="kg-content scroll">
        <div style={{ maxWidth: 980 }}>
          <table className="tbl">
            <thead><tr><th>Membre</th><th>Rôle</th><th>Channels</th><th>Inscrit</th><th></th></tr></thead>
            <tbody>
              {KG.members.map((m, i) => (
                <tr key={i}>
                  <td><div className="cell-name"><Avatar name={m.name} size={34} online={m.online} />{m.name}</div></td>
                  <td><span className="rolepill"><span className="tdot" style={{ width: 8, height: 8, borderRadius: 8, background: m.role === "Admin" ? "var(--accent)" : m.role === "Modérateur" ? "var(--good)" : "var(--muted)" }} />{m.role}<Icon name="chevronDown" size={13} className="muted" /></span></td>
                  <td className="t2">{3 + (i % 5)} channels</td>
                  <td className="muted" style={{ fontSize: 13 }}>mai 2026</td>
                  <td style={{ textAlign: "right" }}><IconBtn name="dots" size={18} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function AdminModules() {
  const [active, setActive] = useState("Événements");
  const fields = [["Titre", "Texte"], ["Date & heure", "Date"], ["Lieu", "Champ adaptable"], ["Type", "Liste"], ["Capacité", "Nombre"], ["Description", "Texte long"]];
  const mods = [["Événements", "calendar", true], ["Connaissances", "book", true], ["Loadouts", "shield", false]];
  return (
    <main className="kg-main kg-fade">
      <div className="kg-topbar"><div className="f1"><h1>Modules & tables</h1><div className="sub">Création dynamique selon le type de groupe</div></div><Btn variant="primary" icon="plus">Module</Btn></div>
      <div className="kg-content scroll">
        <div className="mod-wrap">
          <div className="mod-list">
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", padding: "0 4px 4px" }}>Modules</div>
            {mods.map(([n, ic, on]) => (
              <div key={n} className={"mod-item" + (active === n ? " active" : "")} onClick={() => setActive(n)}><Icon name={ic} size={17} className="ico" /><span>{n}</span><span className="on" style={{ background: on ? "var(--good)" : "var(--border-2)" }} /></div>
            ))}
            <div className="mod-item add"><Icon name="plus" size={16} />Nouveau module</div>
          </div>
          <div className="f1" style={{ minWidth: 0 }}>
            <div className="card card-pad">
              <div className="sec-title"><span>Table « {active} »</span> <Chip tone="accent">champs adaptables</Chip></div>
              {fields.map(([f, t]) => (
                <div className="fieldrow" key={f}><span className="grip">⠿</span><span className="fname">{f}</span><span className="typesel">{t}<Icon name="chevronDown" size={13} /></span><IconBtn name="x" size={16} /></div>
              ))}
              <div className="addfield"><Icon name="plus" size={16} />Ajouter un champ</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminEvents() {
  const rows = [["Raid — Donjon de Cendres", "Raid", "14 mai · 21h", "18/25"], ["Entraînement fractionné", "Entraînement", "15 mai · 19h", "9/—"], ["Sortie 10 km", "Sortie", "16 mai · 9h", "12/30"], ["Réunion hebdo", "Réunion", "21 mai · 18h", "—"]];
  const formFields = [["Titre", "text"], ["Type", "text"], ["Date & heure", "text"], ["Lieu — champ adaptable", "loc"], ["Capacité", "text"], ["Description", "area"]];
  return (
    <main className="kg-main kg-fade">
      <div className="kg-topbar"><div className="f1"><h1>Événements</h1><div className="sub">Gérer & créer</div></div><Btn variant="primary" icon="plus">Ajouter un événement</Btn></div>
      <div className="kg-content scroll">
        <div className="mod-wrap" style={{ alignItems: "flex-start" }}>
          <div className="f1" style={{ minWidth: 0 }}>
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", padding: "0 2px 8px" }}>À venir</div>
            <table className="tbl">
              <tbody>
                {rows.map(([t, ty, d, r], i) => (
                  <tr key={i}>
                    <td><div className="cell-name"><span className="tdot" style={{ width: 10, height: 10, borderRadius: 10, background: KG.TYPE[ty] }} />{t}</div></td>
                    <td><Chip dot={KG.TYPE[ty]}>{ty}</Chip></td>
                    <td className="t2" style={{ fontSize: 13 }}>{d}</td>
                    <td className="muted" style={{ fontSize: 13 }}>{r}</td>
                    <td style={{ textAlign: "right" }}><IconBtn name="dots" size={18} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card card-pad" style={{ width: 340, flex: "none" }}>
            <div className="sec-title"><span>Nouvel événement</span> <Chip tone="accent">champs du module</Chip></div>
            <div className="col gap14">
              {formFields.map(([l, k]) => (
                <div className="field" key={l}><span className="lab">{l}</span>
                  {k === "area" ? <div className="inp area">Décris l’événement…</div> : k === "loc" ? <div className="inp"><span className="adaptag">adaptable</span></div> : <div className="inp">—</div>}
                </div>
              ))}
              <div className="row gap10" style={{ justifyContent: "flex-end", marginTop: 4 }}><Btn variant="ghost">Annuler</Btn><Btn variant="primary">Créer</Btn></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminSettings() {
  return (
    <main className="kg-main kg-fade">
      <div className="kg-topbar"><div className="f1"><h1>Paramètres</h1><div className="sub">Configuration du groupe · self-hosted</div></div></div>
      <div className="kg-content scroll">
        <div className="settings">
          <div className="card card-pad">
            <div className="sec-title">Identité du groupe</div>
            <div className="col gap16">
              <div className="field row"><span className="lab">Nom</span><div className="inp" style={{ width: 280 }}>Night Owls</div></div>
              <div className="field row"><span className="lab">Logo</span><div className="row gap12"><div className="kg-glyph">NO</div><Btn variant="ghost" size="sm" icon="image">Importer</Btn></div></div>
              <div className="field row"><span className="lab">Type d’activité</span><div className="row gap8 wrap">{["Gaming / alliance", "Running club", "Autre…"].map((t, i) => <Chip key={t} tone={i === 0 ? "accent" : ""} lg>{t}</Chip>)}</div></div>
            </div>
            <div className="note"><Icon name="sparkles" size={14} style={{ color: "var(--accent)" }} />Le type d’activité adapte automatiquement les modules, champs et libellés.</div>
          </div>
          <div className="card card-pad">
            <div className="sec-title">Rôles & permissions</div>
            {[["Admin", "Tous les droits"], ["Modérateur", "Gérer messages & events"], ["Membre", "Participer"], ["Invité", "Lecture seule"]].map(([r, d]) => (
              <div className="setrow" key={r}><span className="rolepill">{r}</span><span className="f1 t2" style={{ fontSize: 13.5 }}>{d}</span><IconBtn name="dots" size={18} /></div>
            ))}
            <Btn variant="soft" size="sm" icon="plus" >Ajouter un rôle</Btn>
          </div>
          <div className="card card-pad">
            <div className="sec-title">Système · self-host</div>
            {[["Version", "v0.4.2"], ["Base de données", "MySQL"], ["Sauvegarde automatique", "quotidienne"], ["Stockage fichiers", "3,2 / 20 Go"]].map(([k, v]) => (
              <div className="setrow" key={k}><span className="f1" style={{ fontWeight: 600, fontSize: 14 }}>{k}</span><Chip>{v}</Chip></div>
            ))}
            <div className="row" style={{ justifyContent: "flex-end", marginTop: 6 }}><Btn variant="ghost" size="sm" icon="logout">Sauvegarder maintenant</Btn></div>
          </div>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { AdminArea });
