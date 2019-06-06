angular.module('starter.services')
.factory('SentenceSvr', function($rootScope, $http, MainSvr) {

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
				id: -3,
				name: '单词'
			},			
			{
				id: 0,
				name: '经典语录'
			},
			{
				id: 1,
				name: '爱情语录'
			},
			{
				id: 1.5,
				name: '英语'
			},
			{
				id: 2,
				name: '名人名言'
			},
			{
				id: 3,
				name: '台词'
			},
			{
				id: 4,
				name: '歌词'
			},
			{
				id: 5,
				name: '段子'
			},
			{
				id: 6,
				name: '搞笑语录'
			},
			{
				id: 7,
				name: '内涵语录'
			},
			{
				id: 8,
				name: '谜语'
			},
			{
				id: 9,
				name: '签名'
			},
			{
				id: 10,
				name: '短信'
			},
			{
				id: 11,
				name: '生活感悟'
			},
			{
				id: 12,
				name: '诗词'
			}
			]

			return TABS[0].list;
		
		},

		downloadData: function(start) {
			return MainSvr.downloadData('sentence', start);
		},

		getData: function(callback, type) {

			MainSvr.getData(callback, 'sentence', type);
		}
	}
})