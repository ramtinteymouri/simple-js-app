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

        let modalContainer = document.querySelector('#modal-container');
        // Clear all existing modal content
        modalContainer.innerHTML = '';

        let modal = document.createElement('div');
        modal.classList.add('modal');

        // Add the modal content
        let closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.innerText = 'X';
        closeButtonElement.addEventListener('click', hideModal);
        let nameElement = document.createElement('h1');
        nameElement.innerText = pokemon.name;
        let heightElement = document.createElement('p');
        let pokemonHeight = pokemon.height;
        if (pokemonHeight == undefined) {
            console.log("Failed to load the height, retrying...")
            pokemonHeight = pokemon.height;
        }
        heightElement.innerText = `Height: ${pokemon.height}m`;
        let imageElement = document.createElement('img');
        imageElement.src = pokemon.imageUrl;
        imageElement.onerror = function () {
            // Image failed to load, attempt to reload
            console.log("Failed to load image. Retrying...");
            imageElement.src = pokemon.imageUrl; // Attempt to reload image
        };

        modal.appendChild(closeButtonElement);
        modal.appendChild(nameElement);
        modal.appendChild(heightElement);
        loadHeight(pokemon, heightElement);
        modal.appendChild(imageElement);
        modalContainer.appendChild(modal);
        modalContainer.classList.add('is-visible');

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
                hideModal();
            }
        });
        modalContainer.addEventListener('click', (e) => {
            // Since this is also triggered when clicking INSIDE the modal container,
            // We only want to close if the user clicks directly on the overlay
            let target = e.target;
            if (target === modalContainer) {
                hideModal();
            }
        });
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
