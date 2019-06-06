angular.module('starter.services')
.factory('NoteSvr', function($rootScope, $http, MainSvr) {

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
				id: 10,
				name: '时间轴'
			},
			{
				id: 11,
				name: '技巧'
			},
			{
				id: 12,
				name: '文艺'
			},
			{
				id: 13,
				name: '人生路标'
			}		
			]

			return subcats;
		
		},

		downloadData: function(start) {
			return MainSvr.downloadData('note', start);
		},

		getData: function(callback, type) {

			MainSvr.getData(callback, 'note', type);

		}
	}
})