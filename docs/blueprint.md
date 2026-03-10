# GameNight Blueprint (arkiv)

Dette dokumentet er et tidlig konseptnotat fra før dagens static-first løsning og før de siste rollbackene i repoet.

Det skal ikke leses som gjeldende spesifikasjon. Flere punkter her beskriver ideer som ikke finnes i dagens produkt, blant annet:

- kodebasert innlasting av admin-definerte custom-spill
- reell annonseintegrasjon med breaks/fullscreen ads
- implisitt sterkere offline-løfte enn det service worker-en faktisk gir

Gjeldende produkt og arkitektur er i stedet:

- JSON-drevet spill- og innholdslag i `src/data/*`
- én-enhets-opplevelse uten login, multiplayer eller adminsystem
- valgfri ekstern donasjonsintegrasjon, men ingen innebygd betalingsbackend
- annonseplassholdere enkelte steder i UI, men ingen aktiv ad-tech i repoet

Bruk heller disse dokumentene som source of truth:

- `../README.md`
- `README.md`
- `architecture.md`
- `hosting.md`
- `product.md`

Hvis blueprintet skal gjenbrukes senere, bør det kun brukes som historisk inspirasjon for tone og visuell retning, ikke som funksjonskrav.
