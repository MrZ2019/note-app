// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.sentence', {
    url: '/sentence',
    views: {
      'tab-sentence': {
        templateUrl: 'templates/tab-view.html',
        controller: 'SentenceCtrl'
      }
    }
  })
  .state('tab.comment', {
    url: '/comment',
    views: {
      'tab-comment': {
        templateUrl: 'templates/tab-view.html',
        controller: 'CommentCtrl'
      }
    }
  })
  .state('tab.programming', {
    url: '/programming',
    views: {
      'tab-programming': {
        templateUrl: 'templates/tab-view.html',
        controller: 'ProgrammingCtrl'
      }
    }
  })
  .state('tab.treasure', {
    url: '/treasure',
    views: {
      'tab-treasure': {
        templateUrl: 'templates/tab-view.html',
        controller: 'TreasureCtrl'
      }
    }
  })
  .state('tab.story', {
    url: '/story',
    views: {
      'tab-story': {
        templateUrl: 'templates/tab-view.html',
        controller: 'StoryCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.account-statistic', {
    url: '/account/statistic',
    views: {
      'tab-account': {
        templateUrl: 'templates/account/statistic.html',
        controller: 'StatisticCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/sentence');

});

angular.module('starter.controllers', []);
angular.module('starter.services', []);
angular.module('starter.directives', []);