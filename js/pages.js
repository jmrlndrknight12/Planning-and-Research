/* Page renderers – each returns HTML string, mounted by main.js */
(function () {
  const { icon, avatar, art, fmtDate, pageHero } = window.UI;
  const H = () => window.HOME,
    A = () => window.ABOUT,
    P = () => window.PAGES;
  const sec = (inner, alt) =>
    `<section class="section${alt ? " alt" : ""}"><div class="container">${inner}</div></section>`;
  const head = (eyebrow, title, p) =>
    `<div class="section-head reveal"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${p ? `<p>${p}</p>` : ""}</div></div>`;

  const portrait = (photo) =>
    `<div class="portrait">${photo ? `<img src="${encodeURI(photo)}" alt="">` : icon("users")}</div>`;
  const photoCard = (person) =>
    `<div class="card person"><div>${portrait(person.photo)}<h3>${person.name}</h3><small>${person.role}</small></div></div>`;
  const editorialBoard = (b) => `
        <div class="board-leads">
          <div><h4 class="board-label">Editor-in-Chief</h4>${photoCard(b.chief)}</div>
          <div><h4 class="board-label">Associate Editor</h4>${photoCard(b.associate)}</div>
        </div>
        <h4 class="board-label">Managing Editors</h4>
        <div class="grid g4">${b.managing.map(photoCard).join("")}</div>
        <h4 class="board-label">Editors</h4>
        <div class="grid g4">${b.editors.map(photoCard).join("")}</div>`;

  const R = {};

  /* ---------------- HOME ---------------- */
  R.home = () => {
    const h = H(),
      w = h.welcome;
    const hero = `
    <section class="hero"><div class="container">
      <div class="reveal"><span class="eyebrow">${w.eyebrow}</span>
        <h1>${w.heading}</h1><p>${w.text}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="research-agenda.html">Research Agenda ${icon("arrow")}</a>
          <a class="btn btn-ghost" href="publications.html">Browse Publications</a>
        </div></div>
      <div class="hero-card reveal"><h3>Office at a glance</h3>
        <div class="hero-stats">${w.stats.map((s) => `<div class="stat"><b>${s.n}</b><span>${s.l}</span></div>`).join("")}</div></div>
    </div>
    <svg class="wave" viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0 30C240 70 480 0 720 25s480 40 720 5V60H0z"/></svg></section>`;

    const [f, ...rest] = h.announcements;
    const featured = sec(`
      ${head("Announcements", "Featured Announcements", "The latest notices and reminders from the office.")}
      <div class="feature reveal">
        <a class="card main" href="${f.href}" style="position:relative;display:block">
          <div class="art a1" style="min-height:340px;height:100%;aspect-ratio:auto">${f.image ? `<img src="${f.image}" alt="">` : `<span class="ph">IMAGE PLACEHOLDER</span><span class="circle"></span>`}
            <div class="feature-copy"><span class="tag gold">${f.tag}</span><h3>${f.title}</h3><p>${f.text}</p>
            <div class="meta" style="color:#bfe9e2"><span>${icon("cal")}${fmtDate(f.date)}</span></div></div></div>
        </a>
        <div class="stack">${rest
          .map(
            (a, i) => `
          <a class="card mini" href="${a.href}">${art(i + 1, a.image, "")}
            <div><span class="tag">${a.tag}</span><h3 style="margin-top:6px">${a.title}</h3>
            <div class="meta"><span>${icon("cal")}${fmtDate(a.date)}</span></div></div></a>`,
          )
          .join("")}</div>
      </div>`);

    const cards = sec(
      `
      ${head("News & Activities", "Announcement Cards")}
      <div class="grid g4">${h.announcements
        .map(
          (a, i) => `
        <a class="card reveal" href="${a.href}">${art(i, a.image, a.tag)}
          <div class="card-body"><h3>${a.title}</h3><p>${a.text}</p>
          <div class="meta"><span>${icon("cal")}${fmtDate(a.date)}</span></div>
          <span class="more">Read more ${icon("arrow")}</span></div></a>`,
        )
        .join("")}</div>`,
      true,
    );

    const cal = sec(`
      ${head("Calendar", "Calendar of Activities", "Select a marked date to see the activity.")}
      <div class="cal-wrap reveal">
        <div class="card calendar">
          <div class="cal-head"><h3 id="cal-title"></h3><div class="cal-nav"><button id="cal-prev" aria-label="Previous month">‹</button> <button id="cal-next" aria-label="Next month">›</button></div></div>
          <div class="cal-grid" id="cal-grid"></div>
        </div>
        <div class="event-list" id="event-list"></div>
      </div>`);

    const updates = sec(
      `
      <div class="grid g2" style="align-items:start;gap:48px">
        <div>${head("Latest", "Office Updates")}
          <div class="timeline">${h.updates
            .map(
              (u) => `
            <div class="tl-item reveal"><time>${fmtDate(u.date)}</time><h4>${u.title}</h4><p>${u.text}</p></div>`,
            )
            .join("")}</div></div>
        <div>${head("Quick Access", "Research Resources")}
          <div class="grid g2">${h.quick
            .map(
              (q) => `
            <a class="card quick reveal" href="${q.href}"><div class="ico">${icon(q.icon)}</div><h3>${q.title}</h3><p>${q.text}</p></a>`,
            )
            .join("")}</div></div>
      </div>`,
      true,
    );

    return hero + featured + cards + cal + updates;
  };

  /* ---------------- ABOUT ---------------- */
  R.about = () => {
    const a = A();
    const mv = sec(`
      ${head("Who We Are", "Vision & Mission")}
      <div class="grid g2">
        <div class="card mv-card reveal"><span class="big">01</span><h3>Vision</h3><p>${a.vision}</p></div>
        <div class="card mv-card reveal"><span class="big">02</span><h3>Mission</h3><p>${a.mission}</p></div>
      </div>`);
    const dir = sec(
      `
      ${head("Directory", "Office Directory", "Staff and contact information of the office.")}
      <div class="grid g4">${a.directory
        .map(
          (p) => `
        <div class="card person reveal">${avatar(p.name, p.photo)}<h3>${p.name}</h3><small>${p.role}</small>
          ${p.email || p.phone ? `<div class="meta" style="justify-content:center;flex-direction:column;align-items:center;gap:4px">${p.email ? `<span>${icon("mail")}${p.email}</span>` : ""}${p.phone ? `<span>${icon("phone")}${p.phone}</span>` : ""}</div>` : ""}</div>`,
        )
        .join("")}</div>`,
      true,
    );
    const hub = sec(`
      ${head("Location", "Research Hub Location")}
      <div class="hub reveal">
        <div class="card hub-info"><h3>${a.hub.name}</h3><ul>
          <li>${icon("pin")}<span>${a.hub.mapUrl ? `<a href="${a.hub.mapUrl}" target="_blank" rel="noopener">${a.hub.address}</a>` : a.hub.address}</span></li>
          <li>${icon("clock")}<span>${a.hub.hours}</span></li>
          <li>${icon("mail")}<span>${a.hub.contact}</span></li></ul></div>
        <div class="map-ph${a.hub.mapEmbed ? " has-map" : ""}">${a.hub.mapEmbed ? `<iframe src="${a.hub.mapEmbed}" loading="lazy" title="Map of ${a.hub.name}"></iframe>` : `<div>${icon("pin")}<br>Map placeholder<br><small style="font-weight:500">Paste Google Maps embed URL in data.js</small></div>`}</div>
      </div>`);
    const org = sec(
      `
      ${head("Structure", "Organizational Structure", "Hold and drag to move the chart. Zoom in, zoom out, or choose See all. Select a box for details.")}
      <div class="org-tools">
        <button class="chip" id="org-expand" type="button">Expand all</button>
        <button class="chip" id="org-collapse" type="button">Collapse all</button>
        <div class="org-zoom">
          <button class="chip" id="org-out" type="button" aria-label="Zoom out">−</button>
          <span class="org-zoom-label" id="org-zoom-label">100%</span>
          <button class="chip" id="org-in" type="button" aria-label="Zoom in">+</button>
          <button class="chip" id="org-fit" type="button">See all</button>
        </div>
      </div>
      <div class="org-scroll reveal"><div class="org-stage" id="org-stage"><div class="tree" id="org-tree"></div></div></div>`,
      true,
    );
    return mv + dir + hub + org;
  };

  /* ---------------- COMMITTEES ---------------- */
  R.committees = () => {
    const p = P().committees;
    const names = (v) => (Array.isArray(v) ? v.join("<br>") : v || "—");
    const drcTable = `<div class="table-wrap">
        <table class="sheet">
          <thead><tr>
            <th>District</th>
            <th>PSDS</th>
            <th>District Research Coordinator</th>
            <th>Designation</th>
          </tr></thead>
          <tbody>${(p.masterlist?.rows || [])
            .map(
              (r) => `<tr>
            <td><b>${r.district}</b></td>
            <td>${r.psds}</td>
            <td>${names(r.name)}</td>
            <td>${r.role || "—"}</td>
          </tr>`,
            )
            .join("")}</tbody>
        </table>
      </div>`;
    let lastDistrict = "";
    const schoolRows = (p.schools || [])
      .map((s) => {
        const group =
          s.district === lastDistrict
            ? ""
            : `<tr class="group"><td colspan="4">${(lastDistrict = s.district)}</td></tr>`;
        return `${group}<tr>
            <td><b>${s.school}</b><br><span class="muted">${s.level}</span></td>
            <td>${s.head}<br><span class="muted">${s.headRole}</span></td>
            <td>${s.coordinator || "—"}</td>
            <td>${s.role || "—"}</td>
          </tr>`;
      })
      .join("");
    const srcTable = `<div class="table-wrap">
        <table class="sheet">
          <thead><tr>
            <th>School</th>
            <th>School Head</th>
            <th>School Research Coordinator</th>
            <th>Designation</th>
          </tr></thead>
          <tbody>${schoolRows}</tbody>
        </table>
      </div>`;
    return (
      pageHero(p.title, p.sub) +
      sec(
        `<div class="grid g2">${p.items
          .map((c) => {
            const isDrc = c.name.startsWith("District Research Committee");
            const isSrc = c.name.startsWith("School Research Committee");
            const isSdrc = c.name.startsWith("Schools Division Research Committee");
            const body = isDrc
              ? drcTable
              : isSrc
                ? srcTable
                : isSdrc
                  ? editorialBoard(c.board)
                  : `<span class="tag">Members</span><ul class="bullets">${c.members.map((m) => `<li>${m}</li>`).join("")}</ul>`;
            return `
      <div class="card card-body reveal${isDrc || isSrc || isSdrc ? " span-2" : ""}"><div class="row" style="padding:0 0 14px"><div class="ico">${icon("users")}</div><div class="grow"><h3>${c.name}</h3><p style="margin:0">${c.desc}</p></div></div>
      ${body}</div>`;
          })
          .join("")}</div>`,
      )
    );
  };

  /* ---------------- AGENDA ---------------- */
  R.agenda = () => {
    const p = P().agenda;
    return (
      pageHero(p.title, p.sub) +
      sec(`
      <div class="notice">${p.notice}</div>
      <div class="grid g3">${p.themes
        .map(
          (t, i) => `
        <div class="card card-body reveal"><div class="num">${String(i + 1).padStart(2, "0")}</div><h3 style="margin-top:10px">${t.t}</h3>
        <ul class="bullets">${t.points.map((x) => `<li>${x}</li>`).join("")}</ul></div>`,
        )
        .join("")}</div>
      <p style="margin-top:32px"><a class="btn btn-primary" href="${p.download}">${icon("download")} Download Full Research Agenda</a></p>`)
    );
  };

  /* ---------------- NEWSLETTERS ---------------- */
  R.newsletters = () => {
    const p = P().newsletters;
    return (
      pageHero(p.title, p.sub) +
      sec(
        `<div class="grid g3">${p.items
          .map(
            (n, i) => `
      <div class="card reveal">${art(i, "", "Newsletter")}<div class="card-body"><h3>${n.title}</h3><p>${n.desc}</p>
      <div class="meta"><span>${icon("cal")}${fmtDate(n.date)}</span></div>
      <a class="more" href="${n.file}">${icon("download")} Download / Read</a></div></div>`,
          )
          .join("")}</div>`,
      )
    );
  };

  /* ---------------- AWARDS ---------------- */
  R.awards = () => {
    const p = P().awards;
    return (
      pageHero(p.title, p.sub) +
      sec(`
      <div class="toolbar" id="chips" data-target="#award-list"><button class="chip on" data-f="all">All</button>${p.years.map((y) => `<button class="chip" data-f="${y}">${y}</button>`).join("")}</div>
      <div class="grid g3" id="award-list">${p.items
        .map(
          (a) => `
        <div class="card card-body reveal" data-f="${a.year}"><div class="row" style="padding:0 0 12px"><div class="ico" style="background:#fff6e0;color:var(--gold-600)">${icon("award")}</div><span class="tag gold">${a.year}</span></div>
        <h3>${a.title}</h3><p>${a.by}</p><div class="meta"><span>${icon("users")}${a.who}</span></div></div>`,
        )
        .join("")}</div>`)
    );
  };

  /* ---------------- SPOTLIGHT ---------------- */
  R.spotlight = () => {
    const p = P().spotlight;
    return (
      pageHero(p.title, p.sub) +
      sec(
        `<div class="grid g3">${p.items
          .map(
            (s, i) => `
      <a class="card reveal" href="${s.href}">${art(i, s.image, "Spotlight")}<div class="card-body"><h3>${s.title}</h3>
      <div class="meta"><span>${icon("users")}${s.author}</span><span>${icon("pin")}${s.school}</span></div><p>${s.abstract}</p>
      <span class="more">View study ${icon("arrow")}</span></div></a>`,
          )
          .join("")}</div>`,
      )
    );
  };

  /* ---------------- PUBLICATIONS ---------------- */
  R.publications = () => {
    const p = P().publications;
    return (
      pageHero(p.title, p.sub) +
      sec(`
      <div class="toolbar"><input class="search" id="q" placeholder="Search publications…" aria-label="Search">
        <div id="chips" data-target="#pub-list" style="display:flex;gap:8px;flex-wrap:wrap"><button class="chip on" data-f="all">All</button>${p.cats.map((c) => `<button class="chip" data-f="${c}">${c}</button>`).join("")}</div></div>
      <div class="list" id="pub-list">${p.items
        .map(
          (x) => `
        <div class="card row reveal" data-f="${x.cat}" data-s="${(x.title + x.author + x.year).toLowerCase()}"><div class="ico">${icon("file")}</div>
        <div class="grow"><span class="tag">${x.cat}</span><h3 style="margin-top:6px">${x.title}</h3><div class="meta"><span>${icon("users")}${x.author}</span><span>${icon("cal")}${x.year}</span></div></div>
        <a class="btn btn-outline" href="${x.file}">${icon("download")} PDF</a></div>`,
        )
        .join("")}</div>
      <p class="empty-msg" id="empty">No results found.</p>`)
    );
  };

  /* ---------------- BRACE ---------------- */
  R.brace = () => {
    const p = P().brace;
    return (
      pageHero(p.title, p.sub) +
      sec(`
      ${head("About", "About BRACE")}<div class="card card-body reveal" style="margin-bottom:48px"><p style="font-size:1rem;margin:0">${p.about}</p></div>
      ${head("Leadership", "Officers")}<div class="grid g4" style="margin-bottom:48px">${p.officers.map(photoCard).join("")}</div>
      ${head("Programs", "Activities")}<div class="grid g3">${p.activities.map((a, i) => `<div class="card card-body reveal"><div class="num">${String(i + 1).padStart(2, "0")}</div><h3 style="margin-top:8px">${a.title}</h3><p>${a.text}</p></div>`).join("")}</div>`)
    );
  };

  /* ---------------- DATA MANAGEMENT ---------------- */
  R.datamgmt = () => {
    const p = P().datamgmt;
    return (
      pageHero(p.title, p.sub) +
      sec(
        `<div class="grid g3">${p.tools
          .map(
            (t) => `
      <a class="card quick reveal" href="${t.href}"><div class="ico">${icon(t.icon)}</div><h3>${t.title}</h3><p>${t.text}</p><span class="more">Open ${icon("arrow")}</span></a>`,
          )
          .join("")}</div>`,
      )
    );
  };

  /* ---------------- RESOURCES ---------------- */
  R.resources = () => {
    const p = P().resources;
    return (
      pageHero(p.title, p.sub) +
      sec(`
      <div class="toolbar"><input class="search" id="q" placeholder="Search resources…" aria-label="Search">
        <div id="chips" data-target="#res-list" style="display:flex;gap:8px;flex-wrap:wrap"><button class="chip on" data-f="all">All</button>${p.cats.map((c) => `<button class="chip" data-f="${c}">${c}</button>`).join("")}</div></div>
      <div class="list" id="res-list">${p.items
        .map(
          (x) => `
        <a class="card row reveal" href="${x.href}" data-f="${x.cat}" data-s="${(x.title + x.desc).toLowerCase()}"><div class="ico">${icon(x.cat === "Links" ? "link" : "file")}</div>
        <div class="grow"><span class="tag">${x.cat}</span><h3 style="margin-top:6px">${x.title}</h3><p style="margin:0">${x.desc}</p></div>${icon("arrow")}</a>`,
        )
        .join("")}</div>
      <p class="empty-msg" id="empty">No results found.</p>`)
    );
  };

  window.RENDER = R;
})();
