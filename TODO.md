# Bloch-gömb szimulátor – TODO / Handoff Plan

Utolsó frissítés: 2026. november 9.\
Projekt: BME – Kvantuminformatikai alkalmazások\
Jelenlegi állapot: Az alapvető szimulációs funkciók működnek, a felhasználói felület továbbfejlesztése és tesztelése folyamatban van.

Ez a dokumentum arra szolgál, hogy egy későbbi beszélgetésben pontosan innen lehessen folytatni a fejlesztést.

## 1. A projekt célja

Egy böngészőben futó, interaktív Bloch-gömb szimulátor készítése, amely egy qubit kvantumállapotainak és kapuműveleteinek vizualizálását teszi lehetővé.

Technológiák:

- HTML
- CSS
- JavaScript
- Plotly.js (3D megjelenítés)
- JUnit helyett saját böngészős JavaScript-tesztek

Fő koncepció:

- Maximum 4 különböző kvantumállapot.
- Minden állapot saját Bloch-gömbön jelenik meg.
- A kapusorozat állapotokra alkalmazható.
- Kapunként kiválasztható, mely állapotokra hasson.
- A szimuláció lépésenként és automatikusan is futtatható.
- A felhasználó láthatja a matematikai háttéradatokat.

## 2. Jelenlegi projektstruktúra

```
bloch-sphere-simulator/
├── index.html
├── README.md
├── .gitignore
├── css/
│   ├── style.css
│   ├── components.css
│   └── animations.css
├── js/
│   ├── main.js
│   ├── quantum.js
│   ├── gates.js
│   ├── simulator.js
│   ├── bloch-sphere.js
│   └── ui.js
├── lib/
│   └── plotly.min.js
├── tests/
│   ├── test.html
│   └── test-quantum.js
└── docs/
    └── documentation.md
```

## 3. Hol tartunk most?

### 3.1. Kvantummechanikai számítások

Alapvetően kész

A `quantum.js` kezeli:

- komplex számokat;
- kvantumállapotokat;
- normalizálást;
- Bloch-koordináták számítását;
- mérési valószínűségeket;
- globális fázis figyelmen kívül hagyásával történő állapot-összehasonlítást.

A `gates.js` tartalmazza a következő kapukat:

- X, Y, Z
- H
- S, T
- Rx, Ry, Rz

Korábbi teszteredmény: 13/13 teszt sikeres volt a `gates.js` hibájának javítása után.

### 3.2. Bloch-gömbök

Ellenőrzés alatt

A felhasználó már kipróbálta az alkalmazást:

- A Plotly 3D gömb interaktív.
- A vektorok megjelennek.
- Több állapot is kezelhető.

Korábbi problémák:

- A gömb túl kicsi volt.
- A zoom és a kameraállás frissítéskor visszaállt.
- Több állapot egy közös gömbön jelent meg.

A megoldás iránya:

- Minden állapot külön Bloch-gömböt kap.
- A kameraállás és zoom megőrzése Plotly `uirevision` segítségével.
- A gömbök méretezésének javítása `Plotly.Plots.resize()` használatával.

Hátralévő ellenőrzés: egyetlen állapot esetén is megfelelően középre rendezett és nagy méretű legyen a gömb.

### 3.3. Állapotok szerkesztése

Javítás alatt

A felhasználó jelezte, hogy az állapotok szerkesztése nem működik megfelelően.

Elvárt működés:

1. A ceruza gombbal kiválasztunk egy állapotot.
2. A csúszkák felveszik az adott állapot θ és φ értékeit.
3. A csúszkák módosításával csak a kiválasztott állapot kezdőértéke változik.
4. A megfelelő Bloch-gömb frissül.

A legutóbbi válaszban elkészült egy teljesen javított `ui.js`, amelyet a felhasználó még nem igazolt vissza teszteléssel.

### 3.4. Kapuk célállapotainak kiválasztása

Integráció ellenőrzése szükséges

Új funkció: minden kapu hozzáadásakor ki lehessen választani, hogy mely állapotokra hasson.

Példa:

| Kapu    | Célállapot |
| ------- | ---------- |
| X       | A          |
| H       | B, C       |
| Rz(90°) | A, C       |

A kiválasztás csak az éppen hozzáadott kapura vonatkozik.

Ehhez módosítani kellett:

- `index.html`: `gateTargets` elem hozzáadása;
- `simulator.js`: kapunkénti `targetIds` tárolása;
- `ui.js`: célállapotok kiválasztása és átadása;
- CSS: a választófelület és kapucímkék megjelenítése.

Fontos: a legutóbbi `ui.js` már tartalmazza a célállapot-választás kezelését, de az integrációt még tesztelni kell.

## 4. Hátralévő feladatok – prioritási sorrendben

### P0 – Jelenlegi módosítások befejezése

- Ellenőrizni, hogy az `index.html` tartalmazza a `gateTargets` elemet.
- Ellenőrizni a `simulator.js` módosított `addGate(name, angle, targetIds)` metódusát.
- Ellenőrizni, hogy a `recompute()` csak a megfelelő állapotokra alkalmazza a kapukat.
- Ellenőrizni, hogy a `getSnapshots()` is figyelembe veszi a célállapotokat.
- Ellenőrizni a `bloch-sphere.js` méretezési javításait.
- Böngésző frissítése `Ctrl + F5` kombinációval.
- Konzolhibák ellenőrzése (`F12` → Console).

### P1 – Funkcionális tesztelés

- A korábbi 13 teszt újbóli futtatása.
- Egy állapot hozzáadása.
- Egy állapot szerkesztése.
- Egy állapot törlése.
- Maximum 4 állapot ellenőrzése.
- Ötödik állapot hozzáadásának tiltása.
- Egyetlen Bloch-gömb megfelelő méretezése.
- Több Bloch-gömb megfelelő elrendezése.
- Zoom és kameraállás megőrzése frissítéskor.
- Kapu alkalmazása egyetlen állapotra.
- Kapu alkalmazása több állapotra.
- Üres célállapot-kijelölés kezelése.
- Állapot törlése után a célállapotok helyes kezelése.
- Kapu törlése és kapusorozat törlése.
- Előre- és visszaléptetés.
- Automatikus lejátszás és szüneteltetés.
- Kezdőállapot módosítása után helyes újraszámítás.

### P2 – Felhasználói felület finomítása

- Egyértelműen látszódjon, melyik állapot szerkesztése aktív.
- Legyen egyértelmű, hogy a célállapot-kijelölés csak a következő kapura vonatkozik.
- A kapusorozatban olvashatóan jelenjenek meg a célállapotok.
- Hosszú állapotnevek kezelése.
- Kisebb képernyőméreteken is megfelelő elrendezés.
- Bloch-gömbök méretének és középre rendezésének véglegesítése.

### P3 – Dokumentáció

- `README.md` frissítése.
- Indítási és használati útmutató elkészítése.
- Matematikai háttér dokumentálása.
- Kapumátrixok dokumentálása.
- Programarchitektúra leírása.
- Tesztelési dokumentáció elkészítése.
- Képernyőképek készítése.

### P4 – Beadás előkészítése

- Projekt tesztelése tiszta környezetben.
- Felesleges fájlok eltávolítása.
- Git státusz ellenőrzése.
- Végleges commitok elkészítése.
- Push a GitHub repositoryba.
- Kétfős munkamegosztás dokumentálása.
- Beadási követelmények utolsó ellenőrzése.

## 5. Következő tesztelési forgatókönyv

Ezt érdemes elsőként végrehajtani, amint minden módosítás bekerült.

1. Nyisd meg az `index.html` fájlt.
2. Ellenőrizd az első Bloch-gömb méretét és elhelyezkedését.
3. Nyisd meg a `tests/test.html` fájlt.
4. Ellenőrizd, hogy mind a 13 korábbi teszt sikeres-e.
5. Hozz létre egy második állapotot.
6. Válaszd ki a második állapotot, és módosítsd θ vagy φ értékét.
7. Ellenőrizd, hogy csak ez az állapot változik.
8. Jelöld ki az első állapotot, majd adj hozzá egy X kaput.
9. Jelöld ki a második állapotot, majd adj hozzá egy H kaput.
10. Lépj előre kétszer.
11. Ellenőrizd, hogy az első és második kapu csak a saját célállapotaira hatott.
12. Próbáld ki a visszaléptetést, resetet és automatikus lejátszást.
13. Állítsd át a gömbök kameraállását és zoomját, majd léptess tovább.

## 6. Fontos technikai megjegyzések

- A `ui.js` függ a `Quantum`, `Gates`, `SimulatorClass`, `StatePresets` és `BlochSphere` objektumoktól.
- A JavaScript fájlok betöltési sorrendje fontos.
- A `gateTargets` HTML-elemnek léteznie kell.
- A Plotly könyvtárnak a `lib/plotly.min.js` útvonalon kell lennie.
- Az állapotok azonosítóit (`id`) kell használni, nem a listában elfoglalt pozíciójukat.
- A kameraállás megőrzését a `bloch-sphere.js` kezeli.
- Ha JavaScript-hiba jelentkezik, mindig a konzolban megjelenő első hibát kell először javítani.

## 7. Handoff – innen folytassuk

A következő beszélgetés első feladata:

Ellenőrizzük a következő négy fájl aktuális tartalmát:

1. `js/ui.js`
2. `js/simulator.js`
3. `js/bloch-sphere.js`
4. `index.html`

Ezután futtassuk le a regressziós teszteket, majd próbáljuk ki a két állapottal, eltérő célkapukkal működő szimulációt.

Fontos fejlesztési szabály: amíg a jelenlegi módosítások integrációja és a tesztelés nem sikeres, ne kezdjünk új funkciók fejlesztésébe. Először legyen stabil az alapalkalmazás, utána jöhet a dokumentáció és a végleges beadás.