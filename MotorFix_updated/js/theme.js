/* Светлая/тёмная тема Bootstrap по настройкам устройства */
(function () {
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function apply() {
    document.documentElement.setAttribute('data-bs-theme', media.matches ? 'dark' : 'light');
  }

  apply();
  media.addEventListener('change', apply);
})();
