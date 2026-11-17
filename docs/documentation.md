# Bloch-gömb szimulátor – dokumentáció

**BME VIK · Kvantuminformatikai alkalmazások · féléves házi feladat**
2. feladat: Kvantuminformatikai alapok – Bloch-gömb szimulátor

| | |
| --- | --- |
| **Típus** | Böngészőben futó, egyoldalas webalkalmazás |
| **Technológia** | HTML5, CSS3, natív JavaScript (ES6+) |
| **Külső könyvtár** | Plotly.js v4.1.1 (MIT licenc) |
| **Telepítés** | Nem szükséges; az `index.html` megnyitása elegendő |

---

## Tartalom

1. Bevezetés
2. Rendszerkövetelmények és futtatás
3. Felhasznált könyvtárak és külső függőségek
4. Felhasználói útmutató
5. Hibaelhárítás
6. Matematikai háttér
7. A program felépítése
8. A háromdimenziós megjelenítés
9. Tesztelés
10. Korlátok és továbbfejlesztés
11. Munkamegosztás

---

## 1. Bevezetés

A program egyetlen qubit tiszta kvantumállapotait és az azokon végzett egyqubites kapuműveleteket szemlélteti. A felhasználó legfeljebb négy kezdőállapotot vehet fel, majd egy közös kapusorozatot alkalmazhat rájuk úgy, hogy kapunként megadja, mely állapotokra hasson a művelet. Minden állapot a saját Bloch-gömbjén jelenik meg, így a kapuk hatása párhuzamosan összehasonlítható.

Egy egyqubites tiszta állapot a globális fázistól eltekintve egy egységgömb – a Bloch-gömb – felszínének pontjával azonosítható. A gömb északi pólusa a |0⟩, déli pólusa az |1⟩, az egyenlítőn pedig a kettő egyenlő súlyú szuperpozíciói (|+⟩, |−⟩, |+i⟩, |−i⟩) helyezkednek el. Egy unitér kapu ezen a gömbön forgatásnak felel meg.

**A szimulátor képességei:** legfeljebb négy állapot önálló gömbökön; tetszőleges kezdőállapot a θ és φ szögekkel vagy hat előbeállításból; kilenc egyqubites kapu (X, Y, Z, H, S, T, Rx, Ry, Rz); kapunként választható célállapotok; lépésenkénti és automatikus végrehajtás animált Bloch-vektorral; az amplitúdók, mérési valószínűségek és Bloch-koordináták élő megjelenítése; 20 automatikus egységteszt.

---

## 2. Rendszerkövetelmények és futtatás

| Követelmény | Érték |
| ----------- | ----- |
| Operációs rendszer | Platformfüggetlen (Windows, macOS, Linux) |
| Böngésző | Chrome 90+, Edge 90+, Firefox 88+, Safari 14+ |
| WebGL | Szükséges a 3D megjelenítéshez |
| Internetkapcsolat | Nem szükséges |
| Lemezterület | Kb. 5 MB (ebből 4,6 MB a Plotly) |
| Ajánlott felbontás | Legalább 1280 × 800 |

A projekt natív HTML, CSS és JavaScript állományokból áll: nincs fordítási lépés, csomagkezelő, `package.json` vagy `node_modules`.

**Indítás:**

1. Klónozd a projektet: `git clone https://github.com/Hunor645/Bloch-g-mb.git`
2. Ellenőrizd, hogy a `lib/plotly.min.js` a helyén van (a tárolóban megtalálható).
3. Nyisd meg az `index.html` fájlt böngészőben – dupla kattintás is elég.

**Tesztek futtatása:** nyisd meg a `tests/test.html` fájlt ugyanígy. A tesztek automatikusan lefutnak, az eredmény azonnal megjelenik.

---

## 3. Felhasznált könyvtárak és külső függőségek

| Komponens | Verzió | Licenc | Szerep | Tárolás |
| --------- | ------ | ------ | ------ | ------- |
| **Plotly.js** | 4.1.1 | MIT | A 3D Bloch-gömb interaktív megjelenítése | Helyben: `lib/plotly.min.js` (4,6 MB) |


A projekt **ezeken kívül semmilyen külső könyvtárat nem használ**: nincs JavaScript-keretrendszer (React, Vue, jQuery) és nincs kvantuminformatikai könyvtár (Qiskit vagy hasonló) sem.

### 3.1. Plotly.js

Nyílt forráskódú, MIT licencű vizualizációs könyvtár. A projekt a minifikált állományt helyben tárolja, és a következő részeit használja:

- **`surface`** nyomvonaltípus a gömb felszínéhez, **`scatter3d`** a tengelyekhez, a három segédkörhöz és az állapotvektorhoz;
- **`newPlot`** és **`react`** az ábra létrehozásához, illetve frissítéséhez;
- **`restyle`** egyetlen nyomvonal célzott frissítéséhez (ezt használja a vektor animációja);
- **`purge`** a megszűnt állapotok felszabadításához, **`Plots.resize`** a tárolóhoz igazításhoz;
- **`plotly_relayout`** esemény és **`uirevision`** mechanizmus a kameraállás megőrzéséhez.

Ha a fájl hiányzik, a program felismeri, és a felületen tájékoztató panelt jelenít meg. Pótlása: töltsd le a `plotly.min.js`-t a [Plotly.js kiadási oldaláról](https://github.com/plotly/plotly.js/releases), és mentsd a `lib/` mappába ezen a néven.

### 3.2. Offline működés és a saját kód

A programban **egyetlen** hálózati hivatkozás van: a `style.css` Google Fonts `@import`-ja. Ez kizárólag esztétikai, internet nélkül a böngésző rendszerbetűtípusra vált, és minden funkció változatlanul működik.

A Plotly kizárólag a megjelenítésért felel. A kvantummechanikai számításokat – a komplex aritmetikát, az állapotok normalizálását, a Bloch-koordinátákat, a kapumátrixokat és a szimulációs logikát – teljes egészében saját kód végzi a `quantum.js`, `gates.js` és `simulator.js` modulokban.

---

## 4. Felhasználói útmutató

A felület bal oldali hasábja a térbeli megjelenítés, a jobb oldali oszlop a vezérlőpanelek a munkafolyamat sorrendjében: Összehasonlítás, Paraméterezés, Kapu hozzáadása, Kapusorozat, Aktuális értékek, Elméleti háttér.

**1. Állapotok felvétele.** Az Összehasonlítás panelen az „+ Állapot" gombbal vehetsz fel újat, előtte nevet is adhatsz neki. Legfeljebb négy állapot kezelhető, utána a gomb letiltódik. A ceruza (✎) gombbal jelölöd ki, melyiket szerkeszted, az × gombbal törölsz; legalább egynek maradnia kell.

**2. Kezdőállapot beállítása.** A Paraméterezés panelen előbeállítást választasz, vagy a θ (0°–180°) és φ (0°–360°) csúszkákkal állítasz be bármely tiszta állapotot. A csúszkák csak a kijelölt állapotra hatnak, és módosítás után a kapusorozat újraszámolódik. Ha a szögpár egyik előbeállításnak sem felel meg, a lista „Egyéni"-re ugrik.

| Előbeállítás | \|0⟩ | \|1⟩ | \|+⟩ | \|−⟩ | \|+i⟩ | \|−i⟩ |
| --- | --- | --- | --- | --- | --- | --- |
| θ | 0° | 180° | 90° | 90° | 90° | 90° |
| φ | 0° | 0° | 0° | 180° | 90° | 270° |

**3. Célállapotok kijelölése.** A Kapu hozzáadása panel tetején jelölőnégyzetekkel adod meg, mely állapotokra hasson a következő kapu. Alapértelmezésben mind ki van jelölve, és a kijelölés csak a soron következő kapura érvényes. Üres kijelölés esetén a program figyelmeztet.

**4. Kapu hozzáadása.** Az **alapkapuk** (X, Y, Z, H, S, T) rögzített mátrixúak. A **forgatókapuk** (Rx, Ry, Rz) a szögmezőt használják, amely −360° és 360° közötti értéket fogad el; érvénytelen vagy üres érték esetén figyelmeztetés jön. Forgatókapu gombjára mutatva a szögmező kiemelést kap.

**5. Végrehajtás.** A kapuk sorszámozva, a célállapotok nevével jelennek meg. Egy kapu az ×, a teljes sorozat a „Sorozat törlése" gombbal törölhető.

| Gomb | Működés |
| ---- | ------- |
| ⟲ Alaphelyzet | A sorozat elejére ugrik |
| ← Vissza / Tovább → | Egy lépés vissza, illetve előre |
| ▶ Lejátszás | Automatikusan végigfut (kb. 850 ms/lépés), „Ⅱ Szünet"-tel megállítható |

Léptetéskor a Bloch-vektor animálva mozog az új helyzetbe, a végrehajtott kapuk kiemelve látszanak.

**6. Leolvasás és nézet.** Az Aktuális értékek panel minden állapotra megadja az α és β amplitúdót (négy tizedesjegy), a P(|0⟩) és P(|1⟩) valószínűséget és a Bloch-koordinátákat (három tizedesjegy). A gömb egérrel forgatható, görgővel nagyítható; a beállított nézet a léptetések során megmarad, és minden gömb megtartja a sajátját.

### 4.1. Ellenőrizhető példák

| Művelet | α | β | Bloch-vektor |
| ------- | - | - | ------------ |
| kiindulás: \|0⟩ | 1.0000 | 0.0000 | (0.000, 0.000, 1.000) |
| H\|0⟩ = \|+⟩ | 0.7071 | 0.7071 | (1.000, 0.000, 0.000) |
| X\|0⟩ = \|1⟩ | 0.0000 | 1.0000 | (0.000, 0.000, −1.000) |
| S\|+⟩ = \|+i⟩ | 0.7071 | 0.7071i | (0.000, 1.000, 0.000) |
| T\|+⟩ | 0.7071 | 0.5000 + 0.5000i | (0.707, 0.707, 0.000) |
| Rz(90°)\|+⟩ | 0.5000 − 0.5000i | 0.5000 + 0.5000i | (0.000, 1.000, 0.000) |
| Rx(360°)\|+⟩ | −0.7071 | −0.7071 | (1.000, 0.000, 0.000) |

Az utolsó sor a globális fázist szemlélteti: mindkét amplitúdó előjele megfordult, a Bloch-vektor viszont nem mozdult. Az S kapu ezzel szemben relatív fázist ad, ott a vektor tényleg elfordul.

---

## 5. Hibaelhárítás

| Jelenség | Ok és megoldás |
| -------- | -------------- |
| „Hiányzik a Plotly könyvtár" panel | A `lib/plotly.min.js` nincs a helyén; pótold a 3.1. pont szerint. |
| A gömb nem látszik, a számok igen | A böngésző nem támogatja vagy letiltotta a WebGL-t. |
| Szokatlan betűtípus | Nincs internet, a Google Fonts nem töltődött be; csak esztétikai. |
| A módosítások nem látszanak | Böngésző-gyorsítótár; frissíts `Ctrl + F5`-tel. |
| A kapu nem kerül be a sorozatba | Nincs célállapot kijelölve, vagy a forgatási szög érvénytelen. |
| Nem lehet állapotot felvenni / törölni | Négy a felső korlát, és legalább egy állapotnak maradnia kell. |
| Hibát jelez a konzol (`F12`) | A szkriptek betöltési sorrendje kötött (7.3.); mindig az első hibát javítsd. |

---

## 6. Matematikai háttér

### 6.1. Állapot, koordináták, valószínűségek

Egy tiszta, normált egyqubites állapot: **|ψ⟩ = α|0⟩ + β|1⟩**, ahol |α|² + |β|² = 1. A program a komplex számokat két valós mezővel ábrázolja (`{ re, im }`), és a `Quantum.state` konstruktor minden állapotot automatikusan normalizál; 10⁻¹⁴-nél kisebb norma esetén hibát jelez.

A kezdőállapot két szögből áll elő:

**|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}·sin(θ/2)|1⟩**

A Bloch-vektor koordinátái és a mérési valószínűségek:

**x = 2·Re(α\*·β),  y = 2·Im(α\*·β),  z = |α|² − |β|²**

**P(|0⟩) = |α|²,  P(|1⟩) = |β|²**

Tiszta állapotra x² + y² + z² = 1, azaz a vektor végpontja a gömb felszínén van. A megjelenítésnél a 10⁻¹⁰-nél kisebb értékeket a program nullának tekinti, így a kerekítési zaj nem látszik.

### 6.2. Kapumátrixok

Minden kapu 2×2-es komplex mátrix, az alkalmazás mátrix-vektor szorzás (|ψ′⟩ = U|ψ⟩). A `Gates.apply` általános szorzást végez, így új kapu hozzáadása csak a mátrix megadását igényli.

A forgatókapuk szögét a program radiánra váltja, majd a fél szöggel dolgozik.

### 6.3. A globális fázis

Egy közös e^{iγ} szorzó nem változtatja meg a fizikai állapotot, a relatív fázis viszont igen. A `Quantum.physicalEqual` a két állapot közti fáziskülönbséget kiegyenlíti az összehasonlítás előtt, majd 10⁻⁹ toleranciával vizsgál. A tesztek nagy része erre épül.

---

## 7. A program felépítése

### 7.1. Projektstruktúra

```
Bloch-g-mb/
├── index.html          # Felület és szkriptbetöltés
├── css/               # style.css, components.css, animations.css
├── js/                # quantum, gates, simulator, bloch-sphere, ui, main
├── lib/plotly.min.js  # Plotly.js v4.1.1 (MIT)
├── tests/             # test.html, test-quantum.js
└── docs/              # documentation.md, bemutato.md, test-checklist.md
```

### 7.2. Modulok és rétegek

| Fájl | Felelősség |
| ---- | ---------- |
| `js/quantum.js` | Komplex aritmetika, állapotok, normalizálás, Bloch-koordináták, valószínűségek, fizikai egyenlőség |
| `js/gates.js` | Kapumátrixok, forgatókapuk előállítása, mátrix-vektor szorzás, kapumagyarázatok |
| `js/simulator.js` | A `Simulator` osztály: állapotok, kapusorozat, léptetés, újraszámítás |
| `js/bloch-sphere.js` | A 3D gömbök felépítése és frissítése, animáció, kameramegőrzés |
| `js/ui.js` | Eseménykezelés, a panelek és értékek frissítése, HTML-escape |
| `js/main.js` | Belépési pont: `DOMContentLoaded` után `UI.init()` |

A függőség mindig a magasabb absztrakciótól az alacsonyabb felé mutat:

```
main.js → ui.js → simulator.js → gates.js → quantum.js
                → bloch-sphere.js → quantum.js
```

Fontos szabály, hogy a `quantum.js` és a `gates.js` **nem tartalmaz DOM-manipulációt**, ezért a matematikai mag a felülettől függetlenül tesztelhető.

### 7.3. Betöltési sorrend

A modulok a globális `window` objektumon keresztül függenek egymástól (nincs `import`/`export`), ezért a sorrend kötött: `plotly.min.js`, `quantum.js`, `gates.js`, `simulator.js`, `bloch-sphere.js`, `ui.js`, `main.js`.

### 7.4. Adatmodell és újraszámítás

A `Simulator` példány mezői: `states` (az állapotok listája `id`, név, szín, θ, φ, `initial` és `current` mezőkkel), `nextStateId`, `circuit` (a kapuk `name`, `angle`, `targetIds`, `targetNames` adatokkal) és `step`.

Az állapotokat a program azonosító szerint kezeli, nem listapozíció alapján. Az azonosítókat a `nextStateId` számláló adja, amely **soha nem használ újra** korábbi értéket: így ha egy állapotot törlünk, majd újat veszünk fel, az új nem „örökli" a törölt állapotra hivatkozó kapukat. Erre külön teszt is van.

A `recompute()` minden állapotot a saját `initial` kezdőállapotából indít, majd végighalad a kapusorozat aktuális lépésig tartó részén, és kapulépésenként az összes hozzárendelt állapotot frissíti. Mivel az aktuális állapot mindig a rögzített kezdőállapotból épül fel újra, a szerkesztés, a kapu törlése és a visszaléptetés is konzisztens eredményt ad, és nem halmozódnak numerikus hibák.

---

## 8. A háromdimenziós megjelenítés

A `BlochSphere.render(states, selectedId, options)` minden állapothoz külön kártyát és Plotly-ábrát jelenít meg; a rács elrendezését a CSS az állapotok száma alapján állítja be.

**Kameraállás megőrzése.** A `react()` hívás a layout újbóli megadásakor visszaállíthatná a kamerát, vagyis a beforgatott nézet minden frissítéskor visszaugorna. A modul ezt kettős védelemmel kerüli el: állapotonként állandó `uirevision` kulcsokkal, és egy saját, `WeakMap`-alapú kamera-gyorsítótárral, amely a `plotly_relayout` eseményre feliratkozva eltárolja a felhasználó nézetét, és minden újrarajzolásnál visszaadja.

**A vektor animációja.** Léptetéskor az `ui.js` az `{ animate: true }` beállítással hív, ilyenkor a modul nem rajzol újra mindent, csak az állapotvektort mozgatja: az átmenet 620 ms, smoothstep simítással (`p²·(3−2p)`), képkockánként egy `Plotly.restyle` hívással. Az egyidejű animációkat jelsorszám hangolja össze, így gyors léptetésnél a korábbi animáció érvénytelenné válik, és nem akad össze kettő; hiba esetén a kód a teljes újrarajzolásra esik vissza. Az `animations.css` tiszteletben tartja a `prefers-reduced-motion` beállítást.

---

## 9. Tesztelés

A `tests/test.html` megnyitásakor a tesztek automatikusan lefutnak, és az eredmény a lapon megjelenik. A `tests/test-quantum.js` saját, kisméretű tesztkeretet használ (`test`, `assert`, `close`, `phys` függvények), ezért nem kell külső tesztfuttató vagy Node.js.

A készlet **20 esetet** tartalmaz két területre bontva:

**Kvantummechanikai helyesség:** a |0⟩ normája 1; H|0⟩ = |+⟩; X|0⟩ = |1⟩ és X|1⟩ = |0⟩; Z|+⟩ = |−⟩; H|+⟩ fizikailag |0⟩; S|+⟩ = |+i⟩; a T kapu megőrzi a normát; Rx(360°) fizikailag azonos a kiindulással; Rz(90°) helyesen forgat az egyenlítőn.

**Szimulátorlogika:** legfeljebb négy állapot; a kapusorozat minden célállapotra lefut; a visszalépés visszaállítja a kezdőállapotot; a kapu csak a kijelölt állapotra hat; külön kapuk különböző célállapotokra alkalmazhatók; a `getSnapshots` figyelembe veszi a célállapotot; kezdőállapot-módosítás után újraszámolás; törölt állapot azonosítóját új állapot nem örökli; egy kapulépés egyszerre frissíti az összes kijelölt állapotot; a különböző célállapotú kapuk közös lépésekben futnak.

A lebegőpontos ábrázolás miatt az összehasonlítások 10⁻⁹ toleranciával dolgoznak, az állapotokat pedig globális fázisig vetjük össze. A felületi viselkedést (elrendezés, animáció, kameramegőrzés) a `docs/test-checklist.md` kézi ellenőrzőlistája fedi.

---

## 10. Korlátok és továbbfejlesztés

A program tiszta, egyqubites állapotokat kezel: nincs többqubites összefonódás, zajmodell és valódi mérési folyamat (a mérés csak valószínűségként jelenik meg, az állapot nem omlik össze).

Ismert hiányosságok és fejlesztési irányok:

- A gömbválasztó sáv a kijelölést váltja, de a megjelenítést nem szűkíti egyetlen gömbre, és nincs saját stílusdefiníciója.
- A kapuk nem rendezhetők át a sorozatban.
- A vektor animációja simított interpoláció, nem a gömbfelszín menti, geometriailag pontos forgatás.
- A kapu mátrixa nem jelenik meg a magyarázat mellett; az állapotok mentése és a gömbre kattintással való beállítás nincs megvalósítva.
- A felületi logikára nincs automatikus teszt.

---

## 11. Munkamegosztás

A projekt kétfős csapatmunkában készült, Git-alapú verziókezeléssel, külön fejlesztői ágakon (`Hunor-dev`, `Adam-dev`); az összefésülés merge commitokkal történt.

| Terület | Felelős |
| ------- | ------- |
| Számítási mag (`quantum.js`, `gates.js`) |Mind a ketten|
| Szimulátorlogika (`simulator.js`) |Hunor|
| 3D megjelenítés (`bloch-sphere.js`) |AI|
| Felhasználói felület (`ui.js`, `index.html`) |Ádám|
| Megjelenés (`css/`) |Ádám|
| Tesztek és dokumentáció |Hunor|

## 12. AI használat

A Bloch-gömb 3D megjelenítéséhez, dokumentációhoz és a css fájlok megírásához részben használatba vettük a gerenatív AI-t 
