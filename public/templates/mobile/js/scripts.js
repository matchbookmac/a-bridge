var socket = io('http://52.26.186.75');

socket.on('bridge data', function (data) {
  $("#bridges").text("");
  console.log("foo");
  $.each(data, function (bridge) {
    $("#bridges").append(
      "<div class='bridge-info'>" +
      "<span class='led " +
        (
          data[bridge].status ? "led-red'> UP </span>"
                              : "led-green'> DOWN </span>"
        ) + "<span class='bridge' data-role='content'>" + bridge + "</span>" + "</div>"
    );
  });
});

$( document ).ready(function() {
  var slideout = new Slideout({
      'panel': document.getElementById('panel'),
      'menu': document.getElementById('menu'),
      'padding': 256,
      'tolerance': 70
    });
    document.querySelector('.toggle-button').addEventListener('click', function() {
      slideout.toggle();
    });

    $( "#menu-feed" ).click(function() {
      $("#bridge-page").hide();
      $("#feed-page").show();
      $("#terms-page").hide();
      slideout.toggle();
    });

    $( "#menu-home").click(function(){
      $("#bridge-page").show();
      $("#feed-page").hide();
      $("#terms-page").hide();
      slideout.toggle();
    })

    $( "#menu-terms").click(function(){
      $("#bridge-page").hide();
      $("#feed-page").hide();
      $("#terms-page").show();
      slideout.toggle();
    })
});
