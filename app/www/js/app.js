angular.module('waffle', ['ionic', 'waffle.controllers', 'waffle.services'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleLightContent();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('posts', {
      url: '/posts',
      templateUrl: "templates/posts.html",
      controller: 'PostsCtrl'
    })
      .state('post-view', {
        url: '/posts/:postId',
        templateUrl: "templates/viewPost.html",
        controller: 'ViewCtrl'
      })

    $urlRouterProvider.otherwise('/posts'); //return to GO

  })