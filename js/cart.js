// Web/js/cart.js
class CartManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('kilowat_cart')) || [];
    }

    save() {
        localStorage.setItem('kilowat_cart', JSON.stringify(this.items));
        this.updateBadge();
    }

    addItem(product) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price_cup: Number(product.price_cup),
                image_url: product.image_url,
                qty: 1
            });
        }
        this.save();
    }

    removeItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
    }

    updateQty(id, delta) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                this.removeItem(id);
                return;
            }
            this.save();
        }
    }

    clear() {
        this.items = [];
        this.save();
    }

    getTotalCUP() {
        return this.items.reduce((sum, item) => sum + (item.price_cup * item.qty), 0);
    }

    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    }

    updateBadge() {
        const badges = document.querySelectorAll('.cart-count-badge');
        const count = this.getItemCount();
        badges.forEach(b => {
            b.innerText = count;
            b.style.display = count > 0 ? 'flex' : 'none';
        });
    }
}

const cart = new CartManager();
document.addEventListener('DOMContentLoaded', () => cart.updateBadge());