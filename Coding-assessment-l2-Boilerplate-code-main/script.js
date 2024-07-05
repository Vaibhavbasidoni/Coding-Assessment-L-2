document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab');
    const productList = document.getElementById('product-list');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            fetchProducts(this.dataset.category);
        });
    });

    function fetchProducts(category) {
        fetch('./products.json')
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Log the entire JSON response
                const categoryData = data.categories.find(cat => {
                    if (cat.category_name) {
                        return cat.category_name.toLowerCase() === category.toLowerCase();
                    } else {
                        console.error('Category name is undefined:', cat);
                        return false;
                    }
                });
                if (categoryData && categoryData.category_products) {
                    displayProducts(categoryData.category_products);
                } else {
                    console.error('Category or products not found');
                }
            })
            .catch(error => console.error('Error fetching product data:', error));
    }

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const discount = calculateDiscount(product.price, product.compare_at_price);
            const productCard = `
                <div class="product-card">
                    <div class="product-badge">${product.badge}</div>
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-details">
                        <h2 class="product-title">${product.title}</h2>
                        <p class="product-vendor">${product.vendor}</p>
                        <p class="product-price">Rs ${product.price}</p>
                        <p class="product-compare-price">Rs ${product.compare_at_price}</p>
                        <p class="product-discount">${discount}% Off</p>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                </div>
            `;
            productList.insertAdjacentHTML('beforeend', productCard);
        });
    }

    function calculateDiscount(price, compareAtPrice) {
        return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    }

    // Load default category on page load
    fetchProducts('Men');
});
