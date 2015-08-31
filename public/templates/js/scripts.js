var socket = io('http://52.26.186.75');

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
});


socket.on('bridge data', function (data) {
  $("#bridges").text("");
  console.log("foo");
  $.each(data, function (bridge) {
    $("#bridges").append(
<<<<<<< HEAD
      "<div class='bridge-info'>" +
      "<span class='led " +
        (
          data[bridge].status ? "led-red'> UP </span>"
                              : "led-green'> DOWN </span>"
        ) + "<span class='bridge' data-role='content'>" + bridge + "</span>" + "</div>"
=======
      "<div><span class='led " +
        (
          data[bridge].status ? "led-red"
                              : "led-green"
        ) + "'></span>" + "<span class='bridge' data-role='content'>" +
        bridge + "</span></div>" + "<br><br>"
>>>>>>> 11ad4b365fdb107b7478a6d28d5477f682aabda9
    );
  });
});
