/* Context Transfer - landing page interactivity
   Vanilla JS, no dependencies. Honors prefers-reduced-motion throughout. */

(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------- toast ---------- */

  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function toast(html) {
    if (!toastEl) return;
    toastEl.innerHTML = html;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 2400);
  }

  /* ---------- clipboard ---------- */

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  }

  async function copyCommand(el) {
    const cmd = el.getAttribute("data-copy-cmd") || el.textContent.trim();
    const ok = await copyText(cmd);
    toast(ok ? "copied <b>" + escapeHtml(cmd) + "</b>" : "copy failed, select it manually");
  }

  document.querySelectorAll("[data-copy-cmd]").forEach((el) => {
    el.addEventListener("click", () => copyCommand(el));
  });

  function isTypingContext(el) {
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el && el.isContentEditable);
  }

  /* ---------- scroll reveals ---------- */

  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- topbar scrolled state ---------- */

  const topbar = document.querySelector(".topbar");
  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      if (topbar) topbar.classList.toggle("is-scrolled", window.scrollY > 24);
      scrollTicking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- extract card copy ---------- */

  function initCardCopy() {
    const card = document.getElementById("extract-card");
    const btn = document.getElementById("ec-copy");
    if (!card || !btn) return;

    btn.addEventListener("click", async () => {
      let md = "# Context Card\n";
      card.querySelectorAll(".ec-sec").forEach((sec) => {
        const k = sec.querySelector(".ec-k")?.textContent.trim();
        if (!k) return;
        const items = sec.querySelectorAll(".ec-list li");
        if (items.length) {
          md += "\n## " + k + "\n";
          items.forEach((li) => (md += "- " + li.textContent.trim() + "\n"));
        } else {
          const v = sec.querySelector(".ec-v")?.textContent.trim();
          if (v) md += "\n## " + k + "\n" + v + "\n";
        }
      });

      const ok = await copyText(md);
      toast(ok ? "card copied as <b>markdown</b>" : "copy failed, select it manually");
      if (ok) {
        card.classList.add("is-copied");
        setTimeout(() => card.classList.remove("is-copied"), 2200);
      }
    });
  }

  /* ---------- constellation canvas ---------- */

  function initConstellation() {
    const canvas = document.getElementById("constellation");
    if (!canvas || prefersReduced) return;

    const ctx = canvas.getContext("2d");
    let W = 0;
    let H = 0;
    let pts = [];
    let raf = null;
    const mouse = { x: -9999, y: -9999 };
    const LINK = 130;
    const REACH = 200;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(90, Math.floor((W * H) / 16000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
      }));
    }

    function step() {
      ctx.clearRect(0, 0, W, H);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        else if (p.y > H + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(167,139,250,0.5)";
        ctx.fill();
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = 1 - Math.sqrt(d2) / LINK;
            ctx.strokeStyle = "rgba(167,139,250," + (alpha * 0.16).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // pointer node: nearby particles link to the cursor in magenta,
      // quietly hinting at "things connect through you"
      if (mouse.x > 0) {
        for (const p of pts) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < REACH * REACH) {
            const alpha = 1 - Math.sqrt(d2) / REACH;
            ctx.strokeStyle = "rgba(255,61,154," + (alpha * 0.4).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    window.addEventListener(
      "pointermove",
      (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      },
      { passive: true }
    );

    resize();
    step();

    // save battery: stop the loop when the tab is hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        step();
      }
    });
  }

  /* ---------- typewriter headline ---------- */

  function initTyped() {
    const el = document.querySelector(".typed");
    if (!el) return;
    let phrases = [];
    try {
      phrases = JSON.parse(el.getAttribute("data-typed") || "[]");
    } catch {
      return;
    }
    if (!phrases.length) return;

    if (prefersReduced) {
      el.textContent = phrases[0];
      return;
    }

    let pi = 0;
    let ci = phrases[0].length; // start fully typed on first paint
    let mode = "hold";
    let holdUntil = Date.now() + 2600;

    function tick() {
      if (mode === "hold") {
        if (Date.now() < holdUntil) return setTimeout(tick, 120);
        mode = "erase";
        return setTimeout(tick, 90);
      }
      if (mode === "erase") {
        ci--;
        el.textContent = phrases[pi].slice(0, Math.max(0, ci));
        if (ci <= 0) {
          pi = (pi + 1) % phrases.length;
          ci = 0;
          mode = "type";
        }
        return setTimeout(tick, 24);
      }
      ci++;
      el.textContent = phrases[pi].slice(0, ci);
      if (ci >= phrases[pi].length) {
        mode = "hold";
        holdUntil = Date.now() + 2600;
      }
      setTimeout(tick, 34 + Math.random() * 40);
    }
    setTimeout(tick, 1400);
  }

  /* ---------- hero terminal playback ---------- */

  const STAGES = [
    {
      lines: [
        { text: "$ pbpaste | context-transfer --extract", cls: "cmd" },
        { text: "// 3,847 chars of raw chat, pasted in", cls: "dim" },
        { text: "me: ok so the migration is blocked until", cls: "dim" },
        { text: "the mobile team signs off on refresh...", cls: "dim" }
      ]
    },
    {
      lines: [{ text: "✓ extracted in 0.8s · ollama · 0 network calls", cls: "ok" }]
    },
    {
      lines: [
        { text: "┌ CONTEXT CARD ────────────────────────┐", cls: "card" },
        { text: "Goal       ship JWT migration, keep mobile working", cls: "card-v" },
        { text: "Decisions  httpOnly refresh, 15min access tokens", cls: "card-v" },
        { text: "State      middleware passing tests, PR #142 open", cls: "card-v" },
        { text: "Open       device-bound refresh tokens?", cls: "card-v" },
        { text: "└────────────────────────── ✓ copied ───┘", cls: "card" },
        { text: "// card is on your clipboard. paste it anywhere.", cls: "dim" }
      ]
    }
  ];

  const stageSpeed = [26, 12, 7];

  function buildLine(text, cls) {
    const span = document.createElement("span");
    if (cls === "cmd") {
      const prompt = document.createElement("span");
      prompt.className = "t-prompt";
      prompt.textContent = "$ ";
      span.appendChild(prompt);
    }
    const body = document.createElement("span");
    if (cls === "card") body.className = "t-card";
    else if (cls === "card-v") body.className = "t-card-v";
    else if (cls === "ok") body.className = "t-ok";
    else if (cls === "dim") body.className = "t-dim";
    body.textContent = text.replace(/^\$ /, "");
    span.appendChild(body);
    return span;
  }

  function initHeroTerminal() {
    const pres = [0, 1, 2].map((i) => document.getElementById("t-pre-" + i));
    if (pres.some((p) => !p)) return;

    let playing = false;

    async function play() {
      if (playing) return;
      playing = true;

      pres.forEach((p) => {
        p.textContent = "";
        p.classList.remove("is-on");
        p.classList.add("is-armed");
      });

      for (let si = 0; si < STAGES.length; si++) {
        const pre = pres[si];
        for (const line of STAGES[si].lines) {
          const node = buildLine("", line.cls);
          const body = node.lastChild;
          pre.appendChild(node);
          pre.appendChild(document.createTextNode("\n"));

          const text = line.text.replace(/^\$ /, "");
          if (prefersReduced) {
            body.textContent = text;
          } else {
            for (let c = 0; c <= text.length; c++) {
              body.textContent = text.slice(0, c);
              await sleep(stageSpeed[si]);
            }
          }
          await sleep(130);
        }
        pre.classList.remove("is-armed");
        pre.classList.add("is-on");
        await sleep(si === STAGES.length - 1 ? 200 : 320);
      }

      playing = false;
    }

    // autoplay once, when the terminal scrolls into view
    let played = false;
    const term = pres[0].closest(".terminal");
    if ("IntersectionObserver" in window && term) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting && !played) {
              played = true;
              io.disconnect();
              play();
            }
          });
        },
        { threshold: 0.3 }
      );
      io.observe(term);
    } else {
      play();
    }

    // click to replay (but not when clicking a copyable command inside)
    if (term) {
      term.addEventListener("click", (e) => {
        if (e.target.closest("[data-copy-cmd]")) return;
        play();
      });
    }

    // E to replay (outside of typing contexts and the palette)
    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "e" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (!paletteOpen && !isTypingContext(e.target)) play();
      }
    });

    window.__ctReplay = play;
  }

  /* ---------- scramble headlines ---------- */

  const GLYPHS = "!<>-_\\/[]{}=+*^?#";

  function scrambleInto(el, original, dur) {
    const len = original.length;
    const t0 = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - t0) / dur);
      const settled = Math.floor(t * len);
      let out = original.slice(0, settled);
      for (let i = settled; i < len; i++) {
        out += original[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = original;
    }
    requestAnimationFrame(frame);
  }

  function initScramble() {
    const els = document.querySelectorAll("[data-scramble]");
    if (!els.length || prefersReduced || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          scrambleInto(en.target, en.target.textContent, 750);
        });
      },
      { threshold: 0.6 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- offline toggle ---------- */

  function initOffline() {
    const demo = document.querySelector(".offline-demo");
    const btn = document.getElementById("offline-btn");
    const label = document.getElementById("offline-label");
    const chip = document.getElementById("offline-chip");
    if (!demo || !btn || !label || !chip) return;

    let off = false;
    btn.addEventListener("click", () => {
      off = !off;
      demo.classList.toggle("is-off", off);
      label.innerHTML = off ? "wifi: <b>offline</b>" : "wifi: <b>connected</b>";
      btn.textContent = off ? "toggle it back on" : "toggle it off";
      if (off) {
        chip.hidden = false;
        chip.textContent = "still works";
        toast("network cut. extraction would still complete locally.");
      } else {
        chip.hidden = true;
      }
    });
  }

  /* ---------- backend toggle ---------- */

  function initBackend() {
    const localBtn = document.getElementById("bt-local");
    const cloudBtn = document.getElementById("bt-cloud");
    const cmd = document.getElementById("backend-cmd");
    const desc = document.getElementById("backend-desc");
    if (!localBtn || !cloudBtn || !cmd || !desc) return;

    const BACKENDS = {
      local: {
        cmd: "context-transfer --backend ollama",
        desc:
          "Runs on your machine via Ollama. Private by default, works offline, and the card format is identical regardless of model."
      },
      cloud: {
        cmd: "context-transfer --backend anthropic",
        desc:
          "Same extraction, routed to Anthropic or NVIDIA NIM when you explicitly point it there. Your choice, made per run, never a silent default."
      }
    };

    function render(mode) {
      cmd.textContent = "";
      const prompt = document.createElement("span");
      prompt.className = "t-prompt";
      prompt.textContent = "$ ";
      const rest = document.createElement("span");
      rest.className = "t-key";
      rest.textContent = BACKENDS[mode].cmd;
      cmd.append(prompt, rest);
      desc.textContent = BACKENDS[mode].desc;
    }
    render("local");

    let current = "local";

    function select(mode) {
      if (mode === current) return;
      current = mode;
      localBtn.classList.toggle("is-active", mode === "local");
      cloudBtn.classList.toggle("is-active", mode === "cloud");
      localBtn.setAttribute("aria-selected", String(mode === "local"));
      cloudBtn.setAttribute("aria-selected", String(mode === "cloud"));

      if (prefersReduced) {
        render(mode);
        return;
      }
      // scramble the command line into its new value
      const full = BACKENDS[mode].cmd;
      const len = full.length;
      const t0 = performance.now();
      const dur = 480;
      function frame(now) {
        const t = Math.min(1, (now - t0) / dur);
        const n = Math.floor(t * len);
        let out = full.slice(0, n);
        for (let i = n; i < len; i++) {
          out += full[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        cmd.textContent = out;
        if (t < 1) requestAnimationFrame(frame);
        else render(mode);
      }
      requestAnimationFrame(frame);
    }

    localBtn.addEventListener("click", () => select("local"));
    cloudBtn.addEventListener("click", () => select("cloud"));
  }

  /* ---------- command palette ---------- */

  const paletteOverlay = document.getElementById("palette-overlay");
  const paletteInput = document.getElementById("palette-input");
  const paletteList = document.getElementById("palette-list");
  let paletteOpen = false;
  let paletteItems = [];
  let visibleCommands = [];
  let paletteActive = 0;

  const COMMANDS = [
    { group: "sections", label: "the problem", hint: "jump", target: "#problem" },
    { group: "sections", label: "how it works", hint: "jump", target: "#how" },
    { group: "sections", label: "local-first", hint: "jump", target: "#local-first" },
    { group: "sections", label: "the card", hint: "jump", target: "#card" },
    { group: "sections", label: "backends", hint: "jump", target: "#backends" },
    { group: "sections", label: "faq", hint: "jump", target: "#faq" },
    { group: "sections", label: "install", hint: "jump", target: "#install" },
    {
      group: "commands",
      label: "replay hero demo",
      hint: "run",
      action: () => {
        if (window.__ctReplay) window.__ctReplay();
        document.getElementById("top")?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      }
    },
    {
      group: "commands",
      label: "copy clone command",
      hint: "copy",
      copy: "git clone https://github.com/Shivala-08/context-shifter.git"
    },
    {
      group: "commands",
      label: "copy extract command",
      hint: "copy",
      copy: "pbpaste | context-transfer --extract"
    },
    {
      group: "commands",
      label: "open github repo",
      hint: "open",
      action: () => window.open("https://github.com/Shivala-08/context-shifter", "_blank")
    },
    {
      group: "commands",
      label: "view releases",
      hint: "open",
      action: () => window.open("https://github.com/Shivala-08/context-shifter/releases", "_blank")
    },
    {
      group: "commands",
      label: "toggle wifi demo",
      hint: "run",
      action: () => {
        document.getElementById("offline-btn")?.click();
        document.getElementById("local-first")?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      }
    }
  ];

  function runCommand(c) {
    if (c.copy) {
      copyText(c.copy).then((ok) => toast(ok ? "copied <b>" + escapeHtml(c.copy) + "</b>" : "copy failed"));
    }
    if (c.target) {
      const el = document.querySelector(c.target);
      if (el) el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    }
    if (c.action) c.action();
    closePalette();
  }

  function renderPalette(query) {
    paletteList.innerHTML = "";
    paletteItems = [];
    visibleCommands = [];
    paletteActive = 0;
    const q = query.trim().toLowerCase();
    const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));

    if (!filtered.length) {
      const li = document.createElement("li");
      li.className = "palette-empty";
      li.textContent = 'no matching commands. try "local" or "copy".';
      paletteList.appendChild(li);
      return;
    }

    let lastGroup = null;
    filtered.forEach((c) => {
      if (c.group !== lastGroup) {
        lastGroup = c.group;
        const g = document.createElement("li");
        g.className = "palette-group";
        g.textContent = c.group;
        paletteList.appendChild(g);
      }
      const li = document.createElement("li");
      li.className = "palette-item" + (visibleCommands.length === paletteActive ? " is-active" : "");
      li.setAttribute("role", "option");
      const label = document.createElement("span");
      label.textContent = c.label;
      const hint = document.createElement("span");
      hint.className = "pi-hint";
      hint.textContent = c.hint;
      li.append(label, hint);
      li.addEventListener("click", () => runCommand(c));
      paletteList.appendChild(li);
      paletteItems.push(li);
      visibleCommands.push(c);
    });
  }

  function openPalette() {
    paletteOpen = true;
    paletteOverlay.classList.add("is-open");
    paletteOverlay.setAttribute("aria-hidden", "false");
    paletteInput.value = "";
    renderPalette("");
    paletteInput.focus();
  }

  function closePalette() {
    paletteOpen = false;
    paletteOverlay.classList.remove("is-open");
    paletteOverlay.setAttribute("aria-hidden", "true");
  }

  function moveActive(delta) {
    if (!paletteItems.length) return;
    paletteActive = (paletteActive + delta + paletteItems.length) % paletteItems.length;
    paletteItems.forEach((el, i) => el.classList.toggle("is-active", i === paletteActive));
    paletteItems[paletteActive].scrollIntoView({ block: "nearest" });
  }

  if (paletteOverlay && paletteInput && paletteList) {
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        paletteOpen ? closePalette() : openPalette();
        return;
      }
      if (!paletteOpen) return;
      if (e.key === "Escape") {
        closePalette();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        moveActive(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveActive(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const c = visibleCommands[paletteActive];
        if (c) runCommand(c);
      }
    });

    paletteInput.addEventListener("input", () => renderPalette(paletteInput.value));

    paletteOverlay.addEventListener("click", (e) => {
      if (e.target === paletteOverlay) closePalette();
    });
  }

  /* ---------- faq accordion ---------- */

  function initFaqAccordion() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length || prefersReduced) return; // <details> still works, just without animation

    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        const a = item.querySelector(".faq-a");
        if (!a || typeof a.animate !== "function") return;
        a.style.overflow = "hidden";
        a.animate(
          [
            { height: "0px", opacity: "0" },
            { height: a.scrollHeight + "px", opacity: "1" }
          ],
          { duration: 260, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        ).onfinish = () => {
          a.style.overflow = "";
        };
      });
    });
  }

  /* ---------- boot ---------- */

  initTyped();
  initScramble();
  initOffline();
  initBackend();
  initFaqAccordion();
  initCardCopy();
  initHeroTerminal();
  initConstellation();
})();
