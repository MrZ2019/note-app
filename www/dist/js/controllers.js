var db = openDatabase('mynote', '1', 'database', 4096 * 1024);

angular.module('starter.controllers', [])
    .controller('MainCtrl', function($scope, $rootScope, $http,
        $ionicModal, $ionicPopover, $ionicPopup, $ionicLoading, $ionicBackdrop, MainSvr, ToastSvr, SentenceSvr, CommentSvr, JokeSvr, NoteSvr, StorySvr, ProgrammingSvr, TreasureSvr) {


        $rootScope.cameraGetPicture = cameraGetPicture

        var pswpElement = document.querySelectorAll('.pswp')[0];

        window.openPhoto = $rootScope.openPhoto = openPhoto

        // openPhoto()
        function openPhoto(index) {
        	// src = "http://img5.imgtn.bdimg.com/it/u=2116594507,2945568386&fm=26&gp=0.jpg"
            // build items array
            // var items = [{
            //     src: src,
            //     w: 600,
            //     h: 400
            // }];
            // alert(window.photoList.length)
            let items = []
            let list = $rootScope.curScope.photoList[$rootScope.curScope.curSubcat.id]
            for(var i = 0; i < list.length; i++) {
            	items.push({
            		src: list[i],
            		w: 600,
            		h: 400
            	})
            }

            // define options (if needed)
            var options = {
                // optionName: 'option value'
                // for example:
                index: index// start at first slide
            };

            // Initializes and opens PhotoSwipe
            window.gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

            gallery.init();

        }


        function convertBase64UrlToBlob(urlData) {

            try {

                var arr = urlData.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
            } catch (e) {
                alert(e)
            }
            return new Blob([u8arr], { type: mime });
        }

        function Uint8ArrayToString(fileData) {
            var dataString = "";
            for (var i = 0; i < fileData.length; i++) {
                dataString += String.fromCharCode(fileData[i]);
            }

            return dataString

        }

        function onSuccess123(imageURL) {
            // alert('1')


        }

        function cameraGetPicture(row) {
            // alert('get')
            $rootScope.lastEditPhotoRow = row
            navigator.camera.getPicture(function(imageURL) {
                try {
                    var row = $rootScope.lastEditPhotoRow

                    var log = document.getElementById('log');

                    var image = document.getElementById('myImage');

                    let src = "data:image/png;base64," + imageURL;

                    let md5Name = md5(imageURL)

                    window.resolveLocalFileSystemURI(
                        "file:///storage/emulated/0/",
                        function(entry) {
                            entry.getDirectory("_noteImages", { create: true }, function(dir) {

                                dir.getFile(md5Name + ".jpg", { create: true }, function(entry) {

                                    try {

                                        entry.createWriter(function(w) {
                                            let d = convertBase64UrlToBlob(src)

                                            w.write(d)

                                            w.onerror = function() {}

                                            w.onwrite = onOK
                                        })

                                    } catch (e) {
                                        alert(e)
                                    }
                                }, onFail)
                            }, onFail)
                        }
                    )


                    table = location.hash.replace('#/tab/', '')

                    var tagList = row.tag.split('###');

                    var newTag = tagList[0] + '###' + tagList[1] + '###' + md5Name

                    db.transaction(function(tx) {

                        tx.executeSql('update ' + table + ' set tag=? where id=?',
                            [newTag, row.id],
                            function(result, tx) {
                                ToastSvr.show('编辑图片成功')

                                $rootScope.curScope.refreshData($rootScope.curScope.curSubcat.id)
                            },
                            function(result, err) {})
                    })
                } catch (e) {
                    alert(e)
                }
            }, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
            });




        }


        function onFail(message) {
            alert(JSON.stringify(message));
        }

        function onOK(message) {}
        var table;
        $ionicModal.fromTemplateUrl('templates/add-text.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $rootScope.addform = {}

        $rootScope.addItem = function(row) {

            if (row && row.id !== undefined) {
                $rootScope.addform = row;
                $rootScope.addform.tag2 = row.tag.split('###')[0] || ''
            } else {
                $rootScope.addform = {}
            }

            table = location.hash.replace('#/tab/', '')

            if (table == 'account') {
                return;
            }

            $scope.modal.show()
        }
        $rootScope.hideModal = function() {
            $scope.modal.hide()
        }
        $rootScope.doAdd = function() {

            if ($rootScope.addform.id == undefined) {

                db.transaction(function(tx) {
                    var sql = 'select min(id) as minId from ' + table;

                    tx.executeSql(sql, [],
                        function(tx, result) {

                            var minId = result.rows[0].minId;


                            sql = 'insert into ' + table + '(id, content, type , dateposted, tag) values(?,?,?,?, ?)';

                            let dateStr = getDate();

                            tx.executeSql(sql, [minId - 1, $rootScope.addform.content, $rootScope.addform.type, new Date() - 0, ($rootScope.addform.tag2 || '') + '###' + dateStr], function(tx, result) {
                                ToastSvr.show('添加成功')
                                $scope.modal.hide();

                                $rootScope.curScope.refreshData($rootScope.curScope.curSubcat.id)

                            }, function(tx, err) {
                                ToastSvr.show('添加失败')
                            });

                        },
                        function(tx, err) {
                            ToastSvr.show('添加失败')
                        })
                })
            } else {
                db.transaction(function(tx) {
                	let tagList = $rootScopeaddform.tag.split('###')
                    tx.executeSql('update ' + table + ' set content=?, tag=?, type=? where id=?',
                        [$rootScope.addform.content, $rootScope.addform.tag2 + '###' + $rootScope.tagList[1] + '###' + tagList[2], $rootScope.addform.type, $rootScope.addform.id],
                        function(result, tx) {
                            ToastSvr.show('编辑成功')
                            $scope.modal.hide();

                            $rootScope.curScope.refreshData($rootScope.curScope.curSubcat.id)
                        },
                        function(result, err) {
                            ToastSvr.show('编辑失败')
                        })
                })
            }


        }
        $rootScope.AppDATA = AppDATA;

        $rootScope.tabs = AppDATA.subcats;
        if (navigator.userAgent.match(/android/i)) {
            $scope.isAndroid = true;
        }


        setting.updateDate = '2015-10-29'

        $rootScope.setting = setting;

        var elementHtml = angular.element(document.querySelectorAll('html'));

        $rootScope.theme = localStorage.getItem('theme') || 'green';

        setting.host = host;
        elementHtml.attr('theme', $scope.theme);

        $rootScope.changeTheme = function(themeName) {

            elementHtml.attr('theme', themeName);

            localStorage.setItem('theme', themeName);
        }
        $rootScope.refresh = function() {

            $rootScope.$sentence && $rootScope.$sentence.loadAllData();
            $rootScope.$comment && $rootScope.$comment.loadAllData();
            $rootScope.$joke && $rootScope.$joke.loadAllData();
            $rootScope.$programming && $rootScope.$programming.loadAllData();
            $rootScope.$treasure && $rootScope.$treasure.loadAllData();
            $rootScope.$note && $rootScope.$note.loadAllData();
            $rootScope.$story && $rootScope.$story.loadAllData();

        }
        $rootScope.saveSetting = function() {
            // debugger
            localStorage['setting'] = JSON.stringify(setting);

            window.config.dataUrl = 'http://' + setting.host + config.baseDataUrl
            window.config.appDataUrl = 'http://' + setting.host + config.baseAppDataUrl
        }


        $rootScope.test = function($event) {
            alert('test');
        }

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope
        }).then(function(popover) {
            $rootScope.popover = popover;
        })

        // 幻灯片
        $rootScope.isShowSlide = false;

        $rootScope.showSlide = function($event) {
            if ($event.gesture.direction == 'left') {

                $rootScope.isShowSlide = true;
            }
        }

        $rootScope.backList = function() {
            $rootScope.isShowSlide = false;
        }

        $rootScope.isPlay = false;
        var playHandle = null;

        $rootScope.togglePlay = function() {
            $rootScope.isPlay = !$rootScope.isPlay;

            if ($rootScope.isPlay) {
                playHandle = setInterval(playCallback, setting.playInterval * 1000);
            } else {
                clearInterval(playHandle);
                playHandle = null;
            }
        }

        function playCallback() {
            $rootScope.curScope.changeItem(null, 'left');
            $rootScope.curScope.$apply();
        }

        $rootScope.changeItem = function($event, direction) {
            if (!$rootScope.isShowSlide)
                return;
            var $scope = $rootScope.curScope;

            var direction = direction || $event.gesture.direction;
            var type = $scope.curSubcat.id;
            var index = $scope.slideIndex[type];
            if (direction == 'right') {
                index--;

                if (index < 0) {
                    index = $scope.myRows2[type].length - 1;
                }
            } else if (direction == 'left') {
                index++;

                if (index > ($scope.myRows2[type].length - 1)) {
                    index = 0;
                }
            }

            $scope.slideIndex[type] = index;
        }
        $rootScope.showPopover = function($event, row, data, table) {
            $rootScope.row = row;
            $rootScope.data = data;
            $rootScope.table = table;
            //$ionicBackdrop.retain()
            $rootScope.popover.show($event);
        }

        function updateStatus(scope, status, row, type) {

            var rowId = row.id;
            var rows = scope.cats['-1'].rows;
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];

                if (row.id == rowId) {
                    if (status == 'delete')
                        rows.splice(i, 1);
                    break;
                }
            }

            // for slide
            var rows2 = scope.myRows2[-1];
            for (var i = 0; i < rows2.length; i++) {
                var row = rows2[i];

                if (row.id == rowId) {
                    if (status == 'favorite')
                        row._favorite = 1;
                    else if (status == 'unfavorite')
                        row._favorite = 0;
                    else if (status == 'delete')
                        rows2.splice(i, 1);
                    break;
                }
            }

            rows2 = scope.myRows2['-2'];
            if (status == 'favorite')
                rows2.unshift(row)
            else {
                for (var i = 0; i < rows.length; i++) {
                    var row = rows2[i];

                    if (row && (row.id == rowId)) {
                        rows2.splice(i, 1);
                        break;
                    }
                }
            }
            if (type != null) {
                rows = scope.cats[type].rows;
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];

                    if (row.id == rowId) {
                        if (status == 'favorite')
                            row._favorite = 1;
                        else if (status == 'unfavorite')
                            row._favorite = 0;
                        else if (status == 'delete')
                            rows.splice(i, 1);
                        break;
                    }
                }

                rows2 = scope.myRows2[type];
                for (var i = 0; i < rows2.length; i++) {
                    var row = rows2[i];

                    if (row && (row.id == rowId)) {
                        if (status == 'delete')
                            rows2.splice(i, 1);
                        break;
                    }
                }
            }

            rows = scope.cats['-2'].rows;
            if (status == 'favorite')
                rows.unshift(row)
            else {
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];

                    if (row && (row.id == rowId)) {
                        rows.splice(i, 1);
                        break;
                    }
                }
            }

            scope.$apply();
        }

        $rootScope.toggleFavorite = function(row, data) {
            $rootScope.row = row;
            $rootScope.table = data.table;
            if (row._favorite) {
                $rootScope.unfavorite();
            } else {
                $rootScope.favorite();
            }
        }
        $rootScope.favorite = function() {

            var row = $rootScope.row;
            var table = $rootScope.table;
            db.transaction(function(tx) {

                tx.executeSql('update ' + table + ' set favorite=? where id=?',
                    [new Date().getTime(), row.id],
                    function(result, tx) {
                        ToastSvr.show('收藏成功')
                        var scope = $rootScope['$' + table];
                        updateStatus(scope, 'favorite', row, row.type);
                    },
                    function(result, err) {
                        ToastSvr.show('收藏失败')
                    })
            })

            $rootScope.popover.hide();
        }

        $rootScope.unfavorite = function() {

            var row = $rootScope.row;
            var table = $rootScope.table;

            db.transaction(function(tx) {

                tx.executeSql('update ' + table + ' set favorite=0 where id=?',
                    [row.id],
                    function(result, tx) {

                        ToastSvr.show('取消收藏成功')
                        var scope = $rootScope['$' + table];
                        updateStatus(scope, 'unfavorite', row, row.type);
                    },
                    function(result, err) {
                        ToastSvr.show('取消收藏失败')
                    })
            })

            $rootScope.popover.hide();
        }

        $rootScope.removeFromPop = function() {
            if (setting.deleteConfirm) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '确定要删除吗',
                    okText: '确定',
                    okType: 'button-orange',
                    cancelText: '取消'
                });

                confirmPopup.then(function(res) {

                    if (res)
                        removeEntry($rootScope.row, $rootScope.data, $rootScope.table);

                })
            } else {
                removeEntry($rootScope.row, $rootScope.data, $rootScope.table);

            }

            $rootScope.popover.hide();
        }

        $rootScope.remove = function($event, row, data, flag) {
            if (false) {

                if (setting.deleteConfirm) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: '确定要删除吗',
                        okText: '确定',
                        okType: 'button-orange',
                        cancelText: '取消'
                    });

                    confirmPopup.then(function(res) {

                        if (res)
                            removeEntry(row, data, data.table);

                    })
                } else {
                    removeEntry(row, data, data.table);
                }
            } else if ($event.gesture.direction == 'left') {
                $rootScope.cameraGetPicture(row)
            } else if ($event.gesture.direction == 'right') {
                table = location.hash.replace('#/tab/', '')

                var tagList = row.tag.split('###');

                var newTag = tagList[0] + '###' + tagList[1] + '###'

                db.transaction(function(tx) {

                    tx.executeSql('update ' + table + ' set tag=? where id=?',
                        [newTag, row.id],
                        function(result, tx) {
                            ToastSvr.show('删除图片成功')

                            $rootScope.curScope.refreshData($rootScope.curScope.curSubcat.id)
                        },
                        function(result, err) {})
                })
            }
        }

        function removeEntry(row, data, table) {
            var rowId = row.id;
            var scope = $rootScope['$' + table];

            db.transaction(function(tx) {

                var sql = 'delete from ' + table + ' where id=?';

                tx.executeSql(sql, [rowId], function(tx, result) {
                    updateStatus(scope, 'delete', row, row.type);
                });
            })
        }

        $rootScope.copy = function(text) {

            var text = text || $rootScope.row.content;

            PhoneGap.exec(function(msg) {
                ToastSvr.show('复制成功');
            }, function(err) {
                ToastSvr.show('复制失败');
            }, "MyPlugin", "", [text]);

            $rootScope.popover.hide();
        }
        $rootScope.getFile = function(uri) {
            // alert(uri)
            PhoneGap.exec(function(msg) {
                ToastSvr.show(msg);
            }, function(err) {
                //ToastSvr.show('失败' + err);
                // alert(err)
                // $rootScope.log = err
                // $rootScope.$apply()

            }, "MyPlugin", "getFile", [uri]);

            // $rootScope.popover.hide();
        }



        $rootScope.initDb = initDb;

        function initDb() {
            $ionicLoading.show({
                template: "<ion-spinner icon='lines' class='spinner-positive'></ion-spinner><div>正在更新</div>",
            });
            $rootScope.updateCounter = {
                status: 'update',
                counter: 0,
                flag: 'initial'
            };
            $rootScope.initSentence();
            $rootScope.initComment()
            $rootScope.initTreasure()
            $rootScope.initProgramming()
            $rootScope.initStory()

            clearTimeout($rootScope.handle);
            $rootScope.handle = setTimeout(function() {
                //if($rootScope.updateCounter.result != 'success')
                ToastSvr.show('网络超时');

                //$rootScope.updateCounter.result = '';
            }, 5000);
        }

        $rootScope.updateCounter = {};

        // $rootScope.initDbImages = function() {
        //     tx.executeSql(sql, [], function(tx, result) {
        //         sql = 'create table if not exists images (id integer primary key, content text, type int, dateposted datetime, favorite int, item varchar(64), tag varchar(32))';

        //         tx.executeSql(sql, [], function(tx, result) {})
        //     });
        // }

        $rootScope.initSentence = function(start) {


            SentenceSvr.downloadData(start).then(function(res) {


                var data = res.data.data
                db.transaction(function(tx) {

                    var sql = 'drop table if exists sentence';
                    if (start != undefined)
                        sql = 'select 1';
                    tx.executeSql(sql, [], function(tx, result) {
                        sql = 'create table if not exists sentence (id integer primary key, content text, type int, dateposted datetime, favorite int, item varchar(64), tag varchar(32))';

                        tx.executeSql(sql, [], function(tx, result) {

                            sql = 'insert into sentence(id, content, type , dateposted, item, tag) values(?,?,?,?, ?, ?)';

                            data.forEach(function(row) {
                                tx.executeSql(sql, [row.id, row.content, row.type, row.dateposted, row.item, row.tag]);
                            });

                            if ($rootScope.updateCounter.status == 'update') {
                                $rootScope.updateCounter.counter++;
                                $rootScope.updateCounter.sentence = data.length;
                                $rootScope.checkUpdate();
                            }

                        }, function(tx, err) {

                        });

                    }, function(tx, err) {

                    });
                })

            }, function(a1, a2) {
                //alert(JSON.stringify(a1) + JSON.stringify(a2));
            })
        }

        $rootScope.initComment = function(start) {

            CommentSvr.downloadData(start).then(function(res) {

                var data = res.data.data
                db.transaction(function(tx) {

                    var sql = 'drop table if exists comment';
                    if (start != undefined)
                        sql = 'select 1';
                    tx.executeSql(sql, [], function(tx, result) {
                        sql = 'create table if not exists comment (id integer primary key, content text, type int, dateposted datetime, favorite int, item varchar(64), tag varchar(32))';

                        tx.executeSql(sql, [], function(tx, result) {

                            sql = 'insert into comment(id, content, type , dateposted, item, tag) values(?,?,?, ?, ?,?)';

                            data.forEach(function(row) {
                                tx.executeSql(sql, [row.id, row.content, row.type, row.dateposted, row.item, row.tag]);
                            });
                            if ($rootScope.updateCounter.status == 'update') {
                                $rootScope.updateCounter.counter++;
                                $rootScope.updateCounter.comment = data.length;
                                $rootScope.checkUpdate();
                            }
                        }, function(tx, err) {

                        });

                    }, function(tx, err) {

                    });
                })

            })
        }

        $rootScope.initJoke = function(start) {

            JokeSvr.downloadData(start).then(function(res) {

                var data = res.data.data
                db.transaction(function(tx) {

                    var sql = 'drop table if exists joke';
                    if (start != undefined)
                        sql = 'select 1';
                    tx.executeSql(sql, [], function(tx, result) {
                        sql = 'create table if not exists joke (id integer primary key, content text, type int, dateposted datetime, favorite int, tag varchar(32))';

                        tx.executeSql(sql, [], function(tx, result) {

                            sql = 'insert into joke(id, content, type , dateposted,  tag) values(?,?,?,?,  ?)';

                            data.forEach(function(row) {
                                tx.executeSql(sql, [row.id, row.content, row.type, row.dateposted, row.tag]);
                            });
                            if ($rootScope.updateCounter.status == 'update') {
                                $rootScope.updateCounter.counter++;
                                $rootScope.updateCounter.joke = data.length;
                                $rootScope.checkUpdate();
                            }
                        }, function(tx, err) {

                        });

                    }, function(tx, err) {

                    });
                })

            })
        }

        $rootScope.initProgramming = function(start) {

            ProgrammingSvr.downloadData(start).then(function(res) {

                var data = res.data.data
                db.transaction(function(tx) {

                    var sql = 'drop table if exists programming';
                    if (start != undefined)
                        sql = 'select 1';
                    tx.executeSql(sql, [], function(tx, result) {
                        sql = 'create table if not exists programming (id integer primary key, content text, type int, dateposted datetime, favorite int, tag varchar(32))';

                        tx.executeSql(sql, [], function(tx, result) {

                            sql = 'insert into programming(id, content, type , dateposted,  tag) values(?,?,?,?,  ?)';

                            data.forEach(function(row) {
                                tx.executeSql(sql, [row.id, row.content, row.type, row.dateposted, row.tag]);
                            });
                            if ($rootScope.updateCounter.status == 'update') {
                                $rootScope.updateCounter.counter++;
                                $rootScope.updateCounter.programming = data.length;
                                $rootScope.checkUpdate();
                            }
                        }, function(tx, err) {

                        });

                    }, function(tx, err) {

                    });
                })

            })
        }
        $rootScope.initTreasure = function(start) {

            TreasureSvr.downloadData(start).then(function(res) {

                var data = res.data.data
                db.transaction(function(tx) {

                    var sql = 'drop table if exists treasure';
                    if (start != undefined)
                        sql = 'select 1';
                    tx.executeSql(sql, [], function(tx, result) {
                        sql = 'create table if not exists treasure (id integer primary key, content text, type int, dateposted datetime, favorite int, tag varchar(32))';

                        tx.executeSql(sql, [], function(tx, result) {

                            sql = 'insert into treasure(id, content, type , dateposted,  tag) values(?,?,?,?,  ?)';

                            data.forEach(function(row) {
                                tx.executeSql(sql, [row.id, row.content, row.type, row.dateposted, row.tag]);
                            });
                            if ($rootScope.updateCounter.status == 'update') {
                                $rootScope.updateCounter.counter++;
                                $rootScope.updateCounter.treasure = data.length;
                                $rootScope.checkUpdate();
                            }
                        }, function(tx, err) {

                        });

                    }, function(tx, err) {

                    });
                })

            })
        }
        $rootScope.initNote = function(start) {

            NoteSvr.downloadData(start).then(function(res) {

                var data = res.data.data
                db.transaction(function(tx) {

                    var sql = 'drop table if exists note';
                    if (start != undefined)
                        sql = 'select 1';
                    tx.executeSql(sql, [], function(tx, result) {
                        sql = 'create table if not exists note (id integer primary key, content text, type int, dateposted datetime, favorite int, tag varchar(32))';

                        tx.executeSql(sql, [], function(tx, result) {

                            sql = 'insert into note(id, content, type , dateposted,  tag) values(?,?,?, ?, ?)';

                            data.forEach(function(row) {
                                tx.executeSql(sql, [row.id, row.content, row.type, row.dateposted, row.tag]);
                            });
                            if ($rootScope.updateCounter.status == 'update') {
                                $rootScope.updateCounter.counter++;
                                $rootScope.updateCounter.note = data.length;
                                $rootScope.checkUpdate();
                            }
                        }, function(tx, err) {

                        });

                    }, function(tx, err) {

                    });
                })

            })
        }
        $rootScope.initStory = function(start) {

            StorySvr.downloadData(start).then(function(res) {

                var data = res.data.data
                db.transaction(function(tx) {

                    var sql = 'drop table if exists story';

                    if (start != undefined)
                        sql = 'select 1';

                    tx.executeSql(sql, [], function(tx, result) {
                        sql = 'create table if not exists story (id integer primary key, content text, type int, dateposted datetime, favorite int, item varchar(32), tag varchar(32))';

                        tx.executeSql(sql, [], function(tx, result) {

                            sql = 'insert into story(id, content, type , dateposted, item,  tag) values(?,?,?,?, ?, ?)';

                            data.forEach(function(row) {
                                tx.executeSql(sql, [row.id, row.content, row.type, row.dateposted, row.item, row.tag]);
                            });
                            if ($rootScope.updateCounter.status == 'update') {
                                $rootScope.updateCounter.counter++;
                                $rootScope.updateCounter.story = data.length;
                                $rootScope.checkUpdate();
                            }
                        }, function(tx, err) {

                        });

                    }, function(tx, err) {

                    });
                })

            })
        }

        // update

        $rootScope.updateSentence = function() {

            db.transaction(function(tx) {

                tx.executeSql('select max(id) as start from sentence', [], function(tx, result) {
                    var start = result.rows.item(0).start;

                    $rootScope.initSentence(start);
                })
            })

        }

        $rootScope.updateComment = function() {

            db.transaction(function(tx) {

                tx.executeSql('select max(id) as start from comment', [], function(tx, result) {
                    var start = result.rows.item(0).start;

                    $rootScope.initComment(start);
                })
            })

        }

        $rootScope.updateJoke = function() {

            db.transaction(function(tx) {

                tx.executeSql('select max(id) as start from joke', [], function(tx, result) {
                    var start = result.rows.item(0).start;

                    $rootScope.initJoke(start);
                })
            })

        }

        $rootScope.updateProgramming = function() {

            db.transaction(function(tx) {

                tx.executeSql('select max(id) as start from programming', [], function(tx, result) {
                    var start = result.rows.item(0).start;

                    $rootScope.initProgramming(start);
                })
            })

        }
        $rootScope.updateTreasure = function() {

            db.transaction(function(tx) {

                tx.executeSql('select max(id) as start from treasure', [], function(tx, result) {
                    var start = result.rows.item(0).start;

                    $rootScope.initTreasure(start);
                })
            })

        }

        $rootScope.updateNote = function() {

            db.transaction(function(tx) {

                tx.executeSql('select max(id) as start from note', [], function(tx, result) {
                    var start = result.rows.item(0).start;

                    $rootScope.initNote(start);
                })
            })

        }

        $rootScope.updateStory = function() {

            db.transaction(function(tx) {

                tx.executeSql('select max(id) as start from story', [], function(tx, result) {
                    var start = result.rows.item(0).start;

                    $rootScope.initStory(start);
                })
            })

        }
        $rootScope.updateApp = function(cb) {

            MainSvr.updateApp().then(function(res) {

                var data = res.data.data;

                localStorage.setItem('APP_DATA', JSON.stringify(data));
                var title = '更新信息'

                $rootScope.AppDATA = data;
                $rootScope.tabs = data.subcats;
                window.TABS = data.subcats;
                // var popup = $ionicPopup.alert({
                // 	title: title,
                // 	scope: $rootScope,
                // 	template: '<pre>App 更新成功',
                // 	okText:'确定',
                // 	okType: 'button-orange'
                // })
            })
        }

        $rootScope.checkUpdate = function() {
            if ($rootScope.updateCounter.counter == 5) {
                var title;
                ToastSvr.hide()
                if ($rootScope.updateCounter.flag == 'initial') {
                    //code
                    title = '初始化'
                    localStorage.setItem('isInit', true);
                } else {
                    title = '更新信息'
                }
                // var popup = $ionicPopup.alert({
                // 	title: title,
                // 	scope: $rootScope,
                // 	template: '<pre>语录：{{updateCounter.sentence}}条\n'
                // 	+'评论：{{updateCounter.comment}}条\n'
                // 	+'笑话：{{updateCounter.joke}}条\n'
                // 	+'说说：{{updateCounter.note}}条\n'
                // 	+'故事：{{updateCounter.story}}条\n',
                // 	okText:'确定',
                // 	okType: 'button-orange'
                // })
                var popup = $ionicPopup.alert({
                    title: title,
                    scope: $rootScope,
                    template: '<pre>语录：{{updateCounter.sentence}}条\n' +
                        '评论：{{updateCounter.comment}}条\n' +
                        'Treasure：{{updateCounter.treasure}}条\n' +
                        'Programming：{{updateCounter.programming}}条\n' +
                        '故事：{{updateCounter.story}}条\n',
                    okText: '确定',
                    okType: 'button-orange'
                })

                $rootScope.updateCounter.status = '';
                //$rootScope.updateCounter.result = 'success';
                clearTimeout($rootScope.handle);
                $rootScope.setting.lastUpdate = new Date();
                $rootScope.saveSetting();

                $rootScope.$comment && $rootScope.$comment.loadAllData();
                $rootScope.$sentence && $rootScope.$sentence.loadAllData();
                $rootScope.$programming && $rootScope.$programming.loadAllData();
                $rootScope.$treasure && $rootScope.$treasure.loadAllData();
                // $rootScope.$note && $rootScope.$note.loadAllData();
                $rootScope.$story && $rootScope.$story.loadAllData();
            }
        }

        var isInit = localStorage.getItem('isInit');

        if (!isInit) {
            initDb();
        } else {}


    })

    .controller('AccountCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, ToastSvr) {

        $scope.$on('$ionicView.beforeEnter', function() {
            if ($rootScope.isPlay) {
                $rootScope.togglePlay();
            }
        })

        $rootScope.$account = $scope;

        $scope.restore = function() {

            if (confirm('确定要初始化数据吗')) {
                $rootScope.initDb();
            }
        }


        //var handle;

        $scope.reload = function() {

            location.reload()
        }
        $scope.updateData = function() {

            $rootScope.updateApp()
            $ionicLoading.show({
                template: "<ion-spinner icon='lines' class='spinner-positive'></ion-spinner><div>正在更新</div>",
            });
            $rootScope.updateCounter = {
                status: 'update',
                counter: 0
            };
            $rootScope.updateSentence();
            $rootScope.updateComment();
            $rootScope.updateProgramming();
            $rootScope.updateTreasure();
            $rootScope.updateStory();
            clearTimeout($rootScope.handle);
            $rootScope.handle = setTimeout(function() {
                //if($rootScope.updateCounter.result != 'success')
                ToastSvr.show('网络超时');

                //$rootScope.updateCounter.result = '';
            }, 5000);
        }



        $scope.onShuffleChange = function() {

            if ($rootScope.setting.isShuffle == true &&
                $rootScope.setting.isAsc == true)
                $rootScope.setting.isAsc = false;
        }

        $scope.onAscChange = function() {

            if ($rootScope.setting.isAsc == true &&
                $rootScope.setting.isShuffle == true)
                $rootScope.setting.isShuffle = false;
        }

        $scope.onIntervalChange = function() {

            $rootScope.saveSetting();

            // if($rootScope.isPlay) {
            // 	togglePlay();
            // 	togglePlay();
            // }
        }

    })
// .filter('date', function() {

// 	return function(date) {

// 		if(date == '无')
// 			return '无'
// 		if(date == null)
// 			return '';

// 		var d = new Date(date);

// 		return (d.getFullYear()) + '-' + (d.getMonth()+1) + '-' + d.getDate()
// 	}
// })