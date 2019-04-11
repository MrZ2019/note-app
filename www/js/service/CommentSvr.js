angular.module('starter.services')
.factory('CommentSvr', function($rootScope, $http, MainSvr) {

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
				name: '网易云音乐'
			},
			{
				id: 1,
				name: '豆瓣'
			},
			{
				id: 2,
				name: '新闻'
			},
			{
				id: 3,
				name: '其它'
			},
			{
				id: 4,
				name: '时光'
			}			
			]

			return TABS[1].list;
		
		},

		downloadData: function(start) {
			return MainSvr.downloadData('comment', start);
		},

		getData: function(callback, type) {

			MainSvr.getData(callback, 'comment', type);

		}
	}
})