# Design Spec : Site CV Pauline Costes

## Context

Pauline Costes est docteure en ethologie/ecologie (MNHN Paris), en transition vers un poste en bureau d'etudes environnementales. Elle a besoin d'un site statique servant de CV en ligne enrichi pour ses candidatures. Le site doit refleter son profil naturaliste tout en restant professionnel.

## Direction artistique : "Naturaliste moderne"

Epure, scientifique mais chaleureux. Evoque un carnet de terrain soigne. Contraste serif/sans-serif pour la hierarchie. Touches botaniques SVG tres subtiles en decoration.

## Palette de couleurs

| Token         | Hex       | Usage                                    |
|---------------|-----------|------------------------------------------|
| --green-900   | #2D4A2D   | Titres, header, nav                      |
| --green-700   | #4A7C59   | Accents, boutons, liens, dates           |
| --green-200   | #C5D5C0   | Backgrounds secondaires, cards borders   |
| --green-50    | #F0F5EE   | Fond sections alternees                  |
| --earth-800   | #3D3229   | Texte principal                          |
| --earth-600   | #6B5B4E   | Texte secondaire (descriptions, sous-titres) |
| --sand-100    | #F7F3EE   | Fond principal alternatif                |
| --white       | #FEFEFE   | Fond principal                           |
| --gold-500    | #B8963E   | Accents ponctuels, hover liens, badges   |

## Typographie

- **Titres** : Playfair Display (Google Fonts), serif
  - h1: 2.5rem / bold / --green-900
  - h2: 1.75rem / bold / --green-900
  - h3: 1.25rem / semibold / --earth-800
- **Corps** : Inter (Google Fonts), sans-serif
  - Body: 1rem (16px) / regular / --earth-800
  - Small: 0.875rem / --earth-600
- **Dates & metadonnees** : Inter, 0.875rem / medium / --green-700, uppercase, letter-spacing 0.05em
- **Liens** : --green-700, hover --gold-500, transition 0.2s ease, underline offset subtil
- **Focus** : outline 2px solid --green-700, offset 2px (accessibilite clavier)

## Structure des pages

### Navigation (header fixe)

- Fond --white, ombre legere au scroll
- Gauche : "Pauline Costes" en Playfair Display
- Droite : Parcours - Projets - Publications - Contact
- "Parcours" et "Contact" sont des ancres sur la landing page (#parcours, #contact)
- "Projets" et "Publications" sont des liens vers les sous-pages (/projets.html, /publications.html)
- Burger menu en dessous de 768px : icone a droite, overlay plein ecran avec liens centres, fermeture au clic sur un lien ou sur un bouton X

### Landing page (scroll vertical)

1. **Hero** : photo (placeholder prevu, asset a fournir par Pauline, format carre ~300px, border-radius 50%) + nom + sous-titre "Ecologue - Docteure en ethologie" + paragraphe bio issu du bloc "Qui suis-je" du CV
2. **Competences cles** : grille de tags/badges pill
3. **Parcours** : timeline verticale (experiences + diplomes, ordre chronologique inverse)
4. **Responsabilites & engagement** : section legere (mentorat, asso, cellule ecoute)
5. **Footer** (id="contact") : email (pauline.costes0@gmail.com), telephone, localisation Montpellier, liens eventuels (LinkedIn, ORCID si fournis)

### Sous-pages

- `/projets.html` : cards avec apercu de chaque projet (doctorat elephants, stage mesanges, etc.). Chaque card s'expand en accordeon pour montrer le detail (pas de sous-page par projet, tout reste sur la meme page)
- `/publications.html` : liste structuree des publications. Contenu exact (titres, journaux, DOI) a fournir par Pauline. Placeholder prevu pour l'implementation initiale

## Composants UI

### Cards
- Background: --white, border: 1px solid --green-200, border-radius: 8px
- Padding: 1.5rem, box-shadow: 0 1px 3px rgba(0,0,0,0.06)
- Hover: shadow renforcee + translate-y(-2px)

### Timeline
- Ligne verticale: 2px solid --green-200
- Points: cercles 12px --green-700
- Point actif (= entree la plus recente, premiere affichee): 16px avec ring --green-200
- Desktop: dates a gauche, contenu a droite. Mobile: colonne unique

### Tags / Badges
- Background: --green-50, border: 1px solid --green-200, border-radius: 20px
- Padding: 0.25rem 0.75rem, font: Inter 0.8rem / --green-900

### Boutons
- Primaire: bg --green-700, texte white, border-radius 6px, hover bg --green-900, transition 0.2s ease
  - Usage : CTA hero ("Voir mes projets"), liens d'action dans le footer
- Secondaire: bg transparent, border --green-700, hover bg --green-50, transition 0.2s ease
  - Usage : liens secondaires dans les cards, telechargement CV PDF

### Separateurs de sections
- Fonds alternes --white / --green-50 / --sand-100, pas de lignes HR

### Elements decoratifs
- SVG botaniques (feuilles, branches) dessines en inline SVG, monochromes --green-200
- Opacite 5-8%, positionnement : coin superieur droit de la section hero, coin inferieur gauche de la section competences, coin superieur gauche du footer
- Maximum 3 elements decoratifs sur toute la page pour rester subtil
- Purement decoratifs (aria-hidden="true"), ne genent pas la lecture

## Responsive

- Mobile first
- Breakpoints: 640px (sm) / 768px (md) / 1024px (lg)
- Max-width: 1080px, centre
- Padding horizontal: 1.5rem (mobile) / 3rem (desktop)
- Espacement sections: 2.5rem (mobile) / 4rem (desktop >= 1024px)
- Nav -> burger en dessous de 768px
- Timeline -> colonne unique en mobile
- Cards -> empilees en mobile, grille 2 cols en desktop

## Stack technique

- HTML / CSS / JS pur (zero framework, zero dependance build)
- Google Fonts (Playfair Display + Inter)
- SVG inline pour les decorations
- Hebergement a definir (compatible GitHub Pages, Netlify, ou tout serveur statique)

## Accessibilite

- Contrastes WCAG AA valides (--green-900 sur --white = 10.5:1, --earth-800 sur --white = 11.2:1)
- --green-700 sur --white = 4.6:1 — OK pour texte >= 0.875rem bold, sinon utiliser --green-900
- Focus visible sur tous les elements interactifs (outline 2px solid --green-700)
- aria-hidden sur les SVG decoratifs
- Landmarks semantiques : header, nav, main, section, footer
- Alt text sur la photo de profil

## Contenu a integrer (depuis le CV)

### Experiences
- Doctorante CNRS/MNHN (11/2021 - 10/2024) : ethologie morpho-fonctionnelle trompe elephants
- Chargee de TP (03/2023 & 10-12/2023) : Universites Versailles & Paris Nanterre
- Assistante terrain (05-07/2019) : suivi mesanges, CNRS Moulis

### Diplomes
- Doctorat Sciences de la Nature (12/2024) : MNHN Paris
- Master Ecologie et Biologie des Populations (12/2021) : Universite de Poitiers
- Licence Ethologie (10/2018) : Universite de Rennes
- CPGE AgroVet (11/2017) : Universite de Montpellier

### Competences cles
- Suivi de populations, observations comportementales, inventaires naturalistes
- Analyse de donnees ecologiques (R, Excel, QGIS)
- Utilisation outils IA
- Organisation et coordination de missions de terrain
- Redaction scientifique (3 publications + 1 vulgarisation)
- Communication et valorisation des resultats
- Francais (natif) et anglais (C1)
- Permis B

### Responsabilites complementaires
- Responsable cellule ecoute MECADEV, MNHN (2022-2024)
- Mentorat Savanturiers, AFPER, mediation scientifique Declics (2022-2023)
- Encadrement stagiaire lamantins Beauval (07/2022)
- Engagement associatif naturalisme (CNER, BIBOP, Vienne Nature, Le Chene) (2018-2021)
