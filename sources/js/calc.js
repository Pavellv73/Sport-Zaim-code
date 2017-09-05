$(function () {

  // Базовые значения
  var sumValue = 5000;
  var daysValue = 25;
  var dayPercent = 0.0217;
  var formState = 'default';
  var stock3days = true; // флаг, включающий акцию "первые 3 дня бесплатно"

  var stateSettings = {
    'default': {
      sumMin: 2000,
      sumMax: 15000,
      daysMin: 7,
      daysMax: 30
    },
    'new': { // Для новых клиентов
      sumMin: 2000,
      sumMax: 10000,
      daysMin: 7,
      daysMax: 30
    }
  };

  var calculator = {
    sumSlider: jQuery('.summ-blocks .one-s input'),
    daysSlider: jQuery('.summ-blocks .two-s input'),
    sumMinText: jQuery('.summ-blocks .one-s .min'),
    sumMaxText: jQuery('.summ-blocks .one-s .max'),
    daysMinText: jQuery('.summ-blocks .two-s .min'),
    daysMaxText: jQuery('.summ-blocks .two-s .max'),
    chance: jQuery('.content-row .gb span'),
    commission: jQuery('.content-row .commission span'),
    sumToBack: jQuery('.content-row .summToBack span'),
    dateToBack: jQuery('.content-row .dateToBack span'),
    sum: jQuery('.summ-block span.sum '),
    days: jQuery('.summ-block .days span.d')
  };

  var miniCalculator = {
    sumSlider   : jQuery('.block6 .borrowing input.one-ss'),
    sumText     : jQuery('.block6 .borrowing span.sumspan'),
    sumMinText  : jQuery('.block6 .borrowing .before'),
    sumMaxText  : jQuery('.block6 .borrowing .after'),
    subText     : jQuery('.block6 .borrowing .subText')
  };

  var triggerTabs = {
    new: function () {
      formState = 'new';
    },
    default: function () {
      formState = 'default';
    }
  };

  window.getDateToBack = function (data, day) {
    data = data.split('/');
    data = new Date(data[2], +data[1] - 1, +data[0] + day, 0, 0, 0, 0);
    data = [data.getDate(), data.getMonth() + 1, data.getFullYear()];
    data = data.join('/').replace(/(^|\/)(\d)(?=\/)/g, "$10$2");
    return data
  };

  function initCalculators() {
    // инициализируем большой калькулятор
    setCalculator();
    triggerTabs[formState]();
    calculator.sumSlider.val(sumValue);
    calculator.daysSlider.val(daysValue);
    renderCalculator();

    // инициализируем маленький калькулятор
    miniCalculator.sumSlider.attr(
      'min',
      stateSettings.default.sumMin
    );
    miniCalculator.sumSlider.attr(
      'max',
      stateSettings.default.sumMax
    );
    miniCalculator.sumSlider.val(sumValue);
    miniCalculator.subText.find('span').text(stateSettings.new.sumMax);
    renderMiniCalculator();

  }

  function setCalculator() {

    var settings = stateSettings[formState];
    calculator.sumSlider.attr(
      'min',
      settings.sumMin
    );
    calculator.sumSlider.attr(
      'max',
      settings.sumMax
    );
    calculator.daysSlider.attr(
      'min',
      settings.daysMin
    );
    calculator.daysSlider.attr(
      'max',
      settings.daysMax
    );
    calculator.sumMinText.text(
      settings.sumMin + ' руб'
    );
    calculator.sumMaxText.text(
      settings.sumMax + ' руб'
    );
    calculator.daysMinText.text(
      settings.daysMin + ' дн'
    );
    calculator.daysMaxText.text(
      settings.daysMax + ' дн'
    );

  }

  function getChance(sumValue) {
    if (formState === 'new') {
      chanceTitle = 'Вероятность одобрения';
      if (sumValue <= 8000) {
        chanceValue = 95;
        chanceComment = 'автоматическое одобрение';
      } else if (sumValue <= 15000) {
        chanceValue = 85;
        chanceComment = 'может потребоваться паспорт';
      } else {
        chanceValue = 75;
        chanceComment = 'потребуется паспорт';
      }
    } else {
      chanceTitle = 'Наш постоянный клиент?';
      chanceValue = 99;
      chanceComment = 'автоматическое одобрение!';
    }
    return {
      'chanceTitle': chanceTitle,
      'chanceValue': chanceValue,
      'chanceComment': chanceComment
    }
  }

  function renderCalculator() {

    var discountDays = (stock3days && formState === 'new') ? 3 : 0;

    var sum = calculator.sumSlider.val();
    var days = calculator.daysSlider.val();
    var commission = sum * dayPercent * (days - discountDays);
    var sumToBack = parseFloat(sum) + parseFloat(commission);
    var chance = getChance(sum);
    var dateObject = new Date();
    var today = dateObject.getDate() + '/' + (dateObject.getMonth() + 1) + '/' + dateObject.getFullYear();
    var date = getDateToBack(today, parseInt(days));

    calculator.sum.text(sum);
    calculator.days.text(days);
    calculator.commission.text(commission.toFixed(2));
    calculator.sumToBack.text(sumToBack.toFixed(2));
    calculator.chance.text(chance.chanceValue + '%');
    calculator.dateToBack.text(date);
    inputRangeBG(calculator.sumSlider);
    inputRangeBG(calculator.daysSlider);
  }

  function renderMiniCalculator() {
    var sum = miniCalculator.sumSlider.val();
    miniCalculator.sumText.html(sum);
    inputRangeBG(miniCalculator.sumSlider);
  }

  $('.calculator input[type=range]').on('input', function () {
    renderCalculator();
  });

  $('.block6 .borrowing input[type=range]').on('input', function () {
    renderMiniCalculator();
  });

  $(".switch-but").click(function () {

    $(".b2").toggleClass("link-active");
    $(".b1").toggleClass("link-active");
    $(".switch-but").toggleClass("switch-right");
    $(".switch-but").toggleClass("switch-left");

    if (formState === 'new') {
      triggerTabs.default();
    } else {
      triggerTabs.new();
    }

    setCalculator();
    renderCalculator();
  });

  $('.block1 .button-block .b1').click(function () {
    $(".b2").removeClass("link-active");
    $(".b1").addClass("link-active");
    $(".switch-but").removeClass("switch-right");
    $(".switch-but").addClass("switch-left");
    triggerTabs.new();
    setCalculator();
    renderCalculator();
  });

  $('.block1 .button-block .b2').click(function () {
    $(".b2").addClass("link-active");
    $(".b1").removeClass("link-active");
    $(".switch-but").addClass("switch-right");
    $(".switch-but").removeClass("switch-left");
    triggerTabs.default();
    setCalculator();
    renderCalculator();
  });


  initCalculators();

});


