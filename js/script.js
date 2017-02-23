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
          $('.content_container', plus).css('padding-top', '50px');
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
    getMunicipalityCollectionData2014: function () {
      return $.ajax({
        dataType:'json',
        method:'GET',
        success: function (data) {
          plusApp.municipalityCollectionData2014 = data;
        },
        url: plusApp.path + 'data/2014/municipality_collection.json'
      });
    },
    getMunicipalityHomecareStaffData2014: function () {
      return $.ajax({
        dataType:'json',
        method:'GET',
        success: function (data) {
          plusApp.municipalityHomecareStaffData2014 = data;
        },
        url: plusApp.path + 'data/2014/municipality_homecare_staff.json'
      });
    },
    // getMunicipalityRehabilitationStaffData2014: function () {
    //   return $.ajax({
    //     dataType:'json',
    //     method:'GET',
    //     success: function (data) {
    //       plusApp.municipalityRehabilitationStaffData2014 = data;
    //     },
    //     url: plusApp.path + 'data/2014/municipality_rehabilitation_staff.json'
    //   });
    // },
    // getMunicipalityHomeCareUnitData2014: function () {
    //   return $.ajax({
    //     dataType:'json',
    //     method:'GET',
    //     success: function (data) {
    //       plusApp.municipalityHomeCareUnitData2014 = data;
    //     },
    //     url: plusApp.path + 'data/2014/municipality_homecareunit.json'
    //   });
    // },
    getMunicipalityData2016: function () {
      return $.ajax({
        dataType:'json',
        method:'GET',
        success: function (data) {
          plusApp.municipalityData2016 = data;
        },
        url: plusApp.path + 'data/2016/data.json'
      });
    },
    getMunicipalityData: function () {
      $.when(
        plusApp.getMunicipalityCollectionData2014(),
        plusApp.getMunicipalityHomecareStaffData2014(),
        // plusApp.getMunicipalityRehabilitationStaffData2014(),
        // plusApp.getMunicipalityHomeCareUnitData2014(),
        plusApp.getMunicipalityData2016()
      ).done(function () {
        plusApp.initChosen('.municipality_selection');
      });
    },
    initChosen: function (element) {
      $(element, plus).chosen({no_results_text: 'Ei löydy kuntaa haulla'});
    },
    updateMunicipalityData: function () {
      $.each(plusApp.municipalityCollectionData2014[plusApp.selectedMunicipalityCollection2014], function (element, data) {
        var text = (data !== '') ? data : 'Ei tiedossa';
        $('.' + element, plus).text(text);
      });        
      // $.each(plusApp.municipalityRehabilitationStaffData2014[plusApp.selectedMunicipality], function (element, data) {
      //   var text = (data !== '') ? plusApp.formatNr(data) : 'Ei tiedossa';
      //   $('.' + element, plus).html(text);
      // });
      // $.each(plusApp.municipalityHomecareStaffData2014[plusApp.selectedMunicipality], function (element, data) {
      //   var text = (data !== '') ? plusApp.formatNr(data) : 'Ei tiedossa';
      //   $('.' + element, plus).html(text);
      // });
      $.each(plusApp.municipalityData2016[plusApp.selectedMunicipalityCollection2016], function (element, data) {
        if (plusApp.dataDesc[element] !== undefined) {
          if (plusApp.dataDesc[element] !== false) {
            var text = (data !== '') ? plusApp.dataDesc[element][data] : 'Ei tiedossa';
            $('.' + element, plus).html(text);
          }
          else {
            var text = (data !== '') ? plusApp.formatNr(data) : 'Ei tiedossa';
            $('.' + element, plus).html(text);
          }
        }
      });
    },
    // initHomeCareUnitSelection: function () {
    //   if (plusApp.municipalityHomeCareUnitData2014[plusApp.selectedMunicipality]) {
    //     var container = $('.homecareunit_selection', plus);
    //     $('.homecareunit_selection_container', plus).show();
    //     $('.homecareunit_selection_empty_container', plus).hide();
    //     $('.homecareunit_option', plus).remove();
    //     $.each(plusApp.municipalityHomeCareUnitData2014[plusApp.selectedMunicipality], function (i, homecareunit) {
    //       $('<option value="' + homecareunit.unit + '" data-id="' + i + '" class="homecareunit_option">' + homecareunit.unit + '</option>').appendTo(container);
    //     });
    //   }
    //   else {
    //     $('.homecareunit_selection_empty_container', plus).show();
    //     $('.homecareunit_selection_container', plus).hide();
    //   }
    //   plusApp.initChosen('.homecareunit_selection');
    // },
    // setHomeCareUnitData: function (selected_unit) {
    //   var elements = ['s_6_q_1','s_6_q_2','s_6_q_8','s_6_q_6','s_6_q_7','s_6_q_3','s_6_q_4'];
    //   $.each(elements, function (i, element) {
    //     $('.' + element, plus).text(plusApp.municipalityHomeCareUnitData2014[plusApp.selectedMunicipality][selected_unit][element]);
    //   });
    //   $('.homecareunit_container', plus).slideDown(500);
    // },
    initSomelinks: function () {
      $('<table class="share_container"><tr><td><a href="" class="facebook" target="_blank" title="Jaa Facebookissa"><i class="fa fa-yle-some fa-facebook"></i></a></td><td><a href="" class="twitter" target="_blank" title="Jaa Twitteriss&auml;"><i class="fa fa-yle-some fa-twitter"></i></a></tr><tr class="some_numbers"><td><span class="facebook_nr"></span></td><td><span class="twitter_nr"></span></td></tr></table>').appendTo($('.container', plus));
      var url = window.location.href.replace(/#.*$/, '');

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
    updateMunicipality: function (element) {
      $('.municipality_selection_button_container', plus).slideDown(500);
      plusApp.selectedMunicipalityCollection2014 = element.find('option:selected').data('organizer2014');
      plusApp.selectedMunicipalityCollection2016 = element.find('option:selected').data('organizer2016');
      plusApp.selectedMunicipality = element.find('option:selected').data('municipality');
      plusApp.updateMunicipalityData();
      // plusApp.initHomeCareUnitSelection();
      $('.homecareunit_container', plus).slideUp(500);
      $('.homecareunit_selection', plus).trigger('liszt:updated');
      /*jshint -W030 */
      (element.val()) ? $('.select_municipality', plus).addClass('active').removeAttr('disabled') : $('.select_municipality', plus).removeClass('active').attr('disabled', 'disabled');
      $('.municipality_selection', plus).find('option').removeAttr('selected');
      $('.municipality_selection', plus).find('option[data-municipality="' + plusApp.selectedMunicipality + '"]').prop('selected', true);
      $('.municipality_selection', plus).trigger('liszt:updated');
      $('.selected_municipality', plus).hide().fadeIn(500).html(plusApp.selectedMunicipality);
      $('.answer', plus).hide().fadeIn(500);

      plusApp.updateColumnChart($('.init_view .municipality_selection', plus).find('option:selected').data('value2015'), $('.municipality_selection', plus).find('option:selected').data('value2030'));

      // Reset feedback form.
      $('.feedback_textarea', plus).removeAttr('disabled').val('');
      $('.feedback_container .submit', plus).show();
      $('.feedback_container .thank_you', plus).hide();
      $('.feedback_container', plus).slideUp(500);
    },
    updateColumnChart: function (y2015, y2030) {
      $.fn.peity.defaults.pie = {
        delimiter:null,
        fill:['#333', '#ffde53'],
        height:null,
        radius:(plus.width() < 400) ? 60 : 100,
        width:null
      };
      $('.value_2015', plus).html(plusApp.formatNr(y2015, true) + ' %');
      $('.value_2030', plus).text(plusApp.formatNr(y2030, true) + ' %');
      $('.pie_2015', plus).text(y2015 +',' + (100 - y2015));
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
          $(element, plus).fadeIn(500);
        }
      }
      else {
        $('.container', plus).slideUp(1000);
        $(element, plus).slideDown(1000);
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
          plusApp.updateMunicipality($(this));
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
        $('.feedback_' + $(this).data('question-id'), plus).slideToggle(500);
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
      plusApp.getMunicipalityData();
      plusApp.initSomelinks();
      plusApp.selectedView = $('.init_view', plus);
      plusApp.selectedView.slideDown(2000);
      window.location.hash = 'etusivu';
      plusApp.initialized = true;
      plusApp.dataDesc = {
        K107_1:false,
        K107_2:false,
        K107_3:false,
        K107_4:false,
        K108_1:false,
        K108_2:false,
        K108_3:false,
        K108_4:false,
        K108_5:false,
        K109_1:false,
        K109_2:false,
        K109_3:false,
        K109_4:false,
        K109_5:false,
        K115_1:{
          1:'Kyllä',
          0:'Ei'
        },
        K115_4:{
          1:'Kyllä',
          0:'Ei'
        },
        K115_7:{
          1:'Kyllä',
          0:'Ei'
        },
        K63_2:{
          5:'Liikaa',
          1:'Riittävästi',
          2:'Melko riittävästi',
          3:'Kohtuullisesti',
          4:'Riittämättömästi',
          6:'Ei tarvetta'
        },
        K63_3:{
          5:'Liikaa',
          1:'Riittävästi',
          2:'Melko riittävästi',
          3:'Kohtuullisesti',
          4:'Riittämättömästi',
          6:'Ei tarvetta'
        },
        K63_4:{
          5:'Liikaa',
          1:'Riittävästi',
          2:'Melko riittävästi',
          3:'Kohtuullisesti',
          4:'Riittämättömästi',
          6:'Ei tarvetta'
        },
        K63_5:{
          5:'Liikaa',
          1:'Riittävästi',
          2:'Melko riittävästi',
          3:'Kohtuullisesti',
          4:'Riittämättömästi',
          6:'Ei tarvetta'
        },
        K63_6:{
          5:'Liikaa',
          1:'Riittävästi',
          2:'Melko riittävästi',
          3:'Kohtuullisesti',
          4:'Riittämättömästi',
          6:'Ei tarvetta'
        },
        K63_7:{
          5:'Liikaa',
          1:'Riittävästi',
          2:'Melko riittävästi',
          3:'Kohtuullisesti',
          4:'Riittämättömästi',
          6:'Ei tarvetta'
        },
        K63_8:{
          5:'Liikaa',
          1:'Riittävästi',
          2:'Melko riittävästi',
          3:'Kohtuullisesti',
          4:'Riittämättömästi',
          6:'Ei tarvetta'
        },
        K62A:{
          1:'Täysin riittävästi',
          2:'Melko riittävästi',
          3:'Melko riittämättömästi',
          4:'Täysin riittämättömästi'
        },
        K62B:{
          1:'Täysin riittävästi',
          2:'Melko riittävästi',
          3:'Melko riittämättömästi',
          4:'Täysin riittämättömästi'
        },
        K62D:{
          1:'Täysin riittävästi',
          2:'Melko riittävästi',
          3:'Melko riittämättömästi',
          4:'Täysin riittämättömästi'
        },
        K62E:{
          1:'Täysin riittävästi',
          2:'Melko riittävästi',
          3:'Melko riittämättömästi',
          4:'Täysin riittämättömästi'
        },
        K62F:{
          1:'Täysin riittävästi',
          2:'Melko riittävästi',
          3:'Melko riittämättömästi',
          4:'Täysin riittämättömästi'
        },
        K68_9:{
          1:'Aina',
          2:'Useimmiten',
          3:'Joskus',
          4:'Harvoin'
        },
        K68_10:{
          1:'Aina',
          2:'Useimmiten',
          3:'Joskus',
          4:'Harvoin'
        },
        K48:{
          1:'Koulutettua työvoimaa on riittävästi.',
          2:'Koulutettua työvoimaa on melko hyvin.',
          3:'Koulutettua työvoimaa ei ole riittävästi.'
        },
        K93:{
          1:'Kyllä',
          0:'Ei'
        }
      };
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
