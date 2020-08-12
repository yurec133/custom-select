const getTemplate = (data = [], placeholder, selectedId) => {
  let text = placeholder ?? "Placeholder";
  const items = data.map((item, id) => {
    item.id === selectedId ? (text = item.value) : text;

    return `<li data-type="item" data-id="${item.id}">${item.value}</li>`;
  });
  return `<div class="select__input" data-type="input">
            <span data-type="value">${text}</span>
            <div data-type="icon" class="select__chevron"></div>
        </div>
        <div class="select__dropdown">
            <ul class="select__list">
                ${items.join("")}
            </ul>
        </div>`;
};

export class Select {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
    this.selectedId = options.selectedId;
    this.#render();
    this.#setup();
  }
  #render() {
    const { placeholder, data, selectedId } = this.options;
    this.$el.classList.add("select");
    this.$el.innerHTML = getTemplate(data, placeholder, selectedId);
  }

  #setup() {
    this.$el.addEventListener("click", this.clickHandler.bind(this));
    this.$icon = this.$el.querySelector('[data-type="icon"]');
    this.$value = this.$el.querySelector('[data-type="value"]');
  }
  clickHandler(e) {
    const { type } = e.target.dataset;
    if (type === "input") {
      this.toggle();
    } else if (type === "item") {
      const id = e.target.dataset.id;
      this.select(id, e);
    }
  }
  get isOpen() {
    return this.$el.classList.contains("open");
  }
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  get current() {
    return this.options.data.find(item => item.id === this.selectedId);
  }
  select(id, e) {
    this.selectedId = id;
    this.$value.textContent = this.current.value;
    let path = e.path || (e.composedPath && e.composedPath());
    for (let item of path[1].children) {
      item.classList.remove("active");
    }
    path[0].classList.add("active");
    this.close();
  }
  open() {
    this.$el.classList.add("open");
    this.$icon.classList.add("icon-open");
  }
  close() {
    this.$el.classList.remove("open");
    this.$icon.classList.remove("icon-open");
  }
  destroy() {
    this.$el.removeEventListener("click", this.clickHandler.bind(this));
  }
}
