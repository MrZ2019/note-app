angular.module('starter.services', [])
.factory('MainSvr', function($rootScope, $http) {
  return {
    downloadData: function(table, start) {
      var url = config.dataUrl + '?type=' + table;
      // alert(url)
      if(start != undefined)
        url += '&start=' + start;
        return $http(
        {
          url: url,
          method: 'get'
        })
    },
    updateApp: function() {
      var url = config.appDataUrl;

        return $http(
        {
          url: url,
          method: 'get'
        })
    },
    getData: function(callback, table, type, page) {
      var start = (page-1)*config.pageSize
      db.transaction(function(tx) {
        var sql = 'select * from ' + table ;
        //console.log(sql)
        if(type == -2) {
            sql = sql + ' where favorite!=0 order by favorite';

            if($rootScope.setting.isAsc)
              sql += ' asc';
            else {
              sql += ' desc';
            }
        }
        else if(type != -1)
          sql =  sql + ' where type=' + type;

        if(type != -2 && !$rootScope.setting.isAsc)
          sql+= ' order by dateposted desc';

        //sql += ' limit ' + start + ',' + config.pageSize
        tx.executeSql(sql, [], function(tx, result) {

          var rows = [];
          for(var i =0;i < result.rows.length; i++) {

            var row = result.rows.item(i);
            row._favorite = row.favorite;
            var tagList = row.tag.split('###')
            row.photo = tagList[2] || ''
            // if (i == 0)
            // alert(row.photo)
            rows.push(row);
          }

          rows.table = table;
          if($rootScope.setting.isShuffle) {
            arrayShuffle(rows, 2);
          }
          callback(rows);
        })
      })

    },
    getTableList: function() {

      var tableList = [
      {
        "tableName": "sentence",
        "displayName": "语录"
      },
      {
        "tableName": "comment",
        "displayName": "评论"
      },
      {
        "tableName": "programming",
        "displayName": "Programming"
      },
      {
        "tableName": "treasure",
        "displayName": "Treasure"
      },
      {
        "tableName": "story",
        "displayName": "故事"
      }
      ];

      return tableList;
    }
  };
})
.factory('ToastSvr', function($ionicLoading) {

  return {
    show: function(msg, duration) {
      duration = duration || 1000;
        $ionicLoading.show({
          template : msg,
          noBackdrop: true,
          duration: duration
        })
    },

    hide:function() {
      $ionicLoading.hide();
    }
  }
})
// .factory('CategorySvr', function() {

//   var categorys =
//   [
//     {
//       id: 0,
//       name: '记录'
//     },
//     {
//       id: 1,
//       name: '感觉'
//     },
//     {
//       id: 2,
//       name: '段子'
//     },
//     {
//       id: 3,
//       name: '灵感'
//     }
//   ]
//   return {
//     getList: function() {

//       return categorys;
//     },

//     getMap: function() {
//       var map = {};

//       categorys.forEach(function(cat) {
//         map[cat.id] = cat.name;
//       });

//       return map;
//     },

//     getCards: function(catid, callback) {

//       db.transaction(function(tx) {

//         var sql = 'select * from void_note where category=? order by id desc';

//         tx.executeSql(sql, [catid], function(tx, result) {
//           var data = [];

//           for(var i = 0; i< result.rows.length;i++) {
//             var item = result.rows.item(i);
//             item._favorite = item.favorite;
//             data.push(item);
//           }

//           callback(data);
//         })
//       })
//     },

//     getCount: function(table, callback) {

//       db.transaction(function(tx) {

//         var sql = 'select count() as max from ' + table;

//         tx.executeSql(sql, [catid], function(tx, result) {
//           var max = result.rows.item(0).max;

//           callback(max);
//         })
//     }
//   }
// })
// .factory('Chats', function() {
//   // Might use a resource here that returns a JSON array

//   // Some fake testing data
//   var chats = [{
//     id: 0,
//     name: 'Ben Sparrow',
//     lastText: 'You on your way?',
//     face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
//   }, {
//     id: 1,
//     name: 'Max Lynx',
//     lastText: 'Hey, it\'s me',
//     face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
//   }, {
//     id: 2,
//     name: 'Andrew Jostlin',
//     lastText: 'Did you get the ice cream?',
//     face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
//   }, {
//     id: 3,
//     name: 'Adam Bradleyson',
//     lastText: 'I should buy a boat',
//     face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
//   }, {
//     id: 4,
//     name: 'Perry Governor',
//     lastText: 'Look at my mukluks!',
//     face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
//   }];

//   return {
//     all: function() {
//       return chats;
//     },
//     remove: function(chat) {
//       chats.splice(chats.indexOf(chat), 1);
//     },
//     get: function(chatId) {
//       for (var i = 0; i < chats.length; i++) {
//         if (chats[i].id === parseInt(chatId)) {
//           return chats[i];
//         }
//       }
//       return null;
//     }
//   };
// });
