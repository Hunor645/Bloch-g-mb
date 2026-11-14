
/* Plotly-alapú, állapotonként különálló 3D Bloch-gömbök.
 *
 * Fontos tervezési elv: a gömböt, a tengelyeket és a segédköröket
 * állapotonként EGYSZER építjük fel (Plotly.newPlot), és utána már
 * kizárólag az állapotvektor nyomvonalát frissítjük (Plotly.restyle).
 * A layoutot - és benne a kameraállást - sosem küldjük újra, így a
 * gömb és a nézet mozdulatlan marad; csak a jelzővektor mozog.
 */
(function (global) {
  "use strict";

  // Állapotazonosító -> { card, plotDiv, vectorIndex, observer }
  const plots = new Map();

  function sphereSurface() {
    const u = [], v = [];

    for (let i = 0; i <= 30; i++) {
      u.push(2 * Math.PI * i / 30);
    }

    for (let j = 0; j <= 20; j++) {
      v.push(Math.PI * j / 20);
    }

    const x = [], y = [], z = [];

    for (const vv of v) {
      const xr = [], yr = [], zr = [];

      for (const uu of u) {
        xr.push(Math.sin(vv) * Math.cos(uu));
        yr.push(Math.sin(vv) * Math.sin(uu));
        zr.push(Math.cos(vv));
      }

      x.push(xr);
      y.push(yr);
      z.push(zr);
    }

    return {
      type: "surface",
      x, y, z,
      opacity: 0.13,
      showscale: false,
      colorscale: [
        [0, "#4e80b7"],
        [1, "#8de5d0"]
      ],
      hoverinfo: "skip",
      name: "Bloch-gömb"
    };
  }

  function line(points, color, width = 2, dash = "solid") {
    return {
      type: "scatter3d",
      mode: "lines",
      x: points.map(p => p[0]),
      y: points.map(p => p[1]),
      z: points.map(p => p[2]),
      line: { color, width, dash },
      hoverinfo: "skip",
      showlegend: false
    };
  }

  function circle(plane) {
    const points = [];

    for (let k = 0; k <= 100; k++) {
      const a = 2 * Math.PI * k / 100;

      if (plane === "xy") {
        points.push([Math.cos(a), Math.sin(a), 0]);
      } else if (plane === "xz") {
        points.push([Math.cos(a), 0, Math.sin(a)]);
      } else {
        points.push([0, Math.cos(a), Math.sin(a)]);
      }
    }

    return points;
  }

  /* A gömb statikus díszlete: felszín, segédkörök, tengelyek.
     Ezek sosem változnak, ezért csak létrehozáskor kerülnek be. */
  function staticTraces() {
    return [
      sphereSurface(),

      line(circle("xy"), "#65758b", 1, "dot"),
      line(circle("xz"), "#53657c", 1, "dot"),
      line(circle("yz"), "#53657c", 1, "dot"),

      line([[-1.18, 0, 0], [1.18, 0, 0]], "#d28d8d", 2),
      line([[0, -1.18, 0], [0, 1.18, 0]], "#91b8e9", 2),
      line([[0, 0, -1.18], [0, 0, 1.18]], "#9ad9bc", 2)
    ];
  }

  /* Az egyetlen dinamikus nyomvonal: az állapotvektor. */
  function vectorTrace(state) {
    const p = global.Quantum.bloch(state.current);

    return {
      type: "scatter3d",
      mode: "lines+markers",
      x: [0, p.x],
      y: [0, p.y],
      z: [0, p.z],
      line: {
        color: state.color,
        width: 7
      },
      marker: {
        size: [2, 5],
        color: state.color
      },
      name: state.name,
      hovertemplate:
        `${state.name}<br>` +
        "x=%{x:.3f}<br>" +
        "y=%{y:.3f}<br>" +
        "z=%{z:.3f}<extra></extra>"
    };
  }

  function buildLayout(id) {
    return {
      autosize: true,
      margin: { l: 0, r: 0, t: 0, b: 0 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      showlegend: false,
      uirevision: "bloch-" + id,
      scene: {
        uirevision: "bloch-camera-" + id,
        bgcolor: "rgba(0,0,0,0)",
        aspectmode: "cube",
        camera: {
          eye: { x: 1.55, y: 1.55, z: 1.2 }
        },
        xaxis: { range: [-1.3, 1.3], visible: false },
        yaxis: { range: [-1.3, 1.3], visible: false },
        zaxis: { range: [-1.3, 1.3], visible: false },
        annotations: [
          {
            x: 1.22, y: 0, z: 0,
            text: "X",
            showarrow: false,
            font: { color: "#d28d8d" }
          },
          {
            x: 0, y: 1.22, z: 0,
            text: "Y",
            showarrow: false,
            font: { color: "#91b8e9" }
          },
          {
            x: 0, y: 0, z: 1.22,
            text: "|0⟩",
            showarrow: false,
            font: { color: "#9ad9bc" }
          },
          {
            x: 0, y: 0, z: -1.22,
            text: "|1⟩",
            showarrow: false,
            font: { color: "#9ad9bc" }
          }
        ]
      },
      font: { color: "#dce6f2" }
    };
  }

  const plotConfig = {
    displayModeBar: false,
    responsive: true
  };

  function createCard(state) {
    const card = document.createElement("article");
    card.className = "bloch-card";
    card.dataset.stateId = state.id;

    const heading = document.createElement("div");
    heading.className = "bloch-card-heading";

    const dot = document.createElement("span");
    dot.className = "legend-dot";
    dot.style.background = state.color;

    const name = document.createElement("strong");
    name.className = "bloch-card-name";
    name.textContent = state.name;

    heading.append(dot, name);

    const plot = document.createElement("div");
    plot.className = "bloch-plot-canvas";
    plot.id = "blochPlot-" + state.id;
    plot.setAttribute("aria-label", state.name + " Bloch-gömbje");

    card.append(heading, plot);

    return { card, plot };
  }

  /* A tárolót csak akkor méretezzük újra, ha tényleg változott a mérete
     (például állapot hozzáadásakor módosul a rács). Így a léptetés és a
     kapuhozzáadás nem kényszerít ki újratördelést. */
  function observeSize(plot) {
    if (typeof ResizeObserver !== "function") return null;

    let pending = false;

    const observer = new ResizeObserver(() => {
      if (pending) return;
      pending = true;

      requestAnimationFrame(() => {
        pending = false;

        if (plot.isConnected && global.Plotly && plot.offsetWidth > 0) {
          global.Plotly.Plots.resize(plot);
        }
      });
    });

    observer.observe(plot);

    return observer;
  }

  function updateHeading(card, state) {
    const name = card.querySelector(".bloch-card-name");
    const dot = card.querySelector(".legend-dot");

    if (name.textContent !== state.name) {
      name.textContent = state.name;
    }

    dot.style.background = state.color;
  }

  /* Kizárólag az állapotvektor frissítése. A layout érintetlen marad,
     ezért a kamera, a nagyítás és a gömb helyzete nem változik. */
  function updateVector(entry, state) {
    const p = global.Quantum.bloch(state.current);

    global.Plotly.restyle(
      entry.plot,
      {
        x: [[0, p.x]],
        y: [[0, p.y]],
        z: [[0, p.z]],
        "line.color": [state.color],
        "marker.color": [state.color]
      },
      [entry.vectorIndex]
    );
  }

  function discard(id, entry) {
    if (entry.observer) {
      entry.observer.disconnect();
    }

    if (global.Plotly && entry.plot) {
      global.Plotly.purge(entry.plot);
    }

    entry.card.remove();
    plots.delete(id);
  }

  /* Egy állapot ábrájának felépítése. Csak akkor fut le, amikor az
     állapot először kerül megjelenítésre (lusta létrehozás). */
  function createPlot(container, state) {
    const { card, plot } = createCard(state);
    container.appendChild(card);

    const traces = staticTraces();
    const vectorIndex = traces.length;

    traces.push(vectorTrace(state));

    global.Plotly.newPlot(
      plot,
      traces,
      buildLayout(String(state.id)),
      plotConfig
    );

    const entry = {
      card,
      plot,
      vectorIndex,
      observer: observeSize(plot)
    };

    plots.set(String(state.id), entry);

    return entry;
  }

  /* Egyszerre mindig csak egy gömb látszik: a kijelölt állapoté.
     A többi ábrát nem bontjuk le, csak elrejtjük, így visszaváltáskor
     a korábban beállított kameraállás és nagyítás megmarad. */
  function render(states, selectedId) {
    const container = document.getElementById("blochPlots");
    const fallback = document.getElementById("plotFallback");

    container.dataset.count = 1;

    if (!global.Plotly) {
      container.classList.add("hidden");
      fallback.classList.remove("hidden");
      return;
    }

    container.classList.remove("hidden");
    fallback.classList.add("hidden");

    // A már törölt állapotok ábráinak felszabadítása.
    const validIds = new Set(states.map(s => String(s.id)));

    for (const [id, entry] of [...plots]) {
      if (!validIds.has(id)) {
        discard(id, entry);
      }
    }

    // A megjelenítendő állapot a kijelölt; ha az időközben megszűnt,
    // az első állapotra esünk vissza.
    const active = states.find(s => s.id === selectedId) || states[0];

    if (!active) return;

    const activeKey = String(active.id);

    // Előbb elrejtjük a többit, hogy egy újonnan létrehozott ábra
    // már a teljes cellaméretre épüljön fel.
    for (const [id, entry] of plots) {
      entry.card.classList.toggle("hidden", id !== activeKey);
    }

    const entry = plots.get(activeKey);

    if (!entry) {
      createPlot(container, active);
      return;
    }

    // Meglévő ábra: a DOM-csomópontot NEM mozgatjuk, csak a vektort
    // frissítjük, így a gömb és a kameraállás mozdulatlan marad.
    updateHeading(entry.card, active);
    updateVector(entry, active);
  }

  global.BlochSphere = { render };

})(window);
