function renderDishes() {
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

        if (container) {
            const dishHTML = `
                <div class="cards" data-id="${dish.id}">
                    <div class="food_card">
                        <img src="${dish.image}" alt="${dish.name}" />
                        <div class="food_info">
                            <h2>${dish.name}</h2>
                            <p>${dish.description}</p>
                            <div class="price">
                                <p>${formatPrice(dish.price)}</p>
                                <button onclick="addToCartFromButton(${dish.id})">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += dishHTML;
        }
    });
}

function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' €';
}

renderDishes();

window.onscroll = function() {
    let cart = document.getElementById("cart");
    let scrollY = window.scrollY;

    cart.style.top = `${scrollY + 800}px`;
};