/* Egyqubites kapuk. A mátrix elemei Quantum.C komplex számok. */
(function (global) {
  "use strict";
  const C=global.Quantum.C, z=C.make(0,0), o=C.make(1,0), m=C.make(-1,0), i=C.make(0,1);
  const s2=1/Math.sqrt(2);
  const matrices={
    X:[[z,o],[o,z]],
    Y:[[z,C.scale(i,-1)],[i,z]],
    Z:[[o,z],[z,m]],
    H:[[C.make(s2),C.make(s2)],[C.make(s2),C.make(-s2)]],
    S:[[o,z],[z,i]],
    T:[[o,z],[z,C.make(Math.SQRT1_2,Math.SQRT1_2)]]
  };
  function rotation(axis,angleDeg) {
    const a=angleDeg*Math.PI/180, c=Math.cos(a/2), s=Math.sin(a/2);
    if(axis==="Rx") return [[C.make(c),C.make(0,-s)],[C.make(0,-s),C.make(c)]];
    if(axis==="Ry") return [[C.make(c),C.make(-s)],[C.make(s),C.make(c)]];
    return [[C.make(c,-s),z],[z,C.make(c,s)]];
  }
  function matrix(gate) {
    return matrices[gate.name] || (
      ["Rx", "Ry", "Rz"].includes(gate.name)
        ? rotation(gate.name, gate.angle)
        : null
    );
  }
  function apply(s,gate) {
    const M=matrix(gate); if(!M) throw new Error("Ismeretlen kapu: "+gate.name);
    const a=C.add(C.mul(M[0][0],s.alpha),C.mul(M[0][1],s.beta));
    const b=C.add(C.mul(M[1][0],s.alpha),C.mul(M[1][1],s.beta));
    return global.Quantum.state(a,b);
  }
  const descriptions={
    X:"Pauli-X: a |0⟩ és |1⟩ bázisállapotokat felcseréli. A Bloch-gömbön 180°-os forgatás az x tengely körül.",
    Y:"Pauli-Y: 180°-os forgatás az y tengely körül; a bázisállapotokat fázissal cseréli fel.",
    Z:"Pauli-Z: a |1⟩ amplitúdó előjelét fordítja meg. A Bloch-gömbön 180°-os forgatás a z tengely körül.",
    H:"Hadamard: a számítási bázist szuperpozíciós bázissá alakítja. Például H|0⟩ = |+⟩.",
    S:"S kapu: 90°-os fázisforgatás a z tengely körül; a |+⟩ állapotból |+i⟩ lesz.",
    T:"T kapu: 45°-os fázisforgatás a z tengely körül.",
    Rx:"X tengely körüli forgatás a megadott szöggel.",
    Ry:"Y tengely körüli forgatás a megadott szöggel.",
    Rz:"Z tengely körüli forgatás a megadott szöggel."
  };
  global.Gates={apply,matrix,descriptions};
})(window);
