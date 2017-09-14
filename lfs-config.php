<?php
$domain    = $_SERVER['SERVER_NAME'];
$host = $_SERVER['HTTP_HOST'];
//var_dump($_SERVER);


if($domain =='localhost'){
	define('BASE',			'http://localhost'.$_SERVER['REQUEST_URI']);
	define('PREFIX',		'lfs_');
	define('DB_NAME',		'darkshift');
	define('DB_USER',		'root');
	define('DB_PASSWORD',	'mysql');
	define('DB_HOST',		'localhost');
}else if($domain =='darkshift.adamttaylor.com'){
	define('BASE',			'http://darkshift.adamttaylor.com/');
	define('PREFIX',		'lfs_');
	define('DB_NAME',		'db617328543');
	define('DB_USER',		'dbo617328543');
	define('DB_PASSWORD',	'@@At2099');
	define('DB_HOST',		'db617328543.db.1and1.com');	
}else if($domain == 'landsendgaming.com'){
	define('BASE',			'http://landsendgaming.com/station/');
	define('PREFIX',		'lfs_');
	define('DB_NAME',		'landsend_station');
	define('DB_USER',		'landsend_station_user');
	define('DB_PASSWORD',	'@@At2099');
	define('DB_HOST',		'localhost');
}else{
	define('BASE',			'http://landsendgaming.com/station/');
	define('PREFIX',		'lfs_');
	define('DB_NAME',		'landsend_station');
	define('DB_USER',		'landsend_station_user');
	define('DB_PASSWORD',	'@@At2099');
	define('DB_HOST',		'localhost');
}
?>