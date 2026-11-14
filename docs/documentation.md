# Bloch-gömb szimulátor – dokumentáció

BME VIK · Kvantuminformatikai alkalmazások · féléves házi feladat
2. feladat: Kvantuminformatikai alapok – Bloch-gömb szimulátor

---

## Tartalom

1. Bevezetés
2. Matematikai háttér
3. Technológiai háttér
4. A program felépítése (architektúra)
5. A modulok részletes leírása
6. A program működése
7. Felhasználói útmutató
8. Tesztelés
9. Futtatás és telepítés
10. Korlátok és továbbfejlesztési lehetőségek
11. Összefoglalás

---

## 1. Bevezetés

### 1.1. A projekt célja

A program egyetlen qubit tiszta kvantumállapotainak és az azokon végrehajtott egyqubites kapuműveleteknek a szemléltetésére készült. A felhasználó több kezdőállapotot vehet fel, majd ugyanazt a kapusorozatot alkalmazhatja mindegyikre. A Bloch-gömb háromdimenziós ábrázolása segít az állapotok geometriai összehasonlításában, valamint abban, hogy a kvantumkapuk hatása szemléletesen, forgatásokként értelmezhető legyen.

A cél egy böngészőben közvetlenül futtatható, telepítést nem igénylő, matematikailag helyes és vizuálisan igényes oktatási eszköz. A program kifejezetten a tanulást támogatja: nem egy nagy teljesítményű kvantumszimulátor, hanem egy olyan vizualizációs segédlet, amely a qubit absztrakt fogalmát kézzelfoghatóvá teszi.

### 1.2. A Bloch-gömb rövid ismertetése

Egy egyqubites tiszta állapot a kétdimenziós komplex vektortér egységnyi normájú vektora. A globális fázistól eltekintve minden ilyen állapot kölcsönösen egyértelműen megfeleltethető egy egységgömb – a Bloch-gömb – felszínén lévő pontnak. A gömb északi pólusa a |0⟩, déli pólusa az |1⟩ állapot; az egyenlítőn a |0⟩ és |1⟩ egyenlő súlyú szuperpozíciói (például |+⟩, |−⟩, |+i⟩, |−i⟩) helyezkednek el. Egy unitér egyqubites kapu a Bloch-gömbön egy forgatásnak felel meg: a Pauli-kapuk 180°-os, az S kapu 90°-os, a T kapu 45°-os forgatás a megfelelő tengely körül, a forgatókapuk (Rx, Ry, Rz) pedig tetszőleges szögű forgatást adnak.

A Bloch-gömb szemléltető ereje abban rejlik, hogy a négy valós paraméterrel (két komplex amplitúdó) leírt állapotteret a normálási és a globális fázis szabadságának kihasználásával két valós szögre (θ, φ) redukálja, amelyek közvetlenül megfeleltethetők egy gömbfelületi pontnak.

### 1.3. A szimulátor képességei

- Legfeljebb négy különböző qubitállapot egyidejű kezelése; a térbeli nézetben egyszerre a kijelölt állapot Bloch-gömbje látható, és egy választósávval váltható, melyiket mutassa.
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

A fenti példa a |0⟩ állapotot jelöli. Az állapot létrehozásakor a program automatikusan normalizál: elosztja az amplitúdókat a √(|α|² + |β|²) normával. Ha a norma nem véges, vagy a nullához túl közeli (10⁻¹⁴ alatt), a program hibát jelez, mert nulla normájú állapot fizikailag nem értelmezhető. Ezt a `Quantum.state` függvény végzi.

### 2.2. Komplex számok kezelése

A számítási mag saját, minimális komplex aritmetikát valósít meg a `Quantum.C` objektumban, keretrendszer nélkül. A főbb műveletek:

| Művelet          | Jelentés                                  |
| ---------------- | ----------------------------------------- |
| `C.make(re, im)` | Komplex szám létrehozása                   |
| `C.add(a, b)`    | Összeadás                                 |
| `C.mul(a, b)`    | Szorzás                                   |
| `C.scale(a, s)`  | Valós skalárral szorzás                    |
| `C.conj(a)`      | Komplex konjugált                          |
| `C.abs2(a)`      | Abszolút érték négyzete (\|a\|²)           |
| `C.format(a)`    | Olvasható szöveges megjelenítés            |

A megjelenítésnél a program a 10⁻¹⁰-nél kisebb abszolút értékű valós vagy képzetes részt nullának tekinti, így elkerülhető, hogy a lebegőpontos kerekítés zaja (például 2.2·10⁻¹⁶) megjelenjen a felületen.

### 2.3. Kezdőállapot paraméterezése

A kezdőállapotot két szöggel adjuk meg:

|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} · sin(θ/2)|1⟩,

ahol θ a polárszög (0°–180°) és φ az azimutszög (0°–360°). A felületen fokban dolgozunk, a trigonometrikus számításokhoz a program radiánra vált. A `Quantum.fromAngles` függvény a θ fél szögét közvetlenül a `θ·π/360` kifejezéssel számolja (ez éppen θ/2 radiánban), a φ-t pedig `φ·π/180` szerint, majd az eredményt normalizálja. Az előre definiált állapotok:

| Állapot | θ    | φ    |
| ------- | ---- | ---- |
| \|0⟩    | 0°   | 0°   |
| \|1⟩    | 180° | 0°   |
| \|+⟩    | 90°  | 0°   |
| \|−⟩    | 90°  | 180° |
| \|+i⟩   | 90°  | 90°  |
| \|−i⟩   | 90°  | 270° |

### 2.4. Bloch-gömb koordináták

Az állapot Bloch-vektorának koordinátái az amplitúdókból:

x = 2·Re(α*·β),  y = 2·Im(α*·β),  z = |α|² − |β|².

Tiszta, normalizált állapotra teljesül, hogy x² + y² + z² = 1, azaz a vektor végpontja a gömb felszínén van. Ez a tesztelés során is fontos invariáns. A programban ezt a `Quantum.bloch` függvény számolja: előbb kiszámítja az α*·β szorzatot, majd ebből a fenti képletek szerint állítja elő a három koordinátát.

### 2.5. Mérési valószínűségek

A számítási bázisban a mérési valószínűségek egyszerűen az amplitúdók abszolút értékének négyzetei:

P(|0⟩) = |α|²,  P(|1⟩) = |β|².

Normalizált állapotra P(|0⟩) + P(|1⟩) = 1. Ezt a `Quantum.probabilities` függvény adja vissza, és a felület alsó paneljén állapotonként megjeleníti.

### 2.6. Kvantumkapuk

Minden kapu egy 2×2-es komplex mátrix, a kapu alkalmazása pedig egy mátrix-vektor szorzás: |ψ′⟩ = U|ψ⟩. A program általános mátrix-vektor szorzást valósít meg (`Gates.apply`), így új kapu hozzáadása nem igényel új algoritmust, csak a mátrix megadását. A szorzás eredménye újra áthalad a `Quantum.state` normalizáláson, így a lebegőpontos hibák nem halmozódnak fel káros mértékben.

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

A T kapu jobb alsó eleme a programban közvetlenül a `(√2/2, √2/2)` komplex számként szerepel, ami pontosan az e^{iπ/4} = cos(45°) + i·sin(45°) érték.

**Forgatókapuk (θ fokban megadott szöggel):**

```
Rx(θ) = [  cos(θ/2)   -i·sin(θ/2) ]
        [ -i·sin(θ/2)  cos(θ/2)   ]

Ry(θ) = [  cos(θ/2)   -sin(θ/2) ]
        [  sin(θ/2)    cos(θ/2) ]

Rz(θ) = [ e^{-iθ/2}     0      ]
        [    0      e^{iθ/2}   ]
```

A forgatókapuk szögét a felhasználó fokban adja meg, a program a számítás előtt radiánra konvertál (`angleDeg·π/180`), majd a fenti képletekben a fél szöggel (a/2) dolgozik. Ha egy kapu neve ismeretlen és nem forgatókapu, a `Gates.apply` hibát dob.

### 2.7. A globális fázis kezelése

A globális fázis (egy közös e^{iγ} szorzó) nem változtatja meg a Bloch-gömbön látható fizikai állapotot, a relatív fázis viszont igen. Ezt a megjelenítés és különösen az állapotok összehasonlítása figyelembe veszi: a tesztekben két állapotvektort akkor is azonosnak tekintünk, ha csak globális fázisban térnek el. Ezt a `Quantum.physicalEqual` függvény valósítja meg, amely a két állapot közti fáziskülönbséget egy komplex fázisszorzóval kiegyenlíti az összehasonlítás előtt, majd az eltérést egy kis toleranciával (alapértelmezésben 10⁻⁹) vizsgálja. Ha a számított fázis túl kicsi a megbízható normáláshoz, a függvény a komponensek közvetlen összehasonlítására esik vissza.

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

A felület HTML és CSS segítségével készül, a működést natív JavaScript valósítja meg. A megoldás nem támaszkodik keretrendszerre (React, Vue), sem kvantumkönyvtárra (például Qiskit): az egyqubites számításokat saját, jól elkülönített JavaScript-modulok végzik. A kód hagyományos scriptfájlokat használ (nincs modulbundler vagy import/export), a modulok a globális `window` objektumon keresztül érik el egymást. Így a projekt nem igényel build rendszert vagy csomagkezelőt, és közvetlenül megnyitható egy böngészőben.

Ez a megközelítés oktatási projekthez különösen előnyös: a forrás átlátható, minden lépés közvetlenül olvasható, és a telepítés akadálya minimális.

### 3.3. A felhasznált könyvtár: Plotly.js

A háromdimenziós megjelenítéshez a **Plotly.js** nyílt forráskódú vizualizációs könyvtár szükséges. A könyvtárat helyben, a projekt `lib/plotly.min.js` útvonalán tároljuk, így az alkalmazás internetkapcsolat nélkül is működik. A `scatter3d` és `surface` nyomvonaltípusokkal rajzoljuk ki a gömböt, a tengelyeket, a segédköröket és az állapotvektorokat. A kameraállás és a nagyítás frissítések közti megőrzését a Plotly `uirevision` mechanizmusa biztosítja.

Ha a Plotly könyvtár nem érhető el (a `window.Plotly` nem létezik), a felület nem omlik össze: egy figyelmeztető panel (`plotFallback`) jelenik meg, amely útmutatást ad a könyvtár pótlásához, a 3D nézet pedig elrejtődik.

A `style.css` egy Google Fonts betűkészletet is importál (Manrope és DM Mono). Ez csak esztétikai szerepű: ha nincs internetkapcsolat, a böngésző rendszerbetűtípusra vált, és az alkalmazás működése változatlan marad.

---

## 4. A program felépítése (architektúra)

A projekt hat JavaScript-modulra bomlik, amelyek felelősségei élesen elkülönülnek. Fontos architekturális szabály, hogy a `quantum.js` és a `gates.js` nem tartalmaz DOM-manipulációt, így a matematikai mag a felülettől függetlenül is működik és tesztelhető.

| Fájl               | Felelősség                                                            |
| ------------------ | --------------------------------------------------------------------- |
| `js/quantum.js`    | Komplex számok, állapotok, normalizálás, Bloch-koordináták, valószínűségek, fizikai egyenlőség |
| `js/gates.js`      | A kapumátrixok, a forgatókapuk előállítása és a mátrix-vektor szorzás  |
| `js/simulator.js`  | Az állapotok és a közös kapusorozat kezelése, léptetés, újraszámítás   |
| `js/bloch-sphere.js` | A Plotly-alapú 3D Bloch-gömb felépítése és frissítése; egyszerre a kijelölt állapot gömbjét mutatja |
| `js/ui.js`         | A felhasználói események kezelése, a panelek és értékek frissítése      |
| `js/main.js`       | Az alkalmazás indítása                                                 |

A CSS három fájlra oszlik: a `style.css` az alaplayout, a színek és a tipográfia; a `components.css` a gombok, panelek és beviteli elemek stílusai; az `animations.css` a későbbi felületi átmenetek helye.

### 4.1. Rétegek és függőségi irány

A modulok egyértelmű függőségi láncot alkotnak, és a függőség mindig „lefelé”, a magasabb absztrakciótól az alacsonyabb felé mutat:

```
main.js  →  ui.js  →  simulator.js  →  gates.js  →  quantum.js
                   →  bloch-sphere.js  →  quantum.js
```

- A `quantum.js` a legalsó réteg: semmilyen más projektmodultól nem függ.
- A `gates.js` csak a `quantum.js`-re támaszkodik (a komplex aritmetikára és az állapotképzésre).
- A `simulator.js` a `quantum.js`-t és a `gates.js`-t használja, de felülettől független marad.
- A `bloch-sphere.js` a `quantum.js`-re és a Plotly-ra épül.
- Az `ui.js` köti össze a szimulátort, a megjelenítést és a DOM-ot.
- A `main.js` mindössze az indítást végzi.

### 4.2. Adatmodell és állapotkezelés

A szimulátor központi objektuma a `Simulator` osztály egy példánya (a globális térben `SimulatorClass` néven érhető el). Ennek főbb mezői:

- `states`: a legfeljebb négy állapot listája. Minden állapot tartalmaz egy egyedi `id`-t, nevet, színt, a θ és φ szögeket, a `initial` kezdőállapotot és a `current` aktuális állapotot.
- `circuit`: a közös kapusorozat. Minden eleme egy kapu neve (`name`), a (forgatókapuknál) szöge (`angle`), a `targetIds` lista (mely állapotokra hat), valamint a `targetNames` lista a megjelenítéshez.
- `step`: a kapusorozatban elfoglalt aktuális pozíció.

Az állapotokat mindig az azonosítójuk (`id`) alapján kezeljük, nem a listában elfoglalt helyük alapján, így egy állapot törlése nem zavarja meg a többi állapot vagy a kapuk célhivatkozásait. Új állapot felvételekor az `id` a meglévő legnagyobb azonosítónál eggyel nagyobb érték lesz, így az azonosítók nem ütköznek akkor sem, ha közben törlés történt. Az állapotok színét egy négyelemű paletta adja, amelyből az azonosító alapján (ciklikusan) választ a program.

### 4.3. A közös kapusorozat és az újraszámítás

A `recompute()` metódus minden állapotra a saját kezdőállapotából (`initial`) indulva alkalmazza a kapusorozat aktuális lépésig tartó részét, de csak azokat a kapukat, amelyek célállapotai (`targetIds`) között az adott állapot szerepel. Így a kezdőállapot módosítása, egy kapu törlése vagy a léptetés mindig konzisztens, az eredeti kezdőállapotokból újraszámolt eredményt ad. Ez a megközelítés kizárja a „sodródó” hibákat, mert az aktuális állapot sosem egy korábbi aktuális állapotból, hanem mindig a rögzített kezdőállapotból épül fel újra.

A léptetést a `setStep()` metódus korlátozza a [0, kapuk száma] tartományra, így a `next()`, `previous()` és `reset()` sosem lép a sorozaton kívülre. A `getSnapshots(id)` metódus egy adott állapot teljes történetét adja vissza: a kezdőállapotot és minden kapu utáni állapotot egy tömbben, ami a lépésenkénti vizsgálathoz és esetleges animációhoz hasznos.

### 4.4. A betöltési sorrend

A szkriptek betöltési sorrendje lényeges, mert a modulok a globális `window` objektumon keresztül függenek egymástól. Az `index.html` a következő sorrendet rögzíti: `plotly.min.js`, majd `quantum.js`, `gates.js`, `simulator.js`, `bloch-sphere.js`, `ui.js`, végül `main.js`. A `main.js` a `DOMContentLoaded` eseményre várva hívja meg a `UI.init()` függvényt, így a felület csak akkor épül fel, amikor a DOM már készen áll.

---

## 5. A modulok részletes leírása

### 5.1. `quantum.js` – a számítási mag

A legalsó réteg. Egy IIFE-be (azonnal meghívott függvénykifejezésbe) zárva exportálja a `Quantum` objektumot a `window`-ra. Tartalma: a `C` komplex aritmetika, a `state` (normalizáló állapotkonstruktor), a `fromAngles`, a `bloch`, a `probabilities`, a `clone` (mély másolat) és a `physicalEqual`. DOM-függősége nincs, ezért önmagában is tesztelhető.

### 5.2. `gates.js` – a kapuk

A fix kapukat (X, Y, Z, H, S, T) egy előre felépített mátrixtáblázatban tárolja, a forgatókapukat (Rx, Ry, Rz) a `rotation` függvény állítja elő a megadott szögből. A `matrix` függvény a kapu nevéből kiválasztja a megfelelő mátrixot, az `apply` pedig elvégzi a mátrix-vektor szorzást és visszaadja a normalizált új állapotot. A `descriptions` objektum minden kapuhoz egy rövid, magyar nyelvű magyarázatot tartalmaz, amely a felületen a kapu kiválasztásakor jelenik meg.

### 5.3. `simulator.js` – az állapot- és sorozatkezelés

A `Simulator` osztály a teljes alkalmazásállapot gazdája. Metódusai: `addState`, `removeState`, `setInitial`, `addGate`, `removeGate`, `clear`, `recompute`, `setStep`, `next`, `previous`, `reset`, `getSnapshots`. Egy új `Simulator` egyetlen |0⟩ állapottal és üres kapusorozattal indul. A modul exportálja a `SimulatorClass`-t és a `StatePresets` előbeállításokat is.

### 5.4. `bloch-sphere.js` – a 3D megjelenítés

A `BlochSphere.render(states, selectedId)` függvény a kijelölt állapothoz tartozó kártyát (`bloch-card`) és abban a Plotly-ábrát jeleníti meg. A gömböt egy áttetsző `surface` nyomvonal, a három segédkört és a tengelyeket `scatter3d` vonalak, az állapotot pedig egy origóból induló vektor adja.

A modul két fontos teljesítmény- és stabilitási elvet követ:

- **Lusta létrehozás és életben tartás.** Egy állapot ábrája akkor épül fel (`Plotly.newPlot`), amikor először megjelenítik. Váltáskor a többi ábrát nem bontjuk le, csak elrejtjük (`display: none`), így visszatéréskor a kameraállás és a nagyítás megmarad. A megszűnt állapotok ábráit a `Plotly.purge` szabadítja fel.
- **Frissítéskor csak a vektor változik.** A statikus díszlet (gömbfelszín, segédkörök, tengelyek) a létrehozás után érintetlen marad. A layoutot – és benne a kameraállást – a modul soha nem küldi újra; a frissítés egyetlen `Plotly.restyle` hívással, kizárólag az állapotvektor nyomvonalára történik. Ezért kapu hozzáadásakor és a sorozat lejátszásakor a gömb mozdulatlan, csak a jelzővektor mozog.

A méretezést egy `ResizeObserver` igazítja a tárolóhoz, amely csak tényleges méretváltozáskor hívja a `Plotly.Plots.resize`-t. Ha nincs Plotly, a függvény a tartalék panelt mutatja.

### 5.5. `ui.js` – a felhasználói felület

Az `ui.js` köti össze a szimulátort a DOM-mal. Egyetlen `Simulator`-példányt tart, követi a kiválasztott (szerkesztett) állapot azonosítóját és a következő kapu célállapotainak halmazát (`selectedTargetIds`). A `renderAll` az összes panelt frissíti (állapotlista, célállapotok, kapusorozat, részletek, lejátszásvezérlők és a Bloch-gömbök). A `bind` függvény minden eseménykezelőt beállít. A felhasználói szövegeket a megjelenítés előtt a `escapeHtml` függvény biztonságosan escape-eli, így az állapotnevek nem okozhatnak HTML-injekciót.

### 5.6. `main.js` – belépési pont

A legegyszerűbb modul: a DOM betöltődése után meghívja a `UI.init()`-et, amely létrehozza a szimulátort, beköti az eseményeket, kiválasztja az első állapotot és felépíti a teljes felületet.

---

## 6. A program működése

### 6.1. Kezdőállapot beállítása

A felhasználó a „Paraméterezés” panelen választhat előre definiált állapotot, vagy a θ és φ csúszkákkal állíthat be tetszőleges tiszta állapotot. A listában a ceruza gombbal kiválasztott állapot kezdőértékeit szerkeszti; a csúszkák ennek az állapotnak az értékeit veszik fel, és módosításuk csak a kiválasztott állapotra hat. Ha az aktuális θ és φ értékek pontosan megfelelnek egy előbeállításnak, az előbeállítás-választó automatikusan arra áll, egyébként „custom” értéket mutat.

### 6.2. Kapuk kiválasztása és célállapotai

A „Kapu hozzáadása” panelen jelölőnégyzetekkel adható meg, mely állapotokra hasson a következőként hozzáadott kapu (alapértelmezésben mindegyikre). A célállapotok halmaza automatikusan tisztul, ha egy állapotot törölnek, így sosem hivatkozik már nem létező állapotra. A forgatókapuk (Rx, Ry, Rz) szöge a szögbeviteli mezőben állítható be; a mező kiemelést kap, amikor a felhasználó egy forgatókapu gombjára viszi az egeret vagy ráfókuszál, jelezve, hogy a szög csak ezekre vonatkozik. Ha a célállapotok kijelölése üres, a program figyelmeztet, és nem adja hozzá a kaput.

### 6.3. Kapusorozatok végrehajtása

A hozzáadott kapuk a közös kapusorozatban jelennek meg, a célállapotaik feltüntetésével. A „Tovább” és „Vissza” gombokkal lépésenként haladhatunk, a „Lejátszás” automatikusan végrehajtja a hátralévő lépéseket (lépésenként körülbelül 850 ezredmásodperces időzítéssel), az „Alaphelyzet” pedig a sorozat elejére ugrik. A lejátszás gomb szünet/folytatás állapotot vált, és ha a sorozat végén indítjuk, előbb visszaáll az elejére. Egy kapu vagy a teljes sorozat is törölhető; minden ilyen művelet után a megjelenítés újraszámolódik.

### 6.4. Több állapot összehasonlítása

A térbeli nézet mindig egyetlen, nagy méretű Bloch-gömböt mutat: a kijelölt állapotét. A megjelenítés fölötti választósávon (színkódolt fülekkel, állapotonként egy) váltható, melyik állapot gömbje legyen látható. A váltás egyben azt is kijelöli, melyik állapot kezdőértékét szerkesztik a θ és φ csúszkák, így a „kijelölt állapot” fogalma a felületen egységes.

A gömbök a háttérben nem bomlanak le váltáskor, ezért ha egy állapotra visszatérünk, a korábban beállított kameraállás és nagyítás megmarad.

A numerikus összehasonlítás ettől független: az „Aktuális értékek” panelen **minden** állapot adatai egyszerre, egymás mellett láthatók – az amplitúdók, a mérési valószínűségek és a Bloch-koordináták, mind három tizedesjegyre formázva, a kerekítési zaj elnyomásával. Így a kapuk hatása számszerűen továbbra is párhuzamosan követhető.

---

## 7. Felhasználói útmutató

1. A „Paraméterezés” panelen válassz egy előre definiált állapotot, vagy állítsd be a θ és φ értékét a csúszkákkal.
2. Az „Összehasonlítás” panelen vegyél fel további állapotokat. Legfeljebb négy állapot kezelhető; a ceruza gombbal választhatod ki, melyik állapot kezdőértékét szerkeszted, az × gombbal pedig törölhetsz (legalább egy állapotnak maradnia kell).
3. A „Kapu hozzáadása” panelen jelöld ki a célállapotokat, az Rx, Ry és Rz kapuknál add meg a forgatási szöget, majd kattints a kívánt kapura.
4. A kapusorozat a kijelölt célállapotokra, közös sorrendben érvényes.
5. A „Tovább” és „Vissza” gombokkal lépésenként haladhatsz; a „Lejátszás” automatikusan végrehajtja a hátralévő lépéseket, az „Alaphelyzet” visszaáll a sorozat elejére.
6. Az aktuális amplitúdók, valószínűségek és Bloch-koordináták az „Aktuális értékek” panelen láthatók.
7. A térbeli nézet fölötti választósávon állítható be, melyik állapot Bloch-gömbje legyen látható. Egyszerre egy gömb látszik, teljes méretben.
8. A Bloch-gömb egérrel forgatható, a görgővel nagyítható; a beállított nézet a léptetések során és a gömbök közti váltáskor is megmarad.

### 7.1. Példa egy használati forgatókönyvre

1. Hagyd meg az alapértelmezett |0⟩ állapotot, és vegyél fel egy második állapotot.
2. A második állapotnál állítsd be a |+⟩ előbeállítást.
3. Jelöld ki csak az első állapotot, majd adj hozzá egy X kaput.
4. Jelöld ki csak a második állapotot, és adj hozzá egy H kaput.
5. Lépj kétszer előre, és figyeld meg, hogy a két kapu csak a saját célállapotára hatott.
6. Próbáld ki a visszaléptetést, az alaphelyzetet és az automatikus lejátszást.

---

## 8. Tesztelés

A matematikai helyesség kritikus, ezért a számítási magot külön, böngészőben futtatható tesztek ellenőrzik. A `tests/test.html` megnyitásával a tesztek automatikusan lefutnak, és az eredmény a lapon megjelenik egy listában, a végén összegzéssel (hány teszt sikeres és hány sikertelen).

### 8.1. A tesztkeret

A `tests/test-quantum.js` egy kisméretű, saját tesztkeretet használ: a `test(név, fn)` függvény lefuttat egy esetet, és sikeres vagy hibás jelöléssel a lapra írja az eredményt; az `assert`, `close` (toleranciás összehasonlítás) és `phys` (fizikai, globális fázisig történő egyenlőség) segédfüggvények támogatják az ellenőrzést. A keret nem igényel külső tesztfuttatót.

### 8.2. Alkalmazott tesztesetek

A tesztek a `quantum.js`, a `gates.js` és a `simulator.js` modulokat ellenőrzik. A jelenlegi tesztkészlet 13 esetet tartalmaz:

- a |0⟩ állapot normája 1;
- H|0⟩ = |+⟩;
- X|0⟩ = |1⟩ és X|1⟩ = |0⟩;
- Z|+⟩ = |−⟩;
- H|+⟩ fizikailag a |0⟩ állapot;
- S|+⟩ = |+i⟩;
- a T kapu megőrzi a normát;
- Rx(360°) fizikailag azonos a kiindulási állapottal;
- Rz(90°) helyesen forgat az egyenlítőn (x = 0, y = 1);
- a szimulátor legfeljebb négy állapotot enged felvenni;
- a közös kapusorozat minden célállapotra lefut;
- a visszalépés visszaállítja a kezdőállapotot.

### 8.3. A tesztelés elvei

A lebegőpontos számábrázolás miatt az összehasonlításoknál toleranciát (nagyságrendileg 10⁻⁹) alkalmazunk. Az állapotok összehasonlításánál a globális fázis fizikailag irreleváns, ezért a tesztelő ezt a `physicalEqual` függvénnyel kiegyenlíti. A normalizálási invariánst (|α|² + |β|² = 1) több teszt is ellenőrzi a kapuk alkalmazása után.

### 8.4. Teszteredmény

A böngészős tesztoldalon az összes definiált teszteset sikeresen lefut (13/13). A számítási mag ezen felül fejlesztőkörnyezetben, a felülettől függetlenül is ellenőrizhető, mivel a `quantum.js` és a `gates.js` nem tartalmaz DOM-függőséget.

---

## 9. Futtatás és telepítés

A szimulátor külön fejlesztőkörnyezet telepítése nélkül, egy böngészővel rendelkező gépen futtatható.

1. Győződj meg róla, hogy a `lib/plotly.min.js` fájl a helyén van (ez szükséges a 3D megjelenítéshez). Ha hiányzik, a felület jelzi, és útmutatást ad a pótlásához.
2. Nyisd meg az `index.html` fájlt egy modern böngészőben (dupla kattintással is elég).

Nincs szükség szerverre, Node.js-re vagy Python-környezetre. A `file://` protokoll is elegendő, mert minden szkript lokális. Mivel a Plotly könyvtárat helyben tároljuk, az alkalmazás internetkapcsolat nélkül is működik; ilyenkor csak a dekoratív betűtípus vált rendszerbetűre.

---

## 10. Korlátok és továbbfejlesztési lehetőségek

A program tiszta, egyqubites állapotokat kezel. Nem tartalmaz többqubites összefonódást, zajmodellt vagy mérési folyamatot (a mérés csak valószínűségként jelenik meg, az állapot nem omlik össze). Lehetséges továbbfejlesztések:

- a kapuk átrendezése a kapusorozatban;
- a kapuk közti animált, geometriailag helyes vektorforgatás (a `getSnapshots` már most is előállítja a köztes állapotokat);
- a kiválasztott kapu mátrixának megjelenítése a magyarázat mellett;
- állapotok mentése és visszatöltése;
- a kezdőállapot közvetlen beállítása a Bloch-gömbön történő kattintással;
- részletesebb, kinyitható matematikai levezetések;
- a tesztkészlet bővítése a felületi (UI) logika automatikus ellenőrzésére.

---

## 11. Összefoglalás

A Bloch-gömb szimulátor egy böngészőben közvetlenül futtatható, telepítést nem igénylő oktatási eszköz egyetlen qubit tiszta állapotainak és egyqubites kapuműveleteinek szemléltetésére. A program legfeljebb négy állapotot kezel, amelyek közül a térbeli nézet a kijelöltet mutatja egy nagy méretű Bloch-gömbön (a megjelenített állapot választósávval váltható), tetszőleges kezdőállapotot enged megadni, és kilenc egyqubites kaput (X, Y, Z, H, S, T, Rx, Ry, Rz) kínál, amelyek helyes működését automatikus tesztek igazolják. A kapuk közös sorozatba fűzhetők, kapunként választható célállapotokkal, és lépésenként vagy automatikusan futtathatók.

A projekt tiszta, rétegzett modulszerkezete elkülöníti a matematikai magot (`quantum.js`, `gates.js`) az állapotkezeléstől (`simulator.js`) és a megjelenítéstől (`bloch-sphere.js`, `ui.js`). Ennek köszönhetően a program egyszerre megbízható, jól tesztelhető és könnyen bővíthető, a build eszközök és keretrendszerek teljes mellőzése mellett.
