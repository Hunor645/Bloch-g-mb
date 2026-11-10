# Bloch-gömb szimulátor – dokumentáció

BME VIK · Kvantuminformatikai alkalmazások · féléves házi feladat
2. feladat: Kvantuminformatikai alapok – Bloch-gömb szimulátor

---

## Tartalom

1. Bevezetés
2. Matematikai háttér
3. Technológiai háttér
4. A program felépítése (architektúra)
5. A program működése
6. Felhasználói útmutató
7. Tesztelés
8. Futtatás és telepítés
9. Korlátok és továbbfejlesztési lehetőségek
10. Összefoglalás

---

## 1. Bevezetés

### 1.1. A projekt célja

A program egyetlen qubit tiszta kvantumállapotainak és az azokon végrehajtott egyqubites kapuműveleteknek a szemléltetésére készült. A felhasználó több kezdőállapotot vehet fel, majd ugyanazt a kapusorozatot alkalmazhatja mindegyikre. A Bloch-gömb háromdimenziós ábrázolása segít az állapotok geometriai összehasonlításában, valamint abban, hogy a kvantumkapuk hatása szemléletesen, forgatásokként értelmezhető legyen.

A cél egy böngészőben közvetlenül futtatható, telepítést nem igénylő, matematikailag helyes és vizuálisan igényes oktatási eszköz.

### 1.2. A Bloch-gömb rövid ismertetése

Egy egyqubites tiszta állapot a kétdimenziós komplex vektortér egységnyi normájú vektora. A globális fázistól eltekintve minden ilyen állapot kölcsönösen egyértelműen megfeleltethető egy egységgömb – a Bloch-gömb – felszínén lévő pontnak. A gömb északi pólusa a |0⟩, déli pólusa az |1⟩ állapot; az egyenlítőn a |0⟩ és |1⟩ egyenlő súlyú szuperpozíciói (például |+⟩, |−⟩, |+i⟩, |−i⟩) helyezkednek el. Egy unitér egyqubites kapu a Bloch-gömbön egy forgatásnak felel meg.

### 1.3. A szimulátor képességei

- Legfeljebb négy különböző qubitállapot egyidejű kezelése, mindegyik külön Bloch-gömbön.
- Tetszőleges tiszta kezdőállapot megadása a θ és φ szögek segítségével, valamint előre definiált állapotok gyors kiválasztása.
- Egyqubites kapuk: X, Y, Z (Pauli-kapuk), H (Hadamard), S és T (fáziskapuk), valamint Rx, Ry, Rz (forgatókapuk) tetszőleges szöggel.
- A kapuk közös kapusorozatba fűzése, kapunként kiválasztható célállapotokkal.
- A kapusorozat lépésenkénti és automatikus (animált lejátszású) végrehajtása, vissza- és előreléptetéssel.
- Az amplitúdók, a mérési valószínűségek és a Bloch-koordináták élő megjelenítése.
- A kiválasztott kapu rövid matematikai magyarázata.

---

## 2. Matematikai háttér

### 2.1. Qubitállapot reprezentációja

Egy tiszta, normált egyqubites állapot a számítási bázisban:

|ψ⟩ = α|0⟩ + β|1⟩,  ahol |α|² + |β|² = 1.

Az amplitúdók komplex számok: α = aᵣ + i·aᵢ, β = bᵣ + i·bᵢ. A programban a komplex számokat két valós mezővel ábrázoljuk:

```javascript
{ re: 0.7071, im: 0 }
```

Egy állapot így egy alpha és egy beta mezőt tartalmazó objektum:

```javascript
{
  alpha: { re: 1, im: 0 },
  beta:  { re: 0, im: 0 }
}
```

A fenti példa a |0⟩ állapotot jelöli. Az állapot létrehozásakor a program automatikusan normalizál: elosztja az amplitúdókat a √(|α|² + |β|²) normával, és nulla normájú állapotot nem enged létrehozni.

### 2.2. Kezdőállapot paraméterezése

A kezdőállapotot két szöggel adjuk meg:

|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} · sin(θ/2)|1⟩,

ahol θ a polárszög (0°–180°) és φ az azimutszög (0°–360°). A felületen fokban dolgozunk, a trigonometrikus számításokhoz a program radiánra vált. Az előre definiált állapotok:

| Állapot | θ    | φ    |
| ------- | ---- | ---- |
| \|0⟩    | 0°   | 0°   |
| \|1⟩    | 180° | 0°   |
| \|+⟩    | 90°  | 0°   |
| \|−⟩    | 90°  | 180° |
| \|+i⟩   | 90°  | 90°  |
| \|−i⟩   | 90°  | 270° |

### 2.3. Bloch-gömb koordináták

Az állapot Bloch-vektorának koordinátái az amplitúdókból:

x = 2·Re(α*·β),  y = 2·Im(α*·β),  z = |α|² − |β|².

Tiszta, normalizált állapotra teljesül, hogy x² + y² + z² = 1, azaz a vektor végpontja a gömb felszínén van. Ez a tesztelés során is fontos invariáns.

### 2.4. Kvantumkapuk

Minden kapu egy 2×2-es komplex mátrix, a kapu alkalmazása pedig egy mátrix-vektor szorzás: |ψ′⟩ = U|ψ⟩. A program általános mátrix-vektor szorzást valósít meg, így új kapu hozzáadása nem igényel új algoritmust, csak a mátrix megadását.

**Pauli-kapuk:**

```
X = [ 0  1 ]      Y = [ 0  -i ]      Z = [ 1   0 ]
    [ 1  0 ]          [ i   0 ]          [ 0  -1 ]
```

**Hadamard-kapu:**

```
H = (1/√2) · [ 1   1 ]
             [ 1  -1 ]
```

**Fáziskapuk:**

```
S = [ 1  0 ]      T = [ 1       0      ]
    [ 0  i ]          [ 0  e^{iπ/4}    ]
```

**Forgatókapuk (θ fokban megadott szöggel):**

```
Rx(θ) = [  cos(θ/2)   -i·sin(θ/2) ]
        [ -i·sin(θ/2)  cos(θ/2)   ]

Ry(θ) = [  cos(θ/2)   -sin(θ/2) ]
        [  sin(θ/2)    cos(θ/2) ]

Rz(θ) = [ e^{-iθ/2}     0      ]
        [    0      e^{iθ/2}   ]
```

A forgatókapuk szögét a felhasználó fokban adja meg, a program a számítás előtt radiánra konvertál.

### 2.5. A globális fázis kezelése

A globális fázis (egy közös e^{iγ} szorzó) nem változtatja meg a Bloch-gömbön látható fizikai állapotot, a relatív fázis viszont igen. Ezt a megjelenítés és különösen az állapotok összehasonlítása figyelembe veszi: a tesztekben két állapotvektort akkor is azonosnak tekintünk, ha csak globális fázisban térnek el. Ezt a `physicalEqual` függvény valósítja meg, amely a két állapot közti fáziskülönbséget kiegyenlíti az összehasonlítás előtt.

---

## 3. Technológiai háttér

### 3.1. Felhasznált technológiák

| Technológia       | Felhasználás                                              |
| ----------------- | --------------------------------------------------------- |
| HTML5             | Az alkalmazás szerkezete                                  |
| CSS3              | Megjelenés, elrendezés és reszponzivitás                  |
| JavaScript (ES6+) | Számítások, állapotkezelés, felhasználói interakciók      |
| Plotly.js         | Interaktív háromdimenziós Bloch-gömb megjelenítése        |
| Git és GitHub     | Verziókezelés és közös fejlesztés                         |

### 3.2. A választás indoklása

A felület HTML és CSS segítségével készül, a működést natív JavaScript valósítja meg. A megoldás nem támaszkodik keretrendszerre (React, Vue), sem kvantumkönyvtárra (például Qiskit): az egyqubites számításokat saját, jól elkülönített JavaScript-modulok végzik. A kód hagyományos scriptfájlokat használ, így nem igényel build rendszert vagy csomagkezelőt, és közvetlenül megnyitható egy böngészőben.

### 3.3. A felhasznált könyvtár: Plotly.js

A háromdimenziós megjelenítéshez a **Plotly.js** nyílt forráskódú vizualizációs könyvtár szükséges. A könyvtárat helyben, a projekt `lib/plotly.min.js` útvonalán tároljuk, így az alkalmazás internetkapcsolat nélkül is működik. A `scatter3d` és `surface` nyomvonaltípusokkal rajzoljuk ki a gömböt, a tengelyeket, a segédköröket és az állapotvektorokat. A kameraállás és a nagyítás frissítések közti megőrzését a Plotly `uirevision` mechanizmusa biztosítja.

A `style.css` egy Google Fonts betűkészletet is importál (Manrope és DM Mono). Ez csak esztétikai szerepű: ha nincs internetkapcsolat, a böngésző rendszerbetűtípusra vált, és az alkalmazás működése változatlan marad.

---

## 4. A program felépítése (architektúra)

A projekt hat JavaScript-modulra bomlik, amelyek felelősségei élesen elkülönülnek. Fontos architekturális szabály, hogy a `quantum.js` és a `gates.js` nem tartalmaz DOM-manipulációt, így a matematikai mag a felülettől függetlenül is működik és tesztelhető.

| Fájl               | Felelősség                                                            |
| ------------------ | --------------------------------------------------------------------- |
| `js/quantum.js`    | Komplex számok, állapotok, normalizálás, Bloch-koordináták, valószínűségek, fizikai egyenlőség |
| `js/gates.js`      | A kapumátrixok, a forgatókapuk előállítása és a mátrix-vektor szorzás  |
| `js/simulator.js`  | Az állapotok és a közös kapusorozat kezelése, léptetés, újraszámítás   |
| `js/bloch-sphere.js` | A Plotly-alapú, állapotonként különálló 3D gömbök felépítése és frissítése |
| `js/ui.js`         | A felhasználói események kezelése, a panelek és értékek frissítése      |
| `js/main.js`       | Az alkalmazás indítása                                                 |

A CSS három fájlra oszlik: a `style.css` az alaplayout, a színek és a tipográfia; a `components.css` a gombok, panelek és beviteli elemek stílusai; az `animations.css` a későbbi felületi átmenetek helye.

### 4.1. Adatmodell és állapotkezelés

A szimulátor központi objektuma a `Simulator` osztály egy példánya. Ennek főbb mezői:

- `states`: a legfeljebb négy állapot listája. Minden állapot tartalmaz egy egyedi `id`-t, nevet, színt, a θ és φ szögeket, a `initial` kezdőállapotot és a `current` aktuális állapotot.
- `circuit`: a közös kapusorozat. Minden eleme egy kapu neve, a (forgatókapuknál) szöge, valamint a `targetIds` lista, amely megadja, mely állapotokra hat.
- `step`: a kapusorozatban elfoglalt aktuális pozíció.

Az állapotokat mindig az azonosítójuk (`id`) alapján kezeljük, nem a listában elfoglalt helyük alapján, így egy állapot törlése nem zavarja meg a többi állapot vagy a kapuk célhivatkozásait.

### 4.2. A közös kapusorozat és az újraszámítás

A `recompute()` metódus minden állapotra a saját kezdőállapotából indulva alkalmazza a kapusorozat aktuális lépésig tartó részét, de csak azokat a kapukat, amelyek célállapotai között az adott állapot szerepel. Így a kezdőállapot módosítása, egy kapu törlése vagy a léptetés mindig konzisztens, az eredeti kezdőállapotokból újraszámolt eredményt ad.

### 4.3. A betöltési sorrend

A szkriptek betöltési sorrendje lényeges, mert a modulok a globális `window` objektumon keresztül függenek egymástól. A sorrend: `plotly.min.js`, majd `quantum.js`, `gates.js`, `simulator.js`, `bloch-sphere.js`, `ui.js`, végül `main.js`.

---

## 5. A program működése

### 5.1. Kezdőállapot beállítása

A felhasználó a „Paraméterezés" panelen választhat előre definiált állapotot, vagy a θ és φ csúszkákkal állíthat be tetszőleges tiszta állapotot. A listában a ceruza gombbal kiválasztott állapot kezdőértékeit szerkeszti; a csúszkák ennek az állapotnak az értékeit veszik fel, és módosításuk csak a kiválasztott állapotra hat.

### 5.2. Kapuk kiválasztása és célállapotai

A „Kapu hozzáadása" panelen jelölőnégyzetekkel adható meg, mely állapotokra hasson a következőként hozzáadott kapu (alapértelmezésben mindegyikre). A forgatókapuk (Rx, Ry, Rz) szöge a szögbeviteli mezőben állítható be; a mező kiemelést kap, amikor a felhasználó egy forgatókapu gombjára viszi az egeret, jelezve, hogy a szög csak ezekre vonatkozik.

### 5.3. Kapusorozatok végrehajtása

A hozzáadott kapuk a közös kapusorozatban jelennek meg, a célállapotaik feltüntetésével. A „Tovább" és „Vissza" gombokkal lépésenként haladhatunk, a „Lejátszás" automatikusan végrehajtja a hátralévő lépéseket, az „Alaphelyzet" pedig a sorozat elejére ugrik. Egy kapu vagy a teljes sorozat is törölhető.

### 5.4. Több állapot összehasonlítása

Minden felvett állapot külön, színkódolt Bloch-gömböt kap, így a kapuk hatása egyszerre, párhuzamosan figyelhető meg a különböző kezdőállapotokon. Az alsó panelen állapotonként láthatók az aktuális amplitúdók, a mérési valószínűségek és a Bloch-koordináták.

---

## 6. Felhasználói útmutató

1. A „Paraméterezés" panelen válassz egy előre definiált állapotot, vagy állítsd be a θ és φ értékét a csúszkákkal.
2. Az „Összehasonlítás" panelen vegyél fel további állapotokat. Legfeljebb négy állapot kezelhető; a ceruza gombbal választhatod ki, melyik állapot kezdőértékét szerkeszted, az × gombbal pedig törölhetsz.
3. A „Kapu hozzáadása" panelen jelöld ki a célállapotokat, az Rx, Ry és Rz kapuknál add meg a forgatási szöget, majd kattints a kívánt kapura.
4. A kapusorozat a kijelölt célállapotokra, közös sorrendben érvényes.
5. A „Tovább" és „Vissza" gombokkal lépésenként haladhatsz; a „Lejátszás" automatikusan végrehajtja a hátralévő lépéseket, az „Alaphelyzet" visszaáll a sorozat elejére.
6. Az aktuális amplitúdók, valószínűségek és Bloch-koordináták az „Aktuális értékek" panelen láthatók.
7. A Bloch-gömb egérrel forgatható, a görgővel nagyítható; a beállított nézet a léptetések során megmarad.

### 6.1. Példa egy használati forgatókönyvre

1. Hagyd meg az alapértelmezett |0⟩ állapotot, és vegyél fel egy második állapotot.
2. A második állapotnál állítsd be a |+⟩ előbeállítást.
3. Jelöld ki csak az első állapotot, majd adj hozzá egy X kaput.
4. Jelöld ki csak a második állapotot, és adj hozzá egy H kaput.
5. Lépj kétszer előre, és figyeld meg, hogy a két kapu csak a saját célállapotára hatott.
6. Próbáld ki a visszaléptetést, az alaphelyzetet és az automatikus lejátszást.

---

## 7. Tesztelés

A matematikai helyesség kritikus, ezért a számítási magot külön, böngészőben futtatható tesztek ellenőrzik. A `tests/test.html` megnyitásával a tesztek automatikusan lefutnak, és az eredmény a lapon megjelenik.

### 7.1. Alkalmazott tesztesetek

A tesztek a `quantum.js`, a `gates.js` és a `simulator.js` modulokat ellenőrzik, többek között:

- a |0⟩ állapot normája 1;
- H|0⟩ = |+⟩;
- X|0⟩ = |1⟩ és X|1⟩ = |0⟩;
- Z|+⟩ = |−⟩;
- H|+⟩ fizikailag a |0⟩ állapot;
- S|+⟩ = |+i⟩;
- a T kapu megőrzi a normát;
- Rx(360°) fizikailag azonos a kiindulási állapottal;
- Rz(90°) helyesen forgat az egyenlítőn;
- a szimulátor legfeljebb négy állapotot enged felvenni;
- a közös kapusorozat minden célállapotra lefut;
- a visszalépés visszaállítja a kezdőállapotot.

### 7.2. A tesztelés elvei

A lebegőpontos számábrázolás miatt az összehasonlításoknál toleranciát (nagyságrendileg 10⁻⁹) alkalmazunk. Az állapotok összehasonlításánál a globális fázis fizikailag irreleváns, ezért a tesztelő ezt kiegyenlíti. A normalizálási invariánst (|α|² + |β|² = 1) több teszt is ellenőrzi a kapuk alkalmazása után.

### 7.3. Teszteredmény

A böngészős tesztoldalon az összes definiált teszteset sikeresen lefut. A számítási mag ezen felül fejlesztőkörnyezetben, a felülettől függetlenül is ellenőrizhető, mivel a `quantum.js` és a `gates.js` nem tartalmaz DOM-függőséget.

---

## 8. Futtatás és telepítés

A szimulátor külön fejlesztőkörnyezet telepítése nélkül, egy böngészővel rendelkező Windows-os gépen futtatható.

1. Győződj meg róla, hogy a `lib/plotly.min.js` fájl a helyén van (ez szükséges a 3D megjelenítéshez). Ha hiányzik, a felület jelzi, és útmutatást ad a pótlásához.
2. Nyisd meg az `index.html` fájlt egy modern böngészőben (dupla kattintással is elég).

Nincs szükség szerverre, Node.js-re vagy Python-környezetre. Mivel a Plotly könyvtárat helyben tároljuk, az alkalmazás internetkapcsolat nélkül is működik; ilyenkor csak a dekoratív betűtípus vált rendszerbetűre.

---

## 9. Korlátok és továbbfejlesztési lehetőségek

A program tiszta, egyqubites állapotokat kezel. Nem tartalmaz többqubites összefonódást, zajmodellt vagy mérési folyamatot. Lehetséges továbbfejlesztések:

- a kapuk átrendezése a kapusorozatban;
- a kapuk közti animált, geometriailag helyes vektorforgatás;
- a kiválasztott kapu mátrixának megjelenítése a magyarázat mellett;
- állapotok mentése és visszatöltése;
- a kezdőállapot közvetlen beállítása a Bloch-gömbön történő kattintással;
- részletesebb, kinyitható matematikai levezetések.

---

## 10. Összefoglalás

A Bloch-gömb szimulátor egy böngészőben közvetlenül futtatható, telepítést nem igénylő oktatási eszköz egyetlen qubit tiszta állapotainak és egyqubites kapuműveleteinek szemléltetésére. A program legfeljebb négy állapotot kezel külön Bloch-gömbökön, tetszőleges kezdőállapotot enged megadni, és kilenc egyqubites kaput (X, Y, Z, H, S, T, Rx, Ry, Rz) kínál, amelyek helyes működését automatikus tesztek igazolják. A kapuk közös sorozatba fűzhetők, kapunként választható célállapotokkal, és lépésenként vagy automatikusan futtathatók. A tiszta modulszerkezet elkülöníti a matematikai magot a megjelenítéstől, így a program egyszerre megbízható és jól bővíthető.
