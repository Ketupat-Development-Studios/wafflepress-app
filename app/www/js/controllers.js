angular.module('waffle.controllers', [])

.controller('PostsCtrl', function($scope, $state, $http){
    $scope.waffles = []
    var url = "http://waffle.ketupat.me/feed/"

    function htmlDecode(input){
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }
    $scope.bakeWaffles = function(){
      $http.get(url)
        .success(function(data) {
          xmlDoc = $.parseXML(data)
          xml = $(xmlDoc)
          $(xml).find("item").each(function () {
              var el = $(this);
              var newWaffle = {}
              newWaffle.postId = el.find("guid").text()
                .substring(
                  el.find("guid").text().indexOf("?p=")+3,
                  el.find("guid").text().length
                )
              newWaffle.title = el.find("title").text();
              newWaffle.link = el.find("link")[0].innerHTML;
              newWaffle.description = el.find("description").text()
              newWaffle.img = newWaffle.description.substring(
                newWaffle.description.indexOf('src="')+5,
                newWaffle.description.indexOf('" class'))
              newWaffle.description = el.find("description").text().replace(/<(?:.|\n)*?>/gm, '').substring(0,330);
              newWaffle.description = htmlDecode(newWaffle.description.substring(0,newWaffle.description.lastIndexOf(" "))+"...");
              newWaffle.content = el.find("encoded").text().replace("<![CDATA[", "").replace("]]>", "")
              newWaffle.date = el.find("pubDate").text()
              newWaffle.niceDate = newWaffle.date.substring(0,newWaffle.date.length-6)
              $scope.waffles.push(newWaffle);
          });
          $scope.serveWaffles($scope.waffles);
        })
        .error(function(data) {
          alert("zzz waffles burnt: "+data);
        });
      }

      $scope.serveWaffles = function(plateOfWaffles){
        localStorage.setItem("posts",JSON.stringify(plateOfWaffles))
        localStorage.setItem("last",Date.now())
      }

      $scope.eatWaffle = function(id){
        $state.go("posts",{postId:id})
      }

      if(localStorage.getItem("last") != null || ((Date.now() - localStorage.getItem("last")) < 60*5) || true){
        $scope.bakeWaffles();
      }
})

.controller('ViewCtrl', function($scope, $routeParams, Posts){
  postId = $routeParams.postId
  console.log(postId)
  console.log(Posts.get(postId))
})
/*
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})*/