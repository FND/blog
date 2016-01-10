(function(window, $){
  "use strict";

  var selectRootOnChildTargeting = function(post) {
    var root = $('#rlb-main');

    if ((post && post.length > 0) || $('*:target').closest('#rlb-main').length > 0) {
      root.addClass('selected-target')
    } else {
      root.removeClass('selected-target')
    }
  }

  var ScrollStatus = function(post) {
    this.post = post;
    this.rootContainer = this.post.parents('#rlb-main');
    this.hash = "#" + this.post.attr('id');
    this.nav = this.post.find('.post-nav');
    this.display = this.nav.find('.scroll-status');

    if (this.display.length < 1) {
      console.log('ScrollStatus:', 'no post navigation given');
    }

    this.height = this.post.height();

    this.browserHeight = $(window).height();
    this.browserWidth = $(window).width();

    this.repaint();
  };

  ScrollStatus.prototype.bubble = function() {
    return $('<span class="scroll-status-bubble"></span>');
  };

  ScrollStatus.prototype.activateBubble = function(bubble) {
    for (var i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].removeClass('active');
    }

    bubble.addClass('active');

    return bubble;
  };

  ScrollStatus.prototype.repaint = function() {
    this.bubbles = this.bubbles || [];

    for (var i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].remove();
    }

    this.bubbles = [];

    var bubbleCount = Math.max(Math.round(this.height/this.browserHeight), 1);

    for (var j = 0; j < bubbleCount; j++) {
      var bubble = this.bubble();
      this.bubbles.push(bubble);
      this.display.append(bubble);
    }
  };

  ScrollStatus.prototype.refresh = function() {
    var browserHeight = $(window).height();
    var browserWidth = $(window).width();
    var postHeight = this.post.height();

    if (this.browserHeight !== browserHeight
        || this.browserWidth !== browserWidth
        || this.height !== postHeight)
    {
      this.browserHeight = browserHeight;
      this.browserWidth = browserWidth;
      this.height = this.post.height();

      this.repaint();
    }

    var postStart = this.post.offset().top;
    var postEnd = postStart + this.height;
    var viewPortOffset = (this.browserHeight * 1/3);
    var scrollTop = $(window).scrollTop();
    var scrollTopWithOffset = scrollTop + viewPortOffset
    var viewPortCenter = scrollTopWithOffset - postStart;

    if (scrollTopWithOffset >= postStart && scrollTopWithOffset <= postEnd && location.hash !== this.hash) {
      var scrollTarget = scrollTop < (postStart + viewPortOffset) ? postStart : postEnd - this.browserHeight ;

      selectRootOnChildTargeting(this.post);
      this.post.parent().find('.post').removeClass('active');
      this.post.addClass('active');
      window.history.replaceState("", "", this.hash);
    }

    var bubbleIndex = Math.min(Math.max(Math.floor((viewPortCenter) / this.browserHeight), 0), this.bubbles.length);
    if (!!this.bubbles[bubbleIndex]) {
      this.activateBubble(this.bubbles[bubbleIndex]);
    }

    setTimeout(this.refresh.bind(this), 300);
  };



  $.fn.scrollStatus = function() {
    this.each(function(_, post){
      var post = $(post);
      var status = new ScrollStatus(post);

      setTimeout(function(){
        status.refresh();
      }, 500);
    });
  };

  $('.post').scrollStatus();


  selectRootOnChildTargeting();
  $(window).on('hashchange', function(e) {
    selectRootOnChildTargeting();
    return false;
  });


  var heroHammer = new Hammer($('.hero-banner')[0]);
  heroHammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

  heroHammer.on('panright', function(ev) {
    $('.rlb-content').addClass('selected-target');
    setTimeout(function() { $('.rlb-content').css('position', 'static'); }, 500);
  });


}(window, jQuery));