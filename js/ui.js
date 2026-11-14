
/* DOM-megjelenítés és eseménykezelés. */
(function (global) {
  "use strict";

  const $ = id => document.getElementById(id);
  const Q = global.Quantum;

  let simulator = null;
  let selectedId = 0;
  let playTimer = null;
  let selectedTargetIds = new Set([0]);

  const fmt = n => Math.abs(n) < 1e-10 ? "0.000" : n.toFixed(3);

  function renderAll() {
    renderStates();
    renderSphereSelector();
    renderGateTargets();
    renderCircuit();
    renderDetails();
    renderPlayback();
    global.BlochSphere.render(simulator.states, selectedId);
  }

  // Annak kiválasztása, melyik állapot Bloch-gömbje legyen látható.
  function renderSphereSelector() {
    $("sphereSelector").innerHTML = simulator.states.map(s => {
      const active = s.id === selectedId;

      return `
        <button type="button"
                class="sphere-tab ${active ? "active" : ""}"
                data-sphere="${s.id}"
                aria-pressed="${active}"
                title="${escapeHtml(s.name)} gömbjének megjelenítése">
          <i class="legend-dot" style="background:${s.color}"></i>
          <span>${escapeHtml(s.name)}</span>
        </button>
      `;
    }).join("");
  }

  // Állapotok listája
  function renderStates() {
    $("stateCount").textContent = `${simulator.states.length} / 4`;

    $("stateList").innerHTML = simulator.states.map(s => `
      <div class="state-row ${s.id === selectedId ? "selected" : ""}">
        <span class="state-dot" style="background:${s.color}"></span>
        <div>
          <div class="state-name">${escapeHtml(s.name)}</div>
          <div class="state-meta">θ ${s.theta}° · φ ${s.phi}°</div>
        </div>
        <div class="state-actions">
          <button class="icon-button" data-edit="${s.id}"
                  title="Kezdőállapot szerkesztése">✎</button>
          <button class="icon-button" data-remove="${s.id}"
                  title="Eltávolítás">×</button>
        </div>
      </div>
    `).join("");

    $("addStateBtn").disabled = simulator.states.length >= 4;

    $("legend").innerHTML = simulator.states.map(s => `
      <span class="legend-item">
        <i class="legend-dot" style="background:${s.color}"></i>
        ${escapeHtml(s.name)}
      </span>
    `).join("");
  }

  // Az éppen hozzáadandó kapu célállapotainak kiválasztása
  function renderGateTargets() {
    const container = $("gateTargets");

    selectedTargetIds = new Set(
      [...selectedTargetIds].filter(id =>
        simulator.states.some(s => s.id === id)
      )
    );

    container.innerHTML = simulator.states.map(s => `
      <label class="gate-target-option">
        <input
          type="checkbox"
          data-target-id="${s.id}"
          ${selectedTargetIds.has(s.id) ? "checked" : ""}
        >
        <span class="legend-dot" style="background:${s.color}"></span>
        <span>${escapeHtml(s.name)}</span>
      </label>
    `).join("");
  }

  // Kapusorozat
  function renderCircuit() {
    $("stepMax").textContent = simulator.circuit.length;

    $("circuitList").innerHTML = simulator.circuit.length
      ? simulator.circuit.map((g, i) => {
          const targetText = g.targetNames.join(", ");

          return `
            <span class="circuit-chip ${i < simulator.step ? "active" : ""}">
              <span class="chip-index">${i + 1}</span>
              <strong>
                ${g.name}${["Rx", "Ry", "Rz"].includes(g.name)
                  ? `(${g.angle}°)`
                  : ""}
              </strong>
              <small class="chip-targets" title="${escapeHtml(targetText)}">
                → ${escapeHtml(targetText)}
              </small>
              <button class="chip-remove"
                      data-gate-remove="${i}"
                      title="Kapu törlése">×</button>
            </span>
          `;
        }).join("")
      : '<span class="empty-state">Még nincs hozzáadott kapu. Válassz egyet a fenti panelen.</span>';
  }

  // Kvantumállapotok részletes adatai
  function renderDetails() {
    $("stateDetails").innerHTML = simulator.states.map(s => {
      const b = Q.bloch(s.current);
      const p = Q.probabilities(s.current);

      return `
        <article class="detail-card">
          <div class="detail-title">
            <i class="legend-dot" style="background:${s.color}"></i>
            ${escapeHtml(s.name)}
          </div>
          <div class="detail-table">
            <span>α amplitúdó</span>
            <strong>${Q.C.format(s.current.alpha)}</strong>
            <span>β amplitúdó</span>
            <strong>${Q.C.format(s.current.beta)}</strong>
            <span>P(|0⟩)</span>
            <strong>${fmt(p.zero)}</strong>
            <span>P(|1⟩)</span>
            <strong>${fmt(p.one)}</strong>
            <span>Bloch x</span>
            <strong>${fmt(b.x)}</strong>
            <span>Bloch y</span>
            <strong>${fmt(b.y)}</strong>
            <span>Bloch z</span>
            <strong>${fmt(b.z)}</strong>
          </div>
        </article>
      `;
    }).join("");
  }

  // Lejátszásvezérlők
  function renderPlayback() {
    $("stepValue").textContent = simulator.step;

    $("prevBtn").disabled = simulator.step === 0;
    $("nextBtn").disabled = simulator.step === simulator.circuit.length;

    $("playBtn").textContent = playTimer ? "Ⅱ Szünet" : "▶ Lejátszás";
    $("playBtn").disabled = simulator.circuit.length === 0;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  function stopPlayback() {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
  }

  // Kiválasztott állapot szerkesztése
  function setSelected(id) {
    selectedId = id;

    const s = simulator.states.find(x => x.id === id);
    if (!s) return;

    $("thetaInput").value = s.theta;
    $("phiInput").value = s.phi;

    $("thetaValue").textContent = s.theta + "°";
    $("phiValue").textContent = s.phi + "°";

    const match = Object.entries(global.StatePresets).find(
      ([, v]) => v.theta === s.theta && v.phi === s.phi
    );

    $("presetSelect").value = match ? match[0] : "custom";
  }

  // Eseménykezelők
  function bind() {

    // Új állapot hozzáadása
    $("addStateBtn").addEventListener("click", () => {
      try {
        stopPlayback();
        const s = simulator.addState($("newStateName").value);

        $("newStateName").value = "";
        selectedTargetIds.add(s.id);

        setSelected(s.id);
        renderAll();
      } catch (e) {
        alert(e.message);
      }
    });

    $("newStateName").addEventListener("keydown", e => {
      if (e.key === "Enter") {
        $("addStateBtn").click();
      }
    });

    // Állapot kiválasztása vagy törlése
    $("stateList").addEventListener("click", e => {
      const edit = e.target.closest("[data-edit]");
      const remove = e.target.closest("[data-remove]");

      if (edit) {
        setSelected(Number(edit.dataset.edit));
        renderAll();
      }

      if (remove) {
        try {
          const id = Number(remove.dataset.remove);
          stopPlayback();
          simulator.removeState(id);
          selectedTargetIds.delete(id);

          if (selectedId === id) {
            setSelected(simulator.states[0].id);
          }

          renderAll();
        } catch (err) {
          alert(err.message);
        }
      }
    });

    // A megjelenített gömb kiválasztása
    $("sphereSelector").addEventListener("click", e => {
      const tab = e.target.closest("[data-sphere]");
      if (!tab) return;

      setSelected(Number(tab.dataset.sphere));
      renderAll();
    });

    // Célállapotok kiválasztása
    $("gateTargets").addEventListener("change", e => {
      const checkbox = e.target.closest("[data-target-id]");
      if (!checkbox) return;

      const id = Number(checkbox.dataset.targetId);

      if (checkbox.checked) {
        selectedTargetIds.add(id);
      } else {
        selectedTargetIds.delete(id);
      }
    });

    // Kezdőállapot szögparamétereinek módosítása
    $("thetaInput").addEventListener("input", updateAngles);
    $("phiInput").addEventListener("input", updateAngles);

    $("presetSelect").addEventListener("change", e => {
      const p = global.StatePresets[e.target.value];

      if (p) {
        $("thetaInput").value = p.theta;
        $("phiInput").value = p.phi;
        updateAngles();
      }
    });

    // A forgatókapu gombokra mutatva kiemeljük a szög mezőt,
    // hogy egyértelmű legyen: a szög csak ezekre vonatkozik.
    const rotationGates = ["Rx", "Ry", "Rz"];

    document.querySelectorAll("[data-gate]").forEach(btn => {
      const isRotation = rotationGates.includes(btn.dataset.gate);

      if (isRotation) {
        const highlight = () => $("angleField").classList.add("angle-active");
        const clear = () => $("angleField").classList.remove("angle-active");

        btn.addEventListener("mouseenter", highlight);
        btn.addEventListener("focus", highlight);
        btn.addEventListener("mouseleave", clear);
        btn.addEventListener("blur", clear);
      }
    });

    // Kapuk hozzáadása
    document.querySelectorAll("[data-gate]").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.gate;
        const rot = rotationGates.includes(name);
        const angle = Number($("gateAngle").value);

        if (rot && (
          $("gateAngle").value.trim() === "" ||
          !Number.isFinite(angle) ||
          angle < -360 ||
          angle > 360
        )) {
          alert("Adj meg -360° és 360° közötti érvényes szöget.");
          return;
        }

        const targets = [...selectedTargetIds];

        if (targets.length === 0) {
          alert("Válassz ki legalább egy célállapotot!");
          return;
        }

        try {
          stopPlayback();
          simulator.addGate(name, rot ? angle : 90, targets);

          $("gateExplanation").textContent =
            global.Gates.descriptions[name];

          renderAll();
        } catch (e) {
          alert(e.message);
        }
      });
    });

    // Teljes kapusorozat törlése
    $("clearCircuitBtn").addEventListener("click", () => {
      stopPlayback();
      simulator.clear();
      renderAll();
    });

    // Egy kapu törlése
    $("circuitList").addEventListener("click", e => {
      const b = e.target.closest("[data-gate-remove]");

      if (b) {
        stopPlayback();
        simulator.removeGate(Number(b.dataset.gateRemove));
        renderAll();
      }
    });

    // Visszaállítás
    $("resetBtn").addEventListener("click", () => {
      stopPlayback();
      simulator.reset();
      renderAll();
    });

    // Egy lépés vissza
    $("prevBtn").addEventListener("click", () => {
      stopPlayback();
      simulator.previous();
      renderAll();
    });

    // Egy lépés előre
    $("nextBtn").addEventListener("click", () => {
      stopPlayback();
      simulator.next();
      renderAll();
    });

    // Automatikus lejátszás / szünet
    $("playBtn").addEventListener("click", () => {
      if (playTimer) {
        stopPlayback();
        renderPlayback();
        return;
      }

      if (simulator.step >= simulator.circuit.length) {
        simulator.reset();
      }

      playTimer = setInterval(() => {
        if (simulator.step >= simulator.circuit.length) {
          stopPlayback();
          renderPlayback();
          return;
        }

        simulator.next();
        if (simulator.step >= simulator.circuit.length) {
          stopPlayback();
        }
        renderAll();
      }, 850);

      renderPlayback();
    });
  }

  // Szögértékek módosítása
  function updateAngles() {
    const t = Number($("thetaInput").value);
    const p = Number($("phiInput").value);

    $("thetaValue").textContent = t + "°";
    $("phiValue").textContent = p + "°";

    simulator.setInitial(selectedId, t, p);
    const match = Object.entries(global.StatePresets).find(
      ([, preset]) => preset.theta === t && preset.phi === p
    );
    $("presetSelect").value = match ? match[0] : "custom";
    renderAll();
  }

  function init() {
    simulator = new global.SimulatorClass();

    bind();
    setSelected(0);
    renderAll();
  }

  global.UI = { init };

})(window);
