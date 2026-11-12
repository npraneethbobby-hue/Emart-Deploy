
import React, { useState } from "react";
import { mobileData } from "../data/mobiles";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const MobilePage = () => {
  const [selectedProduct, setSelectedProduct] = useState([]);

  // Get unique company names
  const companies = [
    ...new Set(mobileData.map((phone) => phone.company)),
  ];

  // Handle company filters
  const companyHandler = (company) => {
    setSelectedProduct((previous) =>
      previous.includes(company)
        ? previous.filter((item) => item !== company)
        : [...previous, company]
    );
  };

  // Filter products
  const filteredProduct =
    selectedProduct.length === 0
      ? mobileData
      : mobileData.filter((phone) =>
          selectedProduct.includes(phone.company)
        );

  return (
    <>
      <Navbar />

      <main className="fullpage mobile-page">

        {/* Filters */}
        <aside className="pro-selected mobile-filters">
          <h3 className="filter-heading">Filter Products</h3>

          {companies.map((company) => (
            <div className="pro-input" key={company}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedProduct.includes(company)}
                  onChange={() => companyHandler(company)}
                />
                {company}
              </label>
            </div>
          ))}

          {selectedProduct.length > 0 && (
            <button
              className="clear-filters"
              onClick={() => setSelectedProduct([])}
            >
              Clear Filters
            </button>
          )}
        </aside>

        {/* Products */}
        <section className="mobile-products">

          <div className="mobile-heading">
            <div>
              <h2>Explore Mobiles</h2>
              <p>{filteredProduct.length} products available</p>
            </div>
          </div>

          <div className="pageSection">
            {filteredProduct.map((item) => (
              <article className="mobile-product-card" key={item.id}>

                <Link to={`/mobiles/${item.id}`}>
                  <div className="pageImg">
                    <img
                      src={item.image}
                      alt={`${item.company} ${item.model}`}
                      loading="lazy"
                    />
                  </div>
                </Link>

                <div className="proModel">
                  <p className="mobile-company">{item.company}</p>
                  <h3>{item.model}</h3>

                  <Link
                    to={`/mobiles/${item.id}`}
                    className="mobile-view-button"
                  >
                    View Details
                  </Link>
                </div>

              </article>
            ))}
          </div>

          {filteredProduct.length === 0 && (
            <p className="no-products">No products found.</p>
          )}

        </section>
      </main>
    </>
  );
};

export default MobilePage;
