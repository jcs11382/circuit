import { PLACES } from "./places.js";
import {
  checkPassphrase,
  makeSession,
  readSession,
  setSessionCookie,
  clearSessionCookie,
} from "./auth.js";

const STATIC = {"/": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n<title>The Circuit</title>\n<meta name=\"theme-color\" content=\"#8c3b1e\" />\n<link rel=\"manifest\" href=\"/manifest.json\" />\n<link rel=\"icon\" href=\"/icon.svg\" />\n<link rel=\"apple-touch-icon\" href=\"/icon.svg\" />\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n<link href=\"https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Outfit:wght@300;400;500&display=swap\" rel=\"stylesheet\" />\n<link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css\" />\n<link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n<div id=\"gate\">\n  <p class=\"kicker\">Field book</p>\n  <h1>The Circuit</h1>\n  <p class=\"lede\">Sign in. Notes live on the server. This tab can close.</p>\n  <form id=\"login\">\n    <input type=\"password\" id=\"pass\" placeholder=\"Passphrase\" autocomplete=\"current-password\" />\n    <button type=\"submit\">Enter</button>\n  </form>\n  <p id=\"gateErr\" class=\"hint\"></p>\n</div>\n<div id=\"app\" hidden>\n  <p class=\"kicker\">Field book</p>\n  <h1>The Circuit</h1>\n  <p class=\"lede\">Drop a pin. Set how long you will drive. Craft is the plate. Character is the room you remember.</p>\n  <section class=\"setup\">\n    <div class=\"row\">\n      <label class=\"sec\">Where you start</label>\n      <input class=\"field\" id=\"addr\" placeholder=\"Address or city\" />\n      <button class=\"ghost\" id=\"locate\" type=\"button\">Use my location</button>\n      <button class=\"ghost\" id=\"grapevine\" type=\"button\">Grapevine</button>\n    </div>\n    <div class=\"row\" id=\"mins\">\n      <label class=\"sec\">Drive time</label>\n      <button class=\"chip\" data-min=\"20\" type=\"button\">20 min</button>\n      <button class=\"chip active\" data-min=\"45\" type=\"button\">45 min</button>\n      <button class=\"chip\" data-min=\"60\" type=\"button\">60 min</button>\n      <button class=\"chip\" data-min=\"90\" type=\"button\">90 min</button>\n      <button class=\"chip\" data-min=\"120\" type=\"button\">2 hr</button>\n    </div>\n    <div class=\"row\" id=\"occ\">\n      <label class=\"sec\">Occasion</label>\n      <button class=\"chip active\" data-occ=\"any\" type=\"button\">Any</button>\n      <button class=\"chip\" data-occ=\"date\" type=\"button\">Date</button>\n      <button class=\"chip\" data-occ=\"client\" type=\"button\">Client</button>\n      <button class=\"chip\" data-occ=\"solo\" type=\"button\">Solo</button>\n      <button class=\"chip\" data-occ=\"family\" type=\"button\">Family</button>\n    </div>\n    <div class=\"row\">\n      <button class=\"go\" id=\"build\" type=\"button\">Build the circuit</button>\n      <button class=\"ghost\" id=\"logout\" type=\"button\">Sign out</button>\n      <span class=\"hint\" id=\"pinLabel\">No pin yet.</span>\n    </div>\n  </section>\n  <div class=\"stats\" id=\"stats\" hidden>\n    <div><b id=\"nWeek\">0</b> this week</div>\n    <div><b id=\"nAll\">0</b> in range</div>\n    <div><b id=\"nEaten\">0</b> eaten</div>\n  </div>\n  <div class=\"toolbar\" id=\"tools\" hidden>\n    <button class=\"chip active\" data-view=\"week\" type=\"button\">This week</button>\n    <button class=\"chip\" data-view=\"all\" type=\"button\">Full book</button>\n    <button class=\"chip\" data-axis=\"both\" type=\"button\">Both</button>\n    <button class=\"chip\" data-axis=\"craft\" type=\"button\">Craft</button>\n    <button class=\"chip\" data-axis=\"character\" type=\"button\">Character</button>\n    <button class=\"chip\" data-show=\"list\" type=\"button\">List</button>\n    <button class=\"chip\" data-show=\"map\" type=\"button\">Map</button>\n  </div>\n  <div id=\"map\"></div>\n  <div id=\"week\"></div>\n  <div id=\"book\"></div>\n</div>\n<script src=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.js\"></script>\n<script src=\"/app.js\"></script>\n</body>\n</html>\n", "/index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n<title>The Circuit</title>\n<meta name=\"theme-color\" content=\"#8c3b1e\" />\n<link rel=\"manifest\" href=\"/manifest.json\" />\n<link rel=\"icon\" href=\"/icon.svg\" />\n<link rel=\"apple-touch-icon\" href=\"/icon.svg\" />\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n<link href=\"https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Outfit:wght@300;400;500&display=swap\" rel=\"stylesheet\" />\n<link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css\" />\n<link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n<div id=\"gate\">\n  <p class=\"kicker\">Field book</p>\n  <h1>The Circuit</h1>\n  <p class=\"lede\">Sign in. Notes live on the server. This tab can close.</p>\n  <form id=\"login\">\n    <input type=\"password\" id=\"pass\" placeholder=\"Passphrase\" autocomplete=\"current-password\" />\n    <button type=\"submit\">Enter</button>\n  </form>\n  <p id=\"gateErr\" class=\"hint\"></p>\n</div>\n<div id=\"app\" hidden>\n  <p class=\"kicker\">Field book</p>\n  <h1>The Circuit</h1>\n  <p class=\"lede\">Drop a pin. Set how long you will drive. Craft is the plate. Character is the room you remember.</p>\n  <section class=\"setup\">\n    <div class=\"row\">\n      <label class=\"sec\">Where you start</label>\n      <input class=\"field\" id=\"addr\" placeholder=\"Address or city\" />\n      <button class=\"ghost\" id=\"locate\" type=\"button\">Use my location</button>\n      <button class=\"ghost\" id=\"grapevine\" type=\"button\">Grapevine</button>\n    </div>\n    <div class=\"row\" id=\"mins\">\n      <label class=\"sec\">Drive time</label>\n      <button class=\"chip\" data-min=\"20\" type=\"button\">20 min</button>\n      <button class=\"chip active\" data-min=\"45\" type=\"button\">45 min</button>\n      <button class=\"chip\" data-min=\"60\" type=\"button\">60 min</button>\n      <button class=\"chip\" data-min=\"90\" type=\"button\">90 min</button>\n      <button class=\"chip\" data-min=\"120\" type=\"button\">2 hr</button>\n    </div>\n    <div class=\"row\" id=\"occ\">\n      <label class=\"sec\">Occasion</label>\n      <button class=\"chip active\" data-occ=\"any\" type=\"button\">Any</button>\n      <button class=\"chip\" data-occ=\"date\" type=\"button\">Date</button>\n      <button class=\"chip\" data-occ=\"client\" type=\"button\">Client</button>\n      <button class=\"chip\" data-occ=\"solo\" type=\"button\">Solo</button>\n      <button class=\"chip\" data-occ=\"family\" type=\"button\">Family</button>\n    </div>\n    <div class=\"row\">\n      <button class=\"go\" id=\"build\" type=\"button\">Build the circuit</button>\n      <button class=\"ghost\" id=\"logout\" type=\"button\">Sign out</button>\n      <span class=\"hint\" id=\"pinLabel\">No pin yet.</span>\n    </div>\n  </section>\n  <div class=\"stats\" id=\"stats\" hidden>\n    <div><b id=\"nWeek\">0</b> this week</div>\n    <div><b id=\"nAll\">0</b> in range</div>\n    <div><b id=\"nEaten\">0</b> eaten</div>\n  </div>\n  <div class=\"toolbar\" id=\"tools\" hidden>\n    <button class=\"chip active\" data-view=\"week\" type=\"button\">This week</button>\n    <button class=\"chip\" data-view=\"all\" type=\"button\">Full book</button>\n    <button class=\"chip\" data-axis=\"both\" type=\"button\">Both</button>\n    <button class=\"chip\" data-axis=\"craft\" type=\"button\">Craft</button>\n    <button class=\"chip\" data-axis=\"character\" type=\"button\">Character</button>\n    <button class=\"chip\" data-show=\"list\" type=\"button\">List</button>\n    <button class=\"chip\" data-show=\"map\" type=\"button\">Map</button>\n  </div>\n  <div id=\"map\"></div>\n  <div id=\"week\"></div>\n  <div id=\"book\"></div>\n</div>\n<script src=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.js\"></script>\n<script src=\"/app.js\"></script>\n</body>\n</html>\n", "/styles.css": ":root { --ink:#1a1410; --soft:#3a322c; --paper:#f3ece2; --card:#fffaf4; --rust:#8c3b1e; --brass:#b08a4a; --line:rgba(26,20,16,.12); }\n* { box-sizing: border-box; }\nhtml, body { margin: 0; }\nbody { font-family: Outfit, system-ui, sans-serif; background: #f3ece2; color: var(--ink); }\n.wrap, #app, #gate { max-width: 1100px; margin: 0 auto; padding: 22px 18px 80px; }\n.kicker { font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: var(--rust); font-weight: 600; }\nh1 { font-family: Fraunces, serif; font-size: clamp(40px, 7vw, 72px); line-height: .9; margin: 8px 0 10px; }\n.lede { max-width: 48ch; color: var(--soft); font-weight: 300; }\n.setup { background: var(--card); border: 1px solid var(--line); padding: 16px; margin: 16px 0; }\n.row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 10px; }\n.sec { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--soft); width: 100%; }\n.chip, .field, .ghost, .go, #login button, #login input { font: inherit; font-size: 13px; border: 1px solid var(--line); background: #fff; padding: 8px 12px; }\n.chip.active { background: var(--ink); color: var(--paper); }\n.field { flex: 1; min-width: 160px; }\n.go, #login button { background: var(--rust); color: #f6eee6; border-color: var(--rust); }\n.ghost { background: transparent; }\n.hint { font-size: 12px; color: var(--soft); }\n.stats { display: flex; gap: 18px; font-size: 13px; }\n.toolbar { display: flex; flex-wrap: wrap; gap: 8px; position: sticky; top: 0; background: #f3ece2; padding: 10px 0; z-index: 5; }\n#map { height: 380px; display: none; border: 1px solid var(--line); margin-bottom: 16px; }\n#map.show { display: block; }\n.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }\n@media (min-width: 820px) { .grid { grid-template-columns: 1fr 1fr; } }\n.card { background: var(--card); border: 1px solid var(--line); }\n.photo { height: 180px; background: #d7cbbd; position: relative; }\n.photo img { width: 100%; height: 100%; object-fit: cover; }\n.badges { position: absolute; left: 10px; top: 10px; display: flex; gap: 6px; }\n.b { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; padding: 4px 7px; background: #fff; }\n.b.craft { background: #1a1410; color: #f3ece2; }\n.b.char { background: #b08a4a; }\n.drive { position: absolute; right: 10px; top: 10px; font-size: 11px; background: #fff; padding: 4px 7px; }\n.body { padding: 14px; display: flex; flex-direction: column; gap: 7px; }\n.tag { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; border: 1px solid var(--line); padding: 3px 6px; }\n.name { font-family: Fraunces, serif; font-size: 24px; margin: 0; }\n.where, .meta, .src { font-size: 13px; color: var(--soft); }\n.night h3 { font-size: 13px; letter-spacing: .16em; text-transform: uppercase; color: var(--rust); }\n.btn { color: var(--ink); }\nselect, textarea, input.when { font: inherit; font-size: 13px; border: 1px solid var(--line); padding: 7px; }\ntextarea { width: 100%; min-height: 56px; }\n#login { display: flex; gap: 8px; margin-top: 16px; }\n", "/app.js": "if (\"serviceWorker\" in navigator) navigator.serviceWorker.register(\"/sw.js\");\n\nconst state = {\n  pin: null, mins: 45, occ: \"any\", view: \"week\", axis: \"both\", show: \"list\",\n  places: [], marks: {}, times: {}, weekIds: [], nights: [], inRange: []\n};\n\nconst $ = (id) => document.getElementById(id);\n\nasync function api(path, opts = {}) {\n  const res = await fetch(path, {\n    credentials: \"same-origin\",\n    headers: { \"content-type\": \"application/json\", ...(opts.headers || {}) },\n    ...opts,\n  });\n  return res;\n}\n\nasync function boot() {\n  const me = await api(\"/api/me\");\n  const data = await me.json();\n  if (!data.ok) return;\n  $(\"gate\").hidden = true;\n  $(\"app\").hidden = false;\n  const places = await (await api(\"/api/places\")).json();\n  const marks = await (await api(\"/api/marks\")).json();\n  state.places = places.places || [];\n  state.marks = marks.marks || {};\n}\n\n$(\"login\").onsubmit = async (e) => {\n  e.preventDefault();\n  const res = await api(\"/api/login\", { method: \"POST\", body: JSON.stringify({ passphrase: $(\"pass\").value }) });\n  const data = await res.json();\n  if (!data.ok) { $(\"gateErr\").textContent = \"Wrong passphrase.\"; return; }\n  await boot();\n};\n\n$(\"logout\").onclick = async () => {\n  await api(\"/api/logout\", { method: \"POST\", body: \"{}\" });\n  location.reload();\n};\n\n$(\"grapevine\").onclick = () => { state.pin = { lat: 32.9346, lng: -97.0781 }; $(\"pinLabel\").textContent = \"Grapevine\"; $(\"addr\").value = \"Grapevine, TX\"; };\n$(\"locate\").onclick = () => {\n  navigator.geolocation.getCurrentPosition((pos) => {\n    state.pin = { lat: pos.coords.latitude, lng: pos.coords.longitude };\n    $(\"pinLabel\").textContent = \"Current location\";\n  });\n};\n$(\"addr\").addEventListener(\"keydown\", async (e) => {\n  if (e.key !== \"Enter\") return;\n  const q = e.target.value.trim();\n  if (!q) return;\n  const r = await fetch(\"https://nominatim.openstreetmap.org/search?format=json&limit=1&q=\" + encodeURIComponent(q));\n  const d = await r.json();\n  if (d[0]) {\n    state.pin = { lat: +d[0].lat, lng: +d[0].lon };\n    $(\"pinLabel\").textContent = d[0].display_name.split(\",\").slice(0, 3).join(\",\");\n  }\n});\n$(\"mins\").onclick = (e) => {\n  const b = e.target.closest(\"[data-min]\"); if (!b) return;\n  $(\"mins\").querySelectorAll(\".chip\").forEach((x) => x.classList.remove(\"active\"));\n  b.classList.add(\"active\"); state.mins = +b.dataset.min;\n};\n$(\"occ\").onclick = (e) => {\n  const b = e.target.closest(\"[data-occ]\"); if (!b) return;\n  $(\"occ\").querySelectorAll(\".chip\").forEach((x) => x.classList.remove(\"active\"));\n  b.classList.add(\"active\"); state.occ = b.dataset.occ;\n};\n$(\"tools\").onclick = (e) => {\n  const v = e.target.closest(\"[data-view]\"); const a = e.target.closest(\"[data-axis]\"); const s = e.target.closest(\"[data-show]\");\n  if (v) { document.querySelectorAll(\"[data-view]\").forEach((x) => x.classList.remove(\"active\")); v.classList.add(\"active\"); state.view = v.dataset.view; render(); }\n  if (a) { document.querySelectorAll(\"[data-axis]\").forEach((x) => x.classList.remove(\"active\")); a.classList.add(\"active\"); state.axis = a.dataset.axis; render(); }\n  if (s) { document.querySelectorAll(\"[data-show]\").forEach((x) => x.classList.remove(\"active\")); s.classList.add(\"active\"); state.show = s.dataset.show; render(); }\n};\n\n$(\"build\").onclick = async () => {\n  if (!state.pin) { $(\"pinLabel\").textContent = \"Need a pin first.\"; return; }\n  $(\"stats\").hidden = false; $(\"tools\").hidden = false;\n  const res = await api(`/api/drive-times?lat=${state.pin.lat}&lng=${state.pin.lng}`);\n  const data = await res.json();\n  state.times = data.times || {};\n  state.inRange = state.places.filter((p) => (state.times[p.id] || 999) <= state.mins && (state.occ === \"any\" || p.occ.includes(state.occ)));\n  const by = {};\n  state.inRange.forEach((p) => { if (!by[p.cuisine]) by[p.cuisine] = p; });\n  const mixed = Object.values(by);\n  for (const p of state.inRange) { if (mixed.length >= 6) break; if (!mixed.find((x) => x.id === p.id)) mixed.push(p); }\n  const groups = {};\n  mixed.forEach((p) => { (groups[p.area] ||= []).push(p); });\n  state.weekIds = mixed.map((p) => p.id);\n  state.nights = Object.entries(groups).map(([area, rooms]) => ({ area, rooms }));\n  $(\"pinLabel\").textContent = `${state.inRange.length} rooms inside ${state.mins} min.`;\n  render();\n};\n\nfunction markOf(id) { return state.marks[id] || { status: \"open\", when: \"\", note: \"\" }; }\n\nasync function saveMark(id, patch) {\n  const next = { ...markOf(id), ...patch };\n  state.marks[id] = next;\n  await api(\"/api/marks\", { method: \"PUT\", body: JSON.stringify({ id, ...next }) });\n  render();\n}\n\nlet map, pinMarker, markers = [];\nfunction ensureMap() {\n  if (map) return;\n  map = L.map(\"map\").setView([32.9, -96.95], 9);\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", { attribution: \"&copy; OpenStreetMap\" }).addTo(map);\n}\n\nfunction card(p, t) {\n  const m = markOf(p.id);\n  const axis = p.axes.map((a) => `<span class=\"b ${a}\">${a}</span>`).join(\"\");\n  return `<article class=\"card\">\n    <div class=\"photo\"><img src=\"${p.img}\" alt=\"${p.name}\" /><div class=\"badges\">${axis}</div><div class=\"drive\">${t} min</div></div>\n    <div class=\"body\">\n      <div><span class=\"tag\">${p.cuisine}</span> <span class=\"tag\">${p.hood}</span></div>\n      <h3 class=\"name\">${p.name}</h3>\n      <div class=\"where\">${p.address}</div>\n      <p>${p.why}</p>\n      <div class=\"meta\">${p.book} \u00b7 ${p.entry}</div>\n      <div class=\"src\">${p.src} \u00b7 ${p.checked}</div>\n      <div><a class=\"btn\" href=\"${p.maps}\">Map</a> ${p.web ? `<a class=\"btn\" href=\"${p.web}\">Site</a>` : \"\"} ${p.res ? `<a class=\"btn\" href=\"${p.res}\">Reserve</a>` : \"\"}</div>\n      <div>\n        <select data-id=\"${p.id}\" class=\"status\">\n          <option value=\"open\" ${m.status === \"open\" ? \"selected\" : \"\"}>Not yet</option>\n          <option value=\"booked\" ${m.status === \"booked\" ? \"selected\" : \"\"}>Booked</option>\n          <option value=\"eaten\" ${m.status === \"eaten\" ? \"selected\" : \"\"}>Eaten</option>\n        </select>\n        <input class=\"when\" type=\"date\" data-id=\"${p.id}\" value=\"${m.when || \"\"}\" />\n      </div>\n      <textarea data-id=\"${p.id}\" class=\"note\" placeholder=\"What you ordered.\">${m.note || \"\"}</textarea>\n    </div></article>`;\n}\n\nfunction bind(root) {\n  root.querySelectorAll(\"select.status\").forEach((s) => s.onchange = (e) => saveMark(e.target.dataset.id, { status: e.target.value }));\n  root.querySelectorAll(\"input.when\").forEach((s) => s.onchange = (e) => saveMark(e.target.dataset.id, { when: e.target.value }));\n  root.querySelectorAll(\"textarea.note\").forEach((s) => s.onchange = (e) => saveMark(e.target.dataset.id, { note: e.target.value }));\n}\n\nfunction visible() {\n  return state.inRange.filter((p) => state.axis === \"both\" || p.axes.includes(state.axis));\n}\n\nfunction render() {\n  const vis = visible();\n  const weekRooms = vis.filter((p) => state.weekIds.includes(p.id));\n  $(\"nWeek\").textContent = weekRooms.length;\n  $(\"nAll\").textContent = vis.length;\n  $(\"nEaten\").textContent = Object.values(state.marks).filter((m) => m.status === \"eaten\").length;\n  const weekEl = $(\"week\"); const bookEl = $(\"book\");\n  weekEl.innerHTML = \"\"; bookEl.innerHTML = \"\";\n  if (state.view === \"week\") {\n    weekEl.innerHTML = `<h2>This week</h2>`;\n    state.nights.forEach((n) => {\n      const rooms = n.rooms.filter((p) => vis.find((v) => v.id === p.id));\n      if (!rooms.length) return;\n      const d = document.createElement(\"div\");\n      d.className = \"night\";\n      d.innerHTML = `<h3>${n.area}</h3><div class=\"grid\">${rooms.map((p) => card(p, state.times[p.id])).join(\"\")}</div>`;\n      weekEl.appendChild(d); bind(d);\n    });\n  } else {\n    bookEl.innerHTML = `<h2>Full book</h2><div class=\"grid\">${vis.map((p) => card(p, state.times[p.id])).join(\"\")}</div>`;\n    bind(bookEl);\n  }\n  if (state.show === \"map\") {\n    $(\"map\").classList.add(\"show\");\n    ensureMap();\n    markers.forEach((m) => map.removeLayer(m)); markers = [];\n    if (pinMarker) map.removeLayer(pinMarker);\n    if (state.pin) pinMarker = L.circleMarker([state.pin.lat, state.pin.lng], { radius: 8, color: \"#1a1410\", fillOpacity: 1 }).addTo(map);\n    vis.forEach((p) => {\n      const mk = L.circleMarker([p.lat, p.lng], { radius: 7, color: \"#8c3b1e\", fillOpacity: 0.9 }).addTo(map);\n      mk.bindPopup(`<b>${p.name}</b><br>${p.cuisine} \u00b7 ${state.times[p.id]} min`);\n      markers.push(mk);\n    });\n    const pts = vis.map((p) => [p.lat, p.lng]);\n    if (state.pin) pts.push([state.pin.lat, state.pin.lng]);\n    if (pts.length) map.fitBounds(pts, { padding: [24, 24] });\n    setTimeout(() => map.invalidateSize(), 120);\n  } else $(\"map\").classList.remove(\"show\");\n}\n\nboot();\n", "/manifest.json": "{\n  \"name\": \"The Circuit\",\n  \"short_name\": \"Circuit\",\n  \"start_url\": \"/\",\n  \"display\": \"standalone\",\n  \"background_color\": \"#f3ece2\",\n  \"theme_color\": \"#8c3b1e\",\n  \"icons\": [\n    { \"src\": \"/icon.svg\", \"sizes\": \"any\", \"type\": \"image/svg+xml\", \"purpose\": \"any maskable\" }\n  ]\n}\n", "/icon.svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\">\n  <rect width=\"128\" height=\"128\" fill=\"#8c3b1e\"/>\n  <text x=\"64\" y=\"82\" text-anchor=\"middle\" font-size=\"64\" font-family=\"Georgia, serif\" fill=\"#f3ece2\">C</text>\n</svg>\n", "/sw.js": "const CACHE = \"circuit-v1\";\nself.addEventListener(\"install\", (e) => {\n  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([\"/\", \"/manifest.json\"])));\n  self.skipWaiting();\n});\nself.addEventListener(\"activate\", (e) => e.waitUntil(self.clients.claim()));\nself.addEventListener(\"fetch\", (e) => {\n  if (e.request.method !== \"GET\") return;\n  const url = new URL(e.request.url);\n  if (url.pathname.startsWith(\"/api/\")) return;\n  e.respondWith(\n    fetch(e.request)\n      .then((res) => {\n        const copy = res.clone();\n        caches.open(CACHE).then((c) => c.put(e.request, copy));\n        return res;\n      })\n      .catch(() => caches.match(e.request))\n  );\n});\n"};
const STATIC_TYPES = {"/": "text/html; charset=utf-8", "/index.html": "text/html; charset=utf-8", "/styles.css": "text/css; charset=utf-8", "/app.js": "text/javascript; charset=utf-8", "/manifest.json": "application/manifest+json", "/icon.svg": "image/svg+xml", "/sw.js": "text/javascript; charset=utf-8"};

const MARKS_KEY = "marks:v1";
const META_KEY = "meta:heartbeat";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith("/api/")) {
      return api(request, env, url);
    }

    if (request.method === "GET" && STATIC[path]) {
      return new Response(STATIC[path], { headers: { "content-type": STATIC_TYPES[path] } });
    }

    return new Response("Not found", { status: 404 });
  },

  async scheduled(event, env) {
    if (env.CIRCUIT_KV) await env.CIRCUIT_KV.put(
      META_KEY,
      JSON.stringify({ at: new Date().toISOString(), cron: event.cron })
    );
  },
};

async function api(request, env, url) {
  const path = url.pathname;
  const session = await readSession(request, env);

  if (path === "/api/login" && request.method === "POST") {
    let body = {};
    try { body = await request.json(); } catch {}
    if (!checkPassphrase(env, body.passphrase)) {
      return json({ ok: false, error: "Bad passphrase" }, 401);
    }
    const token = await makeSession(env);
    return json({ ok: true }, 200, { "Set-Cookie": setSessionCookie(token) });
  }

  if (path === "/api/logout" && request.method === "POST") {
    return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
  }

  if (path === "/api/me") {
    return json({ ok: !!session });
  }

  if (!session) return json({ ok: false, error: "Sign in" }, 401);

  if (path === "/api/places" && request.method === "GET") {
    return json({ places: PLACES, checked: "Sep 2026" });
  }

  if (path === "/api/marks" && request.method === "GET") {
    const raw = env.CIRCUIT_KV ? await env.CIRCUIT_KV.get(MARKS_KEY) : null;
    return json({ marks: raw ? JSON.parse(raw) : {} });
  }

  if (path === "/api/marks" && request.method === "PUT") {
    let body = {};
    try { body = await request.json(); } catch {}
    if (!body.id) return json({ error: "id required" }, 400);
    if (!env.CIRCUIT_KV) return json({ error: "storage not ready" }, 503);
    const raw = await env.CIRCUIT_KV.get(MARKS_KEY);
    const marks = raw ? JSON.parse(raw) : {};
    marks[body.id] = {
      status: body.status || "open",
      when: body.when || "",
      note: body.note || "",
      updated: new Date().toISOString(),
    };
    await env.CIRCUIT_KV.put(MARKS_KEY, JSON.stringify(marks));
    return json({ ok: true, marks });
  }

  if (path === "/api/drive-times" && request.method === "GET") {
    const lat = Number(url.searchParams.get("lat"));
    const lng = Number(url.searchParams.get("lng"));
    if (!lat || !lng) return json({ error: "lat lng required" }, 400);
    const times = {};
    PLACES.forEach((p) => {
      times[p.id] = estimateMin(haversineMiles({ lat, lng }, p));
    });
    try {
      const coords = [`${lng},${lat}`].concat(PLACES.map((p) => `${p.lng},${p.lat}`)).join(";");
      const res = await fetch(
        `https://router.project-osrm.org/table/v1/driving/${coords}?sources=0&annotations=duration`
      );
      if (res.ok) {
        const data = await res.json();
        const row = data.durations && data.durations[0];
        if (row) {
          PLACES.forEach((p, i) => {
            const sec = row[i + 1];
            if (sec != null) times[p.id] = Math.round(sec / 60);
          });
        }
      }
    } catch {}
    return json({ times });
  }

  if (path === "/api/heartbeat" && request.method === "GET") {
    const raw = env.CIRCUIT_KV ? await env.CIRCUIT_KV.get(META_KEY) : null;
    return json({ heartbeat: raw ? JSON.parse(raw) : null });
  }

  return json({ error: "Not found" }, 404);
}

function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

function haversineMiles(a, b) {
  const R = 3958.8;
  const t = (d) => (d * Math.PI) / 180;
  const dLat = t(b.lat - a.lat);
  const dLng = t(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

function estimateMin(miles) {
  return Math.round(miles * 1.55 + 6);
}
