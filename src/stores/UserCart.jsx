
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";

const UserCart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const navigate = useNavigate();

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <h2 className="cart-page-title">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <button onClick={() => navigate("/mobiles")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-layout">

            {/* Cart Products */}
            <section className="cart-products">
              <div className="cart-top">
                <h3>Cart Items ({totalItems})</h3>

                <button className="clear-cart" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>

              {cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.model || item.product} />
                  </div>

                  <div className="cart-item-details">
                    <h3>{item.product || item.company}</h3>
                    <p>{item.model}</p>

                    <strong className="cart-item-price">
                      {formatPrice(item.price)}
                    </strong>

                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            (item.quantity || 1) - 1
                          )
                        }
                        disabled={(item.quantity || 1) <= 1}
                      >
                        −
                      </button>

                      <span>{item.quantity || 1}</span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            (item.quantity || 1) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <strong>
                      {formatPrice(
                        Number(item.price || 0) * (item.quantity || 1)
                      )}
                    </strong>

                    <button
                      className="removeBtn"
                      onClick={() => removeFromCart(item)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </section>

            {/* Order Summary */}
            <aside className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span className="free-delivery">FREE</span>
              </div>

              <div className="summary-total">
                <span>Grand Total</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>

              <button
                className="checkout-button"
                onClick={() => navigate("/order")}
              >
                Proceed to Checkout →
              </button>

              <button
                className="continue-shopping"
                onClick={() => navigate("/mobiles")}
              >
                Continue Shopping
              </button>
            </aside>

          </div>
        )}
      </main>
    </>
  );
};

export default UserCart;
