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
        return pokemonList;
    }

    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('div');
        // Add Bootstrap column classes
        listItem.classList.add('col-md-4', 'col-lg-4', 'mb-3'); // mb-3 adds margin bottom for spacing
        let button = document.createElement('button');
        button.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Uppercase the first letter of the pokemon name
        button.classList.add('btn', 'btn-secondary', 'btn-block');
        // Event listener for each button
        addClickEventListener(button, pokemon);
        listItem.appendChild(button);
        pokemonList.appendChild(listItem);
    }

    function showModal(pokemon) {

        // Add the modal content
        var modalTitle = document.querySelector('.modal-title');
        var modalHeight = document.querySelector('.modal-height');
        var modalImage = document.querySelector('.modal-image');
        modalTitle.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Uppercase the first letter of the pokemon name
        let pokemonHeight = pokemon.height;
        if (pokemonHeight == undefined) {
            console.log("Failed to load the height, Retrying...")
            pokemonHeight = pokemon.height;
        }
        modalHeight.innerText = `Height: ${pokemon.height}m`;
        modalImage.setAttribute('src', pokemon.imageUrl);
        modalImage.onerror = function () {
            // Image failed to load, attempt to reload
            console.log("Failed to load image. Retrying...");
            modalImage.src = pokemon.imageUrl; // Attempt to reload image
        };
        $('#pokemonModal').modal('show');
    }

    // Define loadHeight function outside of showDetails
    function loadHeight(pokemon, heightElement) {
        if (pokemon.height === undefined) {
            console.log("Height information is undefined. Retrying...");
            // Attempt to load height information again
            loadDetails(pokemon).then(function () {
                // Check if height is available after retrying
                if (pokemon.height !== undefined) {
                    heightElement.innerText = `Height: ${pokemon.height}m`;
                } else {
                    console.log("Failed to load height information.");
                    heightElement.innerText = "Height information not available";
                }
            });
        } else {
            heightElement.innerText = `Height: ${pokemon.height}m`;
        }
    }


    function hideModal() {
        let modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
    }

    function addClickEventListener(element, pokemon) {
        element.addEventListener('click', function () {
            showDetails(pokemon);
        });
    }

    // A promise function to load the list
    function loadList() {
        showLoadingMessage()
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            hideLoadingMessage()
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            hideLoadingMessage()
            console.error(e);
        })
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
