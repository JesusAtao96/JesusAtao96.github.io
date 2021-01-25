const toggle = document.getElementById('navi-toggle');
const anchors = document.getElementsByClassName("header__anchor");

for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', function() {
        toggle.checked = false;
    }, false);
}

function checkOnChange(){
    if (toggle.checked) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}