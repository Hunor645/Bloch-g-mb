(function(){
const Q=window.Quantum,G=window.Gates,results=document.getElementById("results");let passed=0,failed=0;
function test(name,fn){const li=document.createElement("li");try{fn();li.textContent="✓ "+name;li.className="pass";passed++;}catch(e){li.textContent="✗ "+name+" — "+e.message;li.className="fail";failed++;}results.appendChild(li);}
function assert(ok,msg="A feltétel nem teljesült"){if(!ok)throw Error(msg);}
function close(a,b,eps=1e-9){assert(Math.abs(a-b)<eps,`${a} ≠ ${b}`);}
function phys(a,b){assert(Q.physicalEqual(a,b), "A két állapot nem egyezik globális fázisig.");}
const zero=Q.fromAngles(0,0),one=Q.fromAngles(180,0),plus=Q.fromAngles(90,0),minus=Q.fromAngles(90,180),plusI=Q.fromAngles(90,90);
test("A |0⟩ állapot normája 1",()=>close(Q.C.abs2(zero.alpha)+Q.C.abs2(zero.beta),1));
test("H|0⟩ = |+⟩",()=>phys(G.apply(zero,{name:"H"}),plus));
test("X|0⟩ = |1⟩",()=>phys(G.apply(zero,{name:"X"}),one));
test("X|1⟩ = |0⟩",()=>phys(G.apply(one,{name:"X"}),zero));
test("Z|+⟩ = |−⟩",()=>phys(G.apply(plus,{name:"Z"}),minus));
test("H|+⟩ = |0⟩ fizikailag",()=>phys(G.apply(plus,{name:"H"}),zero));
test("S|+⟩ = |+i⟩",()=>phys(G.apply(plus,{name:"S"}),plusI));
test("A T kapu megőrzi a normát",()=>{const s=G.apply(plus,{name:"T"});close(Q.C.abs2(s.alpha)+Q.C.abs2(s.beta),1);});
test("Rx(360°) fizikailag azonos",()=>phys(G.apply(plus,{name:"Rx",angle:360}),plus));
test("Rz(90°) 90°-kal forgatja az egyenlítőn",()=>{const b=Q.bloch(G.apply(plus,{name:"Rz",angle:90}));close(b.x,0);close(b.y,1);});
test("A szimulátor legfeljebb 4 állapotot enged",()=>{const sim=new SimulatorClass();sim.addState("B");sim.addState("C");sim.addState("D");let threw=false;try{sim.addState("E");}catch(e){threw=true;}assert(threw);});
test("A közös kapusorozat minden állapotra lefut",()=>{const sim=new SimulatorClass();sim.addState("B");sim.addGate("X");sim.next();assert(Q.physicalEqual(sim.states[0].current,one));assert(Q.physicalEqual(sim.states[1].current,one));});
test("Visszalépés visszaállítja a kezdőállapotot",()=>{const sim=new SimulatorClass();sim.addGate("X");sim.next();sim.previous();phys(sim.states[0].current,zero);});
document.getElementById("summary").textContent=`Eredmény: ${passed} sikeres, ${failed} sikertelen teszt.`;
})();