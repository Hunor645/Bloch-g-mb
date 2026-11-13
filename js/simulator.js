
/* A kapusorozat és a több állapot kezelése. */
(function (global) {
  "use strict";

  const Q = global.Quantum;

  const colors = [
    "#6ee7c2",
    "#7aa7ff",
    "#ffb86b",
    "#e99cff"
  ];

  const presets = {
    "0": { theta: 0, phi: 0 },
    "1": { theta: 180, phi: 0 },
    plus: { theta: 90, phi: 0 },
    minus: { theta: 90, phi: 180 },
    plusI: { theta: 90, phi: 90 },
    minusI: { theta: 90, phi: 270 }
  };

  function makeState(id, name, theta = 0, phi = 0, color = colors[id % colors.length]) {
    const initial = Q.fromAngles(theta, phi);

    return {
      id,
      name,
      color,
      theta,
      phi,
      initial,
      current: Q.clone(initial)
    };
  }

  class Simulator {
    constructor() {
      this.states = [makeState(0, "|0⟩")];
      this.nextStateId = 1;
      this.circuit = [];
      this.step = 0;
    }

    addState(name) {
      if (this.states.length >= 4) {
        throw new Error("Legfeljebb 4 állapot vehető fel.");
      }

      const id = this.nextStateId++;

      const st = makeState(
        id,
        (name || `Állapot ${id + 1}`).trim() || `Állapot ${id + 1}`
      );

      this.states.push(st);
      this.recompute();

      return st;
    }

    removeState(id) {
      if (this.states.length <= 1) {
        throw new Error("Legalább egy állapotnak maradnia kell.");
      }

      this.states = this.states.filter(s => s.id !== id);
      this.recompute();
    }

    setInitial(id, theta, phi) {
      const st = this.states.find(s => s.id === id);

      if (!st) return;

      st.theta = Number(theta);
      st.phi = Number(phi);
      st.initial = Q.fromAngles(st.theta, st.phi);

      this.recompute();
    }

    addGate(name, angle = 90, targetIds = null) {
      const targets = targetIds === null
        ? this.states.map(s => s.id)
        : [...new Set(targetIds)].filter(id =>
            this.states.some(s => s.id === id)
          );

      if (targets.length === 0) {
        throw new Error("Legalább egy célállapotot ki kell választani.");
      }

      const targetNames = targets.map(id =>
        this.states.find(s => s.id === id).name
      );

      this.circuit.push({
        name,
        angle: Number(angle),
        targetIds: [...targets],
        targetNames
      });

      this.recompute();
    }

    removeGate(index) {
      this.circuit.splice(index, 1);
      this.recompute();
    }

    clear() {
      this.circuit = [];
      this.recompute();
    }

    recompute() {
      this.step = Math.min(this.step, this.circuit.length);

      // Minden állapotot a saját kezdőállapotából indítunk.
      // Ezután kapunként haladunk: egy kapulépésben az összes
      // hozzárendelt állapot frissül, a többi változatlan marad.
      const currentStates = new Map(
        this.states.map(st => [st.id, Q.clone(st.initial)])
      );

      for (let i = 0; i < this.step; i++) {
        const gate = this.circuit[i];

        for (const id of gate.targetIds) {
          if (!currentStates.has(id)) continue;

          const current = currentStates.get(id);
          currentStates.set(id, global.Gates.apply(current, gate));
        }
      }

      for (const st of this.states) {
        st.current = currentStates.get(st.id);
      }
    }

    setStep(step) {
      this.step = Math.max(
        0,
        Math.min(this.circuit.length, step)
      );

      this.recompute();
    }

    next() {
      this.setStep(this.step + 1);
    }

    previous() {
      this.setStep(this.step - 1);
    }

    reset() {
      this.setStep(0);
    }

    getSnapshots(id) {
      const st = this.states.find(s => s.id === id);

      if (!st) return [];

      let current = Q.clone(st.initial);
      const result = [Q.clone(current)];

      for (const gate of this.circuit) {
        if (gate.targetIds.includes(st.id)) {
          current = global.Gates.apply(current, gate);
        }

        result.push(Q.clone(current));
      }

      return result;
    }
  }

  global.SimulatorClass = Simulator;
  global.StatePresets = presets;

})(window);
