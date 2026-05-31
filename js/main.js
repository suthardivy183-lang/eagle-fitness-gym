/* ============================================================
   EAGLE FITNESS — Interactions
   Vanilla JS · progressive enhancement · a11y-first
   ============================================================ */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- 1. Sticky header shadow ---------- */
  function initStickyHeader() {
    const header = $(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 2. Mobile navigation ---------- */
  function initMobileNav() {
    const nav = $(".nav");
    const toggle = $(".nav__toggle");
    const backdrop = $(".nav-backdrop");
    if (!nav || !toggle) return;

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      if (backdrop) backdrop.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", () =>
      setOpen(!nav.classList.contains("is-open"))
    );
    if (backdrop) backdrop.addEventListener("click", () => setOpen(false));
    $$(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => setOpen(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- 3. Scroll reveal ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if (!els.length || prefersReducedMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- 4. Active nav link on scroll ---------- */
  function initScrollSpy() {
    const links = $$(".nav__links .nav__link");
    const map = new Map();
    links.forEach((l) => {
      const id = l.getAttribute("href");
      if (id && id.startsWith("#") && id.length > 1) {
        const sec = document.getElementById(id.slice(1));
        if (sec) map.set(sec, l);
      }
    });
    if (!map.size || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove("is-active"));
            const active = map.get(entry.target);
            if (active) active.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    map.forEach((_, sec) => io.observe(sec));
  }

  /* ---------- 5. Schedule tabs (ARIA) ---------- */
  function initTabs() {
    const tablist = $(".tabs__list");
    if (!tablist) return;
    const tabs = $$('[role="tab"]', tablist);

    const select = (tab) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) {
          e.preventDefault();
          select(next);
          next.focus();
        }
      });
    });
  }

  /* ---------- 6. Testimonials slider ---------- */
  function initSlider() {
    const slider = $(".slider");
    if (!slider) return;
    const track = $(".slider__track", slider);
    const slides = $$(".slider__slide", slider);
    const prev = $('[data-slider="prev"]', slider);
    const next = $('[data-slider="next"]', slider);
    const dotsWrap = $(".slider__dots", slider);
    if (!track || slides.length < 2) return;

    let index = 0;
    let timer = null;

    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.className = "slider__dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to review ${i + 1}`);
      dot.addEventListener("click", () => go(i, true));
      dotsWrap && dotsWrap.appendChild(dot);
      return dot;
    });

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, i) => s.setAttribute("aria-hidden", String(i !== index)));
      dots.forEach((d, i) =>
        d.setAttribute("aria-current", String(i === index))
      );
    }
    function go(i, user) {
      index = (i + slides.length) % slides.length;
      render();
      if (user) restart();
    }
    function start() {
      if (prefersReducedMotion) return;
      timer = window.setInterval(() => go(index + 1), 6000);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }
    function restart() {
      stop();
      start();
    }

    prev && prev.addEventListener("click", () => go(index - 1, true));
    next && next.addEventListener("click", () => go(index + 1, true));
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);

    render();
    start();
  }

  /* ---------- 7. Count-up stats ---------- */
  function initCountUp() {
    const nums = $$("[data-count]");
    if (!nums.length) return;

    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const fmt = (n) =>
        decimals > 0
          ? n.toFixed(decimals)
          : Math.round(n).toLocaleString("en-IN");
      if (prefersReducedMotion || !Number.isFinite(target)) {
        el.textContent = prefix + fmt(target) + suffix;
        return;
      }
      const duration = 1500;
      const startTime = performance.now();
      const tick = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + fmt(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + fmt(target) + suffix;
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      nums.forEach(run);
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach((n) => io.observe(n));
  }

  /* ---------- 8. Pricing billing toggle ---------- */
  function initPricing() {
    const toggle = $(".pricing__toggle");
    if (!toggle) return;
    const buttons = $$("button", toggle);
    const amounts = $$(".plan__price .amt");
    const pers = $$(".plan__price .per");

    const apply = (mode) => {
      buttons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.billing === mode))
      );
      amounts.forEach((a) => {
        const val = a.dataset[mode];
        if (val) a.textContent = val;
      });
      pers.forEach((p) => {
        p.textContent = mode === "annual" ? "/mo · billed yearly" : "/month";
      });
    };

    buttons.forEach((b) =>
      b.addEventListener("click", () => apply(b.dataset.billing))
    );
    apply("monthly");
  }

  /* ---------- 9. Contact form → WhatsApp handoff ---------- */
  function initForm() {
    const form = $("#lead-form");
    if (!form) return;
    const status = $("#form-status", form);
    const phone = form.dataset.whatsapp || "";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const tel = (data.get("phone") || "").toString().trim();
      const goal = (data.get("goal") || "").toString();
      const msg = (data.get("message") || "").toString().trim();

      const text = encodeURIComponent(
        `Hi Eagle Fitness! 🦅\n\n` +
          `*Name:* ${name}\n` +
          `*Phone:* ${tel}\n` +
          `*Goal:* ${goal}\n` +
          (msg ? `*Message:* ${msg}\n` : "") +
          `\nI'd like to claim my free trial.`
      );

      if (status) {
        status.hidden = false;
        status.textContent =
          "Opening WhatsApp to send your request… If nothing happens, call us at 097374 15234.";
      }
      window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
      form.reset();
    });
  }

  /* ---------- 10. Footer year ---------- */
  function initYear() {
    const el = $("#year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Boot ---------- */
  function boot() {
    initStickyHeader();
    initMobileNav();
    initReveal();
    initScrollSpy();
    initTabs();
    initSlider();
    initCountUp();
    initPricing();
    initForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
