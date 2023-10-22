# Shroomate

**Shroomate** je gobarski pomočnik, ki beleži gobarske dosežke uporabnikov in jih raztrosi v zaintersirano javnost. Seveda le do dovoljene mere, saj je vendar jasno, da so gobarski tereni skrbno varovana skrivnost.
Pomočnik je dostopen na https://shroomate.onrender.com. 

## Osnovno

*Firbcu*, tj. neprijavljenemu uporabniku, so v osnovnem pogledu na zemljevidu predstavljene nabrane gobe (ki so jih nabrali *gobarji* in za katere so le-ti smatrali, da se lahko predstavijo širši javnosti). Klik na oznako na zemljevidu *firbcu* prikaže detajle nabranega, s sliko, datum/časom, vrsto gob, ...

V osnovnem pogledu sta še povezavi na prijavo obstoječega in registracijo novega uporabnika, tj. *gobarja*, morebiti pa tudi časovni filter, ki filtrira prikaz za določeno časovno obdobje (npr. zadnji teden, mesec, lani ob istem času...).

Nov *gobar* se mora najprej registrirati, z vnosom nadimka, poštnega naslova in gesla.

*Gobar* se prijavi, bodisi s poštnim naslovom bodisi z nadimkom, in geslom.

V sistemu je tudi *veliki gobar*, tj. administratorski uporabnik, ki skrbi za onemogočanje uporabnikov v primeru kršitev pogojev uporabe in za druge trenutno še neznane stvari.

## Za gobarje

Tako kot nož in koš, tudi **Shroomate** spremlja gobarja na njegovih podvigih, čakajoč na akcijo v gobarjevi mobilni napravi:

- pred gobarskim pohodom gobar na zemljevidu pregleduje dosežke sogobarjev; s filtri za npr. vrste gob, sezono/datum, ... mu **Shroomate** pomaga pri odločitvi, kam na naslednji pohod

- pri premikanju skozi gobarske terene ima na voljo zemljevid z njegovo lokacijo in najdbe v njegovi bližini, lahko tudi kot pomoč pri navigaciji, v kolikor še ne pozna terenov

- ko se goba najde, gobar najprej izbere **Najdba!**; v modalnem dialogu gobar vnese *vrsto gobe*, kategorijo *vidnosti* (kateri gobarjem bo najdba vidna: *vsem*, *prijateljem*, *samo meni*) in *zaznamek* (občutki, opis dogodivščine, ...), samodejno se zabeležita lokacija in datum-čas, seveda pa lahko doda tudi slike najdbe. Najdba lahko pomeni več gob, ki pa so iste vrste.

- gobar lahko potrdi ali pa predlaga drugačno vrsto gobe pri najdbi kolegov. To lahko naredi v opisu najdbe, ki ni njegova; pri *vrsti gobe* sta gumba *Potrdi* in *Predlagaj drugo* z izbirnikom vrste.

## Nastavitve

Gobar lahko določi:

- **prijatelje**: gobarje, ki lahko vidijo njegove *delno skrivne* najdbe; prikazani so kot seznam z možnostjo izbire večih elementov; izbrani elementi se odstranijo z gumbom **Odstrani**, novi prijatelji pa dodajo z izbiro elementov v seznamu **Vsi gobarji** in gumbom **Dodaj**

- **skrivanje lokacij**: za vsako od vidnosti najdb *vsem* in *prijateljem*, lahko določi skrivanje lokacije:
  - *natančno*: lokacija se ne spremeni pred predstavitvijo najdbe
  - *makrolokacija*: skrije se mikrolokacija, tj. pred predstavitvijo najdbe se lokacijo spremeni tako, da mikrolokaija ni na voljo (npr. psevdonaključni zamik)
  - *regija*: predstavi se le regija, tj. pred predstavitvijo najdbe se lokacijo spremeni tako, da je vidna samo širša regija najdbe (npr. zaokrožanje na centre večjih delov območja)

# LP description

## UI specifications

UI specifications as per [LP instructions](https://teaching.lavbic.net/DevOps/WebDev/backend/LP.html#LP11) can be found in the `docs` dir and include the following views:

- [Registered user](docs/registered.md)
- [Unregistered user](docs/unregistered.md)
- [Log in](docs/login.md)
- [Sign up](docs/signup.md)
- [Settings](docs/settings.md)
- [Sighting](docs/sighting.md)
- [Filter](docs/filter.md)
  
## REST API

REST API is available at https://shroomate.onrender.com/api, with swagger testbed at https://shroomate.onrender.com/api/docs/.

## Notes

- Map is displayed using https://leafletjs.com library
- Map tiles are served from https://www.openstreetmap.org (external data source)
- Mushroom species are imported from https://www.gobe.si/Gobe/GobeIndexSI (external data source)

## Presentation

The [presentation](https://docs.google.com/presentation/d/e/2PACX-1vT07qE-whpL6psH0vZB5EhW-t2tGuDjfIVpu3UjbD02Wp2ViQk3ij4JNzZDGmqCkzrzk-lOyPZUI_M4/pub?start=false&loop=false&slide=id.g25f6af9dd6_0_0) about the project should be available anytime now.
