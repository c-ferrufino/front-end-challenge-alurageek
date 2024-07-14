//Obtener los datos del endpoint 
//NOTA (Es un endpoint gratuito si recibe muchas solicitudes puede dejar de funcionar temporalmente)

async function fetchProducts() {
    try {
        const response = await fetch('https://alurageek-challenge.free.beeceptor.com/products');
        const data = await response.json();
        // Mostrar los datos obtenidos en la consola
        console.log('Datos obtenidos del endpoint:', data.productos);
        return data.productos;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

function deleteCard(element) {
    element.closest('.product-card').remove();
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const img = document.createElement('img');
    img.src = product.imagen;
    img.alt = `Imagen de ${product.nombre}`;
    card.appendChild(img);

    const name = document.createElement('p');
    name.textContent = product.nombre;
    card.appendChild(name);

    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');

    const price = document.createElement('p');
    price.textContent = `$${product.precio.toFixed(2)}`;
    productInfo.appendChild(price);

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.textContent = '🗑️';
    deleteIcon.onclick = () => deleteCard(deleteIcon);
    productInfo.appendChild(deleteIcon);

    card.appendChild(productInfo);

    return card;
}

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productContainer = document.getElementById('product-container');

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const productName = document.getElementById('product-name').value;
        const productPrice = parseFloat(document.getElementById('product-price').value);
        const productImageUrl = document.getElementById('product-image-url').value;


        const newProduct = {
            nombre: productName,
            precio: productPrice,
            imagen: productImageUrl
        };

        try {
            // Realizar la solicitud POST
            const response = await fetch('https://alurageek-challenge.free.beeceptor.com/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            // Console.log para mostrar los datos que estás enviando
            console.log('Datos enviados al endpoint:', newProduct);

            if (!response.ok) {
                throw new Error('No se pudo agregar el producto');
            }

            // Mostrar mensaje de éxito
            alert('Producto agregado exitosamente');

            productForm.reset();

            // Crear la tarjeta del producto y añadir al contenedor
            const productCard = createProductCard(newProduct);
            productContainer.appendChild(productCard);

        } catch (error) {
            console.error('Error al agregar producto:', error);
            alert('Hubo un error al agregar el producto');
        }
    });

    // Cargar productos iniciales
    async function init() {
        try {
            const products = await fetchProducts();
            products.forEach(product => {
                const productCard = createProductCard(product);
                productContainer.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error al inicializar productos:', error);
        }
    }

    init();
});