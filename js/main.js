/* Bootstrap: mounts header/footer/page, nav, calendar, org chart, filters, animations */
document.addEventListener("DOMContentLoaded", () => {
  const key = document.body.dataset.page || "home";
  const { header, footer, avatar, fmtDate } = window.UI;

  document.title =
    key === "home"
      ? window.SITE.title
      : `${(window.PAGES[key] || { title: key }).title || "About"} | ${window.SITE.title}`;
  if (key === "about") document.title = "About | " + window.SITE.title;
  document.getElementById("site-header").innerHTML = header(key);
  document.getElementById("page-root").innerHTML = window.RENDER[key]();
  document.getElementById("site-footer").innerHTML = footer();

  /* mobile nav */
  const btn = document.querySelector(".menu-btn"),
    nav = document.getElementById("nav");
  btn.addEventListener("click", () => {
    const o = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", o);
  });

  /* back to top */
  const top = document.querySelector(".to-top");
  top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => top.classList.toggle("show", scrollY > 500), {
    passive: true,
  });

  /* modal */
  const modal = document.getElementById("modal"),
    mbody = document.getElementById("modal-body");
  const closeModal = () => modal.classList.remove("open");
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal-x")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
  const openPerson = (p) => {
    mbody.innerHTML = p.titleOnly
      ? `<h3>${p.name}</h3>${p.role ? `<p><b>${p.role}</b></p>` : ""}`
      : `${avatar(p.name, p.photo)}<h3>${p.name}</h3><p><b>${p.role}</b></p>
      <p>${p.email || "[email]"} · ${p.phone || "[phone]"}</p>`;
    modal.classList.add("open");
  };

  /* calendar */
  if (key === "home") {
    const events = window.HOME.events;
    let view = new Date();
    view = new Date(view.getFullYear(), view.getMonth(), 1);
    const grid = document.getElementById("cal-grid"),
      title = document.getElementById("cal-title"),
      list = document.getElementById("event-list");
    const iso = (y, m, d) =>
      `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const showList = (items, label) => {
      list.innerHTML = items.length
        ? items
            .map((e) => {
              const d = new Date(e.date + "T00:00:00");
              return `<div class="event"><div class="date"><b>${d.getDate()}</b><span>${d.toLocaleString("en", { month: "short" })}</span></div>
        <div><h4>${e.title}</h4><small>${e.place}</small></div></div>`;
            })
            .join("")
        : `<div class="event"><div><h4>No activity</h4><small>${label}</small></div></div>`;
    };
    const draw = () => {
      const y = view.getFullYear(),
        m = view.getMonth(),
        today = new Date();
      title.textContent = view.toLocaleString("en", { month: "long", year: "numeric" });
      const first = new Date(y, m, 1).getDay(),
        days = new Date(y, m + 1, 0).getDate();
      let h = ["S", "M", "T", "W", "T", "F", "S"]
        .map((d) => `<div class="cal-dow">${d}</div>`)
        .join("");
      for (let i = 0; i < first; i++) h += `<div class="cal-day empty"></div>`;
      for (let d = 1; d <= days; d++) {
        const id = iso(y, m, d),
          has = events.some((e) => e.date === id);
        const isToday =
          today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
        h += `<div class="cal-day${has ? " has" : ""}${isToday ? " today" : ""}" data-d="${id}">${d}</div>`;
      }
      grid.innerHTML = h;
      showList(
        events.filter((e) => e.date.startsWith(iso(y, m, 1).slice(0, 7))),
        "Nothing scheduled this month.",
      );
    };
    grid.addEventListener("click", (e) => {
      const c = e.target.closest(".cal-day.has");
      if (!c) return;
      showList(
        events.filter((ev) => ev.date === c.dataset.d),
        "",
      );
    });
    document.getElementById("cal-prev").onclick = () => {
      view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
      draw();
    };
    document.getElementById("cal-next").onclick = () => {
      view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
      draw();
    };
    draw();
  }

  /* organizational chart */
  if (key === "about") {
    const build = (n, lvl, index = 0) => {
      const kids = n.children || [];
      const stagger = n.titleOnly && index % 2 === 1;
      return `<li${stagger ? ' class="stagger"' : ""}><div class="node lvl${Math.min(lvl, 3)}${n.titleOnly ? " title-only" : ""}" tabindex="0" role="button" data-n='${encodeURIComponent(JSON.stringify({ name: n.name, role: n.role, photo: n.photo, email: n.email, phone: n.phone, titleOnly: n.titleOnly }))}'>
        ${n.titleOnly ? "" : avatar(n.name, n.photo)}<b>${n.name}</b>${n.role ? `<span>${n.role}</span>` : ""}
        ${kids.length ? `<button class="toggle" aria-label="Toggle branch" title="Expand / collapse">–</button>` : ""}</div>
        ${kids.length ? `<ul>${kids.map((k, i) => build(k, lvl + 1, i)).join("")}</ul>` : ""}</li>`;
    };
    const tree = document.getElementById("org-tree");
    const scroller = tree.closest(".org-scroll");
    tree.innerHTML = `<ul>${build(window.ABOUT.org, 0)}</ul>`;
    let panning = false;
    let panMoved = false;
    let panX = 0;
    let panY = 0;
    let panLeft = 0;
    let panTop = 0;
    scroller.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest(".toggle")) return;
      panning = true;
      panMoved = false;
      panX = e.clientX;
      panY = e.clientY;
      panLeft = scroller.scrollLeft;
      panTop = scroller.scrollTop;
      scroller.classList.add("is-dragging");
      scroller.setPointerCapture(e.pointerId);
    });
    scroller.addEventListener("pointermove", (e) => {
      if (!panning) return;
      const dx = e.clientX - panX;
      const dy = e.clientY - panY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) panMoved = true;
      scroller.scrollLeft = panLeft - dx;
      scroller.scrollTop = panTop - dy;
    });
    const stopPan = () => {
      panning = false;
      scroller.classList.remove("is-dragging");
    };
    scroller.addEventListener("pointerup", stopPan);
    scroller.addEventListener("pointercancel", () => {
      stopPan();
      panMoved = false;
    });
    tree.addEventListener("click", (e) => {
      if (panMoved) {
        panMoved = false;
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const t = e.target.closest(".toggle");
      if (t) {
        const li = t.closest("li");
        li.classList.toggle("collapsed");
        t.textContent = li.classList.contains("collapsed") ? "+" : "–";
        layout();
        e.stopPropagation();
        return;
      }
      const n = e.target.closest(".node");
      if (n) openPerson(JSON.parse(decodeURIComponent(n.dataset.n)));
    });
    tree.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const n = e.target.closest(".node");
        if (n) n.click();
      }
    });
    const stage = document.getElementById("org-stage");
    const zoomLabel = document.getElementById("org-zoom-label");
    let scale = 1;
    const minScale = 0.25;
    const maxScale = 1.8;
    const layout = () => {
      const w = tree.scrollWidth;
      const h = tree.scrollHeight;
      tree.style.transform = `scale(${scale})`;
      stage.style.width = `${Math.ceil(w * scale)}px`;
      stage.style.height = `${Math.ceil(h * scale)}px`;
      zoomLabel.textContent = `${Math.round(scale * 100)}%`;
    };
    const zoomAt = (next, clientX, clientY) => {
      const prev = scale;
      const rect = scroller.getBoundingClientRect();
      const originX = clientX - rect.left + scroller.scrollLeft;
      const originY = clientY - rect.top + scroller.scrollTop;
      scale = Math.min(maxScale, Math.max(minScale, next));
      const ratio = scale / prev;
      layout();
      scroller.scrollLeft = originX * ratio - (clientX - rect.left);
      scroller.scrollTop = originY * ratio - (clientY - rect.top);
    };
    const zoomCenter = (next) => {
      const rect = scroller.getBoundingClientRect();
      zoomAt(next, rect.left + scroller.clientWidth / 2, rect.top + scroller.clientHeight / 2);
    };
    const fit = () => {
      const w = tree.scrollWidth;
      const h = tree.scrollHeight;
      const availW = Math.max(scroller.clientWidth - 28, 80);
      const availH = Math.max(scroller.clientHeight - 28, 80);
      scale = Math.min(maxScale, Math.max(minScale, Math.min(availW / w, availH / h)));
      layout();
      scroller.scrollLeft = Math.max(0, (stage.offsetWidth - scroller.clientWidth) / 2);
      scroller.scrollTop = 0;
    };
    document.getElementById("org-in").onclick = () => zoomCenter(scale + 0.1);
    document.getElementById("org-out").onclick = () => zoomCenter(scale - 0.1);
    document.getElementById("org-fit").onclick = fit;
    scroller.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        zoomAt(scale + (e.deltaY < 0 ? 0.1 : -0.1), e.clientX, e.clientY);
      },
      { passive: false },
    );
    const setAll = (c) => {
      tree.querySelectorAll("li").forEach((li) => {
        if (li.querySelector(":scope>ul")) {
          li.classList.toggle("collapsed", c);
          li.querySelector(":scope>.node .toggle").textContent = c ? "+" : "–";
        }
      });
      layout();
    };
    document.getElementById("org-expand").onclick = () => setAll(false);
    document.getElementById("org-collapse").onclick = () => {
      setAll(true);
      tree.querySelector("li").classList.remove("collapsed");
      tree.querySelector(".toggle").textContent = "–";
      layout();
    };
    requestAnimationFrame(() => requestAnimationFrame(fit));
  }

  /* filters + search (awards, publications, resources) */
  const chips = document.getElementById("chips");
  if (chips) {
    const target = document.querySelector(chips.dataset.target),
      q = document.getElementById("q"),
      empty = document.getElementById("empty");
    let f = "all";
    const apply = () => {
      const term = q ? q.value.trim().toLowerCase() : "";
      let shown = 0;
      target.querySelectorAll("[data-f]").forEach((el) => {
        const ok =
          (f === "all" || el.dataset.f === f) &&
          (!term || (el.dataset.s || "").includes(term));
        el.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? "none" : "block";
    };
    chips.addEventListener("click", (e) => {
      const c = e.target.closest(".chip");
      if (!c) return;
      chips.querySelectorAll(".chip").forEach((x) => x.classList.remove("on"));
      c.classList.add("on");
      f = c.dataset.f;
      apply();
    });
    if (q) q.addEventListener("input", apply);
  }

  /* scroll reveal */
  const els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
  } else els.forEach((el) => el.classList.add("in"));
});
