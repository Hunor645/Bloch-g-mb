Bloch-gömb szimulátor – véglegesítési TODO
Projekt: BME – Kvantuminformatikai alkalmazások
Elkészült funkciók
- [x] Egyqubites tiszta állapotok kezelése és normalizálása.
- [x] Bloch-koordináták, komplex amplitúdók és mérési valószínűségek számítása.
- [x] X, Y, Z, H, S, T, Rx, Ry, Rz kapuk.
- [x] Legfeljebb négy különböző állapot kezelése.
- [x] Állapotok kezdőparamétereinek beállítása (θ, φ), valamint előre definiált állapotok kiválasztása.
- [x] Kapunkénti célállapot-kiválasztás.
- [x] Kapusorozat lépésenkénti végrehajtása, visszalépés, visszaállítás és automatikus lejátszás.
- [x] Egy kapulépésben az összes hozzárendelt állapot egyidejű frissítése.
- [x] A kapuk sorrendben futnak; minden kapu kizárólag a saját célállapotaira hat.
- [x] A nem célállapotként kijelölt állapotok az adott kapulépésben változatlanok maradnak.
- [x] Több állapot Bloch-gömbjének egyidejű megjelenítése a bal oldali vizualizációs panelen.
- [x] Kétpaneles elrendezés: bal oldalon a vizualizáció, jobb oldalon a vezérlők.
- [x] Kompaktabb jobb oldali vezérlőpanel: kapcsolódó modulok egymás mellett.
- [x] A standard kapuk (X, Y, Z, H, S, T) és a forgatókapuk (Rx, Ry, Rz) logikai csoportosítása.
- [x] Forgatási szög mező kiemelése a forgatókapuk használatakor.
- [x] Kameraállás és nagyítás megőrzésének támogatása a vizualizáció frissítésekor.
- [x] 20 automatikus teszt a kvantumállapotok, kapuk, kapusorozat és többállapotos célzás ellenőrzésére.
- [x] README és részletes dokumentáció.
- [x] Beadási tesztellenőrző lista.
Legutóbbi módosítás – többállapotos kapuvégrehajtás
- [x] A simulator.js kapunként tárolja a célállapotok azonosítóit.
- [x] A recompute() minden végrehajtott kapulépésnél végigmegy az összes állapoton, és csak az adott kapuhoz rendelt állapotokra alkalmazza a kaput.
- [x] A getSnapshots() ugyanazt a célállapot-logikát követi.
- [x] Az állapotok egy közös kapusorozatban, azonos lépésszám mellett frissülnek.
- [x] A Bloch-vizualizáció több állapotot is képes egyszerre megjeleníteni.
- [x] Két új automatikus teszt ellenőrzi az egyidejű frissítést és a különböző célállapotú kapuk sorrendjét.
Még elvégzendő ellenőrzések
- [x] A teljes alkalmazás megnyitása a célböngészőben, a docs/test-checklist.md összes pontjának végigpróbálása.
- [x] Legalább két, majd három-négy állapot felvétele és ellenőrzése a bal oldali vizualizációban.
- [x] Ugyanahhoz a kapuhoz két vagy több állapot hozzárendelése, majd ellenőrizni, hogy egyetlen lépésben mindegyik kijelölt állapot megváltozik.
- [x] Különböző kapukhoz eltérő célállapotok rendelése, és ellenőrizni a kapuk sorrendjét, valamint azt, hogy a nem célzott állapotok változatlanok maradnak.
- [x] Az előre-, visszalépés, reset és automatikus lejátszás ellenőrzése több állapot esetén is.
- [x] A gömbök méretének, forgatásának és zoomjának ellenőrzése 1366×768 és 1920×1080 felbontáson.
- [x] A jobb oldali kompakt vezérlőpanel ellenőrzése: a kapcsolódó elemek egymás mellett jelenjenek meg, de a csoportok továbbra is egyértelműen elkülönüljenek.
- [ ] Kisebb képernyőn és keskeny böngészőablakban ellenőrizni a reszponzív elrendezést és a görgetést.
- [ ] Képernyőképeket készíteni a működő alkalmazásról és a sikeres teszteredményről.
- [ ] A beadási kiírás alapján véglegesíteni a dokumentációt és a kétfős munkamegosztás leírását.
- [ ] Git státusz ellenőrzése, commit, push és a megfelelő branch/PR véglegesítése.
Megjegyzések
- A 20/20 automatikus teszteredmény a legutóbbi módosított tesztcsomagra vonatkozik; a böngészős, vizuális és interakciós ellenőrzést ez nem helyettesíti.
- A végleges beadás előtt a teljes alkalmazást és a tesztoldalt is futtatni kell a célböngészőben.
- A többállapotos vizualizáció és a kompakt vezérlőpanel böngészős működését külön is ellenőrizni kell.