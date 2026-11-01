/* ==========================================================================
   Hasan's Web — shared interactions
   nav state · mobile menu · scroll reveal · count-up numbers · footer year
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------- 1. Sticky nav ---------------------------- */
  var nav = document.querySelector(".nav");

  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = nav.querySelector(".nav__toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    // close the mobile menu after navigation or when tapping outside
    nav.addEventListener("click", function (e) {
      if (e.target.closest(".nav__link")) nav.classList.remove("is-open");
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target)) nav.classList.remove("is-open");
    });
  }

  /* -------------------------- 2. Active nav link ------------------------- */
  (function markActive() {
    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!file) file = "index.html";

    // pages that belong to another section in the navigation
    var alias = { "page2.html": "page1.html" };
    if (alias[file]) file = alias[file];

    document.querySelectorAll(".nav__link[href]").forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
      if (href === file || (file === "index.html" && (href === "" || href === "."))) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  })();

  /* --------------------------- 3. Scroll reveal -------------------------- */
  var revealables = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseFloat(el.dataset.delay || "0");
          setTimeout(function () { el.classList.add("is-in"); }, delay);
          revealObserver.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------- 4. Count-up ------------------------------ */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;

    var decimals = (el.dataset.count.split(".")[1] || "").length;
    var pad = parseInt(el.dataset.pad || "0", 10);

    if (reduceMotion) {
      el.textContent = format(target);
      return;
    }

    var duration = parseInt(el.dataset.duration || "1500", 10);
    var start = performance.now();

    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target);
    }

    function format(v) {
      var s = decimals ? v.toFixed(decimals) : String(Math.round(v));
      while (s.length < pad) s = "0" + s;
      return s;
    }

    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll("[data-count]");

  if (!("IntersectionObserver" in window)) {
    counters.forEach(countUp);
  } else {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      // keep the final value in the HTML for no-JS visitors, then rewind to zero
      var finalValue = el.textContent;
      el.dataset.count = el.dataset.count || finalValue.replace(/[^\d.]/g, "");
      if (!reduceMotion) el.textContent = "0";
      countObserver.observe(el);
    });
  }

  /* ------------------------------ 5. Year ------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --------------------------- 6. Filter groups -------------------------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var buttons = group.querySelectorAll("[data-filter]");
    var items = document.querySelectorAll(group.dataset.filterGroup);

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var key = btn.dataset.filter;

        items.forEach(function (item) {
          var tags = (item.dataset.tags || "").split(/\s+/);
          var show = key === "all" || tags.indexOf(key) > -1;
          item.style.display = show ? "" : "none";
        });
      });
    });
  });
})();
