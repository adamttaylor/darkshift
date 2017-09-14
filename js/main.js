
function init(){
	var data = { a: 1 }
	Vue.component('screen',{
		props: ['sc','ds'],
		template: '<div :id="sc.screen" class="screen" :class="sc.screen" :data-screen="sc.screen" :data-left="sc.left"><div class="inscreen"><div class="templatenode"></div></div>'
	})
		
	var dt = {
		screens:ds.bread,
		ds:ds,
		tempName: 'sub-screen'
	}
	views.main = new Vue(
		{
		  el: '#main-panel',
		  data: dt
		}
	)
		
		
	//!! Use v-once on 
	Vue.component('loginscreen',{
		template: tmpstr.loginscreen
	})
	views.login = new Vue(
		{
		  el: '#main',
		  data: dt,
		  template: tmpstr.loginscreen
		}
	)
	views.scanner = new Vue(
		{
		  el: $('#admin-scanner .templatenode')[0],
		  data: {ds:ds,admin:true},
		  template: tmpsc.scanner
		}
	)
	views.pcscanner = new Vue(
		{
		  el: $('#frag-scanner .templatenode')[0],
		  data: {ds:ds,admin:false},
		  template: tmpsc.scanner
		}
	)
	views.checkin = new Vue(
		{
			el: $('#checkin .templatenode')[0],
			template:tmpsc.checkin,
			data: core
		}
	)
	/*views.maintenance = new Vue(
		{
			el: $('#maintenance .templatenode')[0],
			template:tmpsc.maintenence,
			data: {'ops':core.options,'char':ds.CH}
		}
	)*/

	
	getOptions(function(){
		thisEvent(function(){
			setWindow();
			buildCheckin()
			allSkills();
			allPsionics();
			allTeams();
			//allRaces();
			allEquip();
			allNations();
			allBackgrounds();
			configSelectActions();
			//useScanner();
			$('*').scrollTop(0).delay(1000).scrollTop(0)
		})
	});
	
}

log = console.log.bind(console);
function searchCharacters(term,send){
	mainQuery({
		data:{'s':term,'method':'searchCharacters'},
		success: function(html){
			html = _.uniq(html,function(p){return p.char_id})
			
			if(send) send(html)
		}
	})
}
function viewCharacters(){
	//$('.admin-charlist.screen').html(tmp.charSelect());	
	toscreen('admin-charlist',tmp.charSelect())
}
function handleSelectedBackgroundRule(sel){
	var r = _.filter(core.birth_races,function(br){
		var bv = $('.edit-source.screen #birth-race-save').attr('data-val').split(',')
		return bv.indexOf(br.id+'')!=-1;
	})
	var n = _.filter(core.nations,function(nat){
		var nv = $('.edit-source.screen #nation-save').attr('data-val').split(',')
		return nv.indexOf(nat.id+'')!=-1;
	})
	var b = $('.edit-source.screen #background-save').attr('data-val')
	var ba = [];
	if(b){
		b = b.split(',')
		ba = _.filter(core.backgrounds,function(cb){
			return b.indexOf(cb.id)!=-1
		})
	}
	allowBackgrounds(r,n,ba)
	if($(sel).attr('id')=='background-save'){
		var arani = 0;
		if(ds.CH.exceptions['birth-aurani'] && findSpecial('psion',ds.CH.background).length > 0) arani =1
		var selz = $('.background .rule-item.selected,.background .rule-item.on')
		var free = (fixInt(core.options.max_background)+ fixInt(ds.CH.extra_bg) + arani) -selz.length;
		var max  = core.options.max_background;
		$('.background .bg-number .free-bg').html('/'+free)
		if(free <1){
			$('.field-group.background').removeClass('free')
		}else{
			$('.field-group.background').addClass('free')	
		}
		var names = $(selz).map(function(index, s) {
            return $(s).find('h3').text()
        }).get().join(', ');
		$('#backgroundlist').text(names)
		if(names){
			$('#backgroundlist').parents('.padd').show()
		}else{
			$('#backgroundlist').parents('.padd').hide()
		}
	}
}
//Rule Widget Functions
function handleRuleIndexClick(rule){
	var sel = $(rule).parents('.rule-select')
	var ind = $(sel).find('.rule-index')
	//$(rule).removeClass('selected')
	$(sel).toggleClass('open')
	
	if($(sel).hasClass('open')){
		$(sel).stop().animate({height:$(sel).find('.rules-wrap').height()+$(ind).height()},1000,function(){
			$(sel).css({height:'auto'})
		});
	}else if ($(sel).find('.rule-item.selected,.rule-item.on').length>0){
		$(sel).addClass('selected');
		$(sel).stop().css({height:$(sel).find('.rule-selected').outerHeight(true)})
	}else{
		$(sel).stop().css({height:50})
	}
}
function handleRuleSelectClick(rule){
	var sel = $(rule).parents('.rule-select')
	var rs = $(sel).find('.rule-selected')
	$(sel).toggleClass('open')
	if($(sel).hasClass('open')){
		$(sel).stop().animate({height:$(sel).find('.rules-wrap').height()+$(rs).height()},1000,function(){
			$(sel).css({height:'auto'})
		});
	}else{
		$(sel).stop().css({height:$(rs).height()})
	}
}
function handleMultiItemCount(e){
	e.stopPropagation()
	var sel	= $(e.target).parents('.rule-select');
	var it	= $(e.target).parents('.rule-item');
	var cnt = fixInt($(it).attr('data-count'));
	var MIN = fixInt($(it).attr('data-init'));
	if($(e.target).hasClass('plus')){
		cnt++;
	}else if($(e.target).hasClass('minus')){
		cnt--;
	}
	$(it).attr('data-count',cnt)
	$(it).find('.count-num').text(cnt)
	if(cnt > MIN){
		$(it).addClass('over-init')
		//$(it).find('.minus').show()
	}else{
		$(it).removeClass('over-init')
		//$(it).find('.minus').hide()
	}
	$(sel).find('.rule-item.selected,.rule-item.on').length
	countRuleCount(sel);
	$(sel).trigger('selected')
}
function handleRuleItemClick(rule){
	var sel	= $(rule).parents('.rule-select')
	var ind	= $(sel).find('.rule-index');
	var rsel = $(sel).find('.rule-selected')
	var count= fixInt($(sel).attr('data-count'))
	if(count){
		$(rsel).html('')
		$(sel).removeClass('selected,over-init');
		$(rule).removeClass('selected,over-init');
		if($(rule).hasClass('selected') && !$(rule).hasClass('on')){
			$(rule).removeClass('selected over-init');
			var MIN = $(rule).attr('data-init');
			$(rule).attr('data-count',MIN )
			$(rule).find('.count-num').text(MIN )
		}else{
			$(rule).addClass('selected');						
		}
		$(sel).find('.rule-item.selected,.rule-item.on').each(function(index, el) {
			var b = $(el).hasClass('both')? ' both' : '';
			$(rsel).append('<div class="rule-item'+b+'">'+$(el).html()+'</div>');
		});
		countRuleCount(sel);		
	}else{
		if($(rule).hasClass('selected')){
			$(sel).find('.rule-item').removeClass('selected');
			$(sel).removeClass('selected');
			$(rsel).html('')
			$(sel).stop().css({height:50},1000)
			$(rule).removeClass('selected');
		}else{
			$(sel).find('.rule-item').removeClass('selected');
			var b = $(rule).hasClass('both')? ' both' : '';
			$(rsel).html('<div class="rule-item'+b+'">'+$(rule).html()+'</div>')
			$(sel).addClass('selected');
			$(rule).addClass('selected');
			$(sel).removeClass('open')//fixes height issue
			$(sel).stop().css({height:$(rsel).outerHeight(true)});
		}
		$(sel).removeClass('open')
	}
	var ids = $(sel).find('.rule-item.selected,.rule-item.on').map(function(index, e) {
		return $(e).attr('id')
    }).get()
	$(sel).attr('data-val',ids)
	$(sel).trigger('selected')
}
function checkSelectRuleExceptions(sel,count){
	if($(sel).attr('id')=='background-save' && ds.CH.exceptions['birth-aurani']){
		var ids = $(sel).find('.rule-item.selected,.rule-item.on').map(function(index, e) {
            return $(e).attr('id')
        }).get();
		var selectedPsion = _.find(core.backgrounds,function(bk){
			return ids.indexOf(bk.id) && bk.special.indexOf('psion') !=-1
		})
		if(selectedPsion) count+=1;
	}
	return count;
}
function countRuleCount(sel){
	var count= fixInt($(sel).attr('data-count'))
	var inc = 0;
	$(sel).find('.rule-item.selected,.rule-item.on').each(function(index, el) {
		if($(el).attr('data-count')){
			inc +=fixInt($(el).attr('data-count'));	
		}else{
			inc++;	
		}
    });
	count = checkSelectRuleExceptions(sel,count)
	if(inc >= count){
		$(sel).addClass('max')
		$(sel).find('.rules-wrap .rule-item').not('.selected,.on').attr('disabled','disabled');
		//$(sel).find('.rule-item .multi:not(.minus)').css({'display':'none'})
	}else{
		$(sel).removeClass('max')
		$(sel).find('.rule-item').removeAttr('disabled');
		//$(sel).find('.rule-item .multi:not(.minus)').css({'display':''})
	}
}
function updateInterface(show){
	ds.CH = formatChar(ds.CH)
	setKnown();
	buildSleeves()
	buildChar(show);
	buildInventory();
}
//Save source code from Edit-source screen
function saveSource(){
	var screen 		= $('.edit-source.screen')
	var dat    		= {};
	var br			= $(screen).find('#birth-race-save');
	var brv			= $(br).attr('data-val').split(',')
	var nat			= $(screen).find('#nation-save');
	var natv		= $(nat).attr('data-val').split(',')
	dat.char_id 	= ds.CH.char_id;
	dat.birth_race  = brv[0];
	dat.nation		= natv[0]
	var bgs	= $('.background').find('.rule-item.selected,.rule-item.on,.rule-item.off,.rule-item.saved:not(".selected")').map(function(index, element) {
        var obj 	= {};
		obj.subject_id	= ds.CH.char_id;
		obj.rel_key		= 'background';
		obj.skill_id	= $(element).attr('id')
		obj.rel_active	= $(element).hasClass('off saved')? '' : 'y'
		var attr		= $(element).attr('data-count')
		if(typeof attr !== typeof undefined && attr !== false ){
			obj.rel_info    =  attr
		}
		return obj;
    }).get();
    
	var relations = JSON.parse(JSON.stringify(bgs))
	
	if(brv.length>1){
		var obj 	= {};
		obj.subject_id	= ds.CH.char_id;
		obj.rel_key		= 'birth_2';
		obj.skill_id	= brv[1];
		obj.rel_active	= 'y';
		relations.push(obj);
		ds.CH.birth_2 = [extendDataFromCache(obj,obj.skill_id,obj.rel_key)];
	}
	if(natv.length>1){
		var obj 	= {};
		obj.subject_id	= ds.CH.char_id;
		obj.rel_key		= 'nation_2';
		obj.skill_id	= natv[1];
		obj.rel_active	= 'y';
		relations.push(obj)
		ds.CH.nation_2 = [extendDataFromCache(obj,obj.skill_id,obj.rel_key)];
	}
	if($('#nation-independant').hasClass('on') && $('#independant-mod-save').attr('data-val')){
		var obj 	= {};
		obj.subject_id	= ds.CH.char_id;
		obj.rel_key		= 'independant_mod';
		obj.skill_id	= $('#independant-mod-save').attr('data-val')
		obj.rel_active	= 'y';
		relations.push(obj)
		ds.CH.independant_mod = [extendDataFromCache(obj,obj.skill_id,obj.rel_key)];
	}
	if($('#experiment-mod').hasClass('on') && $('#experiment-mod-save').attr('data-val')){
		var obj 	= {};
		obj.subject_id	= ds.CH.char_id;
		obj.rel_key		= 'experiment_mod';
		obj.skill_id	= $('#experiment-mod-save').attr('data-val')
		obj.rel_active	= 'y';
		relations.push(obj)
		ds.CH.experiment_mod = [extendDataFromCache(obj,obj.skill_id,obj.rel_key)];
	}
	//dat.relations = JSON.stringify(relations); //Breaks on live site
	dat.relations = relations;
	
	if(dat.birth_race && dat.nation){
		updateCharacter(dat,function(){
			handleSaveRule(br)
			handleSaveRule(nat)
			message('Source Code Saved')
			ds.CH.birth_race = dat.birth_race;
			ds.CH.nation = dat.nation;
			$('.background').find('.rule-item.selected,.rule-item.on,.rule-item.off').addClass('.saved')
			if(bgs.length) ds.CH.background = extendRelation(bgs,'background');//If bgs length is none the backgrounds may alreaydy be set, don't oeverwrite
			if($('#exemplar').hasClass('on') && $('#exemplar select').val()){
				var exemplar = findSpecial('exemplar',core.backgrounds,true);
				var f = _.find(relations,function(r){
					return r.id+'' == exemplar.id+'';
				})
				
				mainQuery({
					data:{'method':'backgroundInfo','char_id':ds.CH.char_id,'info':$('#exemplar select').val()+'','skill_id':exemplar.id},
					success: function(html){
					}
				})
			}
			updateInterface(true)
		})
	}else{
		message('Select a Race AND Nation',false,true)	
	}
	
}
function handleSaveRule(sel){
	if(!$(sel).hasClass('set')){
		$(sel).addClass('set').removeClass('selected')
		$(sel).html($(sel).find('.rule-selected'))
		$(sel).find('.rule-selected').removeClass('rule-selected')
	}
}
function findSpecial(slug,data,single){
	var ret = false;
	if(single){
		ret = _.find(data,function(d){
			return d.special && d.special.indexOf(slug)!=-1	
		})
	}else if(slug=='*'){
		ret = _.filter(data,function(d){
			return d.special!="";
		})
	}else if(slug.indexOf('!!')==0){
		ret = _.filter(data,function(d){
			return d.special.indexOf(slug.substr(2))==-1
		})
	}else{
		ret = _.filter(data,function(d){
			return d.special && d.special.indexOf(slug)!=-1	
		})	
	}
	return ret;
}
function allowBackgrounds(birth,nation,background){
	
	$('.rule-item').removeClass('disqual');
	var specials = _.filter(core.backgrounds,function(bg){
		return bg.special!="";
	})
	
	//nation-independant
	var adopted = findSpecial('adopted',background,true)
	if(adopted){
		$('#birth-race-save').attr('data-count',2)	
		if(ds.CH.birth_obj){
			var ai = findSpecial('birth_ai',core.birth_races,true)
			var au = findSpecial('birth-aurani',core.birth_races,true)
			$('#birth-race-save .rules-wrap .rule-item#'+ai.id).not('.on').addClass('disqual')
			$('#birth-race-save .rules-wrap .rule-item#'+au.id).not('.on').addClass('disqual')
		}
	}else{
		$('#birth-race-save').removeAttr('data-count').removeClass('max')
		$('#birth-race-save .btn.selected:gt(0)').removeClass('selected')
	}
	checkRace(background);
	$('#nation-independant').removeClass('on')
	$('#nation-independant').hide()	
	if(nation.length>0 && nation[0].special=='nation-independant'){
		 $('#nation-independant').addClass('on')
		 $('#nation-independant').show()
	}
	var citizen = findSpecial('citizen',background,true)
	if(citizen){
		$('#nation-save').attr('data-count',2)	
	}else{
		$('#nation-save').removeAttr('data-count').removeClass('max')
		$('#nation-save .btn.selected:gt(0)').removeClass('selected')
	}
	if(citizen && nation.length==2 && nation[1].special==	'nation-independant'){
		$('#nation-independant').addClass('on')
		$('#nation-independant').show()
	}
	$('#experiment-mod').removeClass('on')
	$('#experiment-mod').hide()	
	var extra = findSpecial('extra_mod',background,true)
	if(extra){
		$('#experiment-mod').addClass('on')
		$('#experiment-mod').show()
	}
	$('#exemplar').removeClass('on')
	$('#exemplar').hide();
	var exemplar = findSpecial('exemplar',background,true)
	if(exemplar){
		$('#exemplar').addClass('on')
		$('#exemplar').show();	
	}
	
	//Hide Divergent code
	var aiOnly = findSpecial('aionly',specials,true)
	toggleBG(aiOnly)
	
	//Hide All nations
	var nationbgs = findSpecial('nation-',specials);
	toggleBG(nationbgs)//Hide Nations
	
	//Artificial Inteligence can't have psion backgrounds
	if(birth && birth[0] && birth[0].capacity == 0){
		var psion = findSpecial('!ai',core.backgrounds)
		toggleBG(psion)//Hide psionics
		toggleBG(aiOnly,true)//Show divergent code
	}
	//Show Selected nation
	if(nation && nation[0]){
		_.each(nation,function(na){
			var thisNation = findSpecial(na.special,nationbgs)
			toggleBG(thisNation,true)
		})
	}
	//Hide trueFaith, must have a faith bg
	var trueFaith = findSpecial('anyfaith',specials,true)
	toggleBG(trueFaith)
	
	//Find Faith BG
	var faith = findSpecial('faith',background,true)
	if(faith){
		var faiths = findSpecial('faith',specials)	
		toggleBG(faiths)//hide Faiths
		toggleBG(faith,true)//Show selected Faith
		toggleBG(trueFaith,true)//Show True Faith
	}
	//Dark Space Affinity
	if(ds.CH.psion.length == 0){
		var darkspace = findSpecial('psionic',nationbgs,true)
		toggleBG(darkspace)//Hide if no psionics (will display above if the right nation is selected
	}
	//Can't have Psionic && Psionic knack
	var hasknack = findSpecial('knack',background,true)
	var haspsion = findSpecial('psion',background,true)
	if(hasknack){
		var psion = findSpecial('psion',core.backgrounds)
		toggleBG(psion)	
	}
	if(haspsion){
		var knack = findSpecial('knack',core.backgrounds,true)
		toggleBG(knack)
	}else if(birth && birth.length > 0 && birth[0].special=='birth-aurani'){
		var free = fixInt(ds.CH.extra_bg)+ fixInt(core.options.max_background)
		free -= background.length
		if(free < 1){
			//the last choice can only be psionic
			var ids = _.pluck(background,'id');
			var notpsion = findSpecial('!!psion',core.backgrounds)
			notpsion = _.reject(notpsion,function(p){
				return ids.indexOf(p.id+'')!=-1
			})
			toggleBG(notpsion)	

		}
	}
	mainFunctionDisplay();//Update main button dislays
	$('#background-save .rule-item.disqual').removeClass('selected')
}
function toggleBG(dat,show){
	if(_.isArray(dat)){
		_.each(dat,function(d){
			toggleBG(d,show)
		})
	}else if(typeof dat == 'object' && show){
		$('#background-save #'+dat.id+'.rule-item').removeClass('disqual');	
	}else if(typeof dat == 'object'){
		$('#background-save #'+dat.id+'.rule-item').addClass('disqual')
	}
}
function hasSkillPrereq(sk,skills,padd){
	if(sk.sk_prereq_id!=0){
		var preQ = sk.sk_prereq_id.split('||')
		//look through the known skills, see if either of the skills needed exist
		var fil = _.filter(skills,function(k){
			return preQ.indexOf(k.id+'')!=-1;
		})
		if(fil.length == 0) {
			return false;
		}
		var preFIL = _.filter(fil,function(f){
			return f.sk_prereq_id !=0
		})
		if(preFIL.length == 0) {
			return true;
		}
		var hasOnePrereq = true;
		_.each(preFIL,function(pf){
			if(!hasSkillPrereq(pf,skills,'--'+padd)) hasOnePrereq = false;
		})
		if(!hasOnePrereq){
			return false;
		}
		return true;
	}
	return true;
}
function knowablePsionicsClass(ch,id){
	var cl='';
	var know = knowablePsionics(ch,id)
	if(know>1) cl+=' stoplearn'
	if(know==2)cl+=' noattr'
	if(know==3)cl+=' nobg'
	if(know>3)cl+=' noattr nobg'
	return cl;
}
function knowablePsionics(ch,id){
	/*
	1 = ok
	2 = attribute is not enough
	3 = background missing
	4 = psionic not found
	*/
	var num = 0;
	var p = _.find(core.psion,function(ps){
		return ps.id == id;
	})
	if(!p)return 4;
	var attOK = checkAttr(ch,p)
	var hasBG = checkBackground(ch,p);
	if(!hasBG && !attOK){
		num = 5
	}else if(!hasBG){
		num = 3
	}else if(!attOK){
		num = 2
	}else{
		num = 1
	}
	return num;
}
function checkBackground(ch,p){
	var psion   = findSpecial('psion',ch.background);
	var knack   = findSpecial('knack',ch.background,true);
	var diverge = findSpecial('aionly',ch.background,true);
	
	var pb = _.find(psionic_cats,function(c){
		return c.id == p.psi_category
	})
	if(knack && pb.id < 4) return true //Knack can have this psionic cat
	if(diverge && (pb.id==3 || pb.id==5)) return true; //divergent code can have these psionic cats
	//Has 1 psion background
	if(psion.length==1 && psion[0].special.indexOf(pb.background)!=-1){
		log('')
		return true;
	//Has 2 psion backgrounds
	}else if(psion.length == 2){
		var bgArr = pb.background.split(',')
		if(bgArr.length < 3){
			var cnt = 0;
			_.each(bgArr,function(bp){
				if(psion[0].special.indexOf(bp)!=-1 || psion[1].special.indexOf(bp)!=-1){
					cnt++
				}
			})
			if(cnt==bgArr.length){
				return true;	
			}
		}
	//Has all psion backgrounds
	}else if(psion.length>2){
		return true;	
	}	
}
function knowableSkillClass(ch,id){
	var cl='';
	var know = knowableSkill(ch,id)
	if(know>1) cl+=' stoplearn'
	if(know==2)cl+=' noattr'
	if(know==3)cl+=' noskill'
	if(know>3)cl+=' noattr noskill'
	return cl;	
}
function knowableSkill(ch,id){
	ch = _.clone(ch)
	/*
	1 = ok
	2 = Incorrect Attribute
	3 = no skill pereq
	4 = skill doesn't exist
	5 = no skill and no attr
	*/
	var num = 0;
	var sk = _.find(core.skills,function(s){
		return s.id+'' == id+'';
	})
	if(!sk) return 4;
	sk.sk_level = fixInt(sk.sk_level)
	if(ch.exceptions.strength_of_mind){
		ch.ego_cunning+=2;
		ch.ego_discipline+=2;
	}
	var attOK = checkAttr(ch,sk)
	var hasSkill = hasSkillPrereq(sk,ch.known,'');
	if(!hasSkill && !attOK){
		num = 5
	}else if(!hasSkill){
		num = 3
	}else if(!attOK){
		num = 2
	}else{
		num = 1;
	}
	return num;
	//return true;
}
function checkAttr(ch,sk){
	var attOK = true;
	var stat = false;
	var level = sk.hasOwnProperty('psi_level')? sk.psi_level : sk.sk_level
	_.each(sk.attr,function(a){
		switch(a.label){
			case "Tolerence":
			stat = fixInt(ch.ego_tolerence);
			break;
			case "Discipline":
			stat = fixInt(ch.ego_discipline);
			break;
			case "Cunning":
			stat = fixInt(ch.ego_cunning);
			break;
		}
		if(level > stat){
			attOK = false;
		}
	})
	return attOK;
}
/*=====================================
  RESLEEVE Functions
//=====================================*/
function imposeEgoPenalties(send){
	//if(!ds.CH.exceptions.birth_ai && !ds.CH.exceptions.prefection){
		ds.CH.penalty++;
		
		var t = getTrauma()
		
		//check pools to see if code is damaged
		var maxAttr = Math.max(ds.CH.ego_cunning,ds.CH.ego_discipline,ds.CH.ego_tolerence)
		ds.CH.ego_loss = ds.CH.penalty/maxAttr*100
		if(ds.CH.ego_loss == 100){
			//$('.gear-wrap').addClass('no-resleeve')	
		}
		//
		var track = {'action':'Mental Trauma','char_id':ds.CH.char_id,'info':t.label};
		mainQuery({
			data:{'method':'resublimate','char_id':ds.CH.char_id,'penalty':t.id,'track':track},success:function(html){
				if(send)send(t.label)
				parseEgoLoss(ds.CH,function(){
					buildChar(true)
					//send text = the result is outccome of the penalty chart
					
				})
			}
		})
	/*}else{
		if(send)send('')	
	}*/
}
function resublimate(send){
	var mds = modsTo(ds.CH.current_sleeve.module,'id')
	mds =_.isArray(mds)? mds : []
	mds.push(ds.CH.current_sleeve.rel_id)
	var randomItem = eqItemByCost();
	mds.push(randomItem.rel_id)
	mds = _.compact(mds);
	ds.CH.loss = [ds.CH.current_sleeve,randomItem];
	
	var label = ds.CH.current_sleeve.name+', Mods: '+modsTo(ds.CH.current_sleeve.module,'string')
	if(randomItem) {
		label+=', '+randomItem.name+', Battery: '+randomItem.battery+' Mods: '+modsTo(randomItem.module,'string')
	}
	var track = {'action':'Sublimate','char_id':ds.CH.char_id,'info':JSON.stringify({'label':label,'ids':mds.join(',')})};
	
	mainQuery({
		data:{'method':'deleteGear','gear_ids':mds.join(','),'track':track},
		success: function(){
			
			ds.CH.gear = _.reject(ds.CH.gear,function(g){
				return mds.indexOf(g.rel_id+'') !=-1;
			})
			ds.CH.current_sleeve = currentSleeve(ds.CH)
			buildInventory();	
		}
	})
	if(!ds.CH.exceptions.birth_ai && !ds.CH.exceptions.prefection){
		imposeEgoPenalties(send)
	}else{
		send(false)
	}
}
function doResleeve(){
	var c = tmp.sublimate({ch:ds.CH,races:core.birth_races})
	toscreen('re-sleeve',c)
}
function mentalTraumaUI(){
	imposeEgoPenalties(function(text){
		text = text? text+', ' : '';
		message(text,false,true);
	})
}
function resleeveUI(){
	resublimate(function(text){
		var loss = tmp.lostGear({loss: ds.CH.loss,'trauma':text})
		$('.lost-bank').html(loss)
		text = text? text+', ' : '';
		if(text) message(text)
		$('.init-content').hide()
		if(ds.CH.exceptions['nation-tabula']){
			_.each(core.birth_races,function(b){
				var e = fixInt(core.options.station_energy)
				var tol  = fixInt(b.capacity)
				if(ds.CH.exceptions.adaptable) tol = Math.max(tol-2,0);
				if(tol > ds.CH.ego_tolerence || fixInt(b.cost) > e){
					$('select[name=birth_race] option[value='+b.id+']').attr('disabled','disabled')
				}
			})
			var ops = $('select[name=birth_race] option').not('[disabled]').length
			if(ops>1){
				$('.result.nation-tabula').show();
			}else{
				$('.result.insufficient .race').html('Any race')
				$('.result.insufficient').show();
			}
		}else if(ds.CH.exceptions.birth_ai && ( fixInt(ds.CH.alt_birth_sleeve.cost)>fixInt(core.options.station_energy) ) ){
			$('.result.insufficient').show();
		}else if(ds.CH.exceptions.birth_ai){
			$('.result.ai-message').show();
		}else if(ds.CH.birth_obj && fixInt(ds.CH.birth_obj.cost)>fixInt(core.options.station_energy)){
			$('.result.insufficient').show();
		}else{
			$('.result.standard').show();
		}
	})//impose penalties, remove gear etc	
	
}
function stationEnergy(){
	mainQuery({
		data:{'method':'stationLoot','cost':core.options.station_energy},
		success: function(){
				
		}
	})	
}
function safeBudget(val,type){
	type=type?type:'e';
	var budget = {}
	if(ds.currentEvent){
		budget.event = ds.currentEvent.event_id
		if(type=='e'){
			budget.earned = val;
		}else{
			budget.spent = val;
		}
	}
	return budget
}
function confirmSleeve(e){
	//resleeve with birthrace
	var r = $(e.target).parents('.result')
	var v = $(r).find('[name=birth_race]').val()
	/*var rc = _.find(core.birth_races,function(r){
		return fixInt(r.id) == fixInt(v)
	})*/
	var rc = _.find(core.equipment,function(r){
		return fixInt(r.id) == fixInt(v)
	})
	
	
	var track = {'action':'Free Sleeve','char_id':ds.CH.char_id,'info':JSON.stringify({'eq_id':v,'name':rc.name,'cost':rc.cost})};
	core.options.station_energy-=fixInt(rc.cost)
	//update lfs_events set earned = earned+{$options['earned']}, spent = spent + {$options['spent']} where event_id = {$options['event']};";
	var b = safeBudget(rc.cost,'s')
	mainQuery({
		data:{'method':'freeSleeve','char_id':ds.CH.char_id,'eq_id':v,'track':track,'budget':b},
		success:function(html){
			message('Sleeve added to Inventory')
			toscreen('main')
			refreshMaintenence()
			var bd = html[0]
            bd = personalizeGear(bd, ds.CH)
            bd = marketGear(bd)
            bd.rel_id = bd.gear_id;
            ds.CH.gear.push(bd)
			buildInventory()
			
		}
	});
	stationEnergy()
	//get cost, subtract from station
}
function refreshMaintenence(){
	thisEvent(function(){
		domaintenance(false,false)
	})
}
function updateMaintenence(){
	var evt = $('#maintenance [name=year_select]').val() +'-'+$('#maintenance [name=month_select]').val()
	
	domaintenance(evt,false)
}
function limitMainteneceSelects(){
		var v = $('#maintenance [name=year_select]').val()
		var mv = $('#maintenance [name=month_select]').val()
		//$('#maintenance [name=month_select]').val()
		$('#maintenance [name=month_select] option').show().removeAttr('disabled')
		if(v=='2016'){
			$('#maintenance [name=month_select] option').filter(function() {
			  return $(this).attr("value") < 10;
			}).hide().attr('disabled','disabled')
			var newV = $('#maintenance [name=month_select] option').not('[disabled]').first().val()
			if($('#maintenance [name=month_select]').val()<10){
				$('#maintenance [name=month_select]').val(newV)
			}
		}else if(v== new Date().getFullYear()){
			$('#maintenance [name=month_select] option').filter(function() {
			  return $(this).attr("value") > new Date().getMonth()+1;
			}).hide().attr('disabled','disabled')
			var newV = $('#maintenance [name=month_select] option').not('[disabled]').last().val()
			if(fixInt(mv)>newV || ! mv){
				$('#maintenance [name=month_select]').val(newV)
			}
		}
}
function domaintenance(evt,jump){
	if(typeof evt !='string'){
		var time = new Date()
		var month = ("0" + (time.getMonth() + 1)).slice(-2)
		evt = time.getFullYear()+'-'+month
	}
	
	jump = typeof jump !== 'undefined' ? jump : true;
	var obj = {'ops':core.options,'ch':ds.CH,'event':ds.currentEvent}
	obj.earn = 0;
	obj.spent = 0;
	obj.lines = [];
	obj.fullview = ds.CH.exceptions.hasOwnProperty('cemo') || isAdmin()		
		
		
		mainQuery({
			data:{'method':'activityCycle','time':evt},
			success: function(data){
				log('query success')
				var excludes = ['Admin Add Gear','Complete Blueprint','none','give','Mental Trauma','scan frag','Sublimate','Maintenence','Desconstruct Blue'];
				var negs  = ['Free Sleeve','Allowance','Upkeep','ADMIN Options','Upkeep']
				data = _.filter(data,function(act){
					if(act.action == 'give' && act.edit_char_id+''=='0'){
						act.action = 'donate';
					}
					return excludes.indexOf(act.action) == -1
				})
				
				data = _.sortBy(data,'action')
				data = _.groupBy(data,function(d){
					return d.action.toLowerCase().replace(/ /g,'-')
				})
			
				
				_.each(_.keys(data),function(k){
					var d = data[k];
					var value = 0;
					_.each(d,function(line){
						
						var cost = 0;
						if(k == 'allowance'){
							cost = 10;
						}else if(k == 'admin-options'){
							line.action = 'Upkeep';
							try{
								var pre  = JSON.parse(line.pre)
								var post = JSON.parse(line.post)
								cost = pre.station_energy - post.station_energy
							}catch(err){
								log(err)
							}
						}else{
							try{
								var info = JSON.parse(line.info)
								cost = fixInt(info.hasOwnProperty('tax')? info.tax : info.cost);
							}catch(err){
								log(err)
							}
						}
						value += cost;
						if(negs.indexOf(line.action)==-1){
							line.minus = true;
							obj.earn += cost;
						}else{
							obj.spent += cost;
						}
						
					})
					obj.lines.push({'label':d[0].action,'value':fixInt(value),'minus':negs.indexOf(d[0].action)!=-1})
					/*$('#maintenance .specifics').append(
						'<div><label>'+d[0].action+': '+value+'</label></div>'
					)*/
				})
				obj.years = []
				for(var i = 2016;i< new Date().getFullYear()+1;i++){
					obj.years.push({label:i})
				}
				obj.years.reverse()
				
				obj.thisDate = evt.split('-')
				obj.evt = evt;
				obj.earn =  fixInt(obj.earn);
				obj.spent =  fixInt(obj.spent)
				obj.total = obj.earn+ obj.spent;
				obj.percent = Math.floor( (obj.earn *100) / obj.total );
				if(isNaN(obj.percent)) obj.percent = 0;
				obj.percent = Math.max(10,obj.percent)
				obj.percent = Math.min(90,obj.percent)
				if(obj.earn==0 && obj.spent==0) obj.percent=50;
				obj.otherPercent = 100 - obj.percent;
				obj.net = fixInt(obj.earn - obj.spent);
				var m = tmp.maintenance(obj)
				if(jump){
					toscreen('maintenance',m)
				}else{
					screenHtml('maintenance',m)
				}
				limitMainteneceSelects()
			},
			error:function(err){
				log('query fail')
				log(err)
			}
		})
	
}

/*=====================================
  Psychology Functions
//=====================================*/
function doPsychology(){
	var reg = _.filter(core.active.concat(core.teams),function(sk){
		return sk.char_id != ds.CH.char_id 
	})
	toscreen('psycho',tmp.psych({'characters':reg,'psych':false}))
}
function loadPsychologistPanel(){
	var p = tmp.psychList({dr:ds.CH});
	toscreen('psycho-skill',p);
}
function psychSellSkill(){
	_.each(ds.editCH.learn,function(k){
		k.name = k.sk_name;
	})
	_.each(ds.editCH.learnp,function(k){
		k.name = k.psi_name;
	})
	var str = tmp.psychSell({char:ds.editCH});
	toscreen('psych-process',str);
}
function patientChart(){
	
	_.each(ds.editCH.known,function(k){
		k.name = k.sk_name;
	})
	_.each(ds.editCH.learn,function(k){
		k.name = k.sk_name;
	})
	_.each(ds.editCH.psion,function(k){
		k.name = k.psi_name;
	})
	_.each(ds.editCH.learnp,function(k){
		k.name = k.psi_name;
	})
	ds.editCH.totalSkills = ds.editCH.known.length + ds.editCH.learn.length
	ds.editCH.totalPsion = ds.editCH.psion.length + ds.editCH.learnp.length
	var str = tmp.patientChart(ds.editCH);
	toscreen('psych-process',str);
}
function skillBuyer(){
	var reg = _.filter(core.active.concat(core.teams),function(sk){
		return sk.char_id != ds.CH.char_id && sk.char_id != ds.editCH.char_id
	})
	toscreen('psycho-buyer',tmp.psych({'characters':reg,'psych':false}))
	$('[data-screen="psycho-buyer"] .patient').addClass('buyer')
}
function fixTrauma(){
	parseEgoLoss(ds.editCH,function(){
		ds.editCH.editTrauma = _.reject (ds.editCH.trauma,function(t){
			return t.label=="No Penalty";
		})
		toscreen('psych-process',tmp.psychTrauma({char:ds.editCH}))
	})
	
}
function changeEgo(){
	toscreen('psych-process',tmp.psychReset({char:ds.editCH}))
}
function removeSkill(){
	_.each(ds.editCH.known,function(k){
		k.name = k.sk_name;
	})
	_.each(ds.editCH.psion,function(k){
		k.name = k.psi_name;
	})
	toscreen('psych-process',tmp.psychSkill({char:ds.editCH}))
}
function psySellSelectedSkill(e){
	message();
	var inn  = $(e.target).parents('.panel');
	var serv = $(inn).find('[name="service"]').val();
	var tx   = $(inn).find('.egotax').text();
	var tot  = $(inn).find('.totalEgoCost').text()
	var price= $(inn).find('[name="skill_cost"]').val()
	var chid = $(inn).find('[name="char_id"]').val();
	var buid = $(inn).find('[name="buyer_id"]').val();
	var pin  = $(inn).find('[name="pin"]').val();
	var pin2 = $(inn).find('[name="buypin"]').val();
	var tid  = $(inn).find('.relbox.selected').length>0? $(inn).find('.relbox.selected').attr('id') : false;
	var type = $(inn).find('.relbox.selected').parents('.field-group').attr('id')
	var b    = safeBudget(tx,'e') 
	
	var track = {'action':'Sell Skill','char_id':ds.CH.char_id,'edit_char_id':chid,
		'info':JSON.stringify(
		{'seller':chid,'dr':ds.CH.char_id,'buyer':buid,'price':price,'fee':serv,'total':tot,'tax':tx,'gear_id':tid}
	)};
	if(!pin || !pin2){
		message('Enter Pin',false,true);
	}else if(!tid){
		message('Select Skill',false,true)
	}else{
		checkCharPass(chid,pin,function(html){
			if(typeof html == 'object'){
				checkCharPass(buid,pin2,function(html){
					if(typeof html == 'object'){
						mainQuery({
							data:{'method':'transferSkill',
								'seller':chid,'price':price,
								'dr':ds.CH.char_id,'fee':serv,
								'buyer':buid,'total':tot,
								'tax':tx,'rel_id':tid,
								'budget':b,'track':track},
								success: function(html){
									toscreen('psycho-skill');
									message('Skill Transfered');
									refreshMaintenence();
							}
						})	
					}else{
						message('Buyer: Incorrect Password')
					}
				})
			}else{
				message('Seller: Incorrect Password')
			}
		})
	}
}
function removeTrauma(e){
	var inn  = $(e.target).parents('.panel');
	var serv = $(inn).find('[name="service"]').val();
	var tx   = $(inn).find('.egotax').text();
	var tot  = $(inn).find('.totalEgoCost').text()
	var chid = $(inn).find('[name="subject"]').val();
	var pin  = $(inn).find('[name="pin"]').val();
	var tid  = $(inn).find('.relbox.off').attr('id')
	var b    = safeBudget(tx,'e');
	
	var track = {'action':'Fix Trauma','char_id':ds.CH.char_id,'edit_char_id':chid,
		'info':JSON.stringify(
		{'patient':chid,'dr':ds.CH.char_id,'cost':serv,'tax':tx,'total':tot,'trauma_id':tid,'Trauma':$(inn).find('.relbox.off .inrel').text()}
	)};
	if(!pin){
		message('Enter Pin');
	}else if(!tid){
		message('Select Trauma')
	}else{
		checkCharPass(chid,pin,function(html){
			if(typeof html == 'object'){
				mainQuery({
					data:{'method':'removeLastTrauma', 'patient':chid, 'dr':ds.CH.char_id, 'cost':serv, 'tax':tx, 'total':tot, 'trauma_id':tid,'track':track,'budget':b},
						success: function(html){
							toscreen('psycho-skill');
							refreshMaintenence()
							message('Trauma Removed');
					}
				})			
			}else if(html==2){
				message('Incorrect Password',false,true)
			}				
		})
		
	}
}
function resetEgo(e){
	var inn  = $(e.target).parents('.panel');
	var serv = $(inn).find('[name="service"]').val();
	var tx   = $(inn).find('.egotax').text();
	var tot  = $(inn).find('.totalEgoCost').text()
	var chid = $(inn).find('[name="subject"]').val();
	var pin  =  $(inn).find('[name="pin"]').val();
	var b    = safeBudget(tx,'e');
	
	var track = {'action':'Reset Ego','char_id':ds.CH.char_id,'edit_char_id':chid,
		'info':JSON.stringify(
		{'patient':chid,'dr':ds.CH.char_id,'cost':serv,'tax':tx,'total':tot}
	)};
	if(!pin){
		message('Enter Pin');
	}else{
		checkCharPass(chid,pin,function(html){
			if(typeof html == 'object'){
				mainQuery({
					data:{'method':'resetEgo','patient':chid,'dr':ds.CH.char_id,'cost':serv,'tax':tx,'total':tot,'track':track,'budget':b},
						success: function(html){
							toscreen('psycho-skill');
							message('Ego pools reset');
							getOptions()
							refreshMaintenence()
					}
				})			
			}else if(html==2){
				message('Incorrect Password',false,true)
			}				
		})
		
	}
}
function psyEditSkills(e){
	var inn  = $(e.target).parents('#psySkillsForm');
	var serv = $(inn).find('[name="service"]').val();
	var tx   = $(inn).find('.egotax').text();
	var tot  = $(inn).find('.totalEgoCost').text()
	var chid = $(inn).find('[name="char_id"]').val();
	var pin  = $(inn).find('[name="pin"]').val();
	var b    = safeBudget(tx,'e');
	
	var known	= $('#psySkillsForm #known .relbox').map(function(index, element) {
		var rel 	= {};
		rel.subject_id	= chid;
		rel.rel_key		= 'known';
		rel.skill_id	= $(element).attr('id')
		rel.rel_active	= $(element).hasClass('off')? '' : 'y'
		var attr		= $(element).attr('data-count')
		if(typeof attr !== typeof undefined && attr !== false ){
			rel.rel_info    =  attr
		}
		return rel;
	}).get();
	var psion	= $('#psySkillsForm #psion .relbox').map(function(index, element) {
		var rel 	= {};
		rel.subject_id	= chid;
		rel.rel_key		= 'psion';
		rel.skill_id	= $(element).attr('id')
		rel.rel_active	= $(element).hasClass('off')? '' : 'y'
		var attr		= $(element).attr('data-count')
		if(typeof attr !== typeof undefined && attr !== false ){
			rel.rel_info    =  attr
		}
		return rel;
	}).get();
	var lostSkillName = $('#psySkillsForm .relbox.off').map(function(index, element) {
		return $(element).find('.inrel').text()
	}).get().join(', ');
	var lostSkillID = $('#psySkillsForm .relbox.off').map(function(index, element) {
		return $(element).attr('id')
	}).get().join(',');	
	
	var track = {'action':'Remove Skill','char_id':ds.CH.char_id,'edit_char_id':chid,
		'info':JSON.stringify(
		{'patient':chid,'dr':ds.CH.char_id,'cost':serv,'tax':tx,'total':tot,'skills':lostSkillName,'ids':lostSkillID}
	)};
	if(!pin){
		message('Enter Patient pin')	
	}else{
		checkCharPass(chid,pin,function(html){
			if(typeof html == 'object'){
				var dat = known.concat(psion);
				mainQuery({
					data:{'method':'removeSkill','patient':chid,'dr':ds.CH.char_id,'cost':serv,'tax':tx,'total':tot,'track':track,'budget':b},
					success: function(html){
						//toscreen('psycho-skill');
						//message('Ego pools reset');
						getOptions()
						refreshMaintenence();
					}
				})
				saveRelation(dat,function(){
					message('Skills + Psionics Updated');
					ds.editCH.known = extendRelation(known,'known');
					ds.editCH.psion = extendRelation(psion,'psion');
					ds.editCH = formatChar(ds.editCH);
					if(ds.editCH.char_id == ds.CH.char_id){
						ds.CH = ds.editCH
						updateInterface();						
					}
					$('#psySkillsForm .relbox.off').remove();
				})
			}else if(html==2){
				message('Incorrect Password',false,true)
			}				
		})
	}
}
/*=====================================
	Missions
//=====================================*/
function doMissions(){
	mainQuery({
		data: {method:'missionAsteriods'},
		success: function(html){
			var event =  (core.options.gamemode === 'true' || core.options.gamemode === true)? ds.currentEvent.event_id : '0';
			mainQuery({
				
				data: {method:'getMissions','event':ds.currentEvent.event_id},
				success: function(html2){
					_.each(html2,function(m){
						if(m.type=='hack'){							
							var f = _.find(equip_skills,function(h){
								return h.id+'' == m.ref+''; 
							})
							m.name = f.short+' Server';
						}else{
							var f = _.find(roomlist,function(h){
								return h.id+'' == m.ref+''; 
							})
							m.name = f.label;
						}
						
						m.crew = m.crew.split(',')
						var cap = _.find(core.active,function(a){
							return a.char_id+'' == m.captain+'';
						})
						if(typeof cap == 'object') {m.captain_name = cap.char_name;}
						m.crew = _.map(m.crew,function(c){
							var f = _.find(core.active,function(a){
								return a.char_id+'' == c+'';
							})
							if(f) return f.char_name;
							return false;
						})
						
						m.crew = _.unique(_.compact(m.crew)).join(',');
						
					})
					_.each(html,function(obj){
						
						obj.crew = obj.crew? obj.crew.split(',') : []
						var cap = _.find(core.active,function(a){
							return a.char_id+'' == obj.captain+'';
						})
						if(typeof cap == 'object') {obj.captain_name = cap.char_name;}
						obj.crew = _.map(obj.crew,function(c){
							var f = _.find(core.active,function(a){
								return a.char_id+'' == c+'';
							})
							if(f) return f.char_name;
							return false;
						})
						
						obj.crew = _.unique(_.compact(obj.crew)).join(',');
						
					})
					toscreen('missions',tmp.missionqueue({'asteroids':html,'mods':html2}));
				}
			})
		}
	})
}
function viewAsteroids(){
	//get all the asteroids and list them
	
	mainQuery({
		data: {method:'adminAsteriods'},
		success: function(html){
			var ast = tmp.adminAsteroid({asteroids:html});
			toscreen('admin-asteroid',ast);
		}
	})
}
function buildAsteroid(e){
	toscreen('create-asteroid',tmp.createAsteroid());
}
function buildPlanet(e){
	toscreen('create-asteroid',tmp.createPlanet());
}
function savePlanetMission(){
	var n = $('#newPlanet').find('[name=name]').val()
	if(n){
		var data = $('#newPlanet').serializeArray()
		var obj = {};
		_.each(data,function(m){
			obj[m.name] = m.value;
		})
		createAsteroid(obj,function(html){
			message('Planet Mission created',false,true);
			$('#newPlanet').find('input,select,textarea').val('');
			
			var ast = tmp.asteroidsm(html[0]);
			$('.asteroidbank').prepend(ast)
		})
		
	}else{
		message('Fill out a name',false,true)
	}
}
function saveAsteroid(){
	var n = $('#newAsteroid').find('[name=name]').val()
	if(n){
		var data = $('#newAsteroid').serializeArray()
		var obj = {};
		_.each(data,function(m){
			obj[m.name] = m.value;
		})
		createAsteroid(obj,function(html){
			message('Asteroid created',false,true);
			$('#newAsteroid').find('input,select,textarea').val('');
			
			var ast = tmp.asteroidsm(html[0]);
			$('.asteroidbank').prepend(ast)
		})
		
	}else{
		message('Fill out a name',false,true)
	}
}
function updateAsteroids(){
	var d = $('.asteroidbank .asteroid.altered').map(function(){
		return {'id':$(this).attr('id'),'status':($(this).hasClass('live')? 'a': 'i')}
	}).get()
	mainQuery({
		data: {'method':'updateAsteroids','data':d},
		success: function(html){
			message('Asteroids Updated')
			$('.asteroidbank .asteroid.altered').removeClass('altered')
		}
	})
}
function engageScanner(e){
	var p  = $(e.target).parents('.panel');
	var id = $(p).attr('id');
	var pass = $(p).find('.scan-pin').val()
	if(pass && pass.toLowerCase()=='success'){
		mainQuery({
			data: {'method':'getAsteroid','id':id},
			success: function(html){
				var a = html[0];
				var stat = a.status == 's'? 'su' : 'u';
				
				var line = $('.mission-line#'+id)
				$('.destination.screen .tick.description').html('<p>Condition: </p><p>'+a.special+'</p>')
				$('.mission-line[id='+id+'] .details').html('Details: '+a.special)
				scanAsteroid(id)
				toscreen('destination')
			}
		})
		
	}else{
		message('Passcode Fail',false,true)
	}
}
function scanAsteroid(id,callback){
	mainQuery({
		data: {'method':'scanAsteroid','id':id},
		success: callback
	})
}
/*function statusAsteroid(id,stat,callback){
	mainQuery({
		data: {'method':'statusAsteroid','id':id,'status':stat},
		success: function(html){
			if(callback)callback();
		}
	})
}*/
function beginMission(e){
	var m = $(e.target).parents('.panel.mission-full')
	var obj = {
		'captain':$(m).find('[name="captain"]').val(),
		'crew': $(m).find('[name="crew"]').attr('data-value'),
		'ref':  $(m).find('[name="ref"]').val(),
		'type': $(m).attr('data-type'),
		'event':ds.currentEvent.event_id,
		'progress':'s',
		'subtype':'',
	}
	
	obj.crew = obj.crew.split(',')
	obj.crew = _.map(obj.crew,function(c){
		var f = _.find(core.active,function(a){
			return a.char_name == c;
		})
		if(f) return f.char_id;
			return false;
	})
	obj.crew = _.unique(_.compact(obj.crew)).join(',');
	
	if(obj.type == 'pilot'){
		//obj.extra = $(m).find('[name="extra"]').val()
	}else if(m.hasClass('hack')){
		obj.subtype = $(m).find('[name="subtype"]').val()
	}
	mainQuery({
		data: {'method':'createMission','data':obj},
		success: function(html){
			message('Mission Begin');
			doMissions();
		}
	})
	
	//save that mission has begun and add a cancel mission button
	
}

function cancelMission(e){
	var m	 = $(e.target).parents('.panel.mission-full')
	var qid  = $(m).attr('data-qid');
	var type = $(m).attr('data-type');
	var s = type == 'pilot'? 'a' : 'i';
	mainQuery({
		data: {'method':'endMission','qid':qid,'stat':s},
		success: function(html){
			message('Mission Cancelled');
		}
	})
	doMissions()//toscreen('missions')
	
}
function endMission(e){
	var qid  = $(e.target).parents('.panel.mission-full').attr('data-qid');
	var type = $(e.target).parents('.panel.mission-full').attr('data-type');
	var html = tmp.endmission( {'id':qid,'type':type} );
	toscreen('mission-end',html)
}
function failMission(e){
	var p = $('.mission-pin').val();
	var id = $(e.target).parents('.endmission').attr('id')
	var type = $(e.target).attr('data-type');
	var s = type == 'pilot'? 'a' : 'f';
	if(p=='success'){
		mainQuery({
			data: {'method':'endMission','qid':id,'stat':s},
			success: function(html){
				message('Mission Failed');
				doMissions();
			}
		})
	}else{
		message('Incorrect Pin',false,true)
	}
}
function successMission(e){
	var p = $('.mission-pin').val();
	var id = $(e.target).parents('.endmission').attr('id')
	if(p=='success'){
		mainQuery({
			data: {'method':'completeMission','qid':id},
			success: function(html){
				message('Mission Completed');
				doMissions();
			}
		})
	}else{
		message('Incorrect Pin',false,true)
	}
}
/*=====================================
	 Mod Queue Functions
	//=====================================*/
function adminMissionStatus(e){
	var purpose = $(e.target).attr('data-purpose')
	var m = $(e.target).parents('.panel.mission-full')
	var qid = $(m).attr('data-qid')
	var id = $(m).find('[name=ref]').val()
	var data = {};
	var callback = function(){};
	var type = $(m).attr('data-type');
	
	
	switch(purpose){
		case 'scan':
		data = {'method':'scanAsteroid','id':id}
		callback = function(html){
			var a = html[0];
			var line = $('.mission-line#'+id)
			$(m).find('.tick.description').not('.controls').html('<p>Condition: </p><p>'+a.special+'</p>')
			//$('.mission-line[id='+id+'] .details').html('Details: '+a.special)
			message('Asteroid Scanned')
		}
		break;
		
		case 'success':
		data = {'method':'completeMission','qid':qid},
		callback = function(){
			
			modQueue();
			message('Mission Completed')
		}
		break;
		
		case 'fail':
		data = {'method':'endMission','qid':qid,'stat':(type == 'pilot'? 'a' : 'f')},
		callback = function(){
			
			modQueue();
			message('Mission Failed')
		}
		break;
		
		case 'cancel':
		data = {'method':'endMission','qid':qid,'stat':(type == 'pilot'? 'a' : 'i')},
		callback = function(){
			
			modQueue();
			message('Mission Cancelled')
		}
		break;
	}
	mainQuery({data: data, success: callback})
}
function modQueue(){
	mainQuery({
		data: {'method':'modQueue'},
		success: function(html){
			var chars = [];
			_.each(html,function(obj){
				if(obj.type=='hack'){
					obj.difficulty = obj.subtype;
					var f = _.find(equip_skills,function(h){
						return h.id+'' == obj.ref+''; 
					})
					obj.name = f.short+' server'
					
				}else if(obj.type=="explore"){
					var f = _.find(roomlist,function(h){
						return h.id+'' == obj.ref+''; 
					})
					obj.name = f.label;
				}
				obj.crew = obj.crew.split(',')
				var cap = _.find(core.active,function(a){
					return a.char_id+'' == obj.captain+'';
				})
				if(typeof cap == 'object') {obj.captain_name = cap.char_name;}
				obj.crew = _.map(obj.crew,function(c){
					var f = _.find(core.active,function(a){
						return a.char_id+'' == c+'';
					})
					if(f) return f.char_name;
					return false;
				})
				
				obj.crew = _.unique(_.compact(obj.crew)).join(',');
				
			})
			toscreen('mods',tmp.modList(html))
		}
	})
}
/*=====================================
  Fabricator Functions
//=====================================*/
function doFabricator(){
	var tax = fixInt(core.options.tax_sales);
	var construct = fixInt(core.options.tax_construct);
	tax = tax? tax : 0;
	construct = construct? construct : 0;
	if(ds.CH.exceptions.criminal){
		tax = 0;
		construct = 0;
	}
	var blues = JSON.stringify(equip_skills)
	mainQuery({
		data:{'method':'allSimpleCharacters'},
		success: function(html){
			core.autodata = html
			
			getBuildable(ds.CH,function(){;
				
				var fab = tmp.fabricator(_.extend({'tax':tax,'ctax':construct,'equipment':ds.CH.buildable,'characters':core.active},ds.CH))
				toscreen('fabricator',fab)
				/*$('.fabricator.screen .market-overlay .onmarket [name=to]').each(function(index, e) {
		            var v = $(e).attr('data-vis');
					$(e).find('option[value="'+v+'"]').attr('selected','selected')
		        });*/
		        
		        
		        $('.fabricator.screen [name=character-to]').each(function(i,e){
					var id = $(e).parents('.overlay-parent').attr('data-owner')
					var src = _.reject(html,function(c){
						return c.char_id+'' == id+'';
					})
					$(e).autocomplete({
						source: _.pluck(src,'char_name'),
						minLength: 0,
						focus: function() {
						    // prevent value inserted on focus
						   return false;
						},
						select: function( event, ui ) {
							 var hold = $(this).parent().addClass('fa precheck')
							return ui.item.value;
						}
					});
				})
			})
	
	/***************/
			
		}
	})
}
function doMarketing(){
	var tax = fixInt(core.options.tax_sales);
	var construct = fixInt(core.options.tax_construct);
	tax = tax? tax : 0;
	construct = construct? construct : 0;
	if(ds.CH.exceptions.criminal){
		tax = 0;
		construct = 0;
	}
	var blues = JSON.stringify(equip_skills)
	getMarketPlace(ds.CH,function(){
		var fab = tmp.store(_.extend({'tax':tax,'ctax':construct,'equipment':ds.CH.marketplace,'characters':core.active},ds.CH))
		toscreen('marketplace',fab)
		$('.marketplace.screen option[value="'+ds.CH.char_id+'"]').remove()
		$('.marketplace.screen .on-market [name=to]').each(function(index, e) {
			var v = $(e).attr('data-vis');
			$(e).find('option[value="'+v+'"]').attr('selected','selected')
			var chartext = $(e).find('option[value="'+v+'"]').text()
			$(e).parents('.purchase-line').find('.value.char').text(chartext);
			
        });
        checkMaretBalance()
	})
}
function checkMaretBalance(){
	var energy = getEnergyTotal();
	$('.marketplace.screen .sale-panel .market-line').each(function(){
		var c = fixInt($(this).find('.trade_btn.energy').text())
		if(c > energy){
			$(this).addClass('tooMuch')
		}else{
			$(this).removeClass('tooMuch')
		}
	})
	$('.fabricator.screen .blueprint').not('.template').each(function(){
		//var energy = ds.CH.teams.length==0?	ds.CH.energy : fixInt($('.fabricator.screen .frag-panel.in-use .pan .energy').text())
		var cost = fixInt($(this).attr('data-cost'))
		if(cost>energy){
			$(this).addClass('tooMuch')
		}else{
			$(this).removeClass('tooMuch')
		}
		$(this).find('.obj,.mod-line').removeClass('on');
		$(this).removeAttr('data-viewed');
		$(this).find('.market-overlay').css({'height':0,'opacity':0})
		$(this).find('.modpanel').css({'display':'','margin-left':''});		
	})
}
function showequip(e){
	var tar = $(e.target).hasClass('btn')? e.target : $(e.target).parents('.btn')
	var id = $(tar).attr('id')
	//$('.fabricator.screen .typeselect select, .fabricator.screen .frag').addClass('ninja');
	//$('.fabricator.screen .typeselect select#'+id+',.fabricator.screen .frag#'+id).removeClass('ninja');
	$('.fabricator.screen .typeselect select, .fabricator.screen .frag').removeClass('focus');
	$('.fabricator.screen .typeselect select#'+id+',.fabricator.screen .frag#'+id).addClass('focus');
}
function showFiltersMobile(e){
	var has = $(e.target).hasClass('close')
	if(has){
		$(e.target).removeClass('close');
		$('.searchbar .filters').hide()
	}else{
		$(e.target).addClass('close');
		$('.searchbar .filters').show()
	}
}
function cryoChange(e){
	var bp = $(e.target).parents('.gear');
	$(bp).find('.obj.mod').removeClass('on')
	$(bp).find('.inn').addClass('ninja')
	
	var action = 'cryo';
	var m = $(bp).find('.market-overlay');
	
	if($(m).attr('data-viewed')==action){
		$(m).removeAttr('data-viewed')
		$(m).stop().animate({'height': 0,opacity:0});
	}else{
		//$(obj).addClass('on');
		$(m).attr('data-viewed',action)
		$(m).find('.inn.'+action).removeClass('ninja')
		$(m).stop().animate({'height': 145,opacity:1});
	}
}
function closeOverlay(e){
	var tar = e.target? e.target : e;
	var m = $(tar).parents('.overlay-parent').find('.market-overlay');
	$(tar).parents('.overlay-parent').find('.obj,.mod-line').removeClass('on')
	$(m).removeAttr('data-viewed')
	
	$(m).stop().animate({'height': 0,opacity:0},function(){
		$(m).find('.modpanel').css({'display':'','margin-left':''})
	});
}
function giveAwayGear(e){
	var ui = $(e.target).parents('.overlay-parent')
	var name = $(e.target).parents('.inn').find('input').val()
	var idz = $(ui).attr('data-gear-id').split(',')
	
	var charTO = _.find(core.autodata,function(c){
		return c.char_name == name
	});
	var id = idz[0]
		
	mainQuery({
		data:{'method':'takeGear', 'buyer':charTO.char_id, 'gear_id':id},
		success: function(html){
			var tar = extendRelation(html,'gear');
			tar = tar[0]
			_.reject(ds.CH.gear,function(f){
				return f.gear_id+'' == id+''
			})
			_.each(ds.CH.teams,function(tm){
				_.reject(tm.gear,function(gr){
					return gr.gear_id+'' == id;
				})
			})
			if(idz.length>1){
				idz.shift()
				$(ui).attr('data-gear-id',idz.join(','))
				var cnt = $(ui).find('.counter').text()
				cnt = parseInt(cnt)
				$(ui).find('.counter').text(cnt-1)
				closeOverlay(e)
			}else{
				$(ui).wrap('<div class="gear-wrap-single"></div>');
				var wrap = $(ui).parents('.gear-wrap-single');
				$(wrap).width($(ui).width())
				$(wrap).stop().animate({'width': 0},500,function(e){
					$(wrap).remove()
				});
			}	
			tar.owner  = ds.CH.char_name;
			tar.owner_id  = ds.CH.char_id;
			tar.char_id  = ds.CH.char_id;
			tar.count = 1;
			
			
			var install = ['0','6','9','11','13','15','16']
			ds.CH.gear = ds.CH.hasOwnProperty('gear')? ds.CH.gear : [];
			if(charTO.type=='team'){
				var tid = _.findIndex(ds.CH.teams,function(t){return t.char_id==charTO.char_id})
				if(!ds.CH.teams[tid].hasOwnProperty('gear')) ds.CH.teams[tid].gear = []
				ds.CH.teams[tid].gear.push(tar)
				$('.gear-wrap.teamgr[id='+charTO.char_id+']').append(tmp.teamgear(tar))
			}else if(charTO.char_id+''==ds.CH.char_id+''){
				if(tar.type+'' == '12'){
					tar = inventoryItemMap(tar,ds.CH)
					ds.CH.gear.push(tar)
					$('.gear-wrap.sleeves').append(tmp.sleeve(tar))
				}else if(install.indexOf(tar.type+'') ==-1){
					ds.CH.gear.push(tar)
					$('.gear-wrap.equipment').append(tmp.gear(tar))
				}else{
					ds.CH.gear.push(tar)
					$('.gear-wrap.mods').append(tmp.mod(tar))
				}
			}
			buildInventory(true)
			
		}
	})

}
function removeModUI(e){
	//open overlay warn user
	var obj = $(e.target).hasClass('.mod-line')? e.target : $(e.target).parents('.mod-line');
	var bp = $(e.target).parents('.overlay-parent');
	var m = $(bp).find('.market-overlay');
	$(bp).find('.mod-line').removeClass('on')
	$(bp).find('.inn').addClass('ninja')
	$(obj).addClass('on');
	$(m).attr('data-viewed','removemod')
	$(m).find('.inn.removemod').removeClass('ninja')
	$(m).find('.inn.removemod [data-ind]').attr('data-ind',$(bp).find('.mod-line').index(obj))
	$(m).stop().animate({'height': 145,opacity:1});
}
function removeMod(e){
	var gear = $(e.target).parents('.overlay-parent')
	var ind = fixInt($(e.target).attr('data-ind'))+1
	var op = $(e.target).parents('.overlay-parent')
	var btn = $(op).find('.mod-line:nth-child('+ind+')')
	var rel_id = $(btn).attr('data-id')
	if(rel_id){
		var div = $('.module[data-gear-id="'+rel_id+'"]');
		if($(div).length==0){
			var f = _.find(ds.CH.modz,function(m){
				if(m.type+''=='16'){
					var ids = m.rel_id.split(',')
					return ids.indexOf(rel_id+'')!=-1
				}
				return false;
			})
			div = $('.module[data-gear-id="'+f.rel_id+'"]');
			splitGear($(div),{'rel_info':''},false,rel_id);
		}else{
			splitGear($(div),{'rel_info':''});
		}
		equipGear('',rel_id)//Mark as un install
	}else{
		rel_id = $(btn).find('.obj').text()
	}
	var f = _.find(ds.CH.gear,function(g){
		return gear.attr('data-gear-id') == g.rel_id+'';
	})
	if(typeof f.module == 'string') f.module = f.module.split(',');
	f.module = modsTo(f.module,'id')
	var fnd = rel_id
	f.module = _.reject(f.module,function(m){
		if( m == fnd){
			fnd = '';//this prevents more than 1 being rejected
			return true;
		}
		return false
	})
	modGear(f.module.join(','), f.rel_id, 'module');
	
	splitGear($(e.target).parents('.gear'),{})
	$(btn).remove();
	closeOverlay(e)
	buildInventory(true)
}
function modsTo(mods,type){
	if(typeof mods == 'string') mods = mods.split(',')
	if(type=='save'){
		return _.map(mods,function(mm){
			if(typeof mm == 'object' && mm.type+'' == '16'){
				return mm.rel_id;	
			}else if(typeof mm == 'object'){
				return mm.name;	
			}
			return mm;
		})
	}else if(type=='id'){
		return _.map(mods,function(mm){
			if(typeof mm == 'object'){
				return mm.rel_id;	
			}
			return mm;
		})
	//returns all mods as string names
	}else if(type=='string'){
		return _.map(mods,function(mm){
			if($.isNumeric(mm)){
				var f = _.find(ds.CH.gear,function(g){
					return g.rel_id+'' == mm+'';
				})
				if(f) return f.name;
			}else if(typeof mm == 'object'){
				return mm.name;	
			}
			return mm;
		})
	//Returns Cyberware as object geneware as string
	}else if(type=='object'){
		return _.map(mods,function(mm){
			if($.isNumeric(mm)){
				var f = _.find(ds.CH.gear,function(g){
					return g.rel_id+'' == mm+'';
				})
				if(f) return f;
			}
			return mm;
		})
	//Returns all mods as objects
	}else if(type=='allobject'){
		return _.map(mods,function(mm){
			if($.isNumeric(mm)){
				var f = _.find(ds.CH.gear,function(g){
					return g.rel_id+'' == mm+'';
				})
				if(f) return f;
			}else{
				var f = _.find(core.equipment,function(g){
					return g.name+'' == mm+'' && g.type+''!='16';
				})
				if(f) return JSON.parse(JSON.stringify(f));
			}
			return mm;
		})
	}
}
function getItemCount(e){
	var obj = $(e.target).parents('.overlay-parent')
	if($(obj).find('.inside.fa.team').length >0){
		
		if($(obj).find('.invcount').first().text()=='0'){
			var id = $(obj).attr('data-equip-id')
			var fil = _.filter(ds.CH.gear,function(g){
				return g.id+'' == id;
			})
			$(obj).find('.invcount').html(fil.length)
		}
	}
}
function showMarketOverlay(e){
	var obj = $(e.target).attr('data-action')? e.target : $(e.target).parents('[data-action]');
	var bp = $(e.target).parents('.overlay-parent');
	$(bp).find('.obj').removeClass('on')
	$(bp).find('.inn').addClass('ninja')
	
	var action = $(obj).attr('data-action');
	var m = $(bp).find('.market-overlay');
	if($(m).attr('data-viewed')==action){
		closeOverlay(e);		
	}else{
		$(obj).addClass('on');
		$(m).attr('data-viewed',action)
		$(m).find('.inn.'+action).removeClass('ninja')
		$(m).stop().animate({'height': 145,opacity:1});
		//if($(obj).hasAttribute('data-alt-action')
	}
}
function filterEquipment(e){
	var rare = $('.fabricator .searchbar #rare-select');
	var rVal = $(rare).val();
	$('.blueprint-wrap .blueprint').removeClass('ninja')
	if(rVal!='*'){
		$('.blueprint-wrap .blueprint').not('.rare-'+rVal).addClass('ninja');
	}
	$('.fabricator .typeselect select').each(function(index, sel) {
        var id = $(sel).attr('id');
		var val = $(sel).val();
		if(val!='*'){
			$('.fabricator #'+id+' .blueprint').not('.'+val).addClass('ninja');
		}
    });
}
function cancelBlueprint(e){
	message();
	var blue = $(e.target).parents('.blueprint')
	var m  = $(blue).find('.market-overlay').attr('data-viewed')
	var id = $(blue).attr('data-gear-id')
	mainQuery({
		//update the current item in inventory
		data:{'method':'removeMarket','gear_id':id},
		success: function(){
			var id = $(blue).attr('data-gear-id')
			var tar = false
			var f = _.find(ds.CH.marketplace,function(m){
				tar = _.find(m.items,function(n){
					return n.gear_id+'' == id;
				})
				return tar? true : false;
			})
			tar.sell = false
			tar.rent = false;
			tar.market = 0;
			tar = marketGear(tar,'market')
			var str = tmp.blueprint(tar)
			$(blue).replaceWith(str)
			//$(blue).find('.market-overlay .sell.inn').removeClass('onmarket')
			//$(blue).find('.toolbox .obj').removeClass('active')
			message('Off the Market')	
		}
	})
}

function getActiveTeamChar(){
	if(ds.CH.teams.length && $('.screen.active .frag-panel.in-use').length > 0){
		var id = $('.screen.active .frag-panel.in-use').attr('data-id');
		var t = _.find(ds.CH.teams,function(tt){
			return tt.char_id+'' == id;
		})
		if(t){
			return t;
		}
	}
	return ds.CH;
}
function adjustFragPercent(inn){
	var plus = parseInt($(inn).find('[name="fragment"]').val())
	var maxi = parseInt($(inn).attr('data-max'))
	var mini = parseInt($(inn).attr('data-init'))
	var left = maxi - mini;
	var prop = $('.fabricator.screen .actions.tabs .btn.on').attr('id')+'_frag'
	var useChar = getActiveTeamChar();
	prop = parseInt(useChar[prop])
	if(plus > prop){
		message('You do not have enough Frags',false, true)
		plus = prop
		$(inn).find('[name="fragment"]').val(prop)
	}else{
		message();
	}
	if(plus>left){
		plus = Math.min(left,plus);//Do't put in more than the total
		$(inn).find('[name="fragment"]').val(left)
	}
	
	var total = plus + mini;
	var per  = Math.ceil(((total-mini)/maxi)*100)
	
	$(inn).find('.proposedProgress').css({'width':per+'%'})
	$(inn).find('.plus').html(total)
	
}
function setPercent(inn,val){
	$(inn).find('[name="fragment"]').val(0)
	$(inn).find('.plus').html(val)
	$(inn).attr('data-init',val)
	var maxi = parseInt($(inn).attr('data-max'))
	var per  = Math.ceil(val/maxi*100)
	$(inn).parents('.blueprint.template').find('.progressbar').css({'width':per+'%'})
	$(inn).find('.proposedProgress').css({'width':'0','margin-left':per+'%'})
}
function completeBlueprint(e){
	var blue  = $(e.target).parents('.blueprint')
	var inn   = $(blue).find('.inn.complete')
	var plus  = fixInt($(inn).find('[name="fragment"]').val())
	var btn = $(e.target)
	if(plus>0){
		var skill = $('.fabricator.screen .actions.tabs .btn.on').attr('id')
		var prop  = skill+'_frag'
		$(btn).addClass('fa waiting')
		var id    = $(blue).attr('data-gear-id');	
		var total = $(inn).find('.plus').html()
		var atMax = fixInt($(inn).attr('data-max')) >= total
		var method = atMax? 'convertToBlueprint' : 'setFragComplete';
		var billcChar = getActiveTeamChar();
		var afterProp = billcChar[prop]-plus
		
		var track = atMax? {'action':'Complete Blueprint','char_id':ds.CH.char_id,'edit_char_id':billcChar.char_id,
			'info':JSON.stringify({'Blueprint':$(blue).find('.wbox.name .inside').text(),'ID':id})
		} : false;
		
		setPercent(inn,total);
		setFragTotal(afterProp,prop);
		
		mainQuery({
			data:{'method':method,'gear_id':id,'rel_info':total,'prop':prop,'cost':afterProp,'char_id':ds.CH.char_id,'billChar':billcChar.char_id,'track':track},
			success: function(html){
				//billcChar[prop] = afterProp;
				//$('.fabricator.screen .searchbar #'+skill+'.frag').html(ds.CH[prop])
				//!! Mark for later
				setFragTotal(afterProp,prop);
				var ini = $(inn).attr('data-init',total)
				$(inn).find('[name="fragment"]').val('0')
				///Reset other blueprint completion counts so that user cannot overspend
				$('.fabricator.screen .inn.complete').each(function(index, element) {
					adjustFragPercent(element)
	            });
	            var f = _.find(ds.CH.buildable,function(m){
					tar = _.find(m.items,function(n){
						return n.gear_id+'' == id;
					})
					return tar? true : false;
				})
				if(atMax){
					var bd = html[0]
					//ds.CH.temp = _.filter(ds.CH.temp,function(t){
						//return t.gear_id != id;
					//})
					bd = personalizeGear(bd, ds.CH)
					bd = marketGear(bd,'build')
					//ds.CH.blue.push(bd)
					tar = bd
					var bs = tmp.blueprint(bd)
					$(blue).replaceWith(bs)
					message('Blueprint Completed',false,true)
					$(btn).removeClass('waiting')
				}else{
					$(blue).find('.frag-info').text(total)
					//var f = _.find(ds.CH.buildable,function(m){
						//tar = _.find(m.items,function(n){
						//	return n.gear_id+'' == id;
						//})
						//return tar? true : false;
					//})
					tar.info = total;
					$(btn).removeClass('waiting')
					message('Fragment Updated',false,true)
				}
			}
		})
	}else{
		message('No Frag added')
		$(btn).removeClass('waiting')
	}
}
function deconstructBlueprint(e){
	var blue  = $(e.target).parents('.blueprint')
	var inn   = $(blue).find('.inn.deconstruct')
	var frag = $(blue).find('.inn.deconstruct [name="fragcount"]').val()
	var id = $(blue).attr('data-gear-id')
	var skill = $('.fabricator.screen .actions.tabs .btn.on').attr('id');
	var prop = skill+'_frag';
	ds.CH[prop] = parseInt(ds.CH[prop])+parseInt(frag)
	$('.fabricator.screen .searchbar #'+skill+'.frag').html(ds.CH[prop]);
	var track = {'action':'Desconstruct Blue','char_id':ds.CH.char_id,'info':
		JSON.stringify({'Gear':$(blue).find('.wbox.name .inside').text(),'gear_id':id,'frag':prop,'count':frag})
	};
	
	mainQuery({
		data:{'method':'deconstructBlueprint','gear_ids':id,'frag':prop,'count':frag,'char_id':ds.CH.char_id,'track':track},
		success: function(){
			$(blue).wrap('<div class="gear-wrap-single"></div>');
			var wrap = $(blue).parents('.gear-wrap-single');
			$(wrap).width($(blue).width())
			$(wrap).stop().animate({'width': 0},500,function(e){
				$(blue).parents('.gear-wrap-single').remove()
			});
		}
	})
}
function rentBlueprint(e){
	var blue = $(e.target).parents('.blueprint')
	//$(e.target).addClass('fa waiting')
	marketBlueprint('r',blue);
}
/*
function sellBlueprint(e){
	var blue = $(e.target).parents('.blueprint')
	marketBlueprint('s',blue);
}*/
function marketBlueprint(method,blue){
	message();
	var m  = $(blue).find('.market-overlay').attr('data-viewed')
	var id = $(blue).attr('data-gear-id')
	var p  = $(blue).find('.market-overlay [name=price]').val();
	var to = $(blue).find('.market-overlay [name=to]').val();
	mainQuery({
		data:{'method':'marketBlueprint','gear_id':id,'market':method+':'+p,'visible':to},
		success: function(){
			$(blue).find('.market-overlay .sell.inn').addClass('onmarket')
			$(blue).find('.toolbox .obj').removeClass('active')
			$(blue).find('.toolbox .obj.'+m).addClass('active')
			
			var tar = false
			var f = _.find(ds.CH.buildable,function(m){
				tar = _.find(m.items,function(n){
					return n.gear_id+'' == id;
				})
				return tar? true : false;
			})
			if(method=='r'){
				tar.rent=true;
			}else{
				tar.sell=true;
			}
			tar.market = p
			tar = marketGear(tar,'market')
			var str = tmp.blueprint(tar)
			$(blue).replaceWith(str)
			
			message('On the Market')	
		}
	})
}
function cancelGear(e){
	var m = $(e.target).parents('.market-line');
	$(m).removeClass('on-market')
	var id = $(m).attr('id')
	mainQuery({
		//update the current item in inventory
		data:{'method':'removeMarket','gear_id':id},
		success: function(){
			
			message('Off the Market')	
		}
	})
}
function sellGear(e){
	var m = $(e.target).parents('.market-line');
	var ids = $(m).attr('id').split(',')
	var p = $(m).find('[name="price"]').val()
	var to = $(m).find('[name="to"]').val()
	var f = _.find(ds.CH.marketplace,function(mp){
		return mp.rel_id == $(m).attr('id');
	})
	var id = ids[0]
	if(ids.length>1){
		ids.shift()
		f.rel_id = ids.join(',')
		f = JSON.parse(JSON.stringify(f))
		f.rel_id = id
	}
	
	f.market = p;
	f.sell = true;
	f.count = 1;
	f.visible = to;
	f.total = $(m).find('.totalcost').text()
	f.taxcost = $(m).find('.taxcost').text()
	var str = tmp.marketitem(f)
	if(ids.length>1){
		$(str).insertBefore(m)
		$(m).find('.countnum').text(ids.length)
		$(m).attr('id',ids.join(','))
		$(m).find('[name="price"]').val('0')
		$(m).find('[name="to"]').val('*')
	}else{
		$(m).replaceWith(str)
	}
	
	mainQuery({
		data:{'method':'marketBlueprint','gear_id':id,'market':'s:'+p,'visible':to},
		success: function(){		
			message('On the Market')	
		}
	})	
	$('.marketplace.screen .on-market [name=to]').each(function(index, e) {
		var v = $(e).attr('data-vis');
		$(e).find('option[value="'+ds.CH.char_id+'"]').css({'display':'none'})
		$(e).find('option[value="'+v+'"]').attr('selected','selected')
		var chartext = $(e).find('option[value="'+v+'"]').text()
		$(e).parents('.purchase-line ').find('.value.char').text(chartext)
    });
	//remove the first 
}
function buyGear(e){
	//message('Buying disabled until further notice')
	
	var m = $(e.target).parents('.market-line');
	var ids = $(m).attr('id').split(',')
	var p = $(m).find('[name="price"]').val()
	//var to = $(m).find('[name="to"]').val()
	var f = _.find(ds.CH.marketplace,function(mp){
		return mp.rel_id == $(m).attr('id');
	})
	var id = ids[0]
	if(ids.length>1){
		ids.shift()
		f.rel_id = ids.join(',')
		f = JSON.parse(JSON.stringify(f))
		f.rel_id = id
	}
	ds.CH.energy = fixInt(ds.CH.energy - f.total) 
	var b = safeBudget(f.salestax,'e');

	var track = {
		'action':'buy',
		'char_id':ds.CH.char_id,
		'edit_char_id':f.char_id,
		'pre':JSON.stringify({'buyer':ds.CH.energy,'station':core.options.station_energy}),
		'info':JSON.stringify({'gear':$(m).find('.eq-name').text(),'gear_id':id,'total':f.total,'price':f.market,'tax':f.salestax})
	};
	mainQuery({
		data:{'method':'transferGear', 'buyer':ds.CH.char_id, 'seller':f.char_id, 'gear_id':id, 'total':f.total, 'price':f.market, 'tax':f.salestax, 'track':track, 'budget':b},
		success: function(html){			
			f.total = 0;
			f.market = 0;
			f.sell   = false;
			f.count  = 1;
			f.visible= false;
			f.owner  = ds.CH.char_name;
			f.char_id  = ds.CH.char_id;
			f.salestax = 0;
			f.owned = true;
			var str = tmp.marketitem(f)
			if(ids.length>1){
				$('.gear-wrap .owned-panel').append(str) 
				//$(str).insertBefore(m)
				$(m).find('.countnum').text(ids.length)
				$(m).attr('id',ids.join(','))
			}else{
				$(m).remove()
				$('.gear-wrap .owned-panel').append(str) 
			}
			
			
			message('Gear Purchased',false,true);
			var gr = extendRelation(html,'gear');
			ds.CH.gear = ds.CH.gear? ds.CH.gear.push(gr[0]) : gr;
			buildInventory();
			checkMaretBalance()
			
			//change energy interface cost
			$('.marketplace .fixed-head .energy').text(ds.CH.energy)
			refreshMaintenence()
		},error:function(error){
			log(error)
			message('Not Purchased, Removed from Market');
		}
	})
}
function viewTeam(e){
	var did = $(e.target).attr('data-id')
	viewTeamID(did)
}
function viewTeamID(did){
	var td = _.find(ds.CH.teams,function(t){
		return t.char_id+'' == did+''
	})
	mainQuery({
		data:{'method':'getTeam','char_id':did},
		success: function(html){
			var team_list = html
			ds.editTM = html;
			mainQuery({
				data:{'method':'allUserCharacters'},
				success: function(html){
					core.autodata = html;
					var members = team_list.slice(1)
					/*members = _.reject(members,function(m){
						return m.char_id+'' == td.user_id+''
					})*/
					_.each(members,function(m){
						if(m.user_id+'' == team_list[0].user_id+'') m.on ='true'
					});
					td.temp = td.hasOwnProperty('temp')? td.temp : []
					td.blue = td.hasOwnProperty('blue')? td.blue : []
					td.gear = td.hasOwnProperty('gear')? td.gear : []
					td.lear = td.hasOwnProperty('lear')? td.lear : []
					td.learp = td.hasOwnProperty('learp')? td.learp : []
					var obj = {
						team: team_list[0],
						team_data: td,
						characters: html,
						members:members,
						member_names: _.pluck(members,'char_name'), 
						member_list:_.pluck(members,'char_name').join(','),
						member_ids:_.pluck(members,'char_id').join(','),
						skill_count: td.learn.length + td.learp.length,
						gear_count: td.gear.length + td.blue.length + td.temp.length 
					}
					var c = tmp.playerEditTeam(obj);
					toscreen('view-team',c)
					autoCompleteTeams2("#editTeamForm",html)	
				}
			})
		}
	})
}

function leaveTeam(){
	$('.secondary-prompt').stop().animate({height: $('.secondary-prompt .inner').height()},300)
}
function confirmLeaveTeam(e){
	//create a relationship object
	var team_id = $(e.target).parents('form').find('[name=char_id]').val()
	var obj = {
		'subject_id':ds.CH.char_id,
		'skill_id': team_id,
		'rel_active': '',
		'rel_key':'member'
	}
	saveRelation([obj],function(){
		ds.CH.teams = _.reject(ds.CH.teams,function(t){
			return t.char_id+'' == team_id+''
		})
		updateInterface();
		toscreen('source-code')
		message('You have left the team');
	})
		
}
function cancelLeaveTeam(){
	$('.secondary-prompt').stop().animate({height: 0},300)
}
function getEnergyTotal(){
	//Depending on what screen you are on check for the use button
	var useEnergy = ds.CH.energy;
	var alt = $('.screen.active .frag-panel.in-use .pan .energy');
	if(ds.CH.teams.length>0 
	&& $(alt).length > 0){
		useEnergy = fixInt($(alt).text())		
	}
	return useEnergy;
		
}
function setEnergyTotal(e){
	var useEnergy = ds.CH.energy;
	var alt = $('.screen.active .frag-panel.in-use .pan .energy');
	if(ds.CH.teams.length>0 && $(alt).length > 0){
		$(alt).text(e)
		if($(alt).parents('.frag-panel').hasClass('team')){
			var id = $(alt).parents('.frag-panel').attr('data-id');
			var t = _.find(ds.CH.teams,function(tt){
				return tt.char_id+'' == id+'';
			})
			if(t){
				t.energy = e;
			}else{
				log('cant find team loot')
			}
		}else{
			ds.CH.energy = e;
		}
	}else{
		$('.screen.active .frag-panel .pan .energy').text(e);
		ds.CH.energy = e;
	}	
}
function setFragTotal(e,prop){
	var alt = $('.screen.active .frag-panel.in-use .focus');
	if(ds.CH.teams.length>0 && $(alt).length > 0){
		$(alt).text(e)
		if($(alt).parents('.frag-panel').hasClass('team')){
			var t = getActiveTeamChar()
			if(t){
				t[prop] = e;
			}else{
				log('cant find team loot')
			}
		}else{
			ds.CH[prop] = e;
		}
	}else{
		$('.screen.active .frag-panel .pan .focus').text(e);
		ds.CH[prop] = e;
	}	
}
function takeItem(e){
	//add the item to the character in the data
	//create a new interface item for the target
	var ui = $(e.target).parents('.team-gear')
	var id = $(ui).attr('data-gear-id')

	
	
	
	
	
	mainQuery({
		data:{'method':'takeGear', 'buyer':ds.CH.char_id, 'gear_id':id},
		success: function(html){
			var tar = false;
			for(var i=0;i<ds.CH.teams.length;i++){
				var tm = ds.CH.teams[i]
				if(tm.hasOwnProperty('gear')){
					for(var j=0;j<tm.gear.length;j++){
						var gr = tm.gear[j]
						if(gr.rel_id==id){
							tar = gr;
							tm.gear.splice(j,1)
							break;
						}
					}
				}
			}
			
			$(ui).wrap('<div class="gear-wrap-single"></div>');
			var wrap = $(ui).parents('.gear-wrap-single');
			$(wrap).width($(ui).width())
			$(wrap).stop().animate({'width': 0},500,function(e){
				$(wrap).remove()
			});	
			//tar = personalizeGear(tar,ds.CH)
			tar.owner  = ds.CH.char_name;
			tar.owner_id  = ds.CH.char_id;
			tar.char_id  = ds.CH.char_id;
			tar.count = 1;
			//!!!MARK
			ds.CH.gear.push(tar)
			var install = ['0','6','9','11','13','15','16']
			if(tar.type+'' == '12'){
				tar = inventoryItemMap(tar,ds.CH)
				$('.gear-wrap.sleeves').append(tmp.sleeve(tar))
			}else if(install.indexOf(tar.type+'') ==-1){
				$('.gear-wrap.equipment').append(tmp.gear(tar))
			}else{
				$('.gear-wrap.mods').append(tmp.mod(tar))
			}
			buildInventory(true)
		}
	})
}
function buildBlueprint(e) {
    var bp = $(e.target).parents('.blueprint')
	var btn = e.target;
    if (!$(bp).hasClass('tooMuch')) {
		$(btn).addClass('fa waiting')
	    var energy = getEnergyTotal();
        var base = $(bp).attr('data-base');
        var cost = $(bp).attr('data-cost');
        var tax   = getTaxCost(base)
        var eq_id = $(bp).attr('data-equip-id')
        var label = $(bp).find('.wbox.name').text()
        var rent = $(bp).attr('data-rent');
		var renter = $(bp).attr('data-renter');
        var energyAfter = fixInt(energy - cost);
        var bioSleeve = $(bp).hasClass('biomedical') && $(bp).hasClass('sleeves');
        var info = '';
	       
		if(rent && renter){
			mainQuery({
				data:{'method':'paychar','char_id':renter,'field':'energy','value':rent},
				success: function(html){
				}
			})
		}
		if (bioSleeve) {
            var sleeves = characterBioSleeves(ds.CH);
            var storedSleeves = _.filter(sleeves, function(s) {
                return s.rel_info == 'stored';
            })
            info = core.options.cryo_count > storedSleeves.length ? 'stored' : 'expires';
        }
        var editLoot = ds.CH.teams.length > 0 ? $('.screen.active .frag-panel.in-use').attr('data-id') : 0;
        editLoot = editLoot? editLoot : 0; 
		var b = safeBudget(tax,'e');
		var track = {'action':'Build Item','char_id':ds.CH.char_id,'edit_char_id':editLoot,
			'info':JSON.stringify({'Item':label,'eq_id':eq_id,'status':info,'cost':cost,'tax':tax,'rent':rent})
		};
		var billChar = editLoot == 0? ds.CH.char_id : editLoot;
		mainQuery({
			data:{'method':'buildItem','eq_id':eq_id,'cost':cost,'tax':tax,'char_id':ds.CH.char_id,'billChar':billChar,'rel_info':info,'track':track,'budget':b},
			success: function(html){
        //buildItem(eq_id, cost, tax, info, function(html) {
	            var i = $('.blueprint[data-equip-id=' + eq_id + '] .invcount')
	            var iNum = fixInt($(i).first().text()) + 1;
	            $(i).text(iNum);
	            setEnergyTotal(energyAfter)
				checkMaretBalance()
	            var bd = html[0]
	            bd = personalizeGear(bd, ds.CH)
	            bd = marketGear(bd)
	            ds.CH.gear.push(bd)
	            buildInventory()
	            message(label + ' Built', false, true);
	            refreshMaintenence()
				$(btn).removeClass('waiting')
	        }, error: function() {
	            message('Error: Could not build.')
				$(btn).removeClass('waiting')
	        }
	    })
	    
    }
}
function saveConfig(){
	var edit = $('.edit-config.screen [name=edit-config]').val();
	var obj = {
		'char_id'		: $('.edit-config.screen [name=char_id]').val(),
		'config_id'		: $('.edit-config.screen [data-config-id]').attr('data-config-id'),
		'config_label'	: $('.edit-config.screen #config-label').val(),
		'skill'			: $('.edit-config.screen #known.relationbox').attr('data-json')		
	}
	obj.skill = JSON.parse(obj.skill)
	if(ds.CH.hasOwnProperty('banausic')){
		//unsave the banausic skill
		mainQuery({
			data:{'method':'inactiveSkill','char_id':obj.config_id,'rel_key':'skill','skill_id':ds.CH.banausic.id},
			success: function(html){
				ds.currentConfig.skill = _.reject(ds.currentConfig.skill,function(s){
					return s.id+'' == ds.CH.banausic.id+''
				})
			}
		})
	}
	if(ds.CH.hasOwnProperty('supernal')){
		//unsave the supernal skill
		mainQuery({
			data:{'method':'inactiveSkill','char_id':obj.config_id,'rel_key':'skill','skill_id':ds.CH.supernal.id},
			success: function(html){
				ds.currentConfig.skill = _.reject(ds.currentConfig.skill,function(s){
					return s.id+'' == ds.CH.supernal.id+''
				})
			}
		})
	}
	if($('#skill-soft').hasClass('on')){
		var sk = typeof obj.skill == 'string'? JSON.parse(obj.skill) : obj.skill;
		 var g = _.find(ds.CH.current_sleeve.module,function(m){
			return m.name.toLowerCase() =='skillsoft system'; 
		 })
		 var sid = $('#skill-soft .rules-wrap .rule-item.selected').attr('data-id')
		 mainQuery({
			data:{'method':'modGear','column':'module','info':sid,'gear_id':g.rel_id},
			success: function(html){
				
			}
		})
	}
	if(!edit){
		newConfig(obj,function(){
			ds.CH.configs.push(obj)
			message('Saved');	
		});		
	}else{
		saveConfigDB(obj,function(){
			var i =-1
			var f = _.find(ds.CH.configs,function(c){
				i++
				return c.config_id+'' == obj.config_id+''
			})
			//obj.skill = JSON.parse(obj.skill)
			obj.skill = _.filter(obj.skill,function(s){
				return s.rel_active == 'y';
			})
			f = obj;
			ds.CH.configs[i] = obj
			message('Saved')
		});
	}
}

function evalRelationBox(box){
	box = $(box).hasClass('relationbox')? box : $(box).parents('.relationbox');
	
	var subject = $(box).attr('data-subject')
	var m = [];
	$(box).find('.btn.with-description.on, .btn.with-description.selected, .btn.with-description.active, .btn.with-description.off, .btn.with-description.banausic, .btn.with-description.supernal').not('.stoplearn').each(function(index, element) {
		var key = $(box).attr('data-key');
		var dis = this;
		var c = $(dis).attr('class')
		
		if($(this).hasClass('unlearned')) key = 'learn';
		if($(this).hasClass('banausic'))  key = 'known';
		if($(this).hasClass('supernal'))  key = 'known';
		var obj = {
			'subject_id':	subject,
			'rel_key':		key,
			'skill_id':		$(dis).attr('data-id'),
			'rel_active':	!$(dis).hasClass('on') && !$(dis).hasClass('selected')? '' : 'y',
			'rel_info':		$(dis).attr('data-info')? $(dis).attr('data-info') : ''	
		}
		if($(this).hasClass('banausic'))  obj.rel_active = 'y';
		if($(this).hasClass('supernal'))  obj.rel_active = 'y';
		m.push(obj);
    });
	$(box).attr('data-json',JSON.stringify(m))
}
//CHECK IN FUNCTIONS
function startCheckin(){
	switchPanel('#main.panel',true)
	toscreen('main');
}
function buildCheckin(){
	//determine what interface to show
	if(localStorage['personalDevice']){
		doLogin(localStorage['personalDevice'])
	}else if(core.options.gamemode && core.options.gamemode!='false'){
		//check for cookie
		$('body').addClass('find-gps')
		compareLocationToSite(function(res){
			$('body').removeClass('find-gps')
			if(res==1){
				toscreen('checkin',false,true);
				thisEvent(function(){
					activeChars(function(){
						$('body').addClass('game-on');
						//screenHtml('checkin',tmp.checkin({characters:core.active}));						
						setWindow();
						showMainDisplay()
					})
				})
			}else{
				showMainDisplay()
			}
		})
	}else{
		showMainDisplay()
	}	
}
function showMainDisplay(){
	$('#main-panel').stop().animate({opacity:1},1000,function(){
		$('*').scrollTop(0)
	});
}
function stopLocation(){
	mapabort = true;
	setCookie('ds_onsite','false',5);
	$('body').removeClass('find-gps')
	$('#main-panel').stop().animate({opacity:1},1000);
}

var scanTimeout = false;
function toAdmin(){
	var str = tmp.admin({gamemode:core.options.gamemode});
	//$('.admin.screen').html(str);
	toscreen('admin',str);
}
function toActivity(){
	mainQuery({
		data:{'method':'allactivity'},
		success: function(html){
			_.each(html,function(h){
				h.times = h.time.split(' ')
				h.info	= h.info.replace(/[\{\}"]/g,'')
				h.pre	= h.pre.replace(/[\{\}"]/g,'')
				h.post	= h.post.replace(/[\{\}"]/g,'')
				h.info	= h.info.replace(/,/g,', ')
				h.pre	= h.pre.replace(/,/g,'\n')
				h.post	= h.post.replace(/,/g,'\n')
				return h;
			})
			var s = tmp.activityScreen(html)
			toscreen('all-activity',s);
		}
	})
	
}
function viewIndActivity(){
	var ids = [ds.CH.char_id];
	ids = ids.concat(_.pluck(ds.CH.teams,'char_id'));
	var obj = {}
	obj.years = []
	for(var i = 2016;i< new Date().getFullYear()+1;i++){
		obj.years.push({label:i})
	}
	obj.years.reverse()
	
	mainQuery({
		data:{'method':'indActivity','id':ids.join(',')},
		success: function(html){
			_.each(html,function(h){
				h.times = h.time.split(' ')
				h.info	= h.info.replace(/[\{\}"]/g,'')
				h.pre	= h.pre.replace(/[\{\}"]/g,'')
				h.post	= h.post.replace(/[\{\}"]/g,'')
				h.info	= h.info.replace(/,/g,', ')
				h.pre	= h.pre.replace(/,/g,'\n')
				h.post	= h.post.replace(/,/g,'\n')
				return h;
			})
			obj.data = html;
			var s = tmp.activityScreen(obj)
			toscreen('ind-activity',s);
		}
	})
}
function sParse(obj){
	try{
		obj = JSON.parse(obj)
	}catch(err){}
	
	return obj;
}
function gameOptions(){
	var str = tmp.gameOps(core.options);
	//$('.adminops.screen').html(str);
	toscreen('gameops',str);
}
function saveOps(e){
	var data = $(e.target).parents('.panel').find('form').serializeArray()
	var obj = {};
	_.each(data,function(m){
		obj[m.name] = m.value;
	})
	var before = _.pick(core.options,['tax_construct','tax_income','tax_sales'])
	var track = {'action':'Maintenence','char_id':ds.CH.char_id,'pre':JSON.stringify(before),'post':JSON.stringify(obj)};
	
	saveOptions(obj,track,function(){
		message('Options Saved',false,true);
		getOptions()
		refreshMaintenence()
	})
}
function compareNumbers(before,change){
	var after = _.clone(before);
	_.each(_.keys(change),function(k){
		if(change[k] && $.isNumeric(change[k])) after[k] = fixInt(after[k]) - fixInt(change[k])
	})
	return after;
}
function adminSaveOps(e){
	var data = $(e.target).parents('.panel').find('form').serializeArray()
	var obj = {};
	_.each(data,function(m){
		obj[m.name] = m.value;
	})
	//var before = _.pick(core.options,['tax_construct','tax_income','tax_sales'])
	var track = {'action':'ADMIN Options','char_id':ds.CH.char_id,'pre':JSON.stringify(core.options),'post':JSON.stringify(obj)};
	
	saveOptions(obj,track,function(){
		message('Options Saved',false,true);
		getOptions()
		refreshMaintenence()
	})
}
function addUser(){
	//$('.adduser.screen').html(tmp.addUser());
	toscreen('adduser',tmp.addUser())
}
function addTeam(){
	//$('.adduser.screen').html(tmp.addUser());
	
	mainQuery({
		data:{'method':'allUserCharacters'},
		success: function(html){
			html = _.sortBy(html,'char_name')
			toscreen('addteam',tmp.addTeam({characters:html}))
			core.autodata = html
			//setAutoCompleteCharacters("#newTeamForm .auto-list")
			
			//autoCompleteTeams("#newTeamForm",html)
			autoCompleteTeams2("#newTeamForm",html)
		}
	})
	
}
function autoCompleteTeams(gui,html){
	var e = $(gui).find('.auto-list')
	$(e).autocomplete({
		source: _.pluck(html,'char_name'),
		minLength: 0,
		focus: function() {
		    // prevent value inserted on focus
		    return false;
		},
		select: function( event, ui ) {
		   	var f = _.find(core.autodata,function(c){
			    return c.char_name == ui.item.value;
		    })
		    var hold = $(this).parents('.auto-hold')
		    if(f.type=='team'){
			    mainQuery({
					data:{'method':'getTeam',char_id:f.char_id},
					
					success: function(html){
						var fil = _.filter(html,function(h){
							var f = _.find(core.active,function(c){
								return c.char_id == h.char_id
							})
							return h.type =='char' && f;
						});
						//fil = _.intersection(fil,core.active);
						var team_id = _.pluck(fil,'char_id')
						var team_name = _.pluck(fil,'char_name')
						updateAutoUI(hold,team_id,team_name)
						$(gui).find('.auto-list').val("");
					}
				})

		    }else{
			    updateAutoUI($(this).parents('.auto-hold'),f.char_id,ui.item.value)
				this.value = "";
			}
			return false;
		}
	})
}
function autoCompleteTeams2(gui,html){
	var e = $(gui).find('.auto-list')
	_.each(html,function(h){
		h.label = h.char_name;
		h.value = h.char_id;
	})
	$(e).autocomplete({
		source: html,
		minLength: 0,
		focus: function() {
		    // prevent value inserted on focus
		    return false;
		},
		select: function( event, ui ) {
			var f = ui.item
		    var hold = $(this).parents('.auto-hold')
		    if(f.type=='team'){
			    //Get all members of team and add to bank
			    mainQuery({
					data:{'method':'getTeam',char_id:f.char_id},
					
					success: function(html){
						var fil = _.filter(html,function(h){
							var f = _.find(core.active,function(c){
								return c.char_id == h.char_id
							})
							return h.type =='char' && f;
						});
						//fil = _.intersection(fil,core.active);
						var team_id = _.pluck(fil,'char_id')
						var team_name = _.pluck(fil,'char_name')
						updateAutoUI(hold,team_id,team_name)
						$(gui).find('.auto-list').val("");
					}
				})

		    }else{
			    //updateAutoUI($(this).parents('.auto-hold'),f.char_id,f.char_name)
			    updateAutoUI2($(this).parents('.auto-hold'),[f])
				this.value = "";
			}
			return false;
		}
	}).autocomplete( "instance" )._renderItem = function( ul, item ) {
		return $( "<li>" )
	        .append( "<div value='"+item.user_id+"'>" + item.char_name +"</div>" )
	        .appendTo( ul );
    	};
  	
}
function updateAutoUI2(hold,chars){
	var ch_ids = _.unique(_.compact(_.pluck(chars,'char_id')));
	var names = _.unique(_.compact(_.pluck(chars,'char_name')));
	var sels = tmp.autoUserList2(chars);
	
	var terms = $(hold).attr('data-value');
	terms = terms? terms : '';
	terms = terms.split( /,\s*/ );
	if(_.isArray(names)){
		terms = terms.concat(names)
	}else{
		terms.push( names );
	}
	terms = _.unique(_.compact(terms));
	
	var ids = $(hold).attr('data-ids');
	ids = ids.split( /,\s*/ );
	if(_.isArray(ch_ids)){
		ids = ids.concat(ch_ids)
	}else{
		ids.push(ch_ids);
	}
	//ids.push( id ); //!!!!! Need to adjust this to ui.item.id or whatever
	ids = _.unique(_.compact(ids));
	
	$(hold).attr('data-ids',ids.join(','))
	$(hold).attr('data-value',terms.join(','))
	$(hold).find('.auto-html').append(sels)
}
function updateAutoUI(hold,id,names){
	var terms = $(hold).attr('data-value');
	terms = terms.split( /,\s*/ );
	if(_.isArray(names)){
		terms = terms.concat(names)
	}else{
		terms.push( names );
	}
	terms = _.unique(_.compact(terms));
	
	var ids = $(hold).attr('data-ids');
	ids = ids.split( /,\s*/ );
	if(_.isArray(id)){
		ids = ids.concat(id)
	}else{
		ids.push(id);
	}
	//ids.push( id ); //!!!!! Need to adjust this to ui.item.id or whatever
	ids = _.unique(_.compact(ids));
	var sels =  tmp.autoUserList(terms);
	
	$(hold).attr('data-ids',ids.join(','))
	$(hold).attr('data-value',terms.join(','))
	$(hold).find('.auto-html').html(sels)
}
function evalUserForm(form){
	message();
	var un = $(form).find('[name="user_name"]').val()
	var pw = $(form).find('[name="user_pass"]').val()
	if(!un){
		message('Please fill out a Username')
		return false;	
	}
	if(!pw){
		message('Please fill out a Password')
		return false;	
	}
	var valid = true;
	$(form).find('.req').each(function(index, el) {
		if(!$(el).val()) valid =  false;
    });
	if(!valid){
		message('Missing a field',false,true);
		return false;
	}
	return true;
}
function saveUser(){
	message();
	if(evalUserForm('#newUserForm')){
		var data = $('#newUserForm').serializeArray();
		var obj = {};
		_.each(data,function(m){
			obj[m.name] = m.value;
		})
		saveUserDB(obj,function(){
			message('User Saved');
		})
	}
}
function editUser(){
	message();
	if(evalUserForm('#editUserForm')){
		var data = $('#editUserForm').serializeArray();
		var obj = {};
		_.each(data,function(m){
			obj[m.name] = m.value;
		})
		var relations	= $('#editUserForm #background .relbox').map(function(index, element) {
			var rel 	= {};
			rel.subject_id	= obj.char_id;
			rel.rel_key		= 'background';
			rel.skill_id	= $(element).attr('id')
			rel.rel_active	= $(element).hasClass('off')? '' : 'y'
			var attr		= $(element).attr('data-count')
			if(typeof attr !== typeof undefined && attr !== false ){
				rel.rel_info    =  attr
			}
			return rel;
		}).get();
		obj.relations = relations;
		mainQuery({
			data:{'method':'updateCharacter','data':obj},
			success: function(html){
				message('Character Updated')
			}
		})
	}
}
function saveEditTeam(){
	var un = $('#editTeamForm').find('[name="admin_id"]').val()
	var name = $('#editTeamForm').find('[name="team_name"]').val()
	if(un && name){
		var data = $('#editTeamForm').serializeArray();
		var obj = {};
		_.each(data,function(m){
			obj[m.name] = m.value;
		})
		var relz = $('#editTeamForm .auto-hold').attr('data-ids').split(',')
		//relz.push(un)
		relz = _.uniq(relz)
		
		obj.members = _.map(relz,function(r){
			
			var nObj 		= {};
			nObj.subject_id	= r;
			nObj.rel_key	= 'member';
			nObj.skill_id	= obj.char_id;
			nObj.rel_active	= 'y'
			return nObj;
		}) 
		_.each(ds.editTM,function(t){
			if(t.type=='char'){
				var f = _.find(relz,function(r){
					return r == t.char_id;
				})
				if(!f){
					var nObj = {};
					nObj.subject_id	= t.char_id;
					nObj.rel_key	= 'member';
					nObj.skill_id	= obj.char_id;
					nObj.rel_active	= '';
					
					obj.members.push(nObj)
				}
			}
		})
		
		mainQuery({
			data:{'method':'editTeam','data':obj},
			success: function(html){
				if($('.screen.active').attr('data-screen')=='admin-editteam') toscreen('admin-char-panel')
				///check the screen you are on
				message('Team Saved');
				//update init
				ds.editTM = html;
				if($('.screen.active').attr('data-screen')=='view-team'){
					getTeams(function(){
						viewTeamID(obj.char_id)
					})
				}
			}
		})
	}
}
function saveTeam(){
	message();
	var un = $('#newTeamForm').find('[name="admin_id"]').val()
	var name = $('#newTeamForm').find('[name="team_name"]').val()
	if(un && name){
		var relz = $('#newTeamForm .auto-hold').attr('data-ids').split(',')
		//relz.push(un)
		relz = _.uniq(relz)
		
		var members = _.map(relz,function(r){
			var obj 		= {};
			obj.subject_id	= r;
			obj.rel_key		= 'member';
			obj.skill_id	= '@team'
			obj.rel_active	= 'y'
			return obj;
		})
		
		mainQuery({
			data:{'method':'createTeam','admin':un,'name':name,'members':members},
			success: function(html){
				toscreen('admin')
				core.teams.concat(html)
				message('Team Saved');
				
			}
		})
	}else{
		message('Enter name and Leader');
	}
}
function saveEditEquipment(){
	var obj = {};
	obj.char_id = $('#removeEquipmentForm [name="char_id"]').val();
	var items	= $('#removeEquipmentForm .relbox.off').map(function(index, element) {
		return $(element).attr('id');
	}).get();
	mainQuery({
		data:{'method':'deleteGear','gear_ids':items.join(',')},
		success: function(){
			ds.editCH.gear = _.reject(ds.CH.gear,function(g){
				return items.indexOf(g.rel_id+'') !=-1;
			})
			$('#removeEquipmentForm .relbox.off').remove()	
		}
	})

}
function saveEditSkills(){
	var obj = {};
	obj.char_id = $('#removeSkillsForm [name="char_id"]').val()
	var learned	= $('#removeSkillsForm #learn .relbox').map(function(index, element) {
		var rel 	= {};
		rel.subject_id	= obj.char_id;
		rel.rel_key		= 'learn';
		rel.skill_id	= $(element).attr('id')
		rel.rel_active	= $(element).hasClass('off')? '' : 'y'
		var attr		= $(element).attr('data-count')
		if(typeof attr !== typeof undefined && attr !== false ){
			rel.rel_info    =  attr
		}
		return rel;
	}).get();
	var known	= $('#removeSkillsForm #known .relbox').map(function(index, element) {
		var rel 	= {};
		rel.subject_id	= obj.char_id;
		rel.rel_key		= 'known';
		rel.skill_id	= $(element).attr('id')
		rel.rel_active	= $(element).hasClass('off')? '' : 'y'
		var attr		= $(element).attr('data-count')
		if(typeof attr !== typeof undefined && attr !== false ){
			rel.rel_info    =  attr
		}
		return rel;
	}).get();
	var learnp	= $('#removeSkillsForm #learnp .relbox').map(function(index, element) {
		var rel 	= {};
		rel.subject_id	= obj.char_id;
		rel.rel_key		= 'learnp';
		rel.skill_id	= $(element).attr('id')
		rel.rel_active	= $(element).hasClass('off')? '' : 'y'
		var attr		= $(element).attr('data-count')
		if(typeof attr !== typeof undefined && attr !== false ){
			rel.rel_info    =  attr
		}
		return rel;
	}).get();
	var psion	= $('#removeSkillsForm #psion .relbox').map(function(index, element) {
		var rel 	= {};
		rel.subject_id	= obj.char_id;
		rel.rel_key		= 'psion';
		rel.skill_id	= $(element).attr('id')
		rel.rel_active	= $(element).hasClass('off')? '' : 'y'
		var attr		= $(element).attr('data-count')
		if(typeof attr !== typeof undefined && attr !== false ){
			rel.rel_info    =  attr
		}
		return rel;
	}).get();
	var dat = known.concat(psion,learned,learnp);
	
	saveRelation(dat,function(){
		message('Skills + Psionics Updated');
		ds.editCH.known = extendRelation(known,'known');
		ds.editCH.psion = extendRelation(psion,'psion');
		ds.editCH = formatChar(ds.editCH);
		if(ds.editCH.char_id == ds.CH.char_id){
			ds.CH = ds.editCH
			updateInterface();
		}
		$('#removeSkillsForm .relbox.off').remove();
	})
}

function adimRemoveSkills(){
	_.each(ds.editCH.learn,function(k){
		k.name = k.sk_name;
	})
	_.each(ds.editCH.known,function(k){
		k.name = k.sk_name;
	})
	_.each(ds.editCH.learnp,function(k){
		k.name = k.psi_name;
	})
	_.each(ds.editCH.psion,function(k){
		k.name = k.psi_name;
	})
	var t = tmp.removeSkills({ch: ds.editCH, core:core});
	toscreen('admin-editchar',t)
}
function adimRemoveEquipment(){
	var editCOPY = JSON.parse( JSON.stringify(ds.editCH) );
	_.each(editCOPY.gear,function(k){
		k.id = k.rel_id;
		if(k.info){
			k.name = k.name+'('+k.info+')';
		}
	})
	var t = tmp.removeEquipment({ch: editCOPY, core:core});
	toscreen('admin-editequip',t)
}

function alwaysScan(target,process){
	playerStatus(target,'init')
	beginCapture($(target).find('.scanner'),function(k){
		$(target).find('.status').removeClass('scan')
		process(k,function(stat,output){
			playerStatus(target,stat,k)
			var m = _.map(ds.recentScans,function(r){
				return {'label':r};
			})
			if(output){
				$(target).find('.result').prepend(
				'<div id="id_1" data-id="1" class="btn next figure fa'+(stat=='error' || stat=='dup'?' selected':'')+'">\
					<div class="inner">\
						<div class="inside label">'+output+'</div>\
					</div>\
				</div>')
			}
			//selectListHtml(m,$(target).find('.result'),5)
		})
		scanTimeout = window.setTimeout(function(){
			alwaysScan(target,process);
		},3000);
		
	})	
}
///Also log who has claimed the loot
function processQr(k,send){
	var char_ID = ds.CH.char_id;
	if($('#frag-screen #team-drop select').length){
		char_ID = $('#frag-screen #team-drop select').val()
	}

	lootByValue(k,function(l){
		var ind = ds.recentScans.indexOf(k);
		if(l.length==0 && ind ){
			send('error');				
		}else if(ind>-1 || l[0].claimed == 1){
			send('dup');
		}else{
			var loot  = l[0].skill_id.split(':');
			if(loot[0]=='e'){
				var yeild = fixInt(loot[1])
				if(ds.CH.exceptions.miner) yeild = Math.floor((yeild*115)/10)/10;
				var inTax = fixInt(core.options.tax_income);
				var tx = Math.floor((yeild * inTax)/10)/10 //Gives a number to the nearest .1
				tx = Math.max(tx,0)//Probably redundant but maybe there is a negative on accident
				if(ds.CH.exceptions.criminal) tx = 0;
				var aftertax = yeild - tx;
				var pre   = {"energy":ds.CH.energy,"station":core.options.station_energy}
				var info  = {"qr":k,"energy":yeild,"tax":tx}
				
				var budget= {'event':ds.currentEvent.event_id,'earned':tx}
				var claim = {'char_id':char_ID, 'field':'energy', 'value':aftertax, 'tax':tx, 'info':JSON.stringify(info), 'pre':JSON.stringify(pre)}
				mainQuery({
					data:{'method':'applyLoot','char_id':ds.CH.char_id,'lines':[claim],'budget':budget},
					success: function(html){
						refreshMaintenence()
					}
				})
				send('success','+'+aftertax+' Energy ('+yeild+'-'+inTax+'%)');
				
			}else if(loot[0]=='f'){
				var eq = equip_skills[fixInt(loot[1])]
				field = eq.frag;
				var pre   = {}
				pre[eq.frag] = ds.CH[eq.frag];
				var info  = {'qr':k,'frag':eq.frag}
				var claim = {'char_id':char_ID,'field':eq.frag,'value':'1','info':JSON.stringify(info),'pre':JSON.stringify(pre)}
				mainQuery({
					data:{'method':'applyLoot','char_id':ds.CH.char_id,'lines':[claim]},
					success: function(html){
					}
				})
				send('success','+1 '+eq.short+' Frag');
			}else if(loot[0]=='s'){
				var id = loot[1]
				var skill = _.find(core.skills,function(s){
					return s.sk_id+'' == id+'';
				})
				var learn = _.find(ds.CH.learn,function(s){
					return s.sk_id+'' == id+'';
				})
				var know = _.find(ds.CH.skill,function(s){
					return s.sk_id+'' == id+'';
				})
				if(learn){
					send('dup','-Skill: '+skill.sk_name+', Already aquired');
				}else if(know){
					send('dup','-Skill: '+skill.sk_name+', Already Learned');
				}else{
					mainQuery({
						data:{'method':'learnSkill','char_id':char_ID,'skill_id':id,'rel_key':'learn'},
						success: function(html){
							var obj = _.extend(html[0],skill)
							ds.CH.learn.push(obj)
							updateInterface()
						}
					})
					send('success','+SKILL: '+skill.sk_name+' Aquired');
				}
				
			}else if(loot[0]=='p'){
				var id = loot[1]
				var psion = _.find(core.psion,function(p){
					return p.psi_id+'' == id+'';
				})
				var learn = _.find(ds.CH.learnp,function(p){
					return p.psi_id+'' == id+'';
				})
				var know = _.find(ds.CH.psion,function(p){
					return p.psi_id+'' == id+'';
				})
				if(learn){
					send('dup','-PSIONIC: '+psion.psi_name+', Already aquired');
				}else if(know){
					send('dup','-PSIONIC: '+psion.psi_name+', Already Learned');
				}else{
					mainQuery({
						data:{'method':'learnSkill','char_id':char_ID,'skill_id':id,'rel_key':'learnp'},
						success: function(html){
							var obj = _.extend(html[0],psion)
							ds.CH.learnp.push(obj)
							updateInterface()
						}
					})
					send('sucess','+PSIONIC: '+psion.psi_name+' Aquired');
				}
			}else{
				send('error');
			}
			ds.recentScans.push(k)
			claimLoot(k);
			//send('success','OUTTEXT+'+k);
		}
	});
}
var scanHold = false;
function staffProcessQr(k,send){
	lootByValue(k,function(l){
		if(l.length==0){
			if(scanHold && scanHold ==k){
				var sk_id = $('.qr-energy-select').val()
				var label = '+'+$('.qr-energy-select option:selected').text()+' '+$('.qr-option-select').val()
				switch($('.qr-option-select').val()){
					case 'Skill':
					sk_id = $('.qr-skill-select').val()
					label = $('.qr-skill-select option:selected').text()
					break;
					
					case 'Frag':
					sk_id = $('.qr-frag-select').val()
					label = 'FRAG, '+$('.qr-frag-select option:selected').text()
					break;
					
					case 'Psion':
					sk_id = $('.qr-psion-select').val();
					label = 'Psionic, '+$('.qr-psion-select option:selected').text()
					break;
				}
				ds.recentScans.push(k)
				ingestQr(sk_id,k,function(html){
				send('success',label+': '+k)
			})
			}else{
				send('partial')
				scanHold=k	
			}
		}else{
			send('dup','<b>QR:</b> '+k+', <b>VALUE:</b> '+l[0].skill_id )
		}
	});
}
function fragScanner(){
	ds.recentScans = []
	toscreen('frag-scanner');
}
//Staff qr ingester
function qrScanner(){
	$('.gr-scanner-select').html('')
	_.each(equip_skills,function(sk){
		$('.qr-frag-select').append('<option value="f:'+sk.id+'">'+sk.short+'</option>')
	})
	_.each(core.skills,function(sk){
		$('.qr-skill-select').append('<option value="s:'+sk.id+'">'+sk.sk_name+'</option>')
	})
	_.each(core.psion,function(p){
		$('.qr-psion-select').append('<option value="p:'+p.id+'">'+p.psi_name+'</option>')
	})
	ds.recentScans = []
	useScanner();
	toscreen('admin-scanner');
}

function generateBlueprint(e){
	message();
	var id = false;
	var s = $('.admin-blueprint.screen')
	var method = 'Random';
	var chosen = false;
	if($(s).find('.togglegenerate #R').hasClass('on')){
		//random
		var rarity = $('#rarity .btn.on').attr('id')
		var order = $('.eqskillList .eqskill.on').attr('data-order')
		chosen = randomBlueprint(order,rarity)
		id = chosen.id;
	}else{
		//specific
		method = 'Specific';
		var it = $('.itemgroup').not('.ninja').find('.item.on').not('.ninja')
		if(it.length>0){
			id = $(it).attr('data-id')
			chosen = _.find(core.equipment,function(e){
				return e.id == id
			})
		}else{
			message('No Item Selected',false,true)
		}
	}
	
	if(id){
		var type = $(e.target).attr('data-type')
		var track = {'action':'Admin Add Gear','char_id':ds.CH.char_id,'edit_char_id':ds.editCH.char_id,
			'info':JSON.stringify({'Method':method,'gear':chosen.name,'gear_id':id,'type':type})
		};
		assignBluePrint(ds.editCH.char_id,id,type,track,function(html){
			var temps = _.filter(html,function(t){
				return t.rel_key == 'temp';
			})
			var blues = _.filter(html,function(b){
				return b.rel_key == 'blue';
			})
			var gear = _.filter(html,function(b){
				return b.rel_key == 'gear';
			})
			ds.editCH.temp = extendRelation(temps,'temp')
			ds.editCH.blue = extendRelation(blues,'blue')
			ds.editCH.gear = extendRelation(gear,'gear')
			if(ds.editCH.char_id == ds.CH.char_id){
				ds.CH.temp = ds.editCH.temp;
				ds.CH.blue = ds.editCH.blue;
				ds.CH.gear = ds.editCH.gear;
				buildInventory();
			}
			var typestr = 'Blueprint';
			switch(type){
				case 'gear':
				typestr = 'Gear';
				break;
				case 'temp':
				typestr = 'Template';
				break;
			}
			
			message(typestr+' Created',false,true)
		});
		
	}
}
function randomBlueprint(skill,rarity){
	var items = [];
	if($.isNumeric(skill)){
		skill = fixInt(skill)
		items = equip_skills[skill].items;
	}else{
		var eq = _.find(equip_skills,function(s){
			return skill.toLowerCase() == s.name.toLowerCase() || skill.toLowerCase() == s.short.toLowerCase()
		})
		items = eq.items;
	}
	items = _.filter(items,function(i){
		return i.rarity == rarity.toUpperCase();
	})
	var draw = Math.floor(Math.random() * (items.length))
	var choice = items[draw]
	return choice;
}

function playerStatus(target,stat,k){
	switch(stat){
		case 'init':
		$(target).find('.status').removeClass('dup success error partial')
		$(target).find('.status').addClass('scan')
		message('Scan in Progress');
		break;
		
		case 'dup':
		$(target).find('.status').addClass('dup')
		message('Already Scanned')
		//$(target).find('.result').append('<br/>Already Scanned')	
		break;
		
		case 'error':
		case 'invalid':
		$(target).find('.status').addClass('error')
		//$(target).find('.result').append('<br/>INVALID: '+k)
		message('Invalid: '+k)
		break;
		
		case 'partial':
		$(target).find('.status').addClass('partial')
		message('Scan Again')
		//$(target).find('.result').append('<br/>'+k);
		break
		
		case 'success':
		$(target).find('.status').addClass('success')
		//$(target).find('.result').append('<br/>'+k);
		message('Scan Success');
		break;
	}
}
function checkValidScans(s){
	var scanList = ['adam','heidi','steve'];
	return scanList.indexOf(s)==-1? false : true;
}
function viewCharCard(id){
	updateTemplate('card')
	var useDat    = ds.currentConfig;
	if(id) useDat = ds.CH.configs[id];
	var copy = JSON.parse(JSON.stringify(ds.CH))
	delete copy.configs
	useDat = _.extend(copy,useDat);
	
	useDat.active = []
	useDat.active = JSON.parse(JSON.stringify(useDat.skill))
	if(useDat.banausic && typeof useDat.skillsoft=='object') useDat.active.push(useDat.banausic);
	if(useDat.supernal && typeof useDat.skillsoft=='object') useDat.active.push(useDat.supernal);
	if(useDat.skillsoft && typeof useDat.skillsoft=='object') useDat.active.push(useDat.skillsoft);
	_.each(useDat.active,function(a){
		a.attrname = getAttrName(a)
		
	})
	_.each(useDat.psion,function(p){
		p.attrname = getAttrName(p)
	})
	
	useDat.activeWear = _.filter(ds.CH.gear,function(g){return g.rel_info =='equip' && g.type+'' !='12'})
	_.each(useDat.activeWear,function(u){		
		u.module = modsTo(u.module,'allobject')
		u.chargable = fixInt(u.battery) || u.supplement;
	})
	useDat.active = _.sortBy(useDat.active,function(s){
		return s.attrname+'_'+s.sk_name
	})
	useDat.psion = _.sortBy(useDat.psion,function(s){
		return s.attrname+'_'+s.psi_name
	})
	useDat.armor = 0;
	useDat.hp = fixInt(ds.CH.current_sleeve.extra)
	var armor = _.find(useDat.activeWear,function(a){
		return a.type == '10';
	})
	if(armor){
		useDat.armor+=5;
		if(armor.rarity =='R') useDat.armor+=5;
		var ff = _.find(armor.module,function(m){
			return m.toLowerCase()=='structural armor enhancement';
		})
		if(ff) useDat.armor+=3;
	}
	ds.CH.current_sleeve.module = _.compact(ds.CH.current_sleeve.module)
	_.each(ds.CH.current_sleeve.module,function(m){
		
		if(m.name.toLowerCase()=="enhanced constitution"){
			useDat.hp+=2;
		}
		if(m.name.toLowerCase()=="dermal armor"){
			useDat.hp-=1;
			useDat.armor+=3;
		}
	})
	useDat.hp = Math.min(useDat.hp,10)
	if(ds.CH.current_sleeve.name.toLowerCase() == 'bomyx') useDat.armor +=4;
	useDat.armor = Math.min(useDat.armor,10);
	var str = tmp.card(useDat);
	toscreen('card','<div class="panel">'+str+'</div>')
}
function selectedSkills(list,name){
	var fil = _.filter(list,function(t){return t.active=='y';})
	fil = _.map(fil,function(m){
		n = _.clone(m);
		n[name] = true;
		return n;
	});
	return fil;
}
function saveExtraSkills(){
	if(ds.CH.exceptions.extra_skills){
		if(ds.CH.exceptions.extra_skills<2){
			var m = $('.known.screen #known.extra_skills .marker')
			var bg = findSpecial('extra_skills',ds.CH.background,true)
			var e = ds.CH.exceptions.extra_skills;
			var u = $.isNumeric(e)? e : 0;
			var a = 2-u;
			var count = u+m.length
			$(m).removeClass('marker unlearned on').addClass('aquired')
			mainQuery({
				data:{'subject_id':ds.CH.char_id,'method':'updateBG','skill_id':bg.id,'rel_info':count},
				success: function(html){
					//$('.known.screen #known.extra_skills').find('.unlearned.on,.unlearned.selected').removeClass('selected on unlearned')
				}
			})
			var skilled = findSpecial('extra_skills',ds.CH.background)
			skilled[0].info = count
			skilled[0].rel_info = count
			ds.CH.exceptions.extra_skills = count
			if(ds.CH.exceptions.extra_skills ==0)ds.CH.exceptions.extra_skills = true
		}
	}
}
function evalKnown(){
	//DESELECT ALL SKILLS THAT ARE REQUIRED BY DESELECTED SKILL
	var psion = $('.known.screen #psion')
	$(psion).find('.drop.hasmore .fa').removeAttr('disabled')
	
	var sk = $('.known.screen #known').find('.btn.with-description.on,.btn.with-description.selected').not('.exempt').length
	var ps = $('.known.screen #psion').find('.btn.with-description.on,.btn.with-description.selected').not('.exempt').length
	
	var m = fixInt($('.known.screen .known-max').text())
	
	if(ds.CH.exceptions.knack || ds.CH.exceptions.aionly){
		//hide all psonics  that are not selected
		var pps = $('.known.screen #psion').find('.btn.on, .btn.selected')
		if(ds.CH.exceptions.knack && pps.length>0){
			 $('.known.screen #psion .btn.with-description').not('.on,.selected').attr('disabled','disabled')
		}else if(ds.CH.exceptions.aionly && pps.length >= ds.CH.exceptions.aionly){
			$('.known.screen #psion .btn.with-description').not('.on,.selected').attr('disabled','disabled')
		}else{
			$('.known.screen #psion .btn.with-description').removeAttr('disabled')
		}
	}
	$('.known.screen .known-count').html(sk+ps)
	if((sk+ps)>=m){
		$('.known.screen .skill-table .btn').not('.on,.selected,.save,.exempt').attr('disabled','disabled')	
		$('.known.screen .creation .save').removeAttr('disabled')//Character creation must have all skills saved at once
	}else{
		
		$('.known.screen .skill-table .btn').not('.on,.selected,.save,.exempt').removeAttr('disabled')
		$('.known.screen .creation .save').attr('disabled','disabled')//Character creation must have all skills saved at once
	}
	$('.known.screen').find('.banausic.btn,.supernal.btn').removeAttr('disabled');
	if(ds.CH.exceptions['nation-banausic'] && !ds.CH.banausic){
		$('.known.screen #known [data-attr="Discipline"][data-level="1"]').each(function(index, e) {
           $(e).removeAttr('disabled')
		   $(e).css({'opacity':1})
		    if($(e).find('.inner .banausic').length==0){
				$(e).find('.inner').append('<div class="banausic btn white">Banausic Skill</div>')
			}
        });
	}
	if(ds.CH.exceptions['nation-supernal'] && ! ds.CH.supernal){
		$('.known.screen #known [data-attr="Cunning"][data-level="1"]').each(function(index, e) {
            $(e).removeAttr('disabled');
			$(e).css({'opacity':1})
			if($(e).find('.inner .supernal').length==0){
				$(e).find('.inner').append('<div class="supernal btn white">Supernal Skill</div>')
			}
        });
	}
	
	//Evaluate ego traits for psionics
	var tt = 0;
	var tc = 0;
	var td = 0;
	$(psion).find('.btn.with-description.on,.btn.with-description.selected').not('.exempt').each(function(i,e){
		if($(this).attr('data-attr')=='Discipline' || $(this).attr('data-info')== '1'){
			td++;
		}else if($(this).attr('data-attr')=='Tolerence' || $(this).attr('data-info')== '0'){
			tt++
		}else if($(this).attr('data-attr')=='Cunning' || $(this).attr('data-info')== '2'){
			tc++
		}		
	})
	$('.known.screen .actions.ego .discipline .min').text(td)
	$('.known.screen .actions.ego .cunning .min').text(tc)
	$('.known.screen .actions.ego .tolerence .min').text(tt)
	var md = fixInt($('.known.screen .actions.ego .discipline .max').text())
	var mc = fixInt($('.known.screen .actions.ego .cunning .max').text())
	var mt = fixInt($('.known.screen .actions.ego .tolerence .max').text())
	if(td>=md){
		$(psion).find('.btn[data-attr="Discipline"]').not('.on, .selected').attr('disabled','disabled')
		$(psion).find('.drop.hasmore .fa.Discipline').attr('disabled','disabled')
	}
	if(tc>=mc){
		$(psion).find('.btn[data-attr="Cunning"]').not('.on, .selected').attr('disabled','disabled')
		$(psion).find('.drop.hasmore .fa.Cunning').attr('disabled','disabled')
	}
	if(tt>=mt){
		$(psion).find('.btn[data-attr="Tolerence"]').not('.on, .selected').attr('disabled','disabled')
		$(psion).find('.drop.hasmore .fa.Tolerence').attr('disabled','disabled')
	}
	//check each trait, see if it's bigger than max, if so, disable those
	
	evalRelationBox($('.known.screen .relationbox.known'));
	evalRelationBox($('.known.screen .relationbox.psion'));
}
function evalEgo(){
	evalRelationBox($('.edit-config.screen .relationbox#known'));
	var p_used_d = getAttrCount(1,ds.CH.psion);
	var p_used_c = getAttrCount(2,ds.CH.psion);
	var used_d = $('.edit-config.screen #known .btn.selected[data-attr="Discipline"]').length;
	var used_c = $('.edit-config.screen #known .btn.selected[data-attr="Cunning"]').length
	
	used_d = parseInt(used_d + p_used_d);
	used_c = parseInt(used_c + p_used_c);
	
	var dMax = ds.CH.ego_discipline;
	var cMax = ds.CH.ego_cunning;
	if(ds.CH.exceptions.soldier){
		cMax--;
		cMax = Math.max(cMax,1)
	}
	if(ds.CH.exceptions.scholar){
		dMax--;
		dMax = Math.max(dMax,1)
	}
	if(ds.CH.exceptions.strength_of_mind){
		dMax--;
		cMax--;
	}
	var extraSkills = 0;
	if(ds.CH.exceptions.extra_skills){
		var cOverage = Math.max(+used_c - cMax,0);
		var dOverage = Math.max(+used_d - dMax,0);
		var overage = +cOverage + +dOverage;
		extraSkills = 2 - overage;
		$('.edit-config.screen #extra-skilled').text(Math.min(overage,2))
		used_d = Math.min(used_d,dMax);
		used_c = Math.min(used_c,cMax);
	}
	$('.edit-config.screen .actions.left .discipline .min').text(used_d);
	$('.edit-config.screen .actions.left .cunning .min').text(used_c);
	$('.edit-config.screen #known .btn').removeAttr('disabled');
	
	
	if(used_d >= dMax && extraSkills < 1){
		$('.edit-config.screen #known .btn[data-attr=Discipline]').not('.selected').attr('disabled','disabled')
	}
	if(used_c >= cMax && extraSkills < 1){
		$('.edit-config.screen #known .btn[data-attr=Cunning]').not('.selected').attr('disabled','disabled')
	}
}
function evalPrereqs(box){
	var gets = $(box).find('.with-description.selected,.with-description.on,.rule-item.selected, .with-description[data-info="supernal"],.with-description[data-info="banausic"]').map(function(index, element) {
		return $(element).attr('data-id');
	}).get()
	var fil = _.filter(core.skills,function(cs){
		return gets.indexOf(cs.id+'')!=-1
	})
	fil = _.sortBy(fil,'sk_prereq_id')
	var ch = {ego_cunning:ds.CH.ego_cunning, ego_discipline:ds.CH.ego_discipline, ego_tolerence:ds.CH.ego_tolerence, known:fil, exceptions:ds.CH.exceptions};
	$(box).find('.with-description').each(function(index, element) {
		var know = knowableSkillClass(ch,$(element).attr('data-id'))
		$(element).removeClass('stoplearn noattr noskill')
		if(know){
			$(element).addClass(know)
			$(element).removeClass('selected')	
		}
	});	
}
function biologicalSleeves(char){
	var bioengineer = _.find(ds.CH.known,function(s){return s.special == 'bio'});
	var fil = _.filter(equip_types[13],function(b){
		if(b.skill!=2) return false; //If no rarity then it cannnot be a sleeve
		if(ds.CH.birth_obj.id == b.id) return true;
		if(!b.rarity || !engineer) return false;
		if(b.avalable.toLowerCase() == 'a' && b.b_type.indexOf('s')!=-1) return true;
		return false;
	})
	return _.sortBy(fil,'cost');
}
function configSelectActions(){
	$('body').on('click','#config-select .btn.next',function(e){
		if(!$(e.target).hasClass('activate-config')){
			var dis = $(this).hasClass('.btn')? this : $(this).parents('.btn')
			var id = fixInt($(this).attr('data-id').replace(/id_/,''));
			editConfig(id);
		}
	})
	$('body').on('click','#config-select .btn.next .activate-config',function(){
		var id = fixInt($(this).parents('.btn').attr('data-id').replace(/id_/,''));
		//editConfig(id);
		$('#config-select .btn').removeClass('active selected')
		$(this).parents('.btn').addClass('selected')
		mainQuery({
			data:{'method':'activeConfig','char_id':ds.CH.char_id,'config_id':id},
			success: function(){
					
			}
		})
	})
	$('body').on('click','.skill-table .icon',function(){
		//get detaisl
		var line = $(this).parents('.btn.next').first();
		var id = fixInt($(line).attr('data-id'));
		var box = $(this).parents('.relationbox');
		var source = core.skills
		var type = 'known'
		if($(box)){
			switch($(box).attr('data-key')){
				case 'known':
				break;
				
				case 'body':
				type ='race'
				source = core.races;
				break;
				
				case 'psion':
				type = 'psion'
				source = core.psion;
				break;
			}
		}
		var sk = _.find(source,function(s){
			return s.id == id;
		});
		sk = JSON.parse(JSON.stringify(sk))
		
		sk.type = type
		sk.owner = $(line).attr('data-owner')? $(line).attr('data-owner') : ds.CH.char_id
		sk.team = $(line).attr('data-owner')
		sk.aquired = $(line).hasClass('aquired') && !$(line).hasClass('on') && $(line).parents('.screen').find('.actions.creation').length == 0
		if(sk.team){
			//check to see if user is leader
			var teamAdmin = _.find(ds.CH.teams,function(t){
				return t.char_id+'' == $(line).attr('data-owner')+'' && t.isAdmin;
			})
			if(teamAdmin){
				sk.team = false;
			}
		}
		//data-owner
		var st = tmp.skillFull(sk)
		if($(this).parents('.known').length!=0){
			//$('.known-details.screen').html(st)
			toscreen('known-details',st)
		}else{
			//$('.details.screen').html(st)
			toscreen('details',st)
		}
		if(sk.aquired){
			mainQuery({
			data:{'method':'allSimpleCharacters'},
				success: function(html){
					
					setAutoCompleteCharacters(core.autodata)
					$('.screen.known-details [name=character-to]').each(function(i,e){
						var id = $(line).attr('data-owner')
						var src = _.reject(html,function(c){
							return c.char_id+'' == id+'';
						})
						$(e).autocomplete({
							source: _.pluck(src,'char_name'),
							minLength: 0,
							focus: function() {
							    // prevent value inserted on focus
							   return false;
							},
							select: function( event, ui ) {
								 var hold = $(this).parent().addClass('fa precheck')
								return ui.item.value;
							}
						});
					})
				}
			})
		}
		return false;
	})
	$('body').on('click','.overlay-parent .icon',function(e){
		var b = $(e.target).parents('.overlay-parent')
		var eq = fixInt($(b).attr('data-equip-id'));
		var gid = $(b).attr('data-gear-id')
		var f = false;
		if(gid && !$(b).hasClass('blueprint')){
			if($(b).hasClass('sleeves')){
				f = _.find(ds.CH.sleeves,function(g){
					return g.rel_id+'' == gid+'';
				});
				if(f.hasOwnProperty('module')){
					f.module = modsTo(f.module,'allobject')
				}
			}else if($(b).hasClass('module')){
				f = _.find(ds.CH.modz,function(g){
					return g.rel_id+'' == gid+'';
				});
				
			}else{
				f = _.find(ds.CH.gearz,function(g){
					return g.rel_id+'' == gid+'';
				});
				if(f && f.hasOwnProperty('module')){
					f.module = modsTo(f.module,'allobject')
				}
			}
		}else if($(b).hasClass('sleeves')){
			f = _.find(core.equipment,function(g){return g.id == eq});
			f = inventoryItemMap(f,ds.CH)
		}else{
			f = _.find(core.equipment,function(g){return g.id == eq});
			if(f.capacity>0) f.modcount = f.capacity;
			if($.isNumeric(f.supplement)) f.batterymod = true;
		}
		var sc = $('.screen.active').hasClass('fabricator')? 'fabricator-details' : 'inventory-details'
		sc = $('.screen.active').hasClass('marketplace')? 'market-details' : sc
		
		toscreen(sc,tmp.blueprintFull(f))
	})
	
	
	$('body').on('click','.edit-config .btn.id',function(){
		//toscreen('card')
		viewCharCard()
	})
	$('body').on('click','.config-race .icon',function(){
		var rv = $('.config-race select').val()
		var rc = _.find(core.races,function(r){
			return r.id == rv;
		});
		if(rc){
			//var rStr = tmp.configRace(rc)
			//$('.config-race.screen').html(rStr)
			toscreen('config-race',tmp.configRace(rc))
		}
	})
	$('body').on('click','.minus.ego',function(){
		/*var p = $(this).parents('.value')
		var dv = fixInt($(p).attr('data-val'))-1
		$(p).attr('data-val',dv)
		$(this).siblings('.num').text(dv)
		evalBuildChar();*/
		evalEgoVals($(this).parents('.value'),'minus')
	})
	$('body').on('click','.add.ego',function(){
		/*var p = $(this).parents('.value')
		var dv = fixInt($(p).attr('data-val'))+1
		$(p).attr('data-val',dv)
		$(this).siblings('.num').text(dv)
		evalBuildChar();*/
		evalEgoVals($(this).parents('.value'),'plus')
	})
}
function giveAwaySkill(e){
	message()
	var fs = $(e.target).parents('.full-skill')
	var sk_id = $(fs).attr('data-id')
	var sk_owner = $(fs).attr('data-owner')
	var to = $(fs).find('[name=character-to]').val()
	var type = $(fs).attr('data-type')
	var typeDB = type=='psion'? 'learnp' : 'learn'
	
	if(to){
		var toID = _.find(core.autodata,function(obj){
			return obj.char_name == to;
		})
		mainQuery({
		data:{'char_id': toID.char_id,'skill_id':sk_id,'method':'hasLearned','type':typeDB },
		success: function(html){
			if(html.length == 0){
				
				mainQuery({
					data:{'giver': sk_owner,'skill_id':sk_id,'method':'giveSkill','reciever':toID.char_id,'type':typeDB },
					success: function(html){
						var team = sk_owner+'' !=ds.CH.char_id+''
						if(team){
							$('.screen.known .team-owned.aquired[data-owner='+sk_owner+'][data-id="'+sk_id+'"]').remove()
						}else{
							$('.screen.known .aquired[data-id="'+sk_id+'"]').not('.team-owned').remove()
						}
						toscreen('known')
						message('Skill was given')
					}
				})
				
			}else{
				message(to+' has already aquired this ability.')
			}
		}
	})

	}else{
		message('Please select a recipient.')
	}
	
	//var 
	//get the skill id
	//get the character to give to
	//run the query
	//remove the skill from the past list, and data
	//move to the past list
	//inform user
}
function editConfig(num){
	var useDat = {};
	var con = JSON.stringify(ds.CH)
	con = JSON.parse(con);
	if(con.exceptions.strength_of_mind){
		con.ego_cunning = Math.max(con.ego_cunning-1,0)
		con.ego_discipline =Math.max(con.ego_discipline-1,0)
	}
	con.ego_cunning_max = con.ego_cunning;
	con.ego_discipline_max = con.ego_discipline;
	if(con.exceptions.soldier){
		con.ego_discipline_max--;
		con.ego_discipline_max = Math.max(con.ego_discipline_max,1)
	}
	if(con.exceptions.scholar){
		con.ego_cunning_max--;
		con.ego_cunning_max = Math.max(con.ego_cunning_max,1)
	}
	var ff = _.find(con.configs,function(c){
		return c.config_id == num;
	})
	if(ff){
		useDat = ff;
		useDat.edit = true;
		
		ds.currentConfig = useDat;
		useDat = _.extend(con,useDat);	
		_.each(useDat.known,function(k){
			var f = _.find(useDat.skill,function(s){
				return s.id == k.id;
			})
			if(f)k.active = true;
		});
		useDat.used_t = getAttrCount(0,useDat.skill) + getAttrCount(0,useDat.psion)
		useDat.used_d = getAttrCount(1,useDat.skill) + getAttrCount(1,useDat.psion)
		useDat.used_c = getAttrCount(2,useDat.skill) + getAttrCount(2,useDat.psion)
	}else{
		useDat = _.extend(con,{config_label:'New Config'});
	}
	if(ds.CH.birth_obj&& ds.CH.birth_obj.capacity == 0){
		useDat.diverge=true
	}
	useDat.exceptions = ds.CH.exceptions
	if(ds.CH.exceptions.extra_skills || ds.CH.exceptions.knack || ds.CH.exceptions.soldier || ds.CH.exceptions.scholar){
		useDat.hasExceptions = true	
	}
	setSkillSoft(useDat,useDat.current_sleeve)
	var ec = tmp.editConfig(useDat);
	//$('.edit-config.screen').html(ec);
	screenHtml('edit-config',ec);
	$('.edit-config.screen .btn.exempt').removeClass('selected').addClass('on')
	evalPrereqs($('.edit-config.screen .relationbox#known'));
	evalEgo();
	toscreen('edit-config')
}
function setSkillSoft(char,sleeve){
	var ss = _.find(sleeve.module,function(m){
		return m.hasOwnProperty('name') && m.name.toLowerCase() == "skillsoft system";
	})
	if(ss){
		char.skillsoft = true
		//find the skill with the number
		if(ss.module){
			char.skillsoft = _.find(char.known,function(k){
				return k.sk_id+'' == ss.module+'';
			})
		}
	}
}
function getAttrCount(at,list){
	at = at+"";
	var cnt = 0;
	_.each(list,function(l){
		if(l.hasOwnProperty('rel_info') && l.rel_info == 'charge'){
			
		}else if(l.hasOwnProperty('rel_info') && l.attr.length>1){
			if(l.rel_info === at){
				cnt++;
			}				
		}else if(l.attr[0].id+"" === at){
			cnt++;
		}
		
	})
	return cnt;
}
function getAttrName(l){
	if(l.hasOwnProperty('rel_info') && l.rel_info == 'charge'){
		return 'Charge';
	}else if(l.hasOwnProperty('rel_info') && l.attr.length>1){
		return trait_cats[fixInt(l.rel_info)];
	}else{
		return trait_cats[fixInt(l.attr[0].id)];
	}
}
function setWindow(dont){
	sizeWindow();
	if(!dont){
		toscreen('active',false,true)
	}
}
function sizeWindow(animate){
	w = $('body').width();
	h = $(window).height();
	var tb =  $('.top-bar').outerHeight(true);
	var mt = $('#main-panel').css("marginTop").replace('px', '');
	var mb = $('#main-panel').css("marginBottom").replace('px', '');
	var hadj = h - mt;
		hadj = hadj-mb;
	if(animate){
		$('#main-panel').width(w).animate({'height':hadj+10},300)
	}else{
		$('#main-panel').width(w).height(hadj+10)
	}
	$('.screen').each(function(index, element) {
		var l = $(this).attr('data-left')
		l = l? l : 0;
		$(this).css({'left':l * w,width:w})
		$('.error-panel .message').width(w)
	});
	$('.halfh').each(function(index, element) {
		if(w>600){
    		$(this).height(Math.ceil(hadj/3))
		}else{
			$(this).css({'height':''})
		}
    });

}
function switchPanel(panel,jump){
	var p = $(panel).parents('.screen')
	if($(panel).length==1 && !jump){
		$(p).find('.panel').not('.leave-on').css({'opacity':0});
		$(panel).show()
		$(p).stop().animate({height:$(panel).outerHeight(true)},300,function(){
			$(p).find('.panel').not('.leave-on').addClass('off');
			$(panel).removeClass('off').css({display:'',opacity:1});		
			$(p).height('');			
		})
		setTimeout(setWindow,1000)
	}
	if(jump){
		$(p).find('.panel').not(panel).hide().addClass('off')
		$(panel).show().removeClass('off').css({opacity:1})
	}
}
function getScreen(s){
	var sc = s;
	if(typeof sc == 'string'){
		sc = s=='active'? $('.screen.active') : $('.screen[data-screen='+s+']');
	}
	return sc
}
function loginAsChar(e){
	ds.loggedInAsAdmin = true
	doLogin(ds.editCH.char_id,false,true)
}
function loginAsAdmin(){
	getUserCharacterList(ds.editCH.user_id,function(list){
		doLogin(list[0].char_id,false,true);
	})
		
}
function addBluePrint(){
	var blues = JSON.stringify(equip_skills)
	var energy = 300;
	blues = JSON.parse(blues);
	//var fab = tmp.fabricator(_.extend({'equipment':blues,'characters':core.active},ds.CH))
	ds.editCH.equipment = blues;
	var bp = tmp.adminBlueprint(ds.editCH)
	toscreen('admin-blueprint',bp)	
}
function adminCharacterPanel(){
	var c = tmp.editCharacter(ds.editCH)
	toscreen('admin-editchar',c)
}
function editTeam(){
	mainQuery({
		data:{'method':'getTeam','char_id':ds.editCH.char_id},
		success: function(html){
			var team_list = html
			ds.editTM = html;
			mainQuery({
				data:{'method':'allUserCharacters'},
				success: function(html){
					core.autodata = html;
					var members = team_list.slice(1)
					/*members = _.reject(members,function(m){
						return m.char_id+'' == team_list[0].user_id+''
					})*/
					_.each(members,function(m){
						if(m.user_id+''==team_list[0].user_id+'') m.on = 'true';
					})
					
					var obj = {
						team: team_list[0],
						characters: html,
						members:members,
						member_names: _.pluck(members,'char_name'), 
						member_list:_.pluck(members,'char_name').join(','),
						member_ids:_.pluck(members,'char_id').join(',')
					}
					var c = tmp.editTeam(obj);
					toscreen('admin-editteam',c)
					autoCompleteTeams2("#editTeamForm",html)
					$('.auto-content txt[data-val="'+'"]')
				}
			})
		}
	})
}
function screenHtml(sc,content){
	sc = getScreen(sc)
	if($(sc).find('.inscreen').length==0) {
		$(sc).wrapInner('<div class="inscreen"></div>');
	}
	$(sc).find('.inscreen').html(content);
}

function toscreen(s,content,jump){
	stopScan();
	message();
	var isActive = s =='active'
	var sc = getScreen(s);
	var cScreen = $('.screen.active');
	var top = $('#main-panel').scrollTop();

	
	if($(sc).length){
		//Save the current screen's top position
		var top = $('#main-panel').scrollTop()
		
		$(cScreen).removeClass('active').css({top:-top}).attr('data-top-pose',top).removeClass('pose').find('.fixed-head').css({top:top});
		var high = top + $('#main-panel').height()
		$(cScreen).css({'height':high})
		
		$('#main-panel').scrollTop(0)
		if(content) screenHtml(sc,content);
		
		//Adjust fixded headers
		$(sc).show();//This must go before fixed head so that header will calculate
		var head = $(sc).find('.fixed-head')
		if($(head).length>0){
			var h = $(head).outerHeight();
			$(head).css({'margin-bottom':-h})
			$(sc).find('.under-fixed').css({'margin-top':h+20})
		}
		
		if(!isActive) buildBreadcumbs(s)
		
		var l = $(sc).attr('data-left')? $(sc).attr('data-left') : 0;
		var ds = $(sc).attr('data-screen')
		$('.screen[data-left="'+l+'"]').not('[data-screen="'+ds+'"]').each(function(index, element) {
        	$(element).hide();
        });
        
		//For screens that are recreated
		var newTop = $(sc).attr('data-top-pose')? fixInt($(sc).attr('data-top-pose')):0; 
		$(sc).find('.fixed-head').css({top:newTop})
		if(jump){
			$('.position-panel').stop().css({'left':l*-w});
			$('#main-panel').stop().css({'scrollTop':0})
			$(sc).addClass('pose active').css({top:0}).attr('data-top-pose',0).find('.fixed-head').css({top:''})
			//setWindow(true)
		}else{
			$('.position-panel').stop().animate({'left':l*-w},1000,function(){	
				$(sc).addClass('pose active').css({top:0}).attr('data-top-pose',0).find('.fixed-head').css({top:''})
				$('#main-panel').scrollTop(newTop)
				//setWindow(true)
			});
		}
		if(s!='active'){
			s = '#'+s;
			if(s=='#login') s='./'
			history.pushState(null, null, s);
		}
	}	
}
function message(str,icon,renew){
	if(ds.CH.trauma && ds.CH.trauma.length){
		var altMessages = [str]
		_.each(ds.CH.trauma,function(t){
			var ms = _.find(trauma_chart,function(tc){
				return tc.id+'' == t.ref_id+'' && tc.hasOwnProperty('messages')	&& tc.messages.length
			})
			if(ms){
				altMessages = altMessages.concat(ms.messages)
			}
		})
		altMessages = _.uniq(altMessages);
		var ran = Math.floor(Math.random() * altMessages.length) + 1 
		str = altMessages[ran]
	}
	
	var o = $('.error-panel .message')
	var mac = str == $(o).text()
	if(!mac || renew){
		$(o).stop().animate({left:w * 1.5},300,function(){
			$(o).remove();
		})
		if(str && typeof str =='string'){
			var m = $('<span class="message" style="left:-'+w+'px;width:'+w+'px">'+str+'</span>');
			$('.error-panel').append(m);
			$(m).animate({left:0},300);	
		}
	}
}

function buildBreadcumbs(sc){
	if(!sc || sc == 'active'){
		sc = $('.screen.active').attr('data-screen')
	}
	var useCrumbs = [];
	var loop = 0
	var b = parBread(sc)
	while(b && loop < 5){
		useCrumbs.push(b);
		b = parBread(b.p)
		loop++;
	}
	useCrumbs.reverse();
	if(!ds.loggedIn && sc=='main'){
		
	}else{
		useCrumbs = useCrumbs.slice(1);
	}
	
	if(ds.loggedIn || useCrumbs.length>1){
		$('body').addClass('bread-on').delay(1000).queue(function(){
			sizeWindow(true);
			$(this).dequeue();
		});	
		//setTimeout(sizeWindow,1000);
	}else{
		$('body').removeClass('bread-on').delay(1000).queue(function(){
			sizeWindow(true);
			$(this).dequeue();
		});	
	
	}
	
	var cHTML = '';
	_.each(useCrumbs,function(e){
		//KEEP USERS: only if login is the screen && !logged in 
		cHTML += '<div class="crumb" data-screen-link="'+e.screen+'">'+e.label+'</div>'
	})
	$('.breadcrumb').html(cHTML);
	$('.breadcrumb').scrollLeft($('.breadcrumb .crumb').length * 205)
}
function parBread(sc){
	if(sc===false) return false;
	return _.find(ds.bread,function(b){
		return b.screen == sc || b.id == sc;
	})	
}

/*=====================================
	  Login Functions
//=====================================*/

//Eval Main Login form text to user
function showFormText(event){
	showLoginBtn()
	var n = $(event.relatedTarget).length? $(event.relatedTarget).attr('name') : false;
	if(!$('[name=un]').val()){			
		message('Please enter a username');
	}else if(!$('[name=pw]').val() && n!='pw'){
		message('Please enter a password');
	}else if($(event.target).attr('id')!= 'loginbtn'){
		message();
	}
}

//Show/hide Main Login Form Buttons
function showLoginBtn(){
	if($('.login-screen [name=un]').val() && $('.login-screen [name=pw]').val()){
		$('.login-screen #loginbtn').removeAttr('disabled');
	}else{
		$('.login-screen #loginbtn').attr('disabled','disabled');
	}
}
//Bubble Login
function tryActiveLogin(au,send){
	message();
	send = send? send : loginHere;
	var id = $(au).attr('id')
	var pw = $(au).find('[type=password]').val()
	if(!pw){
		message('Enter a Password',false,true);	
	}else{
		checkCharPass(id,pw,function(html){
			if(typeof html == 'object'){
				message('Password ok')
				$('.active-user input').val('')
				//$(au).addClass('on')
				send(id,true);				
			}else if(html==2){
				message('Incorrect Password',false,true)
			}				
		})
	}
	function loginHere(id){
		doLogin(id,true)
		toscreen('main')
	}
}
//First startdard login/checkin
function firstLoginCheck(){
	var un = $('[name=un]').val();
	var pw = $('[name=pw]').val()
	if(un && pw){	
		checkPass(un,pw,function(result){
			switch(result){
				case 1:
				message('System error, Could not login');
				break;
			
				case 2:
				message('Your username or password is incorrect');	
				break;
					
				default:
				checkCharacters(result)
			}
		});
	}	
}
//Second login check
function checkCharacters(result){
	getUserCharacterList(result.user_id,function(list){
		list = _.reject(list,function(ch){
			return ch.type == 'team'
		})
		if(!core.options.gamemode || core.options.gamemode === 'false') getAllCharacters();
		doLogin(list[0].char_id);
	})
}
function checkAllowance(){
	if(ds.CH.exceptions.rich) {
		var ev = _.find(ds.CH.event,function(e){
			return e.skill_id+'' == ds.currentEvent.event_id+''
		})
		if(ev && ev.rel_info!='cash'){
			$('.filthy-rich.circle').show()
		}
	}
}
//Final Login
function doLogin(char,jump,excempt){
	ds.loggedIn = true;
	$('.filthy-rich.circle').hide()
	getCharacter(char,function(ch){
		
		ds.CH = formatChar(ch[0]);
		var f = _.find(core.active,function(c){
			return c.char_id+'' == ds.CH.char_id+''
		})
		if(f) {
			f.loggedIn = 'true';
		}
		
		$('#searchchars').val('')
		parseEgoLoss(ds.CH,function(){
			$('.screen').not('.active').css({'height':$('#main-panel').height()})
			if(ds.CH.exceptions['birth-human']){
				//ds.CH.ego_tolerence+=2;
				//parseEgoLoss(ds.CH)
			}
			checkAllowance()
			$('.signbtn').css({'opacity':1});
			buildBreadcumbs('main');
			
			switchPanel('#features',jump);
			if(!excempt && (core.options.gamemode === 'true' || core.options.gamemode === true)){
				setTimeout(function(){
					checkInChar(ch);
				},600);
			}else{
				toscreen('main')	
			}
			mainFunctionDisplay();
			
			var minLeft = $('.login-screen').outerWidth() /2 - $('.login-screen .main-features .panel').first().width() / 2;
			getConfigs(char,function(configs){
				ds.CH.configs = configs;
				if(ds.CH.configs.length==0){
					newConfig({'char_id':ds.CH.char_id,'config_label':'(Default)','active':1},buildConfigs)	
				}else{
					buildConfigs()
				}
			});
			getTeams(function(){
				//teams done
				updateInterface();
				detectIdle();
			});
		})
	})
}
function getTeams(send){
	ds.CH.teams = [];
	var teamCt = 0;
	$('#team-drop').html('')
	if(ds.CH.hasOwnProperty('member') && ds.CH.member.length>0){
		//for(var i=0;i<ds.CH.member.length;i++){
		$('#team-drop').append('<label>Scan to: </label><select id="seldrop"><option value="'+ds.CH.char_id+'">'+ds.CH.char_name+'</option></select>')
		_.each(ds.CH.member,function(m){
			getCharacter(m.skill_id,function(ch){
				teamCt++;
				if(ch.length>0){
					ch[0].isAdmin = (ch[0].user_id == ds.CH.user_id);
					ds.CH.teams.push(formatChar(ch[0]))
					
					$('#team-drop select').append('<option value="'+ch[0].char_id+'">'+ch[0].char_name+'</option>')
					
				}
				if(teamCt>=ds.CH.member.length){
					ds.CH.teams = _.sortBy(ds.CH.teams,'char_name')
					send();
				}	
			})
		})
		//}
	}else{
		send();
	}
}
function getAllowance(){
	//'pre':ds.CH.energy,'info':JSON.stringify({'energy':10})})
	var obj = {'energy':10,'event_id':ds.currentEvent.event_id,'event':ds.currentEvent.date};
	var b	    = safeBudget(10,'s');
		
	var track = {'action':'Allowance','char_id':ds.CH.char_id,'pre':JSON.stringify({'Char':ds.CH.energy,'Station':core.options.station_energy})};
	mainQuery({
		data:{'method':'getAllowance','char_id':ds.CH.char_id,'event_id':ds.currentEvent.event_id,'pre':ds.CH.energy,'track':track,'budget':b},
		success:function(html){
			getOptions();
			ds.CH.energy +=10;
			message('10 Energy addded to your account')
			$('.filthy-rich.circle').stop().animate({'opacity':0},500,function(){
				$('.filthy-rich.circle').hide()	
			})
			refreshMaintenence()
		}
	})
}
function sleeveBonuses(it){
	var bonus = {'req':0,'slots':0}
	
	//Adaptable mind bkgr = -s cost for slots and sleeve requirments
	if(ds.CH.exceptions.adaptable){
		bonus.req +=2;
		bonus.slots +=2;
	}
	//Human +2 for each slots and sleeve
	if(ds.CH.exceptions['birth-human']){
		bonus.req +=2;
		bonus.slots +=2;
	}
	//Preservation coalition: non birth race sleeves cost +2 to equip
	if(ds.CH.exceptions['nation-preservation']){
		var map = _.pluck(cc.birth_races,'id');
		if(ds.CH.exceptions.birth_ai){map.push(ds.CH.alt_birth_sleeve.id)}
		if(map.indexOf(it.id+'')==-1){
			bonus.slots -=2;
		}
	}
	return bonus;
}
function sleeveSlotCost(it){
	//This is weird below
	//nation-supernal and nation-banausic should not work this way
	//below where we are getting cyber #s and gene #s, this should be used to see if those nations should be added
	//- experimental mods is missing
	//the loop below was probably written after the fuction to format mods
	
	/*
		
		Need to solve sleve mod cost: This is the full number hidden and used in code
		Need to solve sleeve uses: this is the visible number which uses a base and adds or subtracs bonues
		xxx Doing away with the above, get adaptable and hman bonuses in another function
		Need requirement cost?
	*/
	
	var addslot = 0;
	it.module = modsTo(it.module ,'allobject')
	it.module = _.compact(it.module)
	it.module = _.filter(it.module,function(m){
		return ! $.isNumeric(m)
	})
	
	//Geneware
	var genemods = _.filter(it.module,function(m){
		return m.type+'' =='13';
	})
	var genecount = genemods.length
	
	//Cyberware items
	var cybermods = _.filter(it.module,function(m){
		return m.type+'' == '16';
	})
	var cybercount = cybermods.length;
	
	//cybermount system = +2 cyberware for free (but costs 1, so 2 for 1)
	var cms = _.find(it.module,function(m){
		return m.hasOwnProperty('name') && m.name == 'Cyber Mount System';
	})
	if(cms && cybercount>2){
		cybercount -= 2;
	}else if(cybercount==2){
		cybercount -= 1;
	}
	
	//Cybermeld get 2 slots for 1 slot
	if(ds.CH.exceptions.cybermeld && cybercount > 0){
		 cybercount = Math.min(cybercount/2,1);
	}	
	
	if(ds.CH.exceptions['nation-supernal'] && genecount > 0){
		addSlot=1;//First Cyberware costs +1
		cybercount++;
	}
	if(ds.CH.exceptions['nation-banausic'] && genecount>0){
		addSlot=1;//First Geneware adds +1
		genecount++
	}
	
	//Blanks get free Geneware
	if(it.name.toLowerCase()=='blank'){
		genecount = 0
	}
	//Robots get free cyberware
	if(it.name.toLowerCase().indexOf('robot')==0){
		cybercount = 0;
	}
	
	slotcost = genecount + cybercount;
	
	//Independant Mod = a specific gene or cyber mod chosen at background choice
	if(ds.CH.hasOwnProperty('independant_mod')){
		var im = ds.CH.independant_mod[0]
		var f = _.find(it.module,function(g){
			return g.id+'' == im.id+''
		})
		if(typeof f != 'undefined'){
			slotcost-=1; 
		}
	}
	//Independant Mod = a specific gene or cyber mod chosen at background choice
	/*if(ds.CH.hasOwnProperty('experiment_mod')){
		var im = ds.CH.experiment_mod[0]
		var f = _.find(it.geneware,function(g){
			return g.id+'' == im.id+''
		})
		if(typeof f != 'undefined'){
			 it.slotcost-=1; 
		}
	}*/
	//Experimental Mod will auto be added to a sleeve, it should not be actually be added to the sleeve
	return Math.max(0,slotcost)+1;//Sleeves must cost at least 1 base tolerance
	//return {"addslot":addslot,"slotcost":slotcost}
}
function inventoryItemMap(it,cc){
	it.module = it.module? it.module : [];
	if(typeof it.module == 'string') it.module = it.module.split(',')
	if(it.type+''==12+''){
		it.required = fixInt(it.capacity);
		if(it.skill+''==3+'') it.battery = it.capacity;
		if(it.skill+''==2+'') it.cryo = true;
		it.sleevable = true
		if(it.skill+''=='3' && ds.CH.experiment_mod && ds.CH.experiment_mod.length>0 && ds.CH.experiment_mod[0].type+''=='13'){
			it.cannot_sleeve = true;
		}
		
		if(cc.birth_obj && cc.birth_obj.special == 'birth_ai') it.sleevable = false
		/*
		it.addSlot = 0;
		it.module = _.map(it.module,function(m){
			if($.isNumeric(m)){
				var f = _.find(ds.CH.gear,function(g){
					return g.rel_id+'' == m+'';
				})
				if(f && ds.CH.exceptions['nation-supernal']) it.addSlot=1;//First Cyberware adds +1
				if(f) return f;
			}else if(ds.CH.exceptions['nation-banausic']){
				it.addSlot=1;//First Geneware adds +1
			}
			return m;
		})
		it.module = _.compact(it.module)
		var modCount = it.module.length
		if(it.skill+''=='3'){
			modCount = 0
			it.addSlot = 0
		}
		if(it.name.toLowerCase()=='blank'){
			var fil = _.filter(it.module,function(m){
				return typeof m != 'string' && m.type+'' =='16';
			})
			modCount = fil.length
			it.addSlot = 0
		}
		var genecount = _.filter(it.module,function(m){
			return typeof m == 'string' || (m != 'string' && m.type+'' =='13');
		})
		if(ds.CH.exceptions.cybermeld){
			 modCount = Math.floor(genecount.length/2)
			 modCount = Math.max(modCount,0)
		}
		var cybercount = _.filter(it.module,function(m){
			return m.hasOwnProperty('type') && m.type+'' == '16';
		})
		cybercount = cybercount.length
		var cms = _.find(it.module,function(m){
			return m.hasOwnProperty('name') && m.name == 'Cyber Mount System';
		})
		if(cms && cybercount>1){
			modCount = modCount - 2;
		}else if(cms && cybercount==1){
			modCount = modCount - 1;
		}
		it.slotcost = 1 + modCount + it.addSlot;
		it.slotuses = 1 + modCount;
		if(ds.CH.hasOwnProperty('independant_mod')){
			var im = ds.CH.independant_mod[0]
			var f = _.find(it.module,function(m){
				if(im.type+'' == '13'){
					return im.name == m;
				}else if(m.hasOwnProperty('id')){
					return im.id == m.id
				}else{
					return im.id == m
				}
			})
			if(typeof f != 'undefined'){
				 it.slotcost-=1; it.slotuses-=1;
			}
		}
		if(ds.CH.exceptions.adaptable){
			//tol = Math.max(tol-2,0);
			it.required = Math.max(it.required-2,0);
			it.minusTol = 2;
		}*/
		
		it.slotcost  = sleeveSlotCost(it);
		var bonuses  = sleeveBonuses(it);
		it.required-= bonuses.req
		if(bonuses.slots>0){
			it.adjust_slots = Math.max(1,it.slotcost - bonuses.slots);
			if(it.adjust_slots == it.slotcost) delete it.adjust_slots
		}
		if(bonuses.req>0){
			it.adjust_capacty = Math.max(1,it.capacity - bonuses.req);
			if(it.adjust_capacty == it.capacity) delete it.adjust_capacty
		}
		var canEquip = affordSleeve(cc.ego_tolerence,it.slotcost,false,it);
		it.tooHigh = canEquip == 0;
		
		
	}
	if(it.capacity>0) it.hasMod1=true;
	if(it.capacity>1) it.hasMod2=true;
	it.chargable = fixInt(it.battery) || it.supplement;
	it.modable = it.chargable || it.hasMod1 || it.hasMod2;
	return it;
}

function buildInventory(skipDisplay){
	cc = ds.CH;
	var gr  = consolodateGear(cc.gear)
	var install = ['0','6','9','11','13','15','16']
	cc.gearz = [];
	cc.modz = [];
	cc.sleeves = [];
	_.each(gr,function(g){
		g.owner_id = ds.CH.char_id;
		if(g.type+'' == '12'){
			g = inventoryItemMap(g,cc)
			cc.sleeves.push(g)
		}else if(install.indexOf(g.type+'') ==-1){
			cc.gearz.push(inventoryItemMap(g,cc));
		}else{
			cc.modz.push(g)
		}
	})
	var cryoUsed = cryoCount(cc);
	var cryoFree = core.options.cryo_count - cryoUsed
	cc.cryoinfo = {'used':cryoUsed,'max':core.options.cryo_count,'free':cryoFree}
	_.each(ds.CH.teams,function(t){
		_.each(t.gear,function(g){
			g.owner_id = t.char_id;
			if(t.isAdmin) g.isAdmin = true;
		})
	})
	mainQuery({
		data:{'method':'allSimpleCharacters'},
		success: function(html){
			//toscreen('addteam',tmp.addTeam({characters:html}))
			core.autodata = html
			core.autodata2 = [{'char_name':'Station','char_id':0}].concat(html)
			/*cc.characters = _.reject(html,function(char){
				return char.char_id == ds.CH.char_id;
			})*/
			if(!skipDisplay) screenHtml('inventory',tmp.inventory(cc));
			modDrops(cc.modz)
			metaMorphDrop();
			evalSleeveCost()
			currentSleeve(ds.CH)
			setAutoCompleteGiveAway(core.autodata2)
			setAutoCompleteCharacters(core.autodata)
		}
	})
}
function setAutoCompleteGiveAway(html){
	$('.inventory.screen .gbox [name=character-to]').each(function(i,e){
		var id = $(e).parents('.has-owner').attr('data-id')
		var src = _.reject(html,function(c){
			return c.char_id+'' == id+'';
		})
		$(e).autocomplete({
			source: _.pluck(src,'char_name'),
			minLength: 0,
			focus: function() {
			    // prevent value inserted on focus
			   return false;
			},
			select: function( event, ui ) {
				 var hold = $(this).parent().addClass('fa precheck')
				return ui.item.value;
			}
		});
	})
}
function setAutoCompleteCharacters(html){
	$('.inventory.screen .gear-wrap [name=character-to]').each(function(i,e){
		var id = $(e).parents('.has-owner').attr('data-id')
		var src = _.reject(html,function(c){
			return c.char_id+'' == id+'';
		})
		$(e).autocomplete({
			source: _.pluck(src,'char_name'),
			minLength: 0,
			focus: function() {
			    // prevent value inserted on focus
			   return false;
			},
			select: function( event, ui ) {
				 var hold = $(this).parent().addClass('fa precheck')
				return ui.item.value;
			}
		});
	})
}
function teamCharObj(id){
	var obj = false;
	if(id+''==ds.CH.char_id+''){
		obj = ds.CH;
	}
	_.each(ds.CH.teams,function(tm){
		if(tm.char_id+'' == id+''){
			obj = tm;
		}
	})
	return obj;
}
function giveAwayBlues(e){
	var btn = $(e.target)
	$(btn).addClass('waiting')
	//get the blueprint id
	//get the character id to transfer
	var par   = $(e.target).parents('.overlay-parent')
	var over  = $(e.target).parents('.inn.give')
	var owner = $(par).attr('data-owner')
	
	var gear	 = $(par).attr('data-gear-id')
	var charName = $(over).find('[name=character-to]').val()
	var toChar	 = _.find(core.autodata,function(c){
		return c.char_name == charName;
	})
	if(toChar){
		
		mainQuery({
			data:{'method':'takeGear','buyer':toChar.char_id,'gear_id':gear},
			success:function(html){
				//$(par).remove()
				
				var ft = _.find(ds.CH.teams,function(tm){
					return tm.char_id == toChar.char_id
				})
				if(ft || toChar.char_id+'' == ds.CH.char_id){
					ft = ft? ft : ds.CH;
					_.each(ds.CH.buildable,function(branch,i){
						var gr = _.find(branch.items,function(g){
							return g.gear_id+'' == gear;
						})
						if(gr){
							gr.owner = charName 
							gr.team = !(toChar.char_id+'' == ds.CH.char_id);
							if(gr.team){
								$(par).find('.wbox.owner').find('.inside').addClass('team')
								
							}else{
								$(par).find('.wbox.owner').find('.inside').removeClass('team')
		
							}
							$(par).find('.wbox.owner .inside').html('Owner: '+ft.char_name)
							//ft.buildable[i].items.push(gr)
							closeOverlay($(btn))
						}
					})
				
				}else{
					$(par).css({width: $(par).width()+'px'})
					$(par).wrap('<div class="gear-wrap-single" style="width:'+$(par).width()+'px"></div>');
					$(par).parents('.gear-wrap-single').stop().animate({'width': 0},1000,function(e){
						$(this).remove()
					});
					//ownervar owned = teamCharObj(owner)
					_.each(ds.CH.buildable,function(b,i){
							ds.CH.buildable[i].items = _.reject(ds.CH.buildable[i].items,function(g){
								return g.gear_id == gear;
						})
					})
				}
				
				
				$(btn).addClass('waiting')
			},error:function(){
				message('An error occured',false,true);
				$(btn).addClass('waiting')
			}
		})
	}else{
		$(btn).removeClass('waiting')
		message('Recipient could not be found');
	}
}
function giveAwayFrags(e){
	var bank = $(e.target).parents('.gbox');
	var btn = $(e.target).addClass('waiting')
	var cha = ds.CH;
	if($(bank).hasClass('team')){
		cha = _.find(ds.CH.teams,function(t){
			return t.char_id+'' == $(bank).attr('data-id')
		})
		
	}
	$(btn).addClass('waiting')
	var send = {}
	$(bank).find('.pan:not(.disabled) input').each(function(i,el){
		var v = $(el).val()
		if(fixInt(v)>0){
			send[$(el).attr('name')]= v
		}
	})
	var toName = $(bank).find('[name="character-to"]').val()
	var charTO = _.find(core.autodata2,function(c){
		return c.char_name == toName
	});
	if(charTO && charTO.hasOwnProperty('char_id')) charTO = charTO.char_id;
	if(_.keys(send).length>0 && charTO!==false){
		var before = _.pick(cha,['energy','basic_frag','tactical_frag','biomedical_frag','cybernetic_frag','chemical_frag'])
		var after = _.clone(before);
		_.each(_.keys(after),function(k){
			if(send[k]) after[k] = fixInt(after[k]) - fixInt(send[k])
		});
		
		var track = {'action':'give','char_id':cha.char_id,'edit_char_id':charTO,'pre':JSON.stringify(before),'post':JSON.stringify(after),'info':JSON.stringify(send)};
		
		mainQuery({
			data:{'method':'sendFrags','sender':cha.char_id,'reciever':charTO,'data':send,'track':track},
			success:function(html){
				$('.frag-bank.form .pan input').val('0')
				
				_.each(_.keys(send),function(k){
					cha[k] = fixInt(cha[k]) - fixInt(send[k]);
					var slug = k.replace(/_frag/g,'');
					$(bank).find('.pan input').val('0')
					$(bank).find('.pan.'+slug+' input').attr('max',cha[k])
					$(bank).find('.frag-bank.counter .pan.'+slug).text(cha[k])
				});
				var oBank = $('.screen.active .gbox[data-id='+charTO+']')
				if($(oBank).length){
					var otherCH = ds.CH
					
					if($(oBank).hasClass('team')){
						otherCH = _.find(ds.CH.teams,function(t){
							return t.char_id+'' == charTO+'';
						})		
					}
					_.each(_.keys(send),function(k){
						otherCH[k] = fixInt(otherCH[k]) + fixInt(send[k]);
						var slug = k.replace(/_frag/g,'');
						$(oBank).find('.pan input').val('0')
						$(oBank).find('.pan.'+slug+' input').attr('max',otherCH[k])
						$(oBank).find('.frag-bank.counter .pan.'+slug).text(otherCH[k])
					})
				}
				$(btn).removeClass('waiting')
				message('Items Sent')
			},error:function(err){
				message('An error occured',false,true);
				log(err)
			}
		})
		
		
	}else if(charTO){
		$(btn).removeClass('waiting')
		message('No items to send',false,true)
	}else{
		$(btn).removeClass('waiting')
		message('No Reciever selected',false,true)
	}
}
function modDrops(modz){
	var mod = JSON.parse(JSON.stringify(modz))
	var cybermods = [];
	var genemods  = [];
	var batteries = [];
	var armorMods = [];
	var compMods  = [];
	var medMods   = [];
	_.each(modz,function(m){
		if(m.rel_info!='install'){
			m.rel_id = m.rel_id.split(',')[0]
			var t = m.type+'';
			switch(t){
				case '16':
				cybermods.push(m);
				break;
				
				case '13':
				genemods.push(m)
				break;
				
				case '0':
				batteries.push(m)
				break;
				
				case '11':
				armorMods.push(m)
				break;
				
				case '6':
				compMods.push(m)
				break;
				
				case '15':
				medMods.push(m);
				break;
			}
		}
	})
	cybermods = _.map(cybermods,function(c){c.class="cyber";return c})
	genemods = _.map(genemods,function(c){c.class="gene";return c})
	var sleeveMods = cybermods.concat(genemods);
		
	$('.gear #modselect option, .gear #batterySelect option').not('.init').remove()
	$('.gear #batterySelect').append(tmp.modOptions(batteries));
	$('.gear.armor-chassis #modselect').append(tmp.modOptions(armorMods))
	$('.biomedical.sleeves #modselect').append(tmp.modOptions(sleeveMods))
	$('.cybernetic.sleeves #modselect').append(tmp.modOptions(cybermods))
	$('.medical-chassis #modselect').append(tmp.modOptions(medMods))
	$('.computer-chassis #modselect').append(tmp.modOptions(compMods))
	
	_.each(modz,function(m){
		//Blaster/Ballistic/Explosives
		if(m.supplement.toLowerCase().indexOf('blaster')!=-1){
			_.each(core.Blaster,function(b){
				append(b,m)
			})
		}
		if(m.supplement.toLowerCase().indexOf('ballistic')!=-1){
			_.each(core.Ballistic,function(b){
				append(b,m)
			})
		}
		if(m.supplement.toLowerCase().indexOf('explosives')!=-1){
			_.each(core.Explosives,function(b){
				append(b,m);
			})
		}
		function append(b,m){
			var gr = $('.gear[data-equip-id='+b.id+']')
			$(gr).find('#modselect').append('<option value="'+m.rel_id+'">'+m.name+'</option>');
		}
	})
	
	deactiveteDups(ds.CH.sleeves);
	deactiveteDups(ds.CH.gearz);
	
	function deactiveteDups(gear){
		_.each(gear,function(g){
			var mods = modsTo(g.module ,'object')
			var sel = $('[data-gear-id="'+g.rel_id+'"] #modselect')
			_.each(mods,function(m){
				console.log(cleanCopy(m))
				if(typeof m == 'object' && m.name.toLowerCase().indexOf('dermal armor')!=-1){
					//Dermal Armor
					var health = fixInt($('[data-gear-id="'+g.rel_id+'"]').attr('data-hp'));
					var armor = g.name.toLowerCase().indexOf('bomyx')!=-1? 4 : 0;
					var count = 0;
					$('[data-gear-id="'+g.rel_id+'"]').find('.mod-line.cyber .obj').each(function(index, g) {
                        if($(g).text().toLowerCase().indexOf('dermal armor')!=-1){
							count++;
						}
                    });
					health = health - count
					armor = armor + (count * 3)
					if(health<2 || armor >9){
						var ops = $(sel).find('option.cyber:contains("'+m.name+'")');
						$(ops).remove()
					}
				}else if(typeof m == 'object' && m.name.toLowerCase().indexOf('power core')!=-1){
					///power cores
					var count = 0;
					$('[data-gear-id="'+g.rel_id+'"]').find('.mod-line.cyber .obj').each(function(index, g) {
                        if($(g).text().toLowerCase().indexOf('power core')!=-1){
							count++;
						}
                    });
					if(count>0){
						var ops = $(sel).find('option:contains("Power Core")')
						$(ops).remove()	
					}
				}else if(typeof m == 'object'){
					//Cyberware
					var ops = $(sel).find('option.cyber:contains("'+m.name+'")')
					$(ops).remove()
				}else if(m.toLowerCase()=='enhanced constitution'){
					//Enhanced Constitution
					var fid = fixInt($('[data-gear-id="'+g.rel_id+'"]').attr('data-hp'));
					var count = 0
					$('[data-gear-id="'+g.rel_id+'"]').find('.mod-line.gene .obj').each(function(index, g) {
                        if($(g).text().toLowerCase()=='enhanced constitution'){
							count++;
						}
                    });
					var hp = 10-fid-(count*2);
					if(hp <1){
						var ops = $(sel).find('option:contains("'+m+'")')
						$(ops).remove()
					}					
				}else if(g.type+''=='12'){
					//Gene Mods
					var ops = $(sel).find('option.gene:contains("'+m+'")')
					$(ops).remove()
				}else{
					//Every other mod
					var ops = $(sel).find('option:contains("'+m+'")')
					$(ops).remove()
				}
			})			
		})
	}
}
function metaMorphDrop(){
	if(ds.CH.exceptions.metamorph){
		$('.overlay-parent.gear.rare-A.biomedical.sleeves').not('.on').each(function(index, e) {
            var s = $(e).find('.biomorphChange')
			if($(s).length>0){
				$(s).find('.wbox.name .inside').html($(s).find('option:selected').text())
				$(e).find('.biomorphChange').replaceWith($(s).find('option:selected').text())
			}
        });
		var ops = '';
		var eq = $('.overlay-parent.gear.rare-A.biomedical.sleeves.on')
		_.each(core.birth_races,function(b){
			if(b.special != 'birth_ai'){
				var tol  = fixInt(b.capacity)
				if(ds.CH.exceptions.adaptable) tol = Math.max(tol-2,0);
				var disable = '';
				if(tol > ds.CH.ego_tolerence){
					disable='disabled="disabled" ';
				}
				var id = $(eq).attr('data-equip-id')
				var sel = id==b.id+''? ' selected="selected"':'';
				ops +='<option '+disable+'value="'+b.id+'"'+sel+'>'+b.name+'</option>'
			}
		})
		
		$(eq).find('.wbox.name .inside').html('<select class="biomorphChange">'+ops+'</select>')	
	}
}
function changeMod(e){
	var modInd = $(e.target).attr('data-mod');
	var pan = $(e.target).parents('.modpanel');
	var v = $(pan).find('select').val()
	if(v!='false'){
		var f = _.find(ds.CH.modz,function(m){
			return m.rel_id+'' == v+''; 
		})
		var edit = {};
		if(modInd == 'battery'){
			edit.battery = f.capacity;
		}else if(modInd == 'mod1' || modInd == 'mod2'){
			edit[modInd] = f.name;//convert number to equipment number
		}else if(f.type+''=='16'){
			edit[modInd] = f.rel_id
		}else{
			edit[modInd] = f.name
		}
		var n = splitGear($(e.target).parents('.gear'),edit);
		if(modInd =='battery'){
			modGear(edit.battery, n.rel_id, 'battery');
		}else{
			var modStr = modsTo(n.module,'save')
			modStr = modStr.join(',');
			modGear(modStr, n.rel_id, 'module');
			ds.CH.pools = getPools(ds.CH)
		}
		closeOverlay(e)
		var div = $('.module[data-gear-id="'+v+'"]');
		if($(div).length==0){
			div = $('.module[data-gear-id*="'+v+'"]')
			$(div).each(function(i,e){
				var arr = $(e).attr('data-gear-id').split(',')
				if(_.contains(arr,v+'')){
					div = e
				}
			})
		}		
		if(f.type+''=='16'){
			splitGear($(div),{'rel_info':'install'});
			equipGear('install',f.rel_id)//Mark as install
		}else{
			var relidArr = v.split(',');
			var g = relidArr.shift();
			$(div).attr('data-gear-id',relidArr.join(','))
			var cntNum = fixInt($(div).find('.counter').html())-1
			$(div).find('.counter').html(cntNum);
			ds.CH.gear = _.reject(ds.CH.gear,function(gr){
				return gr.rel_id+'' == g+'';
			})
			if(cntNum==0){
				$(div).remove()	
			}
			markActivity('gear',g,'');
		}
		buildInventory(true);
	}else{
		message('Plese select a mod',false,true)
		
	}
}
function affordSleeve(tol,slot,on,item){
	var activeTOL = ds.CH.ego_tolerence
	var bonuses  = sleeveBonuses(item);
	var usedTol = getTolerencePsionics().length
	var totalREQ = activeTOL + bonuses.req;
	var totalSLOT = (activeTOL+bonuses.slots) - usedTol;
	if(tol > totalREQ || slot > totalSLOT){
		return 0;//Too high to equip
	}else if(on && slot == totalSLOT){
		return 1;//Can equip but not add mods
	}
	return 2;//Can equip and add Mods
}
function evalSleeveCost(){	
	//Sleeves are about 2 things You must have x slots min, and x slots open
	$('.gear.sleeves').removeClass('tooHigh')
	$('.gear.sleeves').each(function(index, e) {
		var tol  = fixInt($(e).attr('data-tolerence'));
		//var slot = fixInt($(e).attr('data-slots'));
		var id   = $(e).attr('data-gear-id');
		var sleeve = _.find(ds.CH.sleeves,function(s){
			return s.rel_id+'' == id+''
		})
		var slot  = sleeveSlotCost(sleeve);
		var canEquip = affordSleeve(tol,slot,$(e).hasClass('on'),sleeve);
		if(!canEquip){
			$(e).addClass('tooHigh')
		}else if(canEquip==1){
			$(e).find('[data-action="addmod"]').hide()
		}
    });
}
function evalCryoCount(){
	//find gear count with 'stored'
	var used = $('.gear.stored').length
	$('.cryo-used').html(used) 
	$('.cryo-max').html(core.options.cryo_count)
	var avail = core.options.cryo_count	- used;
	if(avail){
		$('.gear-wrap').addClass('available')	
	}else{
		$('.gear-wrap').removeClass('available')
	}
	return {'max':core.options.cryo_count,'used':used}
}

function resleeveFreeItem(e){
	$('.gear-wrap').removeClass('hologram')
	equipItem(e)
	ds.CH.current_sleeve = currentSleeve(ds.CH)
	message('Current Sleeve: '+ds.CH.current_sleeve.name,false,true)
}
function resleeveItem(e){
	var panel  = $(e.target).parents('.panel')
	var gear   = $(e.target).parents('.gear')
	var on     = $(gear).hasClass('on')
	var remove = false;
	var action = on? 'expires' : 'equip';
	$(gear).find('.obj.mod').removeClass('on')
	$(gear).find('.inn').addClass('ninja')
		
	var action = 'resleeve';
	var m = $(gear).find('.market-overlay');
		
	if($(m).attr('data-viewed')==action){
		$(m).removeAttr('data-viewed')
		$(m).stop().animate({'height': 0,opacity:0});
	}else{
		//$(obj).addClass('on');
		$(m).attr('data-viewed',action)
		$(m).find('.inn.'+action).removeClass('ninja')
		$(m).stop().animate({'height': 145,opacity:1});
	}
}
function resleeveAs(e){
	equipItem(e)
	ds.CH.current_sleeve = currentSleeve(ds.CH)
	//gamemode
	if((core.options.gamemode === 'true' || core.options.gamemode === true)){
		imposeEgoPenalties(function(text){
			/*closeOverlay(e)
			if(ds.CH.current_sleeve.special == 'hologram'){
				$('.gear-wrap.sleeves').addClass('hologram')
			}
			text = text? text+', ' : '';
			message(text+'Current Sleeve: '+ds.CH.current_sleeve.name,false,true)*/
			completeResleeve()
		})
	}else{
		imposeEgoPenalties(function(text){
			/*closeOverlay(e)
			if(ds.CH.current_sleeve.special == 'hologram'){
				$('.gear-wrap.sleeves').addClass('hologram')
			}
			text = text? text+', ' : '';
			message(text+'Current Sleeve: '+ds.CH.current_sleeve.name,false,true)*/
			completeResleeve()
		})
	}
	function completeResleeve(){
		closeOverlay(e)
		if(ds.CH.current_sleeve.special == 'hologram'){
			$('.gear-wrap.sleeves').addClass('hologram')
		}
		text = text? text+', ' : '';
		message(text+'Current Sleeve: '+ds.CH.current_sleeve.name,false,true)
	}
	
}
function equipItem(e){
	var gear   = $(e.target).parents('.gear')
	var multi  = $(e.target).hasClass('multi')
	var sleeve = $(gear).hasClass('sleeves')
	var panel  = $(e.target).parents('.panel')
	var on     = $(gear).hasClass('on')
	var remove = false;
	var action  = on? '' : 'equip';
	
	if(on && sleeve){
		message('You are now a Hologram')
	}else if(!on && sleeve){
		//turn off other sleeves equipped
		$(gear).removeClass('stored');
		var remove = $(panel).find('.gear.sleeves.on').not(gear)
	//}else if(!multi && !on){
		//turn off anything already equipped that is the same item group
		//var did = $(gear).attr('data-eqtype')
		//var remove = $(panel).find('.gear.on[data-eqtype='+did+']').not(gear)
	}else if(!multi && !on){
		//
		var did = $(gear).attr('data-equip-id')
		var remove = $(panel).find('.gear.on[data-equip-id='+did+']').not(gear)
		
	}else if(sleeve && $(e.target).hasClass('biomedical') && on){
		//if this sleeve is biomedical then it expires when unequiped
		action = 'expires';	
	}
	if($(remove).length>0){
		var removeAction = $(remove).hasClass('biomedical')? 'expires':'';
		var i = $(remove).attr('data-gear-id').split(',')[0]
		equipGear(removeAction,i);
		$(remove).removeClass('on')
		message('Some items unequipped',false,true)
	}
	equipGear(action,$(gear).attr('data-gear-id').split(',')[0]);
	
	splitGear(gear,{'rel_info':action})
	ds.CH.current_sleeve = currentSleeve(ds.CH)
	metaMorphDrop();
}
function eqItemByCost(){
	//get all equipped items
	var activeWear = _.filter(ds.CH.gear,function(g){return g.rel_info =='equip' && g.type+'' !='12'});
	//get the total cost
	var costs = _.pluck(activeWear,'cost')
	var total = 0;
	_.each(costs,function(num){total += fixInt(num);})
	var choice = Math.floor(Math.random() * total);
	var t = 0;
	var item = false
	while(choice >0){
		item = activeWear[t];
		choice = choice - fixInt(item.cost);
		t++;		
	}
	return item;
	
}
function toggleCryo(e){
	var gear = $(e.target).parents('.gear')
	var store = !$(gear).hasClass('stored');
	var action = store? 'stored' : 'expires';
	
	equipGear(action,$(gear).attr('data-gear-id').split(',')[0]);
	splitGear(gear,{'rel_info':action},function(){
		$(gear).toggleClass('stored')
	})
	evalCryoCount();
	closeOverlay(e)
}
function formatModule(g,extend){
	g.module = g.module? g.module : [];
	if(typeof g.module == 'string') g.module = g.module.split(',')
	if(extend.mod1){
		g.module[0] = extend.mod1;
	}else if(extend.mod2){
		if(g.module.length==0) g.module.push(false)
		if(g.module.length==1) g.module.push(false)
		g.module[1] = extend.mod2
	}else if(extend.modules){
		g.module.push(extend.modules);
	}
	return g;
}
function splitGear(div,extend,fallback,specific){
	var div = $(div).attr('data-gear-id')? div : $(div).parents('[data-gear-id]')
	var cntNum = fixInt($(div).find('.counter').html())
	
	var arr = $(div).attr('data-gear-id').split(',')
	var tid = false
	if(specific){
		var ind = arr.indexOf(specific)
		tid = specific
		arr = _.reject(arr,function(a){
			if(a == specific){
				specific = '';
				return true;
			}
			return false;
		})
	}else{
		tid = arr.shift();
	}
	var f = _.find(ds.CH.gear,function(g){
		return g.rel_id == tid;
	})
	if(f && f.hasOwnProperty('module')) f = formatModule(f,extend)
	var n = inventoryItemMap(f,ds.CH);	
	n = _.extend(n,extend,{count:1})
	if(cntNum > 1){
		$(div).find('.counter').html(cntNum-1);
		$(div).attr('data-gear-id',arr.join(','))
		var template = typeTemplate(n.type)
		var nhtml = $('<div class="gear-wrap-single">'+template(n)+'</div>');
		$(nhtml).insertBefore(div)
		$(nhtml).stop().animate({'width': 410},1000,function(e){
			$(nhtml).find('.gear').unwrap()
		});
	}else{
		var template = typeTemplate(n.type)
		var nhtml = $(template(n));
		$(div).replaceWith(nhtml)
	}
	setAutoCompleteCharacters(core.autodata);	
	return n;
}
function typeTemplate(type){
	var template = tmp.gear;
	switch(type+''){
		case '0':
		case '6':
		case '9':
		case '11':
		case '13':
		case '15':
		case '16':
		template = tmp.mod;
		break;
		
		case '12':
		template = tmp.sleeve;
		break;
	}
	return template;
}
function modGear(info,gear_id,column){
	column = column? column : 'module'
	mainQuery({
		data:{'method':'modGear','gear_id':gear_id,'info':info,'column':column},success:function(html){
			
		}
	})
}
function markActivity(table,id,active){
	mainQuery({
		data:{'method':'markActivity','id':id,'active':active,'table':table},success:function(html){
			
		}
	})		
}
function equipGear(equip,gear_id){
	mainQuery({
		data:{'method':'equipGear','gear_id':gear_id,'equip':equip},success:function(html){
				
		}
	})
	var f = _.find(ds.CH.gear,function(g){
		return g.rel_id+'' == gear_id
	})	
	if(f) f.rel_info = equip;
}
function cleanCore(){
	_.each(core,function(param){
		var blackkey = ['rel_active','rel_id','rel_info','rel_key','skill_id','subject_id','active','static'];
		core[param] = _.map(param,function(p){
			return _.omit(p,blackkey);
		})
	})
}
//LOGOUT
function logout(){
	ds.loggedInAsAdmin = false
	clearInterval(idleInterval);
	ds.loggedIn = false;
	_.each(core.active,function(c){
		c.loggedIn = false;
	})
	$('.signbtn').stop().animate({'opacity':0},200)
	$('body').removeClass('bread-on')
	$('.pose').removeClass('pose')
	cleanCore()
	
	$('.active-user').show()
	
	$('#main-panel').stop().animate({'opacity':0,'padding-bottom':80},1000,function(){
		$('.screen').removeAttr('data-top-pose')
		$('.screen').css({'top':''})
		$('.fixed-head').css({'top':''})
		$('[name=un]').val('')
		$('[name=pw]').val('')
		$('#loginbtn').attr('disabled','disabled')
		var cookie = getCookie('ds_onsite')
		if(core.options.gamemode && core.options.gamemode !='false' && cookie && cookie == 'true'){
			toscreen('checkin',false,true);
			$('#main-panel').stop().animate({opacity:1,'padding-bottom':0},1000,function(){
			$('*').scrollTop(0)
		});
		}else{
			toscreen('main',false,true);				
			switchPanel('#main');				
		}
		$('.circle.gameon').hide()
		$('#main-panel').stop().animate({opacity:1,'padding-bottom':0},1000,function(){
			$('*').scrollTop(0)
		});
		
	})
}
/*=====================================
	 Skill functions
//=====================================*/


function isAdmin(u){
	if(u){
		return u.user_level == 'admin';	
	}else{
		return ds.CH.user_level == 'admin' || ds.loggedInAsAdmin;	
	}
}
function hasSkill(list,char){
	char = char? char : ds.CH;
	list = list+'';
	list = list.split(',');
	var t = false;
	_.each(list,function(sk){
		console.log(char)
		var f = _.find(char.known,function(s){
			return s.sk_id == sk || s.special == sk;
		})
		if(f) {
			t = true;
			return true;
		}
	})
	return t;
}
function mainFunctionDisplay(){
	$('.circle.need-admin,#psych').hide();
	if(isAdmin()) $('.circle.need-admin').css({'display':'inline-block'});
	if(ds.CH.exceptions.psych) $('#psych').css({'display':'inline-block'})//Psychology
	if(isAdmin() || (core.options.gamemode && core.options.gamemode!='false')) $('.gameon').show()
}
function setKnown(){
	var sk = JSON.parse(JSON.stringify(skill_cats));
	var ps = JSON.parse(JSON.stringify(psionic_cats))
	var creation = ds.CH.known.length == 0;
	
	///HANDLE SKILLS
	if(creation){
		_.each(sk,function(si){
			_.each(si.skills,function(s){
				s.class='aquired';
				var know = knowableSkillClass(ds.CH,s.id)
				if(know) s.class+=know
			});
		});
	}else{
		var learn = JSON.parse(JSON.stringify(ds.CH.learn))
		var known = JSON.parse(JSON.stringify(ds.CH.known))
		var knownIDs = _.pluck(known,'id')
		learn = _.filter(learn,function(l){
			return knownIDs.indexOf(l.skill_id) == -1
		})
		var skills = known.concat(learn);
		skills = _.sortBy(skills,function(sk){
			return sk.sk_category+sk.sk_name;
		})
		_.each(skills,function(s){
			s.class = s.rel_key == 'known'? 'aquired on':'aquired';
			var know = knowableSkillClass(ds.CH,s.id)
			if(know) s.class+=know
		})
		_.each(sk,function(si,ii){
			var aquiredCount = 0;
			si.skills = _.map(si.skills,function(s){
				s.class = 'unlearned'+ knowableSkillClass(ds.CH,s.id);
				var f = _.find(skills,function(ss){
					return ss.sk_id == s.sk_id
				});
				if(f) aquiredCount++
				return f? f : s;
			})
			if(aquiredCount==0) si.noskills = true;
		});
		sk.owner_id = ds.CH.char_id;
		if(ds.CH.hasOwnProperty('teams') && ds.CH.teams.length){
			var nsk = []
			_.each(ds.CH.teams,function(t){
				_.each(t.learn,function(skl){
					skl.owner = t.char_name;
					skl.owner_id = t.char_id;
					skl.class = "aquired"+ knowableSkillClass(ds.CH,skl.sk_id);
					var ts = _.find(skills,function(ss){
						return ss.sk_id == skl.sk_id
					});
					if(ts) skl.class = "aquired stoplearn duplicate";
				})
				nsk.push({
					id:t.char_id,
					name:t.char_name+' Skills',
					skills:t.learn,
					noskills: t.learn.length ==0
				})	
			})
			sk = nsk.concat(sk)
		}
	}
	var psion   = findSpecial('psion',ds.CH.background);
	var knack   = findSpecial('knack',ds.CH.background,true);
	var diverge = findSpecial('aionly',ds.CH.background,true);
	///HANDLE PSIONICS
	
	if(psion || knack || diverge){
		//CREATION
		if(creation){
			_.each(ps,function(pc){
				_.each(pc.powers,function(p){
					p.class='aquired';
					var know = knowablePsionicsClass(ds.CH,p.id)
					if(know) p.class+=know
				});
				if(diverge) pc.info = 'charge';
			});
		//DIVERGENT
		}else if(diverge){
			_.each(ps,function(pc){
				var aquiredCount = 0;
				pc.powers = _.map(pc.powers,function(s){
					var avail = fixInt(diverge.rel_info) - ds.CH.psion.length
					var f = _.find(ds.CH.psion,function(ss){
						return ss.id == s.id
					});
					//This psionic is Known
					if(f){
						f.class="aquired on"
						aquiredCount++
					//More Psionics available
					}else if(avail>0){
						var know = knowablePsionicsClass(ds.CH,s.id)
						if(know){
							s.class+=know
							s.class = s.class.replace(/nobg/gi,'unlearned')
						}else{
							s.class+=' aquired'
							aquiredCount++
						}
					//At max psionics, all others require a background
					}else{
						s.class = 'unlearned';
					}
					var r = f? f : s;
					r.attr = r.attr.slice(0,1)
					r.class+=' exempt';
					return f? f : s;
				})
				if(aquiredCount==0) pc.noskills = true;
			});
		//PSIONIC KNACK
		}else if(knack){
			_.each(ps,function(pc){
				var aquiredCount = 0;
				pc.powers = _.map(pc.powers,function(s){
					if(ds.CH.psion.length == 0){
						var know = knowablePsionicsClass(ds.CH,s.id)
						if(know) s.class+=know
						if(know.indexOf('nobg')==-1){
							s.class +=' aquired'
							aquiredCount++	
						}else{
							s.class +=' unlearned'	
						}
						s.class+=' exempt'
						return s
					}else{
						s.class = 'unlearned exempt';
						var f = _.find(ds.CH.psion,function(ss){
							return ss.id == s.id
						});
						if(f){
							f.class="aquired on exempt"
							aquiredCount++
						}
						return f? f : s;
					}
				})
				if(aquiredCount==0) pc.noskills = true;
			});
		//PSIONIC STANDARD
		}else{
			var learn = JSON.parse(JSON.stringify(ds.CH.learnp))
			var known = JSON.parse(JSON.stringify(ds.CH.psion))
			var knownIDs = _.pluck(known,'id')
			learn = _.filter(learn,function(l){
				return knownIDs.indexOf(l.skill_id) == -1
			})
			
			
			
			var skills = known.concat(learn);
			skills = _.sortBy(skills,function(sk){
				return sk.sk_category+sk.sk_name;
			})
			_.each(skills,function(s){
				s.class = s.rel_key == 'psion'? 'aquired on':'aquired';
				var know = knowablePsionicsClass(ds.CH,s.id)
				if(know) s.class+=know
				if(s.rel_key == 'psion'){
					if(s.rel_info){
						s.attr = [ {id:s.rel_info, label: trait_cats[s.rel_info]}]
					}
				}
			})			
			_.each(ps,function(pc){
				var aquiredCount = 0;
				pc.powers = _.map(pc.powers,function(s){
					s.class = 'unlearned';
					var f = _.find(skills,function(ss){
						return ss.id == s.id
					});
					if(f) aquiredCount++
					return f? f : s;
				})
				if(aquiredCount==0) pc.noskills = true;
			});
			if(ds.CH.hasOwnProperty('teams') && ds.CH.teams.length){
				var nps = []
				_.each(ds.CH.teams,function(t){
					_.each(t.learnp,function(skl){
						skl.owner = t.char_name;
						skl.owner_id = t.char_id;
						skl.class = "aquired "+ knowablePsionicsClass(ds.CH,skl.id);
						var ts = _.find(skills,function(ss){
							return ss.id == skl.id
						});
						if(ts) skl.class = "aquired stoplearn duplicate";
					})
					nps.push({
						id:t.char_id,
						name:t.char_name+' Skills',
						powers:t.learnp,
						noskills: t.learnp.length ==0
					})	
				})
				ps = nps.concat(ps)
			}
		}
	}else{
		ps= [];	
	}
	//exceptions
	var conf = {
		'skills':sk,
		'ego': creation? ds.CH.max_ego : (ds.CH.max_ego*1.5) + (ds.CH.exceptions.hasOwnProperty('extra_skills')? 2 : 0 ),
		'skills_known':ds.CH.known.length+ds.CH.psion.length,
		'char_id':ds.CH.char_id,
		'psion':ps,
		'creation':creation,
		'exceptions':ds.CH.exceptions,
		'ego_discipline':ds.CH.ego_discipline,
		'ego_cunning':ds.CH.ego_cunning,
		'ego_tolerence':ds.CH.ego_tolerence,
		'used_d': getAttrCount(1,ds.CH.psion),
		'used_c': getAttrCount(2,ds.CH.psion),
		'used_t': getAttrCount(0,ds.CH.psion)
	}
	/*
		get used skills from psionc
	*/
	if(ds.CH.banausic) conf.banausic = ds.CH.banausic
	if(ds.CH.supernal) conf.supernal = ds.CH.supernal
	if(creation || ds.CH.exceptions.extra_skills || (ds.CH.exceptions['nation-banausic'] && !ds.CH.banausic) || (ds.CH.exceptions['nation-supernal'] && !ds.CH.supernal)){
		conf.hasExceptions = true
		if(ds.CH.exceptions.extra_skills && ds.CH.exceptions.extra_skills < 2) conf.extra_404 = true 	
	}
	if(knack)   conf.knack = true;
	if(diverge) conf.diverge = true;
	var str = tmp.knownSkills(conf);
	
	screenHtml('known',str)
	
	evalKnown();
}
function prepSelectorItems(chosen,pool){
	var out = {};
	pool = pool? pool : [];
	pool = JSON.parse(JSON.stringify(pool))
	out.selected = _.map(chosen,function(c){
		c.active = true
		c.static = false
		return c;
	});
	out.bulk = _.map(pool,function(p){
		var f = _.find(chosen,function(c){
			return c.id+'' == p.id+'';
		})
		return f? f : p;
	})
	out.static = _.map(JSON.parse(JSON.stringify(chosen)),function(c){
		c.static = true;
		return c;
	})
	
	return out;
	
}
function extendCharacter(){
	var cc = JSON.parse(JSON.stringify(ds.CH))
	cc.background_traits = prepSelectorItems(cc.background,core.backgrounds)
	cc.nations = prepSelectorItems(cc.nations_on,core.nations)
	var races = JSON.parse(JSON.stringify(core.birth_races))
	_.each(races,function(r){
		hp = r.special? '<div class="cost-num hp">HP:  '+r.extra+'</div>' : '';
		r.name = '<div class="cost-num">'+r.capacity+'</div>'+r.name +hp;
	})
	cc.races = prepSelectorItems(cc.birth_races,races);
	
	cc.freeRace = cc.exceptions.adopted? 2: 1;
	cc.freeRace = Math.max(cc.freeRace - cc.birth_races.length,0);
	cc.races_val = _.pluck(cc.birth_races,'id').join(',')
	cc.freeNation = cc.exceptions.citizen? 2: 1;
	cc.freeNation = Math.max(0,cc.freeNation - cc.nations_on.length)
	cc.nations_val = _.pluck(cc.nations_on,'id').join(',')
	cc.bg_val = _.pluck(cc.background,'id').join(',')
	return cc
}
function buildChar(show){
	cc = extendCharacter();
	
	var morewares = _.filter(core.equipment,function(eq){
		return (eq.type+'' == '13' || eq.type+'' == '16') && (eq.rarity =='A' || eq.rarity =='C');
	})
	morewares = JSON.parse(JSON.stringify(morewares))
	morewares = _.map(morewares,function(w){
		w.name = w.name + ' ('+w.single+')'
		return w
	})
	var wares = _.filter(morewares,function(eq){
		return eq.rarity =='A';
	})
	cc.wares = wares
	cc.morewares = morewares
	if(cc.exceptions['birth-aurani'] && cc.free_bg==0 && !cc.locked_bg){
		//can only pick a psionic bg
		
	}
	cc.personalDevice = localStorage['personalDevice']+''==ds.CH.char_id+''
	screenHtml('source-code',tmp.characterConfig(cc))
	screenHtml('edit-source',tmp.editSource(cc))
	
	if(!show) jQuery('.edit-source.screen').css({'visibility':'hidden','display':'block'})
	jQuery('.edit-source.screen .rule-select:not(.set)').each(function(index, bs) {
        var h = $(bs).hasClass('selected')? $(bs).find('.rule-selected').outerHeight(true) : 50;
		jQuery(bs).css({height:h})
    });
	if(!show) jQuery('.edit-source.screen').css({'visibility':'','display':'none'})
	
	allowBackgrounds(cc.birth_races,cc.nations_on,cc.background)
	evalBuildChar();
	$('.edit-source.screen .rule-select .rule-selected .btn').removeClass('btn on')
	
}
function evalEgoVals(p,method){
	var dv = fixInt($(p).attr('data-val'))
	if(method=='plus'){
		dv++
	}else{
		dv-- 
	}
	$(p).attr('data-val',dv)
	$(p).find('.num').text(dv)
	evalBuildChar();
	updateEgoPools();
	setKnown()
}
function evalBuildChar(){
	if($('#ego-block').hasClass('free')){
		$('.free-ego').show()
		$('.add.ego,.minus.ego').show().css({'visibility':''});
		var totalEgo = 0;
		$('#ego-block .value[id]').each(function(index, element) {
			var attr = fixInt($(element).attr('data-val'));
			totalEgo += attr;
			switch($(element).attr('id')){
				case 't':
				ds.CH.ego_tolerence = attr;
				//if(cc.exceptions['birth-human']) ds.CH.ego_tolerence+=2
				break;
				
				case 'c':
				ds.CH.ego_cunning = attr;
				break;
				
				case 'd':
				ds.CH.ego_discipline = attr;
				break;	
			}
		});
		var free_ego =  ds.CH.max_ego - totalEgo;
		$('.free-ego').text('/'+free_ego)
		if(free_ego <1){
			$('.free-ego').hide();
			$('#ego-block .value .add').css({'visibility':'hidden'});
		}
		$('#ego-block .value[data-init]').each(function(index, element) {
			var dv = fixInt($(element).attr('data-val'))
			var di = fixInt($(element).attr('data-init'))
			var dm = fixInt($(element).attr('data-min'))
			dm = dm? dm : di;
			if(dv > di && dv > dm){
				//'DON"T HIDE MINUS?'
			}else{
				$(element).find('.minus').hide();
			}
		})
	}	
	checkRace(ds.CH.background)
}
function checkRace(background){
	$('#birth-race-save:not(".max") .rule-item').removeAttr('disabled');
	var adapt = findSpecial('adaptable',background,true)
	_.each(core.birth_races,function(r){
		var cap = fixInt(r.capacity)
		if(r.special == "birth-human") cap -=2;
		if(adapt)cap-=2
		if(ds.CH.ego_tolerence  < cap && !ds.CH.birth_race){
			$('#birth-race-save .rules-wrap .rule-item#'+r.id).attr('disabled','disabled')
		}
	})
}
function buildSleeves(){
	screenHtml('sleeve-list',tmp.sleeveList(ds.CH));
}
function buildConfigs(){
	var cf = JSON.stringify(ds.CH.configs)
	cf  = JSON.parse(cf);
	_.map(cf,function(c){
		c.id = c.config_id;
		c.label = c.config_label;
		c.active = fixInt(c.active)
		delete c.config_id;
		delete c.config_label;
		return c;
	});
	var str = tmp.configList(cf)
	//var html = selectListHtml(cf,'#config-select',10);
	screenHtml('config',str)
}/*
function sizeSelectList(){
	jQuery('.select-case').each(function(index, target) {
		var pwidth = w>1000? $(target).width()/2 : $(target).width();
		if(!$(target).hasClass('onepage')){
        $(target).find(' .page').width(pwidth);
		$(target).find('.inner-box').width(pwidth*  ($(target).find(' .page').length+1))
		}
		var c = $(target).attr('data-count')
		c = c? c :10;
		var hh = c * $(target).find('.page .btn').first().outerHeight()
		//$(target).css({"max-height":hh})
		$(target).find('.inner-box').css({'left':''})
		$(target).attr('data-page','0')
    });
}*
function moveSelectBox(p,target){
	var par = $(target).hasClass('select-case')? target : $(target).parents('.select-case').first()
	var pgs = $(par).find('.page').length;
	var maxpg = w>1000? Math.ceil(pgs/2): pgs;
	maxpg = w>1000? maxpg + Math.ceil(maxpg%2) : maxpg-1;
	p = Math.min(maxpg,p);
	p = Math.max(p,0)
	var ww = w>1000? ($(par).width()/2) * p : $(par).width() * p;
	$(par).find('.inner-box').stop().animate({'left':-ww},300);
	$(par).find('.next-btn,.prev-btn').removeClass('none');
	if(p==0){
		$(par).find('.prev-btn').addClass('none')
	}else if(p==maxpg){
		$(par).find('.next-btn').addClass('none')	
	}
	$(par).attr('data-page',p)
}/*
function selectListHtml(data,target,count){
	var c = count
	if(_.isArray(data)){
		var dat = arrayToPages(data,count)
		
		if(dat.list.length==1) dat.single = true;
		var str = tmp.selectbox(dat);
		
		$(target).html('')
		$(target).html(str);
		sizeSelectList();
	}
	return '';
}*/
function arrayToPages(data,count){
	var c = count;
	var send = [];
	if(_.isArray(data)){
		var tens = Math.ceil(data.length / count);
		var splits = [];
		var scrolls = tens > 2
		if(scrolls) count --; tens = Math.ceil(data.length / count);
		for(var i=0;i<tens;i++){
			splits.push(data.slice((i*count),(i+1) * count))
		}
		send = {'list':splits,'scrolls':scrolls,'count':c};
	}
	return send;
}