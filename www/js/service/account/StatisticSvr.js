angular.module('starter.services')
.factory('StatisticSvr', function(MainSvr) {

	var tableList = MainSvr.getTableList();

	return {
		getStatistics: function(callback) {

		  tableList.forEach(function(obj) {
		      db.transaction(function(tx) {
		      	var data = {};
		      	data.displayName = obj.displayName;
		        var sql = 'select count() as max from ' + obj.tableName;

		        tx.executeSql(sql, [], function(tx, result) {
		          var max = result.rows.item(0).max;
		          data.max = max;
		          callback(data);
		        })      
		      });
		  })
		}
	};
});