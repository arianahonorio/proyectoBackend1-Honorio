const socket = io();

const form = document.getElementById("productForm");
const list = document.getElementById("productList");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    const product = {
        title: formData.get("title"),
        price: formData.get("price")
    };

    await fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    form.reset();
});

function deleteProduct(id) {

    fetch(`/api/products/${id}`, {
        method: "DELETE"
    });

}

socket.on("updateProducts", (products) => {

    list.innerHTML = "";

    products.forEach(p => {

        list.innerHTML += `
        <li>
            ${p.title} - $${p.price}
            <button onclick="deleteProduct(${p.id})">Eliminar</button>
        </li>
        `;
    });

});