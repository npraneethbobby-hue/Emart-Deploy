
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const Order = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const deliveryCharge = totalPrice >= 1000 ? 0 : 50;
  const grandTotal = totalPrice + deliveryCharge;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) return;

    const order = {
      orderId: `EM${Date.now()}`,
      customer: form,
      products: cartItems,
      totalItems,
      subtotal: totalPrice,
      deliveryCharge,
      grandTotal,
      paymentMethod: "Cash on Delivery",
      orderDate: new Date().toLocaleString(),
    };

    setOrderDetails(order);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <main className="order-success">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with E-Mart.</p>

          <div className="success-details">
            <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
            <p><strong>Name:</strong> {orderDetails.customer.fullName}</p>
            <p><strong>Payment:</strong> Cash on Delivery</p>
            <p>
              <strong>Order Total:</strong>{" "}
              ₹{orderDetails.grandTotal.toLocaleString("en-IN")}
            </p>
            <p><strong>Delivery Address:</strong> {orderDetails.customer.address}, {orderDetails.customer.city}, {orderDetails.customer.state} - {orderDetails.customer.pincode}</p>
          </div>

          <button onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </main>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add products before proceeding to checkout.</p>
          <Link to="/mobiles">Continue Shopping</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <h1>Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="checkout-layout">
          <section className="checkout-form">
            <h2>Delivery Details</h2>

            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />

            <label>Full Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House number, street, area"
              rows="3"
              required
            />

            <div className="checkout-two-columns">
              <div>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label>PIN Code</label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="6-digit PIN code"
              pattern="[0-9]{6}"
              maxLength="6"
              required
            />

            <h2 className="payment-heading">Payment Method</h2>
            <div className="payment-option">
              <input type="radio" checked readOnly />
              <span>Cash on Delivery</span>
            </div>
            <p className="payment-note">
              Pay when your order is delivered.
            </p>
          </section>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div className="checkout-product" key={item.id}>
                <img src={item.image} alt={item.model || item.product || "Product"} />

                <div>
                  <h3>{item.product || item.company || "Product"}</h3>
                  <p>{item.model || ""}</p>
                  <p>Quantity: {item.quantity || 1}</p>
                  <strong>
                    ₹{(
                      Number(item.price || 0) * (item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            ))}

            <div className="summary-line">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-line">
              <span>Delivery</span>
              <span>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge}`}
              </span>
            </div>

            <div className="summary-total">
              <span>Grand Total</span>
              <span>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>

            <Link to="/cart" className="back-to-cart">
              Back to Cart
            </Link>
          </aside>
        </form>
      </main>
    </>
  );
};

export default Order;
