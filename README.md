# Porsche 911 Order-to-Home Story Map

## Overview
This project is an interactive story map that follows a Porsche 911 from the moment a customer in Philadelphia confirms the build through production in Stuttgart, export logistics in Europe, Atlantic shipping, and the final handover in the Delaware Valley. The narrative blends slide-based storytelling, an interactive Leaflet map, and supporting media to highlight how Porsche choreographs each handoff so the first drive feels effortless.

- **Author:** Yu Qiushi (Ryan)
- **Target audience:** Car fans who enjoy understanding what happens behind the scenes of a Porsche delivery.

## Experience Goals
- Introduce the full order-to-delivery journey with concise copy and visuals that mirror the timeline described in the story panel.
- Allow viewers to toggle between Bremerhaven and Amsterdam export paths while the map animates to relevant geographies.
- Provide contextual media (photos and a delivery video) alongside each narrative step to keep the focus on people, places, and logistics.

## Data & References
### Core nodes (order, HQ/plant, dealer)
- https://www.porsche.com/international/locations-and-contact/porsche-ag/
- https://newsroom.porsche.com/en/company/locations.html
- https://www.porschecherryhill.com/contact-us/

### Export ports (EU)
- https://www.blg-logistics.com/en/autoterminal-bremerhaven
- https://myport.portofamsterdam.com/en/portle/company/koopman-car-terminal-bv-kct

### U.S. entry port (Brunswick, GA)
- https://gaports.com/facilities/port-of-brunswick/colonels-island-terminal/
- https://gaports.com/press-releases/brunswick-now-the-nations-top-port-for-autos-heavy-equipment/
- https://apnews.com/article/georgia-port-brunswick-baltimore-automobiles-top-2c4fe16a42d647a188942c38d3c91cf5

### Materials origins (illustrative sourcing examples)
- https://www.alcantara.com/contacts/
- https://www.bridgeofweirleather.com/contact
- https://www.toraytac.com/contact/locations
- https://www.carbonceramicbrakes.com/en/Contacts

### Basemap options (light, low-ink)
- https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}
- https://basemaps.cartocdn.com/gl/positron-gl-style/style.json
- https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png

### Media
- Delivery highlight video: https://youtu.be/cCBYdXxDDY8

## Development Notes
- Built with the template in 	emplates/storypages/porsche-911-order/ using vanilla HTML, CSS, and JavaScript.
- Mapping powered by Leaflet 1.9 with custom panes for boundaries, nodes, and routes.
- Disclaimer modal, story-panel collapse state, and slide media are handled in porsche-911-story.js.

### Linting & QA
Run the following commands from the project root to lint the code we touched:

`ash
npx eslint templates/storypages/porsche-911-order/porsche-911-story.js
npx stylelint templates/storypages/porsche-911-order/porsche-911-story.css
`

Manual checks performed for keyboard focus, screen-reader labels on dialogs, and responsive layout across mobile and desktop breakpoints.

## Deployment Checklist
- [x] Pushed latest code to main
- [ ] Enabled GitHub Pages and verified deployment (configure in repository settings)
- [ ] Submitted PR to course organization repo with author name and audience in the title/description
