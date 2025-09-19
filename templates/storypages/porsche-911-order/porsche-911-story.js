(function() {
  var map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
    minZoom: 2,
    maxZoom: 9
  }).setView([30, -20], 2);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "&copy; Esri, HERE, Garmin, FAO, NOAA, USGS, EPA, NPS"
    }
  ).addTo(map);

  map.createPane("country-pane");
  map.getPane("country-pane").style.zIndex = 200;
  map.getPane("country-pane").style.pointerEvents = "auto";
  map.createPane("city-pane");
  map.getPane("city-pane").style.zIndex = 260;
  map.getPane("city-pane").style.pointerEvents = "auto";

  var COUNTRY_STYLE_OVERRIDES = {
    Germany: { color: "#3e4d63", weight: 1.3, fillColor: "rgba(94, 112, 134, 0.28)", fillOpacity: 0.28 },
    Netherlands: { color: "#7a5930", weight: 1.3, fillColor: "rgba(200, 165, 118, 0.3)", fillOpacity: 0.3 },
    "United States": { color: "#2f5776", weight: 1.4, fillColor: "rgba(120, 146, 174, 0.32)", fillOpacity: 0.32 },
    "United States of America": { color: "#2f5776", weight: 1.4, fillColor: "rgba(120, 146, 174, 0.32)", fillOpacity: 0.32 },
    UnitedStates: { color: "#2f5776", weight: 1.4, fillColor: "rgba(120, 146, 174, 0.32)", fillOpacity: 0.32 }
  };

  var defaultCountryStyle = {
    color: "#5a6674",
    weight: 1.1,
    fillColor: "rgba(92, 109, 128, 0.22)",
    fillOpacity: 0.22
  };

  var REGION_STYLES = {
    pennsylvania: { color: "#0d47a1", fillColor: "rgba(13, 71, 161, 0.38)", weight: 1.9, fillOpacity: 1 },
    georgia: { color: "#c7651b", fillColor: "rgba(214, 120, 37, 0.34)", weight: 1.9, fillOpacity: 1 },
    badenwuerttemberg: { color: "#2e7d32", fillColor: "rgba(67, 160, 71, 0.36)", weight: 1.9, fillOpacity: 1 },
    noordholland: { color: "#8d6e63", fillColor: "rgba(167, 138, 119, 0.36)", weight: 1.9, fillOpacity: 1 },
    bremen: { color: "#455a64", fillColor: "rgba(96, 125, 139, 0.34)", weight: 1.9, fillOpacity: 1 }
  };

  var REGION_INFO = {
    pennsylvania: {
      title: "Commonwealth of Pennsylvania",
      bullets: [
        "Customer confirms the 911 build in Philadelphia",
        "Order details feed Porsche's global production scheduler",
        "Vehicle returns for handover at Porsche Cherry Hill"
      ]
    },
    georgia: {
      title: "State of Georgia",
      bullets: [
        "Colonel's Island Terminal receives Atlantic Ro/Ro vessels",
        "Imports clear scanning, homologation, and U.S. prep",
        "Enclosed carriers leave south Georgia timed for Northeast delivery"
      ]
    },
    badenwuerttemberg: {
      title: "Baden-Wurttemberg, Germany",
      bullets: [
        "Stuttgart-Zuffenhausen assembles and tests every 911",
        "Regional suppliers feed interiors, brakes, and trims just in time",
        "Finished cars convoy north to export hubs"
      ]
    },
    noordholland: {
      title: "Noord-Holland, Netherlands",
      bullets: [
        "Amsterdam's Koopman Car Terminal backs up Bremerhaven",
        "Keeps Atlantic sailings on schedule when slots tighten",
        "Feeds the same Brunswick-bound routes as the primary export gate"
      ]
    },
    bremen: {
      title: "Free Hanseatic City of Bremen",
      bullets: [
        "Bremerhaven stages finished 911s in secure compounds",
        "Primary deep-water gateway for Porsche exports",
        "Ro/Ro departures sync with arrival windows in Brunswick"
      ]
    }
  };

  var COUNTRY_INFO = {
    Germany: {
      title: "Federal Republic of Germany",
      bullets: [
        "Porsche AG HQ and the 911 line sit in Stuttgart",
        "National logistics move sealed cars toward the North Sea",
        "Export paperwork closes before Atlantic sailings"
      ]
    },
    Netherlands: {
      title: "Kingdom of the Netherlands",
      bullets: [
        "Amsterdam provides alternate Ro/Ro departures",
        "Maintains schedule resilience when Bremerhaven is full",
        "Supports the same Brunswick-bound Atlantic routes"
      ]
    },
    "United States": {
      title: "United States of America",
      bullets: [
        "Atlantic arrivals funnel through Georgia",
        "Port teams complete U.S. homologation and software updates",
        "Dealer network delivers the first-drive experience"
      ]
    },
    "United States of America": {
      title: "United States of America",
      bullets: [
        "Atlantic arrivals funnel through Georgia",
        "Port teams complete U.S. homologation and software updates",
        "Dealer network delivers the first-drive experience"
      ]
    },
    UnitedStates: {
      title: "United States of America",
      bullets: [
        "Atlantic arrivals funnel through Georgia",
        "Port teams complete U.S. homologation and software updates",
        "Dealer network delivers the first-drive experience"
      ]
    }
  };

  var CITY_INFO = {
    Philadelphia: {
      title: "Philadelphia, Pennsylvania",
      bullets: [
        "Customer signs the 911 build sheet",
        "Order and financing sync with Porsche production",
        "Vehicle returns here for the ceremonial handover"
      ]
    },
    Stuttgart: {
      title: "Stuttgart, Germany",
      bullets: [
        "Zuffenhausen marries drivetrain and chassis",
        "Road tests run on local loops to clear QA",
        "Sealed cars move into export staging"
      ]
    },
    Amsterdam: {
      title: "Amsterdam, Netherlands",
      bullets: [
        "Koopman Car Terminal handles alternate departures",
        "Protects delivery timelines when Bremerhaven is saturated",
        "Shares Atlantic sailings to Brunswick, Georgia"
      ]
    },
    Bremerhaven: {
      title: "Bremerhaven, Germany",
      bullets: [
        "AutoTerminal Bremerhaven is the preferred export hub",
        "Finished 911s wait in managed compounds",
        "Ro/Ro departures follow fixed Atlantic rotations"
      ]
    },
    Brunswick: {
      title: "Brunswick, Georgia",
      bullets: [
        "Colonel's Island handles arrival scanning and prep",
        "Port teams install U.S.-market accessories",
        "Cars release to enclosed carriers bound for dealers"
      ]
    },
    "Cherry Hill": {
      title: "Cherry Hill, New Jersey",
      bullets: [
        "Dealer completes pre-delivery inspection and paperwork",
        "Customer sees their 911 uncovered for the first drive",
        "Supports the ownership relationship in the Philadelphia metro"
      ]
    }
  };

  function formatInfo(info) {
    if (!info) return "";
    if (info.bullets && info.bullets.length) {
      var list = info.bullets.map(function(line) {
        return '<li>' + line + '</li>';
      }).join('');
      return '<ul>' + list + '</ul>';
    }
    return info.body || "";
  }

  function normalizeName(value) {
    return (value || "")
      .toString()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function getCountryName(props) {
    if (!props) return "";
    return props.NAME_0 || props.COUNTRY || props.name || props.ADMIN || "";
  }

  var regionInfoPanel = document.getElementById("region-info");
  var regionInfoTitle = document.getElementById("region-info-title");
  var regionInfoBody = document.getElementById("region-info-body");
  var regionInfoClose = document.getElementById("region-info-close");

  function openInfoPanel(title, bodyHtml) {
    if (!regionInfoPanel) return;
    regionInfoTitle.textContent = title || "";
    regionInfoBody.innerHTML = bodyHtml || "";
    regionInfoPanel.classList.remove("hidden");
  }

  function hideInfoPanel() {
    if (!regionInfoPanel) return;
    regionInfoPanel.classList.add("hidden");
  }

  function stopLeafletClick(event) {
    if (event && event.originalEvent && event.originalEvent.stopPropagation) {
      event.originalEvent.stopPropagation();
    }
  }

  if (regionInfoClose) {
    regionInfoClose.addEventListener("click", function(evt) {
      evt.stopPropagation();
      hideInfoPanel();
    });
  }

  if (regionInfoPanel) {
    regionInfoPanel.addEventListener("click", function(evt) {
      evt.stopPropagation();
    });
  }

  map.on("click", hideInfoPanel);
  document.addEventListener("click", function(evt) {
    if (!regionInfoPanel || regionInfoPanel.classList.contains("hidden")) return;
    if (regionInfoPanel.contains(evt.target)) return;
    if (evt.target.closest && evt.target.closest("#story")) return;
    if (evt.target.closest && evt.target.closest("#story-expand")) return;
    hideInfoPanel();
  });

  var storyPanel = document.getElementById("story");
  var storyCollapse = document.getElementById("story-collapse");
  var storyExpand = document.getElementById("story-expand");

  if (storyCollapse) {
    storyCollapse.addEventListener("click", function(evt) {
      evt.stopPropagation();
      storyPanel.classList.add("collapsed");
      storyCollapse.classList.add("hidden");
      if (storyExpand) storyExpand.classList.remove("hidden");
    });
  }

  if (storyExpand) {
    storyExpand.addEventListener("click", function(evt) {
      evt.stopPropagation();
      storyPanel.classList.remove("collapsed");
      if (storyCollapse) storyCollapse.classList.remove("hidden");
      storyExpand.classList.add("hidden");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var prevButton = document.getElementById("prev-slide");
  var nextButton = document.getElementById("next-slide");
  var currentStepEl = document.getElementById("current-step");
  var totalStepsEl = document.getElementById("total-steps");

  if (totalStepsEl) totalStepsEl.textContent = String(slides.length);

  var currentIndex = 0;
  var useAmsterdam = false;

  function refreshSlides() {
    slides.forEach(function(slide, index) {
      slide.classList.toggle("hidden", index !== currentIndex);
    });
    if (currentStepEl) currentStepEl.textContent = String(currentIndex + 1);
  }

  function showSlide(index) {
    if (!slides.length) return;
    var total = slides.length;
    currentIndex = ((index % total) + total) % total;
    refreshSlides();
    syncStoryLayers();
  }

  if (prevButton) {
    prevButton.addEventListener("click", function() {
      showSlide(currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function() {
      showSlide(currentIndex + 1);
    });
  }

  document.addEventListener("keydown", function(evt) {
    if (["INPUT", "TEXTAREA", "SELECT"].indexOf(evt.target.tagName) !== -1) return;
    if (evt.key === "ArrowRight") {
      evt.preventDefault();
      showSlide(currentIndex + 1);
    }
    if (evt.key === "ArrowLeft") {
      evt.preventDefault();
      showSlide(currentIndex - 1);
    }
  });

  function updateHeadings() {
    var logisticsHeading = document.querySelector("section[data-step='Intra-Europe logistics'] h2");
    var oceanHeading = document.querySelector("section[data-step='Ocean crossing'] h2");
    if (logisticsHeading) logisticsHeading.textContent = useAmsterdam ? "Plant to port – Amsterdam" : "Plant to port – Bremerhaven";
    if (oceanHeading) oceanHeading.textContent = useAmsterdam ? "Across the Atlantic – Amsterdam departure" : "Across the Atlantic";
  }

  function updateRouteToggle() {
    if (toggleBremer) toggleBremer.classList.toggle("on", !useAmsterdam);
    if (toggleAmsterdam) toggleAmsterdam.classList.toggle("on", useAmsterdam);
  }

  var toggleBremer = document.getElementById("use-bremerhaven");
  var toggleAmsterdam = document.getElementById("use-amsterdam");

  if (toggleBremer) {
    toggleBremer.addEventListener("click", function() {
      if (!useAmsterdam) return;
      useAmsterdam = false;
      updateHeadings();
      updateRouteToggle();
      syncStoryLayers();
    });
  }

  if (toggleAmsterdam) {
    toggleAmsterdam.addEventListener("click", function() {
      if (useAmsterdam) return;
      useAmsterdam = true;
      updateHeadings();
      updateRouteToggle();
      syncStoryLayers();
    });
  }

  var nodeIcon = L.icon({
    iconUrl: "assets/city-marker.svg",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -24]
  });

  var nodesLayer = L.geoJSON(null, {
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, { icon: nodeIcon });
    },
    onEachFeature: function(feature, layer) {
      var props = feature.properties || {};
      var lines = [];
      if (props.name) lines.push('<strong>' + props.name + '</strong>');
      if (props.city || props.country) {
        var parts = [];
        if (props.city) parts.push(props.city);
        if (props.country) parts.push(props.country);
        if (parts.length) lines.push('<small>' + parts.join(', ') + '</small>');
      }
      if (props.step) lines.push('<em>' + props.step + '</em>');
      if (props.notes) lines.push(props.notes);
      if (props.source_url) lines.push('<a href="' + props.source_url + '" target="_blank" rel="noopener">Source</a>');
      var html = lines.join('<br />');
      if (html) layer.bindPopup(html);
    }
  }).addTo(map);

  var ROUTE_STYLES = {
    information: { color: "#577590", dashArray: "6,6", weight: 2 },
    supply: { color: "#588157", dashArray: "4,6", weight: 2 },
    road: { color: "#e36414", weight: 3 },
    rail: { color: "#e9c46a", dashArray: "4,4", weight: 3 },
    sea: { color: "#277da1", weight: 3 },
    "road/rail": { color: "#ca6702", dashArray: "4,6", weight: 3 },
    default: { color: "#6c757d", weight: 2 }
  };

  var routesLayer = L.geoJSON(null, {
    style: function(feature) {
      var key = feature.properties && feature.properties.mode;
      return ROUTE_STYLES[key] || ROUTE_STYLES.default;
    },
    onEachFeature: function(feature, layer) {
      var props = feature.properties || {};
      var lines = [];
      if (props.name) lines.push('<strong>' + props.name + '</strong>');
      if (props.notes) lines.push(props.notes);
      var html = lines.join('<br />');
      if (html) layer.bindPopup(html);
    }
  }).addTo(map);

  var cityLayer = L.geoJSON(null, {
    pane: "city-pane",
    style: {
      color: "#278ea5",
      weight: 1.25,
      fillColor: "rgba(39, 142, 165, 0.22)",
      fillOpacity: 1
    },
    onEachFeature: function(feature, layer) {
      var name = feature.properties && feature.properties.name;
      var info = CITY_INFO[name];
      layer.on("click", function(evt) {
        stopLeafletClick(evt);
        openInfoPanel(info ? info.title : (name || "City"), formatInfo(info));
      });
      if (name) layer.bindTooltip(name, { direction: "center", permanent: false });
    }
  }).addTo(map);

  var countryLayer = null;
  var regionLayer = null;
  var allNodes = null;
  var allRoutes = null;

  function loadJson(url) {
    return fetch(url).then(function(resp) {
      if (!resp.ok) throw new Error('Failed to load ' + url);
      return resp.json();
    });
  }

  function loadGeopolitics() {
    Promise.all([
      loadJson("data/boundaries/gadm41_USA_0.json"),
      loadJson("data/boundaries/gadm41_DEU_0.json"),
      loadJson("data/boundaries/gadm41_NLD_0.json"),
      loadJson("data/boundaries/us-states.json"),
      loadJson("data/boundaries/germany-states.geo.json"),
      loadJson("data/boundaries/gadm41_NLD_1.json")
    ]).then(function(results) {
      var usa0 = results[0];
      var deu0 = results[1];
      var nld0 = results[2];
      var usStates = results[3];
      var deStates = results[4];
      var nlProvinces = results[5];

      var countryMatches = [
        { coll: usa0, names: ["united states", "united states of america", "unitedstates"] },
        { coll: deu0, names: ["germany"] },
        { coll: nld0, names: ["netherlands"] }
      ];

      var countryFeatures = [];
      countryMatches.forEach(function(spec) {
        if (!spec.coll || !spec.coll.features) return;
        var match = spec.coll.features.find(function(feature) {
          var name = getCountryName(feature.properties);
          var normalized = normalizeName(name);
          return spec.names.indexOf(normalized) !== -1;
        });
        if (match) countryFeatures.push(match);
      });

      if (countryLayer) map.removeLayer(countryLayer);
      if (countryFeatures.length) {
        countryLayer = L.geoJSON({ type: "FeatureCollection", features: countryFeatures }, {
          pane: "country-pane",
          style: function(feature) {
            var name = getCountryName(feature.properties);
            var style = COUNTRY_STYLE_OVERRIDES[name] || COUNTRY_STYLE_OVERRIDES[normalizeName(name)] || defaultCountryStyle;
            return Object.assign({}, defaultCountryStyle, style);
          },
          onEachFeature: function(feature, layer) {
            layer.on("click", function(evt) {
              stopLeafletClick(evt);
              var name = getCountryName(feature.properties);
              var info = COUNTRY_INFO[name] || COUNTRY_INFO[normalizeName(name)] || { title: name, bullets: [] };
              openInfoPanel(info.title || name || "Country", formatInfo(info));
            });
          }
        }).addTo(map);
      }

      var regionSpecs = [
        { coll: usStates, prop: "name", match: "pennsylvania", key: "pennsylvania" },
        { coll: usStates, prop: "name", match: "georgia", key: "georgia" },
        { coll: deStates, prop: "name", match: "baden-wurttemberg", key: "badenwuerttemberg" },
        { coll: deStates, prop: "name", match: "bremen", key: "bremen" },
        { coll: nlProvinces, prop: "NAME_1", match: "noord-holland", key: "noordholland" }
      ];

      var regionFeatures = [];
      regionSpecs.forEach(function(spec) {
        if (!spec.coll || !spec.coll.features) return;
        var match = spec.coll.features.find(function(feature) {
          return normalizeName(feature.properties && feature.properties[spec.prop]) === spec.match;
        });
        if (match) {
          var clone = JSON.parse(JSON.stringify(match));
          clone.properties.__regionKey = spec.key;
          regionFeatures.push(clone);
        }
      });

      if (regionLayer) map.removeLayer(regionLayer);
      if (regionFeatures.length) {
        regionLayer = L.geoJSON({ type: "FeatureCollection", features: regionFeatures }, {
          pane: "country-pane",
          style: function(feature) {
            return REGION_STYLES[feature.properties.__regionKey] || REGION_STYLES.pennsylvania;
          },
          onEachFeature: function(feature, layer) {
            layer.on("click", function(evt) {
              stopLeafletClick(evt);
              var key = feature.properties.__regionKey;
              var info = REGION_INFO[key] || { title: key, bullets: [] };
              openInfoPanel(info.title || key || "Region", formatInfo(info));
            });
            layer.on("mouseover", function() {
              layer.setStyle({ weight: 2.3 });
            });
            layer.on("mouseout", function() {
              regionLayer.resetStyle(layer);
            });
          }
        }).addTo(map);
        regionLayer.bringToFront();
      }
    }).catch(function(error) {
      console.error("Boundary load failed", error);
    });
  }

  function loadCities() {
    loadJson("data/cities.geojson").then(function(geojson) {
      cityLayer.clearLayers();
      cityLayer.addData(geojson);
      cityLayer.bringToFront();
    }).catch(function(error) {
      console.error("City load failed", error);
    });
  }

  function loadStoryData() {
    Promise.all([
      loadJson("data/nodes_911_delivery.geojson"),
      loadJson("data/routes_911_delivery.geojson")
    ]).then(function(results) {
      allNodes = results[0];
      allRoutes = results[1];
      syncStoryLayers();
    }).catch(function(error) {
      console.error("Story data load failed", error);
    });
  }

  function getStoryConfig() {
    var step = slides[currentIndex] ? slides[currentIndex].dataset.step : null;
    var configs = {
      Opening: { nodeSteps: ["Order placed", "Order received & scheduled"], routeSteps: [] },
      "Order placed": { nodeSteps: ["Order placed", "Order received & scheduled"], routeSteps: ["Order transmitted"] },
      "Materials sourced": { nodeSteps: ["Materials sourced", "Vehicle produced & QC"], routeSteps: ["Materials sourced"] },
      "Intra-Europe logistics": { nodeSteps: ["Vehicle produced & QC", useAmsterdam ? "Export from Europe (alt)" : "Export from Europe"], routeSteps: [useAmsterdam ? "Intra-Europe logistics (alt)" : "Intra-Europe logistics"] },
      "Ocean crossing": { nodeSteps: [useAmsterdam ? "Export from Europe (alt)" : "Export from Europe", "U.S. port processing"], routeSteps: [useAmsterdam ? "Ocean crossing (alt)" : "Ocean crossing"] },
      "Domestic distribution": { nodeSteps: ["U.S. port processing", "Retail delivery"], routeSteps: ["Domestic distribution"] },
      Closing: { nodeSteps: ["Retail delivery"], routeSteps: [] }
    };
    var base = configs[step] || { nodeSteps: [], routeSteps: [] };
    return {
      nodeSteps: new Set(base.nodeSteps),
      routeSteps: new Set(base.routeSteps),
      includeContext: true
    };
  }

  function syncStoryLayers() {
    if (!allNodes || !allRoutes) return;
    var config = getStoryConfig();

    var visibleNodes = allNodes.features.filter(function(feature) {
      var step = feature.properties && feature.properties.step;
      if (config.nodeSteps.has(step)) return true;
      var category = feature.properties && feature.properties.category;
      return config.includeContext && ["buyer", "hq", "plant"].indexOf(category) !== -1;
    });

    var visibleRoutes = allRoutes.features.filter(function(feature) {
      var step = feature.properties && feature.properties.step;
      return config.routeSteps.has(step);
    });

    nodesLayer.clearLayers();
    routesLayer.clearLayers();

    if (visibleRoutes.length) routesLayer.addData({ type: "FeatureCollection", features: visibleRoutes });
    if (visibleNodes.length) nodesLayer.addData({ type: "FeatureCollection", features: visibleNodes });

    var focusLayers = [];
    if (routesLayer.getLayers().length) focusLayers.push(routesLayer);
    if (nodesLayer.getLayers().length) focusLayers.push(nodesLayer);
    if (focusLayers.length) {
      var bounds = L.featureGroup(focusLayers).getBounds();
      if (bounds.isValid()) map.flyToBounds(bounds.pad(0.3), { duration: 1 });
    }
  }

  function initialize() {
    refreshSlides();
    updateHeadings();
    updateRouteToggle();
    loadGeopolitics();
    loadCities();
    loadStoryData();
  }

  initialize();
})();
