"use strict";

angular
  .module("ngCordova.extras.ActionBar", [])

  /**
   * angular wrapper around ActionBar plugin
   */
  .factory("$cordovaActionBar", [
    "$q",
    "$window",
    function($q, $window) {
      var ActionBar = $window.plugins.actionbar;
      var no = {};
      // promisify ActionBar methods
      Object.keys(ActionBar.__proto__).forEach(function(fn) {
        var value = ActionBar[fn];
        if (!value || typeof value !== "function") {
          no[fn] = value;
          return;
        }

        no[fn] = function() {
          var p = $q.defer();
          var args = [].slice.call(arguments);
          args.push(function(err, result) {
            if (err) return p.reject(err);
            p.resolve(result);
          });
          ActionBar[fn].apply(ActionBar, args);
          return p.promise;
        };
      });

      return no;
    }
  ]);
