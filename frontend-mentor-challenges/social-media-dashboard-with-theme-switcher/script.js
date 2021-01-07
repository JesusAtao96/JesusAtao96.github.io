
function loadTheme () {
    if (localStorage.getItem('theme')) {
        document.body.classList.add('dark');
        document.getElementById('toggle-theme').checked = true;
    }
}

loadTheme();

function changeTheme() {
  if (document.getElementById('toggle-theme').checked) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.removeItem('theme');
  }
}