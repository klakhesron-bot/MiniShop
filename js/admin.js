const productForm = document.getElementById("product-form");

productForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("product-name").value;
    if (name.trim() === "") {
    alert("Le nom du produit est obligatoire.");
    return;
}
    const price = Number(document.getElementById("product-price").value);
    const image = document.getElementById("product-image").value;
    if (image.trim() === "") {
    alert("Le chemin de l'image est obligatoire.");
    return;
}

    fetch("/api/produits", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            price: price,
            image: image
        })
    })
        .then(function(response) {

            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout");
            }

            return response.json();
        })
       .then(function(data) {

    console.log(data);

    return fetch("/api/produits/" + data.id);
})
.then(function(response) {

    return response.json();
})
.then(function(produit) {

    displayProduct(produit);

    productForm.reset();

    alert("Produit ajouté avec succès !");
})
.catch(function(error) {

    console.log(error.message);

});

});

const productsContainer = document.getElementById("products-container");

function displayProduct(produit) {

    const productElement = document.createElement("div");

    productElement.classList.add("admin-product");

    productElement.innerHTML = `
        <h3>${produit.name}</h3>
        <img src="${produit.image}" alt="${produit.name}">
        <p>${produit.price} FCFA</p>
        <button class="edit-button">Modifier</button>
        <button class="delete-button">Supprimer</button>
    `;

    productsContainer.appendChild(productElement);
    const deleteButton = productElement.querySelector(".delete-button");

deleteButton.addEventListener("click", function() {

    fetch("/api/produits/" + produit.id, {
        method: "DELETE"
    })
        .then(function(response) {

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression");
            }

            return response.json();
        })
        .then(function(data) {

            console.log(data);

            productElement.remove();

        })
        .catch(function(error) {

            console.log(error.message);

        });

});
const editButton = productElement.querySelector(".edit-button");

editButton.addEventListener("click", function() {

    const newName = prompt("Nouveau nom :", produit.name);

    if (newName === null) {
        return;
    }

    const newPrice = prompt("Nouveau prix :", produit.price);

    if (newPrice === null) {
        return;
    }

    const priceNumber = Number(newPrice);

    if (isNaN(priceNumber) || priceNumber <= 0) {
        alert("Le prix doit être un nombre positif.");
        return;
    }

    fetch("/api/produits/" + produit.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: newName,
            price: priceNumber,
            image: produit.image
        })
    })
        .then(function(response) {

            if (!response.ok) {
                throw new Error("Erreur lors de la modification");
            }

            return response.json();
        })
        .then(function(data) {

            console.log(data);

            produit.name = newName;
            produit.price = priceNumber;

            productElement.querySelector("h3").textContent = newName;
            productElement.querySelector("p").textContent =
                priceNumber + " FCFA";
        })
        .catch(function(error) {

            console.log(error.message);

        });

});
}

fetch("/api/produits")
    .then(function(response) {
        return response.json();
    })
    .then(function(produits) {

       produits.forEach(function(produit) {
    displayProduct(produit);
});
    });