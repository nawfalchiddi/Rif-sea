import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { LANGUAGES, translate } from "./i18n";

const rentals = [
  {
    id: 1,
    name: "Mediterranean Speedboat",
    type: "Boat",
    price: 1500,
    duration: "2 hours",
    capacity: 6,
    image:
      "https://img.getmyboat.com/images/9ba3a9cf-dab3-479e-be3a-97d820ff9f4e/-processed.png",
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
      "https://www.superyacht.eu/wp-content/uploads/2019/10/riva-110_apertura.jpg",
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
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/fe/04/81/jet-ski-2017.jpg?w=1200&h=-1&s=1",
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
      "https://www.grunge.com/img/gallery/times-red-bull-got-in-serious-trouble/intro-1629228717.jpg",
  },
  {
    id: 102,
    name: "Fresh Juice",
    category: "Drinks",
    price: 25,
    image:
      "https://assets.magimix.com/files/rec_23156/photo_mojito-blender-photo.jpg",
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

// Water gear shop data. Names are translated in src/i18n.js (gear.<id>).
// image: paste a photo URL here; leave "" to show the icon tile instead.
const CLOTHING_SIZES = ["S", "M", "L", "XL"];
const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];

const gear = [
  { id: 201, category: "Clothing", price: 450, icon: "🏄", image: "https://www.f2boards.com/media/pic/c9fd0a6f22e55e8cc0b74f23ac41c1ed/dsc-5255.jpg", sizes: CLOTHING_SIZES },
  { id: 202, category: "Clothing", price: 180, icon: "👕", image: "https://shopuni-t.com/cdn/shop/products/Swim-More-T-Shirt-for-Men-Perfect-for-Swimming-Enthusiasts-and-Beach-Lovers-Uni-T-27006187.jpg?v=1786585643&width=1946", sizes: CLOTHING_SIZES },
  { id: 203, category: "Clothing", price: 160, icon: "🩳", image: "https://cdn11.bigcommerce.com/s-do3nxddvbo/images/stencil/1280x1280/products/3103/3124/2016080517441848_1__44618.1592686824.jpg?c=1", sizes: CLOTHING_SIZES },
  { id: 204, category: "Eyewear", price: 90, icon: "", image: "https://athletehome-eg.com/cdn/shop/files/35183.png?v=1781610645", sizes: [] },
  { id: 205, category: "Eyewear", price: 220, icon: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfzFCV4M_9cC6gu9J7sTsgJESZMrTC9fq-1pTe6GE_Xg&s=10", sizes: [] },
  { id: 206, category: "Eyewear", price: 140, icon: "🕶️", image: "https://www.milosport.com/cdn/shop/files/blue_sand.png?v=1781209380&width=1024", sizes: [] },
  { id: 207, category: "Accessories", price: 110, icon: "👟", image: "https://digitalcontent.api.tesco.com/v2/media/marketplace/f5a41c7c-6ce3-4fc7-8f3c-a9289b55dc38/21772fc9129944549b845b68fdd9c8be_1684367926.jpeg?h=960&w=960", sizes: SHOE_SIZES },
  { id: 208, category: "Accessories", price: 60, icon: "📱", image: "https://www.swimcore.com/cdn/shop/collections/Untitled_design_4088fff0-9b00-49ff-808a-f916953db2df.jpg?v=1684406957&width=2400", sizes: [] },
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
  const [gearFilter, setGearFilter] = useState("All");
  const [applications, setApplications] = useState([]);
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("rifsea-lang");
      return LANGUAGES.some((item) => item.code === saved) ? saved : "en";
    } catch {
      return "en";
    }
  });

  // t("key") -> text in the chosen language. t("key", { n: 3 }) fills {n}.
  const t = (key, vars) => translate(lang, key, vars);
  const cartLabel = (item) =>
    item.size ? `${t(item.nameKey)} (${item.size})` : t(item.nameKey);

  useEffect(() => {
    document.documentElement.lang = lang === "no" ? "nb" : lang;
    try {
      localStorage.setItem("rifsea-lang", lang);
    } catch {
      /* storage blocked: the language simply is not remembered */
    }
  }, [lang]);

  const filteredGear = gear.filter(
    (item) => gearFilter === "All" || item.category === gearFilter
  );

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
    setNotice(t("booking.created", { id: entry.id }));
  }

  function addToCart(product) {
    // menu items use "menu.<id>"; gear items bring their own nameKey
    const nameKey = product.nameKey ?? `menu.${product.id}`;

    setCart((current) => {
      const found = current.find((item) => item.id === product.id);

      if (found) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, nameKey, quantity: 1 }];
    });

    setNotice(t("cart.added", { name: cartLabel({ ...product, nameKey }) }));
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
      setNotice(t("cart.emptyNotice"));
      return;
    }

    const orderId = `FOOD-${Date.now().toString().slice(-6)}`;

    setNotice(t("order.created", { id: orderId, total: money(cartTotal) }));
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

  function addApplication(application) {
    setApplications((current) => [...current, application]);
    setNotice(t("partner.sent", { id: application.id }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateApplicationStatus(id, status) 
  {
    setApplications((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
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
          {["Home", "Rentals", "Restaurants", "Water Gear", "Partners", "Dashboard"].map(
            (item) => (
              <button
                key={item}
                className={page === item ? "nav-link active" : "nav-link"}
                onClick={() => goTo(item)}
              >
                {t(`nav.${item}`)}
                {(item === "Restaurants" || item === "Water Gear") &&
                  cart.length > 0 && (
                    <span className="cart-count">{cart.length}</span>
                  )}
              </button>
            )
          )}
        </nav>

        <select
          className="lang-select"
          value={lang}
          onChange={(event) => setLang(event.target.value)}
          aria-label={t("lang.label")}
        >
          {LANGUAGES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>

        <button className="button button-dark nav-cta" onClick={() => goTo("Rentals")}>
          {t("nav.explore")} <span aria-hidden="true">↗</span>
        </button>
      </header>

      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label={t("notice.dismiss")}>
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
                  {t("hero.eyebrow")}
                </span>
                <h1>
                  {t("hero.title1")}
                  <br />
                  <em>{t("hero.title2")}</em>
                </h1>
                <p>
                  {t("hero.text")}
                </p>

                <div className="hero-actions">
                  <button
                    className="button button-light"
                    onClick={() => goTo("Rentals")}
                  >
                    {t("hero.explore")} <span>↗</span>
                  </button>
                  <button
                    className="button button-glass"
                    onClick={() => goTo("Restaurants")}
                  >
                    {t("hero.taste")}
                  </button>
                </div>

                <div className="hero-foot">
                  <span>35°14′ N · RIF COAST</span>
                  <span>{t("hero.foot2")}</span>
                </div>
              </div>
              <div className="hero-stamp">
                <span>{t("hero.stamp1")}</span>
                <strong>{t("hero.stamp2")}</strong>
                <span>AL HOCEIMA</span>
              </div>
            </section>

            <section className="quick-search section-wrap">
              <div>
                <span className="eyebrow">{t("quick.eyebrow")}</span>
                <h2>{t("quick.title")}</h2>
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
                    {t(`type.${type}`)}
                  </button>
                ))}
              </div>
            </section>

            <section className="section-wrap section-space">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">{t("home.adv.eyebrow")}</span>
                  <h2>{t("home.adv.title")}</h2>
                </div>
                <button className="text-link" onClick={() => goTo("Rentals")}>
                  {t("home.allRentals")}
                </button>
              </div>
              <RentalGrid
                items={rentals.slice(0, 3)}
                t={t}
                onBook={(item) => {
                  setBooking(item);
                  setNotice("");
                }}
              />
            </section>

            <section className="experience-band">
              <div>
                <span className="eyebrow light-eyebrow">{t("band.eyebrow")}</span>
                <h2>{t("band.title")}</h2>
                <p>
                  {t("band.text")}
                </p>
                <button
                  className="button button-light"
                  onClick={() => goTo("Restaurants")}
                >
                  {t("band.button")}
                </button>
              </div>
              <div className="experience-circle">
                <span>RIF</span>
                <strong>SEA</strong>
                <small>{t("band.guide")}</small>
              </div>
            </section>

            <section className="section-wrap section-space">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">{t("home.food.eyebrow")}</span>
                  <h2>{t("home.food.title")}</h2>
                </div>
                <button
                  className="text-link"
                  onClick={() => goTo("Restaurants")}
                >
                  {t("home.orderNow")}
                </button>
              </div>
              <MenuGrid items={menu.slice(0, 3)} onAdd={addToCart} t={t} />
            </section>

            <section className="section-wrap section-space">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">{t("home.gear.eyebrow")}</span>
                  <h2>{t("home.gear.title")}</h2>
                </div>
                <button className="text-link" onClick={() => goTo("Water Gear")}>
                  {t("home.allGear")}
                </button>
              </div>
              <GearGrid items={gear.slice(0, 3)} onAdd={addToCart} t={t} />
            </section>
          </>
        )}

        {page === "Rentals" && (
          <section className="section-wrap page-section">
            <span className="eyebrow">{t("rentals.eyebrow")}</span>
            <h1 className="page-title">{t("rentals.title")}</h1>
            <p className="page-intro">
              {t("rentals.intro")}
            </p>

            <div className="filter-bar">
              <input
                aria-label={t("rentals.searchAria")}
                placeholder={t("rentals.searchPh")}
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
                    {t(`type.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            <RentalGrid
              items={filteredRentals}
              t={t}
              onBook={(item) => {
                setBooking(item);
                setNotice("");
              }}
            />

            {!filteredRentals.length && (
              <p className="empty-state">{t("rentals.empty")}</p>
            )}
          </section>
        )}

        {page === "Restaurants" && (
          <section className="section-wrap page-section">
            <span className="eyebrow">{t("rest.eyebrow")}</span>
            <h1 className="page-title">{t("rest.title")}</h1>
            <p className="page-intro">
              {t("rest.intro")}
            </p>

            <div className="restaurant-banner">
              <div>
                <span className="eyebrow">{t("rest.banner.eyebrow")}</span>
                <h2>{t("rest.banner.title")}</h2>
                <p>{t("rest.banner.text")}</p>
              </div>
              <button
                className="button button-dark"
                onClick={() => setOrderOpen(true)}
              >
                {t("rest.viewCart", { n: cart.length })}
              </button>
            </div>

            <MenuGrid items={menu} onAdd={addToCart} t={t} />

            <div className="cart-panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">{t("cart.eyebrow")}</span>
                  <h2>{t("cart.title")}</h2>
                </div>
                <strong className="cart-total">{money(cartTotal)}</strong>
              </div>

              {cart.length === 0 ? (
                <p className="empty-state">{t("cart.empty")}</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div className="cart-row" key={item.id}>
                      <span>{cartLabel(item)}</span>
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
                    {t("cart.continue")}
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {page === "Water Gear" && (
          <section className="section-wrap page-section">
            <span className="eyebrow">{t("gear.eyebrow")}</span>
            <h1 className="page-title">{t("gear.title")}</h1>
            <p className="page-intro">{t("gear.intro")}</p>

            <div className="filter-bar">
              <div className="filter-buttons">
                {["All", "Clothing", "Eyewear", "Accessories"].map((category) => (
                  <button
                    key={category}
                    className={gearFilter === category ? "filter active" : "filter"}
                    onClick={() => setGearFilter(category)}
                  >
                    {t(`gear.cat.${category}`)}
                  </button>
                ))}
              </div>
              <button className="button button-dark" onClick={() => setOrderOpen(true)}>
                {t("rest.viewCart", { n: cart.length })}
              </button>
            </div>

            <GearGrid items={filteredGear} onAdd={addToCart} t={t} />
          </section>
        )}

        {page === "Partners" && (
          <section className="section-wrap page-section narrow-section">
            <span className="eyebrow">{t("partner.eyebrow")}</span>
            <h1 className="page-title">{t("partner.title")}</h1>
            <p className="page-intro">{t("partner.intro")}</p>

            <div className="verification-card">
              <PartnerForm t={t} onSubmit={addApplication} />
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

            <div className="dashboard-panel">
              <span className="eyebrow">PARTNER REVIEW</span>
              <h2>Partner applications</h2>

              {applications.length === 0 ? (
                <p className="empty-state">No partner applications yet.</p>
              ) : (
                applications.map((app) => (
                  <div className="application-row" key={app.id}>
                    <div>
                      <strong>
                        {app.name}
                        {app.business ? ` · ${app.business}` : ""}
                      </strong>
                      <small>
                        {app.id} · {app.kind === "rental" ? "Boat / jet ski owner" : "Restaurant"} · {app.phone}
                      </small>
                      <small>
                        PDF: {app.fileName} ({app.fileSizeKb} KB)
                      </small>
                      <small>
                        {app.items
                          .map((entry) => `${entry.quantity}× ${entry.what} (${entry.kind})`)
                          .join(", ")}
                      </small>
                    </div>
                    <div className="application-actions">
                      <span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span>
                      {app.status === "Pending" && (
                        <>
                          <button className="small-action" onClick={() => updateApplicationStatus(app.id, "Approved")}>
                            Approve
                          </button>
                          <button className="small-action" onClick={() => updateApplicationStatus(app.id, "Rejected")}>
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
              <p className="small-note">
                Approval here is only a demo. In production, check the PDF itself against
                the official register before approving.
              </p>
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
            <small>{t("footer.tag")}</small>
          </div>
        </div>
        <p>{t("footer.text")}</p>
        <span>© {new Date().getFullYear()} RifSea · {t("footer.proto")}</span>
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
              aria-label={t("booking.close")}
            >
              ×
            </button>

            <span className="eyebrow">{t("booking.eyebrow")}</span>
            <h2 id="booking-title">{t(`rental.${booking.id}.name`)}</h2>
            <p className="modal-price">
              {money(booking.price)} <span>/ {t(`dur.${booking.duration}`)}</span>
            </p>
            <p className="muted">
              {t("booking.demo")}
            </p>

            <form className="form-stack" onSubmit={submitBooking}>
              <label htmlFor="booking-name">{t("booking.name")}</label>
              <input id="booking-name" name="name" required />

              <label htmlFor="booking-phone">{t("booking.phone")}</label>
              <input
                id="booking-phone"
                name="phone"
                type="tel"
                placeholder="+212..."
                required
              />

              <label htmlFor="booking-date">{t("booking.date")}</label>
              <input
                id="booking-date"
                name="date"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                required
              />

              <label>{t("booking.details")}</label>
              <div className="booking-summary">
                <span>{t(`type.${booking.type}`)}</span>
                <span>{t("booking.people", { n: booking.capacity })}</span>
                <strong>{money(booking.price)}</strong>
              </div>

              {booking.type === "Jet ski" && (
                <div className="safety-note">{t("booking.jetNote")}</div>
              )}

              <button className="button button-dark full-button" type="submit">
                {t("booking.submit")}
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
              aria-label={t("order.close")}
            >
              ×
            </button>
            <span className="eyebrow">{t("order.eyebrow")}</span>
            <h2 id="order-title">{t("order.title")}</h2>

            {cart.length === 0 ? (
              <p>{t("cart.emptyNotice")}</p>
            ) : (
              <>
                <div className="order-summary">
                  {cart.map((item) => (
                    <div className="cart-row" key={item.id}>
                      <span>{cartLabel(item)} × {item.quantity}</span>
                      <strong>{money(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                  <div className="expense-total">
                    <span>{t("order.subtotal")}</span>
                    <strong>{money(cartTotal)}</strong>
                  </div>
                </div>

                <form className="form-stack" onSubmit={submitOrder}>
                  <label htmlFor="order-name">{t("order.name")}</label>
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

                  <label htmlFor="order-phone">{t("order.phone")}</label>
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

                  <label htmlFor="order-address">{t("order.address")}</label>
                  <input
                    id="order-address"
                    value={orderCustomer.address}
                    onChange={(event) =>
                      setOrderCustomer({
                        ...orderCustomer,
                        address: event.target.value,
                      })
                    }
                    placeholder={t("order.addressPh")}
                    required
                  />

                  <label htmlFor="order-notes">{t("order.notes")}</label>
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
                    {t("order.submit")}
                  </button>
                  <p className="small-note">
                    {t("order.note")}
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

function RentalGrid({ items, onBook, t }) {
  return (
    <div className="rental-grid">
      {items.map((item) => {
        const name = t(`rental.${item.id}.name`);
        const duration = t(`dur.${item.duration}`);

        return (
          <article className="rental-card" key={item.id}>
            <div className="rental-image">
              <img src={item.image} alt={name} loading="lazy" />
              <span className="image-tag">{t(`tag.${item.tag}`)}</span>
              <span className="type-tag">{t(`type.${item.type}`)}</span>
            </div>

            <div className="rental-body">
              <div className="rental-meta">
                <span>⌁ {duration}</span>
                <span>♧ {t("rental.upTo", { n: item.capacity })}</span>
              </div>
              <h3>{name}</h3>
              <p>{t(`rental.${item.id}.desc`)}</p>

              <div className="rental-bottom">
                <div>
                  <strong>{money(item.price)}</strong>
                  <small>/ {duration}</small>
                </div>
                <button
                  className="round-arrow"
                  onClick={() => onBook(item)}
                  aria-label={t("rental.bookAria", { name })}
                >
                  ↗
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function MenuGrid({ items, onAdd, t }) {
  return (
    <div className="menu-grid">
      {items.map((item) => {
        const name = t(`menu.${item.id}`);

        return (
          <article className="menu-card" key={item.id}>
            <img src={item.image} alt={name} loading="lazy" />
            <div className="menu-card-body">
              <span className="eyebrow">{t(`cat.${item.category}`)}</span>
              <h3>{name}</h3>
              <div className="menu-bottom">
                <strong>{money(item.price)}</strong>
                <button
                  className="round-arrow"
                  onClick={() => onAdd(item)}
                  aria-label={t("menu.addAria", { name })}
                >
                  +
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// Water gear cards: same look as the menu cards, plus a size picker.
function GearGrid({ items, onAdd, t }) {
  const [chosen, setChosen] = useState({});

  return (
    <div className="menu-grid">
      {items.map((item) => {
        const name = t(`gear.${item.id}`);
        const hasSizes = item.sizes.length > 0;
        const size = hasSizes ? chosen[item.id] ?? item.sizes[0] : "";

        return (
          <article className="menu-card" key={item.id}>
            {item.image ? (
              <img src={item.image} alt={name} loading="lazy" />
            ) : (
              <div className="gear-art" aria-hidden="true">
                {item.icon}
              </div>
            )}
            <div className="menu-card-body">
              <span className="eyebrow">{t(`gear.cat.${item.category}`)}</span>
              <h3>{name}</h3>

              {hasSizes ? (
                <label className="gear-size">
                  <span>{t("gear.size")}</span>
                  <select
                    value={size}
                    onChange={(event) =>
                      setChosen({ ...chosen, [item.id]: event.target.value })
                    }
                  >
                    {item.sizes.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="gear-size-note">{t("gear.oneSize")}</p>
              )}

              <div className="menu-bottom">
                <strong>{money(item.price)}</strong>
                <button
                  className="round-arrow"
                  onClick={() =>
                    onAdd({
                      id: `${item.id}-${size || "one"}`,
                      nameKey: `gear.${item.id}`,
                      size,
                      price: item.price,
                    })
                  }
                  aria-label={t("menu.addAria", { name })}
                >
                  +
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------
// Partner onboarding: boat / jet ski / yacht owners and restaurant owners.
// Collects name, phone, a PDF licence/permit, and what they will offer
// (type + description + how many). The PDF is checked in the browser
// (type, size, real "%PDF-" signature) but only a SERVER can store it
// safely. See the PRODUCTION note inside handleSubmit.
// ---------------------------------------------------------------------
const MAX_PDF_BYTES = 5 * 1024 * 1024;
const RENTAL_KINDS = ["Jet ski", "Boat", "Yacht"];
const RESTAURANT_KINDS = ["Food", "Drinks"];

const newItem = (kind) => ({
  key: `${Date.now()}-${Math.random()}`,
  kind,
  what: "",
  quantity: "1",
});

function PartnerForm({ t, onSubmit }) {
  const [kind, setKind] = useState("rental");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([newItem("Jet ski")]);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  const kinds = kind === "rental" ? RENTAL_KINDS : RESTAURANT_KINDS;
  const kindLabel = (value) =>
    t(kind === "rental" ? `type.${value}` : `cat.${value}`);

  function resetFile() {
    setFile(null);
    setFileInputKey((current) => current + 1); // clears the <input type="file">
  }

  function changeKind(next) {
    setKind(next);
    setItems([newItem(next === "rental" ? "Jet ski" : "Food")]);
    resetFile(); // a boat licence is not a hygiene permit: ask again
    setError("");
  }

  function updateItem(key, patch) {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item))
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!file) return setError(t("partner.err.noFile"));
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return setError(t("partner.err.pdf"));
    }
    if (file.size > MAX_PDF_BYTES) return setError(t("partner.err.size"));

    const cleanItems = items.map((item) => ({
      ...item,
      what: item.what.trim(),
      quantity: Number(item.quantity),
    }));
    const itemsAreValid = cleanItems.every(
      (item) => item.what && Number.isInteger(item.quantity) && item.quantity >= 1
    );
    if (!itemsAreValid) return setError(t("partner.err.items"));
    if (!consent) return setError(t("partner.err.consent"));

    // A file name or browser MIME type can be faked. Real PDFs start with "%PDF-".
    const signature = await file.slice(0, 5).text();
    if (signature !== "%PDF-") return setError(t("partner.err.fake"));

    // PRODUCTION: send the real file to YOUR server here (never keep it only
    // in the browser). Example:
    //   const body = new FormData();
    //   body.append("document", file);
    //   body.append("data", JSON.stringify({ kind, name, phone, business, items: cleanItems }));
    //   await fetch("/api/partner-applications", { method: "POST", body });
    onSubmit({
      id: `PA-${Date.now().toString().slice(-6)}`,
      kind,
      name: name.trim(),
      phone: phone.trim(),
      business: business.trim(),
      fileName: file.name,
      fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
      items: cleanItems,
      status: "Pending",
    });

    setName("");
    setPhone("");
    setBusiness("");
    setConsent(false);
    setItems([newItem(kind === "rental" ? "Jet ski" : "Food")]);
    resetFile();
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <span className="field-title">{t("partner.iAm")}</span>
      <div className="partner-type" role="radiogroup" aria-label={t("partner.iAm")}>
        {["rental", "restaurant"].map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={kind === option}
            className={kind === option ? "filter active" : "filter"}
            onClick={() => changeKind(option)}
          >
            {t(`partner.type.${option}`)}
          </button>
        ))}
      </div>

      <label htmlFor="partner-name">{t("partner.name")}</label>
      <input
        id="partner-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoComplete="name"
        required
      />

      <label htmlFor="partner-phone">{t("partner.phone")}</label>
      <input
        id="partner-phone"
        type="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="+212..."
        autoComplete="tel"
        pattern="[0-9+\- ]{6,}"
        required
      />

      {kind === "restaurant" && (
        <>
          <label htmlFor="partner-business">{t("partner.business")}</label>
          <input
            id="partner-business"
            value={business}
            onChange={(event) => setBusiness(event.target.value)}
            required
          />
        </>
      )}

      <label htmlFor="partner-file">{t(`partner.doc.${kind}`)}</label>
      <input
        key={fileInputKey}
        id="partner-file"
        type="file"
        accept="application/pdf,.pdf"
        onChange={(event) => {
          setFile(event.target.files?.[0] ?? null);
          setError("");
        }}
      />
      <p className="small-note">
        {t("partner.doc.hint")}
        {file && ` ${t("partner.doc.chosen")} ${file.name}`}
      </p>

      <span className="field-title">{t(`partner.items.${kind}`)}</span>
      {items.map((item) => (
        <div className="item-row" key={item.key}>
          <select
            aria-label={t("partner.item.kind")}
            value={item.kind}
            onChange={(event) => updateItem(item.key, { kind: event.target.value })}
          >
            {kinds.map((option) => (
              <option key={option} value={option}>
                {kindLabel(option)}
              </option>
            ))}
          </select>
          <input
            aria-label={t(`partner.item.what.${kind}`)}
            placeholder={t(`partner.item.what.${kind}`)}
            value={item.what}
            onChange={(event) => updateItem(item.key, { what: event.target.value })}
          />
          <input
            aria-label={t("partner.item.qty")}
            type="number"
            min="1"
            step="1"
            value={item.quantity}
            onChange={(event) => updateItem(item.key, { quantity: event.target.value })}
          />
          {items.length > 1 && (
            <button
              type="button"
              className="small-action"
              onClick={() =>
                setItems((current) => current.filter((entry) => entry.key !== item.key))
              }
            >
              {t("partner.item.remove")}
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="text-link align-start"
        onClick={() => setItems((current) => [...current, newItem(kinds[0])])}
      >
        {t("partner.item.add")}
      </button>

      <label className="check-row" htmlFor="partner-consent">
        <input
          id="partner-consent"
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>{t("partner.consent")}</span>
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button className="button button-dark" type="submit">
        {t("partner.submit")}
      </button>
      <p className="small-note">{t("partner.proto")}</p>
    </form>
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