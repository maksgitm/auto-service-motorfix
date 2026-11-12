/* ==========================================================
   MotorFix — форма записи на обслуживание (страница «Контакты»)
   Использует функции из main.js: setError, phoneOk, nameOk, isoDate
   ========================================================== */

var DAY_MS = 24 * 60 * 60 * 1000;
var BOOKING_DAYS_AHEAD = 60;

/* Часы работы в минутах от полуночи: [открытие, закрытие] */
function workingHours(date) {
  return date.getDay() === 0 ? [10 * 60, 18 * 60] : [8 * 60, 21 * 60];
}

function validateDate(value) {
  if (!value) return 'Выберите дату визита';

  var date = new Date(value + 'T00:00:00');
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(date)) return 'Некорректная дата';
  if (date < today) return 'Дата не может быть в прошлом';
  if (date - today > BOOKING_DAYS_AHEAD * DAY_MS) return 'Запись открыта на 60 дней вперёд';
  return '';
}

function validateTime(timeValue, dateValue) {
  if (!timeValue) return 'Выберите время';
  if (validateDate(dateValue)) return '';   /* сначала исправьте дату */

  var parts = timeValue.split(':');
  var minutes = Number(parts[0]) * 60 + Number(parts[1]);
  var hours = workingHours(new Date(dateValue + 'T00:00:00'));
  var now = new Date();

  if (minutes < hours[0] || minutes > hours[1] - 30) {
    return 'В этот день работаем с ' + hours[0] / 60 + ':00 до ' + hours[1] / 60 +
      ':00 (последняя запись — за 30 минут до закрытия)';
  }
  if (dateValue === isoDate(now) && minutes < now.getHours() * 60 + now.getMinutes() + 60) {
    return 'Запись на сегодня — не ближе чем за час';
  }
  return '';
}

function fillServiceSelect() {
  $('fs').innerHTML =
    '<option value="">Выберите услугу…</option>' +
    '<option>Консультация / не знаю</option>' +
    SERVICES.map(function (s) {
      return '<option>' + s.name + ' — ' + rub(s.price) + '</option>';
    }).join('');
}

function initBookingForm() {
  var form = $('booking-form');
  var message = $('booking-msg');
  var today = new Date();

  $('fd').min = isoDate(today);
  $('fd').max = isoDate(new Date(today.getTime() + BOOKING_DAYS_AHEAD * DAY_MS));
  fillServiceSelect();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var get = function (id) { return $(id).value.trim(); };
    var errors = 0;

    errors += setError('fn', !get('fn') ? 'Введите имя'
      : !nameOk(get('fn')) ? 'Только буквы, пробел и дефис, от 2 до 40 символов' : '');
    errors += setError('fp', !get('fp') ? 'Введите телефон'
      : !phoneOk(get('fp')) ? 'Введите номер в формате +7 (912) 345-67-89' : '');
    errors += setError('fs', $('fs').value ? '' : 'Выберите услугу');
    errors += setError('fa', !get('fa') ? 'Укажите марку и модель автомобиля'
      : get('fa').length < 2 ? 'Слишком короткое название' : '');
    errors += setError('fd', validateDate(get('fd')));
    errors += setError('ft', validateTime(get('ft'), get('fd')));
    errors += setError('fc', get('fc').length > 500 ? 'Не более 500 символов' : '');
    errors += setError('fk', $('fk').checked ? '' : 'Нужно согласие на обработку данных');

    message.hidden = false;
    if (errors) {
      message.className = 'alert alert-danger mb-0';
      message.textContent = 'Проверьте, пожалуйста, выделенные поля (ошибок: ' + errors + ').';
      return;
    }

    var date = new Date(get('fd') + 'T00:00:00').toLocaleDateString('ru-RU');
    message.className = 'alert alert-success mb-0';
    message.textContent = 'Спасибо, ' + get('fn') + '! Заявка на ' + date + ' в ' + get('ft') +
      ' отправлена. Мы перезвоним в течение 15 минут в рабочее время сервиса (' + SITE.hours + ').';
    form.reset();
  });
}

initBookingForm();
