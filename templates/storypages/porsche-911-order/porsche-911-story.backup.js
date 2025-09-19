const map = L.map("map", {
  zoomControl: true,
  scrollWheelZoom: true,
  minZoom: 2,
  maxZoom: 9,
}).setView([30, -20], 2);

L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "&copy; Esri, HERE, Garmin, FAO, NOAA, USGS, EPA, NPS",
  },
).addTo(map);

map.createPane("country-pane");
map.getPane("country-pane").style.zIndex = 200;
map.createPane("city-pane");
map.getPane("city-pane").style.zIndex = 260;

const COUNTRY_STYLE_OVERRIDES = {
  Germany: { color: "#555e67", weight: 1.6, fillColor: "#d4d7dc", fillOpacity: 0.38 },
  "United States of America": { color: "#3c5d7a", weight: 1.8, fillColor: "#d5e5f3", fillOpacity: 0.38 },
  Netherlands: { color: "#a97b45", weight: 1.6, fillColor: "#f2ddc4", fillOpacity: 0.38 },
};

const defaultCountryStyle = {
  color: "#c8ced5",
  weight: 0.8,
  fillColor: "#f5f7f9",
  fillOpacity: 0.22,
};

const REGION_STYLES = {
  pennsylvania: { fillColor: "rgba(13, 71, 161, 0.35)", color: "#0d47a1", weight: 1.6 },
  georgia: { fillColor: "rgba(214, 120, 37, 0.32)", color: "#c7651b", weight: 1.6 },
  badenwuerttemberg: { fillColor: "rgba(67, 160, 71, 0.35)", color: "#2e7d32", weight: 1.6 },
  noordholland: { fillColor: "rgba(167, 138, 119, 0.35)", color: "#8d6e63", weight: 1.6 },
  bremen: { fillColor: "rgba(96, 125, 139, 0.32)", color: "#455a64", weight: 1.6 },
};

const REGION_INFO = {
  pennsylvania: {
    title: "Commonwealth of Pennsylvania",
    body: "Philadelphia is where the customer confirms the 911 build. Order details originate here before the vehicle returns for handover.",
  },
  georgia: {
    title: "State of Georgia",
    body: "Colonel's Island Terminal in Brunswick is Porsche's import hub. Vehicles are scanned, accessorised, and sent north in enclosed carriers.",
  },
  badenwuerttemberg: {
    title: "Baden-Württemberg, Germany",
    body: "Stuttgart-Zuffenhausen assembles, tests, and seals every 911 before it heads to the North Sea export ports.",
  },
  noordholland: {
    title: "Noord-Holland, Netherlands",
    body: "Amsterdam offers an alternate Ro/Ro departure when Bremerhaven is saturated, helping Porsche hold tight delivery windows.",
  },
  bremen: {
    title: "Free Hanseatic City of Bremen",
    body: "Bremerhaven, part of the state of Bremen, is the preferred export hub. Vehicles depart on Atlantic sailings bound for Brunswick.",
  },
};

const COUNTRY_INFO = {
  Germany: {
    title: "Federal Republic of Germany",
    body: "Home to Porsche AG and the Zuffenhausen production line. German logistics shepherd the car toward North Sea ports.",
  },
  "United States of America": {
    title: "United States of America",
    body: "The vehicle's destination market. Imports arrive in Georgia, clear processing, and move to dealers for final delivery.",
  },
  Netherlands: {
    title: "Kingdom of the Netherlands",
    body: "Amsterdam's Koopman Car Terminal offers schedule resiliency for Atlantic sailings.",
  },
};

const CITY_INFO = {
  Philadelphia: {
    title: "Philadelphia, Pennsylvania",
    body: "Customer signs off on the build here. Delivery planning and final handover arrangements happen with Porsche Cherry Hill nearby.",
  },
  Stuttgart: {
    title: "Stuttgart, Germany",
    body: "Zuffenhausen is Porsche's 911 heart: body, drivetrain, marriage, testing, and sealing before export.",
  },
  Amsterdam: {
    title: "Amsterdam, Netherlands",
    body: "Koopman Car Terminal provides alternate Ro/Ro slots during peak demand.",
  },
  Bremerhaven: {
    title: "Bremerhaven, Germany",
    body: "AutoTerminal Bremerhaven is the primary deep-water gateway for Porsche exports.",
  },
  Brunswick: {
    title: "Brunswick, Georgia",
    body: "Colonel's Island Terminal processes Porsche imports, including U.S.-specific inspection and prep.",
  },
  "Cherry Hill": {
    title: "Cherry Hill, New Jersey",
    body: "Porsche Cherry Hill completes PDI, paperwork, and the ceremonial unveiling for the customer.",
  },
};

const regionInfoPanel = document.getElementById("region-info");
const regionInfoTitle = document.getElementById("region-info-title");
const regionInfoBody = document.getElementById("region-info-body");
const regionInfoClose = document.getElementById("region-info-close");

const storyPanel = document.getElementById("story");
const storyCollapse = document.getElementById("story-collapse");
const storyExpand = document.getElementById("story-expand");

function openInfoPanel(title, body) {
  if (!regionInfoPanel) return;
  regionInfoTitle.textContent = title || "";
  regionInfoBody.textContent = body || "";
  regionInfoPanel.classList.remove("hidden");
}

function hideInfoPanel() {
  if (!regionInfoPanel) return;
  regionInfoPanel.classList.add("hidden");
}

if (regionInfoClose) {
  regionInfoClose.addEventListener("click", (event) => {
    event.stopPropagation();
    hideInfoPanel();
  });
}

regionInfoPanel?.addEventListener("click", (event) => event.stopPropagation());

map.on("click", hideInfoPanel);
document.addEventListener("click", (event) => {
  if (!regionInfoPanel) return;
  if (regionInfoPanel.contains(event.target)) return;
  if (event.target.closest("#story")) return;
  if (event.target.closest("#story-expand")) return;
  hideInfoPanel();
});

function attachStoryToggle() {
  if (storyCollapse) {
    storyCollapse.addEventListener("click", (event) => {
      event.stopPropagation();
      storyPanel.classList.add("collapsed");
      storyCollapse.classList.add("hidden");
      storyExpand?.classList.remove("hidden");
    });
  }
  if (storyExpand) {
    storyExpand.addEventListener("click", (event) => {
      event.stopPropagation();
      storyPanel.classList.remove("collapsed");
      storyCollapse?.classList.remove("hidden");
      storyExpand.classList.add("hidden");
    });
  }
}

const slides = Array.from(document.querySelectorAll(".step"));
const prevButton = document.getElementById("prev-slide");
const nextButton = document.getElementById("next-slide");
const currentStepEl = document.getElementById("current-step");
const totalStepsEl = document.getElementById("total-steps");

if (totalStepsEl) totalStepsEl.textContent = String(slides.length);

let currentIndex = 0;
let useAmsterdam = false;

function refreshSlides() {
  slides.forEach((slide, index) => {
    slide.classList.toggle("hidden", index !== currentIndex);
  });
  if (currentStepEl) currentStepEl.textContent = String(currentIndex + 1);
}

function showSlide(index) {
  if (!slides.length) return;
  const total = slides.length;
  currentIndex = ((index % total) + total) % total;
  refreshSlides();
  syncStoryLayers();
}

function handlePrev() {
  showSlide(currentIndex - 1);
}

function handleNext() {
  showSlide(currentIndex + 1);
}

prevButton?.addEventListener("click", handlePrev);
nextButton?.addEventListener("click", handleNext);

function applyHeadingVariants() {
  const logisticsHeading = document.querySelector("section[data-step='Intra-Europe logistics'] h2");
  const oceanHeading = document.querySelector("section[data-step='Ocean crossing'] h2");
  if (logisticsHeading) logisticsHeading.textContent = useAmsterdam ? "Plant to port – Amsterdam" : "Plant to port – Bremerhaven";
  if (oceanHeading) oceanHeading.textContent = useAmsterdam ? "Across the Atlantic – Amsterdam departure" : "Across the Atlantic";
}

const toggleBremer = document.getElementById("use-bremerhaven");
const toggleAmsterdam = document.getElementById("use-amsterdam");

function updateToggleState() {
  toggleBremer?.classList.toggle("on", !useAmsterdam);
  toggleAmsterdam?.classList.toggle("on", useAmsterdam);
}

toggleBremer?.addEventListener("click", () => {
  if (useAmsterdam) {
    useAmsterdam = false;
    applyHeadingVariants();
    updateToggleState();
    syncStoryLayers();
  }
});

toggleAmsterdam?.addEventListener("click", () => {
  if (!useAmsterdam) {
    useAmsterdam = true;
    applyHeadingVariants();
    updateToggleState();
    syncStoryLayers();
  }
});

const nodesLayer = L.geoJSON(null, {
  pointToLayer: (feature, latlng) => {
    const icon = L.icon({
      iconUrl: "assets/city-marker.svg",
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -24],
    });
    return L.marker(latlng, { icon });
  },
  onEachFeature: (feature, layer) => {
    const props = feature.properties || {};
    const lines = [];
    if (props.name) lines.push(`<strong>${props.name}</strong>`);
    if (props.city || props.country) {
      const parts = [props.city, props.country].filter(Boolean).join(", ");
      lines.push(`<small>${parts}</small>`);
    }
    if (props.step) lines.push(`<em>${props.step}</em>`);
    if (props.notes) lines.push(props.notes);
    if (props.source_url) lines.push(`<a href="${props.source_url}" target="_blank" rel="noopener">Source</a>`);
    const html = lines.join("<br />");
    if (html) layer.bindPopup(html);
  },
}).addTo(map);

const routesLayer = L.geoJSON(null, {
  style: (feature) => {
    const mode = feature.properties?.mode;
    const palette = {
      information: { color: "#577590", dashArray: "6,6", weight: 2 },
      supply: { color: "#588157", dashArray: "4,6", weight: 2 },
      road: { color: "#e36414", weight: 3 },
      rail: { color: "#e9c46a", dashArray: "4,4", weight: 3 },
      sea: { color: "#277da1", weight: 3 },
      "road/rail": { color: "#ca6702", dashArray: "4,6", weight: 3 },
      default: { color: "#6c757d", weight: 2 },
    };
    const style = palette[mode] || palette.default;
    return {
      color: style.color,
      weight: style.weight,
      dashArray: style.dashArray || null,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
    };
  },
  onEachFeature: (feature, layer) => {
    const props = feature.properties || {};
    const lines = [];
    if (props.name) lines.push(`<strong>${props.name}</strong>`);
    if (props.notes) lines.push(props.notes);
    const html = lines.join("<br />");
    if (html) layer.bindPopup(html);
  },
}).addTo(map);

const cityLayer = L.geoJSON(null, {
  pane: "city-pane",
  style: {
    color: "#278ea5",
    weight: 1.2,
    fillColor: "rgba(39, 142, 165, 0.22)",
    fillOpacity: 1,
  },
  onEachFeature: (feature, layer) => {
    const name = feature.properties?.name;
    const info = CITY_INFO[name];
    layer.on("click", (event) => {
      event.originalEvent.stopPropagation();
      openInfoPanel(info?.title || name || "City", info?.body || "");
    });
    if (name) {
      layer.bindTooltip(name, { direction: "center", permanent: false });
    }
  },
}).addTo(map);

let countryLayer = null;
let regionLayer = null;

function normalizeName(value) {
  return (value || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function loadJson(url) {
  return fetch(url).then((resp) => {
    if (!resp.ok) throw new Error(`Failed to load ${url}`);
    return resp.json();
  });
}

async function loadGeopolitics() {
  try {
    const [usa0, deu0, nld0, us1, de1, nl1] = await Promise.all([
      loadJson("data/boundaries/gadm41_USA_0.json"),
      loadJson("data/boundaries/gadm41_DEU_0.json"),
      loadJson("data/boundaries/gadm41_NLD_0.json"),
      loadJson("data/boundaries/us-states.json"),
      loadJson("data/boundaries/germany-states.geo.json"),
      loadJson("data/boundaries/gadm41_NLD_1.json"),
    ]);

    const countrySources = [
      { coll: usa0, match: "united states of america" },
      { coll: deu0, match: "germany" },
      { coll: nld0, match: "netherlands" },
    ];

    const countryFeatures = countrySources
      .map(({ coll, match }) => coll.features.find((f) => normalizeName(f.properties?.NAME_0 || f.properties?.name || f.properties?.ADMIN) === match))
      .filter(Boolean);

    if (countryLayer) map.removeLayer(countryLayer);
    if (countryFeatures.length) {
      countryLayer = L.geoJSON(
        { type: "FeatureCollection", features: countryFeatures },
        {
          pane: "country-pane",
          style: (feature) => {
            const name = feature.properties?.NAME_0 || feature.properties?.name || feature.properties?.ADMIN;
            return Object.assign({}, defaultCountryStyle, COUNTRY_STYLE_OVERRIDES[name] || {});
          },
          onEachFeature: (feature, layer) => {
            layer.on("click", (event) => {
              event.originalEvent.stopPropagation();
              const name = feature.properties?.NAME_0 || feature.properties?.name || feature.properties?.ADMIN;
              const info = COUNTRY_INFO[name];
              openInfoPanel(info?.title || name || "Country", info?.body || "");
            });
          },
        },
      ).addTo(map);
    }

    const regionSpecs = [
      { coll: us1, prop: "name", match: "pennsylvania", key: "pennsylvania" },
      { coll: us1, prop: "name", match: "georgia", key: "georgia" },
      { coll: de1, prop: "name", match: "baden-wurttemberg", key: "badenwuerttemberg" },
      { coll: de1, prop: "name", match: "bremen", key: "bremen" },
      { coll: nl1, prop: "NAME_1", match: "noord-holland", key: "noordholland" },
    ];

    const regionFeatures = regionSpecs
      .map(({ coll, prop, match, key }) => {
        const feature = coll.features.find((f) => normalizeName(f.properties?.[prop]) === match);
        if (!feature) return null;
        const clone = JSON.parse(JSON.stringify(feature));
        clone.properties = Object.assign({}, clone.properties, { __regionKey: key });
        return clone;
      })
      .filter(Boolean);

    if (regionLayer) map.removeLayer(regionLayer);
    if (regionFeatures.length) {
      regionLayer = L.geoJSON(
        { type: "FeatureCollection", features: regionFeatures },
        {
          pane: "country-pane",
          style: (feature) => REGION_STYLES[feature.properties.__regionKey] || REGION_STYLES.default,
          onEachFeature: (feature, layer) => {
            layer.on("click", (event) => {
              event.originalEvent.stopPropagation();
              const key = feature.properties.__regionKey;
              const info = REGION_INFO[key];
              openInfoPanel(info?.title || key || "Region", info?.body || "");
            });
            layer.on("mouseover", () => layer.setStyle(Object.assign({}, REGION_STYLES[feature.properties.__regionKey] || {}, { weight: 2 }))); 
            layer.on("mouseout", () => regionLayer.resetStyle(layer));
          },
        },
      ).addTo(map);
    }
  } catch (error) {
    console.error("Boundary load failed", error);
  }
}

async function loadCities() {
  try {
    const geojson = await loadJson("data/cities.geojson");
    cityLayer.clearLayers();
    cityLayer.addData(geojson);
  } catch (error) {
    console.error("City load failed", error);
  }
}

let allNodes = null;
let allRoutes = null;

async function loadStoryData() {
  try {
    const [nodes, routes] = await Promise.all([
      loadJson("data/nodes_911_delivery.geojson"),
      loadJson("data/routes_911_delivery.geojson"),
    ]);
    allNodes = nodes;
    allRoutes = routes;
    syncStoryLayers();
  } catch (error) {
    console.error("Story data load failed", error);
  }
}

function getStoryConfig() {
  const baseConfigs = {
    Opening: { nodeSteps: ["Order placed", "Order received & scheduled"], routeSteps: [] },
    "Order placed": { nodeSteps: ["Order placed", "Order received & scheduled"], routeSteps: ["Order transmitted"] },
    "Materials sourced": { nodeSteps: ["Materials sourced", "Vehicle produced & QC"], routeSteps: ["Materials sourced"] },
    "Intra-Europe logistics": { nodeSteps: ["Vehicle produced & QC", useAmsterdam ? "Export from Europe (alt)" : "Export from Europe"], routeSteps: [useAmsterdam ? "Intra-Europe logistics (alt)" : "Intra-Europe logistics"] },
    "Ocean crossing": { nodeSteps: [useAmsterdam ? "Export from Europe (alt)" : "Export from Europe", "U.S. port processing"], routeSteps: [useAmsterdam ? "Ocean crossing (alt)" : "Ocean crossing"] },
    "Domestic distribution": { nodeSteps: ["U.S. port processing", "Retail delivery"], routeSteps: ["Domestic distribution"] },
    Closing: { nodeSteps: ["Retail delivery"], routeSteps: [] },
  };

  const currentStep = slides[currentIndex]?.dataset.step;
  const base = baseConfigs[currentStep] || { nodeSteps: [], routeSteps: [] };
  return {
    nodeSteps: new Set(base.nodeSteps),
    routeSteps: new Set(base.routeSteps),
    includeContext: true,
  };
}

function syncStoryLayers() {
  if (!allNodes || !allRoutes) return;
  const config = getStoryConfig();

  const visibleNodes = allNodes.features.filter((feature) => {
    const step = feature.properties?.step;
    const category = feature.properties?.category;
    if (config.nodeSteps.has(step)) return true;
    return config.includeContext && ["buyer", "hq", "plant"].includes(category);
  });

  const visibleRoutes = allRoutes.features.filter((feature) => config.routeSteps.has(feature.properties?.step));

  nodesLayer.clearLayers();
  routesLayer.clearLayers();

  if (visibleRoutes.length) {
    routesLayer.addData({ type: "FeatureCollection", features: visibleRoutes });
  }

  if (visibleNodes.length) {
    nodesLayer.addData({ type: "FeatureCollection", features: visibleNodes });
  }

  const allLayers = [];
  if (routesLayer.getLayers().length) allLayers.push(routesLayer);
  if (nodesLayer.getLayers().length) allLayers.push(nodesLayer);
  if (allLayers.length) {
    const bounds = L.featureGroup(allLayers).getBounds();
    if (bounds.isValid()) {
      map.flyToBounds(bounds.pad(0.3), { duration: 1 });
    }
  }
}

function initialize() {
  attachStoryToggle();
  refreshSlides();
  applyHeadingVariants();
  updateToggleState();
  loadGeopolitics();
  loadCities();
  loadStoryData();
}

initialize();
