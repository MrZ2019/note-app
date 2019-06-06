

const COMMANDS = {
  getList: function() {
  	

    let list = []
     // function onDeviceReady() {
        // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
        // window.resolveLocalFileSystemURI("file:///storage/emulated/0/netease/", onResolveSuccess, fail);
    // }

    function onFileSystemSuccess(fileSystem) {
        alert(fileSystem.name);
    }

    function onResolveSuccess(fileEntry) {
        alert(fileEntry.name);
    }

    function fail(err) {
        alert(JSON.stringify(err));
    }
    window.resolveLocalFileSystemURI("file:///storage/emulated/0/netease/cloudmusic/music", function(entry) {
      var r = entry.createReader()

      r.readEntries(function(result) {
        for (var i = 0; i < result.length; i++) {
          list.push(result[i])
        }
        if (!window.frame1) {
        	window.frame1 = window.frames[0];
        }

        try {

	        frame1.postMessage({
	          data: list,
	          type: 'list'
	        }, '*')
        }catch(e) {
        	alert(e)
        }
      })
    }, function(err) {
      alert(JSON.stringify(err))
    })

  }
}

window.isConnected = true


window.callplus = function(command, params, success) {

  try {
    let str = `var ${command} = ` + COMMANDS[command].toString() + ` ;${command}()`

    var parent = isConnected ? window.parent : window;

    parent.postMessage(str, '*')
  } catch (e) {
    alert(e)
  }
}


//


window.addEventListener('message', function(e) {
  try {
    var set = e.data;
    if (!set) { 
      return;
    }
    if (set.type == 'list') {
    	// $Mp3List.list = set.data.slice(0,100)
    	let list = set.data.sort(function() {
    		return Math.random() - 0.5
    	})

    	// $Mp3List.list = list.slice(0,50) 

      // alert(list[1].name)
    } 
  } catch (e) {
    alert(e)
  }
})

callplus('getList')
