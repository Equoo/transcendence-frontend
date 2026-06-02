/* KeepGrouped — Knowledge base (+ AI assistant) & Onboarding */

function AIPanel({ onClose, title = "Assistant", suggestions, convo }) {
  return (
    <div className="ai-panel kg-fade">
      <div className="ai-head"><Icon name="sparkles" size={18} style={{ color: "var(--accent)" }} /><span className="t">{title}</span><span className="pin">RAG</span>{onClose && <IconBtn name="x" size={18} onClick={onClose} style={{ marginLeft: 6 }} />}</div>
      <div className="ai-body scroll">
        {convo.map((m, i) => (
          <div key={i} className={"ai-msg " + (m.me ? "user" : "bot")}>
            {m.text}
            {m.sources && <div className="ai-src">{m.sources.map((s) => <Chip key={s} tone="accent"><Icon name="file" size={12} />{s}</Chip>)}</div>}
          </div>
        ))}
        <div className="ai-suggest">{suggestions.map((s) => <button className="ai-sug" key={s}>{s}</button>)}</div>
      </div>
      <Composer placeholder="Demandez à l’assistant…" />
    </div>
  );
}

function KnowledgeScreen({ nav, go }) {
  const [ai, setAi] = useState(true);
  const [active, setActive] = useState("Guide débutant");
  return (
    <main className="kg-main kg-fade" style={{ flexDirection: "row" }}>
      <div className="kb-tree">
        <div className="th"><h2>Connaissances</h2><div className="row gap6"><IconBtn name="search" size={18} /><IconBtn name="plus" size={18} /></div></div>
        <div className="kb-treebody scroll">
          {KG.kbTree.map((n) => (
            <React.Fragment key={n.title}>
              <div className={"tnode" + (active === n.title ? " active" : "")} onClick={() => !n.children && setActive(n.title)}>
                <span className="tw"><Icon name={n.children ? "chevronDown" : n.icon} size={n.children ? 13 : 15} /></span>
                <span className="f1">{n.title}</span>
              </div>
              {n.children && n.children.map((c) => (
                <div key={c.title} className={"tnode child" + (active === c.title ? " active" : "")} onClick={() => setActive(c.title)}>
                  <span className="tw"><Icon name="file" size={13} /></span>{c.title}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="kb-doc">
        <div className="kb-dochead">
          <div className="f1"><div className="muted" style={{ fontSize: 12.5, marginBottom: 2 }}>Guides / {active}</div></div>
          <Btn variant={ai ? "primary" : "soft"} icon="sparkles" onClick={() => setAi((v) => !v)}>Assistant IA</Btn>
          <IconBtn name="edit" size={18} /><IconBtn name="dots" size={18} />
        </div>
        <div className="kb-docbody scroll">
          <h1>{active}</h1>
          <div className="meta">Mis à jour il y a 2 jours · par Alex Rune · 4 min de lecture</div>
          <p>Bienvenue chez Night Owls ! Ce guide rassemble l’essentiel pour bien démarrer : comment fonctionnent les channels, comment s’inscrire aux événements et où trouver les ressources du groupe.</p>
          <div className="callout"><Icon name="sparkles" size={18} className="ci" /><div className="ct">Astuce : tu peux poser n’importe quelle question à l’assistant (panneau de droite). Il répond à partir de cette base de connaissances et du calendrier.</div></div>
          <h3>Les channels</h3>
          <p>Chaque channel a un rôle précis : <b>#annonces</b> pour les infos importantes, <b>#raids</b> pour la coordination, <b>#entraînement</b> pour les sessions. Active les notifications sur ceux qui t’intéressent.</p>
          <h3>S’inscrire à un événement</h3>
          <p>Ouvre le calendrier, choisis un événement et clique sur « Je viens ». Chaque événement a sa propre discussion et son lieu — qui peut être un point GPS, un serveur de jeu ou une salle, selon le type d’activité.</p>
          <h3>Bonnes pratiques</h3>
          <p>Reste courtois, préviens en cas d’absence, et n’hésite pas à partager tes comptes-rendus dans la base. La communauté vit de tes contributions.</p>
        </div>
      </div>

      {ai && <AIPanel onClose={() => setAi(false)}
        suggestions={["Compo recommandée", "Lieu du prochain raid", "Qui organise ?"]}
        convo={[
          { me: false, text: "Salut 👋 Je suis l’assistant du groupe. Je réponds à partir de vos docs et de votre calendrier." },
          { me: true, text: "Comment me préparer au raid de jeudi ?" },
          { me: false, text: "Pour le Raid — Donjon de Cendres : prends des potions, arrive 10 min avant pour le brief en vocal, et joue la compo 3-1-1 (2 soigneurs).", sources: ["Guide débutant", "Stratégies de raid"] },
        ]} />}
    </main>
  );
}

/* ---------------- Onboarding (guidé par l'IA) ---------------- */
function OnboardingScreen({ go }) {
  const enter = () => go({ area: "app", screen: "home" });
  return (
    <main className="kg-main" style={{ flexDirection: "row" }}>
      <div className="onb-stage">
        <Cover seed="onb" className="onb-bg" style={{ borderRadius: 0, opacity: .14 }} />
        <div className="onb-chat">
          <div className="onb-head">
            <div className="kg-glyph" style={{ width: 34, height: 34, fontSize: 14 }}>NO</div>
            <div className="f1"><div className="t">Accueil guidé · Night Owls</div><div className="s">Assistant — propulsé par la base de connaissances</div></div>
            <Btn variant="plain" size="sm" onClick={enter}>Passer</Btn>
          </div>
          <div className="onb-body scroll">
            <div className="ai-msg bot" style={{ maxWidth: "92%" }}>Bienvenue 🎉 Je vais t’aider à t’installer en 2 minutes. Sur quoi veux-tu être actif ?</div>
            <div className="ai-suggest">{["Raids", "Entraînement", "Sorties", "Social"].map((s, i) => <button key={s} className="ai-sug" style={i < 2 ? { background: "var(--accent)", color: "var(--accent-ink)", borderColor: "transparent" } : {}}>{s}</button>)}</div>
            <div className="ai-msg user" style={{ maxWidth: "70%" }}>Raids et entraînement surtout.</div>
            <div className="ai-msg bot" style={{ maxWidth: "92%" }}>Parfait ! Je te recommande de suivre ces channels :
              <div className="ai-src">{["# raids", "# entraînement", "# annonces"].map((s) => <Chip key={s} tone="accent">{s}</Chip>)}</div>
            </div>
            <div className="ai-msg bot" style={{ maxWidth: "92%" }}>Et il y a un <b>Raid — Donjon de Cendres</b> jeudi soir. Je t’y inscris ?
              <div className="row gap8" style={{ marginTop: 10 }}><Btn variant="primary" size="sm" icon="check">M’inscrire</Btn><Btn variant="ghost" size="sm">Plus tard</Btn></div>
            </div>
          </div>
          <div className="onb-foot"><Composer placeholder="Pose une question ou réponds…" /></div>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { KnowledgeScreen, OnboardingScreen, AIPanel });
