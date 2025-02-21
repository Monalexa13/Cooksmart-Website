const recipes = [
    {
        name: "Grillgemüse",
        ingredients: ["Kartoffeln", "Paprika", "Zucchini", "Aubergine", "Pilze", "Knoblauch", "Olivenöl", "Salz", "Pfeffer"],
        url: "http://127.0.0.1:5502/recipes.html#grillgemüse"
    },

    {
        name: "Pasta Arrabiata",
        ingredients: ["Chili", "Knoblauch", "Olivenöl", "Nudeln", "Tomaten", "Salz", "Pfeffer"],
        url: "http://127.0.0.1:5502/recipes.html#pastaarrabiata"
    },

    {
        name: "Bananenpfannkuchen",
        ingredients: ["Mehl", "Backpulver", "Zimt", "Salz", "Bananen", "Pflanzenmilch", "Öl"],
        url: "http://127.0.0.1:5502/recipes.html#bananenpfannkuchen"
    },

    {
        name: "Kichererbsensalat",
        ingredients: ["Kichererbsen", "Paprika", "Zucchini", "Aubergine", "Pilze", "Knoblauch", "Olivenöl", "Salz", "Pfeffer"],
        url: "http://127.0.0.1:5502/recipes.html#kichererbsensalat"
    },

    {
        name: "Pan con Tomate",
        ingredients: ["Brot", "Tomaten", "Salz", "Knoblauch", "Olivenöl"],
        url: "http://127.0.0.1:5502/recipes.html#pancontomate"
    },

    {
        name: "Gemüsecurry mit Reis",
        ingredients: ["Kokosmilch", "Karotten", "Paprika", "Zuckerschoten", "Brokkoli", "Currypaste", "Öl", "Zwiebeln", "Knoblauch", "Ingwer", "Reis", "Salz", "Pfeffer"],
        url: "http://127.0.0.1:5502/recipes.html#gemüsecurry"
    },

    {
        name: "Pad Thai mit Tofu",
        ingredients: ["Reisnudeln", "Tofu", "Grüne Bohnen", "Karotten", "Öl", "Sojasoße", "Erdnussbutter", "Limette", "Salz"],
        url: "http://127.0.0.1:5502/recipes.html#padthai"
    },

    {
        name: "Nudeln mit Pesto und Gemüse",
        ingredients: ["Nudeln", "Zucchini", "Paprika", "Brokkoli", "Basilikum", "Knoblauch", "Pinienkerne", "Salz", "Pfeffer", "Olivenöl"],
        url: "http://127.0.0.1:5502/recipes.html#gemüsepesto"
    },

    {
        name: "Tofu-Rührei",
        ingredients: ["Tofu", "Spinat", "Olivenöl", "Paprika", "Zwiebel", "Salz", "Pfeffer", "Kurkuma"],
        url: "http://127.0.0.1:5502/recipes.html#tofurührei"
    }
];

// Daten aus Lebensmittelspeicher abrufen

function getGroceriesFromDB(callback) {
    const DB_NAME = "FoodDB";
    const DB_VERSION = 1;
    const STORE_NAME = "foods";
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const getAllRequest = store.getAll();
        
        // Namen der Lebensmittel aus Daten ermitteln

        getAllRequest.onsuccess = function () {
            const groceries = getAllRequest.result.map(item => item.name.toLowerCase());
            callback(groceries);
        };
    };
    
    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };
}

// Rezepte die gekocht werden können 

function displayRecipes() {
    getGroceriesFromDB(function (groceries) {
        const recipeContainer = document.getElementById("recipeList");
        recipeContainer.innerHTML = "";
        
        const availableRecipes = recipes.filter(recipe => 
            recipe.ingredients.every(ingredient => groceries.includes(ingredient.toLowerCase()))
        );
        
        // Rezepte oder Fehlernachricht anzeigen

        if (availableRecipes.length > 0) {
            availableRecipes.forEach(recipe => {
                const recipeElement = document.createElement("li");
                const recipeLink = document.createElement("a");
                recipeLink.textContent = recipe.name;
                recipeLink.href = recipe.url;
                recipeLink.target = "_blank";
                recipeElement.appendChild(recipeLink);
                recipeContainer.appendChild(recipeElement);
            });
        } else {
            recipeContainer.innerHTML = "<p>Es wurden keine passenden Rezepte gefunden.</p>";
        }
    });
}

// bei neu laden der Seite Rezepte anzeigen

window.onload = displayRecipes;