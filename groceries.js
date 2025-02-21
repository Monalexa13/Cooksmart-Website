const DB_NAME = "FoodDB";
const DB_VERSION = 1;
const STORE_NAME = "foods";

let db;

const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    displayFoods();
};

request.onerror = function (event) {
    console.error("IndexedDB Fehler:", event.target.error);
};

//addFood wird definiert, readwrite erlaubt Bearbeitung, objectStore speichert Daten

function addFood(name, purchaseDate, expiryDate) {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const foodItem = { name, purchaseDate, expiryDate };
    store.add(foodItem);
    
    transaction.oncomplete = function () {
        displayFoods();
    };
}

//readonly erlaubt nur Ansicht

function displayFoods() {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = function () {
        const list = document.getElementById("foodList");
        list.innerHTML = "";
        request.result.forEach((food) => {
            list.innerHTML += `<li>${food.name} (Gekauft: ${food.purchaseDate}, Ablauf: ${food.expiryDate}) 
                <button onclick="deleteFood(${food.id})">🗑️</button></li>`;
        });
    };
}
//Daten können gelöscht werden

function deleteFood(id) {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);

    transaction.oncomplete = function () {
        displayFoods();
    };
}

//conditional erzeugt error-Nachricht bei Unvollständigeit oder fügt Lebensmittel zur Liste hinzu

document.getElementById("addFoodBtn").addEventListener("click", function () {
    const name = document.getElementById("foodName").value;
    const purchaseDate = document.getElementById("purchaseDate").value;
    const expiryDate = document.getElementById("expiryDate").value;

    if (name && purchaseDate && expiryDate) {
        addFood(name, purchaseDate, expiryDate);
        document.getElementById("foodName").value = "";
        document.getElementById("purchaseDate").value = "";
        document.getElementById("expiryDate").value = "";
    } else {
        alert("Bitte alle Felder ausfüllen!");
    }
});
