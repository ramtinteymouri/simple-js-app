let pokemonRepository = (function () {
    let pokemonList = [
        { name: "Meowth", height: 0.4, type: "normal" },
        { name: "Spearow", height: 0.3, type: ["flying", "normal"] },
        { name: "Lapras", height: 2.5, type: ["ice", "water"] }
    ];
    function add(pokemon) {
        const requiredKeys = ['name', 'age', 'children'];
        // if statement to filter invalid pokemon input
        if ((typeof pokemon === Object) && requiredKeys.every(key => Object.keys(pokemon).includes(key))) pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add("button");
        listItem.appendChild(button);
        pokemonList.appendChild(listItem);
        // Event listener for ech button
        addClickEventListener(button, pokemon);

    }

    function showDetails(pokemon) {
        console.log(pokemon)
    }
    function addClickEventListener(element, pokemon) {
        element.addEventListener('click', function () {
            showDetails(pokemon);
        });
    }
    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        showDetails: showDetails
    };
})();

// forEach loop to replace the previous for loop
pokemonRepository.getAll().forEach(item => {
    pokemonRepository.addListItem(item);
})
