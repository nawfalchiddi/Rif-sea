
import { useMemo, useState } from "react";
import "./index.css";

const rentals = [
  {
    id: 1,
    name: "Mediterranean Speedboat",
    type: "Boat",
    price: 1500,
    duration: "2 hours",
    capacity: 6,
    image:
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1000&q=85",
    description: "Discover the beautiful coastline around Al Hoceima.",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Luxury Sea Escape",
    type: "Yacht",
    price: 3500,
    duration: "3 hours",
    capacity: 10,
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1000&q=85",
    description: "A private trip with space for your friends and family.",
    tag: "Premium",
  },
  {
    id: 3,
    name: "Jet Ski Adventure",
    type: "Jet ski",
    price: 600,
    duration: "30 minutes",
    capacity: 1,
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1000&q=85",
    description: "Feel the speed and enjoy the Mediterranean.",
    tag: "Adventure",
  },
  {
    id: 4,
    name: "Coastal Family Boat",
    type: "Boat",
    price: 2000,
    duration: "3 hours",
    capacity: 8,
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=85",
    description: "Relax on the water and explore the coast together.",
    tag: "For families",
  },
];

const menu = [
  {
    id: 101,
    name: "Red Bull",
    category: "Drinks",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 102,
    name: "Fresh Orange Juice",
    category: "Drinks",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 103,
    name: "Club Sandwich",
    category: "Food",
    price: 55,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 104,
    name: "Beach Burger",
    category: "Food",
    price: 75,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  },
];

const money = (value) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);

function App() {
  const [page, setPage] = useState("Home");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [booking, setBooking] = useState(null);
  const [notice, setNotice] = useState("");
  const [cart, setCart] = useState([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [jetCode, setJetCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [records, setRecords] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [orderCustomer, setOrderCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const filteredRentals = useMemo(
    () =>
      rentals.filter((item) => {
        const matchesType = filter === "All" || item.type === filter;
        const matchesSearch = item.name
          .toLowerCase()
          .includes(search.toLowerCase());
        return matchesType && matchesSearch;
      }),
    [filter, search]
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const completed = records.filter(
    (item) => item.status === "Completed"
  );

  const bookingValue = completed.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const commission = bookingValue * 0.3;
  const partnerShare = bookingValue - commission;
  const totalExpenses = expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const estimatedProfit = commission - totalExpenses;

  function goTo(nextPage) {
    setPage(nextPage);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitBooking(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const date = form.get("date");
    const customerName = form.get("name");
    const phone = form.get("phone");

    if (!booking) return;

    if (booking.type === "Jet ski" && !verified) {
      setNotice("Complete the eligibility demo before booking a jet ski.");
      return;
    }

    const entry = {
      id: `RS-${Date.now().toString().slice(-8)}`,
      name: booking.name,
      type: booking.type,
      customer: customerName,
      phone,
      date,
      price: booking.price,
      status: "Pending",
    };

    setRecords((current) => [...current, entry]);
    setBooking(null);
    setNotice(
      `Request ${entry.id} created. This is a demo request, not a confirmed reservation or payment.`
    );
  }

  function verifyJetSki(event) {
    event.preventDefault();

    // DEMO ONLY:
    // A code entered here is NOT proof of a licence or legal eligibility.
    if (jetCode.trim().length >= 6) {
      setVerified(true);
      setNotice(
        "Demo code accepted. Real bookings must still pass secure document and operator checks."
      );
    } else {
      setVerified(false);
      setNotice("Enter a demo code with at least 6 characters.");
    }
  }

  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);

      if (found) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setNotice(`${product.name} added to your cart.`);
  }

  function changeQuantity(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function submitOrder(event) {
    event.preventDefault();

    if (!cart.length) {
      setNotice("Your cart is empty.");
      return;
    }

    const orderId = `FOOD-${Date.now().toString().slice(-6)}`;

    setNotice(
      `Demo order ${orderId} created for ${money(cartTotal)}. No restaurant has received this order and no payment was taken.`
    );
    setCart([]);
    setOrderOpen(false);
    setOrderCustomer({
      name: "",
      phone: "",
      address: "",
      notes: "",
    });
  }

  function addExpense(event) {
    event.preventDefault();

    const amount = Number(expenseAmount);

    if (!expenseName.trim() || !Number.isFinite(amount) || amount <= 0) {
      setNotice("Enter a valid expense description and positive amount.");
      return;
    }

    setExpenses((current) => [
      ...current,
      {
        id: Date.now(),
        name: expenseName.trim(),
        amount,
      },
    ]);

    setExpenseName("");
    setExpenseAmount("");
    setNotice("Expense added to this demo session.");
  }

  function updateBookingStatus(id, status) {
    setRecords((current) =>
      current.map((record) =>
        record.id === id ? { ...record, status } : record
      )
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => goTo("Home")}>
          <span className="brand-icon">R</span>
          <span>
            <strong>RIFSEA</strong>
            <small>AL HOCEIMA · MOROCCO</small>
          </span>
        </button>

        <nav className="navigation">
          {["Home", "Rentals", "Restaurants", "Jet Ski Access", "Dashboard"].map(
            (item) => (
              <button
                key={item}
                className={page === item ? "nav-link active" : "nav-link"}
                onClick={() => goTo(item)}
              >
                {item}
                {item === "Restaurants" && cart.length > 0 && (
                  <span className="cart-count">{cart.length}</span>
                )}
              </button>
            )
          )}
        </nav>

        <button className="button button-dark nav-cta" onClick={() => goTo("Rentals")}>
          Explore <span aria-hidden="true">↗</span>
        </button>
      </header>

      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss notice">
            ×
          </button>
        </div>
      )}

      <main>
        {page === "Home" && (
          <>
            <section className="hero">
              <div className="hero-shade" />
              <div className="hero-content">
                <span className="eyebrow light-eyebrow">
                  YOUR MEDITERRANEAN ESCAPE
                </span>
                <h1>
                  Life is better
                  <br />
                  <em>by the sea.</em>
                </h1>
                <p>
                  Discover boat trips, private yachts, jet ski adventures,
                  and local flavours in Al Hoceima.
                </p>

                <div className="hero-actions">
                  <button
                    className="button button-light"
                    onClick={() => goTo("Rentals")}
                  >
                    Explore rentals <span>↗</span>
                  </button>
                  <button
                    className="button button-glass"
                    onClick={() => goTo("Restaurants")}
                  >
                    Taste the coast
                  </button>
                </div>

                <div className="hero-foot">
                  <span>35°14′ N · RIF COAST</span>
                  <span>SEA · SUN · FREEDOM</span>
                </div>
              </div>
              <div className="hero-stamp">
                <span>MADE FOR</span>
                <strong>SEA DAYS</strong>
                <span>AL HOCEIMA</span>
              </div>
            </section>

            <section className="quick-search section-wrap">
              <div>
                <span className="eyebrow">PLAN YOUR DAY</span>
                <h2>Where will the sea take you?</h2>
              </div>
              <div className="quick-options">
                {["Boat", "Yacht", "Jet ski"].map((type) => (
                  <button
                    key={type}
                    className="quick-option"
                    onClick={() => {
                      setFilter(type);
                      goTo("Rentals");
                    }}
                  >
                    <span>{type === "Boat" ? "↗" : type === "Yacht" ? "◇" : "≈"}</span>
                    {type}
                  </button>
                ))}
              </div>
            </section>

            <section className="section-wrap section-space">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">THE SEA IS CALLING</span>
                  <h2>Find your next adventure</h2>
                </div>
                <button className="text-link" onClick={() => goTo("Rentals")}>
                  All rentals ↗
                </button>
              </div>
              <RentalGrid
                items={rentals.slice(0, 3)}
                onBook={(item) => {
                  setBooking(item);
                  setNotice("");
                }}
              />
            </section>

            <section className="experience-band">
              <div>
                <span className="eyebrow light-eyebrow">MORE THAN A BOAT TRIP</span>
                <h2>Make a whole day of it.</h2>
                <p>
                  Find a ride, order your favourite drinks, and enjoy the
                  Mediterranean at your own pace.
                </p>
                <button
                  className="button button-light"
                  onClick={() => goTo("Restaurants")}
                >
                  Explore food & drinks ↗
                </button>
              </div>
              <div className="experience-circle">
                <span>RIF</span>
                <strong>SEA</strong>
                <small>YOUR COASTAL GUIDE</small>
              </div>
            </section>

            <section className="section-wrap section-space">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">LOCAL FLAVOURS</span>
                  <h2>Bring the beach to your table</h2>
                </div>
                <button
                  className="text-link"
                  onClick={() => goTo("Restaurants")}
                >
                  Order now ↗
                </button>
              </div>
              <MenuGrid items={menu.slice(0, 3)} onAdd={addToCart} />
            </section>
          </>
        )}

        {page === "Rentals" && (
          <section className="section-wrap page-section">
            <span className="eyebrow">YOUR NEXT SEA ADVENTURE</span>
            <h1 className="page-title">Explore the fleet.</h1>
            <p className="page-intro">
              Compare activities, prices, durations, and capacity before
              requesting a booking.
            </p>

            <div className="filter-bar">
              <input
                aria-label="Search rentals"
                placeholder="Search by name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <div className="filter-buttons">
                {["All", "Boat", "Yacht", "Jet ski"].map((type) => (
                  <button
                    key={type}
                    className={filter === type ? "filter active" : "filter"}
                    onClick={() => setFilter(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <RentalGrid
              items={filteredRentals}
              onBook={(item) => {
                setBooking(item);
                setNotice("");
              }}
            />

            {!filteredRentals.length && (
              <p className="empty-state">No matching rentals found.</p>
            )}
          </section>
        )}

        {page === "Restaurants" && (
          <section className="section-wrap page-section">
            <span className="eyebrow">A TASTE OF THE RIF</span>
            <h1 className="page-title">Good food. Sea views.</h1>
            <p className="page-intro">
              Browse example menu items from a demo partner. Real restaurant
              availability and delivery must be connected before launch.
            </p>

            <div className="restaurant-banner">
              <div>
                <span className="eyebrow">YOUR BEACH BREAK</span>
                <h2>Cold drinks. Fresh bites.</h2>
                <p>Order favourites for pickup or approved delivery.</p>
              </div>
              <button
                className="button button-dark"
                onClick={() => setOrderOpen(true)}
              >
                View cart ({cart.length})
              </button>
            </div>

            <MenuGrid items={menu} onAdd={addToCart} />

            <div className="cart-panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">YOUR SELECTION</span>
                  <h2>Your cart</h2>
                </div>
                <strong className="cart-total">{money(cartTotal)}</strong>
              </div>

              {cart.length === 0 ? (
                <p className="empty-state">Your cart is empty. Add something tasty.</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div className="cart-row" key={item.id}>
                      <span>{item.name}</span>
                      <div className="quantity-controls">
                        <button onClick={() => changeQuantity(item.id, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                      </div>
                      <strong>{money(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                  <button
                    className="button button-dark"
                    onClick={() => setOrderOpen(true)}
                  >
                    Continue to order
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {page === "Jet Ski Access" && (
          <section className="section-wrap page-section narrow-section">
            <span className="eyebrow">SAFETY FIRST</span>
            <h1 className="page-title">Jet ski access.</h1>
            <p className="page-intro">
              A prototype access gate for jet ski bookings. Production access
              must be based on actual eligibility checks, not just a code.
            </p>

            <div className="verification-card">
              <div className="verification-symbol">✓</div>
              <h2>Check your eligibility</h2>
              <p>
                Enter a demo code of at least six characters to preview the
                interface. This does not verify your identity or licence.
              </p>

              <form onSubmit={verifyJetSki} className="form-stack">
                <label htmlFor="jet-code">Demo access code</label>
                <input
                  id="jet-code"
                  value={jetCode}
                  onChange={(event) => {
                    setJetCode(event.target.value);
                    setVerified(false);
                  }}
                  placeholder="Enter a demo code"
                  autoComplete="off"
                />
                <button className="button button-dark" type="submit">
                  Check demo code
                </button>
              </form>

              <div className={verified ? "status success" : "status"}>
                <span className="status-dot" />
                {verified
                  ? "Demo code accepted — real verification still required"
                  : "Eligibility not verified"}
              </div>

              <div className="safety-note">
                <strong>Before a real rental</strong>
                <p>
                  Verify applicable age limits, identity, required licence or
                  qualification, operator rules, safety briefing, and
                  insurance. Only authorised staff should approve restricted
                  access. Store sensitive documents securely and collect only
                  what is necessary.
                </p>
              </div>
            </div>
          </section>
        )}

        {page === "Dashboard" && (
          <section className="section-wrap page-section">
            <span className="eyebrow">YOUR BUSINESS, AT A GLANCE</span>
            <h1 className="page-title">Money & bookings.</h1>
            <p className="page-intro">
              Demo figures only. A production dashboard needs a secure backend
              and verified payment records.
            </p>

            <div className="demo-banner">
              <strong>DEMO MODE</strong>
              <span>
                Only completed bookings count toward commission. Pending
                requests are not income.
              </span>
            </div>

            <div className="stats-grid">
              <StatCard
                label="Completed booking value"
                value={money(bookingValue)}
                detail={`${completed.length} completed bookings`}
              />
              <StatCard
                label="Your 30% commission"
                value={money(commission)}
                detail="Before expenses and taxes"
              />
              <StatCard
                label="Partner share"
                value={money(partnerShare)}
                detail="Before agreed adjustments"
              />
              <StatCard
                label="Estimated operating result"
                value={money(estimatedProfit)}
                detail="Commission minus entered expenses"
                negative={estimatedProfit < 0}
              />
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-panel">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">TRANSACTION CONTROL</span>
                    <h2>Booking ledger</h2>
                  </div>
                </div>

                {records.length === 0 ? (
                  <p className="empty-state">
                    No demo bookings yet. Create one from the Rentals page.
                  </p>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Booking</th>
                          <th>Activity</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((record) => (
                          <tr key={record.id}>
                            <td>
                              <strong>{record.id}</strong>
                              <small>{record.customer}</small>
                            </td>
                            <td>{record.name}</td>
                            <td>{money(record.price)}</td>
                            <td>
                              <span className={`status-pill ${record.status.toLowerCase()}`}>
                                {record.status}
                              </span>
                            </td>
                            <td>
                              {record.status === "Pending" && (
                                <button
                                  className="small-action"
                                  onClick={() =>
                                    updateBookingStatus(record.id, "Completed")
                                  }
                                >
                                  Demo complete
                                </button>
                              )}
                              {record.status === "Completed" && (
                                <button
                                  className="small-action"
                                  onClick={() =>
                                    updateBookingStatus(record.id, "Pending")
                                  }
                                >
                                  Undo
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="small-note">
                  “Demo complete” is a simulation for testing calculations. It
                  does not confirm a real rental or payment.
                </p>
              </div>

              <div className="dashboard-panel">
                <span className="eyebrow">COST CONTROL</span>
                <h2>Record an expense</h2>
                <p className="muted">
                  Add advertising, hosting, transport, support, or other costs.
                </p>

                <form className="form-stack" onSubmit={addExpense}>
                  <label htmlFor="expense-name">Expense description</label>
                  <input
                    id="expense-name"
                    value={expenseName}
                    onChange={(event) => setExpenseName(event.target.value)}
                    placeholder="e.g. Advertising"
                    required
                  />

                  <label htmlFor="expense-amount">Amount (MAD)</label>
                  <input
                    id="expense-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={expenseAmount}
                    onChange={(event) => setExpenseAmount(event.target.value)}
                    placeholder="e.g. 500"
                    required
                  />

                  <button className="button button-dark" type="submit">
                    Add expense
                  </button>
                </form>

                <div className="expense-total">
                  <span>Total entered expenses</span>
                  <strong>{money(totalExpenses)}</strong>
                </div>

                {expenses.map((expense) => (
                  <div className="expense-row" key={expense.id}>
                    <span>{expense.name}</span>
                    <strong>{money(expense.amount)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="finance-explainer">
              <h2>Understand your money</h2>
              <div className="finance-equation">
                <span>Completed rentals</span>
                <b>× 30%</b>
                <span>Commission revenue</span>
                <b>−</b>
                <span>Operating expenses</span>
                <b>=</b>
                <span>Estimated result</span>
              </div>
              <p>
                This simplified calculation excludes taxes, refunds, payment
                fees, chargebacks, unpaid bookings, and other costs unless you
                add them. Add those fields before relying on this dashboard for
                real business decisions.
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <span className="brand-icon">R</span>
          <div>
            <strong>RIFSEA</strong>
            <small>THE RIF COAST, REIMAGINED.</small>
          </div>
        </div>
        <p>Discover the sea. Support local businesses.</p>
        <span>© {new Date().getFullYear()} RifSea · Prototype</span>
      </footer>

      {booking && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setBooking(null);
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
          >
            <button
              className="modal-close"
              onClick={() => setBooking(null)}
              aria-label="Close booking form"
            >
              ×
            </button>

            <span className="eyebrow">BOOK YOUR EXPERIENCE</span>
            <h2 id="booking-title">{booking.name}</h2>
            <p className="modal-price">
              {money(booking.price)} <span>/ {booking.duration}</span>
            </p>
            <p className="muted">
              This creates a local demo request only. It does not reserve
              equipment or collect money.
            </p>

            <form className="form-stack" onSubmit={submitBooking}>
              <label htmlFor="booking-name">Full name</label>
              <input id="booking-name" name="name" required />

              <label htmlFor="booking-phone">Phone number</label>
              <input
                id="booking-phone"
                name="phone"
                type="tel"
                placeholder="+212..."
                required
              />

              <label htmlFor="booking-date">Preferred date</label>
              <input
                id="booking-date"
                name="date"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                required
              />

              <label>Rental details</label>
              <div className="booking-summary">
                <span>{booking.type}</span>
                <span>Up to {booking.capacity} people</span>
                <strong>{money(booking.price)}</strong>
              </div>

              {booking.type === "Jet ski" && (
                <div className="safety-note">
                  Jet ski eligibility must be checked before an actual
                  reservation can be confirmed.
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      setBooking(null);
                      goTo("Jet Ski Access");
                    }}
                  >
                    Open eligibility page ↗
                  </button>
                </div>
              )}

              <button className="button button-dark full-button" type="submit">
                Submit demo request
              </button>
            </form>
          </section>
        </div>
      )}

      {orderOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOrderOpen(false);
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-title"
          >
            <button
              className="modal-close"
              onClick={() => setOrderOpen(false)}
              aria-label="Close order form"
            >
              ×
            </button>
            <span className="eyebrow">RESTAURANT ORDER</span>
            <h2 id="order-title">Almost ready.</h2>

            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <div className="order-summary">
                  {cart.map((item) => (
                    <div className="cart-row" key={item.id}>
                      <span>{item.name} × {item.quantity}</span>
                      <strong>{money(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                  <div className="expense-total">
                    <span>Subtotal</span>
                    <strong>{money(cartTotal)}</strong>
                  </div>
                </div>

                <form className="form-stack" onSubmit={submitOrder}>
                  <label htmlFor="order-name">Full name</label>
                  <input
                    id="order-name"
                    value={orderCustomer.name}
                    onChange={(event) =>
                      setOrderCustomer({
                        ...orderCustomer,
                        name: event.target.value,
                      })
                    }
                    required
                  />

                  <label htmlFor="order-phone">Phone number</label>
                  <input
                    id="order-phone"
                    type="tel"
                    value={orderCustomer.phone}
                    onChange={(event) =>
                      setOrderCustomer({
                        ...orderCustomer,
                        phone: event.target.value,
                      })
                    }
                    required
                  />

                  <label htmlFor="order-address">
                    Pickup details or delivery address
                  </label>
                  <input
                    id="order-address"
                    value={orderCustomer.address}
                    onChange={(event) =>
                      setOrderCustomer({
                        ...orderCustomer,
                        address: event.target.value,
                      })
                    }
                    placeholder="Confirm availability with the restaurant"
                    required
                  />

                  <label htmlFor="order-notes">Order notes (optional)</label>
                  <textarea
                    id="order-notes"
                    value={orderCustomer.notes}
                    onChange={(event) =>
                      setOrderCustomer({
                        ...orderCustomer,
                        notes: event.target.value,
                      })
                    }
                  />

                  <button className="button button-dark full-button" type="submit">
                    Submit demo order
                  </button>
                  <p className="small-note">
                    No payment is taken. This prototype does not transmit the
                    order to a restaurant.
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function RentalGrid({ items, onBook }) {
  return (
    <div className="rental-grid">
      {items.map((item) => (
        <article className="rental-card" key={item.id}>
          <div className="rental-image">
            <img src={item.image} alt={item.name} loading="lazy" />
            <span className="image-tag">{item.tag}</span>
            <span className="type-tag">{item.type}</span>
          </div>

          <div className="rental-body">
            <div className="rental-meta">
              <span>⌁ {item.duration}</span>
              <span>♧ Up to {item.capacity}</span>
            </div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>

            <div className="rental-bottom">
              <div>
                <strong>{money(item.price)}</strong>
                <small>/ {item.duration}</small>
              </div>
              <button
                className="round-arrow"
                onClick={() => onBook(item)}
                aria-label={`Request booking for ${item.name}`}
              >
                ↗
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function MenuGrid({ items, onAdd }) {
  return (
    <div className="menu-grid">
      {items.map((item) => (
        <article className="menu-card" key={item.id}>
          <img src={item.image} alt={item.name} loading="lazy" />
          <div className="menu-card-body">
            <span className="eyebrow">{item.category}</span>
            <h3>{item.name}</h3>
            <div className="menu-bottom">
              <strong>{money(item.price)}</strong>
              <button
                className="round-arrow"
                onClick={() => onAdd(item)}
                aria-label={`Add ${item.name} to cart`}
              >
                +
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function StatCard({ label, value, detail, negative = false }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong className={negative ? "negative-value" : ""}>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

export default App;
