# Bloch Sphere Simulator -- Részletes implementációs terv

**Projekt:** BME -- Kvantuminformatikai alkalmazások, féléves házi
feladat\
**Feladat:** 2. feladat -- Kvantuminformatikai alapok -- Bloch-gömb
szimulátor\
**Fejlesztők száma:** 2 fő\
**Tervezett technológia:** HTML, CSS, JavaScript, Plotly.js\
**Állapot:** Koncepció és implementációs terv

------------------------------------------------------------------------

## 1. A projekt célja

Egy böngészőben futtatható, interaktív Bloch-gömb szimulátor készítése.
A program célja, hogy egyqubites tiszta kvantumállapotok és kvantumkapuk
működését matematikailag helyesen, vizuálisan is követhető módon mutassa
be.

A szimulátor főbb képességei:

-   Legfeljebb négy különböző qubitállapot egyidejű kezelése.
-   Tetszőleges tiszta kezdőállapot megadása.
-   Kvantumkapuk alkalmazása egy közös kapusorozatban.
-   A kapuk hatásának lépésenkénti és automatikus, animált
    megjelenítése.
-   A qubitállapotok összehasonlítása ugyanazon a Bloch-gömbön.
-   Amplitúdók, valószínűségek és Bloch-koordináták megjelenítése.
-   A kiválasztott kapu matematikai hátterének és hatásának ismertetése.

A cél egy közepes méretű, átgondolt funkcionalitású, igényes egyetemi
projekt létrehozása. A felület sötét alapú, de világosabb paneleket és
jól elkülönített vezérlőelemeket is használ.

## 2. A feladatkiírás követelményei

A PDF-ben szereplő értékelési szempontok alapján a programnak az alábbi
öt követelményt kell teljesítenie:

1.  Többféle kvantumkapu legyen elérhető: alapkapuk, valamint érdekesebb
    egybites kapuk, például forgatási és fáziskapuk.
2.  A kapuk helyesen működjenek.
3.  Legyen lehetőség több kapu egymás utáni alkalmazására.
4.  A program tudjon több állapotot egyszerre megjeleníteni.
5.  Legyen megadható tetszőleges kezdőállapot.

A beadandó része továbbá:

-   az elkészült szimulátor forráskódja;
-   a böngészővel rendelkező Windows-gépen, külön fejlesztőkörnyezet
    telepítése nélkül futtatható szimulátor;
-   legalább háromoldalas dokumentáció.

A dokumentációnak ismertetnie kell a program használatát és a
felhasznált könyvtárakat. A felhasználói élmény értékelésénél a kreatív,
látványos, ugyanakkor könnyen értelmezhető és kezelhető felület a cél.

## 3. Technológiai döntések

  -----------------------------------------------------------------------
  Technológia                         Felhasználás
  ----------------------------------- -----------------------------------
  HTML5                               Az alkalmazás struktúrája

  CSS3                                Megjelenés, elrendezés,
                                      reszponzivitás és animációk

  JavaScript (ES6+)                   Számítások, állapotkezelés és
                                      felhasználói interakciók

  Plotly.js                           Interaktív háromdimenziós
                                      Bloch-gömb

  Git és GitHub                       Verziókezelés és közös fejlesztés
  -----------------------------------------------------------------------

### 3.1. Miért ezt a technológiai stacket választjuk?

A HTML, CSS és JavaScript lehetővé teszi, hogy a szimulátor közvetlenül
egy böngészőben fusson. Nem szükséges Python-környezet,
Node.js-futtatókörnyezet vagy szerveroldali feldolgozás.

A Plotly.js alkalmas háromdimenziós grafikonok és vektorok
megjelenítésére, ezért a Bloch-gömb interaktív ábrázolásához megfelelő
választás.

A projekt nem használ Reactet, Vue-t, Qiskitet vagy más nagyobb
keretrendszert. Az egyqubites számításokat saját JavaScript-modulok
valósítják meg.

**Offline futtatás:** a Plotly.js könyvtárat helyben, a projekt `lib/`
mappájában tároljuk. A cél, hogy a program internetkapcsolat nélkül is
működjön. A megvalósítás során külön ellenőrizni kell, hogy a választott
JavaScript-betöltési mód támogatja-e a közvetlen
`index.html`-megnyitást. Ennek megfelelően hagyományos scriptbetöltést
használunk, vagy szükség esetén más, fájlrendszerből is működő megoldást
választunk.

## 4. Funkcionális specifikáció

  Azonosító   Funkció                                      Prioritás
  ----------- -------------------------------------------- ------------
  F01         Kezdőállapot létrehozása és módosítása       Kötelező
  F02         Legfeljebb négy állapot kezelése             Kötelező
  F03         Interaktív 3D Bloch-gömb                     Kötelező
  F04         Alapvető kvantumkapuk                        Kötelező
  F05         Forgatási és fáziskapuk                      Kötelező
  F06         Közös kapusorozat minden állapothoz          Kötelező
  F07         Lépésenkénti végrehajtás                     Kötelező
  F08         Automatikus, animált futtatás                Kötelező
  F09         Amplitúdók és valószínűségek megjelenítése   Fontos
  F10         Kapuk matematikai magyarázata                Fontos
  F11         Visszalépés és alaphelyzetbe állítás         Fontos
  F12         Több állapot színkódolt összehasonlítása     Kötelező
  F13         Kapusorozat szerkesztése                     Fontos
  F14         Egérrel történő állapotbeállítás             Kiegészítő

A fejlesztés során először a kötelező funkciók működőképességét
biztosítjuk. A kiegészítő funkciók csak akkor kerülnek be, ha a fő
működés már stabil.

## 5. Matematikai modell

A számítási logika a megjelenítéstől függetlenül működik. A program
egyqubites, tiszta kvantumállapotokat kezel.

### 5.1. Qubitállapot reprezentációja

Egy általános qubitállapot:

\[ \|`\psi`{=tex}`\rangle `{=tex}= `\alpha`{=tex}\|0`\rangle `{=tex}+
`\beta`{=tex}\|1`\rangle`{=tex} \]

ahol az amplitúdók komplex számok:

\[ `\alpha `{=tex}= a_r + ia_i,`\qquad `{=tex}`\beta `{=tex}= b_r + ib_i
\]

A normalizálási feltétel:

\[ \|`\alpha`{=tex}\|\^2 + \|`\beta`{=tex}\|\^2 = 1 \]

A JavaScriptben a komplex számokat két valós mezővel reprezentáljuk:

``` javascript
{
    re: 0.7071,
    im: 0
}
```

Egy állapot például:

``` javascript
{
    alpha: { re: 1, im: 0 },
    beta:  { re: 0, im: 0 }
}
```

Ez a (\|0`\rangle`{=tex}) állapotot jelöli.

### 5.2. Bloch-gömb koordináták

Az állapot Bloch-vektorának koordinátái:

\[ x = 2`\operatorname{Re}`{=tex}(`\alpha`{=tex}\^\*`\beta`{=tex}) \]

\[ y = 2`\operatorname{Im}`{=tex}(`\alpha`{=tex}\^\*`\beta`{=tex}) \]

\[ z = \|`\alpha`{=tex}\|\^2 - \|`\beta`{=tex}\|\^2 \]

Tiszta, normalizált állapot esetén:

\[ x\^2 + y\^2 + z\^2 = 1 \]

Ez a feltétel a tesztelés során is fontos invariáns.

### 5.3. Kezdőállapot paraméterezése

A kezdőállapot két szöggel adható meg:

\[ \|`\psi`{=tex}`\rangle `{=tex}=
`\cos`{=tex}`\left`{=tex}(`\frac{\theta}{2}`{=tex}`\right`{=tex})\|0`\rangle`{=tex}+
e\^{i`\varphi`{=tex}}`\sin`{=tex}`\left`{=tex}(`\frac{\theta}{2}`{=tex}`\right`{=tex})\|1`\rangle`{=tex}
\]

-   (`\theta`{=tex}): polárszög, 0--180°.
-   (`\varphi`{=tex}): azimutális szög, 0--360°.

A felületen fokban jelenítjük meg a szögeket, a trigonometrikus
számításokhoz radiánt használunk.

Előre definiált állapotok:

  Állapot                      θ      φ
  --------- -------------------- ------
  (            0`\rangle`{=tex})     0°
  (            1`\rangle`{=tex})   180°
  (           \+`\rangle`{=tex})    90°
  (           \-`\rangle`{=tex})    90°
  (           +i`\rangle`{=tex})    90°
  (           -i`\rangle`{=tex})    90°

A kezdőállapot megadható a szögek beállításával, és lehetőség szerint
közvetlenül a Bloch-gömbön történő pozícióválasztással is.

### 5.4. Kvantumkapuk

Minden kapu egy 2×2-es komplex mátrix. A kapu alkalmazása:

\[ \|`\psi`{=tex}'`\rangle `{=tex}= U\|`\psi`{=tex}`\rangle`{=tex} \]

A program egy általános mátrix-vektor szorzást valósít meg. Így az új
kapuk hozzáadása nem igényel új számítási algoritmust.

**Pauli-kapuk:**

\[ X=
```{=tex}
\begin{pmatrix}0&1\\1&0\end{pmatrix}
```
\]

\[ Y=
```{=tex}
\begin{pmatrix}0&-i\\i&0\end{pmatrix}
```
\]

\[ Z=
```{=tex}
\begin{pmatrix}1&0\\0&-1\end{pmatrix}
```
\]

**Hadamard-kapu:**

\[ H=`\frac{1}{\sqrt{2}}`{=tex}
```{=tex}
\begin{pmatrix}1&1\\1&-1\end{pmatrix}
```
\]

**Fáziskapuk:**

\[ S=
```{=tex}
\begin{pmatrix}1&0\\0&i\end{pmatrix}
```
\]

\[ T=
```{=tex}
\begin{pmatrix}1&0\\0&e^{i\pi/4}\end{pmatrix}
```
\]

**Forgatási kapuk:**

\[ R_x(`\theta`{=tex})=
```{=tex}
\begin{pmatrix}
\cos(\theta/2)&-i\sin(\theta/2)\\
-i\sin(\theta/2)&\cos(\theta/2)
\end{pmatrix}
```
\]

\[ R_y(`\theta`{=tex})=
```{=tex}
\begin{pmatrix}
\cos(\theta/2)&-\sin(\theta/2)\\
\sin(\theta/2)&\cos(\theta/2)
\end{pmatrix}
```
\]

\[ R_z(`\theta`{=tex})=
```{=tex}
\begin{pmatrix}
e^{-i\theta/2}&0\\
0&e^{i\theta/2}
\end{pmatrix}
```
\]

A forgatási kapuk paraméterét a felhasználó fokban adja meg; a
számítások előtt radiánra konvertáljuk.

**Fizikai értelmezés:** a globális fázis nem változtatja meg a
Bloch-gömbön látható fizikai állapotot, a relatív fázis viszont igen. A
vizualizáció és az állapot-összehasonlítás ezt figyelembe veszi.

## 6. Szoftverarchitektúra

A projektet hat JavaScript-modulra bontjuk. A modulok felelősségei
elkülönülnek, de a teljes alkalmazás egyszerű marad.

### 6.1. Tervezett fájlstruktúra

``` text
bloch-sphere-simulator/
│
├── index.html
├── README.md
│
├── css/
│   ├── style.css
│   ├── components.css
│   └── animations.css
│
├── js/
│   ├── main.js
│   ├── quantum.js
│   ├── gates.js
│   ├── bloch-sphere.js
│   ├── simulator.js
│   └── ui.js
│
├── lib/
│   └── plotly.min.js
│
├── assets/
│   └── icons/
│
├── tests/
│   ├── test.html
│   ├── test-quantum.js
│   ├── test-gates.js
│   └── test-simulator.js
│
└── docs/
    ├── documentation.md
    └── screenshots/
```

### 6.2. Modulok felelőssége

  -----------------------------------------------------------------------
  Fájl                                Felelősség
  ----------------------------------- -----------------------------------
  `main.js`                           Az alkalmazás inicializálása,
                                      modulok összekapcsolása

  `quantum.js`                        Komplex számok, állapotok,
                                      matematikai műveletek

  `gates.js`                          Kvantumkapuk mátrixai és definíciói

  `simulator.js`                      Állapotok, közös kapusorozat,
                                      végrehajtás, előzmények

  `bloch-sphere.js`                   Plotly 3D gömb, vektorok és
                                      animáció

  `ui.js`                             Felhasználói események, DOM,
                                      panelek és megjelenített adatok
  -----------------------------------------------------------------------

A CSS-fájlok feladata:

-   `style.css`: általános elrendezés, színek és tipográfia;
-   `components.css`: gombok, panelek, kártyák és beviteli elemek;
-   `animations.css`: felületi átmenetek és animációk.

**Architekturális szabály:** a `quantum.js` és a `gates.js` nem
tartalmazhat HTML- vagy DOM-manipulációt. Ezek a modulok a felhasználói
felülettől függetlenül is működjenek.

## 7. Adatmodell és állapotkezelés

A szimulátor központi állapotobjektumot használ. A következő kód
szemléltető adatmodell:

``` javascript
const simulatorState = {
    states: [
        {
            id: 1,
            name: "State 1",
            color: "#38A5D6",
            initialState: {},
            currentState: {}
        }
    ],

    circuit: [
        {
            gate: "H",
            parameter: null
        },
        {
            gate: "Rx",
            parameter: 90
        }
    ],

    currentStep: 0,
    isPlaying: false
};
```

A végleges adatszerkezetet a fejlesztés elején pontosítjuk.

### 7.1. A közös kapusorozat működése

A felhasználó legfeljebb négy különböző kezdőállapotot hozhat létre.
Mindegyik ugyanazt a közös kapusorozatot járja végig.

Például három állapot és négy kapu esetén az első lépésben mindhárom
állapotra az első kaput alkalmazzuk.

A `currentStep` az egész közös áramkörre vonatkozik.

### 7.2. Előzmények és visszalépés

A visszalépéshez minden végrehajtási lépés után elmentjük az összes
állapot pillanatképét.

A folyamat:

1.  Eltároljuk az összes kezdőállapotot.
2.  Alkalmazzuk az első kaput minden állapotra.
3.  Elmentjük az eredményeket.
4.  Alkalmazzuk a következő kaput.
5.  Újabb pillanatképet készítünk.

Így a visszalépés és az újrajátszás megbízhatóan megoldható.

Ha a felhasználó módosítja a kapusorozatot, az állapotokat az eredeti
kezdőállapotokból újraszámoljuk.

## 8. Felhasználói felület

Az alkalmazás egyetlen főoldalból áll. A felület sötét alapú, világosabb
panelekkel, jól elkülönített vezérlőelemekkel.

### 8.1. Felső navigációs sáv

Tartalma:

-   alkalmazás neve (a végleges név később kerül kiválasztásra);
-   rövid leírás;
-   aktuális szimulációs állapot;
-   alaphelyzetbe állító gomb.

### 8.2. Központi Bloch-gömb

A fő munkaterületen megjelenik:

-   a Bloch-gömb;
-   az X, Y és Z tengely;
-   a (\|0`\rangle`{=tex}) és (\|1`\rangle`{=tex}) pólusok;
-   a (\|+`\rangle`{=tex}) és (\|-`\rangle`{=tex}) jelölések;
-   az egyenlítői kör;
-   az állapotvektorok és végpontjaik;
-   a vektorok koordinátái.

A gömb egérrel forgatható és nagyítható. Minden állapot külön színnel
jelenik meg.

### 8.3. Állapotkezelő panel

Lehetséges műveletek:

-   új állapot hozzáadása;
-   meglévő állapot törlése;
-   állapot elnevezése;
-   szín kiválasztása;
-   előre definiált állapot kiválasztása;
-   θ és φ módosítása.

A maximális állapotszám négy.

### 8.4. Kvantumkapu-panel

A kapukat kategóriák szerint csoportosítjuk:

-   Pauli-kapuk: X, Y, Z;
-   alapkapu: H;
-   fáziskapuk: S, T;
-   forgatási kapuk: Rx, Ry, Rz.

A forgatási kapuk kiválasztásakor megjelenik egy szögbeviteli mező. A
kiválasztott kapu hozzáadható a közös kapusorozathoz.

A kapusorozatban lehetőség van:

-   kapu hozzáadására;
-   kapu törlésére;
-   kapu átrendezésére;
-   paraméter módosítására.

### 8.5. Szimulációvezérlő

A vezérlősáv elemei:

-   első lépés;
-   előző lépés;
-   következő lépés;
-   lejátszás;
-   szünet;
-   újraindítás;
-   animációs sebesség beállítása.

### 8.6. Matematikai információs panel

A kiválasztott állapothoz megjelenítjük:

  Adat      Jelentés
  --------- -----------------------------
  α         Az első komplex amplitúdó
  β         A második komplex amplitúdó
  P(0)      (
  P(1)      (
  θ         Polárszög
  φ         Azimutális szög
  x, y, z   Bloch-koordináták

A kiválasztott kapu mátrixa és rövid magyarázata is megjelenik. Az
alapvető adatok folyamatosan láthatók, a részletes matematikai levezetés
külön, kinyitható panelen kap helyet.

## 9. Animációk és vizualizáció

Kétféle animációt valósítunk meg.

### 9.1. Folyamatos animáció

A teljes kapusorozat elindításakor a Bloch-vektorok folyamatosan
mozognak az egyik pozícióból a másikba.

Forgatási kapuk esetében a megfelelő forgatási pályát követjük, nem
egyszerű egyenes szakaszon interpolálunk a két végpont között.

A Hadamard-kapu esetében is a hozzá tartozó geometriai forgatást
alkalmazzuk, figyelembe véve a globális fázis fizikai irrelevanciáját.

### 9.2. Lépésenkénti animáció

A következő lépés gomb megnyomásakor az aktuális kapu hatása animáltan
jelenik meg.

A köztes pozíciókat a megjelenítéshez számítjuk ki. A matematikai
állapotot nem módosítjuk minden animációs képkockánál: először
kiszámítjuk a kapu előtti és utáni állapotot, majd a vizuális mozgást
jelenítjük meg.

## 10. Tesztelési terv

A matematikai helyesség kritikus, ezért a tesztelést három szinten
végezzük.

### 10.1. Matematikai tesztek

A `quantum.js` és a `gates.js` tesztelése.

  Teszt                     Elvárt eredmény
  ------------------------- ---------------------------------
  (                         0`\rangle`{=tex}) normalizálása
  (                         1`\rangle`{=tex}) normalizálása
  H alkalmazása (           0`\rangle`{=tex})-ra
  X alkalmazása (           0`\rangle`{=tex})-ra
  X alkalmazása (           1`\rangle`{=tex})-re
  Z alkalmazása (           \+`\rangle`{=tex})-ra
  H alkalmazása (           \+`\rangle`{=tex})-ra
  S alkalmazása (           \+`\rangle`{=tex})-ra
  T alkalmazása (           \+`\rangle`{=tex})-ra
  Rx(360°)                  Eredeti fizikai állapot
  Rz(90°)                   Helyes relatív fázis
  Normalizálási invariáns   Minden kapu után 1

A lebegőpontos számábrázolás miatt a tesztekben toleranciát alkalmazunk,
például (10\^{-9}).

A fizikai állapotok összehasonlításánál figyelembe kell venni, hogy két
állapotvektor globális fázisban eltérhet, miközben ugyanazt a fizikai
állapotot reprezentálja.

### 10.2. Szimulátortesztelés

A `simulator.js` tesztelése:

-   egy állapot létrehozása;
-   négy állapot létrehozása;
-   ötödik állapot hozzáadásának megakadályozása;
-   közös kapusorozat végrehajtása;
-   visszalépés és előrelépés;
-   teljes visszaállítás;
-   kapu törlése és átrendezése;
-   forgatási paraméter módosítása.

### 10.3. Integrációs és felületi tesztek

Ellenőrizzük, hogy:

-   minden állapot megjelenik a Bloch-gömbön;
-   a kapuk alkalmazásakor minden vektor megfelelően mozog;
-   a valószínűségek frissülnek;
-   a lépésenkénti végrehajtás helyesen működik;
-   a folyamatos lejátszás megállítható;
-   a kezelőfelület nem enged érvénytelen paramétereket;
-   az alkalmazás közvetlenül megnyitható böngészőből;
-   az alkalmazás internetkapcsolat nélkül is működik.

A projekthez egy egyszerű, saját JavaScript-alapú tesztoldal is
megfelelő lehet.

## 11. Kétfős munkamegosztás

### Fejlesztő A -- Matematikai és szimulációs rész

Felelősségi kör:

-   `quantum.js`;
-   `gates.js`;
-   `simulator.js`;
-   matematikai tesztek;
-   számítási dokumentáció.

Feladata a kvantumállapotok matematikai helyességének és a szimuláció
működésének biztosítása.

### Fejlesztő B -- Megjelenítés és felhasználói élmény

Felelősségi kör:

-   `index.html`;
-   `style.css`;
-   `components.css`;
-   `animations.css`;
-   `bloch-sphere.js`;
-   `ui.js`;
-   felületi tesztek és dokumentáció.

Feladata a vizuális megjelenítés és a felhasználói interakciók
megvalósítása.

### Közös feladatok

-   `main.js` és a modulok összekötése;
-   interfészek egyeztetése;
-   integrációs tesztek;
-   README és végleges dokumentáció;
-   GitHub-repó kezelése.

### 11.1. Git-munkafolyamat

Javasolt branchek:

``` text
main
│
├── feature/quantum-core
├── feature/bloch-visualization
├── feature/ui
└── feature/simulator
```

A `main` branch mindig működő állapotban maradjon. Minden nagyobb
funkció külön branchre kerüljön, majd Pull Requesttel egyesítsük.

A fejlesztés kezdetén közösen rögzítjük az adatstruktúrákat és a
függvényinterfészeket, hogy a két rész később problémamentesen
összeilleszthető legyen.

## 12. Fejlesztési mérföldkövek

### M1 -- Projektalapok és interfészek

-   GitHub-repó rendezése.
-   Fájlstruktúra létrehozása.
-   Plotly.js helyi beszerzése.
-   HTML alapoldal elkészítése.
-   Matematikai adatszerkezetek és modulinterfészek rögzítése.

**Eredmény:** böngészőben megnyitható projektváz és kezdetleges
Bloch-gömb.

### M2 -- Kvantummechanikai számítások

-   Komplex számok kezelése.
-   Állapotok létrehozása.
-   Normalizálás.
-   Bloch-koordináták számítása.
-   Kvantumkapuk megvalósítása.
-   Matematikai tesztek.

**Felelős:** Fejlesztő A.

### M3 -- Bloch-gömb

-   Plotly integráció.
-   Gömb és tengelyek megjelenítése.
-   Állapotvektorok.
-   Több állapot egyidejű megjelenítése.
-   Színkódolás.

**Felelős:** Fejlesztő B.

### M4 -- Kapuk és szimulációvezérlés

-   Kapuválasztó panel.
-   Közös kapusorozat.
-   Lépésenkénti végrehajtás.
-   Visszalépés.
-   Reset.
-   Állapotadatok frissítése.

**Felelős:** párhuzamos fejlesztés, majd közös integráció.

### M5 -- Animációk és oktatási funkciók

-   Folyamatos lejátszás.
-   Szünet és sebességszabályozás.
-   Kapumátrixok megjelenítése.
-   Matematikai magyarázatok.
-   Állapotparaméterek szerkesztése.

**Felelős:** közös fejlesztés.

### M6 -- Tesztelés és finomhangolás

-   Matematikai tesztek.
-   Integrációs tesztek.
-   Hibás bemenetek kezelése.
-   Böngészőkompatibilitás.
-   Felhasználói élmény javítása.

**Eredmény:** stabil, tesztelt alkalmazás.

### M7 -- Dokumentáció és beadás

-   Legalább háromoldalas dokumentáció.
-   Telepítési és futtatási útmutató.
-   Könyvtárak ismertetése.
-   Képernyőképek.
-   Végleges tesztelés.
-   GitHub-repó ellenőrzése.

**Eredmény:** teljes, beadható projekt.

## 13. Kockázatok és kezelésük

  -----------------------------------------------------------------------
  Lehetséges probléma                 Tervezett megoldás
  ----------------------------------- -----------------------------------
  Plotly teljesítménye animáció       Csak a szükséges grafikonadatokat
  közben                              frissítjük

  Több állapot kezelése               Központi állapotkezelés, maximum
                                      négy állapot

  Kapusorozat módosítása              Az állapotokat újraszámoljuk a
                                      kezdőállapotokból

  Új állapot hozzáadása               Az aktuális kapusorozatot az új
                                      állapotra is végrehajtjuk

  Lebegőpontos hibák                  Toleranciás összehasonlítás és
                                      normalizálási ellenőrzés

  Böngészőből való futtatás           Helyi könyvtárak és szerverfüggőség
                                      nélküli betöltés

  Animáció közbeni felhasználói       A szimulációvezérlés megfelelő
  műveletek                           zárolása
  -----------------------------------------------------------------------

## 14. A projekt elfogadási feltételei

A projekt akkor tekinthető késznek, ha az alábbi feltételek teljesülnek:

-   [ ] Legfeljebb négy qubitállapot kezelhető.
-   [ ] Tetszőleges tiszta kezdőállapot megadható.
-   [ ] Az előre definiált állapotok működnek.
-   [ ] Az X, Y, Z, H, S, T, Rx, Ry és Rz kapuk elérhetők.
-   [ ] A kapuk matematikailag helyesen működnek.
-   [ ] Ugyanaz a kapusorozat minden állapotra alkalmazható.
-   [ ] A kapusorozat szerkeszthető.
-   [ ] A lépésenkénti végrehajtás működik.
-   [ ] Az automatikus animáció működik.
-   [ ] A Bloch-gömb egyszerre mutatja az összes állapotot.
-   [ ] Az amplitúdók és valószínűségek helyesen jelennek meg.
-   [ ] A matematikai magyarázatok működnek.
-   [ ] A program internetkapcsolat nélkül, közvetlenül böngészőből
    futtatható.
-   [ ] Elkészült a legalább háromoldalas dokumentáció.

## 15. Dokumentáció felépítése

A végleges dokumentáció célzott terjedelme körülbelül 5--7 oldal.

Javasolt fejezetek:

1.  **Bevezetés**
    -   A projekt célja.
    -   A Bloch-gömb rövid ismertetése.
    -   A szimulátor képességei.
2.  **Matematikai háttér**
    -   Qubitállapotok.
    -   Komplex amplitúdók.
    -   Bloch-gömb koordinátái.
    -   Kvantumkapuk és mátrixaik.
3.  **Technológiai háttér**
    -   HTML, CSS és JavaScript.
    -   Plotly.js.
    -   Saját fejlesztésű modulok.
4.  **A program működése**
    -   Kezdőállapot beállítása.
    -   Kapuk kiválasztása.
    -   Kapusorozatok végrehajtása.
    -   Több állapot összehasonlítása.
    -   Animációk.
5.  **Felhasználói útmutató**
    -   A kezelőfelület ismertetése.
    -   Példák a használatra.
6.  **Tesztelés**
    -   Alkalmazott tesztesetek.
    -   Matematikai helyesség.
    -   Tesztelési eredmények.
7.  **Összefoglalás**

A dokumentációba a működő programról készített saját képernyőképeket is
beillesztjük.

## 16. Első fejlesztési lépés -- M1

A fejlesztés első szakaszában az alábbi feladatokat végezzük el:

1.  Az üres GitHub-repó ellenőrzése.
2.  A végleges fájlstruktúra létrehozása.
3.  A Plotly.js helyi beszerzése.
4.  Az `index.html` és az alap CSS elkészítése.
5.  A JavaScript-modulok létrehozása.
6.  A két fejlesztő közötti interfészek rögzítése.

**Az első mérföldkő eredménye:** egy böngészőben megnyitható, rendezett
projektváz, amelyen már látható egy kezdetleges Bloch-gömb, de még nem
szükséges működő kvantumkapukat tartalmaznia.

A matematikai magot és a Bloch-gömb alapmegjelenítését ezután
párhuzamosan fejlesztjük, majd fokozatosan összekapcsoljuk őket.

------------------------------------------------------------------------

## Megjegyzések a fejlesztéshez

-   A matematikai számításokat mindig a vizualizációtól függetlenül
    valósítsuk meg.
-   A Bloch-gömbön megjelenő adatok mindig a szimulátor aktuális
    matematikai állapotából származzanak.
-   A kapusorozat módosítása után minden állapotot az eredeti
    kezdőállapotból számoljunk újra.
-   A globális fázis fizikai irrelevanciáját vegyük figyelembe az
    állapotok összehasonlításakor.
-   A fejlesztés során minden mérföldkő után ellenőrizzük, hogy az
    alkalmazás továbbra is futtatható-e közvetlenül böngészőből.
-   A projekt célja nem a szükségtelenül összetett architektúra, hanem
    egy jól strukturált, megbízható és látványos egyetemi szimulátor.
