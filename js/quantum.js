/* Komplex számok és egyqubites állapotok. DOM-függőséget nem tartalmaz. */
(function (global) {
  "use strict";
  const C = {
    make: (re=0, im=0) => ({re, im}),
    add: (a,b) => ({re:a.re+b.re, im:a.im+b.im}),
    mul: (a,b) => ({re:a.re*b.re-a.im*b.im, im:a.re*b.im+a.im*b.re}),
    scale: (a,s) => ({re:a.re*s, im:a.im*s}),
    conj: a => ({re:a.re, im:-a.im}),
    abs2: a => a.re*a.re+a.im*a.im,
    format: (a, digits=4) => {
      const r = Math.abs(a.re)<1e-10 ? 0 : a.re, i = Math.abs(a.im)<1e-10 ? 0 : a.im;
      if (!i) return r.toFixed(digits);
      if (!r) return `${i.toFixed(digits)}i`;
      return `${r.toFixed(digits)} ${i<0?"−":"+"} ${Math.abs(i).toFixed(digits)}i`;
    }
  };
  function state(alpha, beta) {
    const norm = Math.sqrt(C.abs2(alpha)+C.abs2(beta));
    if (!Number.isFinite(norm) || norm < 1e-14) throw new Error("A kvantumállapot normája nem lehet nulla.");
    return {alpha:C.scale(alpha,1/norm), beta:C.scale(beta,1/norm)};
  }
  function fromAngles(thetaDeg, phiDeg) {
    const t=thetaDeg*Math.PI/360, p=phiDeg*Math.PI/180;
    return state(C.make(Math.cos(t),0), C.make(Math.sin(t)*Math.cos(p),Math.sin(t)*Math.sin(p)));
  }
  function bloch(s) {
    const product=C.mul(C.conj(s.alpha),s.beta);
    return {x:2*product.re,y:2*product.im,z:C.abs2(s.alpha)-C.abs2(s.beta)};
  }
  function probabilities(s) { return {zero:C.abs2(s.alpha),one:C.abs2(s.beta)}; }
  function clone(s) { return {alpha:{...s.alpha},beta:{...s.beta}}; }
  function physicalEqual(a,b,eps=1e-9) {
    const candidates=[C.mul(C.conj(a.alpha),b.alpha),C.mul(C.conj(a.beta),b.beta)];
    const phase=candidates[0];
    if (Math.hypot(phase.re,phase.im)<eps) return Math.hypot(a.alpha.re-b.alpha.re,a.alpha.im-b.alpha.im)<eps && Math.hypot(a.beta.re-b.beta.re,a.beta.im-b.beta.im)<eps;
    const mag=Math.hypot(phase.re,phase.im), p=C.scale(phase,1/mag);
    const aa=C.mul(a.alpha,p), ab=C.mul(a.beta,p);
    return Math.hypot(aa.re-b.alpha.re,aa.im-b.alpha.im)<eps && Math.hypot(ab.re-b.beta.re,ab.im-b.beta.im)<eps;
  }
  global.Quantum = {C,state,fromAngles,bloch,probabilities,clone,physicalEqual};
})(window);
