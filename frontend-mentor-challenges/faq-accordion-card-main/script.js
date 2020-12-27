const accordionsBtn = document.getElementsByClassName("accordion__button");

for (const accordion of accordionsBtn) {
  accordion.addEventListener("click", function () {
    this.classList.toggle("accordion__button--active");

    const panel = this.nextElementSibling;
    panel.classList.toggle("accordion__panel--active");
  });
}
