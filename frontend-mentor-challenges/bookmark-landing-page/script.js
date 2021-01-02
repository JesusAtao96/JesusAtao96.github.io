function validate() {
    const form = document.getElementById("email-form");
    const inputGroup = document.getElementsByClassName("form__group");
    const inputEmail = document.getElementById("input-email");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!inputEmail.value) {
            inputGroup[0].classList.add("form__group--error");
            return;
        }

        if (!matchEmail(inputEmail.value)) {
            inputGroup[0].classList.add("form__group--error");
            return;
        }

        inputGroup[0].classList.remove("form__group--error");
    });
}

function matchEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

validate();