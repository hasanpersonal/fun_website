/* ==========================================================================
   Hasan's Web — activity charts
   Renders the dashboards from window.ACTIVITY (assets/activity-data.js).
   No libraries, no build step.
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.ACTIVITY;
  if (!DATA) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* Run a callback once its element scrolls into view. */
  function onVisible(el, cb, threshold) {
    if (!el) return;
    if (reduceMotion || !("IntersectionObserver" in window)) { cb(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        cb();
        io.unobserve(entry.target);
      });
    }, { threshold: threshold || 0.25 });

    io.observe(el);
  }

  var STATUS = {
    live: { label: "Live", cls: "chip--live" },
    progress: { label: "In progress", cls: "chip--wip" },
    planning: { label: "Planning", cls: "chip--plan" },
    content: { label: "Publishing", cls: "chip--content" }
  };

  /* ------------------------------- Donut --------------------------------- */
  function renderDonut(container) {
    if (!container) return;

    var segments = DATA.status;
    var total = segments.reduce(function (sum, s) { return sum + s.value; }, 0);
    var R = 64;
    var C = 2 * Math.PI * R;
    var gap = 3; // degrees of breathing room between segments, in pixels

    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 160 160");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Portfolio status breakdown");

    var bg = document.createElementNS(svgNS, "circle");
    bg.setAttribute("class", "donut__bg");
    bg.setAttribute("cx", "80");
    bg.setAttribute("cy", "80");
    bg.setAttribute("r", String(R));
    svg.appendChild(bg);

    var offset = 0;
    segments.forEach(function (seg) {
      var len = (seg.value / total) * C;
      var circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", "80");
      circle.setAttribute("cy", "80");
      circle.setAttribute("r", String(R));
      circle.setAttribute("stroke", seg.color);
      circle.style.filter = "drop-shadow(0 0 8px " + hexA(seg.color, 0.45) + ")";
      circle.setAttribute("stroke-dasharray", "0 " + C);
      circle.setAttribute("stroke-dashoffset", String(-offset));
      svg.appendChild(circle);

      onVisible(container, function () {
        circle.style.transitionDelay = "120ms";
        circle.setAttribute("stroke-dasharray", Math.max(len - gap, 2) + " " + C);
      });

      offset += len;
    });

    var wrap = document.createElement("div");
    wrap.className = "donut";
    wrap.appendChild(svg);

    var center = document.createElement("div");
    center.className = "donut__center";
    center.innerHTML = "<strong>" + total + "</strong><span>projects</span>";
    wrap.appendChild(center);

    var legend = document.createElement("div");
    legend.className = "legend";
    segments.forEach(function (seg) {
      var pct = Math.round((seg.value / total) * 100);
      var row = document.createElement("div");
      row.className = "legend__item";
      row.innerHTML =
        '<span class="legend__swatch" style="--sw:' + seg.color + '"></span>' +
        '<span class="legend__name">' + seg.label + "</span>" +
        '<span class="legend__value">' + seg.value + " · " + pct + "%</span>";
      legend.appendChild(row);
    });

    container.appendChild(wrap);
    container.appendChild(legend);
  }

  function hexA(hex, alpha) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
  }

  /* ----------------------------- Weekly bars ------------------------------ */
  function renderWeekly(container, weeks) {
    if (!container) return;

    var data = weeks ? DATA.weekly.slice(-weeks) : DATA.weekly;
    var max = Math.max.apply(null, data.map(function (w) { return w.value; }));

    container.innerHTML = "";

    data.forEach(function (week) {
      var bar = document.createElement("div");
      bar.className = "bar";
      bar.innerHTML =
        '<span class="bar__tip">' + (week.note || week.value + " pushes") + "</span>" +
        '<div class="bar__col"><div class="bar__fill"></div></div>' +
        '<span class="bar__label">' + week.label + "</span>";
      container.appendChild(bar);
    });

    var paint = function () {
      $$(".bar__fill", container).forEach(function (fill, i) {
        var h = Math.max((data[i].value / max) * 100, 4);
        fill.style.transitionDelay = i * 55 + "ms";
        fill.style.height = h + "%";
      });
    };

    if (!container.dataset.painted) {
      container.dataset.painted = "1";
      onVisible(container, paint);
    } else {
      requestAnimationFrame(paint);
    }
  }

  /* ------------------------------- Heatmap -------------------------------- */
  function renderHeatmap(container) {
    if (!container) return;

    var weeks = DATA.heatmap.weeks;
    var seed = DATA.heatmap.seed;
    var total = weeks * 7;
    var cells = [];

    // deterministic pseudo-random so the picture is stable between reloads
    for (var i = 0; i < total; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280;
      var momentum = i / total; // recent weeks are a little busier
      var roll = rnd + momentum * 0.28;
      var level = roll > 1.02 ? 4 : roll > 0.82 ? 3 : roll > 0.58 ? 2 : roll > 0.34 ? 1 : 0;
      cells.push(level);
    }

    container.innerHTML = "";

    cells.forEach(function (level, index) {
      var cell = document.createElement("span");
      cell.className = "heat-cell";
      cell.dataset.l = String(level);
      var week = Math.floor(index / 7) + 1;
      cell.title = level === 0
        ? "Week " + week + " · no pushes"
        : "Week " + week + " · " + level * 3 + " pushes";
      container.appendChild(cell);
    });

    onVisible(container, function () {
      $$(".heat-cell", container).forEach(function (cell, i) {
        cell.style.transitionDelay = Math.min(i * 4, 700) + "ms";
      });
    });
  }

  /* --------------------------- Progress list ------------------------------ */
  var progressListEl = $("#progressList");
  var progressItemsHTML = function (filter) {
    return DATA.projects
      .filter(function (p) { return !filter || filter === "all" || p.status === filter; })
      .map(function (p) {
        var status = STATUS[p.status] || STATUS.live;
        return (
          '<div class="progress-item" style="--accent:' + p.accent + '">' +
            '<div class="progress-item__top">' +
              '<span class="progress-item__name"><i class="' + p.icon + '"></i>' + p.name + "</span>" +
              '<span class="chip ' + status.cls + '"><span class="dot"></span>' + status.label + "</span>" +
              '<span class="progress-item__pct">' + p.progress + "%</span>" +
            "</div>" +
            '<div class="track"><div class="track__fill" data-p="' + p.progress + '" ' +
              'style="--fill:linear-gradient(90deg,' + p.accent + ',' + hexA(p.accent, 0.45) + ')"></div></div>' +
          "</div>"
        );
      })
      .join("");
  };

  function paintProgressList() {
    if (!progressListEl) return;

    $$(".track__fill", progressListEl).forEach(function (fill, i) {
      setTimeout(function () { fill.style.width = fill.dataset.p + "%"; }, 120 + i * 45);
    });
  }

  if (progressListEl) {
    progressListEl.innerHTML = progressItemsHTML("all");
    onVisible(progressListEl, paintProgressList, 0.1);

    $$("[data-list-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("[data-list-filter]").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        progressListEl.innerHTML = progressItemsHTML(btn.dataset.listFilter);
        paintProgressList();
      });
    });
  }

  /* ------------------------------ Big rings ------------------------------- */
  function renderRings(container) {
    if (!container) return;

    container.innerHTML = DATA.categories
      .map(function (c) {
        return (
          '<div class="ring">' +
            '<div class="ring__circle" style="--rc:' + c.color + '" data-p="' + c.value + '">' +
              "<span>" + c.value + "%</span>" +
            "</div>" +
            '<div class="ring__name">' + c.label + "</div>" +
            '<div class="ring__count">' + c.count + " projects</div>" +
          "</div>"
        );
      })
      .join("");

    onVisible(container, function () {
      $$(".ring__circle", container).forEach(function (ring, i) {
        setTimeout(function () { ring.style.setProperty("--p", ring.dataset.p); }, i * 130);
      });
    });
  }

  /* --------------------------- Mini hero rows ----------------------------- */
  function renderMiniRows(container) {
    if (!container) return;

    var active = DATA.projects.filter(function (p) {
      return p.status === "progress" || p.status === "planning";
    });

    container.innerHTML = active
      .map(function (p) {
        return (
          '<div class="mini-row">' +
            '<div class="mini-row__top"><span>' + p.name + "</span><span>" + p.progress + "%</span></div>" +
            '<div class="track"><div class="track__fill" data-p="' + p.progress + '" ' +
              'style="--fill:linear-gradient(90deg,' + p.accent + "," + hexA(p.accent, 0.5) + ')"></div></div>' +
          "</div>"
        );
      })
      .join("");

    onVisible(container, function () {
      $$(".track__fill", container).forEach(function (fill, i) {
        setTimeout(function () { fill.style.width = fill.dataset.p + "%"; }, 200 + i * 140);
      });
    });
  }

  /* ---------------------------- In-progress list -------------------------- */
  function renderWorkingOn(container) {
    if (!container) return;

    var active = DATA.projects.filter(function (p) { return p.status === "progress"; });

    container.innerHTML = active
      .map(function (p) {
        return (
          '<a class="work-item" href="' + p.url + '">' +
            '<span class="work-item__icon" style="--accent:' + p.accent + '"><i class="' + p.icon + '"></i></span>' +
            '<span class="work-item__body">' +
              '<span class="work-item__name">' + p.name + "</span>" +
              '<span class="work-item__meta">' + p.category + " · " + p.progress + "% complete</span>" +
            "</span>" +
            '<span class="work-item__go"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>' +
          "</a>"
        );
      })
      .join("");
  }

  /* ------------------------------- Timeline ------------------------------- */
  function renderTimeline(container) {
    if (!container || !DATA.timeline) return;

    container.innerHTML = DATA.timeline
      .map(function (item) {
        return (
          '<div class="tl-item" style="--tl:' + item.color + '">' +
            '<div class="tl-item__date">' + item.date + "</div>" +
            '<div class="tl-item__title">' + item.title + "</div>" +
            '<div class="tl-item__desc">' + item.desc + "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ------------------------------ Range switch ---------------------------- */
  function initRangeSwitch() {
    var wrap = $("#rangeSwitch");
    var bars = $("#weeklyBars");
    if (!wrap || !bars) return;

    $$("button", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("button", wrap).forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        renderWeekly(bars, parseInt(btn.dataset.weeks, 10));
      });
    });
  }

  /* --------------------------------- Init --------------------------------- */
  renderDonut($("#statusDonut"));
  renderDonut($("#heroDonut"));
  renderWeekly($("#weeklyBars"));
  renderWeekly($("#heroBars"));
  renderHeatmap($("#heatmap"));
  renderRings($("#categoryRings"));
  renderMiniRows($("#miniRows"));
  renderWorkingOn($("#workingOn"));
  renderTimeline($("#timelineFeed"));
  initRangeSwitch();

  $$("[data-updated]").forEach(function (el) { el.textContent = DATA.updated; });

  // fill any remaining static track widths once painted
  window.addEventListener("load", function () {
    $$(".track__fill[data-p]").forEach(function (fill) {
      if (!fill.style.width) fill.style.width = fill.dataset.p + "%";
    });
  });
})();
