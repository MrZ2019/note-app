var guid = new GUID();
	var setting;

	if(localStorage['setting']) {
		setting = JSON.parse(localStorage['setting'])
		setting.playInterval = setting.playInterval || 5;
	}
	else {
		setting = {
			playInterval: 5
		};
	}
var host = setting.host || '192.168.3.13'


var config =
{
	dataUrl: '/api/api/getdata',
	pageSize: 5,
	appDataUrl:  '/api/api/getappdata'
}
// var config =
// {
// 	dataUrl: 'http://' + host + ':7002/api/getdata',
// 	pageSize: 5,
// 	appDataUrl:  'http://' + host + ':7002/api/getappdata'
// }

var client = localStorage['client'];

if(!client) {
	client = guid.newGUID()
	if(navigator.platform != 'Win32') {
		client = 'mobile_' + client;
	}
	else {
		client = 'pc_' + client;
	}

	localStorage['client'] = client;
}

config.client = client;

var AppDATA = localStorage.getItem('APP_DATA');


if (AppDATA) {
	AppDATA = JSON.parse(AppDATA);
} else {

	AppDATA = {"subcats":[{"name":"sentence","cnName":"语录","list":[{"id":-1,"name":"全部"},{"id":-2,"name":"收藏"},{"id":-3,"name":"单词"},{"id":0,"name":"经典语录"},{"id":1,"name":"爱情语录"},{"id":1.5,"name":"英语"},{"id":2,"name":"名人名言"},{"id":3,"name":"台词"},{"id":4,"name":"歌词"},{"id":5,"name":"段子"},{"id":6,"name":"搞笑语录"},{"id":7,"name":"内涵语录"},{"id":8,"name":"谜语"},{"id":9,"name":"签名"},{"id":10,"name":"短信"},{"id":11,"name":"生活感悟"},{"id":12,"name":"诗词"}]},{"name":"comment","cnName":"言论","list":[{"id":-1,"name":"全部"},{"id":-2,"name":"收藏"},{"id":0,"name":"网易云音乐"},{"id":1,"name":"豆瓣"},{"id":2,"name":"新闻"},{"id":3,"name":"其它"},{"id":4,"name":"时光"}]},{"name":"programming","cnName":"程式","list":[{"id":-1,"name":"全部"},{"id":-2,"name":"收藏"},{"id":0,"name":"HTML/CSS/JS"},{"id":1,"name":"ES6/H5/CSS3"},{"id":2,"name":"Angular/Vue/React"},{"id":3,"name":"NodeJS"},{"id":13,"name":"框架"},{"id":14,"name":"小程序"},{"id":15,"name":"前端圈"},{"id":4,"name":"数据库"},{"id":5,"name":"Java"},{"id":6,"name":"Linux"},{"id":7,"name":"编程周边"}]},{"name":"treasure","cnName":"Treasure","list":[{"id":-1,"name":"全部"},{"id":-2,"name":"收藏"},{"id":10,"name":"时间轴"},{"id":11,"name":"技巧"},{"id":12,"name":"文艺"},{"id":13,"name":"人生路标"}]},{"name":"story","cnName":"故事","list":[{"id":-1,"name":"全部"},{"id":-2,"name":"收藏"},{"id":-4,"name":"百科"},{"id":-3,"name":"新闻"},{"id":0,"name":"短篇"},{"id":1,"name":"长篇"},{"id":2,"name":"鬼故事"},{"id":3,"name":"散文"},{"id":4,"name":"剧情"},{"id":5,"name":"专辑"},{"id":6,"name":"图书"}]}]};
}


var TABS = AppDATA.subcats

var TAB1 = TABS[0].name;
var TAB2 = TABS[1].name;
var TAB3 = TABS[2].name;
var TAB4 = TABS[3].name;
var TAB5 = TABS[4].name;
