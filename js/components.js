/* Reusable components: header, nav, footer, icons, helpers */
(function () {
  const ICONS = {
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    folder:
      '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    shield:
      '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone:
      '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 21l5-3 5 3-1.5-7"/>',
    users:
      '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  };
  const icon = (n) =>
    `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;

  const initials = (name) => {
    const clean = (name || "").replace(/[\[\]]/g, "").trim();
    if (!clean || /^(full\s*)?name$/i.test(clean)) return "SDO";
    return clean
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };
  const avatar = (name, photo) =>
    `<div class="avatar">${photo ? `<img src="${encodeURI(photo)}" alt="${name}">` : initials(name)}</div>`;

  const art = (i, image, label) =>
    `<div class="art a${(i % 4) + 1}">${image ? `<img src="${image}" alt="">` : `<span class="ph">IMAGE PLACEHOLDER</span><span class="circle"></span>`}${label ? `<span class="tag">${label}</span>` : ""}</div>`;

  const fmtDate = (iso, opts) =>
    new Date(iso + "T00:00:00").toLocaleDateString(
      "en-PH",
      opts || { month: "short", day: "numeric", year: "numeric" },
    );

  function header(active) {
    const S = window.SITE;
    const logos = S.logos
      .map(
        (l) =>
          `<div class="logo-ph${l.src ? " has-logo" : ""}" title="${l.label}">${l.src ? `<img src="${l.src}" alt="${l.label}">` : l.label}</div>`,
      )
      .join("");
    const links = S.nav
      .map((n) => {
        const href = n.external ? S.archiveUrl : n.href;
        const ext = n.external
          ? ' class="ext" target="_blank" rel="noopener"'
          : n.key === active
            ? ' class="active" aria-current="page"'
            : "";
        return `<a href="${href}"${ext}>${n.label}${n.external ? " ↗" : ""}</a>`;
      })
      .join("");
    return `
    <div class="topbar"><div class="container">
      <span><b>Republic of the Philippines</b> · ${S.department}</span>
      <span>${new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
    </div></div>
    <header class="site-header"><div class="container brand-row">
      <div class="logos">${logos}</div>
      <div class="brand-text">
        <small>${S.department} · ${S.office}</small>
        <strong>SDO Batangas City</strong>
        <span>${S.unit}</span>
      </div>
    </div></header>
    <div class="nav-wrap"><div class="container">
      <button class="menu-btn" aria-expanded="false" aria-controls="nav">${icon("menu")} Menu</button>
      <nav class="nav" id="nav" aria-label="Main navigation">${links}</nav>
    </div></div>`;
  }

  function footer() {
    const S = window.SITE,
      c = S.contact;
    const logos = S.logos
      .map(
        (l) =>
          `<div class="logo-ph${l.src ? " has-logo" : ""}">${l.src ? `<img src="${l.src}" alt="${l.label}">` : "LOGO"}</div>`,
      )
      .join("");
    const quick = S.nav
      .filter((n) => ["about", "agenda", "publications", "resources"].includes(n.key))
      .map((n) => `<li><a href="${n.href}">${n.label}</a></li>`)
      .join("");
    return `
    <footer class="footer"><div class="container">
      <div><div class="logos">${logos}</div>
        <h4>${S.title}</h4>
        <p style="font-size:.88rem">${S.office}<br>${S.department}</p></div>
      <div><h4>Quick Links</h4><ul>${quick}<li><a href="${S.archiveUrl}" target="_blank" rel="noopener">Archive ↗</a></li></ul></div>
      <div><h4>Explore</h4><ul>
        <li><a href="research-committees.html">Research Committees</a></li>
        <li><a href="newsletters.html">Newsletters</a></li>
        <li><a href="data-management.html">Data Management</a></li>
        <li><a href="brace.html">BRACE Organization</a></li></ul></div>
      <div><h4>Contact</h4><ul>
        <li>${c.mapUrl ? `<a href="${c.mapUrl}" target="_blank" rel="noopener">${c.address}</a>` : c.address}</li><li>${c.email}</li><li>${c.phone}</li><li>${c.hours}</li></ul></div>
    </div>
    <div class="copy">© ${new Date().getFullYear()} ${S.office} – ${S.unit}. All rights reserved.<br>Developed by Marc Elmer M. Perez and Jomarlon D. Delos Reyes</div></footer>
    <button class="to-top" aria-label="Back to top">↑</button>
    <div class="modal" id="modal"><div class="modal-box"><button class="modal-x" aria-label="Close">×</button><div id="modal-body"></div></div></div>`;
  }

  function pageHero(title, sub) {
    return `<section class="page-hero"><div class="container">
      <div class="crumbs"><a href="index.html">Home</a> / ${title}</div>
      <h1>${title}</h1><p>${sub || ""}</p></div></section>`;
  }

  window.UI = { icon, avatar, art, fmtDate, header, footer, pageHero, initials };
})();
