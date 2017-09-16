 <?php
/*
ISSUES
- In skills line 5, 34

*/
include_once('lfs-config.php');
$prefix = PREFIX;
$link   = false;

$method = isset($_POST['method'])? $_POST['method'] : '';
//echo 'method: '.$method;
if($method){
	if(function_exists($method)){
		call_user_func($method);
	}else{
		echo 'No method exists for: '.$method;
		die();
	}
}
	

function init(){
	buildTables();
}

function login(){
	global $_POST,$prefix;
	$un = array_key_exists('user',$_POST)? $_POST['user'] :  false;
	if($un){
		results("select * from {$prefix}users where user_name = '{$un}';");
	}
	return false;
}
function loginChar(){
	global $_POST,$prefix;
	if(isset($_POST['char_id'])){
		results("select * from {$prefix}users join {$prefix}characters using (user_id) where char_id = '{$_POST['char_id']}';");
	}
	return false;
}
function searchCharacters(){
	global $_POST,$prefix,$method;
	extract($_POST);
	if(isset($user_id) || isset($s) || isset($char_id)){
		$where = '';
		if(isset($user_id)) $where =  "where u.user_id=".$user_id;
		if(isset($char_id)) $where =  "where ch.char_id=".$char_id;
		if(isset($s) && $s!='*') $where =  "where ch.char_name like '%{$s}%' OR concat(u.first_name, ' ', u.last_name) like '%{$s}%' or t.team like '%{$s}%'";
		$str = 
		"select *,concat(u.first_name, ' ', u.last_name) as fullname from {$prefix}users as u 
		left join {$prefix}characters as ch on(u.user_id = ch.user_id) 
		left join (SELECT tm.char_name as team,rel.subject_id FROM `lfs_relationships` as rel left join lfs_characters as tm on (rel.skill_id = tm.char_id)  WHERE rel_key = 'member' and rel_active='y') as t on (t.subject_id = ch.char_id)
		{$where}";
		//echo $str;
		results($str,false);
	}
	return false;
}
function charactersByID(){
	global $_POST,$prefix,$method;
	extract($_POST);
	results("select * from {$prefix}characters where char_id in({$ids});");
}
function simpleCharacterList(){
	global $_POST,$prefix,$method;
	extract($_POST);
	if(isset($user_id) || isset($s) || isset($char_id)){
		$where = '';
		if(isset($user_id)) $where =  "u.user_id=".$user_id;
		if(isset($char_id)) $where =  "ch.char_id=".$char_id;
		if(isset($s)) $where =  "ch.char_name like '%{$s}%' OR concat(u.first_name, ' ', u.last_name) like '%{$s}%'";
		$str = 
		"select *,concat(u.first_name, ' ', u.last_name) as fullname from {$prefix}users as u left join {$prefix}characters as ch on(u.user_id = ch.user_id) 
		left join {$prefix}relationships as rel on(ch.char_id = rel.subject_id) 
		where {$where}";
		//echo $str;
		results($str,false);
	}
	return false;
}
function allSimpleCharacters(){
	global $_POST,$prefix,$method;
	results("select char_id,char_name,type from {$prefix}characters;");
}
function allUserCharacters(){
	global $_POST,$prefix,$method;
	results("select * from {$prefix}characters  join {$prefix}users using (user_id);");
}
function getTeam($id=false){
	global $_POST,$prefix,$method;
	extract($_POST);
	//$where = '';
	if($char_id || $id){
		//if(isset($user_id)) $where =  " where u.user_id=".$user_id;
		//if(isset($char_id)) $where =  " where ch.char_id=".$char_id;
		//if(isset($s)) $where =  " where ch.char_name='{$s}' OR fullname='{$s}'";
		if($id) $char_id = $id;
		$str =
		"SELECT * FROM {$prefix}characters WHERE char_id = {$char_id}
		UNION
		select ch.* from {$prefix}characters as ch
		left join {$prefix}relationships as rel  on (ch.char_id = rel.subject_id and rel_key = 'member' and rel_active='y')
		where rel.skill_id = {$char_id};";
		results($str);
	}
}
function characterList(){
	global $_POST,$prefix,$method;
	extract($_POST);
	//if(isset($user_id) || isset($s) || isset($char_id)){
		$where = '';
		if(isset($user_id)) $where =  " where u.user_id=".$user_id;
		if(isset($char_id)) $where =  " where ch.char_id=".$char_id;
		if(isset($s)) $where =  " where ch.char_name='{$s}' OR fullname='{$s}'";
		$str = 
		"select u.*,ch.*,concat(u.first_name, ' ', u.last_name) as fullname, 
		rel.rel_id,rel.subject_id,rel.skill_id,rel.rel_active,rel.rel_info,rel.rel_key,'' as battery, '' as module
		from {$prefix}users as u left join {$prefix}characters as ch on(u.user_id = ch.user_id) 
		left join {$prefix}relationships as rel on(ch.char_id = rel.subject_id) {$where}
		
		union
		
		select u.*,ch.*,concat(u.first_name, ' ', u.last_name) as fullname,
		g.gear_id as rel_id,
		g.char_id as subject_id,
		g.eq_id as skill_id,
		g.rel_active,g.rel_info,g.rel_key,g.battery,g.module
		from {$prefix}users as u left join {$prefix}characters as ch on(u.user_id = ch.user_id) 
		left join {$prefix}gear as g on(ch.char_id = g.char_id) {$where};";
		//echo $str;
		results($str);
	//}
	//return false;
}
function knownSkills(){
	global $_POST,$prefix,$method;
	$in = $_POST['in']?  " and sk.sk_id in('{$_POST['in']}');" : '';
	$str = "select * from {$prefix}relationships as rel join {$prefix}skills as sk on (sk.sk_id = rel.skill_id && rel_key = 'known') where rel.subject_id=".$_POST['char_id'].$in;
	results($str);
}
function getAllowance(){
	global $_POST,$prefix,$method;
	extract($_POST);
	//$act = logActivity(array('action'=>'rich','char_id'=>$char_id,'pre'=>$pre,'info'=>$info));
	
	$str = 
	"update {$prefix}relationships set rel_info='cash' where rel_key='event' and subject_id='{$char_id}' and skill_id='{$event_id}';"
	.station_energy(10,'-').
	"update {$prefix}characters set energy = energy+10 where char_id={$char_id};";
	results($str,false,true);
}
function paychar(){
	global $_POST,$prefix,$method;
	extract($_POST);
	$str = "update {$prefix}characters set {$field}= COALESCE({$field},0) + {$value} where char_id='{$char_id}'";
	results($str);
}
function getMarketPlace(){
	global $prefix;
	extract($_POST);
	//results("select gear.*,c.char_id,c.char_name as owner, coalesce(gear.rel_info,'') as rel_info from {$prefix}gear as gear left join {$prefix}characters as c on (c.char_id=gear.char_id) where rel_active='y' and rel_key='gear' and (rel_info IS NULL OR rel_info = 'stored');");
	results("select gear.*,c.char_id,c.char_name as owner,c.char_name as seller, coalesce(gear.rel_info,'') as rel_info from {$prefix}gear as gear left join {$prefix}characters as c on (c.char_id=gear.char_id) where rel_active='y' and (c.char_id in ({$char_id}) OR (market like 's%' and ( visible in({$char_id}) or visible = '*') ) ) having rel_info !='equip' and rel_info != 'install' ;");	
}
function getBlueprints(){
	global $prefix;
	results("select gear.*,c.char_id,c.char_name as owner from {$prefix}gear as gear left join {$prefix}characters as c on (c.char_id=gear.char_id) where rel_active='y' and rel_key!='gear';");
	//coalesce(gear.rel_info,'') as rel_info
}
function allSkills(){
	global $prefix;
	results("SELECT * FROM {$prefix}skills;");
}
function allBackgrounds(){
	global $prefix;
	results("SELECT * FROM {$prefix}backgrounds;");
}
function allNations(){
	global $prefix;
	results("SELECT * FROM {$prefix}nations;");
}
function allEquip(){
	global $prefix;
	results("SELECT e.*,e.special as extra, b.b_rules,b_disadv,eq_id,COALESCE(b.special,e.special) as special FROM {$prefix}equipment as e left join {$prefix}birth as b on(e.id = b.eq_id);");	
}
function allPsion(){
	global $prefix;	
	//Run the below if problems loading
	//update lfs_psionics set psi_desc = replace(replace(psi_desc,'“','"'),'”','"');
	results("SELECT * FROM {$prefix}psionics;");
}
function resublimate(){
	global $_POST,$prefix,$method;
	extract($_POST);
	//$str = "update {$prefix}characters set penalty = {$penalty} where char_id='{$char_id}'";	
	$str = "insert into {$prefix}penalty (ref_id,char_id) values({$penalty},{$char_id});";	
	results($str);
}
function loadTrauma(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "select * from {$prefix}penalty where char_id={$char_id};";
	results($str);
}
function lootByValue(){
	global $_POST,$prefix,$method;
	$str = "select * from {$prefix}loot where qr_value='{$_POST['qr_value']}'";	
	results($str);
}
function claimLoot(){
	global $_POST,$prefix;
	$str = "update {$prefix}loot set claimed='1' where qr_value='{$_POST['qr_value']}'";
	results($str);
}
function deClaimLoot(){
	global $_POST,$prefix;
	$str = "update {$prefix}loot set claimed='0' where qr_value='{$_POST['qr_value']}'";
	results($str);
}
function learnSkill(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "insert into {$prefix}relationships (subject_id,skill_id,rel_active,rel_key) values({$char_id},{$skill_id},'y','{$rel_key}');";
	runQuery($str);
	$str = "select * from {$prefix}relationships where subject_id='{$char_id}' and skill_id='{$skill_id}' and rel_key='{$rel_key}';";
	results($str);	
}
function hasLearned(){
	global $prefix;
	extract($_POST);
	results("SELECT * FROM {$prefix}relationships where skill_id={$skill_id} and subject_id={$char_id} and rel_key='{$type}';");
}
function giveSkill(){
	global $prefix;
	extract($_POST);
	results("update {$prefix}relationships set subject_id = {$reciever} where skill_id={$skill_id} and subject_id={$giver} and rel_key='{$type}';");
}
function applyLoot(){
	global $_POST,$prefix;
	extract($_POST);
	$str = '';
	foreach($lines as $line){
		$line = (object) $line;
		$str .= "update {$prefix}characters set {$line->field}= {$line->field}+{$line->value} where char_id='{$line->char_id}';";
		$type = 'frag';
		if($line->field=='energy'){
			$type = 'energy';
			$str.= station_energy($line->tax);
		}
		$str.= 
		"insert into {$prefix}activity(action,char_id,edit_char_id,info,pre) values('scan {$type}','{$line->char_id}','{$line->char_id}','{$line->info}','{$line->pre}');";
	}
	results($str,false,true);
}
function marketBlueprint(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "update {$prefix}gear set market='{$market}', visible='{$visible}' where  gear_id={$gear_id};";
	results($str);
}
function removeMarket(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "update {$prefix}gear set market=NULL, visible=NULL where  gear_id={$gear_id};";
	results($str);
}
function deconstructBlueprint(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "update {$prefix}characters set {$frag} = {$frag} + {$count} where char_id = {$char_id};";
	runQuery($str,false,false,true);
	deleteGear();
}
function deleteGear(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "update {$prefix}gear set rel_active='' where  gear_id in ({$gear_ids});";
	results($str);
}
function equipGear(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "update {$prefix}gear set rel_info='{$equip}' where  gear_id={$gear_id};";
	//echo $str;
	results($str);
}
function modGear(){
	global $_POST,$prefix;
	extract($_POST);
	results("update {$prefix}gear set {$column}='{$info}' where  gear_id={$gear_id};");
}
function markActivity(){
	global $_POST,$prefix;
	extract($_POST);
	$id_col = $table=='gear'? 'gear_id' : 'rel_id';
	$str = "update {$prefix}{$table} set rel_active='{$active}' where {$id_col}={$id};";
	//echo $str;
	results($str);
}
function inactiveSkill(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "update {$prefix}relationships set rel_active='' where subject_id={$char_id} and skill_id={$skill_id} and rel_key='{$rel_key}';";
	results($str);
}
function setFragComplete(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "update {$prefix}gear set rel_info='{$rel_info}' where gear_id={$gear_id};
	update {$prefix}characters set {$prop}='{$cost}' where char_id='{$billChar}';";
	//echo $str;
	results($str,false,true);
}
function convertToBlueprint(){
	global $_POST,$prefix;
	extract($_POST);
	$str = 
	"update {$prefix}gear set rel_key='blue', rel_info=NULL where gear_id={$gear_id};
	update {$prefix}characters set {$prop}='{$cost}' where char_id='{$char_id}';";
	//echo $str;
	runQuery($str,false,true);
	results("select * from {$prefix}gear where gear_id={$gear_id};",false,false,true);
}
//x
function transferGear(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "select market from {$prefix}gear where gear_id={$gear_id};";
	$dat = runQuery($str,false,false,true);
	
	if(isset($dat[0]['market'])){
		//echo 'ON MARKET!!;';
		$m = $dat[0]['market'];
		if(substr($m,0,1)=="s"){
			//echo 'still being sold';
			$str = 
			"update {$prefix}gear set char_id = {$buyer}, market='' where gear_id={$gear_id};
			update {$prefix}characters set energy= energy - {$total} where char_id='{$buyer}';
			update {$prefix}characters set energy= energy + {$price} where char_id='{$seller}';"
			.station_energy($tax);
			runQuery($str,false,true,true);
			//results($str,true,true);
			
			results("select g.gear_id as rel_id, 
			g.char_id as subject_id,
			g.eq_id as skill_id,
			g.rel_active,g.rel_info,g.rel_key,g.battery,g.module
			from {$prefix}gear as g where gear_id={$gear_id};");	
		}
	}else{
		echo 'no longer for sale';
	}
}
function takeGear(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "update {$prefix}gear set char_id = {$buyer}, market='' where gear_id={$gear_id};";
	runQuery($str);
	results("select *,gear_id as rel_id from  {$prefix}gear where gear_id={$gear_id};");
}
//x
function transferSkill(){
	global $_POST,$prefix;
	extract($_POST);
	
	$str =
	"update {$prefix}relationships set subject_id = {$buyer} where rel_id = {$rel_id};
	update {$prefix}characters set energy = energy + {$price} where char_id={$seller};
	update {$prefix}characters set energy = energy - {$total} where char_id={$buyer};
	update {$prefix}characters set energy = energy + {$fee} where char_id={$dr};"
	.station_energy($tax);
	results($str,false,true);							
								
}
function ingestQr(){
	global $_POST,$prefix;
	$str = "insert into {$prefix}loot (skill_id,qr_value) values ('{$_POST['skill_id']}','{$_POST['qr_value']}');";
	results($str);
}
//
function buildItem(){
	global $_POST,$prefix,$link;
	extract($_POST);
	$info = $rel_info? "'{$rel_info}'": 'NULL';
	$str = 
	"insert into {$prefix}gear (eq_id,char_id,rel_key,rel_active,rel_info) values ({$eq_id},{$char_id},'gear','y',{$info});
	update {$prefix}characters set energy = energy - {$cost} where char_id={$billChar};"
	.station_energy($tax);
	
	runQuery($str,false,true);
	results("select *,gear_id as rel_id from {$prefix}gear where char_id = {$char_id} order by gear_id desc limit 1;",false,false,true);
	//results("select * from {$prefix}gear where gear_id={$last_id};");
}
function activeConfig(){
	global $_POST,$prefix,$link;
	extract($_POST);
	$str = "update {$prefix}configs set active='0' where char_id='{$char_id}';update {$prefix}configs set active='1' where config_id='{$config_id}';";
	//echo $str;
	results($str,false,true);
}
function configList(){
	global $_POST,$prefix,$method;
	$where = '';
	if(isset($_POST['char_id'])){
		if(isset($_POST['char_id'])) $where =  "cf.char_id=".$_POST['char_id'];
		$str = "select * from {$prefix}configs as cf left join {$prefix}relationships as rel on(cf.config_id = rel.subject_id && rel.rel_key='skill') where {$where} ;";
		results($str,false);
	}
}
function charandConfig(){
	global $_POST,$prefix,$method;
	$where = '';
	if(isset($_POST['char_id'])){
		if(isset($_POST['char_id'])) $where =  "ch.char_id=".$_POST['char_id'];
		$str = "select * from
		{$prefix}characters as ch
		join {$prefix}configs as cf on (ch.char_id = cf.char_id) where {$where};";
		results($str,false);
	}
}
function setGameMode(){
	global $_POST,$prefix; extract($_POST);
	date_default_timezone_set('America/New_York');
	$d = date('Y-F');
	if($mode===true || $mode === "true"){
		results("insert into {$prefix}options (option_key,option_value) VALUES ('gamemode','{$mode}') on DUPLICATE KEY UPDATE option_value='{$mode}';");
		runQuery("insert ignore into {$prefix}events (date) VALUES ('{$d}');");
	}else{
		$str =
		"update {$prefix}options set option_value='false' where option_key = 'gamemode';
		update {$prefix}gear set rel_active='' where rel_info='expires';
		update {$prefix}loot set claimed='0';
		update {$prefix}asteroid set status='i', unlocked=0;
		delete from {$prefix}penalty;";
		results($str,false,true);	
		
	}
	//return '[{"status":"ok"}]';
}
function getOptions(){
	global $_POST,$prefix;
	$str = "select * from {$prefix}options;";
	results($str);
}
function stationLoot(){
	global $_POST,$prefix;
	extract($_POST);
	results("update {$prefix}options set option_value='{$cost}' where option_key='station_energy';");
}
function saveOptions(){
	global $_POST,$prefix;
	if(isset($_POST['data'])){
		$str = '';
		foreach($_POST['data'] as $ky=>$val){
			$str .="insert into {$prefix}options (option_key,option_value)values('{$ky}','{$val}') on duplicate key update option_value='{$val}';";	
		}
		results($str,false,true);
	}
}
function changeSleeve(){
	global $_POST,$prefix;
	extract($_POST);
	results("update {$prefix}gear set eq_id='{$eq_id}' where gear_id='{$gear_id}';");
}
function saveUser(){
	global $_POST,$prefix;
	if(isset($_POST['data'])){
		extract($_POST['data']);
		$str = 
		"insert into {$prefix}users (user_level,user_name,user_pass,first_name,last_name,email)values('$user_level','$user_name','$user_pass','$first_name','$last_name','$email');
		insert into {$prefix}characters (user_id,char_name)VALUES(LAST_INSERT_ID(),'$char_name');";
		results($str,false,true);
	}
}
function updateCharacter(){
	global $_POST,$prefix;
	if(isset($_POST['data'])){
		extract($_POST['data']);
		$str = '';
		if(!isset($user_name)) $user_name = false;
		if(!isset($user_id)) $user_id = false;
		if($user_name && $user_id){
			$str = "update {$prefix}users set user_name='{$user_name}'";
			if($first_name) $str.=", first_name='{$first_name}'";
			if($last_name) $str.=", last_name='{$last_name}'";
			if($user_pass) $str.=", user_pass='{$user_pass}'";
			if($user_level) $str.=", user_level='{$user_level}'";
			if($email) $str.=", email='{$email}'";
			$str.=" where user_id={$user_id};";
		}
		$char = isset($char_name)? 		", char_name='{$char_name}'" : '';
		$c = isset($ego_cunning)?		", ego_cunning='{$ego_cunning}'" : '';
		$d = isset($ego_discipline)?	", ego_discipline='{$ego_discipline}'" : '';
		$t = isset($ego_tolerence)?	", ego_tolerence='{$ego_tolerence}'" : '';
		$ext = isset($extra_bg)?	", extra_bg='{$extra_bg}'" : '';
		$e = isset($energy)?	", energy='{$energy}'" : '';
		$bas = isset($basic_frag)?	", basic_frag='{$basic_frag}'" : '';
		$tac = isset($tactical_frag)?	", tactical_frag='{$tactical_frag}'" : '';
		$bio = isset($biomedical_frag)?	", biomedical_frag='{$biomedical_frag}'" : '';
		$cyb = isset($cybernetic_frag)?	", cybernetic_frag='{$cybernetic_frag}'" : '';
		$che = isset($chemical_frag)?	", chemical_frag='{$chemical_frag}'" : '';
		if(!isset($birth_race)) $birth_race = 0;
		if(!isset($nation)) $nation = 0;
		$str .= "update {$prefix}characters set birth_race='{$birth_race}', nation='{$nation}'{$char}{$c}{$d}{$t}{$e}{$bas}{$tac}{$bio}{$cyb}{$che}{$ext} where char_id={$char_id};";
		$str .= relationString($relations);
		//echo $str;
		results($str,false,true);
	}
}
function createTeam(){
	global $_POST,$prefix;
	extract($_POST);
	/*$str = 
	"insert into {$prefix}characters (user_id,char_name,type) values ('{$admin}','{$name}','team');
	set @team = LAST_INSERT_ID();
	insert into {$prefix}relationships (subject_id,skill_id,rel_active,rel_key) values (1,@team,'y','member');
	";*/
	$str = 
	"insert into {$prefix}characters (user_id,char_name,type) values ('{$admin}','{$name}','team');
	set @team = LAST_INSERT_ID();".relationString($members);
	runquery($str,false,true);
	results('Select * from {$prefix}characters order by char_id desc limit 1');
}
function editTeam(){
	global $_POST,$prefix;
	if(isset($_POST['data'])){
		extract($_POST['data']);
		$e = isset($energy)?	", energy='{$energy}'" : '';
		$bas = isset($basic_frag)?	", basic_frag='{$basic_frag}'" : '';
		$tac = isset($tactical_frag)?	", tactical_frag='{$tactical_frag}'" : '';
		$bio = isset($biomedical_frag)?	", biomedical_frag='{$biomedical_frag}'" : '';
		$cyb = isset($cybernetic_frag)?	", cybernetic_frag='{$cybernetic_frag}'" : '';
		$che = isset($chemical_frag)?	", chemical_frag='{$chemical_frag}'" : '';

		$str = "update {$prefix}characters set user_id='{$admin_id}', char_name='{$team_name}'{$e}{$bas}{$tac}{$bio}{$cyb}{$che} where char_id={$char_id};";
		$str .= relationString($members);
		runquery($str,false,true);
		getTeam($char_id);
	}

}
function sendFrags(){
	global $_POST,$prefix;
	extract($_POST);
	extract($_POST['data']);
	
	if($reciever == "station"){
		$str = 
		"update {$prefix}characters set energy = energy - {$energy} where char_id={$sender};"
		.station_energy($energy);
	}else{
		$e = isset($energy)? " energy= energy -{$energy}" :"";
		$b = isset($basic_frag)? " basic_frag = basic_frag -{$basic_frag}" :"";
		$t = isset($tactical_frag)? " tactical_frag = tactical_frag -{$tactical_frag}" :"";
		$bio = isset($biomedical_frag)? " biomedical_frag = biomedical_frag -{$biomedical_frag}" :"";
		$c = isset($cybernetic_frag)? " cybernetic_frag = cybernetic_frag -{$cybernetic_frag}" :"";
		$ch = isset($chemical_frag)? " chemical_frag= chemical_frag -{$chemical_frag}" :"";
		$send = array($e,$b,$t,$bio,$c,$ch);
		$send = array_filter($send);
		$send = implode(',',$send);
		
		$str = 
		"update {$prefix}characters set {$send} where char_id={$sender};
		update {$prefix}characters set ".str_replace('-','+',$send)." where char_id={$reciever};";
	}
	results($str,false,true);
}
/*
function setRace(){
	global $_POST,$prefix;
	if(isset($_POST['data'])){
		extract($_POST['data']);
		$str = "update {$prefix}characters set birth_race='{$birth_race}' where char_id={$char_id};";
		results($str);
	}
}
function setNation(){
	global $_POST,$prefix;
	if(isset($_POST['data'])){
		extract($_POST['data']);
		$str = "update {$prefix}characters set nation='{$nation}' where char_id={$char_id};";
		results($str);
	}
}*/
function updatePools(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "update {$prefix}characters set ego_cunning ='{$cunning}', ego_discipline='{$discipline}', ego_tolerence='${tolerence}' where char_id='{$char_id}';";
	results($str);	
}
function getGameMode(){
	global $prefix; 
	results("select option_value from {$prefix}options where option_key='gamemode';");
}
function checkin(){
	global $_POST,$prefix;
	if(isset($_POST['char_id']) && isset($_POST['event_id'])){
		runQuery("insert into {$prefix}relationships (subject_id,skill_id,rel_key,rel_active) VALUES ({$_POST['char_id']},{$_POST['event_id']},'event','y');");
		results("select * from {$prefix}relationships where subject_id = {$_POST['char_id']} and rel_key='event' order by rel_id desc;");
	}
}
function updateBG(){
	global $_POST,$prefix;
	extract($_POST);
	results("update {$prefix}relationships set rel_info='{$rel_info}' where subject_id='{$subject_id}' and skill_id='{$skill_id}' and rel_key='background';");
}
function psychologists(){
	global $_POST,$prefix;
	extract($_POST);
	$str = 
	"SELECT * FROM {$prefix}characters as ch join {$prefix}relationships as rel on(ch.char_id = rel.subject_id) 
	where rel_key='known' and skill_id in({$skills});";
	results($str);
}
function simpleTeams(){
	global $prefix;
	results("select * from {$prefix}characters as ch join {$prefix}users as u on (u.user_id = ch.user_id) where type='team'");
}
function activeCharacters(){
	global $_POST,$prefix;
	if(isset($_POST['event_id'])){
		results("SELECT * FROM {$prefix}characters as ch join {$prefix}relationships as rel on(ch.char_id = rel.subject_id) where rel_key='event' and skill_id={$_POST['event_id']};");
	}
}
function thisEvent(){
	global $_POST,$prefix;
	results("select * from {$prefix}events order by event_id desc limit 1;");	
}
function newConfig(){
	global $_POST,$prefix,$link;
	extract($_POST);
	if($_POST['active']){
		$str = "insert into {$prefix}configs (char_id,config_label,active) values ('{$char_id}','{$config_label}','1');";
	}else{
		$str = "insert into {$prefix}configs (char_id,config_label) values ('{$char_id}','{$config_label}');";
	}
	runQuery($str);
	$q = runQuery("SELECT config_id FROM {$prefix}configs WHERE char_id = 1 order by config_id desc limit 1;");
	$id = $q[0];
	$id = $id['config_id'];
	//var_dump($id);
	if(isset($skill) && $skill){
		$skill	= str_replace('config_id',$id,$skill);
		$str	= relationString($skill);
		runQuery($str,false,true);
		//echo $str;
	}
	echo $id;
}
function saveConfig(){
	global $_POST,$prefix;
	
	$str = "update {$prefix}configs set config_label='{$_POST['config_label']}' where config_id={$_POST['config_id']};";
	if(isset($_POST['skill']) && $_POST['skill']){
		$str .= relationString($_POST['skill']);
	}
	results($str,false,true);
	//echo $str;
}
function backgroundInfo(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "update {$prefix}relationships set rel_info='{$info}' where subject_id='{$char_id}' and skill_id='{$skill_id}';";
	results($str);
}
function saveRelations(){
	global $_POST,$prefix;
	if(isset($_POST['relation'])){
		$str = relationString($_POST['relation']);
		results($str,false,true);
	}
}
function gearList($char_id){
	global $prefix;
	return 
	"select g.gear_id as rel_id, 
	g.char_id as subject_id,
	g.eq_id as skill_id,
	g.rel_active,g.rel_info,g.rel_key,g.battery,g.module
	from {$prefix}gear as g where char_id={$char_id};";	
}
function otherMods(){
	global $prefix;
	extract($_POST);
	return 
	results("select g.gear_id as rel_id, 
	g.char_id as subject_id,
	g.eq_id as skill_id,
	g.rel_active,g.rel_info,g.rel_key,g.battery,g.module, eq.name 
	from {$prefix}gear as g
	join lfs_equipment as eq on (eq.id = g.eq_id)
	where gear_id in({$gear_id});");
}
function addBlueprint(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "insert into {$prefix}gear (char_id,eq_id,rel_active,rel_key) VALUE($char_id,$eq_id,'y','$type');";
	runQuery($str);
	results(gearList($char_id),false,false,true);
}
function freeSleeve(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "insert into {$prefix}gear (char_id,eq_id,rel_active,rel_key,rel_info) VALUE($char_id,$eq_id,'y','gear','equip');";
	
	runQuery($str);
	$str = "select * from {$prefix}gear where char_id= {$char_id} order by gear_id desc limit 1;";
	results($str,false,false,true);
}
function relationString($rel,$edit=true){
	global $_POST,$prefix;
	if(gettype($rel)=='string'){
		$rel = json_decode($rel);
	}
	$str = '';
	if($rel){
		foreach($rel as $i=>$r){
			$r = (object) $r;
			$info  = isset($r->rel_info)? "'".$r->rel_info."'" : "NULL";
			$rInfo = isset($r->rel_info)? ", rel_info='{$r->rel_info}'": "";
			$subject = $edit?  "$r->subject_id" : "@last_id";
			$str .= "insert into {$prefix}relationships (subject_id,skill_id,rel_key,rel_active,rel_info) VALUES ({$subject},{$r->skill_id},'{$r->rel_key}','{$r->rel_active}',{$info}) ON DUPLICATE KEY update rel_active='{$r->rel_active}'".$rInfo.";
				";	
		}
	}
	return $str;
}
function adminAsteriods(){
	global $_POST,$prefix;
	results("select * from {$prefix}asteroid;");
}
function createMission(){
	global $_POST,$prefix;
	extract($_POST);
	$str = "insert into {$prefix}missions (type,ref,event,captain,crew,subtype,progress) VALUES ('{$data['type']}', '{$data['ref']}', '{$data['event']}', '{$data['captain']}', '{$data['crew']}', '{$data['subtype']}', '{$data['progress']}');";
	//results($str);
	runQuery($str);
	results("select * from {$prefix}missions where captain = '{$data->captain}' order by qid desc limit 1;");
}
function modQueue(){
	global $_POST,$prefix;
	extract($_POST);
	results("SELECT * FROM {$prefix}missions as mis left join {$prefix}asteroid as ast on (mis.ref = ast.id and type='pilot') where progress= 's';");
}
function endMission(){
	global $_POST,$prefix;
	extract($_POST);
	results("update {$prefix}missions set progress='{$stat}' where qid='{$qid}';");
}
function completeMission(){
	global $_POST,$prefix;
	extract($_POST);
	results("update {$prefix}missions set progress='c' where qid='{$qid}';");
}
function missionAsteriods(){
	global $_POST,$prefix;
	results("select * from {$prefix}asteroid as ast left join {$prefix}missions as modq on (ast.id = modq.ref and modq.type='pilot' and (modq.progress='s' or  modq.progress='c') ) where ast.status !='i';");
}
function getMissions(){
	global $_POST,$prefix;
	extract($_POST);
	results("select * from {$prefix}missions where type!='pilot' and progress!='i' and event = {$event};");
}
function createAsteroid(){
	global $_POST,$prefix;
	extract($_POST);
	runQuery("insert into {$prefix}asteroid (difficulty,distance,name,status,special) values ('{$difficulty}','{$distance}','{$name}','{$status}','{$special}');");
	results("SELECT * FROM `lfs_asteroid` order by id desc limit 1;");
	
}
function getAsteroid(){
	global $_POST,$prefix;
	extract($_POST);
	results("select * from {$prefix}asteroid as ast left join {$prefix}missions as modq on (ast.id = modq.ref and modq.type='pilot' and (modq.progress='s' or  modq.progress='c') ) where id=$id;");
}
function singleMission(){
	global $_POST,$prefix;
	extract($_POST);
	results("select * from {$prefix}missions where qid=$id;");
}
function statusAsteroid(){
	global $_POST,$prefix;
	extract($_POST);
	results("update {$prefix}asteroid set status ='{$status}' where id=$id;");
}
function scanAsteroid(){
	global $_POST,$prefix;
	extract($_POST);
	runQuery("update {$prefix}asteroid set unlocked ='1' where id={$id};");
	results("select * from {$prefix}asteroid where id={$id};");
}
function updateAsteroids(){
	global $_POST,$prefix;
	extract($_POST);
	$str = '';
	foreach($data as $i=>$a){
		$a = (object) $a;
		$str .= "update {$prefix}asteroid set status='{$a->status}' where id={$a->id};
		";
	}
	results($str,false,true);
}
//data:{'method':'removeLastTrauma','patient':chid,'dr':ds.CH.char_id,'cost':serv,'tax':tx,'total':tot,'ç':tid},
//X
function removeLastTrauma(){
	global $_POST,$prefix;
	extract($_POST);
	$str = 
	"delete from {$prefix}penalty where p_id={$trauma_id};
	update {$prefix}characters set energy = energy + {$cost} where char_id = {$dr};"
	.station_energy($tax);
	
	results($str,false,true);
}
//x
function resetEgo(){
	global $_POST,$prefix;
	extract($_POST);
	$str = 
	"update {$prefix}characters set ego_cunning=1, ego_tolerence=1, ego_discipline=1, energy = energy - {$total} where char_id={$patient};
	update {$prefix}characters set energy = energy + {$cost} where char_id = {$dr};"
	.station_energy($tax);
	
	results($str,false,true);
}
function createSkill(){
	global $_POST,$prefix;
	extract($_POST);
	$str = 
	"update {$prefix}characters set energy = energy - {$total} where char_id={$patient};
	update {$prefix}characters set basic_frag = basic_frag - {$basic_frag} where char_id={$patient};
	update {$prefix}characters set biomedical_frag = biomedical_frag - {$biomedical_frag} where char_id={$patient};
	update {$prefix}characters set chemical_frag = chemical_frag - {$chemical_frag} where char_id={$patient};
	update {$prefix}characters set tactical_frag = tactical_frag - {$tactical_frag} where char_id={$patient};
	update {$prefix}characters set cybernetic_frag = cybernetic_frag - {$cybernetic_frag} where char_id={$patient};
	insert into {$prefix}relationships (subject_id,skill_id,rel_active,rel_key) values({$patient},{$skill_id},'y','learn');
	update {$prefix}characters set energy = energy + {$cost} where char_id = {$dr};"
	.station_energy($tax);
	
	results($str,false,true);
}
function createPsionic(){
	global $_POST,$prefix;
	extract($_POST);
	$str = 
	"update {$prefix}characters set energy = energy - {$total} where char_id={$patient};
	update {$prefix}characters set basic_frag = basic_frag - {$basic_frag} where char_id={$patient};
	update {$prefix}characters set biomedical_frag = biomedical_frag - {$biomedical_frag} where char_id={$patient};
	update {$prefix}characters set chemical_frag = chemical_frag - {$chemical_frag} where char_id={$patient};
	update {$prefix}characters set tactical_frag = tactical_frag - {$tactical_frag} where char_id={$patient};
	update {$prefix}characters set cybernetic_frag = cybernetic_frag - {$cybernetic_frag} where char_id={$patient};
	insert into {$prefix}relationships (subject_id,skill_id,rel_active,rel_key) values({$patient},{$psi_id},'y','learnp');
	update {$prefix}characters set energy = energy + {$cost} where char_id = {$dr};"
	.station_energy($tax);
	
	results($str,false,true);
}

//x
function removeSkill(){
	global $_POST,$prefix;
	extract($_POST);
	$str = 
	"update {$prefix}characters set energy = energy - {$total} where char_id={$patient};
	update {$prefix}characters set energy = energy + {$cost} where char_id = {$dr};"
	.station_energy($tax);
	
	results($str,false,true);
}
function allactivity(){
	global $prefix;
	//results("select *,COALESCE(pre,'') as pre, COALESCE(post,'') as post, COALESCE(info,'') as info from {$prefix}activity;");
	
	$str = 
	"select act.*, init.char_name as fromName, ooo.char_name as toName, COALESCE(act.pre,'') as pre, COALESCE(act.post,'') as post, COALESCE(act.info,'') as info 
	from {$prefix}activity as act
	left join {$prefix}characters as init on (init.char_id = act.char_id)
	left join {$prefix}characters as ooo on (ooo.char_id = act.edit_char_id) order by time desc;";
	
	//$str = "select *,COALESCE(pre,'') as pre, COALESCE(post,'') as post, COALESCE(info,'') as info from {$prefix}activity;";
	results($str);

}
function activityCycle(){
	global $_POST,$prefix;
	extract($_POST);
	$str = 
	"select * from {$prefix}activity as act where time like '{$time}%';";
	results($str);
}
function indActivity(){
	global $_POST,$prefix;
	extract($_POST);
	//results("select *,COALESCE(pre,'') as pre, COALESCE(post,'') as post, COALESCE(info,'') as info from {$prefix}activity;");
	
	$str = 
	"select act.*, init.char_name as fromName, ooo.char_name as toName, COALESCE(act.pre,'') as pre, COALESCE(act.post,'') as post, COALESCE(act.info,'') as info 
	from {$prefix}activity as act
	left join {$prefix}characters as init on (init.char_id = act.char_id)
	left join {$prefix}characters as ooo on (ooo.char_id = act.edit_char_id) where act.char_id in ({$id}) or act.edit_char_id in ({$id}) order by time desc;";
	
	//$str = "select *,COALESCE(pre,'') as pre, COALESCE(post,'') as post, COALESCE(info,'') as info from {$prefix}activity;";
	results($str);
}
function logActivity($atts){
	global $prefix;
	//var_dump($atts);
	$defaultOptions = array("action" => "none", "char_id" => 0, "edit_char_id" => 0,"pre"=>"","post"=>"","info"=>'');
	$options = array_merge($defaultOptions, (array)$atts);
	extract($options);
	return "insert into {$prefix}activity(action,char_id,edit_char_id,pre,post,info) values('{$action}','{$char_id}','{$edit_char_id}','{$pre}','{$post}','{$info}');";	
}
function energyBudget($atts){
	global $prefix;
	$defaultOptions = array("earned" => "0", "spent" => "0","event"=>false);
	$options = array_merge($defaultOptions, (array)$atts);
	$str = '';
	if($atts['event']){
		$str = "update {$prefix}events set earned = earned+{$options['earned']}, spent = spent + {$options['spent']} where event_id = {$options['event']};";
	}
	return $str;
}
function station_energy($number,$opp = '+'){
	global $prefix;
	return "update {$prefix}options set option_value = cast(option_value as decimal(30,1)) $opp $number where option_key = 'station_energy';";
}
function results($str,$verbose=false,$multi=false,$disallowTrack=false){
	echo json_encode(runQuery($str,$verbose,$multi,$disallowTrack));
}
function runQuery($str,$verbose=false,$multi=false,$disallowTrack=false){
	global $link;
	
	$act	= isset($_POST['track']) && !$disallowTrack? logActivity($_POST['track']) : '';
	$budget = isset($_POST['budget']) && !$disallowTrack? energyBudget($_POST['budget']) : '';
	//echo $str.$act.$budget;
	//die();
	if($verbose) echo $str.$act.$budget.'<br/>';
	//$link = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME) or die("Error " . mysqli_error($link)); 
	
	//$link = mysqli_connect('localhost',DB_USER,DB_PASSWORD,DB_NAME) or die("Error " . 'DATABASE OUT OF CONNECTIONS'); 
	$link = mysqli_connect('localhost',DB_USER,DB_PASSWORD,DB_NAME) or die("Error " . mysqli_error($link)); 
	//mysqli_set_charset($link,"utf8");
	if($str){
		if($verbose) echo '<span>***QUERY TYPE: '.($multi? 'MULTI' : 'SINGLE').'</span><hr/><br/>';
		$result = $multi || $act || $budget? $link->multi_query($str.$act.$budget) : $link->query($str);
		//echo $str.$act.$budget.'<br/><br/>';
		/*if(isset($_POST['track'])){
			$act = logActivity($_POST['track']);
			echo $act;
			$resAct = $link->query($act);
			if(!$resAct && $verbose) echo '<span style="color:red">***RUN: ACTIVITY ERROR FOUND: '.$link->error.'</span><hr/><br/>';

		}*/
		if(!$result){
			if($verbose) echo '<span style="color:red">***RUN: ERROR FOUND: '.$link->error.'</span><hr/><br/>';
			mysqli_close ($link);
			return false;
		}else if(gettype($result)=='object'){
			if($verbose) echo '<span style="color:green">***RUN: No error:::</span><hr/><br/>';
			$arr_json = array();
			while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
					// $json = json_encode($row);
					 $arr_json[] = $row;
			}
			mysqli_close ($link);
			
			return $arr_json;
			
		}else{
			mysqli_close ($link);
			return false;
			if($verbose) echo '<span style="color:green">***RUN: No error:::</span><hr/><br/>';
		}
	}
	mysqli_close ($link);
}
/*
TABLES
-----------*/
function buildTables(){
	global $prefix;
	$tables = 
	"CREATE TABLE IF NOT EXISTS `{$prefix}options` (
	  `op_id` INT NOT NULL AUTO_INCREMENT,
	  `option_key` VARCHAR(45) NULL,
	  `option_value` VARCHAR(45) NOT NULL,
	  PRIMARY KEY (`op_id`),
	  UNIQUE INDEX `op_key_UNIQUE` (`option_key` ASC))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}users` (
	  `user_id` INT NOT NULL AUTO_INCREMENT,
	  `user_level` VARCHAR(45) NULL,
	  `user_name` VARCHAR(45) NOT NULL,
	  `user_pass` VARCHAR(45) NOT NULL,
	  `first_name` VARCHAR(80) NOT NULL,
	  `last_name` VARCHAR(150) NOT NULL,
	  `email` VARCHAR(255) NOT NULL,
	  PRIMARY KEY (`user_id`),
	  UNIQUE INDEX `user_id_UNIQUE` (`user_name` ASC))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}skills` (
	  `sk_id` INT NOT NULL AUTO_INCREMENT,
	  `sk_name` VARCHAR(150) NULL,
	  `sk_level` INT,
	  `sk_att` INT,
	  `sk_desc` VARCHAR(600),
	  `sk_prereq` VARCHAR(300),
	  `sk_prereq_id` VARCHAR(30),
	  `eq_prereq` VARCHAR(100),
	  `sk_category` INT,
	  `special` VARCHAR(50),
	  PRIMARY KEY (`sk_id`))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}psionics`(
	  `psi_id` INT NOT NULL AUTO_INCREMENT,
	  `psi_name` VARCHAR(150) NULL,
	  `psi_level` INT,
	  `psi_att` VARCHAR(10) NULL,
	  `psi_desc` VARCHAR(600),
	  `psi_type` VARCHAR(5),
	  `psi_category` INT,
	  `special` VARCHAR(50),
	  PRIMARY KEY (`psi_id`))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}equipment` (
	  `id` INT NOT NULL AUTO_INCREMENT,
	  `name` VARCHAR(150) NULL,
	  `rarity` VARCHAR(1),
	  `cost` INT,
	  `supplement` VARCHAR(30),
	  `capacity` VARCHAR(4),
	  `special` VARCHAR(30),
	  `rules` VARCHAR(600),
	  `physrep` VARCHAR(300),
	  `type` INT,
	  `skill` INT,
	  `image` VARCHAR(100),
	  PRIMARY KEY (`id`))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}nations` (
	  `id` INT NOT NULL AUTO_INCREMENT,
	  `name` VARCHAR(150) NULL,
	  `adv` VARCHAR(600),
	  `disadv` VARCHAR(600),
	  `special` VARCHAR(50),
	  PRIMARY KEY (`id`))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}backgrounds` (
	  `id` INT NOT NULL AUTO_INCREMENT,
	  `name` VARCHAR(150) NULL,
	  `adv` VARCHAR(600),
	  `disadv` VARCHAR(600),
	  `req` VARCHAR(100),
	  `special` VARCHAR(50),
	  PRIMARY KEY (`id`))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}birth` (
	  `id` INT NOT NULL AUTO_INCREMENT,
	  `eq_id` INT,
	  `b_rules` VARCHAR(600) NULL,
	  `b_disadv` VARCHAR(600) NULL,
	  `special` VARCHAR(150) NULL,
	  PRIMARY KEY (`id`))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}asteroid` (
	  `id` INT NOT NULL AUTO_INCREMENT,
	  `difficulty` VARCHAR(1) DEFAULT 'c',
	  `distance` INT,
	  `name` VARCHAR(100) NULL,
	  `unlocked` INT DEFAULT 0,
	  `status` VARCHAR(2) DEFAULT 'a',
	  `special` VARCHAR(1000) NULL,
	  PRIMARY KEY (`id`))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}missions` (
	  `qid` INT NOT NULL AUTO_INCREMENT,
	  `type` VARCHAR(10) NULL,
	  `ref` INT,
	  `event` INT,
	  `captain` INT,
	  `crew` VARCHAR(300) NULL,
	  `subtype` VARCHAR(1) DEFAULT 'c',
	  `progress` VARCHAR(2) DEFAULT 'a',
	  PRIMARY KEY (`qid`))
	ENGINE = InnoDB;
	
	
	CREATE TABLE IF NOT EXISTS `{$prefix}characters`(
	  `char_id` INT NOT NULL AUTO_INCREMENT,
	  `user_id` INT,
	  `char_name` VARCHAR(150) NOT NULL,
	  `birth_race` INT,
	  `nation` INT,
	  `ego` INT,
	  `ego_cunning` INT NULL DEFAULT '1',
	  `ego_tolerence` INT NULL DEFAULT '1',
	  `ego_discipline` INT NULL DEFAULT '1',
	  `penalty` INT NULL DEFAULT '0',
	  `energy` VARCHAR(10) DEFAULT '0',
	  `basic_frag` VARCHAR(10) DEFAULT '0',
	  `tactical_frag` VARCHAR(10) DEFAULT '0',
	  `biomedical_frag` VARCHAR(10) DEFAULT '0',
	  `cybernetic_frag` VARCHAR(10) DEFAULT '0',
	  `chemical_frag` VARCHAR(10) DEFAULT '0',
	  PRIMARY KEY (`char_id`),
	  UNIQUE INDEX `char_id_UNIQUE` (`char_id` ASC))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}configs`(
	  `config_id` INT NOT NULL AUTO_INCREMENT,
	  `char_id` INT,
	  `last_edit` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	  `config_label` VARCHAR(150) NOT NULL,
	  `config_race` INT,
	  `used_ego` INT,
	  `health` INT,
	  `armor` INT,
	  `active` INT DEFAULT '0',
	  PRIMARY KEY (`config_id`),
	  UNIQUE INDEX `config_id_UNIQUE` (`config_id` ASC))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}loot`(
	  `loot_id` INT NOT NULL AUTO_INCREMENT,
	  `skill_id` VARCHAR(150),
	  `qr_value` VARCHAR(150),
	  `claimed` INT DEFAULT 0, 
	  PRIMARY KEY (`loot_id`),
	  UNIQUE INDEX `loot_val_UNIQUE` (`qr_value` ASC))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}penalty`(
	  `p_id` INT NOT NULL AUTO_INCREMENT,
	  `ref_id` INT DEFAULT 0,
	  `char_id` INT, 
	  PRIMARY KEY (`p_id`))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}relationships`(
	  `rel_id` INT NOT NULL AUTO_INCREMENT,
	  `subject_id` INT,
	  `skill_id` INT,
	  `rel_active` VARCHAR(50),
	  `rel_info` VARCHAR(150),
	  `rel_key` VARCHAR(50),
	  PRIMARY KEY (`rel_id`),
	  UNIQUE INDEX `secondary` (`subject_id` ASC, `skill_id` ASC, `rel_key` ASC))
	  
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}activity`(
	  `act_id` INT NOT NULL AUTO_INCREMENT,
	  `action` VARCHAR(150),
	  `char_id` INT,
	  `edit_char_id` INT,
	  `pre` VARCHAR(500),
	  `post` VARCHAR(500),
	  `info` VARCHAR(500),
	  PRIMARY KEY (`act_id`))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}gear`(
	  `gear_id` INT NOT NULL AUTO_INCREMENT,
	  `char_id` INT,
	  `eq_id` INT,
	  `market` VARCHAR(30) NOT NULL DEFAULT '',
	  `visible` VARCHAR(30) NOT NULL DEFAULT '',
	  `battery` INT NOT NULL DEFAULT 0,
	  `module` VARCHAR(100),
	  `rel_active` VARCHAR(50),
	  `rel_info` VARCHAR(150),
	  `rel_key` VARCHAR(50),
	  PRIMARY KEY (`gear_id`))
	ENGINE = InnoDB;
	
	CREATE TABLE IF NOT EXISTS `{$prefix}events`(
	  `event_id` INT NOT NULL AUTO_INCREMENT,
	  `date` VARCHAR(30),
	  `earned` VARCHAR(100),
	  `spent` VARCHAR(100),
	  PRIMARY KEY (`event_id`),
	  UNIQUE INDEX `uni_date` (`date` ASC))
	ENGINE = InnoDB;
	";
	//UNIQUE INDEX `loot_val_UNIQUE` (`qr_value` ASC))
	$insert = 
	"insert ignore into {$prefix}users (user_id,user_level,user_name,user_pass,first_name,last_name) VALUES ('1','admin','AdamTt','cactuar','Adam','Taylor');
	insert ignore into {$prefix}characters (char_id, user_id, char_name) 
	VALUES ('1','1','System Bios 12');";
	/*
	insert ignore into {$prefix}relationships (subject_id,skill_id,rel_active,rel_key) VALUES (1,57,'y','known');
	insert ignore into {$prefix}relationships (subject_id,skill_id,rel_active,rel_key) VALUES (1,2,'y','known');
	
	insert ignore into {$prefix}relationships (subject_id,skill_id,rel_active,rel_key) VALUES (1,1,'y','psion');
	insert ignore into {$prefix}relationships (subject_id,skill_id,rel_active,rel_key) VALUES (1,2,'y','psion');
	insert ignore into {$prefix}relationships (subject_id,skill_id,rel_active,rel_key) VALUES (1,3,'y','psion');
	*/
	

	runQuery($tables,false,true);
	//runQuery($insert,false,true);
	
	//setOption('servers',1);
	/*
	setOption('max_background',1);
	setOption('max_ego',8);
	setOption('tax_sales',50);
	setOption('tax_income',10);
	setOPtion('tax_construct',10);
	*/
}
function setOption($key,$value){
	global $prefix;
	runQuery("insert into {$prefix}options (option_key,option_value)values('{$key}','{$value}') on duplicate key update option_value='{$value}';");	
}
?>