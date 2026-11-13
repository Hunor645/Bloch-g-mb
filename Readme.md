# Bloch-gömb szimulátor

Böngészőben futó, interaktív Bloch-gömb szimulátor egyetlen qubit tiszta kvantumállapotainak és egyqubites kapuműveleteinek szemléltetéséhez.

BME VIK · Kvantuminformatikai alkalmazások

## Mit tud?

- Legfeljebb 4 különböző kvantumállapot kezelése, mindegyik külön Bloch-gömbön.
- Előre definiált állapotok (|0⟩, |1⟩, |+⟩, |−⟩, |+i⟩, |−i⟩) és szabad θ, φ paraméterezés.
- Közös kapusorozat, kapunként kiválasztható célállapotokkal.
- Egyqubites kapuk: X, Y, Z, H, S, T, valamint szöggel paraméterezhető Rx, Ry, Rz.
- Lépésenkénti és automatikus (lejátszás) végrehajtás, vissza- és előreléptetés.
- Amplitúdók, mérési valószínűségek és Bloch-koordináták élő megjelenítése.

## Indítás

A projekt natív HTML, CSS és JavaScript, nincs build lépés vagy csomagkezelő.

1. Győződj meg róla, hogy a `lib/plotly.min.js` fájl a helyén van (a 3D megjelenítéshez szükséges).
2. Nyisd meg az `index.html` fájlt egy modern böngészőben.

A `file://` protokoll is elég, mert a szkriptek lokálisak. Ha a Plotly hiányzik, a felület jelzi, és útmutatást ad a pótlásához.

## Használat

1. **Paraméterezés** – Válassz előre definiált állapotot, vagy állítsd be a θ (polárszög) és φ (azimutszög) értékeket a csúszkákkal. A ceruza gombbal a listában kiválasztott állapot kezdőértékeit szerkeszted.
2. **Összehasonlítás** – Vegyél fel további állapotokat (legfeljebb 4-et). Mindegyik külön gömbön jelenik meg.
3. **Kapu hozzáadása** – Jelöld ki, mely állapotokra hasson a kapu, állítsd be a forgatási szöget (csak Rx, Ry, Rz esetén), majd kattints a kívánt kapura.
4. **Kapusorozat** – A sorozaton a Tovább / Vissza gombokkal lépkedhetsz, a Lejátszás pedig automatikusan végiglépteti a hátralévő kapukat.

## Projektstruktúra

```
├── index.html            # Felület és szkriptbetöltés
├── css/
│   ├── style.css         # Alaplayout és téma
│   ├── components.css    # Komponensstílusok
│   └── animations.css    # (hely a későbbi átmeneteknek)
├── js/
│   ├── quantum.js        # Komplex számok, állapotok, Bloch-koordináták
│   ├── gates.js          # Kapumátrixok és alkalmazásuk
│   ├── simulator.js      # Állapotok és közös kapusorozat kezelése
│   ├── bloch-sphere.js   # Plotly-alapú 3D Bloch-gömbök
│   ├── ui.js             # DOM-megjelenítés és eseménykezelés
│   └── main.js           # Belépési pont
├── lib/
│   └── plotly.min.js     # 3D megjelenítő könyvtár
├── tests/
│   ├── test.html         # Böngészős tesztfuttató
│   └── test-quantum.js   # Egységtesztek
└── docs/
    └── documentation.md  # Részletes dokumentáció
```

## Tesztelés

Nyisd meg a `tests/test.html` fájlt böngészőben. A tesztek ellenőrzik a normálást, a Hadamard-, Pauli-, S- és forgatókapuk ismert hatását, az állapotlimitet, a közös kapusorozatot és a visszalépést. Az állapot-összehasonlítás a globális fázist fizikailag irrelevánsként kezeli.

## Elméleti háttér

Részletes matematikai leírás a [`docs/documentation.md`](docs/documentation.md) fájlban.

## Korlátok

Egyetlen qubit tiszta állapotait kezeli. Nincs többqubites összefonódás, zajmodell vagy mérési folyamat.
