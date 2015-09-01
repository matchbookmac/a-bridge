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
      e.preventDefault();
      (this.classList.contains("is-active") === true) ? this.classList.remove("is-active") : this.classList.add("is-active");
      slideout.toggle();

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
      $("toggle-button").click();
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
      slideout.toggle();
    });

    $( "#hawthorne").click(function(){
      $("#bridge-page").hide();
      $("#hawthorne-page").show();
    });

    $( "#morrison").click(function(){
      $("#bridge-page").hide();
      $("#morrison-page").show();
    });

    $( "#burnside").click(function(){
      $("#bridge-page").hide();
      $("#burnside-page").show();
    });

    $( "#broadway").click(function(){
      $("#bridge-page").hide();
      $("#broadway-page").show();
    });

    $( "#cuevas-crossing").click(function(){
      $("#bridge-page").hide();
      $("#cuevas-crossing-page").show();
    });


});
