/* ==========================================================
   MotorFix — общий скрипт для всех страниц
   1. Вспомогательные функции
   2. Шапка, футер, корзина (подставляются на каждую страницу)
   3. Корзина заявки
   4. Отрисовка карточек и списков
   5. Кнопка «Наверх»
   6. Запуск
   ========================================================== */

/* ---------- 1. Вспомогательные функции ---------- */

function $(id) {
  return document.getElementById(id);
}

function rub(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

/* Проверка телефона: российский номер, 11 цифр */
function phoneOk(value) {
  if (/[^\d\s()+\-]/.test(value) || /.\+/.test(value)) return false;
  var digits = value.replace(/\D/g, '');
  return /^[78][3489]\d{9}$/.test(digits) && !/^(\d)\1+$/.test(digits);
}

/* Проверка имени: буквы, пробел, дефис, 2–40 символов */
function nameOk(value) {
  return /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s\-]{1,39}$/.test(value);
}

/* Дата в формате ГГГГ-ММ-ДД по местному времени */
function isoDate(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

/* Показать/скрыть ошибку поля. Возвращает 1, если ошибка есть */
function setError(id, message) {
  $('e-' + id).textContent = message || '';
  $(id).classList.toggle('is-invalid', !!message);
  return message ? 1 : 0;
}

function toast(message) {
  $('toast-body').textContent = message;
  bootstrap.Toast.getOrCreateInstance($('toast'), { delay: 2400 }).show();
}



/* ---------- 2. Шапка, футер, корзина ---------- */

var TELEGRAM_ICON =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
  '<path d="M21.9 4.3 2.7 11.7c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.8c.2.6.1.8.7.8.5 0 ' +
  '.7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.8-.8l3.2-15.2c.3-1.3-.5-1.9-1.4-1.5zM8.8 ' +
  '13.8l9.6-6c.5-.3.9-.1.6.2l-8 7.2-.3 3.3z"/></svg>';

function socialsHtml() {
  return '<a class="btn btn-social btn-tg" href="' + SITE.telegram + '" target="_blank" rel="noopener">' +
    TELEGRAM_ICON + ' Telegram</a>' +
    '<a class="btn btn-social btn-max" href="' + SITE.max + '" target="_blank" rel="noopener">' +
    '<span class="max-badge">MAX</span> MAX</a>';
}

function logoHtml(extraClass) {
  return '<a class="navbar-brand fw-bold d-flex align-items-center gap-2 ' + (extraClass || '') + '" href="index.html">' +
    '<span class="badge text-bg-primary fs-6">⚙</span>' +
    '<span>Motor<span class="text-brand">Fix</span></span></a>';
}

function renderHeader() {
  var page = document.body.dataset.page;
  var links = NAV.map(function (item) {
    var active = item.page === page ? ' active' : '';
    return '<li class="nav-item"><a class="nav-link px-3' + active + '" href="' + item.href + '">' +
      item.title + '</a></li>';
  }).join('');

  $('site-header').innerHTML =
    '<nav class="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-secondary-subtle">' +
    '<div class="container">' + logoHtml() +
    '<div class="d-flex gap-2 order-lg-last">' +
    '<button class="btn btn-primary btn-sm" data-bs-toggle="offcanvas" data-bs-target="#cart-panel">' +
    '🛒 Корзина <span class="badge text-bg-light rounded-pill" id="cart-count">0</span></button>' +
    '<button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#main-nav" aria-label="Меню">' +
    '<span class="navbar-toggler-icon"></span></button></div>' +
    '<div class="collapse navbar-collapse" id="main-nav">' +
    '<ul class="navbar-nav mx-lg-auto gap-lg-1">' + links + '</ul></div></div></nav>';
}

function renderFooter() {
  var cls = 'link-light link-opacity-75';
  $('site-footer').innerHTML =
    '<div class="container"><div class="row g-4">' +
    '<div class="col-md-4">' + logoHtml('text-white mb-2') +
    '<p>Профессиональный автосервис в Москве. Диагностика, ТО и ремонт с гарантией.</p></div>' +
    '<div class="col-6 col-md-2"><h4 class="h6 text-white">Разделы</h4><ul class="list-unstyled">' +
    NAV.map(function (n) {
      return '<li><a class="' + cls + '" href="' + n.href + '">' + n.title + '</a></li>';
    }).join('') + '</ul></div>' +
    '<div class="col-md-3"><h4 class="h6 text-white">Контакты</h4>' +
    '<p class="mb-1">' + SITE.address + '</p>' +
    '<p class="mb-1"><a class="link-light" href="tel:' + SITE.tel + '">' + SITE.phone + '</a></p>' +
    '<p class="mb-1"><a class="link-light" href="mailto:' + SITE.email + '">' + SITE.email + '</a></p>' +
    '<p class="mb-2">Звоните в рабочее время:<br>' + SITE.hours + '</p>' +
    '<div class="footer-socials d-flex flex-wrap gap-2" aria-label="Наши социальные сети">' + socialsHtml() + '</div></div>' +
    '<div class="col-md-3"><div class="footer-booking h-100 p-3 rounded-3">' +
    '<h4 class="h6 text-white">Нужна помощь с выбором?</h4>' +
    '<p class="small mb-3">Подскажем, какая диагностика или ремонт нужны вашему автомобилю, и согласуем удобное время.</p>' +
    '<a class="btn btn-primary btn-sm" href="contacts.html">Записаться в сервис →</a>' +
    '<div class="small mt-3 text-white-50">Ответим на вопросы и подготовим предварительную оценку.</div>' +
    '</div></div></div>' +
    '<hr class="border-secondary">' +
    '<small>© 2026 MotorFix. Все права защищены. </small></div>';
}

/* Панель корзины, всплывающее уведомление и кнопка «Наверх» */
function renderOverlays() {
  document.body.insertAdjacentHTML('beforeend',
    '<div class="offcanvas offcanvas-end" tabindex="-1" id="cart-panel">' +
    '<div class="offcanvas-header"><h5 class="offcanvas-title">Корзина</h5>' +
    '<button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button></div>' +
    '<div class="offcanvas-body d-flex flex-column">' +
    '<div id="cart-list" class="flex-grow-1"></div><div id="cart-total"></div>' +
    '<form id="order-form" novalidate class="vstack gap-2 mt-3">' +
    '<div><input class="form-control" id="on" placeholder="Имя" autocomplete="name">' +
    '<div class="invalid-feedback" id="e-on"></div></div>' +
    '<div><input class="form-control" id="op" type="tel" placeholder="+7 (912) 345-67-89" autocomplete="tel">' +
    '<div class="invalid-feedback" id="e-op"></div></div>' +
    '<button class="btn btn-primary" type="submit">Оформить заказ</button></form>' +
    '<div id="order-msg" class="alert alert-success mt-3 mb-0" hidden></div></div></div>' +

    '<div class="modal fade" id="service-detail-modal" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"><div class="modal-content">' +
    '<div class="modal-header"><h5 class="modal-title" id="service-detail-title">Описание услуги</h5>' +
    '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button></div>' +
    '<div class="modal-body" id="service-detail-body"></div>' +
    '<div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Закрыть</button>' +
    '<button type="button" class="btn btn-primary" id="service-detail-order">Добавить в корзину</button></div>' +
    '</div></div></div>' +

    '<div class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">' +
    '<div class="toast text-bg-dark" id="toast" role="status"><div class="toast-body" id="toast-body"></div></div></div>' +

    '<button class="to-top" id="to-top" type="button" aria-label="Наверх страницы">' +
    '<span class="to-top__inner"><i class="to-top__gear">⚙</i>ВВЕРХ</span></button>');
}


/* ---------- 3. Корзина заявки ---------- */

var cart = {};

try {
  cart = JSON.parse(localStorage.getItem('mf_cart') || '{}') || {};
} catch (e) {
  cart = {};
}

function saveCart() {
  try {
    localStorage.setItem('mf_cart', JSON.stringify(cart));
  } catch (e) { /* хранилище недоступно — работаем без сохранения */ }
}

function findService(id) {
  return SERVICES.filter(function (s) { return s.id === id; })[0];
}

function renderCart() {
  var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0 && findService(id); });
  var count = 0;
  var total = 0;

  if (!ids.length) {
    $('cart-list').innerHTML = '<p class="text-body-secondary">Корзина пуста. Добавьте услуги из каталога.</p>';
  } else {
    $('cart-list').innerHTML = '<ul class="list-group list-group-flush">' + ids.map(function (id) {
      var s = findService(id);
      count += cart[id];
      total += s.price * cart[id];
      return '<li class="list-group-item d-flex justify-content-between align-items-center px-0">' +
        '<div><b>' + s.name + '</b><br><small class="text-body-secondary">' + rub(s.price) + '</small></div>' +
        '<div class="btn-group btn-group-sm">' +
        '<button class="btn btn-outline-secondary" data-minus="' + id + '">−</button>' +
        '<span class="btn btn-outline-secondary disabled">' + cart[id] + '</span>' +
        '<button class="btn btn-outline-secondary" data-plus="' + id + '">+</button></div></li>';
    }).join('') + '</ul>';
  }

  $('cart-total').innerHTML = ids.length
    ? '<div class="d-flex justify-content-between fs-5 border-top pt-2"><span>Итого (от):</span><b>' + rub(total) + '</b></div>'
    : '';
  $('cart-count').textContent = count;
  $('order-form').classList.toggle('d-none', !ids.length);
}

function addToCart(id, openPanel) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  if (openPanel) {
    $('order-msg').hidden = true;
    bootstrap.Offcanvas.getOrCreateInstance($('cart-panel')).show();
  } else {
    toast('Добавлено: ' + findService(id).name);
  }
}

document.addEventListener('click', function (e) {
  var btn = e.target.closest('button');
  if (!btn) return;
  var d = btn.dataset;

  if (d.add)  addToCart(d.add, false);
  if (d.now)  addToCart(d.now, true);
  if (d.plus) { cart[d.plus]++; saveCart(); renderCart(); }
  if (d.minus) { cart[d.minus] = Math.max(0, cart[d.minus] - 1); saveCart(); renderCart(); }
  if (d.cat)  { activeCategory = d.cat; renderCatalog(); }
  if (d.detail) showServiceDetails(d.detail);
});

function initServiceDetailActions() {
  $('service-detail-order').addEventListener('click', function () {
    if (!activeDetailServiceId) return;
    addToCart(activeDetailServiceId, false);
    bootstrap.Modal.getOrCreateInstance($('service-detail-modal')).hide();
  });
}

function initOrderForm() {
  $('order-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('on').value.trim();
    var phone = $('op').value.trim();
    var errors = 0;

    errors += setError('on', !name ? 'Введите имя' : !nameOk(name) ? 'Только буквы, от 2 до 40 символов' : '');
    errors += setError('op', !phone ? 'Введите телефон' : !phoneOk(phone) ? 'Формат: +7 (912) 345-67-89' : '');
    if (errors) return;

    var items = Object.keys(cart).filter(function (id) { return cart[id] > 0; }).length;
    cart = {};
    saveCart();
    renderCart();
    $('on').value = '';
    $('op').value = '';
    $('order-msg').hidden = false;
    $('order-msg').textContent = 'Спасибо! Заявка принята (' + items + ' поз.). ' +
      'Мы перезвоним в течение 15 минут в рабочее время сервиса.';
  });
}


/* ---------- 4. Отрисовка карточек и списков ---------- */

var activeCategory = 'all';

function infoCard(icon, title, text, dark) {
  var cardClass = dark ? 'text-bg-dark border-primary-subtle' : 'shadow-sm card-hover';
  var textClass = dark ? 'text-white-50' : 'text-body-secondary';
  return '<div class="col"><div class="card h-100 ' + cardClass + '"><div class="card-body">' +
    '<div class="fs-1 mb-2">' + icon + '</div><h3 class="h5">' + title + '</h3>' +
    '<p class="card-text mb-0 ' + textClass + '">' + text + '</p></div></div></div>';
}

function checkList(items) {
  return items.map(function (text) {
    return '<li class="list-group-item bg-transparent text-white border-secondary">✓ ' + text + '</li>';
  }).join('');
}

function serviceCard(s) {
  return '<div class="col"><div class="card h-100 shadow-sm card-hover overflow-hidden">' +
    '<img class="service-card__image" src="' + (s.image || '') + '" alt="' + s.name + '" loading="lazy">' +
    '<div class="card-body d-flex flex-column">' +
    '<span class="badge text-bg-primary align-self-start mb-2">' + s.catName + '</span>' +
    '<h3 class="h5">' + s.name + '</h3>' +
    '<p class="card-text text-body-secondary">' + s.desc + '</p>' +
    '<div class="d-flex justify-content-between align-items-baseline mt-auto mb-3">' +
    '<strong class="fs-5">от ' + rub(s.price) + '</strong>' +
    '<small class="text-body-secondary">⏱ ' + s.time + '</small></div>' +
    '<div class="d-grid gap-2">' +
    '<button class="btn btn-outline-secondary btn-sm" data-detail="' + s.id + '">Подробнее об услуге</button>' +
    '<button class="btn btn-primary" data-add="' + s.id + '">В заявку</button>' +
    '<button class="btn btn-outline-primary btn-sm" data-now="' + s.id + '">Заказать сразу</button>' +
    '</div></div></div></div>';
}

var SERVICE_DETAILS = {
  'diag-computer': ['Проверяем электронные системы автомобиля мультимарочным диагностическим сканером: двигатель, коробку передач, ABS, SRS, климатическую систему и другие доступные блоки. Считываем сохранённые и текущие коды неисправностей, анализируем параметры в реальном времени и при необходимости проверяем работу датчиков.', 'В услугу входит подключение оборудования, чтение и расшифровка кодов, анализ потоковых данных, проверка после устранения ошибки и рекомендации по дальнейшим действиям. Сброс ошибок без выяснения причины не выполняем.', 'Результат: понятный отчёт с обнаруженными неисправностями и приоритетом ремонта. Среднее время — 40 минут. Стоимость — от 1 500 ₽.'],
  'diag-suspension': ['Поднимаем автомобиль и осматриваем элементы передней и задней подвески, рулевого управления и креплений. Проверяем люфты, состояние шаровых опор, сайлентблоков, втулок и стоек стабилизатора, амортизаторов, пружин, пыльников и рулевых наконечников.', 'Дополнительно оцениваем состояние шин и характер износа, который может указывать на нарушение углов установки колёс или неисправность ходовой. При необходимости мастер покажет выявленные дефекты на подъёмнике.', 'Результат: перечень замечаний с рекомендациями, что требует срочной замены, а что можно контролировать. Среднее время — 30 минут. Стоимость — от 1 200 ₽.'],
  'oil': ['Сливаем отработанное моторное масло, меняем масляный фильтр и уплотнительное кольцо сливной пробки, если это предусмотрено конструкцией. Заливаем масло, соответствующее допускам производителя автомобиля, и проверяем уровень после запуска двигателя.', 'Перед работой уточняем марку и объём масла, тип фильтра и доступность расходников. После замены проверяем отсутствие подтёков и при необходимости сбрасываем сервисный интервал.', 'В стоимость входит работа; масло и фильтр оплачиваются отдельно. Среднее время — 45 минут. Стоимость работы — от 1 800 ₽.'],
  'maintenance': ['Проводим плановое техническое обслуживание по регламенту производителя с учётом пробега, возраста автомобиля и условий эксплуатации. Обычно комплекс включает замену моторного масла и фильтров, а также контроль основных систем и узлов.', 'Проверяем тормозную систему, подвеску, рулевое управление, ремни и шланги, уровни технических жидкостей, аккумулятор, освещение и состояние шин. Состав работ уточняется по модели автомобиля и регламенту ТО.', 'После обслуживания выдаём перечень выполненных операций и рекомендации на будущее. Расходные материалы и запчасти рассчитываются отдельно. Среднее время — около 2 часов. Стоимость — от 6 500 ₽.'],
  'ac': ['Проверяем работу системы кондиционирования, состояние магистралей и доступных соединений, оцениваем эффективность охлаждения. При необходимости выполняем обслуживание контура с вакуумированием и заправкой хладагентом подходящего типа.', 'Перед заправкой обращаем внимание на признаки утечки и состояние системы. Если обнаружена негерметичность или неисправность компрессора, согласуем диагностику и ремонт отдельно — простая дозаправка не заменяет устранение утечки.', 'В услугу входит обслуживание и контроль работы системы; объём хладагента и дополнительные материалы могут влиять на итоговую цену. Среднее время — около 1 часа. Стоимость — от 2 800 ₽.'],
  'brakes': ['Снимаем колёса и демонтируем изношенные тормозные колодки на выбранной оси. Осматриваем тормозные диски, суппорты, направляющие и пыльники, очищаем посадочные поверхности и устанавливаем новые колодки.', 'После сборки проверяем корректность установки и свободное перемещение механизмов. Мастер сообщит, если диски или другие элементы требуют замены; дополнительные работы выполняются только после согласования.', 'Цена указана за работу на одной оси, без стоимости колодок и возможных дополнительных деталей. Среднее время — около 1 часа. Стоимость — от 2 400 ₽.'],
  'shocks': ['Меняем амортизаторы или стойки попарно на одной оси, чтобы сохранить предсказуемое поведение автомобиля. Перед установкой проверяем опоры, отбойники, пыльники и крепёжные элементы.', 'После демонтажа устанавливаем новые детали, затягиваем соединения с требуемым усилием и проверяем результат. В зависимости от конструкции автомобиля может потребоваться дополнительная регулировка углов установки колёс.', 'Стоимость зависит от конструкции подвески и указана за работу по замене пары стоек; запчасти и дополнительные операции рассчитываются отдельно. Среднее время — около 2 часов. Стоимость — от 4 200 ₽.'],
  'alignment': ['Измеряем углы установки колёс на 3D-стенде и сравниваем их с параметрами производителя для конкретной модели. Проверяем исходные значения схождения, развала и кастера там, где предусмотрена регулировка.', 'Перед настройкой осматриваем шины и элементы подвески. Если обнаружены люфты или повреждения, которые не позволяют корректно выполнить регулировку, сначала согласуем устранение причины.', 'После регулировки проводим контрольное измерение и выдаём результаты. Среднее время — около 1 часа. Стоимость — от 3 000 ₽.'],
  'tires': ['Выполняем сезонную замену комплекта из четырёх колёс: снимаем колёса, демонтируем шины с дисков при необходимости, устанавливаем сезонный комплект, балансируем и монтируем колёса на автомобиль.', 'Проверяем состояние шин и дисков, обращаем внимание на повреждения и неравномерный износ. После установки контролируем давление и затяжку крепежа. Условия и стоимость могут меняться в зависимости от диаметра колёс и типа дисков.', 'Базовая цена указана для легковых автомобилей с размером R13–R19. Среднее время — около 1 часа. Стоимость — от 3 200 ₽.'],
  'puncture': ['Находим место повреждения бескамерной шины и оцениваем, допускает ли оно безопасный ремонт. При подходящем характере прокола выполняем ремонт с использованием технологии, соответствующей зоне и размеру повреждения.', 'После ремонта проверяем герметичность и при необходимости выполняем балансировку колеса. Повреждения боковины, крупные разрывы и некоторые виды деформаций ремонту не подлежат — в таком случае рекомендуем замену шины.', 'Среднее время — около 30 минут. Стоимость — от 900 ₽; итог зависит от характера повреждения и необходимости дополнительных работ.'],
  'battery': ['Проверяем состояние аккумулятора и напряжение зарядки, чтобы исключить неисправность генератора или цепи питания. Подбираем подходящую батарею с учётом размеров, ёмкости, пускового тока и требований автомобиля.', 'Снимаем старый аккумулятор, устанавливаем новый, проверяем надёжность крепления и состояние клемм. На автомобилях с системой контроля батареи при необходимости выполняем регистрацию или адаптацию нового аккумулятора.', 'Стоимость указана за работу по замене; аккумулятор и дополнительные операции оплачиваются отдельно. Среднее время — около 20 минут. Стоимость — от 1 000 ₽.'],
  'lights': ['Определяем тип неисправной лампы или элемента оптики, проверяем доступ к узлу и совместимость новой детали. Заменяем лампы ближнего и дальнего света, габаритов, указателей поворота и других доступных источников освещения.', 'После установки проверяем работу световых приборов. Если конструкция автомобиля требует регулировки фар, выполняем её отдельно и сообщаем о необходимости дополнительных работ заранее.', 'Стоимость зависит от типа лампы и сложности доступа к ней; запчасти оплачиваются отдельно. Среднее время — около 20 минут. Стоимость — от 800 ₽.']
};

var activeDetailServiceId = null;
function showServiceDetails(id) {
  var service = findService(id);
  var paragraphs = SERVICE_DETAILS[id];
  if (!service || !paragraphs) return;
  activeDetailServiceId = id;
  $('service-detail-title').textContent = service.name;
  $('service-detail-body').innerHTML = '<div class="d-flex flex-wrap gap-2 mb-3"><span class="badge text-bg-primary">' + service.catName + '</span>' +
    '<span class="badge text-bg-light">от ' + rub(service.price) + '</span><span class="badge text-bg-light">⏱ ' + service.time + '</span></div>' +
    paragraphs.map(function (p, i) { return '<p>' + p + '</p>'; }).join('');
  bootstrap.Modal.getOrCreateInstance($('service-detail-modal')).show();
}

function renderCatalog() {
  var categories = [['all', 'Все']];
  var seen = {};
  SERVICES.forEach(function (s) {
    if (!seen[s.cat]) { seen[s.cat] = true; categories.push([s.cat, s.catName]); }
  });

  $('chips').innerHTML = categories.map(function (c) {
    var active = c[0] === activeCategory ? ' active' : '';
    return '<li class="nav-item"><button class="nav-link' + active + '" data-cat="' + c[0] + '">' + c[1] + '</button></li>';
  }).join('');

  $('catalog').innerHTML = SERVICES.filter(function (s) {
    return activeCategory === 'all' || s.cat === activeCategory;
  }).map(serviceCard).join('');
}

function initStatsAnimation() {
  var nodes = document.querySelectorAll('.stat-number');
  if (!nodes.length) return;
  var started = false;
  function animate() {
    if (started) return;
    started = true;
    nodes.forEach(function (node) {
      var target = Number(node.dataset.value);
      var suffix = node.dataset.suffix || '';
      var decimals = Number(node.dataset.decimals || 0);
      var start = null;
      var duration = 1500;
      function frame(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;
        var formatted = decimals ? current.toFixed(decimals).replace('.', ',') : Math.floor(current).toLocaleString('ru-RU');
        node.textContent = formatted + suffix;
        if (progress < 1) window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    });
  }
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        animate(); observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe($('stats'));
  } else { animate(); }
}

function renderPage() {
  if ($('chips')) renderCatalog();

  if ($('popular')) {
    $('popular').innerHTML = POPULAR.map(function (id) { return serviceCard(findService(id)); }).join('');
  }
  if ($('stats')) {
    var statTargets = [
      { value: 12, suffix: ' лет', label: 'на рынке', decimals: 0 },
      { value: 18000, suffix: '+', label: 'обслуженных авто', decimals: 0 },
      { value: 24, suffix: ' мес.', label: 'гарантия на работы', decimals: 0 },
      { value: 4.9, suffix: '★', label: 'средняя оценка', decimals: 1 }
    ];
    $('stats').innerHTML = statTargets.map(function (s, i) {
      return '<div class="col"><div class="display-6 fw-bold text-brand stat-number" data-stat-index="' + i + '" data-value="' + s.value + '" data-suffix="' + s.suffix + '" data-decimals="' + s.decimals + '">' + (s.decimals ? '0,0' : '0') + s.suffix + '</div>' +
        '<div class="text-white-50">' + s.label + '</div></div>';
    }).join('');
    initStatsAnimation();
  }
  if ($('features')) {
    $('features').innerHTML = FEATURES.map(function (f) { return infoCard(f[0], f[1], f[2]); }).join('');
  }
  if ($('steps')) {
    $('steps').innerHTML = STEPS.map(function (s, i) {
      var stepIcons = ['📅', '🔍', '🛠️', '🔑'];
      return infoCard('<span class="step-icon" aria-hidden="true">' + stepIcons[i] + '</span>', s[0], s[1]);
    }).join('');
  }
  if ($('tips')) {
    $('tips').innerHTML = TIPS.map(function (t) { return infoCard(t[0], t[1], t[2]); }).join('');
  }
  if ($('howto')) {
    $('howto').innerHTML = HOWTO.map(function (h) { return infoCard(h[0], h[1], h[2], true); }).join('');
  }
  if ($('check-services')) $('check-services').innerHTML = checkList(CHECK_SERVICES);
  if ($('check-trip'))     $('check-trip').innerHTML = checkList(CHECK_TRIP);

  if ($('faq')) {
    $('faq').innerHTML = FAQ.map(function (item, i) {
      var open = i === 0;
      return '<div class="accordion-item">' +
        '<h3 class="accordion-header"><button class="accordion-button' + (open ? '' : ' collapsed') + '" ' +
        'data-bs-toggle="collapse" data-bs-target="#faq-' + i + '">' + item.q + '</button></h3>' +
        '<div id="faq-' + i + '" class="accordion-collapse collapse' + (open ? ' show' : '') + '" data-bs-parent="#faq">' +
        '<div class="accordion-body">' + item.a.map(function (p) { return '<p class="mb-2">' + p + '</p>'; }).join('') +
        '</div></div></div>';
    }).join('');
  }

  document.querySelectorAll('[data-socials]').forEach(function (box) {
    box.innerHTML = socialsHtml();
  });
}


/* ---------- 5. Кнопка «Наверх» ---------- */

function initToTop() {
  var button = $('to-top');

  function update() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    button.style.setProperty('--p', progress.toFixed(1));
    button.classList.toggle('show', window.scrollY > 400);
  }

  window.addEventListener('scroll', update, { passive: true });
  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  update();
}


/* ---------- 6. Запуск ---------- */

renderHeader();
renderFooter();
renderOverlays();
renderPage();
renderCart();
initOrderForm();
initServiceDetailActions();
initToTop();

