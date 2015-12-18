var app = angular.module('twitchStatusApp', []);
app.controller('ctrl', function($scope, $http) {

  $scope.allUsers = [];
  $scope.onlineUsers = [];
  $scope.offlineUsers = [];

  var regUsers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "robotcaleb", "thomasballinger", "noobs2ninjas", "beohoff", "brunofin", "comster404", "vihart", "lindseykilladude", "tecnobrat"].sort();
  var twitchUrl = 'https://api.twitch.tv/kraken/';
  var auth = '?client_id=gssbm1u7chgtw9tg8jnfpdmatatn9lp&callback=?';

  $('#userMenu li').on('click', function() {
    console.log('Menu clicked');

    if ($(this).data('display') === 'allUsers') {
      console.log('allUsers');
      $scope.profile = $scope.allUsers;
    } else if ($(this).data('display') === 'onlineUsers') {
      console.log('onlineUsers');
      $scope.profile = $scope.onlineUsers;
    } else {
      console.log('offlineUsers');
      $scope.profile = $scope.offlineUsers;
    }
    $scope.$apply();

    $('#userMenu li').removeClass('activeItem');
    $(this).addClass('activeItem');
    console.log($(this).data('display') + ' is active');

  });

  regUsers.forEach(function(stream) {

    var userObj = {};

    $.getJSON(twitchUrl + 'streams/' + stream + auth).success(function(data) {
      var nowStreaming = (data.stream === null) ? false : true;
      var goodUser = (data.stream !== null && data.stream === undefined) ? false : true;
      if (!goodUser) {
        userObj.status = 'red fa fa-warning';
        userObj.streamTitle = 'User account closed';
      } else if (nowStreaming) {
        userObj.status = 'green fa fa-check';
        var streamTitle = data.stream.channel.status;
        userObj.streamTitle = (streamTitle.length > 30) ? streamTitle.substring(0, 27) + '...' : streamTitle;
      } else {
        userObj.status = 'red fa fa-exclamation';
        data.streamTitle = '';
      }
      userObj.username = stream;

      $.getJSON(twitchUrl + 'users/' + stream + auth).success(function(data) {
        userObj.name = data.display_name;
        userObj.logo = data.logo || "http://www.lorempixum.com/50/50";

        $scope.allUsers.push(userObj);
        if (!goodUser) {
          $scope.offlineUsers.push(userObj);
        } else if (nowStreaming) {
          $scope.onlineUsers.push(userObj);
        } else {
          $scope.offlineUsers.push(userObj);
        }
        $scope.profile = $scope.allUsers;
        $scope.$apply();
      });
    });
  });
});
