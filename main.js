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
                        :class="{ disabledButton: !inStock }">Add to Cart
                    </button>
                    <button @click="removeFromCart" 
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Remove from Cart
                    </button>                    
                </div>
                <div>
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul>
                        <li v-for="review in reviews">
                            <p>{{ review.name }}</p>
                            <p>{{ review.rating }}</p>
                            <p>{{ review.review }}</p>
                            <p>Recommended? {{ review.rec }}</p>
                        </li>
                    </ul>
                </div>

                <product-review @review-submitted="addReview"></product-review>

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
            reviews: []
            }
        },
        methods: {
            addToCart () {
                this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
            },
            removeFromCart() {
                this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
            },            
            updateProduct (index) {
                this.selectedVariant = index
            },
            addReview(productReview) {
                this.reviews.push(productReview)
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

Vue.component('product-review', {

    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name">
            </p>
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            <p>
                Would you recommend this product?
                <div>
                    <label>
                        Yes
                        <input type="radio" value="Yes" v-model="rec"/>
                    </label>
                    <label>
                        No
                        <input type="radio" value="No" v-model="rec"/>
                    </label>
                </div>
            </p>
            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            rec: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.rec) {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                rec: this.rec
            }
            this.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
            this.rec = null
        }
        else {
            if(!this.name) this.errors.push("Name required")
            if(!this.review) this.errors.push("Review required")
            if(!this.rating) this.errors.push("Rating required")
            if(!this.rec) this.errors.push("Recommendation required")
        }
        }
    }
})

var App = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        strikeCart(id) {
            this.cart.shift(id)
        }
    }
})