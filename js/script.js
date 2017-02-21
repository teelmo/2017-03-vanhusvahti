(function ($) {
  var plus;
  require('peity');
  require('chosen-jquery-browserify');
  var plusApp = {
    formatNr: function (x, addComma) {
      x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');
      x = x.replace('.', ',');
      if (addComma === true && x.indexOf(',') === -1) {
        x = x + ',0';
      }
      return (x === '') ? 0 : x;
    },
    roundNr: function (x, d) {
      return parseFloat(x.toFixed(d));
    },
    setPath: function () {
      if (location.href.match('dev')) {
        plusApp.path = 'http://dev.yle.fi/2017/' + plusApp.projectName + '/public/';
      }
      else if (location.href.match('yle.fi/plus')) {
        plusApp.path = 'http://yle.fi/plus/yle/2017/' + plusApp.projectName + '/';
      }
      else {
        plusApp.path = 'http://plus.yle.fi/' + plusApp.projectName + '/';
      }
    },
    getScale: function () {
      var width = plus.width();
      if (width >= 600) {
        plus.addClass('wide');
        return true;
      }
      if (width < 600) {
        plus.removeClass('wide');
        return false;
      }
    },
    initMediaUrls: function () {
      $.each($('.handle_img', plus), function (i, el) {
        $(this).attr('src', plusApp.path + 'img/' + $(this).attr('data-src'));
      });
    },
    initMoveScroller: function () {
      var move = function () {
        var st = $(window).scrollTop();
        var top = $('.top_anchor', plus).offset().top;
        var bottom = $('.bottom_anchor', plus).offset().top - 150;
        var s = $('.header', plus);
        if (window.location.hash == '#etusivu') {
          s.hide();
        }
        else if (st > top && st < bottom) {
          s.css({
            position: 'fixed',
            top: 0,
            width: plus.width() + 'px'
          }).show();
          if (plus.hasClass('wide')) {
            $('.content_container', plus).css('padding-top', '50px');
          }
          else {
            $('.content_container', plus).css('padding-top', '50px');
          }
        } 
        else {
          $('.content_container', plus).css('padding-top', '0');
          if (st <= top) {
            s.css({
              position: 'relative',
              width: '100%'
            }).show();
          }
          else {
            s.hide();
          }
        }
      };
      $(window).scroll(move);
    },
    initHeights: function () {
      if ($('html').hasClass('no-touch')) {
        // $('.init_view', plus).height($(window).height());
      } 
    },
    scaleHeights: function () {
      // var container = $('.init_view', plus).css('height', 'auto');
      // var height = (($(window).height() - 50) > container.outerHeight()) ? $(window).height() - 50 : container.outerHeight();
      // container.height(height);
    },
    initChosen: function (element) {
      $(element, plus).chosen();
    },
    getMunicipalitySelectionData: function () {
      $.ajax({
        dataType:'json',
        method:'GET',
        success: function (data) {
          plusApp.initMunicipalitySelection(data);
        },
        url: plusApp.path + 'data/municipality.json'
      });
    },
    initMunicipalitySelection: function (data) {
      var container = $('.municipality_selection', plus);
      $.each(data, function (i, municipality) {
        $('<option value="' + municipality.o + '" data-municipality="' + municipality.m + '" data-value-2013="' + municipality.y2013 + '" data-value-2030="' + municipality.y2030 + '">' + municipality.m + '</option>').appendTo(container);
      });
      plusApp.initChosen('.municipality_selection');
    },
    getMunicipalityData: function () {
      $.ajax({
        dataType:'json',
        method:'GET',
        success: function (data) {
          plusApp.municipalityCollectionData = data;
        },
        url: plusApp.path + 'data/municipality_collection.json'
      });
      $.ajax({
        dataType:'json',
        method:'GET',
        success: function (data) {
          plusApp.municipalityHomecareStaffData = data;
        },
        url: plusApp.path + 'data/municipality_homecare_staff.json'
      });
      $.ajax({
        dataType:'json',
        method:'GET',
        success: function (data) {
          plusApp.municipalityRehabilitationStaffData = data;
        },
        url: plusApp.path + 'data/municipality_rehabilitation_staff.json'
      });
      $.ajax({
        dataType:'json',
        method:'GET',
        success: function (data) {
          plusApp.municipalityHomeCareUnitData = data;
        },
        url: plusApp.path + 'data/municipality_homecareunit.json'
      });
    },
    setMunicipalityData: function () {
      var elements;
      if (plusApp.municipalityCollectionData[plusApp.selectedMunicipalityCollection]) {
        $.each(plusApp.municipalityCollectionData[plusApp.selectedMunicipalityCollection], function (element, data) {
          $('.' + element, plus).text(data);
        });        
      }
      else {
        elements = ['s_1_q_1','s_1_q_2','s_1_q_3','s_2_q_2','s_2_q_1','s_2_q_3','s_2_q_4','s_3_q_1','s_3_q_2','s_3_q_3','s_3_q_4','s_4_q_1','s_4_q_2','s_4_q_4','s_5_q_1','s_5_q_2'];
        $.each(elements, function (i, element) {
          $('.' + element, plus).text('Ei tiedossa');
        });
      }
      if (plusApp.municipalityRehabilitationStaffData[plusApp.selectedMunicipality]) {
        $.each(plusApp.municipalityRehabilitationStaffData[plusApp.selectedMunicipality], function (element, data) {
          $('.' + element, plus).html(plusApp.formatNr(data));
        });
      }
      else {
        elements = ['s_4_q_3a','s_4_q_3b'];
        $.each(elements, function (i, element) {
          $('.' + element, plus).text('Ei tiedossa');
        });
      }
      if (plusApp.municipalityHomecareStaffData[plusApp.selectedMunicipality]) {
        $.each(plusApp.municipalityHomecareStaffData[plusApp.selectedMunicipality], function (element, data) {
          $('.' + element, plus).html(plusApp.formatNr(data));
        });
      }
      else {
        elements = ['s_5_q_3a','s_5_q_3b'];
        $.each(elements, function (i, element) {
          $('.' + element, plus).text('Ei tiedossa');
        });
      }
    },
    initHomeCareUnitSelection: function () {
      if (plusApp.municipalityHomeCareUnitData[plusApp.selectedMunicipality]) {
        var container = $('.homecareunit_selection', plus);
        $('.homecareunit_selection_container', plus).show();
        $('.homecareunit_selection_empty_container', plus).hide();
        $('.homecareunit_option', plus).remove();
        $.each(plusApp.municipalityHomeCareUnitData[plusApp.selectedMunicipality], function (i, homecareunit) {
          $('<option value="' + homecareunit.unit + '" data-id="' + i + '" class="homecareunit_option">' + homecareunit.unit + '</option>').appendTo(container);
        });
      }
      else {
        $('.homecareunit_selection_empty_container', plus).show();
        $('.homecareunit_selection_container', plus).hide();
      }
      plusApp.initChosen('.homecareunit_selection');
    },
    setHomeCareUnitData: function (selected_unit) {
      var elements = ['s_6_q_1','s_6_q_2','s_6_q_8','s_6_q_6','s_6_q_7','s_6_q_3','s_6_q_4'];
      $.each(elements, function (i, element) {
        $('.' + element, plus).text(plusApp.municipalityHomeCareUnitData[plusApp.selectedMunicipality][selected_unit][element]);
      });
      $('.homecareunit_container', plus).slideDown(500, plusApp.scaleHeights);
    },
    initHeader: function () {
      var container = $('.content_container .header .inner', plus);
      var content_wrapper = $('<div class="content_wrapper"></div>').appendTo(container);
      $('<div class="municipality_selection_container"><select class="municipality_selection chosen_select"><option value="" disabled="disabled" selected="selected">Valitse kunta</option><option value="" disabled="disabled">- - - - - - - - - -</option></select></div>').appendTo(content_wrapper);
      $('<div class="category_selection_container"><span class="selected_category"></span><span class="category_selection_list_toggler"><i class="fa fa-align-justify"></i></span><ul class="category_selection_list hidden"><li><a href="javascript:;" class="question_view_anchor_1" data-show=".questions_view_1">Hakeminen</a></li><li><a href="javascript:;" class="question_view_anchor_2" data-show=".questions_view_2">Odotusajat</a></li><li><a href="javascript:;" class="question_view_anchor_3" data-show=".questions_view_3">Omaishoito</a></li><li><a href="javascript:;" class="question_view_anchor_4" data-show=".questions_view_4">Kuntoutus</a></li><li><a href="javascript:;" class="question_view_anchor_5" data-show=".questions_view_5">Henkilöstö</a></li><li><a href="javascript:;" class="question_view_anchor_6" data-show=".questions_view_6">Kotihoito</a></li></ul></div>').appendTo(content_wrapper);
    },
    initSomelinks: function () {
      $('<table class="share_container"><tr><td><a href="" class="facebook" target="_blank" title="Jaa Facebookissa"><i class="fa fa-yle-some fa-facebook"></i></a></td><td><a href="" class="twitter" target="_blank" title="Jaa Twitteriss&auml;"><i class="fa fa-yle-some fa-twitter"></i></a></tr><tr class="some_numbers"><td><span class="facebook_nr"></span></td><td><span class="twitter_nr"></span></td></tr></table>').appendTo($('.container', plus));

      var url = 'http://yle.fi/uutiset/7853653';

      // Facebook share.
      var fbtitle = 'Ylen Vanhusvahti avattu – katso missä jamassa oman kuntasi vanhuspalvelut ovat';
      // var fbtext = 'Testaa, tiedätkö sinä, millaisesta ruuasta sydämesi ja verisuonesi pitäisivät.';

      $('.facebook', plus).attr({href: 'https://www.facebook.com/dialog/feed?app_id=147925155254978&display=popup&name=' + encodeURIComponent(fbtitle) + '&link=' + encodeURIComponent(url) + '&redirect_uri=' + url + '&picture=' + encodeURIComponent('http://img.yle.fi/uutiset/kotimaa/article7866073.ece/ALTERNATES/w960/vanhusvahti+tunnus')});

      // Twitter share.
      var twtext = 'Ylen Vanhusvahti avattu – katso missä jamassa oman kuntasi vanhuspalvelut ovat';
      $('.twitter', plus).attr({href: 'https://twitter.com/share?url=' + encodeURIComponent(url) + '&hashtags=vanhusvahti&text=' + encodeURIComponent(twtext)});

      // $.ajax({
      //   dataType:'json',
      //   method:'GET',
      //   success: function (data) {
      //     $('.facebook_nr', plus).append(data.data.shares.facebook);
      //     $('.twitter_nr', plus).append(data.data.shares.twitter);
      //   },
      //   url: 'http://yle.fi/uutiset/alpha.yle.fi/somenumbers?uri=http://yle.fi/uutiset/ylen_vanhusvahti_avattu__katso_missa_jamassa_oman_kuntasi_vanhuspalvelut_ovat/7853653'
      // });
    },
    updateColumnChart: function (y2013, y2030) {
      $.fn.peity.defaults.pie = {
        delimiter:null,
        fill:['#333', '#ffde53'],
        height:null,
        radius:(plus.width() < 400) ? 60 : 100,
        width:null
      };
      $('.value_2013', plus).html(plusApp.formatNr(y2013, true) + ' %');
      $('.value_2030', plus).text(plusApp.formatNr(y2030, true) + ' %');
      $('.pie_2013', plus).text(y2013 +',' + (100 - y2013));
      $('.pie_2030', plus).text(y2030 +',' + (100 - y2030));
      $('.pie', plus).peity('pie'); 
    },
    hashChange: function () {
      if (window.location.hash !== '#etusivu') {
        plusApp.initialized = false;
      }
      if (plusApp.initialized === true) return false;
      var hash_views = {
        '#null': '.init_view',
        '#etusivu': '.init_view',
        '#aihevalinta': '.subject_view',
        '#hakeminen': '.questions_view_1',
        '#odotusajat': '.questions_view_2',
        '#omaishoito': '.questions_view_3',
        '#kuntoutus': '.questions_view_4',
        '#henkilokunta': '.questions_view_5',
        '#kotihoito': '.questions_view_6'
      };
      var element = hash_views[window.location.hash];
      window.location.hash = $(element, plus).data('hash');
      $('.category_selection_list', plus).slideUp();
      /*jshint -W030 */
      (window.location.hash == '#etusivu') ? $('.content_container .header', plus).slideUp() : $('.content_container .header', plus).slideDown();
      if (plusApp.selectedView.data('show-type') == 'fade' && $(element, plus).data('show-type') == 'fade') {
        if (plusApp.selectedView.data('hash') != $(element, plus).data('hash')) {
          $('.container', plus).hide();
          $(element, plus).fadeIn(500, plusApp.scaleHeights);
        }
      }
      else {
        $('.container', plus).slideUp(1000);
        $(element, plus).slideDown(1000, plusApp.scaleHeights);
      }
      ($(element, plus).hasClass('questions_view')) ? $('.selected_category', plus).html($(element, plus).data('name')) : $('.selected_category', plus).text('Aihealue');
      plusApp.selectedView = $(element, plus);
      $('html, body').animate({scrollTop: $('html').last().offset().top}, 300);
      // Google analytics tracker.
      if (typeof yleAnalytics !== 'undefined') {
        yleAnalytics.trackEvent('plus_' + plusApp.projectName + '_nakyma_' + element);
      }
    },
    initEvents: function () {
      $(window).on('resize', plusApp.getScale);
      $(window).on('hashchange', plusApp.hashChange);
      // Municipality selection change.
      plus.on('change', '.municipality_selection', function (event) {
        if ($(this).find('option:selected').val() !== '') {
          $('.municipality_selection_button_container', plus).slideDown(500, plusApp.scaleHeights);
          plusApp.selectedMunicipalityCollection = $(this).find('option:selected').val();
          plusApp.selectedMunicipality = $(this).find('option:selected').html();
          plusApp.setMunicipalityData();
          plusApp.initHomeCareUnitSelection();
          $('.homecareunit_container', plus).slideUp(500, plusApp.scaleHeights);
          $('.homecareunit_selection', plus).trigger('liszt:updated');
          /*jshint -W030 */
          ($(this).val()) ? $('.select_municipality', plus).addClass('active').removeAttr('disabled') : $('.select_municipality', plus).removeClass('active').attr('disabled', 'disabled');
          $('.municipality_selection', plus).find('option').removeAttr('selected');
          $('.municipality_selection', plus).find('option[data-municipality="' + plusApp.selectedMunicipality + '"]').prop('selected', true);
          $('.municipality_selection', plus).trigger('liszt:updated');
          $('.selected_municipality', plus).hide().fadeIn(500).html(plusApp.selectedMunicipality);
          $('.answer', plus).hide().fadeIn(500);

          plusApp.updateColumnChart($('.init_view .municipality_selection', plus).find('option:selected').attr('data-value-2013'), $('.municipality_selection', plus).find('option:selected').attr('data-value-2030'));

          // Reset feedback form.
          $('.feedback_textarea', plus).removeAttr('disabled').val('');
          $('.feedback_container .submit', plus).show();
          $('.feedback_container .thank_you', plus).hide();
          $('.feedback_container', plus).slideUp(500, plusApp.scaleHeights);
          // Google analytics tracker.
          if (typeof yleAnalytics !== 'undefined') {
            yleAnalytics.trackEvent('plus_' + plusApp.projectName + '_kunta_' + plusApp.selectedMunicipality);
          }
        }
        else {
          event.preventDefault();
        }
      });
      // Homecareunit selection change.
      plus.on('change', '.homecareunit_selection', function (event) {
        if ($(this).find('option:selected').val() !== '') {      
          plusApp.selectedHomeCareUnit = $(this).find('option:selected').html();
          plusApp.setHomeCareUnitData($(this).find('option:selected').data('id'));
          // Google analytics tracker.
          if (typeof yleAnalytics !== 'undefined') {
            yleAnalytics.trackEvent('plus_' + plusApp.projectName + '_kotihoito_' + plusApp.selectedHomeCareUnit);
          }
        }
        else {
          event.preventDefault();
        }
      });
      // Category selection list toggle.
      plus.on('click', '.category_selection_list_toggler', function () {
        $('.category_selection_list', plus).slideToggle();
      });
      // Handle category selection click in list.
      plus.on('click', '.category_selection_list a', function () {
        $('.category_selection_list a', plus).removeClass('active');
        $(this).addClass('active');
      });
      // Handle category selection click in view.
      plus.on('click', '.category_container', function () {
        $('.category_selection_list a', plus).removeClass('active');
        $('.question_view_anchor_' + $(this).data('id')).addClass('active');
      });
      plus.on('click', '.navigation_container a', function () {
        $('.category_selection_list a', plus).removeClass('active');
        $('.question_view_anchor_' + $(this).data('id')).addClass('active');
      });
      // Submit comment.
      plus.on('click', '.feedback_container .submit', function () {
        $('.municipality_input', plus).val(plusApp.selectedMunicipality);
        /*jshint -W030 */
        ($('.feedback_' + $(this).data('container'), plus).find('.input_question').val() == 's_6') ? $('.homecareunit_input', plus).val(plusApp.selectedHomeCareUnit) : $('.homecareunit_input', plus).val('');
        $('.question_input', plus).val($('.feedback_' + $(this).data('container'), plus).find('.input_question').val());
        $('.comment_input', plus).val($('.feedback_' + $(this).data('container'), plus).find('.feedback_textarea').val());
        $('.plus_form', plus)[0].submit();
        $('.feedback_' + $(this).data('container'), plus).find('.feedback_textarea').attr('disabled', 'disabled');
        $('.feedback_' + $(this).data('container'), plus).find('.submit').hide();
        $('.feedback_' + $(this).data('container'), plus).find('.thank_you').fadeIn();
      });
      // Change view.
      plus.on('click', '.select_municipality, .category_container, .category_selection_list a', function () {
        window.location.hash = $($(this).data('show'), plus).data('hash');
      });
      plus.on('click', '.feedback_toggle .button', function () {
        $('.feedback_' + $(this).data('question-id'), plus).slideToggle(500, plusApp.scaleHeights);
      });
    },
    unmount: function () {
      $(window).off('resize', plusApp.getScale);
      $(window).off('hashchange', plusApp.hashChange);
      if (plus !== undefined) {
        plus.unbind();
      }
      delete window.plusApp[plusApp.projectName];
    },
    mount: function () {
      plusApp.init();
      plusApp.isInitialized = true;
    },
    init: function () {
      plus = $('.plus-app.plus-app-' + plusApp.projectName);
      plusApp.setPath();
      plusApp.getScale();
      plusApp.initMediaUrls();
      plusApp.initEvents();

      plusApp.initMoveScroller();
      plusApp.initMediaUrls();
      plusApp.initHeader();
      plusApp.getMunicipalitySelectionData();
      plusApp.getMunicipalityData();
      plusApp.initEvents();
      plusApp.selectedView = $('.init_view', plus);
      plusApp.initialized = true;
      window.location.hash = 'etusivu';
      $('.init_view', plus).slideDown(2000, plusApp.scaleHeights);
      plusApp.initSomelinks();
    },
    meta: {
      id:this.projectName,
      version:'1.0.0'
    }
  };
  plusApp.projectName = '2017-03-vanhusvahti';
  if (window.plusApp === undefined) {
    window.plusApp = {};
  }
  if (window.plusApp[plusApp.projectName] === undefined) {
    window.plusApp[plusApp.projectName] = plusApp;
    window.plusApp[plusApp.projectName].mount();
  }
})(jQuery);
