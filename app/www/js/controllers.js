angular.module('waffle.controllers', [])

.controller('PostsCtrl', function($scope, $state, $http, $ionicLoading){
    $scope.waffles = [];
    if(localStorage.getItem("posts") != null){
      $scope.waffles = JSON.parse(localStorage.getItem("posts"))
    }
    var url = "http://waffle.ketupat.me/feed/"

    function htmlDecode(input){
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    function strip(html){
      var tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }

    $scope.bakeWaffles = function(){
      $scope.waffles = [];
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
              newWaffle.description = el.find("description").text().replace(/<(?:.|\n)*?>/gm, '').substring(0,300);
              newWaffle.description = htmlDecode(newWaffle.description.substring(0,newWaffle.description.lastIndexOf(" "))+"...");
              newWaffle.content = el.find("encoded").text().replace("<![CDATA[", "").replace("]]>", "")
              newWaffle.content = newWaffle.content
                .substring(
                  newWaffle.content.indexOf('/>')+2,
                  newWaffle.content.indexOf("Spread the Waffle")
                )
              newWaffle.date = el.find("pubDate").text()
              newWaffle.niceDate = newWaffle.date.substring(0,newWaffle.date.length-6)
              $scope.waffles.push(newWaffle);
          });
          $scope.serveWaffles($scope.waffles);
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        })
        .error(function(data) {
          $scope.showAlert = function() {
            var ohNo = $ionicPopup.alert({
              title: 'Oh Bother.',
              template: 'Evil badgers have burnt your waffles. You probably should report this to the squirrel and cat.'
            })
          };
        });
      }

      $scope.serveWaffles = function(plateOfWaffles){
        localStorage.setItem("posts",JSON.stringify(plateOfWaffles))
        localStorage.setItem("last",Date.now())
      }

      $scope.eatWaffle = function(id){
        console.log(id);
        window.location.href="#/posts/"+id
        $state.go("posts",{postId:id})
      }

      if(localStorage.getItem("last") != null || ((Date.now() - localStorage.getItem("last")) < 60*5) || true){
        $scope.bakeWaffles();
      }
})

.controller('ViewCtrl', function($scope, $stateParams, $timeout, Posts){
  postId = $stateParams.postId
  $scope.post = Posts.get(postId)
  $timeout(function(){$scope.$broadcast('scroll.resize');},500);
});