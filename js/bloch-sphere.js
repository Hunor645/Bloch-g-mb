
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
        [0, "#d8bd98"],
        [1, "#c5d2b9"]
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

  function vectorTrace(state) {
    const p = global.Quantum.bloch(state.current);

    return {
      type: "scatter3d",
      mode: "lines+markers",
      x: [0, p.x],
      y: [0, p.y],
      z: [0, p.z],
      line: { color: state.color, width: 7 },
      marker: { size: [2, 5], color: state.color },
      name: state.name,
      hovertemplate:
        `${state.name}<br>` +
        "x=%{x:.3f}<br>" +
        "y=%{y:.3f}<br>" +
        "z=%{z:.3f}<extra></extra>"
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
      line(circle("xy"), "#c7b9a7", 1, "dot"),
      line(circle("xz"), "#c7b9a7", 1, "dot"),
      line(circle("yz"), "#c7b9a7", 1, "dot"),

      line([[-1.18, 0, 0], [1.18, 0, 0]], "#bd795b", 2),
      line([[0, -1.18, 0], [0, 1.18, 0]], "#8299a3", 2),
      line([[0, 0, -1.18], [0, 0, 1.18]], "#829174", 2)
    );

    traces.push(vectorTrace(state));

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

  // Az éppen futó animációk az egyes Plotly-ábrákhoz kötődnek.
  // Újabb léptetéskor a korábbi animáció érvénytelenné válik.
  const animationTokens = new WeakMap();

  // A Plotly kameraállását külön is eltároljuk, mert a react() hívás
  // során a layout újra megadásakor egyes Plotly-verziók visszaállíthatják
  // a scene.camera értékét. A cache állapotonként külön él.
  const cameraCache = new WeakMap();
  const cameraListeners = new WeakSet();

  function cloneCamera(camera) {
    if (!camera) return null;
    return {
      eye: camera.eye ? { ...camera.eye } : undefined,
      center: camera.center ? { ...camera.center } : undefined,
      up: camera.up ? { ...camera.up } : undefined,
      projection: camera.projection ? { ...camera.projection } : undefined
    };
  }

  function mergeCamera(base, update) {
    const result = cloneCamera(base) || {};
    for (const key of ["eye", "center", "up", "projection"]) {
      if (update && update[key]) {
        result[key] = { ...(result[key] || {}), ...update[key] };
      }
    }
    return result;
  }

  function rememberCamera(plot, eventData) {
    let camera = cameraCache.get(plot) ||
      cloneCamera(plot.layout && plot.layout.scene && plot.layout.scene.camera);

    if (eventData && eventData["scene.camera"]) {
      camera = mergeCamera(camera, eventData["scene.camera"]);
    } else if (eventData) {
      // A Plotly relayout esemény gyakran pontonkénti kulcsokat ad vissza.
      const partial = {};
      for (const key of ["eye", "center", "up"]) {
        const value = {};
        for (const axis of ["x", "y", "z"]) {
          const eventKey = `scene.camera.${key}.${axis}`;
          if (Object.prototype.hasOwnProperty.call(eventData, eventKey)) {
            value[axis] = eventData[eventKey];
          }
        }
        if (Object.keys(value).length) partial[key] = value;
      }
      camera = mergeCamera(camera, partial);
    }

    if (camera) cameraCache.set(plot, camera);
  }

  function attachCameraListener(plot) {
    if (cameraListeners.has(plot) || typeof plot.on !== "function") return;
    plot.on("plotly_relayout", eventData => rememberCamera(plot, eventData));
    cameraListeners.add(plot);
  }

  function animateVector(plot, card, vectorIndex, targetTrace, duration = 620) {
    const token = (animationTokens.get(plot) || 0) + 1;
    animationTokens.set(plot, token);

    const currentTrace = plot.data && plot.data[vectorIndex];
    if (!currentTrace || !currentTrace.x || !currentTrace.y || !currentTrace.z) {
      return Promise.reject(new Error("A Bloch-vektor még nincs inicializálva."));
    }

    const from = {
      x: Number(currentTrace.x[1]) || 0,
      y: Number(currentTrace.y[1]) || 0,
      z: Number(currentTrace.z[1]) || 0
    };
    const to = {
      x: Number(targetTrace.x[1]) || 0,
      y: Number(targetTrace.y[1]) || 0,
      z: Number(targetTrace.z[1]) || 0
    };

    card.classList.remove("is-animating");
    void card.offsetWidth;
    card.classList.add("is-animating");

    return new Promise((resolve, reject) => {
      const startedAt = Date.now();

      function frame() {
        if (animationTokens.get(plot) !== token || !plot.isConnected) {
          resolve();
          return;
        }

        const progress = Math.min(1, (Date.now() - startedAt) / duration);
        // Smoothstep: lágy indulás és megállás.
        const eased = progress * progress * (3 - 2 * progress);
        const x = from.x + (to.x - from.x) * eased;
        const y = from.y + (to.y - from.y) * eased;
        const z = from.z + (to.z - from.z) * eased;

        // A scatter3d trace pontjait közvetlenül frissítjük.
        // Ez megbízhatóbb, mint a Plotly.animate 3D trace-eknél.
        global.Plotly.restyle(plot, {
          x: [[0, x]],
          y: [[0, y]],
          z: [[0, z]]
        }, [vectorIndex]).then(() => {
          if (progress >= 1) {
            card.classList.remove("is-animating");
            resolve();
          } else {
            requestAnimationFrame(frame);
          }
        }).catch(reject);
      }

      requestAnimationFrame(frame);
    });
  }

  function render(states, selectedId, options = {}) {
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

      // A már felhasználó által beállított kamera az elsődleges.
      // Ha még nincs mentett nézet, a kezdő kamera kerül használatba.
      const currentCamera = plot.layout && plot.layout.scene && plot.layout.scene.camera;
      if (currentCamera && !cameraCache.has(plot)) {
        cameraCache.set(plot, cloneCamera(currentCamera));
      }
      const camera = cameraCache.get(plot) || {
        eye: { x: 1.55, y: 1.55, z: 1.2 }
      };
      attachCameraListener(plot);

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
          camera: cloneCamera(camera),
          xaxis: { range: [-1.3, 1.3], visible: false },
          yaxis: { range: [-1.3, 1.3], visible: false },
          zaxis: { range: [-1.3, 1.3], visible: false },
          annotations: [
            { x: 1.22, y: 0, z: 0, text: "X", showarrow: false, font: { color: "#bd795b" } },
            { x: 0, y: 1.22, z: 0, text: "Y", showarrow: false, font: { color: "#8299a3" } },
            { x: 0, y: 0, z: 1.22, text: "|0⟩", showarrow: false, font: { color: "#829174" } },
            { x: 0, y: 0, z: -1.22, text: "|1⟩", showarrow: false, font: { color: "#829174" } }
          ]
        },
        font: { color: "#51483f" }
      };

      const traces = buildTraces(state);
      const vectorIndex = traces.length - 1;
      const canAnimate = options.animate &&
        Array.isArray(plot.data) &&
        plot.data.length === traces.length &&
        typeof global.Plotly.restyle === "function" &&
        typeof global.requestAnimationFrame === "function";

      let update;
      if (canAnimate) {
        update = animateVector(plot, card, vectorIndex, traces[vectorIndex])
          .catch(() => global.Plotly.react(
            plot, traces, layout,
            { displayModeBar: false, responsive: true }
          ));
      } else {
        // Első megjelenítéskor, illetve normál frissítéskor a teljes ábrát
        // újrarajzoljuk; csak léptetéskor animáljuk külön a vektort.
        animationTokens.set(plot, (animationTokens.get(plot) || 0) + 1);
        update = global.Plotly.react(
          plot,
          traces,
          layout,
          { displayModeBar: false, responsive: true }
        );
      }

      Promise.resolve(update).then(() => {
        requestAnimationFrame(() => {
          if (plot.isConnected && global.Plotly) {
            global.Plotly.Plots.resize(plot);
          }
        });
      }).catch(error => console.error("Bloch-gömb frissítési hiba:", error));
    }
  }

  global.BlochSphere = { render };

})(window);
