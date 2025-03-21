import("../config.js").then((config) => {
  config = config.default;
  config.autoText.YEAR = new Date().getFullYear();

  for (const node of document.querySelectorAll("*")) {
    if (node.innerHTML) for (const [ key, value ] of Object.entries(config.autoText)) node.innerHTML = node.innerHTML.replace(new RegExp(`({{${key}}})`, "gi"), value);
  };

  const columns = document.querySelectorAll(".list");
  for (const i in config.portfolio.list) {
    const c = config.portfolio.columns;
    const index = i - c * Math.floor(i / c);
    const item = config.portfolio.list[i];

    const node = document.createElement("div");
    node.className = "item";
    node.dataset.name = `${item.name}`;
    node.dataset.src = `${item.src}`;
    node.innerHTML = `<img src="${config.portfolio.dir}/${item.src}" loading="lazy"></img>`;
    
    columns[index].append(node);
  };

  const openPopup = (name, src) => {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `<img src="${config.portfolio.dir}/${src}">` +
      (`${name}`.length ? `<p class="name">${name}</p>` : "") +
      `<button class="close"></button>`;

    document.body.append(popup);
  };

  const closePopup = (popup) => {
    popup.animate([
      { opacity: 1 },
      { opacity: 0 }
    ], {
      duration: config.env.POPUP_TRANSITION,
      fill: "both"
    });

    setTimeout(() => { popup.remove(); }, config.env.COMMON_INTERVAL + config.env.POPUP_TRANSITION);
  };

  document.addEventListener("contextmenu", (event) => {
    if (event.target.nodeName) return false;
  });

  document.addEventListener("click", (event) => {
    if (event.target.className === "item") {
      openPopup(event.target.dataset.name, event.target.dataset.src);
    } else if (event.target.className === "close") {
      closePopup(event.target.parentElement);
    } else if (event.target.className === "popup") {
      closePopup(event.target);
    }
  });

  const header = document.querySelector("header");
  addEventListener("scroll", () => {
    header.className = scrollY < config.env.HEADER_SHRINK_THRESHOLD ? "" : "shrink";
  });

  const sns = document.querySelector("#sns");
  for (const [ key, value ] of Object.entries(config.links)) {
    const anchor = document.createElement("a");
    anchor.className = key;
    anchor.href = value;

    sns.append(anchor);
  };

  addEventListener("load", () => {
    if (location.hash) scroll(0, document.querySelector(location.hash).offsetTop);
  });
});