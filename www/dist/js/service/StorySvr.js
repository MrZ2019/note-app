angular.module('starter.services')
.factory('StorySvr', function($rootScope, $http, MainSvr) {

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
				id: -4,
				name: '百科',
			},

			{
				id: -3,
				name: '新闻',
			},
			{
				id: 0,
				name: '短篇'
			},
			{
				id: 1,
				name: '长篇'
			},
			{
				id: 2,
				name: '鬼故事'
			},
			{
				id: 3,
				name: '散文'
			}			
			,
			{
				id: 4,
				name: '剧情'
			}			
			,
			{
				id: 5,
				name: '专辑'
			}			
			,
			{
				id: 6,
				name: '图书'
			}			
			]

			return TABS[4].list;
		
		},

		downloadData: function(start) {
			return MainSvr.downloadData('story', start);
		},

		getData: function(callback, type) {

			MainSvr.getData(callback, 'story', type);

		}
	}
})