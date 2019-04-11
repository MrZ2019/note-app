angular.module('starter.controllers')
.controller('StatisticCtrl',function($scope, $rootScope, StatisticSvr) {

	$rootScope.loadStatistics = function() {
		$scope.items = [];
		StatisticSvr.getStatistics(function(row) {

			$scope.items.push(row);

			$scope.$apply();
		})
		$scope.$broadcast('scroll.refreshComplete');
	}

	$rootScope.loadStatistics();
} );