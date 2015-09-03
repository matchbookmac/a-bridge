var socket = io('http://52.26.186.75');

socket.on('bridge data', function (data) {
  // $("#bridges").text("");
  $.each(data, function (bridge) {
    if(data[bridge].status){
      bridge = bridge.replace(/\s/g, '-');
      $("#" + bridge + "-led").removeClass("led-green", 1000, "easeInBack");
      $("#" + bridge + "-led").addClass("led-red", 1000, "easeInBack");
    }
      else {
        bridge = bridge.replace(/\s/g, '-');
        $("#" + bridge + "-led").removeClass("led-red").addClass("led-green")
      };
  });

});



$( document ).ready(function() {
  var slideout = new Slideout({
      'panel': document.getElementById('panel'),
      'menu': document.getElementById('menu'),
      'padding': 256,
      'tolerance': 70
    });

    (function() {

    "use strict";

    var toggles = document.querySelectorAll(".c-hamburger");

    for (var i = toggles.length - 1; i >= 0; i--) {
    var toggle = toggles[i];
    toggleHandler(toggle);
    };

    function toggleHandler(toggle) {
    toggle.addEventListener( "click", function(e) {
      console.log(this.classList.toString());
      e.preventDefault();
      if (this.classList.contains("c-hamburger--htla") === true) {
        $("#toggle-button").removeClass("c-hamburger--htla").addClass("c-hamburger--htx");
        $("#bridge-page").show();
        $("#feed-page").hide();
        $("#terms-page").hide();
        $("#hawthorne-page").hide();
        $("#morrison-page").hide();
        $("#burnside-page").hide();
        $("#broadway-page").hide();
        $("#cuevas-crossing-page").hide();
        $("#toggle-button").removeClass("is-active");
      } else if (this.classList.contains("is-active") === true) {
        this.classList.remove("is-active");
        slideout.toggle();
      } else {this.classList.add("is-active");
      slideout.toggle();
      }
    });
  }
    })();

    document.querySelector('#toggle-button').addEventListener('click', function() {
    });

    $( "#menu-feed" ).click(function() {
      $("#bridge-page").hide();
      $("#feed-page").show();
      $("#terms-page").hide();
      $("#hawthorne-page").hide();
      $("#morrison-page").hide();
      $("#burnside-page").hide();
      $("#broadway-page").hide();
      $("#cuevas-crossing-page").hide();
      $("#toggle-button").removeClass("is-active");
      slideout.toggle();

    });

    $( "#menu-home").click(function(){
      $("#bridge-page").show();
      $("#feed-page").hide();
      $("#terms-page").hide();
      $("#hawthorne-page").hide();
      $("#morrison-page").hide();
      $("#burnside-page").hide();
      $("#broadway-page").hide();
      $("#cuevas-crossing-page").hide();
      $("#toggle-button").removeClass("is-active");
      slideout.toggle();
    });

    $( "#menu-terms").click(function(){
      $("#bridge-page").hide();
      $("#feed-page").hide();
      $("#terms-page").show();
      $("#hawthorne-page").hide();
      $("#morrison-page").hide();
      $("#burnside-page").hide();
      $("#broadway-page").hide();
      $("#cuevas-crossing-page").hide();
      $("#toggle-button").removeClass("is-active");
      slideout.toggle();
    });

    $( "#hawthorne").click(function(){
      $("#hawthorne-last").empty();
      $("#bridge-page").hide();
      $("#hawthorne-page").show();
      $("#toggle-button").removeClass("c-hamburger--htx").addClass("c-hamburger--htla").addClass("is-active");
      $.getJSON( "http://54.191.150.69/bridges/hawthorne/events/actual/5", function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
          var up_time = Date(val.up_time);
          var down_time = Date(val.down_time);
          items.push("<li class='bridge-event'>" + " Time up: " + up_time + "</li>" );
          items.push("<li class='bridge-event'>" + "Time down: " + down_time + "</li><br>" );
        });

      $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
      }).appendTo( "#hawthorne-last" );
      });
      });

    $( "#morrison").click(function(){
      $("#morrison-last").empty();
      $("#bridge-page").hide();
      $("#morrison-page").show();
      $("#toggle-button").removeClass("c-hamburger--htx").addClass("c-hamburger--htla").addClass("is-active");
      $.getJSON( "http://54.191.150.69/bridges/morrison/events/actual/5", function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
          var up_time = Date(val.up_time);
          var down_time = Date(val.down_time);
          items.push("<li class='bridge-event'>" + " Time up: " + up_time + "</li>" );
          items.push("<li class='bridge-event'>" + "Time down: " + down_time + "</li><br>" );
        });

      $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
      }).appendTo( "#morrison-last" );
      });
      });

    $( "#burnside").click(function(){
      $("#burnside-last").empty();
      $("#bridge-page").hide();
      $("#burnside-page").show();
      $("#toggle-button").removeClass("c-hamburger--htx").addClass("c-hamburger--htla").addClass("is-active");
      $.getJSON( "http://54.191.150.69/bridges/burnside/events/actual/5", function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
          var up_time = Date(val.up_time);
          var down_time = Date(val.down_time);
          items.push("<li class='bridge-event'>" + " Time up: " + up_time + "</li>" );
          items.push("<li class='bridge-event'>" + "Time down: " + down_time + "</li><br>" );
        });

      $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
      }).appendTo( "#burnside-last" );
      });
      });

    $( "#broadway").click(function(){
      $("#broadway-last").empty();
      $("#bridge-page").hide();
      $("#broadway-page").show();
      $("#toggle-button").removeClass("c-hamburger--htx").addClass("c-hamburger--htla").addClass("is-active");
      $.getJSON( "http://54.191.150.69/bridges/broadway/events/actual/5", function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
          var up_time = Date(val.up_time);
          var down_time = Date(val.down_time);
          items.push("<li class='bridge-event'>" + " Time up: " + up_time + "</li>" );
          items.push("<li class='bridge-event'>" + "Time down: " + down_time + "</li><br>" );
        });

      $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
      }).appendTo( "#broadway-last" );
      });
      });

    $( "#cuevas-crossing").click(function(){
      $("#cuevas-crossing-last").empty();
      $("#bridge-page").hide();
      $("#cuevas-crossing-page").show();
      $("#toggle-button").removeClass("c-hamburger--htx").addClass("c-hamburger--htla").addClass("is-active");
      $.getJSON( "http://54.191.150.69/bridges/cuevas%20crossing/events/actual/5", function( data ) {
      var items = [];
      $.each( data, function( key, val ) {
        var up_time = Date(val.up_time);
        var down_time = Date(val.down_time);
        items.push("<li class='bridge-event'>" + " Time up: " + up_time + "</li>" );
        items.push("<li class='bridge-event'>" + "Time down: " + down_time + "</li><br>" );
      });

      $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
      }).appendTo( "#cuevas-crossing-last" );
      });
      });


});
