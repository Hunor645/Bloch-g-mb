# Böngészős ellenőrzőlista

Nyisd meg az `index.html` fájlt asztali böngészőben.

Elrendezés
- [x] A Bloch-gömb a bal oldali panelen nagy méretben jelenik meg.
- [x] Az összes szerkesztő- és vezérlőelem a jobb oldali panelen található.
- [x] A teljes oldal nem görgethető; ha a jobb oldali tartalom magasabb, csak a jobb panel görgethető.
- [x] Keskeny ablakban a panelek egymás alá rendeződnek.

Állapotok és megjelenítés
- [x] Új állapot hozzáadható, és a bal oldali gömb az újonnan kiválasztott állapotot mutatja.
- [x] A jobb oldali listában másik állapotra váltva a megfelelő gömb jelenik meg.
- [x] Minden felvett állapot a saját Bloch-gömbjén jelenik meg.
- [x] Léptetéskor a Bloch-vektor animálva mozog az új helyzetbe.
- [x] A kijelölt fül kiemelve látszik, és a fülre kattintva átváltozik a gömb.
- [x] A fülre kattintás a θ és φ csúszkákat is az új állapotra állítja.
- [x] Az állapot kezdőszögeinek módosításakor a vektor frissül.
- [x] A gömb forgatható és nagyítható.
- [x] Kapu hozzáadása és léptetés után a kameraállás és a zoom nem ugrik vissza.
- [x] Kapu hozzáadásakor és lejátszáskor CSAK a vektor mozog, a gömb mozdulatlan.
- [x] Másik gömbre váltva, majd visszatérve megmarad a korábbi kameraállás.
- [x] A megjelenített állapot törlése után a nézet létező állapotra vált, nem üresedik ki.

Kapuk és lejátszás
- [x] Egy kapu csak a kijelölt célállapotokra hat.
- [x] Rx, Ry és Rz esetén a megadott szög érvényesül.
- [x] A kapusorozat előre és visszafelé léptethető.
- [x] Az automatikus lejátszás elindítható és szüneteltethető.
- [x] Egy kapu törlése és a teljes sorozat törlése is működik.

Végső ellenőrzés
- [x] A böngésző konzoljában nincs piros hiba.
- [x] A `tests/test.html` tesztoldal 20/20 sikeres tesztet jelez.