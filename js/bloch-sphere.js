
/* Plotly-alapú, állapotonként különálló 3D Bloch-gömbök. */
(function (global) {
  "use strict";

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

  function buildTraces(state) {
    const traces = [sphereSurface()];

    const circle = plane => {
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
    };

    traces.push(
      line(circle("xy"), "#65758b", 1, "dot"),
      line(circle("xz"), "#53657c", 1, "dot"),
      line(circle("yz"), "#53657c", 1, "dot"),

      line([[-1.18, 0, 0], [1.18, 0, 0]], "#d28d8d", 2),
      line([[0, -1.18, 0], [0, 1.18, 0]], "#91b8e9", 2),
      line([[0, 0, -1.18], [0, 0, 1.18]], "#9ad9bc", 2)
    );

    const p = global.Quantum.bloch(state.current);

    traces.push({
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
    });

    return traces;
  }

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

    return card;
  }

  function updateCard(card, state) {
    const name = card.querySelector(".bloch-card-name");
    const dot = card.querySelector(".legend-dot");

    name.textContent = state.name;
    dot.style.background = state.color;
  }

  function render(states) {
    const container = document.getElementById("blochPlots");
    const fallback = document.getElementById("plotFallback");

    if (!global.Plotly) {
      container.classList.add("hidden");
      fallback.classList.remove("hidden");
      return;
    }

    container.classList.remove("hidden");
    fallback.classList.add("hidden");
    container.dataset.count = String(states.length);

    if (!states.length) return;

    const existingCards = new Map(
      Array.from(container.querySelectorAll(".bloch-card"))
        .map(card => [String(card.dataset.stateId), card])
    );
    const activeIds = new Set(states.map(state => String(state.id)));

    // A kártyákat megtartjuk rejtve is, így állapotváltáskor
    // az adott állapot saját Plotly-kamerája is megmarad.
    for (const state of states) {
      const id = String(state.id);
      let card = existingCards.get(id);

      if (!card) {
        card = createCard(state);
        container.appendChild(card);
      }

      updateCard(card, state);
      card.classList.remove("hidden");
    }

    for (const [id, card] of existingCards) {
      if (!activeIds.has(id)) {
        const plot = card.querySelector(".bloch-plot-canvas");
        if (plot) global.Plotly.purge(plot);
        card.remove();
      }
    }

    for (const state of states) {
      const card = container.querySelector(
        `.bloch-card[data-state-id="${String(state.id)}"]`
      );
      const plot = card.querySelector(".bloch-plot-canvas");

      const layout = {
        autosize: true,
        margin: { l: 0, r: 0, t: 0, b: 0 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        showlegend: false,
        uirevision: "bloch-" + state.id,
        scene: {
          uirevision: "bloch-camera-" + state.id,
          bgcolor: "rgba(0,0,0,0)",
          aspectmode: "cube",
          camera: {
            eye: { x: 1.55, y: 1.55, z: 1.2 }
          },
          xaxis: { range: [-1.3, 1.3], visible: false },
          yaxis: { range: [-1.3, 1.3], visible: false },
          zaxis: { range: [-1.3, 1.3], visible: false },
          annotations: [
            { x: 1.22, y: 0, z: 0, text: "X", showarrow: false, font: { color: "#d28d8d" } },
            { x: 0, y: 1.22, z: 0, text: "Y", showarrow: false, font: { color: "#91b8e9" } },
            { x: 0, y: 0, z: 1.22, text: "|0⟩", showarrow: false, font: { color: "#9ad9bc" } },
            { x: 0, y: 0, z: -1.22, text: "|1⟩", showarrow: false, font: { color: "#9ad9bc" } }
          ]
        },
        font: { color: "#dce6f2" }
      };

      Promise.resolve(global.Plotly.react(
        plot,
        buildTraces(state),
        layout,
        { displayModeBar: false, responsive: true }
      )).then(() => {
        requestAnimationFrame(() => {
          if (plot.isConnected && global.Plotly) {
            global.Plotly.Plots.resize(plot);
          }
        });
      });
    }
  }

  global.BlochSphere = { render };

})(window);
