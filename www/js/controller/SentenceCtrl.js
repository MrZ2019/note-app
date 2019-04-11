angular.module('starter.controllers')
.controller('SentenceCtrl', function($scope, $rootScope, SentenceSvr) {
	$scope.viewTitle = TABS[0].cnName;
	
	$rootScope.$sentence = $scope;
	$scope.$on('$ionicView.beforeEnter', function() {
		$rootScope.curScope = $scope;	
		$rootScope['$sentence'] = $scope;
	})

	$scope.subcats = subcats = SentenceSvr.getSubcats();
	
	$scope.onChangeSubcat = function(cat) {
		$scope.curSubcat = cat;
	}

	$scope.onChangeSubcat(subcats[0]);
	$scope.cats = {};
	$scope.hasData = {};
	var myRows = {};

	// code for slide
	$scope.slideIndex = {};	
	$scope.myRows2 = {};
	function loadAllData() {
		subcats.forEach(function(cat) {

			var type = cat.id;
			loadSqlData(type, function() {
				shiftRows(type);
			});
		});
	}	
	
	function loadSqlData(type, callback) {
		$scope.hasData[type] = false;
		$scope.cats[type] = {
			noMoreItems: false,
			rows: []
		};		
		$scope.cats[type].rows.table = 'sentence'
		SentenceSvr.getData(function(rows) {

			for(var i = 0; i < rows.length; i++) {
				var strs = rows[i].tag.split('###')
				rows[i].date = strs[1];
				rows[i].tag2 = strs[0];
			}
			myRows[type] = rows;
			$scope.myRows2[type] = [].concat(rows);
			$scope.myRows2[type].table = 'sentence';
			$scope.slideIndex[type] = 0;
			$scope.hasData[type] = true;
			callback();
		}, type)		
	}

	function shiftRows(type) {
		if(myRows[type].length < config.pageSize)
			$scope.cats[type].noMoreItems = true;

		for(var i = 0;i < config.pageSize && myRows[type].length;i++) {
			var row = myRows[type].shift();
			$scope.cats[type].rows.push(row);
		}
	}

	loadAllData();
	
	function refreshData(catId) {
		loadSqlData(catId, function() {
			shiftRows(catId);
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.loadAllData = loadAllData;
	$scope.refreshData = refreshData;
	

	function loadMoreData(type) {
		if($rootScope.isShowSlide) {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			return;
		}
		shiftRows(type);
		console.log('more')
		$scope.$broadcast('scroll.infiniteScrollComplete');
	}

	$scope.loadMoreData = loadMoreData;
})
