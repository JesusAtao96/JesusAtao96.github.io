function validate1() {
    const form = document.getElementById("form-1");
    const input = document.getElementsByClassName("file__input");
    const errorText = document.getElementsByClassName("file__error");
    const inputs = form.querySelectorAll("input");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!input[0].value) {
            input[0].classList.add("file__input--error");
            errorText[0].style.display = 'block';
            return;
        }

        if (!matchEmail(input[0].value)) {
            input[0].classList.add("file__input--error");
            errorText[0].style.display = 'block';
            return;
        }

        input[0].classList.remove("file__input--error");
        errorText[0].style.display = 'none';
    });
}

function validate2() {
    const form = document.getElementById("form-2");
    const input = document.getElementsByClassName("early__input");
    const errorText = document.getElementsByClassName("early__error");
    const inputs = form.querySelectorAll("input");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!input[0].value) {
            input[0].classList.add("early__input--error");
            errorText[0].style.display = 'block';
            return;
        }

        if (!matchEmail(input[0].value)) {
            input[0].classList.add("early__input--error");
            errorText[0].style.display = 'block';
            return;
        }

        input[0].classList.remove("early__input--error");
        errorText[0].style.display = 'none';
    });
}

function matchEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

validate1();
validate2();