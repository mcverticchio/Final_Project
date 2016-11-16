var $ = require('jquery');
var Backbone = require('backbone');

var django = require('../djangoUtils');

var User = Backbone.Model.extend({
  urlRoot: 'api/user/create/',
  auth: function(){
    var self = this;
    $.ajaxSetup({
      beforeSend: function(xhr, settings){
        xhr.setRequestHeader("Authorization", 'Token ' + self.get('token'));
        django.setCsrfToken.call(this, xhr, settings);
      }
    });

  }
}, {
  signup: function(username, password, callback){
      var user = new User({username: username, password: password});
      console.log('saved')
      user.save().then(function(data){
        user.set('token', data.token);
        user.auth();

      callback(user);
      localStorage.setItem('user', JSON.stringify(user.toJSON()));
    });
  },
  signin: function(username, password, callback){
      var loginUrl = 'api/obtain_token/';
      $.post(loginUrl, {username: username, password: password}).then(function(result){

        var user = new User({username: username});
        user.set('token', result.token);
        user.auth();

        localStorage.setItem('user', JSON.stringify(user.toJSON()));


        callback(user);
        console.log("YOU HAVE NOW LOGGED IN");
      });
    }
});

module.exports = {
  User: User
};