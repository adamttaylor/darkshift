
function initScan(target,call){
	if(window.File && window.FileReader){
		resetCanvas($(target).find('canvas'),800, 600);
		//qrcode.callback = readQR;
        setwebcam(target,call);
	}else{
		return false;
		//browser doesn't support
	}
}
//Size and clear canvas
function resetCanvas(target,w,h){
	target = $('#qr-canvas')
	$(target).css({'width':w,height:h}).width(w).height(h) 
    var con = $(target)[0].getContext("2d");
	con.clearRect(0, 0, w, h);
}
function beginCapture(target,call){
	$(target).find('.cam').addClass('active')
	captureToCanvas(target,call);
}

//Capture 
function captureToCanvas(target,call) {
	var t = false;
	if($(target).find('.cam').hasClass('active')){
	  //var con = $(target).find('canvas')[0].getContext("2d")
	  var con = $('#qr-canvas')[0].getContext("2d")
		try{
            con.drawImage($(target).find('video')[0],0,0);
			try{
				var t = qrcode.decode();
            }
            catch(e){ 
                setTimeout(repeat, 50);
            };
        }catch(e){ 
            setTimeout(repeat, 50);
        };
		
    }
	function repeat(){captureToCanvas(target,call);}

	if(t){
		var o = new Audio("/darkshift/audio/beep.ogg");
		o.play()
		call(t);
		//$(target).find('.cam').removeClass('active')
	}
}
function useScanner(){
	$('.scanbtn').click(function(){
		var scan = $(this).parents('.scanner.screen')
		$(this).attr('disabled','disabled')
		var scanFun = $(scan).attr('data-scan');
		var exec = window[scanFun]
		if(scanFun && typeof exec=='function'){
			initScan($(scan),function(){
				$(scan).find('.scanbtn').removeAttr('disabled')
				$(scan).find('.scanbtn').hide()
				$(scan).find('.stopEndbtn').show()
				alwaysScan(scan,exec)	
			});
		}
	});
	$('.stopEndbtn').click(function(){
		var scan = $(this).parents('.scanner.screen')
		$(scan).find('.cam.active').removeClass('active')
		$(scan).find('.stopEndbtn').hide()
		$(scan).find('.scanbtn').show()
		$(scan).find('.status').removeClass('scan dup success error partial')
		stopWebcam(scan)
		window.clearTimeout(window.scanTimeout);
	});
}
function stopWebcam(target){
	var vid = $(target).find('video')
	$(vid)[0].pause()
	$(vid).attr('src','')
}
function stopScan(){
	$('.scanner.screen').each(function(index, scan) {
    	$(scan).find('.cam.active').removeClass('active')
		$(scan).find('.stopEndbtn').hide()
		$(scan).find('.scanbtn').show()
		$(scan).find('.status').removeClass('scan dup success error partial')
		stopWebcam(scan) 
    });
	window.clearTimeout(window.scanTimeout);
}

function setwebcam(target,ready){
	//$(".result").innerHTML="- scanning -";
	
    var n = navigator;
    cam = $(target).find('video')[0];

    if(n.getUserMedia){
        n.getUserMedia({video: true, audio: false}, success, error);
	}else if(n.mediaDevices.getUserMedia){
        n.mediaDevices.getUserMedia({video: { facingMode: "environment"} , audio: false})
            .then(success)
            .catch(error);
	}else if(n.webkitGetUserMedia){
       n.webkitGetUserMedia({video:true, audio: false}, success, error);
    }else if(n.mozGetUserMedia){
		n.mozGetUserMedia({video: true, audio: false}, success, error);
    }
	
	function success(stream) {
		cam.src = window.URL.createObjectURL(stream);
		
		setTimeout(function(){
			$(target).addClass('recording');
			ready();
		}, 1000);
		
	}
			
	function error(error) {
		return;
	}
}