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
            container.innerHTML += getDishHTML(dish);
        }
    });
}

function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' €';
}

renderDishes();

window.onscroll = function () {
    let cart = document.getElementById("cart");
    let scrollY = window.scrollY;

    cart.style.top = `${scrollY + 800}px`;
};