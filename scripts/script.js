function renderDishes(){
// Für jedes Gericht den entsprechenden Container auswählen
    dishes.forEach((dish) => {
        let container;
        if (dish.category === "nudelgerichte") {
            container = document.getElementById("nudelgerichte_dishes");
        } else if (dish.category === "curry") {
            container = document.getElementById("curry_dishes");
        } else if (dish.category === "spezialitaeten") {
            container = document.getElementById("spezialitaeten_dishes");
        } else if (dish.category === "getraenke") {
            container = document.getElementById("getraenke_dishes");
        }

// Falls der entsprechende Container existiert, füge das HTML hinzu
    if (container) {
        const dishHTML = `
            <div class="cards" data-id="${dish.id}">
                <div class="food_card1">
                    <img src="${dish.image}" alt="${dish.name}" />
                    <div class="food_info1">
                        <h2>${dish.name}</h2>
                        <p>${dish.description}</p>
                        <div class="price">
                            <p>${formatPrice(dish.price)}</p>
                            <button>+</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            container.innerHTML += dishHTML;
        }
    });
}

// Preis richtig anzeigen lassen
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' €';
}

renderDishes();
