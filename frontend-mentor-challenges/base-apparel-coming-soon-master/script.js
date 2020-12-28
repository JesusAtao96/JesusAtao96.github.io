function validate() {
  const form = document.getElementById("form");
  const inputGroup = document.getElementsByClassName("input-group");
  const inputs = form.querySelectorAll("input");

  form.addEventListener("submit", function (e) {
    if (!inputs[0].value) {
      inputGroup[0].classList.add("input-group--error");
      e.preventDefault();
      return;
    }

    if (!matchEmail(inputs[0].value)) {
      inputGroup[0].classList.add("input-group--error");
      e.preventDefault();
      return;
    }

    inputGroup[0].classList.remove("input-group--error");
    e.preventDefault();
  });
}

function matchEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

validate();
