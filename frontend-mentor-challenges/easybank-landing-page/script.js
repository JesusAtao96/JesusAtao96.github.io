const toggle = document.getElementById('navi-toggle');

function checkOnChange(){
    if (toggle.checked) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}