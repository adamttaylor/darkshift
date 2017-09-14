<?php
	include_once('lfs-functions.php');
	init();
	
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="UTF-8">
	<meta name="google" content="notranslate">
	<meta http-equiv="Content-Language" content="en">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">
	<title>DARK SHIFT</title>
	<link rel="stylesheet" href="css/ds.css">
	<script>
	var base = '<?php echo BASE;?>';
	</script>
	<script type="text/javascript" src="js/lz-string.min.js"></script>
	<link rel="stylesheet" href="css/jqueryui.css">
	<script type="text/javascript" src="js/qrcodelib.js"></script>
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/jqueryUI.js"></script>
	<script type="text/javascript" src="js/underscore-min.js"></script>
	<script type="text/javascript" src="js/handlebars.min.js"></script>
	<script type="text/javascript" src="js/templates.js"></script>
	<script type="text/javascript" src="js/qr.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
	<script type="text/javascript" src="js/actions.js"></script>
	<script type="text/javascript" src="js/data.js"></script>
	<script type="text/javascript" src="js/maps.js"></script>
	<script type="text/javascript" src="js/vue.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
</head>

<body>
	<span name="checkin"></span>
    <div class="top-bar">
	    <div class="header">
	      <div class="signbtn fa btn">SIGN OUT</div><div class="mlogo"></div>
	    </div>
	    <div class="breadcrumb ui"></div>
    </div>
    <div id="main-wrap">
	<div class="searching-map fa btn waiting">Event in progress<br/>Checking Location
		<div class="stop-location btn white fa next" data-cmd="stopLocation">Not attending Event</div>
	</div>
	<div id="not-a-screen"></div>
    <div id="main-panel">
	    <div class="position-panel">
			<screen v-for="screen in screens" :sc="screen" :ds="ds"></screen>
			<!--<div v-for="screen in screens" v-if="screen.logout || ds.loggedIn" :id="screen.screen" :data-screen="screen.screen">{{screen.screen}}</div>-->
	    </div>
    </div>
    </div>
    <div class="error-panel"></div>
    <div class="can"><canvas id="qr-canvas" width="800" height="600"></canvas></div>
    
	<script>
		
	</script>
	
</body>
</html>