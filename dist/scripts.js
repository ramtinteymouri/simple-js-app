let pokemonRepository = function () { let e = []; function t(t) { "object" == typeof t && "name" in t ? e.push(t) : console.log("pokemon is not correct") } function n(e) { return i(), fetch(e.detailsUrl).then(function (e) { return e.json() }).then(function (t) { a(), e.imageUrl = t.sprites.front_default, e.height = t.height, e.types = t.types }).catch(function (e) { a(), console.error(e) }) } function o(e) { n(e).then(function () { var t, n, o, i; let a; t = e, n = document.querySelector(".modal-title"), o = document.querySelector(".modal-height"), i = document.querySelector(".modal-image"), n.innerText = t.name.charAt(0).toUpperCase() + t.name.slice(1), void 0 == (a = t.height) && (console.log("Failed to load the height, Retrying..."), a = t.height), o.innerText = `Height: ${t.height}m`, i.setAttribute("src", t.imageUrl), i.onerror = function () { console.log("Failed to load image. Retrying..."), i.src = t.imageUrl }, $("#pokemonModal").modal("show") }) } function i() { let e = document.createElement("div"); e.textContent = "Loading ...", e.classList.add("loading-message"), document.body.appendChild(e) } function a() { let e = document.querySelector(".loading-message"); e && e.remove() } return { add: t, getAll: function t() { return e.sort((e, t) => e.name.localeCompare(t.name)) }, addListItem: function e(t) { let n = document.querySelector(".pokemon-list"), i = document.createElement("div"); i.classList.add("col-md-4", "col-lg-4", "mb-3"); let a = document.createElement("button"); a.innerText = t.name.charAt(0).toUpperCase() + t.name.slice(1), a.classList.add("btn", "btn-secondary", "btn-block"), function e(t, n) { t.addEventListener("click", function () { o(n) }) }(a, t), i.appendChild(a), n.appendChild(i) }, showDetails: o, loadList: function e() { return i(), fetch("https://pokeapi.co/api/v2/pokemon/?limit=150").then(function (e) { return e.json() }).then(function (e) { a(), e.results.forEach(function (e) { t({ name: e.name, detailsUrl: e.url }) }) }).catch(function (e) { a(), console.error(e) }) }, loadDetails: n, showLoadingMessage: i, hideLoadingMessage: a } }(); pokemonRepository.loadList().then(function () { pokemonRepository.getAll().forEach(function (e) { pokemonRepository.addListItem(e) }) });