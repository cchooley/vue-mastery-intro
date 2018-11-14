Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
            <div class="product">
                <div class="product-image">
                    <img v-bind:src="image">
                </div>
                <div class="product-info">
                    <h1>{{ title }}</h1>
                    <p v-if="inStock">In Stock <br>{{ cta }}</p>
                    <p v-else
                        :class="{ noMore: !inStock }">Out of Stock</p>
                    <p>Shipping: {{ shipping }}</p>
                    <product-details :details="details"></product-details>
                    <div v-for="(variant, index) in variants" 
                        :key="variant.variantId"
                        class="color-box"
                        :style="{ backgroundColor: variant.variantColor }"
                        @mouseover="updateProduct(index)">
                    </div>
                    <button @click="addToCart" 
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Add to Cart</button>
                    <div class="cart">
                        <p>Cart({{cart}})</p>
                    </div>
                </div>
            </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            onSale: true,
            selectedVariant: 0,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: './assets/socks.jpeg',
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: './assets/bluesocks.jpeg',
                    variantQuantity: 0,
                }
            ],
            cart: 0
            }
        },
        methods: {
            addToCart: function () {
                this.cart += 1
            },
            updateProduct: function (index) {
                this.selectedVariant = index
            }
        },
        computed: {
            title() {
                return this.brand + ' ' + this.product
            },
            image() {
                return this.variants[this.selectedVariant].variantImage
            },
            inStock() {
                return this.variants[this.selectedVariant].variantQuantity
            },
            cta() {
                if (this.onSale) {
                    return `Purchase ${this.brand} ${this.product} to keep your feet warm this winter!`
                }
            },
            shipping() {
                if (this.premium) {
                    return 'free'
                } else {
                    return '$2.99'
                }
            }
        }
})

var App = new Vue({
    el: '#app',
    data: {
        premium: false,
    }
})