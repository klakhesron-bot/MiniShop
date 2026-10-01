function addToCart(productId, productName, productPrice) {
     let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1
    };

   const existingProduct = cart.find(function(item) {
    return item.id === productId;
});

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    console.log(cart);
}

// Affichage des produits venant de l'API

const productsContainer = document.getElementById("products-container");

if (productsContainer) {

    fetch("/api/produits")
        .then(function(response) {
            return response.json();
        })
    .then(function(produits) {
       const productsContainer = document.getElementById("products-container");

        produits.forEach(function(produit) {
            const productCard = document.createElement("article");

            productCard.classList.add("product-card");

    productCard.innerHTML = `
    <img src="${produit.image}" alt="${produit.name}">
    <h3>${produit.name}</h3>
    <p>${produit.price} FCFA</p>
   <button class="add-to-cart"
    data-id="${produit.id}"
    data-product="${produit.name}"
    data-price="${produit.price}">
    Ajouter au panier
</button>

`;

            productsContainer.appendChild(productCard);
            const button = productCard.querySelector(".add-to-cart");

button.addEventListener("click", function() {

    const productId = Number(button.dataset.id);

    console.log("ID du produit :", productId);

    addToCart(produit.id, produit.name, produit.price);
});
        });
    });
     }

    // Gestion des boutons déjà présents dans le HTML

const buttons = document.querySelectorAll(".add-to-cart");

buttons.forEach(function(button) {
    button.addEventListener("click", function() {

        const productName = button.dataset.product;
        const productPrice = Number(button.dataset.price);

        addToCart(productId, productName, productPrice);
    });
});