var inputRangeBG = function (e) {
  var r = $(e);
  var n = r.val();
  var mn = r.attr('min') ? r.attr('min') : 0;
  var mx = r.attr('max') ? r.attr('max') : 0;
  n = 100 * (n - mn) / (mx - mn); // процент положения ползунка относительно начала
  r.css({
    'background-image': '-webkit-linear-gradient(left ,#FFC200 0%,#FFC200 ' + n + '%,#fff ' + n + '%, #fff 100%)'
  });
};

function declOfNum(titles){
  var number = Math.abs(number);
  var cases = [2, 0, 1, 1, 1, 2];
  return function(number){
    return  titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
  }
}

var beautifyThousend = function (integer) {
  integer = integer ? integer : 0;
  var beautifyed = '';
  while (integer !== 0) {
    beautifyed = ' ' + integer % 1000 + beautifyed;
    integer -= integer % 1000;
    integer /= 1000;
  }
  return beautifyed;
};

var toTwoChars = function (int) {
  return int < 10 ? '0' + int : int;
};

var updateGetInTime = function () {
  var textElement = $('.receiptTime p');
  var dateObj = new Date();
  var currentHour = dateObj.getHours();
  var currentMinutes = dateObj.getMinutes();

  var minutes = (currentMinutes + 15) % 60;
  var hours = currentHour + Math.trunc(currentMinutes / 60);
  hours = (24 === hours) ? 0 : hours;

  textElement.text(
    'в ' + toTwoChars(hours) + ':' + toTwoChars(minutes)
  );
};

var extraditionTextSet = function () {

  var clients = declOfNum(['клиенту', 'клиентам', 'клиентам']);
  var msInDay = 1000 * 60 * 60 * 24; // милисекунд в сутках
  var d = new Date(2017, 5, 1);
  var cd = new Date();
  var extraditions = Math.trunc(335 * (cd - d) / msInDay);

  $('header .extradition span').text(
    beautifyThousend(extraditions + 160000)
  );

  $('.block4 .extradition span').text(extraditions % 335);

  $('.block5-head h2 span').text(
    beautifyThousend(extraditions + 160000) + ' ' + clients(extraditions)
  );

};

$(document).ready(function () {

    $('.fancybox').fancybox();

    $(".phone").mask("+7 (999) 999-99-99");

    $(document).scroll(function() {
        if ($(this).scrollTop() > 20){
            $("header").addClass("header-white");
            $(".burger-block").addClass("burger-orange");
            $(".burger-orange").click(function () {
                $(".burger-orange").toggleClass("burger-orange-open");
            });
        }
        else{
            $("header").removeClass("header-white");
            $(".burger-block").removeClass("burger-orange");

        }
    });

    $('input').change(function() {
        $('input').removeClass('incorrect correct');
    });

    $(".burger-block").click(function () {
        var habmenu = $(".habmenu");
        if (habmenu.is(':visible')) {
            habmenu.slideUp(300, function () {
                $("header").removeClass("header-orange");
                $(".burger-block").removeClass("burger-block-open");
                $(".logo-block").removeClass("logo-block-white");
            });
        } else {
            $("header").addClass("header-orange");
            $(".burger-block").addClass("burger-block-open");
            $(".logo-block").addClass("logo-block-white");
            habmenu.slideDown(300);

        }


    });

    $(".question a").click(function () {
        $(this).parent().find(".answer-text").slideToggle();
    });

    $(".reviews-slider .slick-slider").slick({
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: ".slick-prev",
        nextArrow: ".slick-next",
        responsive: [
            {
                breakpoint: 1270,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });



    var _download = false;
    var _target='';
    $('form').ajaxForm({
        beforeSubmit: function(d, $e){
            $('input').removeClass('incorrect');

            var emailReg = new RegExp("^[-0-9a-z\._]+\@[-0-9a-z\.]+\.[a-z]{2,4}$", "i"),
                phoneReg = '';

            for (var j in d) {
                /*телефон*/
                if(d[j].name == 'phone' && d[j].value == '') {
                    $e.find('input[name="phone"]').addClass('incorrect');
                    return false;
                }

                if(d[j].name == 'phone' && d[j].value != '') {
                    for (var i = 0; i <= 9; i++) {
                        phoneReg = new RegExp(i.toString() + i.toString() + i.toString() + i.toString() + i.toString() + i.toString() + i.toString());

                        if (phoneReg.test(d[j].value)) {
                            $e.find('input[name="phone"]').addClass('incorrect');
                            return false;
                        }
                    }
                }

                $e.find('input[name="phone"]').addClass('correct');

                /*имя*/
                if(d[j].name == 'name' && d[j].value == '') {
                    $e.find('input[name="name"]').addClass('incorrect');
                    return false;
                }

                $e.find('input[name="name"]').addClass('correct');

                /*email*/
                if(d[j].name == 'email' && d[j].value == '') {
                    $e.find('input[name="email"]').addClass('incorrect');
                    return false;
                }

                if (d[j].name == 'email' && d[j].value != "") {
                    if (!emailReg.test(d[j].value)) {
                        $e.find('input[name="email"]').addClass('incorrect');
                        return false;
                    }
                }

                $e.find('input[name="email"]').addClass('correct');

                /*цель*/
                if (d[j].name == 'target') {
                    _target = d[j].value;
                }

                if (d[j].name == 'download') {
                    _download = true;
                }
            }

            return true;
        },

        success: function(data){
            if (_download == true) {

                var link = document.createElement('a');
                link.setAttribute('href','/price.pdf');
                link.setAttribute('download','download');
                onload=link.click();

                _download = false;
            }
            console.info(data);
            $('input').removeClass('incorrect correct');
            $.fancybox($('.thnx'));
        }
    });

  updateGetInTime();
  setInterval(updateGetInTime, 500);
  extraditionTextSet();

});
