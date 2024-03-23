let pokemonList = [
    { name: "Meowth", height: 0.4, type: "normal" },
    { name: "Spearow", height: 0.3, type: ["flying", "normal"] },
    { name: "Lapras", height: 2.5, type: ["ice", "water"] }
];
// for loop to iterate over each Pokemon
for (i = 0; i < pokemonList.length; i++) {
    document.write(`<p>${pokemonList[i].name} (height ${pokemonList[i].height}m)`)
    // if-else statement to highlight the large Pokemon
    if (pokemonList[i].height > 2) {
        document.write(" - WOW That's huge!</p>")
    }
    else {
        document.write("</p>")
    }
}