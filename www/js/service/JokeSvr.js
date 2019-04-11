angular.module('starter.services')
.factory('JokeSvr', function($rootScope, $http, MainSvr) {

	return {

		getSubcats: function() {
			var subcats = 
			[
			{
				id: -1,
				name: '全部'
			},
			{
				id: -2,
				name: '收藏'
			},
			{
				id: 0,
				name: '冷笑话'
			},
			{
				id: 1,
				name: '糗笑话'
			},
			{
				id: 2,
				name: '经典笑话'
			},
			{
				id: 3,
				name: '黄色笑话'
			},			
			{
				id: 4,
				name: '校园笑话'
			},
			{
				id: 5,
				name: '内涵笑话'
			}			
			]

			return subcats;
		
		},

		downloadData: function(start) {
			return MainSvr.downloadData('joke', start);
		},

		getData: function(callback, type) {

			MainSvr.getData(callback, 'joke', type);

		}
	}
})