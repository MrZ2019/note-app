angular.module('starter.services')
.factory('ProgrammingSvr', function($rootScope, $http, MainSvr) {

	return {

		getSubcats: function() {
// 			var subcats = 
// 			[
// 			{
// 				id: -1,
// 				name: '全部'
// 			},
// 			{
// 				id: -2,
// 				name: '收藏'
// 			},
// 			{
// 				id: 0,
// 				name: 'HTML/CSS/JS'
// 			},
// 			{
// 				id: 1,
// 				name: 'ES6/H5/CSS3'
// 			},
// 			{
// 				id: 2,
// 				name: 'Angular/Vue/React'
// 			},
// 			{
// 				id: 3,
// 				name: 'NodeJS'
// 			},			
// 			{
// 				id: 13,
// 				name: '框架'
// 			},			
// 			{
// 				id: 14,
// 				name: '小程序'
// 			},			
// 			{
// 				id: 15,
// 				name: '前端圈'
// 			},			
// 			{
// 				id: 4,
// 				name: '数据库'
// 			},
// 			{
// 				id: 5,
// 				name: 'Java'
// 			},
// 			{
// 				id: 6,
// 				name: 'Linux'
// 			}			
// ,
// 			{
// 				id: 7,
// 				name: '编程周边'
// 			}			
// 			]

			return TABS[2].list;
		
		},

		downloadData: function(start) {
			return MainSvr.downloadData('programming', start);
		},

		getData: function(callback, type) {

			MainSvr.getData(callback, 'programming', type);

		}
	}
})