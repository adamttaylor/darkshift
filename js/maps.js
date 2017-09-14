var map_options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
var mapabort = false;
/*function distance(lon1, lat1, lon2, lat2, unit = 'miles') {
  var R = unit=='miles'? 
  3959 : //// Radius of the earth in miles
  6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in units of earth radius * 100 for some reason
  return d/100;
}
/** Converts numeric degrees to radians *
	if (typeof(Number.prototype.toRad) === "undefined") {
	  Number.prototype.toRad = function() {
	    return this * Math.PI / 180;
	  }
	}*/
var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator
function findDistance(t1,n1,t2,n2) {
		var lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, mi, km;
		
		// convert coordinates to radians
		lat1 = deg2rad(t1);
		lon1 = deg2rad(n1);
		lat2 = deg2rad(t2);
		lon2 = deg2rad(n2);
		
		// find the differences between the coordinates
		dlat = lat2 - lat1;
		dlon = lon2 - lon1;
		
		// here's the heavy lifting
		a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
		c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
		dm = c * Rm; // great circle distance in miles
		dk = c * Rk; // great circle distance in km
		
		// round the results down to the nearest 1/1000
		mi = round(dm);
		km = round(dk);
		
		// display the result
		//frm.mi.value = mi;
		//frm.km.value = km;
		return mi;
	}
	
	
	// convert degrees to radians
	function deg2rad(deg) {
		rad = deg * Math.PI/180; // radians = degrees * pi/180
		return rad;
	}
	
	
	// round to the nearest 1/1000
	function round(x) {
		return Math.round( x * 1000) / 1000;
	}

function compareLocationToSite(callback){
	//add loading indicator at bottom of page to indicate looking for 
	var cookie = getCookie('ds_onsite')
	if(cookie && cookie=='true'){
		if(callback) callback(1)
		return true;
	}else if(cookie && cookie=='false'){
		if(callback) callback(3)
		return true;
	}
	
	navigator.geolocation.getCurrentPosition(function(pos){
		//success
		var crd = pos.coords;
		//35.110979, -85.175275 ==> booker T washingto state park
		//35.041539 -85.1583064
		console.log('Your current position is:');
		console.log('Latitude : ' + crd.latitude);
		console.log('Longitude: ' + crd.longitude);
		console.log(pos); 
		//var d = distance(pos.coords.longitude, pos.coords.latitude, 35.041539, -85.1583064)
		var d = findDistance(pos.coords.latitude,pos.coords.longitude, 35.041539, -85.1583064) 
		console.log('MILES: '+d );
		//var d_km = distance(pos.coords.longitude, pos.coords.latitude, 35.110979, -85.175275,'km')
		if(mapabort) return false;
		if(callback && d < 30){
			callback(1)
			setCookie('ds_onsite','true',5);
		}else{
			callback(2)
		}
		
	}, function(err){
		if(mapabort) return false;
		//error call
		console.warn('ERROR(' + err.code + '): ' + err.message);
	  //look for timeout
	  if(callback) callback(3)
	  if(err.message.indexOf('Timeout expired')!=-1){
		  console.log('TIME OUT DETECTED')
		  if(callback) callback(3)
		  message('No location. Check web connection.')
	  }
	}, map_options);
}

