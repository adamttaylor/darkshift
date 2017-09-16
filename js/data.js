// JavaScript Document
//var base = 'http://localhost/darkshift/';
//base='http://darkshift.adamttaylor.com/'
var core = {'races':'','nations':'','active':[],'options':{}};
var w = 0;
var h = 0;
var ds = {};

var views = {};
ds.loggedInAsAdmin = false;
ds.loggedIn = false;
ds.currentConfig = {};
ds.recentScans = [];
ds.currentEvent = false;
//var track = {'action':'search-chars','char_id':CH.char_id,'edit_char_id':4,'pre':'none','post':'none2','info':'ham'};
ds.CH = {};
ds.DR = {};
ds.editCH = {};
ds.editCH2 = {};
ds.editTM = {};

ds.bread = [
	{'id':9999,'p':false,'label':'USERS',	'screen':'checkin', 'left':'-1', 'logout':true},
	{'id':0,'p':9999,'label':'MAIN PANEL',	'screen':'main', 'left':'0','logout':true},
	{'id':1,'p':0,'label':'SOURCE CODE',	'screen':'source-code', 'left':'1'},
		{'id':21,'p':1,'label':'BACKGROUNDS',	'screen':'edit-source', 'left':'2'},
		{'id':10,'p':1,'label':'INVENTORY',	'screen':'inventory', 'left':'2'},
			{'id':26,'p':10,'label':'DETAILS', 'screen':'inventory-details', 'left':'3'},
			{'id':11,'p':10,'label':'FRAGMENTS',	'screen':'frag-scanner', 'left':'3'},
		{'id':2,'p':1,'label':'SELECT CONFIG',	'screen':'config', 'left':'2'},
			{'id':6,'p':2,'label':'EDIT CONFIG',	'screen':'edit-config', 'left':'3'},
				{'id':7,'p':6,'label':'DETAILS',	'screen':'details', 'left':'3'},
				{'id':8,'p':6,'label':'SLEEVE CARD','screen':'card', 'left':'3'},
				{'id':9,'p':6,'label':'DETAILS',	'screen':'config-race', 'left':'3'},
		{'id':14,'p':1,'label':'KNOWN SKLLS',	'screen':'known', 'left':'2'},
			{'id':15,'p':14,'label':'DETAILS',	'screen':'known-details', 'left':'3'},
		{'id':16,'p':1,'label':'SLEEVES',	'screen':'sleeve-list', 'left':'2'},
		{'id':40,'p':1,'label':'VIEW TEAM',	'screen':'view-team', 'left':'2'},
		{'id':43,'p':1,'label':'ACTIVITY',	'screen':'ind-activity', 'left':'2'},
	{'id':3,'p':0,'label':'RE-SLEEVE', 'screen':'re-sleeve','left':'1'},
	{'id':28,'p':0,'label':'PSYCHOLOGY', 'screen':'psycho', 'left':'1'},
		{'id':29,'p':28,'label':'THERAPY', 'screen':'psycho-skill', 'left':'2'},
			{'id':30,'p':29,'label':'SESSION', 'screen':'psych-process', 'left':'3'},
				{'id':31,'p':30,'label':'BUYER', 'screen':'psycho-buyer', 'left':'4'},			
	{'id':17,'p':0,'label':'FABRICATOR', 'screen':'fabricator', 'left':'1'},
		{'id':18,'p':17,'label':'DETAILS', 'screen':'fabricator-details', 'left':'2'},
	{'id':27,'p':0,'label':'MARKETPLACE', 'screen':'marketplace', 'left':'1'},
		{'id':28,'p':27,'label':'DETAILS', 'screen':'market-details', 'left':'2'},
	{'id':5,'p':0,'label':'MAINTENANCE', 'screen':'maintenance', 'left':'1'},
	{'id':32,'p':0,'label':'MISSIONS', 'screen':'missions', 'left':'1'},
		{'id':35,'p':32,'label':'DESTINATION', 'screen':'destination', 'left':'2'},
			{'id':36,'p':35,'label':'LONG RANGE SCAN', 'screen':'long-range-scan', 'left':'3'},
			{'id':37,'p':35,'label':'END MISSION', 'screen':'mission-end', 'left':'3'},
	{'id':12,'p':0,'label':'ADMIN', 'screen':'admin', 'left':'1','admin':true},
		{'id':13,'p':12,'label':'QR Codes',	'screen':'admin-scanner', 'left':'2','admin':true},
		{'id':19,'p':12,'label':'OPTIONS', 'screen':'gameops', 'left':'2','admin':true},
		{'id':20,'p':12,'label':'ADD USER', 'screen':'adduser', 'left':'2','admin':true},
		{'id':41,'p':12,'label':'ADD TEAM', 'screen':'addteam', 'left':'2','admin':true},
		{'id':22,'p':12,'label':'CHARACTERS', 'screen':'admin-charlist', 'left':'2','admin':true},
			{'id':23,'p':22,'label':'ADMIN CHARACTER', 'screen':'admin-char-panel', 'left':'3','admin':true},
				{'id':24,'p':23,'label':'EDIT CHARACTER', 'screen':'admin-editchar', 'left':'4','admin':true},
				{'id':41,'p':23,'label':'EDIT TEAM', 'screen':'admin-editteam', 'left':'4','admin':true},
				{'id':25,'p':23,'label':'BLUEPRINT', 'screen':'admin-blueprint', 'left':'4','admin':true},
				{'id':39,'p':23,'label':'EDIT EQUIPMENT', 'screen':'admin-editequip', 'left':'4','admin':true},
		{'id':33,'p':12,'label':'Asteroids', 'screen':'admin-asteroid', 'left':'2','admin':true},
			{'id':34,'p':33,'label':'Create Mission', 'screen':'create-asteroid', 'left':'3','admin':true},
		{'id':38,'p':12,'label':'Mod Queue', 'screen':'mods', 'left':'2','admin':true},
			{'id':42,'p':38,'label':'MOD', 'screen':'amod', 'left':'3','admin':true},
		{'id':39,'p':12,'label':'Activity', 'screen':'all-activity', 'left':'2','admin':true},
];
//var configlist = [];

var roomlist = [
	{'id':0,'label':'Unity Park'},
	{'id':1,'label':'Resleeving Chamber'},
	{'id':2,'label':'Cryogenic Storage'},
	{'id':3,'label':'Docking Bay'},
	{'id':4,'label':'Corridor'},
	{'id':5,'label':'Server Farm'},
	{'id':6,'label':'Residential'},
	{'id':7,'label':'Solar Panel'},
	{'id':8,'label':'Sensor Array'},
	{'id':9,'label':'Administrative Offices'},
	{'id':10,'label':'Supernal Embassy'},
	{'id':11,'label':'Heradoic Embassy'},
	{'id':12,'label':'Chandal Embassy'},
	{'id':13,'label':'Banausic Embassy'},
	{'id':14,'label':'Coalition Embassy'},
	{'id':15,'label':'Refinery'},
	{'id':16,'label':'Data Center'},
	{'id':17,'label':'Drydock'},
	{'id':18,'label':'Training Facility'},
	{'id':19,'label':'Darkshift Relay'},
	{'id':20,'label':'Nuclear Reactor'},
	{'id':21,'label':'Medical'},
	{'id':22,'label':'Security Center'} 
];


var hologram = {'eq_id':-1,'id':-1,'image':"",'name':"Hologram",'owner':"Station",'rarity':"A",'rel_key':"gear",'rules':"",'single':"Sleeve",'skill':"2",'skill_id':-1,'skillstr':"Biomedical",'sort':0,'special':"hologram",'type':"12",'typestr':"sleeves"};
var trait_cats = ['Tolerence','Discipline','Cunning']
var psionic_cats = [
	{'id':1,'name':'Telepath','background':'tele','description':'Telepaths deal directly with the power of the mind. Their powers allow them to adjust the thoughts of their victims from a distance.'},
	{'id':2,'name':'Biomorph','background':'bio','description':'Biomorphs turn their powers inwards. They exert an unprecedented level of control over their physical form.'},
	{'id':3,'name':'Technomancer','background':'tech','description':'Technomancers have the ability to intuitively understand machinery with nothing more than a touch. Their ability to understand and work with mechanical devices is unparalleled.'},
	{'id':4,'name':'Telemorph','background':'tel,bio','description':'The telemorph is a master of both body and mind. They use their powers to change themselves and others in ways not possible to other psions.'},
	{'id':5,'name':'Technopath','background':'tel,tech','description':'Technopaths combine a Telepath\'s ability to project thoughts with the Technomancer\'s mastery of machines. This allows them to control computers and other more complex devices at a distance with little more than a thought.'},
	{'id':6,'name':'Biomancer','background':'bio,tech','description':'Biomancers combine a Biomorph\'s shapeshifting prowess with the Technomancer\'s mastery of machines. This allows them to merge bodily with technological items, as well as alter the shape and function of their gear.'},
	{'id':7,'name':'Meta Psion','background':'tel,tech,bio','description':'Meta Psions touch on darkspace much more closely than other Psionicists. This gives them a much broader and deeper range of powers while occasionally inspiring fear in those around them. Unfortunately this greater access to power comes at a much more significant cost in bodily health.'}
]
var skill_cats =[
	{'id':1,'name':'Firearms'},
	{'id':2,'name':'Explosives'},
	{'id':3,'name':'Melee'},
	{'id':4,'name':'Armor'},
	{'id':5,'name':'Medicine'},
	{'id':6,'name':'Energy Field Modulation'},
	{'id':7,'name':'Science'},
	{'id':8,'name':'Leadership','description':'These skills focus on providing leadership and support to a team. They are delivered by voice, and as such, if a team member does not hear the effect delivery, they do not receive the benefit of the effect.'},
	{'id':9,'name':'Technical Skills'}
]
var equip_types = [
	{'id':0,'name':'Batteries','single':'Battery'},
	{'id':1,'name':'Tools'},//supliment => battery y/n, special => equipment req
	{'id':2,'name':'Field Generators'},//supliment => battery y/n, special => equipment req
	{'id':3,'name':'Sensors'},//supliment => battery y/n, special => equipment req
	{'id':4,'name':'Survival Gear'}, //special => equipment req
	{'id':5,'name':'Computer Chassis'},//special => equipment req
	{'id':6,'name':'Computer Modules'},//special => equipment req
	{'id':7,'name':'Drones'},
	{'id':8,'name':'Weapon Chassis', 'description':'Weapons must be constructed using 1 Chassis, 1 Battery, and any number of modules. Once created the properties of the gun are fixed.'},//supliment => battery y/n
	{'id':9,'name':'Weapon Modules'},//Equipment types
	{'id':10,'name':'Armor Chassis'},//supliment => battery y/n
	{'id':11,'name':'Armor Modules'},
	{'id':12,'name':'Sleeves', 'description':'Sleeves are the base bodies used by characters. Each one lists a minimum tolerance cost that must be met in order to equip that sleeve. The sleeve takes up a number of Tolerance Slots equal to its minimum tolerance requirement.'},//special => HP
	{'id':13,'name':'GeneMods', 'description':'Gene Mods can be installed into any non-robot sleeve. Each enhancement takes up one Tolerance Slot.'},
	{'id':14,'name':'Medical Chassis'},
	{'id':15,'name':'Medical Modules'},
	{'id':16,'name':'Cyberware'},
	{'id':17,'name':'Pharmaceutical'},
	{'id':18,'name':'Chemical'}
]
//Blueprint Template to blueprint conversion takes: C: 10, U: 20, R: 30
var equip_skills = [
	{'id':0,'name':'Basic Engeneering','short':'Basic','frag':'basic_frag','except':'basic','types':[0,1,2,3,4,5,6,7]},
	{'id':1,'name':'Tactical Engineering','short':'Tactical','frag':'tactical_frag','except':'tactical','types':[8,9,10,11]},
	{'id':2,'name':'Biomedical Engineering','short':'Biomedical','frag':'biomedical_frag','except':'biomed','types':[12,13,14,15]},
	{'id':3,'name':'Cybernetic Engineering','short':'Cybernetic','frag':'cybernetic_frag','except':'cyber','types':[12,16]},
	{'id':4,'name':'Chemical Engeneering','short':'Chemical','frag':'chemical_frag','except':'chem','types':[17,18]}
]
var trauma_chart = [	
	{'id':0, 'dp':0,'tp':0,'cp':0,'label':'Unknown error: See Maintenance Staff'},
	{'id':1, 'dp':0,'tp':0,'cp':0,'label':'Roleplay Restriction: May only speak lies'},
	{'id':2, 'dp':0,'tp':0,'cp':0,'label':'Roleplay Restriction: May only speak the truth'},
	{'id':3, 'dp':0,'tp':0,'cp':0,'label':'Roleplay Restriction: May not speak'},
	{'id':4, 'dp':0,'tp':0,'cp':0,'label':'Roleplay Restriction: ','messages':['Always Paranoid','Someone is behind you', 'They are coming', 'Nobody is your friend', 'Everyone hates you.', 'He wants to kill you', 'You will die in your sleep tonight.', 'Everything here is dangerous.', 'Everyone is out to get you.', 'LOOK OUT!']},
	{'id':5, 'dp':0,'tp':0,'cp':0,'label':'Roleplay Restriction: Fear of the dark','messages':['The night is full of horrors.', 'You want to become a VIRC? Darkness is how you become VIRC.', 'The darkness of the Void itself.', 'The void is all consuming and hungry.', 'The darkness is coming', 'Its...so...dark', 'Monsters...in the shadows']},
	{'id':6, 'dp':0,'tp':0,'cp':0,'label':'Roleplay Restriction: Fear of weapons','messages':['Everything is sharp and deadly!','Weapons are instruments of Pain','That gun could go off accidentally','Weapons have a mind of their own','You might hurt someone','You WILL hurt someone','BANG BANG BANG','When you think about it, a surgical blade and a weapon\'s edge are the same.']},
	{'id':7, 'dp':0,'tp':0,'cp':0,'label':'Roleplay Restriction: Hyper aggression', 'messages': ['MAN UP','RAAAAAARRRWWWWW', 'FIGHT!','KIIIIIILLLLL',"GET 'Em", 'There will be blood!!!!','Get out of my way']},
	{'id':8, 'dp':0,'tp':0,'cp':0,'label':'Roleplay Restriction: Extreme timidity','messages':['There\'s so many people here', 'Stay quiet. Quiet is safe.', 'WHAT WAS THAT?!?!', 'It\'s best to avoid wide open spaces', 'Avoid being seen-Station is full of Predators.', 'Everything is dangerous.', 'Noone look at me.', 'It’s too loud.']},
	{'id':9, 'dp':0,'tp':0,'cp':0,'label':'Roleplay Restriction: Extreme gullibility','messages':['Of course that\'s true!','Yes, yes, that\'s all correct.','Did you hear? Hamilton says, so it must be true.','Nobody will lie to you.','Click here for 100 free energy','Congratulations you’ve won!','All skills removed. Have a nice day.']},
	{'id':10,'dp':'*','tp':'*','cp':'*','label':'Ego Pool Modification: TP, DP. CP reduced to zero'},
	{'id':11,'dp':0,'tp':-1,'cp':0,'label':'Ego Pool Modification: -1 TP'},
	{'id':12,'dp':-1,'tp':0,'cp':0,'label':'Ego Pool Modification: -1 DP'},
	{'id':13,'dp':0,'tp':0,'cp':-1,'label':'Ego Pool Modification: -1 CP'},
	{'id':14,'dp':-1,'tp':-1,'cp':-1,'label':'Ego Pool Modification: -1 TP, -1 DP, -1 CP'},
	{'id':15,'dp':0,'tp':0,'cp':0,'label':'No Penalty'},
	{'id':16,'dp':0,'tp':0,'cp':0,'label':'No Penalty'},
	{'id':17,'dp':0,'tp':1,'cp':0,'label':'Ego Pool Modification: +1 TP'},
	{'id':18,'dp':1,'tp':0,'cp':0,'label':'Ego Pool Modification: +1 DP'},
	{'id':19,'dp':0,'tp':0,'cp':1,'label':'Ego Pool Modification: +1 CP'},

]
var idleTime = 0;
var idleInterval = false

//For circumventing vue
function cleanCopy(obj){
	return JSON.parse(JSON.stringify(obj));
}
function fixInt(i){
	i = i+''
	var ind = i.indexOf('.')+1
	var sub = i.substr(ind,1);
	i = sub =='0'? parseFloat(i).toFixed(1)/1 : parseFloat(i).toFixed(1)/1
	return isNaN(i)? 0 : i;
}
function getTaxCost(val,type){
	type = type? type : 's';
	val = fixInt(val);
	var taxPercent = 0;
	var tax = 0;
	if(val > 0){
		switch(type){
			case 'sales':
			case 's':
			case 'sale':
			taxPercent = fixInt(core.options.tax_sales)
			break;
			
			case 'con':
			case 'sonstruct':
			case 'c':
			case 'construction':
			taxPercent = fixInt(core.options.tax_construct)
			break;
			
			default:
			taxPercent = fixInt(core.options.tax_income)
		}
		tax = taxPercent * val * .01;
		tax = fixInt(tax)
		if(isNaN(tax))tax = 0;
	}
	return tax;
}
function getTrauma(){
	var i = Math.floor(Math.random()*20)
	return trauma_chart[i]
}
function loadTrauma(id,send){
	mainQuery({
		data:{'char_id': id,'method':'loadTrauma'},
		success: function(html){
			if(send) send(html);
		}
	})
}
function createAsteroid(obj,send){
	obj.method = 'createAsteroid';
	mainQuery({
		data: obj,
		success: function(html){
			if(send) send(html);
		}
	})
}
function detectIdle() {
	clearInterval(idleInterval);
	if(core.options.gamemode==='true' || core.options.gamemode===true){
	    //Increment the idle time counter every minute.
	    idleInterval = setInterval(timerIncrement, 60000); // 1 minute
	
	    //Zero the idle timer on mouse movement.
	    $(this).mousemove(function (e) {
	        idleTime = 0;
	    });
	    $(this).keypress(function (e) {
	        idleTime = 0;
	    });
		$(this).bind('touchmove',function(e){
			idleTime = 0;
		});
		$(this).bind('touchstart',function(e){
			idleTime = 0;
		});
		$(this).bind('touchend',function(e){
			idleTime = 0;
		});
		$(this).bind('touchcancel',function(e){
			idleTime = 0;
		});
	}
};
function timerIncrement() {
	idleTime = idleTime + 1;
    if (idleTime > 5) { // 20 minutes
	    clearInterval(idleInterval);
	    if(!localStorage['personalDevice']){
    		logout();
    	}
    }
}
function personalizeGear(h, char) {
	h = extendDataFromCache(h, h.eq_id, h.rel_key)
    h.count = 0;
    h.cost = fixInt(h.cost);
    h.sellable = true;
    var idz = [char.char_id+''];
    _.each(char.teams,function(ch){
	    idz.push(ch.char_id+'')
    })
    //if the user is an admin of the
    if(char.char_id+'' == h.char_id+''){
	    h.owned = true;
    }
    _.each(char.teams,function(t){
	    if(h.char_id+''==t.char_id+''){
		    h.owned = true;
		    h.team = true;
		    if(h.rel_key=='blue'||h.rel_key=='temp'){
			    h.sellable = t.isAdmin;
		    }
	    }
    })
    switch (h.rarity) {
        case 'C':
            h.fragcost = 10;
            h.deconstruct = 4;
            break;

        case 'U':
            h.fragcost = 20;
            h.deconstruct = 8;
            break;

        case 'R':
            h.fragcost = 30;
            h.deconstruct = 12;
            break;
    }
    
    if (h.market) {
        var info = h.market.split(':');
        if (info[0] == 's') {
            h.sell = true
        } else {
            h.rent = true
        }
        h.market = info[1];
    } else {
        h.market = 0;
    }
    if (h.rel_info) {
        h.progress = fixInt(h.rel_info)
        h.percent = Math.ceil((h.progress / h.fragcost) * 100)
    }
    if (h.rel_key == 'temp') {
        h.info = h.info ? h.info : "0";
        h.template = true;
    }
	return h;
}
function marketGear(h,purpose){
	var tax = fixInt(core.options.tax_sales);
	var ctax = fixInt(core.options.tax_construct);
	h.tax = 0;
	if(ds.CH.exceptions.criminal){
		tax = 0;
		ctax = 0;
	}
	
	var salesnum = Math.floor(fixInt(h.cost) * ctax/10)/10;
	var buildcost = Math.floor()
	
	h.market = fixInt(h.market)
	h.cost = fixInt(h.cost)
	h.total = 0;
	h.salestax =  Math.floor(h.market * tax/10)/10;
	h.contax   =  Math.floor(h.cost * ctax/10)/10;
	h.taxcost = h.salestax + h.contax;
	if(ds.CH.exceptions.prodigy) {
		h.cost = h.cost - (h.cost/10)
	}
	h.requiredSkill = equip_skills[h.skill].name;
	if(purpose == 'build' && h.rent && !h.owned){
		//BUILD: FOR RENT:    cost + contax + market + sales
		//h.total = h.cost + h.contax + h.market + h.salestax;
		h.total =h.cost + h.contax + h.market;
		var ex = equip_skills[h.skill].except;
		if(ds.CH.exceptions[ex]){
			h.hasSkill = true;
		}
	}else if(purpose == 'build'){
		//BUILD: OPEN BUILD:  cost + contax
		//BUILD: OWNED BUILD: cost + contax
		h.total = h.cost + h.contax;
		h.total = Math.floor(h.total * 10)/10;
		var ex = equip_skills[h.skill].except
		if(ds.CH.exceptions[ex]) {
			h.hasSkill = true;
		}
	}else if(h.sell){
		//OWNED SELL:  market + salestax
		//OTHER SELL:        market + salestax
		h.total = h.market + h.salestax;
	}else{
		//OWNED off market 
		h.total = 0//'N/A';	
	}
	h.total = fixInt(h.total)
	if(h.total > ds.CH.energy && !h.template) h.tooMuch = true;
	if(h.owned && purpose != 'build') h.tooMuch = false;
	var gr = _.filter(ds.CH.gear,function(g){
		var matchGear = g.id == h.id
		var matchChar = g.char_id == h.char_id;
		var matchvis  = g.visible == h.visible;
		return matchGear && matchChar && matchvis;
	})
	if(gr) h.count = gr.length;
	h.toolbox = h.template? 'template' : 'blueprint';
	h.toolbox += '_'+purpose
	
	//check to see if the user has the correct skill
	
	
	if(h.owned){
		h.toolbox+='_owned'	
	}else if(h.rarity=='A'){
		h.toolbox+='_open';	
	}else if(h.sell){
		h.toolbox+='_sell';	
	}else if(h.rent){
		h.toolbox+='_rent';	
				
	}
	h.characters = core.active;
	return h;				
}
function getBuildable(char,send){
	//Get Rentable, owned and station
	if(char.hasOwnProperty('buildable') && char.buildable){
		send()
	}else{
		var ids = [char.char_id+'']
		_.each(ds.CH.teams,function(ch){
			ids.push(ch.char_id+'')
		})
		mainQuery({
			data:{'char_id':ids.join(','),'method':'getBlueprints'},
			success: function(html){
				char.buildable = _.each(html,function(h){
					h = personalizeGear(h,char)
				})
				char.buildable = _.filter(char.buildable,function(h){
					//return h.char_id == char.char_id || (h.rent && (h.visible == char.char_id+'' ||  h.visible == '*') );
					return _.contains(ids, h.char_id+'') || (h.rent && ( _.contains(ids,h.visible+'' ) ||  h.visible == '*') );
				})
				char.buildable = _.reject(char.buildable,function(e){
					return e.rarity == 'A';
				})
				var station = _.filter(core.equipment,function(e){
					return e.rarity == 'A';
				})
				station = JSON.parse(JSON.stringify(station))
				char.buildable = char.buildable.concat(station)
				char.buildable = _.sortBy(char.buildable,function(ii){
					return (ii.rel_key == 'temp'?'0':'1')+ii.sort+ii.cost+ii.name;
				})
				char.buildable = _.each(char.buildable,function(i){
					i = marketGear(i,'build')
				})
				var top = JSON.parse(JSON.stringify(equip_skills))
				_.each(top,function(t){
					t.items = _.filter(char.buildable,function(m){
						return m.skill == t.id
					})
				});
				char.buildable = top;
				send()	
			}
		})
	}
}
function getMarketPlace(char,send){
	//get owned and for sale
	if(char.marketplace){
		if(send)send()
	}else{
		var ids = [char.char_id];
		_.each(char.teams,function(t){
			ids.push(t.char_id)
		})
		mainQuery({
			data:{'char_id':ids.join(','),'method':'getMarketPlace'},
			success: function(html){
				_.each(html,function(h){
					h = personalizeGear(h,char)
				})
				
				
				var market = html
				market = _.sortBy(market,function(ii){
					var st = ii.rel_key == 'temp'? '0' : '1'
					if(ii.rel_key=='gear') st = '2';
					return st+ii.sort+ii.cost+ii.name;
				})
				market = _.reject(market,function(r){
					return r.rel_info == 'equip';
				})
				var unownedMods = []
				market = _.each(market,function(i){
					i = marketGear(i,'market')
					i.modstr = modsTo(i.module,'string')
					i.modstr = $.trim(i.modstr)
					i.rel_id = i.gear_id
					var un = i.modstr.split(',')
					un = _.filter(un,function(m){
						return $.isNumeric(m)
					})
					unownedMods = unownedMods.concat(un)//Id that are not owned by the logged in user
					
				})
				if(unownedMods.length>0){
					mainQuery({
						data:{'gear_id':unownedMods.join(','),'method':'otherMods'},
						success: function(html){
							market = _.each(market,function(i){
								_.each(html,function(h){
									var middle = new RegExp(h.rel_id+',',"g");
									var end = new RegExp(h.rel_id+'$',"g");
									i.modstr = i.modstr.replace(middle,h.name+',')
									i.modstr = i.modstr.replace(end,h.name)
								})
							})
							LastCall()
						}
					})
				}else{
					LastCall()
				}
				
								
				function LastCall(){
					//sleeves, gearz, modz
					//char.marketplace = market
					char.marketplace = consolodateGear(market)
					//char.marketplace = market
					_.each(char.marketplace,function(f){
						switch(f.rel_key){
							case 'blue':
							f.message = 'Blueprint';
							break;
							
							case 'temp':
							f.message = 'Template';
							break;
							
							default:
							f.message ='Item';
						}
					})
					if(send)send()	
				}
				
			}
		})
	}
}
function lootByValue(val,send){
	mainQuery({
		data:{'qr_value':val,'method':'lootByValue'},
		success: send
	})
}
function assignBluePrint(cid,bid,type,track,send){
	mainQuery({
		data:{'method':'addBlueprint','char_id':cid,'eq_id':bid,'type':type,'track':track},
		success: send
	})
}
function claimLoot(val,send){
	mainQuery({
		data:{'qr_value':val,'method':'claimLoot'},
		success: send
	})
}
function deClaimLoot(val,send){
	mainQuery({
		data:{'qr_value':val,'method':'deClaimLoot'},
		success: send
	})
}
function saveRelation(data,send){
	if(typeof data =='string') data = JSON.parse(data);
	mainQuery({
		data:{'method':'saveRelations','relation':data},
		success:function(html){
			if(send) send()	
		}
	});
}
function newConfig(data,send){
	data.method = 'newConfig'
	mainQuery({
		data:data,
		success:function(html){
			data.skill = data.hasOwnProperty('skill') && typeof data.skill == 'string'? JSON.parse(data.skill) : [];
			delete data.method;
			data.config_id = html
			var d = new Date()
			data.last_edit = d.getFullYear()+'-'+''+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
			ds.CH.configs.push(data);
			currentConfig = data;
			$('.edit-config.screen [data-config-id]').attr('data-config-id',data.config_id)
			$('.edit-config.screen #known.relationbox').attr('data-subject',data.config_id)
			$('.edit-config.screen [name=edit-config]').val('true')
			$('.edit-config.screen .last-edit').text(data.last_edit)
			evalEgo();
			buildConfigs();
			if(send) send()	
		}
	});
}
function saveConfigDB(data,send){
	data.method = 'saveConfig'
	mainQuery({
		data:data,
		success:function(html){
			if(send) send()	
		}
	});
}
function updateCharacter(data,send){
	mainQuery({
		data:{'method':'updateCharacter','data':data},
		success: function(html){
			//buildChar();
			if(send)send()
		}
	})	
}
function setGameMode(mode){
	core.options.gamemode = mode;
	mainQuery({data:{'mode':mode+'','method':'setGameMode'},success:function(html){
		message('GAMEMODE updated',false,true);
		if(core.options.gamemode) buildCheckin();
	},error:function(err){
		log(err)
		message('Server Error: Could Not Set gamemode')	
	}})	
}
function saveOptions(data,track,send){
	//var sd = {'method':'saveOptions','data':data};
	var sd = {
		data:{'method':'saveOptions','data':data},
		success: function(html){
			core.options = _.extend(core.options,data);
			buildChar();
			if(send)send()
		}
	}
	if(track) sd.data.track = track;
	
	mainQuery(sd)
}
function saveUserDB(data,send){
	mainQuery({
		data:{'method':'saveUser','data':data},
		success: function(html){
			if(send)send()
		}
	})
}
function updateEgoPools(){
	mainQuery({
		data:{'method':'updatePools','char_id':ds.CH.char_id,'cunning':ds.CH.ego_cunning,'discipline':ds.CH.ego_discipline,'tolerence':ds.CH.ego_tolerence},
		success: function(html){
			message('Ego Pools updated',false,true)
			buildInventory();
		}
	})
}
function getOptions(send){
	mainQuery({
		data:{'method':'getOptions'},
		success: function(html){
			var obj = {};
			_.each(html,function(p){
				obj[p.option_key] = p.option_value;
			})
			core.options =_.defaults(obj, {cryo_count:0, gamemode:false, max_background:0, max_ego:0, station_energy:0, tax_construct:0, tax_income:0, tax_sales:0});
			if(send)send()
		},
		error: function(){
			if(send) send()
			message('Server Error: Could Not Get options')	
		}
	})	
}
function checkInChar(ch){
	var cookie = getCookie('ds_onsite')
	//if(core.options.gamemode && (cookie && cookie=='true')){
	if(core.options.gamemode){
		//coneole.log('CHECK IN CHAR')
		mainQuery({
			data:{'method':'checkin','char_id':ch[0].char_id,'event_id':ds.currentEvent.event_id},
			success: function(html){
				var f = _.find(core.active,function(a){
					return a.char_id == ds.CH.char_id
				})
				if(!f){
					ds.CH.loggedIn = 'true';
					core.active.push(ds.CH)
					core.active = _.sortBy(core.active,'char_name')
				}
				ds.CH.event.push(html[0])
				checkAllowance();
				//screenHtml('checkin',tmp.checkin({characters:core.active}))
				message('You have been checked in.');
			},
			error: function(err){
				log(err)
				message('Server Error: Not Checked in')	
			}
		})
	}
}
function allTeams(send){
	mainQuery({
		data:{'method':'simpleTeams'},
		success: function(html){
			core.teams = html
			if(send)send()
		}
	})	
}
function getTolerencePsionics(){
	return _.filter(ds.CH.psion,function(p){
		if(p.attr.length>1){
			return p.info+''=='0';
		}else{
			return p.attr[0].id+'' == '0';	
		}
	})
}
function activeChars(send){
	mainQuery({
		data:{'method':'activeCharacters','event_id':ds.currentEvent.event_id},
		success: function(html){
			_.each(html,function(e){
				e.loggedIn = '';	
			})
			core.active = html
			
			core.active = _.sortBy(core.active,'char_name')
			if(send)send()
		}
	})	
}
function thisEvent(send){
	mainQuery({
		data:{'method':'thisevent'},
		success: function(html){
			if(html.length) ds.currentEvent = html[0]
			if(send)send()
		}
	})
}
function checkPass(un,pass,send){
	mainQuery({
		data:{'user':un,'method':'login'},
		success: function(html){
			var up = html.length > 0? html[0].user_pass :false
			if(up.length> 0 && up == pass){
				send(html[0]);	
			}else{
				send(2);
			}
		},error: function(err){
			log(err)
			send(1);
		}
	})
}
function checkCharPass(id,pass,send){
	mainQuery({
		data:{'char_id':id,'method':'loginChar'},
		success: function(html){
			var up = html.length > 0? html[0].user_pass :false
			if(up.length> 0 && up == pass){
				user = html[0]
				send(html[0]);	
			}else{
				send(2);
			}
		},error: function(err){
			log(err)
			send(1);
		}
	})
}
function getCharacter(id,send){
	mainQuery({
		data:{'char_id':id,'method':'characterList'},
		success: function(html){
			html = mapFullCharacter(html)
			send(html)
		}
	})
}
function miltiCharTest(){
	mainQuery({
		data:{'method':'characterList'},
		success: function(html){
			html = mapFullCharacter(html)
			send(html)
		}
	})
}
function mapFullCharacter(data){
	var init = data[0]
	var initCols = ['user_id','user_level','user_name','user_pass','fullname','first_name','last_name','char_id','char_name','birth_race','nation','ego','go_cunning','ego_tolerence','ego_discipline','energy','basic_frag','tactical_frag','biomedical_frag','cybernetic_frag','chemical_frag'] 
	var init = _.pick(init,initCols);
	var grp = _.groupBy(data,'char_id');
	var newData = [];
	
	//Each Character
	_.each(_.keys(grp),function(k){
		var relCols = ['skill_id','rel_active','rel_info','rel_key','unique_info','rel_id','battery','module']//rel_id
		var index = _.omit(grp[k][0],relCols);
		var fill = _.filter(grp[k],function(obj){
			return obj.rel_active && obj.rel_active.toLowerCase() == 'y';
		})
		var relatives = _.map(fill,function(rel){
			var start = _.pick(rel,relCols);
			return extendDataFromCache(start,start.skill_id,start.rel_key)
		})
		var meta = _.groupBy(relatives,'rel_key')
		delete meta.null;
		
		index = _.extend(index,meta);
		index = _.defaults(index,{'skill':[]});
		newData.push(index);
	})
	
	newData =_.sortBy(newData,function(s){
		return s.char_name;
	})
	return newData;
}
function getAttrClass(info){
	var str = '';
	switch(info){
		case 0:
		case '0':
		str="three";
		break;
					
		case 1:
		case '1':
		str="two";
		break;
				
		case 2:
		case '2':
		str="one";
		break;
	}
	return str;
}
function getPools(ch){
	var pools = {};
	pools.cp = Math.floor(ch.ego_cunning/2);
	pools.dp = Math.floor(ch.ego_discipline/2);
	pools.tp = Math.floor(ch.ego_tolerence/2);
	if(ch.exceptions['nation-preservation']){
		pools.tp+=1;
	}
	if(ch.exceptions['nation-heradoic']){
		pools.dp+=1;
		pools.cp = Math.max(pools.cp-1,0);
	}
	if(ch.exceptions['nation-chandal']){
		pools.cp+=1;
		pools.dp = Math.max(pools.dp-1,0);
	}
	if(ch.exceptions['nation-banausic_exemplar'] || ch.exceptions['nation-banausic_exemplar']==0){
		switch(	ch.exceptions['nation-banausic_exemplar']){
			case 0:
			case '0':
			pools.tp = pools.tp * 2 
			break;
			
			case 1:
			case '1':
			pools.dp = pools.dp * 2
			break;
			
			case 2:
			case '2':
			pools.cp = pools.cp * 2
			break;	
		}
	}
	if(ds.CH.current_sleeve && ds.CH.current_sleeve.name.toLowerCase()=='aurani'){
		var fil = _.filter(ds.CH.current_sleeve.module,function(m){
			return (typeof m != 'string') && m.type+'' == '16';
		})
		pools.tp = pools.tp - fil.length
		pools.tp = Math.max(pools.tp,0)
	}
	return pools;
}
function parseEgoLoss(ch,send){
	ch.pools         = getPools(ch)
	var maxAttr      = Math.max(ch.pools.cp,ch.pools.dp,ch.pools.tp)
	loadTrauma(ch.char_id,function(html){
		ch.trauma = _.map(html,function(h){
			return extendDataFromCache(h,h.ref_id,'trauma')
		})
		ch.trauma.reverse();
		
		//next tally the ego
		_.each(ch.trauma,function(t){
			if(t.cp=='*'){
				ch.pools.tp = 0;
				ch.pools.dp = 0;
				ch.pools.cp = 0
			}else{			
				ch.pools.tp +=t.tp;
				ch.pools.dp +=t.dp;
				ch.pools.cp +=t.cp
			}
		})
		ch.pools.tp = Math.max(ch.pools.tp,0);
		ch.pools.dp = Math.max(ch.pools.dp,0);
		ch.pools.cp = Math.max(ch.pools.cp,0);
		ch.penalty  = maxAttr - Math.max(ch.pools.cp,ch.pools.dp,ch.pools.tp)
		ch.ego_loss = ch.penalty/maxAttr*100
		if(send) send()
	})
}
function formatChar(ch){
	ch.exceptions = {}
	ch.free_bg		 = fixInt(ch.extra_bg)+ fixInt(core.options.max_background);
	var blacklist = ['except','multi','psion','!ai']//Dont set these as exceptions
	
	if(ch.background){
		var bgArr = [];
		ch.background = extendRelation(ch.background,'background')
		_.each(ch.background,function(bg){
			bg.active = true;
			bg.info = bg.rel_info;
			var bnNUM = 1;
			if($.isNumeric(bg.info)){
				bg.info = fixInt(bg.info)
				if(bg.special && bg.special.indexOf('multi')!=-1){
					bnNUM=bg.info
				}
			}
			bgArr.push( (bnNUM>1)? bg.name+'x'+bnNUM :  bg.name );
			ch.free_bg = ch.free_bg - bnNUM	
		})
		var specials = findSpecial('*',ch.background)
		_.each(specials,function(s){
			var spec = _.difference(s.special.split(','),blacklist)
			spec = spec.join('_')
			var info = s.rel_info ? s.rel_info : true; 
			if($.isNumeric(info)) info = fixInt(info)
			ch.exceptions[spec] = info
		})
		ch.bglist = bgArr.join(', ')
	}
	
	ch.birth_obj = _.find(equip_types[12].items,function(eq){
		return ch.birth_race == eq.id;
	})
	ch.nation_object = _.find(core.nations,function(r){
		return r.id == ch.nation;
	})
	if(ch.birth_obj) {
		ch.birth_obj = _.extend({},ch.birth_obj,{static:true});
		if(ch.birth_obj.special == 'birth_ai' ){
			ch.alt_birth_sleeve = findSpecial('ai_sleeve',core.equipment,true);
			 
		}
		if(ch.birth_obj.special == 'birth-aurani' && ch.free_bg==0){
			//IF 
		}
	}
	if(ch.nation_object) {
		ch.nation_object = _.extend(ch.nation_object,{static:true});
	}
	if(ch.birth_obj){
		ch.birth_races = ch.birth_2  && ch.birth_2[0]?  [ch.birth_obj,ch.birth_2[0]] : [ch.birth_obj];
	}else{
		ch.birth_races = []	
	}
	if(ch.nation_object){
		ch.nations_on = ch.nation_2 && ch.nation_2[0]? [ch.nation_object,ch.nation_2[0]] : [ch.nation_object];
	}else{
		ch.nations_on =[]
	}
	
	ch.birth_races = _.map(ch.birth_races,function(br){
		ch.exceptions[br.special] = true
		return _.extend({},br,{'static':false,'acive':true});
	})
	ch.nations_on = _.map(ch.nations_on,function(no){
		ch.exceptions[no.special] = true
		return _.extend({},no,{'static':false,'acive':true});
	})
	ch.locked_bg = ch.free_bg < 1;
	if(ch.exceptions['birth-aurani']){
		var p = findSpecial('psion',ch.background)
		if(p.length){
			ch.free_bg+=1;//Adjust total for caclulating 
			//If the selected background is not psion need to flag 
			ch.locked_bg = ch.free_bg < 1;
		}else{
			ch.locked_bg = false;
		}
	}
	if(ch.exceptions['nation-banausic']){
		ds.CH.banausic = _.find(ch.known,function(k){
			return k.rel_info == 'banausic';
		})
	}
	if(ch.exceptions['nation-supernal']){
		ds.CH.supernal = _.find(ch.known,function(k){
			return k.rel_info == 'supernal';
		})
	}
	ch.max_ego		 = fixInt(core.options.max_ego)
	if(ch.exceptions.gift) ch.max_ego+=ch.exceptions.gift;
	ch.energy 		 = fixInt(ch.energy)
	ch.ego_cunning   = ch.ego_cunning? fixInt(ch.ego_cunning): 0;
	ch.ego_discipline= ch.ego_discipline? fixInt(ch.ego_discipline):0
	ch.ego_tolerence = ch.ego_tolerence? fixInt(ch.ego_tolerence):0
	//ch = parseEgoLoss(ch)
	ch.free_ego		 = ch.max_ego - (ch.ego_cunning + ch.ego_discipline + ch.ego_tolerence);
	ch.background	 = ch.background? ch.background : [];
	ch.max_bg		 = fixInt(core.options.max_background) + fixInt(ch.extra_bg);
	//if(ds.CH.exceptions['birth-aurani'] && findSpecial('psion',ds.CH.background).length > 0) ch.max_bg--
	
	ch.okbgs		 = ch.free_bg >0;
	ch.psion 		 = ch.hasOwnProperty('psion') ? ch.psion : [];
	ch.known 		 = ch.hasOwnProperty('known') ? ch.known : [];
	ch.learn 		 = ch.hasOwnProperty('learn') ? ch.learn : [];
	ch.learnp 		 = ch.hasOwnProperty('learnp') ? ch.learnp : [];
	_.each(ch.psion,function(p){
		p.on = true;
		p.info = p.rel_info;
		p.attr_class= getAttrClass(p.rel_info)
	});
	ch.psion = _.sortBy(ch.psion,function(p){
		return p.psi_category+p.psi_name;
	})
	ch.known = _.sortBy(ch.known,function(k){
		return k.sk_category+k.sk_name;
	})
	var ksp = _.compact(_.pluck(ch.known,'special'))
	var psp = _.compact(_.pluck(ch.psion,'special'))
	_.each(ksp,function(k){
		ch.exceptions[k] = true;
	})
	_.each(psp,function(k){
		ch.exceptions[k] = true;
	})
	ch.current_sleeve = currentSleeve(ch)
	return ch;
}

function consolodateGear(data){
	var gear = []
	if(data){
		data = JSON.parse(JSON.stringify(data))
		data = _.sortBy(data,function(d){
			return d.type+d.name;
		})
		_.each(data,function(d){
			if(d.info==null)d.info = '';
			var dchar = d.hasOwnProperty('char_id')? d.char_id : ds.CH.char_id;
			var f = _.find(gear,function(g){
				var matchGear = g.id+'' == d.id+''
				var matchChar = g.char_id+'' == d.char_id+'';
				var matchVis  = g.visible == d.visible;
				var matchBat = g.battery == d.battery
				var matchMod = g.module == d.module
				var matchInfo = g.rel_info == d.rel_info
				var matchMarket = g.market == d.market
				return matchGear && matchChar && matchVis && matchBat && matchMod && matchInfo	&& matchMarket			
			})
			if(f){
				f.count++
				f.rel_id = f.rel_id+','+d.rel_id
			}else{
				d.count = 1;
				gear.push(d)	
			}
		})
	}
	return gear;
}
function cryoCount(char){
	var fil = _.filter(char.gear,function(g){
		return g.skillstr == 'Biomedical' && g.typestr == 'sleeves' && g.rel_key=='gear' && g.rel_info == 'stored';
	})
	return fil.length;
}
function characterBioSleeves(char){
	return _.filter(char.gear,function(g){
		return g.skillstr == 'Biomedical' && g.typestr == 'sleeves' && g.rel_key=='gear';
	})
}
function currentSleeve(char){
	var f = _.find(char.gear,function(g){
		return g.typestr == 'sleeves' && g.rel_key=='gear' && g.rel_info == 'equip';
	})
	if(f && f.hasOwnProperty('module')){
		var mod = modsTo(f.module,'allobject')
		f.module = mod
	}
	var outcome =  f? f : hologram;
	$('.source-code-screen .field-group.sleeve label.value').text(outcome.name);
	setSkillSoft(char,outcome)
	return outcome;
}

function extendRelation(dat,key){
	dat = _.filter(dat,function(obj){
		return obj.rel_active.toLowerCase() == 'y';
	})
	var newData = [];
	_.each(dat,function(d){
		var sid = d.hasOwnProperty('skill_id')? d.skill_id : d.eq_id;
		d = extendDataFromCache(d,sid,key)
		newData.push(d)
	})
	return newData;
}
function extendDataFromCache(start,key,type){
	var cacheKey = [];
	if(type){
		switch(type.toLowerCase()){
			case 'nation_2':
			cacheKey = core.nations;
			compareKey = 'id';
			break;
			
			case 'birth_2':
			cacheKey = core.birth_races;
			compareKey = 'id';
			break;
			
			case 'known':
			case 'learn':
			case 'banausic':
			case 'supernal':
			cacheKey = core.skills;
			compareKey = 'sk_id';
			break;
			
			case 'psion':
			case 'learnp':
			cacheKey = core.psion;
			compareKey = 'psi_id';
			break;
			
			case 'skill':
			cacheKey = core.skills;
			compareKey = 'sk_id';
			break;
			
			case 'gear':
			case 'temp':
			case 'blue':
			case 'independant_mod':
			case 'experiment_mod':
			cacheKey = core.equipment;
			compareKey = 'id';
			break;
			
			case 'trauma':
			cacheKey = trauma_chart;
			compareKey = 'id';
			break;
			/*case 'equipment':
			cacheKey = core.equipment;
			compareKey = 'eq_id';
			break;*/
			
			case 'backgrounds':
			case 'background':
			cacheKey = core.backgrounds;
			compareKey = 'id';
			break;
			
			case 'races':
			cacheKey = core.races
			compareKey = 'rc_id';
			break;
			
			case 'characters':
			cacheKey = core.characters;
			compareKey = 'char_id';
			break;
		}
		if(cacheKey){
			var f = _.find(cacheKey,function(meta){
				return meta[compareKey]+'' == key+'';
			})
			if(f){
				var g = JSON.parse(JSON.stringify(f))
				start = _.extend(start,g);	
				return _.extend(start,{static:true,info:start.rel_info});
			}
		}
	}
	return start;	
	
}

function ingestQr(id,val,send){
	mainQuery({
		data:{'skill_id':id,'qr_value':val,'method':'ingestQr'},
		success: send
	})
}
function getConfigs(id,send){
	mainQuery({
		data:{'char_id':id,'method':'configList'},
		success: function(html){
			var con = _.groupBy(html,'config_id');
			var blackkey = ['rel_active','rel_id','rel_info','rel_key','skill_id','subject_id'];
			con = _.map(con,function(c){
				var m = mapFullCharacter(c)
				return m.length? m : c;
			})
			con = _.flatten(con);			
			con = _.map(con,function(c){
				return _.omit(c,blackkey);
			})
			send(con)
		}
	})	
}
function getUserCharacterList(user_id,send){
	mainQuery({
		data:{'user_id':user_id,'method':'simpleCharacterList'},
		success: function(html){
			send(html)
		}
	})
}
function getAllCharacters(){
	mainQuery({
		data:{'method':'allSimpleCharacters'},
		success: function(html){
			core.active = html;
			_.each(core.active,function(e){
				e.loggedIn = '';	
			})
			core.active = _.sortBy(core.active,'char_name')
		}
	})
}
function attName(att){
	return trait_cats[att];
}

function validStorageData(source){
	try{
		source = LZString.decompress(source)
		source = JSON.parse(source)
	}catch(err){
		source = false
	}
	if(source && source.hasOwnProperty('version') && source.hasOwnProperty('data')){
		if(parseInt(source.version) >= parseInt(core.options.data_version)){
			return source;
		}
	}
	return false;
}
function getDataFromLocal(name,dbcall,formatCall,callback){
	formatCall = typeof formatCall == 'function'? formatCall : function(dat){return dat};
	callback   = typeof callback == 'function'? callback : function(){};
	var source = validStorageData(localStorage['ds_'+name]);
	if(source){
		try{
			log('USE DATA: '+name)
			core[name] = source.data;
			callback(source.data)
		}catch(err){
			log('CATCH: can"t use')
			getDataFromSql(name,dbcall,formatCall,callback);
		}
	}else{
		log('NO SOURCE FOR: '+name)
		getDataFromSql(name,dbcall,formatCall,callback)
	}
}
function getDataFromSql(name,dbcall,formatCall,callback){
	formatCall = typeof formatCall == 'function'? formatCall : function(dat){return dat};
	callback   = typeof callback == 'function'? callback : function(){};
	mainQuery({
		data:{'method':dbcall},
		success: function(html){
			html = formatCall(html)
			core[name] = html;
			localStorage['ds_'+name] = LZString.compress(JSON.stringify({version:core.options.data_version,data:html}))
			callback(html)
		}
	})
}
function allNations(send){
	getDataFromLocal('nations','allNations',false,send)
}
function allPsionics(send){
	getDataFromLocal('psion','allPsion',function(html){
		_.each(html,function(s){
			s.id = s.psi_id;
			s.description = s.psi_desc;
			s.label = s.psi_name
			s.attr = []
			s.psi_att = s.psi_att.split(',');
			_.each(s.psi_att,function(p){
				s.attr.push({'label':attName(p),'id':p})
			})
			s.prereq = '<span class="attr">'+_.pluck(s.attr,'label').join(', ')+' '+s.psi_level+'</span>, <span class="bkgr">Relavent Background</span>'
		})
		return html;
	},function(html){
		_.each(psionic_cats,function(pc,i,arr){
			pc.powers = _.filter(html,function(e){
				return e.psi_category == pc.id;
			})
		})
		if(send)send(html)
	})
}
function allEquip(send){
	_.each(equip_types,function(et){
		et.slug = et.name.replace(' ','-').toLowerCase();
		et.single = et.single? et.single : single(et.name);
	})
	_.each(equip_skills,function(eq){
		eq.types = _.map(eq.types,function(t){
			return _.find(equip_types,function(es){
				return es.id == t
			})
		})
	});
	core.birth_races = [];
	core.Ballistic = [];
	core.Blaster = [];
	core.Explosives = [];
	getDataFromLocal('equipment','allEquip',function(html){
		//Format function
		_.each(html,function(h){
			switch(h.rarity){			
				case 'A':
				h.available = false
				h.owner= 'Station'
				//h.status = 'Blueprint';
				h.sort = 0;
				h.rent = 0;
				break;
						
				case 'C':
				h.available = 'Common';
				h.sort = 1;
				break;
						
				case 'U':
				h.available = 'Uncommon';
				h.sort = 2;
				break;
						
				case 'R':
				h.available = 'Rare'
				h.sort = 3;
				break;				
			}
			var type = _.find(equip_types,function(e){
				return h.type == e.id;
			})
			if(type) h.typestr = type.slug;
			if(type) h.single = type.single;

			var skill = _.find(equip_skills,function(s){
				return h.skill == s.id
			})
			if(skill) h.skillstr = skill.short;
			if(h.eq_id){
				h.capacity = h.capacity? fixInt(h.capacity) : 0;
				h.adv = h.b_rules;
				h.disadv = h.b_disadv;
				core.birth_races.push(h)	
			}
			var multis = ['12', '10', '4', '2']
			if(multis.indexOf(h.type+'')==-1){
				h.multi_equip=true;	
			}
			if(h.supplement=='ai_sleeve'){
				h.special = 'ai_sleeve';
			}
		})
		return html;
		
	},function(html){
		_.each(html,function(h){
			if(h.type+''=='8' && h.capacity !=0){
				//Blaster/Ballistic/Explosives
				var n = h.name.toLowerCase();
				if(n.indexOf('ballistic')!=-1) core.Ballistic.push(h);
				if(n.indexOf('blaster')!=-1) core.Blaster.push(h);
				if(n.indexOf('blaster')==-1 && n.indexOf('ballistic')==-1) core.Explosives.push(h);
			}
			if(h.eq_id){
				core.birth_races.push(h)	
			}
		})
		_.each(equip_types,function(e,i,a){
				e.items = _.filter(html,function(it){
					return it.type == e.id;
				})
			})
			
			
			_.each(equip_skills,function(s,i,a){
				s.items = _.filter(html,function(it){
					return it.skill == s.id && it.rarity;
				})
				s.items = _.sortBy(s.items,function(ii){
					return ii.sort+ii.cost+ii.name;
				})
			})
		core.equipment = html
		if(send)send(html)
	})
}
function allSkills(send){
	getDataFromLocal('skills','allSkills',function(html){
		_.each(html,function(s){
			s.id = s.sk_id;
			s.description = s.sk_desc;
			s.label = s.sk_name
			s.attr = [{'label':attName(s.sk_att),'id':s.sk_att}]
			s.prereq = ['<span class="attr">'+attName(s.sk_att)+" "+s.sk_level+'</span>','<span class="skill">'+s.sk_prereq+'</span>',s.eq_prereq];
			s.prereq = _.compact(s.prereq).join(', ');
		})
		return html
	},function(html){
		_.each(skill_cats,function(sk){
			sk.skills = _.filter(html,function(e){
				return e.sk_category+'' == sk.id+'';
			})
		})
		if(send) send(html)
	})
}
function allBackgrounds(send){
	getDataFromLocal('backgrounds','allBackgrounds',function(html){
		_.each(html,function(h){
			if(h.special && h.special.indexOf('multi')!= -1){
				h.multi = true;
				h.info = 1;	
			}
		})
		return html
	},send)
}
/*
function activityType(type,send,error){
	mainQuery({
		data:{'method':'activityType','filter',type},
		success: function(html){
			send(html)
		},error:function(){
			error()
		}
	})	
}
function activities(types,send){
	var completeCnt = 0;
	var obj = {};
	_.each(types,function(t){
		activityType(t,function(html){
			obj[t] = html
			tryDone()
		},function(){
			tryDone()
		})
	})
	function tryDone(){
		completeCnt++
		if(completeCnt>=types.length){
			send(obj)
		}
	}
}*/

function mainQuery(atts){
	atts.success = typeof atts.success == 'function'? atts.success : function(html){};
	atts.error = typeof atts.error == 'function'? atts.error : function(error){};
	var aj =  $.ajax({
		type: 'POST',
		url: base+'lfs-functions.php',
		dataType: 'json',
		data: atts.data,
		success: function(html){
			atts.success(html)		
		},
		timeout:10000,
		error: function(err){
			//message('An error occured');
			log('Error found: List ATTs')
			log(atts)
			log('Response: '+err.statusText+' '+(err.statusText=='timeout'? ', Timeout':''))
			if(err.hasOwnProperty('statusText') && err.statusText == 'timeout'){
				log('DISPLAY TIMOUT MESSAGE')
				message('SLOW CONNECTION')
			}else
			if(err.hasOwnProperty('responseText') && err.responseText){
				log(err.responseText)
				message(err.responseText);
			}else{
				log(err)
				message(err)	
			}
			atts.error(err)
		}
	});
}
  ////Set cookie function (from w3c)
	//--Used with set cookies session
	
	function setCookie(c_name,value,exdays){
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	}

	////Retieve cookie (from w3c)
	//--Used with set cookies session
	
	function getCookie(c_name){
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++){
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if (x==c_name){
				return unescape(y);
			}
		}
	}
