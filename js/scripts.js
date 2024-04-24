let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    function add(pokemon) {
        if (
            typeof pokemon === "object" &&
            "name" in pokemon
        ) {
            pokemonList.push(pokemon);
        } else {
            console.log("pokemon is not correct");
        }
    }

    function getAll() {
        return pokemonList.sort((a, b) => a.name.localeCompare(b.name));
    }

    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('div');
        // Add Bootstrap column classes
        listItem.classList.add('col-md-6', 'col-lg-4', 'col-xl-3', 'mb-3'); // Adjusted column classes for responsiveness

        let button = document.createElement('button');
        button.classList.add('btn', 'btn-secondary', 'btn-block', 'd-flex', 'flex-column', 'align-items-center'); // Add flexbox classes
        // Event listener for each button
        addClickEventListener(button, pokemon);

        let smallPokemonImage = document.createElement('img');
        smallPokemonImage.src = pokemon.imageUrl;
        smallPokemonImage.alt = pokemon.name;
        smallPokemonImage.classList.add('pokemon-image', 'mb-2'); // Add margin bottom to the image for spacing

        button.appendChild(smallPokemonImage); // Append the image to the button

        let buttonText = document.createElement('span');
        buttonText.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Uppercase the first letter of the pokemon name

        button.appendChild(buttonText); // Append the Pokemon name text to the button
        listItem.appendChild(button);
        pokemonList.appendChild(listItem);
    }

    function showModal(pokemon) {

        // Add the modal content
        var modalTitle = document.querySelector('.modal-title');
        var modalHeight = document.querySelector('.modal-height');
        var modalImage = document.querySelector('.modal-image');
        var modalType = document.querySelector('.modal-type');
        modalTitle.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Uppercase the first letter of the pokemon name
        let pokemonHeight = pokemon.height;
        if (pokemonHeight == undefined) {
            console.log("Failed to load the height, Retrying...");
            pokemonHeight = pokemon.height;
        }
        modalHeight.innerText = `Height: ${pokemon.height}m`;
        let pokemonType = pokemon.types;
        if (pokemonType == undefined) {
            console.log("Failed to load the types, Retrying...");
            pokemonType = pokemon.types;
        }
        modalType.innerText = pokemonType.length < 2 ? 'Type: ' : 'Types: ';
        for (i = 0; i < pokemonType.length; i++) {
            modalType.innerText += pokemonType[i].type.name + ', ';
        };
        modalType.innerText = modalType.innerText.slice(0, -2);

        modalImage.setAttribute('src', pokemon.imageUrl);
        modalImage.onerror = function () {
            // Image failed to load, attempt to reload
            console.log("Failed to load image. Retrying...");
            modalImage.src = pokemon.imageUrl; // Attempt to reload image
        };
        $('#pokemonModal').modal('show');
    }

    function addClickEventListener(element, pokemon) {
        element.addEventListener('click', function () {
            showDetails(pokemon);
        });
    }

    // A promise function to load the list
    function loadList() {
        showLoadingMessage();
        return fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                hideLoadingMessage();
                return Promise.all(json.results.map(function (item) {
                    return fetch(item.url)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (details) {
                            let pokemon = {
                                name: details.name,
                                detailsUrl: item.url,
                                imageUrl: details.sprites.front_default,
                                height: details.height,
                                types: details.types
                            };
                            add(pokemon);
                        });
                }));
            })
            .catch(function (e) {
                hideLoadingMessage();
                console.error(e);
            });
    }

    function loadDetails(item) {
        showLoadingMessage()
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            hideLoadingMessage()
            // Now we add the details to the item
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
        }).catch(function (e) {
            hideLoadingMessage()
            console.error(e);
        });
    }

    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            showModal(pokemon);
        });
    }

    function showLoadingMessage() {
        let loadingMessage = document.createElement('div');
        loadingMessage.textContent = 'Loading ...';
        loadingMessage.classList.add('loading-message');
        document.body.appendChild(loadingMessage);
    }

    function hideLoadingMessage() {
        let loadingMessage = document.querySelector('.loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }
    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        showDetails: showDetails,
        loadList: loadList,
        loadDetails: loadDetails,
        showLoadingMessage: showLoadingMessage,
        hideLoadingMessage: hideLoadingMessage
    };
})();

// forEach loop to replace the previous for loop
pokemonRepository.loadList().then(function () {
    // Now the data is loaded!
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});
