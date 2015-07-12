angular.module('waffle.services', [])

.factory('Posts', function() {
  var posts = JSON.parse(localStorage.getItem("posts"));

  return {
    all: function() {
      return posts;
    },
    remove: function(post) {
      posts.splice(posts.indexOf(post), 1);
    },
    get: function(postId) {
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].postId == parseInt(postId)) {
          return posts[i];
        }
      }
      return null;
    }
  };
});
