let pokemonList = [
    { name: "Meowth", height: 0.4, type: "normal" },
    { name: "Spearow", height: 0.3, type: ["flying", "normal"] },
    { name: "Lapras", height: 2.5, type: ["ice", "water"] }
];
// forEach loop to replace the previous for loop
pokemonList.forEach(item => {
    document.write(`<p>${item.name} (height ${item.height}m)`)
    // if-else statement to highlight the large Pokemon
    if (item.height > 2) {
        document.write(" - WOW That's huge!</p>")
    }
    else {
        document.write("</p>")
    }
})