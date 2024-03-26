let pokemonRepository = (function () {
    let pokemonList = [
        { name: "Meowth", height: 0.4, type: "normal" },
        { name: "Spearow", height: 0.3, type: ["flying", "normal"] },
        { name: "Lapras", height: 2.5, type: ["ice", "water"] }
    ];
    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    return {
        add: add,
        getAll: getAll
    };
})();
// forEach loop to replace the previous for loop
pokemonRepository.getAll().forEach(item => {
    document.write(`<p>${item.name} (height ${item.height}m)`)
    // if-else statement to highlight the large Pokemon
    if (item.height > 2) {
        document.write(" - WOW That's huge!</p>")
    }
    else {
        document.write("</p>")
    }
})