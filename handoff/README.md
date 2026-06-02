# Handoff — KeepGrouped

Outil self-hosted de gestion de groupe & communication, adaptable au type d'activité du groupe (alliance de jeu, running club, etc.). Un seul groupe par instance hébergée.

---

## 1. À propos de ces fichiers

Les fichiers de ce bundle sont des **références de design réalisées en HTML/CSS/React (via Babel in-browser)** — des prototypes qui montrent l'apparence et le comportement visés. **Ce n'est pas du code de production à copier tel quel.**

La tâche : **recréer ces écrans dans l'environnement cible du projet** — ici **React (CSR) + TailwindCSS**, conformément à la stack décrite (front React/TypeScript, back C#/.NET ASP.NET Core, MySQL + EF Core, SignalR pour le temps réel, RAG/ChromaDB pour l'assistant). Reprenez la **direction visuelle et les tokens** ci-dessous, mais réimplémentez avec les patterns/composants de votre codebase (pas de Babel in-browser, pas de CSS global monolithique — convertir en classes Tailwind + composants).

## 2. Fidélité

**Haute fidélité (hi-fi).** Couleurs, typographie, espacements, rayons et interactions sont définitifs. Recréez l'UI fidèlement avec votre design system. Les wireframes low-fi (dossier `wireframes/`) sont fournis comme **historique de structure/flux** uniquement — ne pas styler à partir d'eux.

Le contenu est **fictif** (groupe « Night Owls », membres, messages). Le compte à rebours, les RSVP et l'assistant IA sont **statiques** dans le proto.

---

## 3. Design tokens

Tous définis dans `kg.css` (`:root` = clair, `[data-theme="dark"]` = sombre). Thème **clair par défaut**, sombre basculable. Personnalité : chaleureux/communautaire, arrondi, aéré.

### Couleurs — thème clair
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#f7f1e7` | Fond de page (crème chaud) |
| `--bg-2` | `#f0e7d8` | Fond sidebar |
| `--surface` | `#fffdf8` | Cartes / surfaces |
| `--surface-2` | `#faf4ea` | Surface secondaire / hover léger |
| `--hover` | `#f3ecdf` | Survol items |
| `--text` | `#2c2820` | Texte principal |
| `--text-2` | `#716856` | Texte secondaire |
| `--muted` | `#9c9384` | Texte atténué / labels |
| `--border` | `#ece1cf` | Bordures |
| `--border-2` | `#e1d4bd` | Bordures appuyées |
| `--accent` | `#e8743c` | **Accent coral (primaire)** |
| `--accent-ink` | `#fffaf6` | Texte sur accent |
| `--accent-soft` | `color-mix(accent 15%, surface)` | Fond accent doux (chips, nav active) |
| `--good` | `#3f9e6b` | Succès / présence en ligne / RSVP oui |
| `--good-soft` | `#e2f0e6` | Fond succès doux |

### Couleurs — thème sombre
`--bg #1a1613` · `--bg-2 #131009` · `--surface #241f19` · `--surface-2 #2c261e` · `--hover #2f281f` · `--text #f4ede1` · `--text-2 #b7ad9b` · `--muted #857b6b` · `--border #342c22` · `--border-2 #40372b` · `--good #4cb784`. Accent identique (`#e8743c`).

### Couleurs de TYPE d'événement (catégories configurables par l'admin)
`Raid #c8607f` · `Entraînement #d98a2b` · `Sortie #3f9e8f` · `Réunion #5b7fd0`. (cf. `KG.TYPE` dans `kg-core.jsx`.)

### Palette d'avatars (monogrammes, hash du nom → couleur, texte blanc)
`#e8743c, #d98a2b, #c8607f, #6f9a3f, #3f9e8f, #5b7fd0, #a86bd6, #cf6452` (`AV_COLORS`).

### Accents alternatifs (proposés en Tweak)
Coral `#e8743c` (défaut) · Miel `#d98a2b` · Baie `#c8607f` · Bleu `#5b7fd0`.

### Typographie
- **Titres** : `Bricolage Grotesque` (600–700), `letter-spacing: -0.01em`, `line-height: 1.1`.
- **Corps / UI** : `Figtree` (400–700).
- Alternatives proposées en Tweak : « Géométrique » = Outfit/Outfit ; « Techno » = Space Grotesk/Figtree.
- Échelle observée : h1 page 21px · h2 hero 30px · titre doc 30px · titres de section 15.5px · corps 14–15.5px · meta 11–13px · uppercase labels 11px (`letter-spacing .05–.06em`).

### Rayons (Tweak « Coins » : Net / Doux / Rond)
Défaut **Doux** : `--r 18px` (cartes), `--r-sm 12px`, `--r-lg 26px`, `--r-pill 999px`. Net = 10/8/14 · Rond = 26/16/34.

### Ombres
`--shadow-sm: 0 1px 2px rgba(125,95,55,.06), 0 3px 8px rgba(125,95,55,.05)` · `--shadow: …, 0 12px 30px rgba(125,95,55,.09)` · `--shadow-lg: 0 12px 50px rgba(110,80,45,.18)`. (En sombre, ombres noires plus marquées.)

### Espacements
Padding contenu principal 24px ; gaps cartes 14–16px ; padding cartes 20px (`.card-pad`) ; topbar 16px 24px. Interface **aérée** — privilégier l'air.

---

## 4. Layout global (style Slack, 1 groupe)

```
┌────────────┬────────────────────────────────────────────┐
│  Sidebar   │  Main (topbar + contenu scrollable)         │
│  264px     │  flex:1                                      │
└────────────┴────────────────────────────────────────────┘
```
- **Sidebar (`.kg-side`, 264px)** : en-tête groupe (glyphe NO + nom + type + chevron), recherche (pilule), nav (Accueil, Calendrier, Connaissances, Messages privés + badge non-lus), section **Channels** (# + non-lus), section **À venir** (3 prochains events avec pastille de type), pied (avatar « Toi » + statut en ligne + bouton étincelle = onboarding + bouton rouage = admin).
- **Main (`.kg-main`)** : `.kg-topbar` (titre + sous-titre + actions à droite) puis `.kg-content.scroll`.
- L'**espace Admin** remplace la sidebar par `.adm-side` (nav admin + « Retour à l'app »).
- L'**Onboarding** est plein cadre, sans sidebar.

Navigation = état local dans `App` (`kg-shell.jsx`) : `{ area: 'app'|'admin'|'onboarding', screen, channel, dmIdx, eventId, adminSection }`. À remplacer par **React Router** (routes : `/`, `/calendar`, `/event/:id`, `/c/:channel`, `/dm/:id`, `/kb`, `/admin/:section`, `/onboarding`).

---

## 5. Écrans

### 5.1 Accueil / Dashboard (`DashboardScreen`)
- **But** : hub du groupe.
- **Hero** (`.hero`, grid 1.45fr/1fr, radius `--r-lg`) : à gauche chips (type + heure), titre 30px, lieu (`mapPin` + label + badge « lieu adaptable »), **compte à rebours** 30px mono-style + chip « 18/25 inscrits » (good), actions « Je viens » (primary) / « Peut-être » (ghost) / « Détails » (lien). À droite, **cover abstraite** (dégradé 135° entre 2 couleurs hashées + motif pointillé + blobs floutés) avec trophée + « Boss final ».
- **Sections** : « Vos channels » (grid-4 de cartes channel cliquables), « Connaissances récentes » (grid-4 de doc-cards avec cover en thumbnail), « Activité récente » (liste avatar + texte + temps + icône de type).

### 5.2 Calendrier (`CalendarScreen`)
- Topbar : titre + « Mai 2026 » + nav ‹ › + segment Mois/Semaine/Liste (Mois actif) + « + Événement ».
- **Filtres** : chips par type d'événement (toggle on/off, pastille colorée) + « + type ».
- **Grille mois** (`.month`, 7 col, lignes égales) : en-têtes Lun→Dim ; cellules avec numéro (rond ; aujourd'hui = pastille accent ; jour sélectionné = fond `--accent-soft`), **pastilles d'événement** (`.ev-pill`, bord gauche coloré par type, texte tronqué) cliquables → détail.
- **Panneau latéral** (312px) : « {jour} mai · N évén. » puis cartes `.evd` (type, heure, titre, lieu + badge adaptable, avatars participants, bouton RSVP).

### 5.3 Détail événement (`EventScreen`) — 2 volets
- **Header** : ‹ retour + chip type + titre + date/heure ; à droite « Je viens » (primary quand sélectionné) / « Peut-être ».
- **Volet gauche** (`.ev-info`, 404px, scroll) : cover ; blocs **Quand**, **Lieu** (badge « champ adaptable » + cover-map avec pin + label/valeur — le lieu est un **champ dont le type dépend de l'activité du groupe** : GPS, serveur de jeu, salle…), **Description**, **Participants** (groupe d'avatars + compteur), **Organisé par**, **Fichiers** (lignes fichier icône + nom + taille).
- **Volet droit** : **discussion propre à l'événement** (header + messages + composer). Chaque événement a son fil.

### 5.4 Chat / channels (`ChatScreen`)
- Header thread : `#` + nom channel + topic + nb membres ; avatars en ligne ; icônes cloche/épingle/membres.
- Messages (`.msg` : avatar 40px + nom + heure + texte + réactions). Lien **« N réponses · voir le fil »** ouvre un panneau **fil** latéral (280px) avec ses propres messages + composer.
- **Composer** (`.composer`) : zone de saisie + barre (trombone, image, emoji) + bouton envoyer (carré accent). `:focus-within` → bordure accent.

### 5.5 Messages privés (`DMScreen`) — liste + conversation
- **Liste** (300px) : « Messages » + bouton nouveau ; lignes conversation (avatar + présence, nom, heure, aperçu — gras si non-lu, badge compteur). Ligne active = `--accent-soft`.
- **Conversation** : header (avatar + nom + en ligne) ; **bulles** (moi = accent aligné à droite `.ai-msg.user` ; autre = surface aligné à gauche `.ai-msg.bot`) + heure ; composer.

### 5.6 Connaissances (`KnowledgeScreen`) — arbre + doc + assistant IA
- **Arbre** (264px) : pages/dossiers, enfants indentés, item actif `--accent-soft`.
- **Document** : fil d'Ariane + bouton **« ✦ Assistant IA »** (toggle), icônes éditer/⋯ ; corps (h1 30px, meta, paragraphes 15.5px line-height 1.7, **callout** accent doux, sous-titres h3).
- **Panneau Assistant IA** (360px, à droite — **présent uniquement dans Connaissances**) : header (✦ + « Assistant » + badge « RAG »), bulles bot/user, **sources citées** (chips fichier), **suggestions** (chips), composer. ⇒ à brancher sur le service **RAG/ChromaDB**.

### 5.7 Onboarding (`OnboardingScreen`) — guidé par l'IA
- Plein cadre, fond dégradé doux. Carte chat (560px) : header (glyphe + « Accueil guidé » + « Passer »), conversation (bot demande centres d'intérêt → chips ; recommande des channels → chips ; propose de s'inscrire au prochain event → « M'inscrire » / « Plus tard »), composer. « Passer »/fin → `/` (Accueil).

### 5.8 Admin (`AdminArea`) — 5 sections
Sidebar admin (`.adm-side`) : Vue d'ensemble, Membres & rôles, Modules & tables, Événements, Paramètres + « Retour à l'app ».
- **Vue d'ensemble** : 6 stat-cards (grand chiffre + label + delta) ; Activité récente ; Actions rapides.
- **Membres & rôles** : recherche + « Inviter » ; **table** (Membre avec avatar/présence, Rôle = pill avec pastille colorée + chevron, Channels, Inscrit, ⋮). Rôles : Admin (accent), Modérateur (good), Membre, Invité.
- **Modules & tables** : liste de modules (Événements, Connaissances, Loadouts, + Nouveau) ; **éditeur de table** = champs réordonnables (poignée ⠿ + nom + sélecteur de type + ✕) + « Ajouter un champ ». Chip « champs adaptables ». ⇒ **création dynamique de tables/champs selon le type de groupe** (à mapper sur EF Core / schéma dynamique).
- **Événements** : table des events (pastille type, chip type, date, inscrits, ⋮) + **formulaire « Nouvel événement »** dont les champs sont ceux du module (dont « Lieu — champ adaptable »).
- **Paramètres** : Identité (nom, logo, **type d'activité** = Gaming/alliance · Running club · Autre — pilote l'adaptabilité), Rôles & permissions, **Système self-host** (version, base MySQL, sauvegarde, stockage).

---

## 6. Interactions & comportements
- **Navigation** : clic sur nav/channel/event/membre → changement de vue (router). `key` sur la vue principale pour remount propre.
- **Hover** : items nav/channel → `--hover` ; cartes channel/doc → `translateY(-2px)` + `--shadow`.
- **Composer** : `:focus-within` → bordure `--accent-line`.
- **Filtres calendrier** : toggle visuel masquant les pastilles du type.
- **Assistant IA** : toggle ouvre/ferme le panneau (Connaissances uniquement).
- **Temps réel attendu** (à implémenter via **SignalR**) : messages channels, fils, DMs, présence en ligne, badges non-lus, RSVP live.
- **Pas d'animation d'entrée** (volontairement retirée). Transitions courtes : `transform .08s` (boutons), `background .12–.14s`.
- **Responsive** : proto pensé **desktop d'abord**. Prévoir repli mobile (sidebar en drawer, volets empilés) — non maquetté.

## 7. État / données
Voir `kg-core.jsx` (`window.KG`) pour les formes de données : `group`, `me`, `members[{name,role,online}]`, `channels[{name,icon,unread}]`, `events[{id,title,type,date,time,day,locLabel,locValue,going,capacity,org,desc}]`, `calEvents{jour:[ids]}`, `channelMsgs`, `threadMsgs`, `dms`, `dmMsgs`, `activity`, `kbTree`.

À remplacer par des appels API (.NET) + state/cache (React Query ou équivalent) et flux SignalR pour le live.

## 8. Icônes
Set d'icônes **SVG line maison** (stroke `currentColor`, width ~1.9, viewBox 24, round caps) dans `kg-core.jsx` (`ICONS`). Noms utilisés : home, calendar, book, chat, bell, search, plus, gear, users, hash, lock, chevron(Down/Right/Left), send, clip, pin, sparkles, dots, mapPin, clock, check, x, file, smile, image, arrowLeft, grid, shield, sliders, folder, trophy, edit, logout, megaphone, dumbbell, reply, globe. ⇒ remplaçables par votre librairie (ex. Lucide — équivalences directes).

## 9. Assets / imagerie
**Aucune image bitmap.** Les avatars sont des monogrammes colorés (hash du nom) ; les « covers » d'événements/docs sont des **dégradés abstraits + motif + blobs** générés (`Cover` dans `kg-core.jsx`). Les emplacements logo/cover sont à remplacer par de vrais uploads côté produit.

## 10. Fichiers de ce bundle
- `KeepGrouped.html` — point d'entrée (fonts, chargement des scripts, mount React).
- `kg.css` — **tous les tokens + styles** (source de vérité visuelle).
- `kg-core.jsx` — icônes, atomes (`Avatar`, `Chip`, `Btn`, `IconBtn`, `Cover`, `Icon`), **données mock** `KG`.
- `kg-shell.jsx` — `App`, `Sidebar`, routeur d'écran, intégration **Tweaks** (thème/accent/police/coins).
- `kg-comms.jsx` — Dashboard, Chat, DM (+ `ChatMessages`, `Composer`).
- `kg-events.jsx` — Calendrier, Détail événement.
- `kg-misc.jsx` — Connaissances (+ `AIPanel`), Onboarding.
- `kg-admin.jsx` — Admin (5 sections).
- `tweaks-panel.jsx` — panneau de réglages du proto (non destiné au produit).
- `wireframes/` — exploration low-fi (référence structure/flux uniquement).

> Pour lancer le proto : ouvrir `KeepGrouped.html` dans un navigateur (les `.jsx` sont compilés par Babel in-browser ; nécessite un accès réseau aux CDN React/Babel/fonts).
