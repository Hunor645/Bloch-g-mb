# Bloch-gömb szimulátor – dokumentáció

## 1. A program célja

A program egyetlen qubit tiszta kvantumállapotainak és az azokon végrehajtott egyqubites kapuműveleteknek a szemléltetésére készült. A felhasználó több kezdőállapotot vehet fel, majd ugyanazt a kapusorozatot alkalmazhatja mindegyikre. A Bloch-gömb 3D ábrázolása segít az állapotok geometriai összehasonlításában.

## 2. Elméleti alapok

Egy tiszta, normált egyqubites állapot a számítási bázisban:

\\[
|\\psi\\rangle=\\alpha|0\\rangle+\\beta|1\\rangle,\\qquad
|\\alpha|^2+|\\beta|^2=1.
\\]

A Bloch-gömb koordinátái:

\\[
x=2\\operatorname{Re}(\\alpha^*\\beta),\\quad
y=2\\operatorname{Im}(\\alpha^*\\beta),\\quad
z=|\\alpha|^2-|\\beta|^2.
\\]

A gömb felszínén lévő pontok a tiszta, normált qubitállapotokat reprezentálják. A szögparaméterezés:

\\[
|\\psi\\rangle=\\cos(\\theta/2)|0\\rangle+
e^{i\\varphi}\\sin(\\theta/2)|1\\rangle.
\\]

A program fokban várja a θ polárszöget és a φ azimutszöget. A Bloch-vektor koordinátáit a belső állapotvektorból számolja ki.

## 3. Alkalmazott technológiák

A felület HTML és CSS segítségével készül, a működést natív JavaScript valósítja meg. A komplex számok és a kvantumállapotok kezelése külön modulban található. A 3D megjelenítéshez Plotly.js szükséges, amelyet a projekt `lib/` mappájában kell elhelyezni. A kód hagyományos scriptfájlokat használ, így nem igényel build rendszert vagy csomagkezelőt.

## 4. A program felépítése

- `quantum.js`: komplex számok, normalizálás, szögből állapot, Bloch-koordináták, valószínűségek.
- `gates.js`: kapumátrixok és mátrix-vektor szorzás.
- `simulator.js`: állapotok és közös kapusorozat kezelése, léptetés.
- `bloch-sphere.js`: gömbfelület, tengelyek, vektorok és Plotly-ábra.
- `ui.js`: felhasználói események, panelek és értékek frissítése.
- `main.js`: alkalmazásindítás.

## 5. Felhasználói útmutató

1. A „Paraméterezés” panelen válassz egy előre definiált állapotot, vagy állítsd be θ és φ értékét.
2. Az „Összehasonlítás” panelen adhatsz hozzá további állapotokat. Legfeljebb négy állapot kezelhető.
3. A „Kapu hozzáadása” panelen válassz kaput. Az Rx, Ry és Rz kapuknál a szög is megadható.
4. A kapusorozat minden állapotra közösen érvényes.
5. A „Tovább” és „Vissza” gombokkal lépésenként haladhatsz; a „Lejátszás” automatikusan végrehajtja a hátralévő lépéseket.
6. Az aktuális amplitúdók, valószínűségek és Bloch-koordináták az alsó panelen láthatók.

## 6. Tesztelés

A `tests/test.html` megnyitásával futtathatók a böngészős tesztek. A tesztek ellenőrzik többek között a normálást, a Hadamard- és Pauli-kapuk ismert hatását, az S kaput, a forgatásokat, az állapotlimitet, a közös kapusorozatot és a visszalépést. A kvantumállapotok összehasonlításánál a globális fázis fizikailag irreleváns, ezért a tesztelő ezt figyelembe veszi.

## 7. Korlátok és továbbfejlesztési lehetőségek

A program tiszta, egyqubites állapotokat kezel. Nem tartalmaz többqubites összefonódást, zajmodellt vagy mérési folyamatot. Továbbfejleszthető például kapuk átrendezésével, animált geometriai forgatással, állapotok mentésével és részletesebb matematikai levezetésekkel.
