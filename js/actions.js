
$(document).ready(function(e) {
	init();
	/*=====================================
		BASIC UI ACTIONS
	//=====================================*/
    $(window).resize(function(){
		setWindow();
	});
	$('#main-panel').scroll(function(e){
		$('#main-panel').scrollLeft(0)
	})
	//Jump to screen linked to html attrubute
	$('body').on('click','[data-screen-link]',function(){
		var s = $(this).attr('data-screen-link');
		toscreen(s)
	});
	
	//Built in element:data-message
	$('body').on('mouseenter','[data-message]',function(){
		message($(this).attr('data-message'),false,true);
	});
	$('body').on('mouseleave','[data-message]',function(e){
		message();
	});
	//Built in element: data-cmd
	$('body').on('click','[data-cmd]:not(.waiting)',function(e){
		var cmd = $(this).attr('data-cmd');
		var exec = window[cmd];
		if(cmd && typeof exec=='function'){
			exec(e);	
		}
	});
	window.addEventListener("hashchange", function(e) {
		var lio = e.newURL.lastIndexOf('/')+2;
		var screen = e.newURL.substring(lio);
		if(screen =='') screen = 'login';
		toscreen(screen)
	})
	
	//Tab buttons
	$('body').on('click','.tabs .btn',function(){
		if(!$(this).attr('disabled')){
			$('.screen.active .tabs .btn').removeClass('on')
			$(this).addClass('on')
			var id = $(this).attr('id')
			switchPanel('.active #'+id+'.panel')
		}
	});
	$('body').on('click','.checklist .btn',function(){
		if(!$(this).attr('disabled')){
			$(this).parents('.checklist').find('.btn').removeClass('on check')
			$(this).addClass('on check')
		}
	});
	
	$('body').on('click','.scanbtn',function(){
		var scan = $(this).parents('[data-scan]')
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
	$('body').on('click','.stopEndbtn',function(){
		var scan = $(this).parents('[data-scan]')
		$(scan).find('.cam.active').removeClass('active')
		$(scan).find('.stopEndbtn').hide()
		$(scan).find('.scanbtn').show()
		$(scan).find('.status').removeClass('scan dup success error partial')
		stopWebcam(scan)
		window.clearTimeout(window.scanTimeout);
	});
	
	/*
	//Select Box scoll buttons
	$('body').on('click','.scroll-btns .prev-btn:not(.none)',function(){
		var p = $(this).parents('.select-case').first().attr('data-page');
		p = p? fixInt(p) - 1 : 0;
		moveSelectBox(p,this)
	})
	$('body').on('click','.scroll-btns .next-btn:not(.none)',function(){
		var p = $(this).parents('.select-case').first().attr('data-page');
		p = p? fixInt(p) + 1 : 0;
		moveSelectBox(p,this)
	})
	*/
	//QR actions
	$('body').on('change','.qr-option-select',function(e){
		$('.qr-frag-select,.qr-skill-select,.qr-energy-select,.qr-psion-select').removeClass('on').hide()
		if($(e.target).val()=='Frag'){
			$('.qr-frag-select').show().addClass('on')
		}else if($(e.target).val()=='Skill'){
			$('.qr-skill-select').show().addClass('on')
		}else if($(e.target).val()=='Psion'){
			$('.qr-psion-select').show().addClass('on')	
		}else{
			$('.qr-energy-select').show().addClass('on')
		}
	})
	
	/*=====================================
		SKILLS & PSIONICS ACTIONS
	//=====================================*/
	$('body').on('click','#known.screen .tabs .btn',function(){
		if($(this).attr('id')=='known'){
			$('.known.screen .actions.ego').hide()
		}else{
			$('.known.screen .actions.ego').show()
		}
	})
	//Psionic multi-attribute selector
	$('body').on('click','.drop.more span',function(e){
		e.stopPropagation();
		var btn = $(this).parents('.with-description.btn')
		var id  = $(this).attr('id')
		var d   = $(this).parents('.drop');
		var dd  = $(d).attr('data-attr')
		var indClass = ['one','two','three'];
		var ind = $(this).attr('data-ind')
		$(d).removeClass('one two three')
		$(d).find('span').removeClass('selected')
		if(id == dd || !ind){
			$(this).removeClass('selected')
			$(btn).removeClass('selected')
			$(btn).attr('data-info','')
		}else{
			$(this).addClass('selected')
			$(btn).attr('data-info',id);
			$(btn).addClass('selected')
			$(d).removeClass('one two three')
			$(d).addClass(indClass[ind]);
		}
		evalKnown()
	});
	
	$('body').on('click','#known.screen #known .banausic',function(e){
		e.preventDefault()
		var selected = $(e.target).hasClass('selected')
		$('#known.screen #known .banausic').each(function(index, b) {
           $(b).removeClass('selected')
		   $(b).parents('.with-description').removeClass('exempt banausic selected')
        });
		
		var line = $(e.target).parents('.with-description');
		if(!selected){
			$(e.target).addClass('selected')
			$(line).addClass('exempt banausic')
			$(line).attr('data-info','banausic')
		}
		evalKnown()
		return false
	})
	$('body').on('click','#known.screen #known .supernal',function(e){
		e.preventDefault()
		var selected = $(e.target).hasClass('selected')
		$('#known.screen #known .supernal').each(function(index, b) {
           $(b).removeClass('selected')
		   $(b).parents('.with-description').removeClass('exempt supernal selected').removeAttr('data-info')
        });
		var line = $(e.target).parents('.with-description');
		if(!selected){
			$(e.target).addClass('selected')
			$(line).addClass('exempt supernal')
			$(line).attr('data-info','supernal')
		}
		evalKnown()
		return false
	})
	//Evaluate Known skills	
	$('body').on('click','#known.screen .skill-table .aquired.btn:not(".on, .multi")',function(){
		if($(this).hasClass('banausic') || $(this).hasClass('supernal')){
			$(this).removeClass('banausic supernal exempt')
		}
		if(!$(this).attr('disabled') && !$(this).hasClass('stoplearn')){
			$(this).toggleClass('selected');
			evalPrereqs($('#known.screen .relationbox.known'));
			evalKnown();
		}
	});
	//Skilled Background 404 skills select
	$('body').on('click','#known.screen #known.extra_skills .unlearned.btn:not(".on, .multi")',function(){
		if(!$(this).attr('disabled') && !$(this).hasClass('stoplearn') ){
			$(this).toggleClass('selected');
			var count = $('#known.screen #known.extra_skills .unlearned.selected').length
			var e = ds.CH.exceptions.extra_skills;
			var u = $.isNumeric(e)? e : 0;//Used skills
			var a = 2-u;//Available Sklls
			if(count >= a){
				//$(this).removeClass('selected');
				 $('#known.screen #known.extra_skills .unlearned').not('.selected,.on').attr('disabled','disabled')	
			}else{
				$('#known.screen #known.extra_skills .unlearned').removeAttr('disabled')
			}
			if(count+a==2){
				$('.createbar .add404').hide()
				$('.createbar .non404').show()
			}else{
				$('.createbar .add404').show()
				$('.createbar .non404').hide()
				$('.createbar .aquiredCount').html(2-(a+count));
			}
			evalPrereqs($('#known.screen .relationbox.known'));
			evalKnown();
		}
	});
	$('body').on('click','#known.screen .view',function(e){
		var s = $(this).parents('.screen')
		$(this).hide()
		if($(this).hasClass('off')){
			$(s).find('.skill-table').removeClass('showall')
			$(s).find('.view').not('.off').show()
			//hide unaquired
			
		}else{
			$(s).find('.skill-table').addClass('showall')
			$(s).find('.view.off').show()
			//show everything
		}
	})
	//Save Known
	$('body').on('click','#known .btn.save:not([disabled="disabled"])',function(){
		evalRelationBox($('#known.screen .relationbox.known'));
		evalRelationBox($('#known.screen .relationbox.psion'));
		var dat = JSON.parse($('.known.relationbox').attr('data-json'));
		var dat2 = JSON.parse($('.psion.relationbox').attr('data-json'));
		var dat3 = dat.concat(dat2);
		if(ds.CH.exceptions.extra_skills) $('#known.screen #known.extra_skills .unlearned.selected').addClass('marker')
		
		$('#known.screen .btn.selected.team-owned').each(function(i,e){
			var p = $(e).parents('.panel.skill-table')
			var key = $(p).attr('id')=='known'? 'learn' : 'learnp';
			var skobj = {
				"subject_id":$(e).attr('data-owner'),
				"rel_key":key,
				"skill_id":$(e).attr('data-id'),
				"rel_active":"",
			}
			dat3.push(skobj);
			//_.reject()
		})
		///for each e-> remove the skill from the team character
		//need to add the owner ID to the UI to get it
		
		saveRelation(JSON.stringify(dat3),function(){
			var dats = _.reject(dat,function(d){
				return d.rel_key == 'banausic' || d.rel_key == 'supernal';
			})
			message('Skills + Psionics Updated');
			ds.CH.known = extendRelation(dats,'known');
			ds.CH.psion = extendRelation(dat2,'psion');
			formatChar(ds.CH);
			$('#known.screen .btn.selected.team-owned').removeClass('team-owned').removeAttr('data-owner').find('.skill-owner').remove()
			$('#known.screen .relationbox .btn.selected').addClass('on').removeClass('selected')
			$('#known.screen .relationbox .btn.off').removeClass('off on')
			
			//1: see if banaustic is selected
			//2: if so, get the id and skill id
			//3. rmeove classes
			//4. remove buttons
			//5. extend relationship for the b skill and push to CH
			
			//$('.known.screen .relationbox .banausic.with-description').removeClass('selected unlearned').addClass('on').find('.banausic').addClass('on').removeClass('white')
			///!!!NNEED TO SAVE THE CORRECT NUMBER HERE!
			if($('.banausic.btn.on').length>0){
				$('3known.screen .relationbox .with-description').find('.banausic').remove()
				var tar = 
				$('#known.screen .relationbox .with-description.banausic').removeClass('selected unlearned').addClass('on');
				if($('#known.screen .relationbox .with-description.banausic h4').length==0){
					$('#known.screen .relationbox .with-description.banausic .inner').append('<h4 class="national">Banausic Skill</h4>')
				}
			}
			if($('.supernal.btn.on').length>0){
				$('#known.screen .relationbox .with-description').find('.supernal').remove()
				$('#known.screen .relationbox .with-description.supernal').removeClass('selected unlearned').addClass('on');
				if($('#known.screen .relationbox .with-description.supernal h4').length==0){
					$('#known.screen .relationbox .with-description.supernal .inner').append('<h4 class="national">Supernal Skill</h4>')
				}
			}
			saveExtraSkills()
		});
		
		
	})
	/*=====================================
		EDIT CONFIG ACTIONS
	//=====================================*/
	$('body').on('click', '#edit-config .btn.save',saveConfig);
	$('body').on('click', '#edit-config .btn.copy',function(){
		var label = $('#edit-config.screen #config-label').val()
		var end = label.substr(label-2)
		var last = end.substr(1);
		
		if(label.indexOf('-')>0){
			end = label.substr(label.lastIndexOf('-')+1)
			if($.isNumeric(end)){
				end = fixInt(end)+1;
				label = label.substr(0,label.length - String(end).length)+end
			}else{
				label+='-1'	
			}
		}else{
			label+='-1'	
		}
		
		$('#edit-config.screen #config-label').val(label)
		$('#edit-config.screen [name=edit-config]').val('')
		$('#edit-config.screen [data-config-id]').attr('data-config-id','config_id');
		$('#edit-config.screen .relationbox#known').attr('data-subject','config_id');
		evalEgo();
		saveConfig();
	});
	//Evaluate Config skills	
	$('body').on('click','#edit-config.screen .skill-table .with-description.btn:not(".on, .multi")',function(){
		if(!$(this).attr('disabled') && !$(this).hasClass('stoplearn')){
			$(this).toggleClass('selected');
			var id = $(this).attr('id')
			$('#skill-soft-save .rule-item#'+id).removeClass('selected')
			$('#skill-soft-save').removeClass('selected').css({height:50})
			evalPrereqs($('#edit-config.screen'));
			evalEgo();
		}
	});
	$('body').on('selected','#skill-soft-save',function(){
		//eval the skillsoft llistt
		//deselect the selected skill from the known list
		var id = $(this).find('.rules-wrap .rule-item.selected').attr('id')
		$('#edit-config.screen .relationbox#known').find('#'+id).removeClass('selected')
		evalPrereqs($('#edit-config.screen'));
		evalEgo();
	})
	
	/*=====================================
		FABRICATOR ACTIONS
	//=====================================*/
	$('body').on('click','.overlay-parent [data-action]',showMarketOverlay)
	$('body').on('change','.searchbar .typeselect select, .searchbar #rare-select',filterEquipment);
	$('body').on('click','.blueprint [data-viewed="build"] .execute:not(".waiting")',buildBlueprint)
	$('body').on('click','.blueprint [data-viewed="rent"] .execute:not(".waiting")',rentBlueprint)
	//$('body').on('click','.blueprint [data-viewed="sell"] .execute',sellBlueprint)
	$('body').on('click','.blueprint [data-viewed="complete"] .execute:not(".waiting")',function(e){
		completeBlueprint(e)
	})
	$('body').on('click','.blueprint [data-viewed="deconstruct"] .execute:not(".waiting")',deconstructBlueprint)
	$('body').on('click','.blueprint [data-viewed="give"] .execute:not(".waiting")',giveAwayBlues)
	
	//$('body').on('click','.blueprint [data-viewed="buy"] .execute',buyBlueprint)
	$('body').on('input','.blueprint [name="fragment"]',function(e){
		var inn = $(e.target).parents('.inn')
		adjustFragPercent(inn)
	})
	$('body').on('keyup','.blueprint [name="fragment"]',function(e){
		var inn = $(e.target).parents('.inn')
		adjustFragPercent(inn)
	})
	$('body').on('click','.blueprint .onmarket .cancel',cancelBlueprint)
	$('body').on('click','.showFilter',showFiltersMobile)
	
	$('body').on('click','.use-btn',function(e){
		$(e.target).parents('.screen').find('.frag-panel').removeClass('in-use')
		 $(e.target).parents('.frag-panel').addClass('in-use')
		 checkMaretBalance();
	})
	/*=====================================
	INVENRORY ACTIONS
	*=====================================*/
	$('body').on('keydown','[name=character-to]',function(){
		$(this).parent().removeClass('precheck')
	})
	$('body').on('click','.inventory .tabs .btn',function(e){
		var tar = $(e.target).hasClass('btn')? $(e.target).attr('id') :$(e.target).parents('.btn').attr('id')
		$('.gear-wrap').find('.module, .gear').hide()
		switch(tar){
			case 'all':
			$('.gear-wrap').find('.module, .gear').css({'display':'inline-block'})
			break;
			
			case 'equipped':
			$('.gear-wrap .gear.on').css({'display':'inline-block'})
			break;
			
			case 'cryo':
			$('.gear-wrap .gear.biomedical.sleeves').css({'display':'inline-block'})
			break;
			
			case 'module':
			$('.gear-wrap .module').css({'display':'inline-block'})
			break;
		}
	})
	$('body').on('click','.obj-wrap.mod-line',removeModUI)
	
	$('body').on('click','.modpanel .exchange',function(){
		var id = $(this).attr('id')
		var p = $(this).parents('#shift-mod')
		$(p).find('.modpanel').css({'display':''})
		$(p).find('.modpanel#'+id).css({'display':'inline-block'})
		$(p).find('.modpanel#first').stop().animate({'margin-left':-370});
	})
	$('body').on('change','.biomorphChange',function(){
		var p = $(this).parents('.overlay-parent')
		var nw = $(this).val()
		var itm = $(p).attr('data-gear-id')
		var rc = _.find(core.birth_races,function(b){
			return b.id+'' == nw	
		})
		$(p).attr('data-equip-id',rc.id)
		$(p).find('.tolnum').text(rc.capacity)
		mainQuery({
			data:{'method':'changeSleeve','gear_id':itm,'eq_id':nw},
			success: function(html){
				var f = _.find(ds.CH.gear,function(g){
					return g.rel_id+'' == itm;
				})
				f = _.extend(f,rc);
				//f.eq_id = itm;
				buildInventory(true)
				message('Sleeve Race Changed')
			}
		})
	})
	/*=====================================
	  Marketplce Actions
	//=====================================*/
	$('body').on('click','.marketplace .tabs .btn',function(e){
		var tar = $(e.target).hasClass('btn')? $(e.target).attr('id') :$(e.target).parents('.btn').attr('id')
		$('.gear-wrap').find('.item-pan').hide()
		switch(tar){
			case 'all':
			$('.gear-wrap').find('.item-pan').show();
			break;
			
			case 'sell':
			$('.gear-wrap').find('.sale-panel').show();
			break;
			
			case 'owned':
			$('.gear-wrap').find('.owned-panel').show();
			break;
		}
	})
	$('body').on('input','.purchase-line.owned [name="price"]',function(e){
		var c = fixInt($(this).val());
		var tc = getTaxCost(c)
		$(this).parents('.purchase-line').find('.taxcost').text(tc)
		$(this).parents('.purchase-line').find('.totalcost').text(fixInt(tc+c))
	})
	$('body').on('click','.marketplace .market-line:not(.tooMuch) .trade_btn.active, .marketplace .btn.cancel',function(){
		$('.market-line .trade_btn.close').hide()
		$('.market-line .trade_btn.active.sell,.trade_btn.active.buy').css({'display': 'inline-block'})
		$('.market-line .purchase-line').stop().animate({'height':0});
		var p = $(this).parents('.market-line');
		$(p).toggleClass('on');
		$('.market-line').not(p).removeClass('on')
		
		if($(p).hasClass('on')){
			var h = $(p).find('.purchase-line .inner').outerHeight();
			$(p).find('.purchase-line').stop().animate({'height':h});
			$(p).find('.trade_btn.active.sell,.trade_btn.active.buy').hide()
			$(p).find('.trade_btn.active.close').css({'display': 'inline-block'})
		}
	})
	$('body').on('click','.expand-line .expand-button',function(){
		var line = $(this).parents('.expand-line');
		if($(line).hasClass('on')){
			$(line).removeClass('on');
		}else{
			$(line).addClass('on');
			
		}
	})
	//Prevent Negative number from being entered into number inputs
	$('body').on('keydown','[type=number]',function(e){
		 if(e.keyCode == 189 || e.keyCode == 109) {
	        return false;
	    }
	})
	$('body').on('click','.purchase-line.owned .execute',sellGear)
	$('body').on('click','.purchase-line.forsale:not(tooMuch) .execute',buyGear)
	$('body').on('click','.purchase-line.owned .btn.cancel',cancelGear)
	/*=====================================
	  Login Form Actions
	//=====================================*/
	$('body').on('keyup','.filter.searcher #searchchars',function(e){
		var val = $(this).val()
		var sc = $(e.target).parents('.screen')
		
		if(val){
			$(sc).find('.circle').hide()
			$(sc).find('.circle .char_name').each(function(i,e){
				if($(e).text().toLowerCase().indexOf(val)!=-1){
					$(e).parents('.circle').show()
				}
			})
			//$('.functions.panel .circle .char_name:contains("'+val+'")').parents('.circle').show()
		}else{
			$(sc).find('.circle').show()
		}
	})
	$('[name=pw]').focusin(function(e) {
		if($('[name=un]').val()){
			message();			
		}
		showLoginBtn();
	});
	$('input').focusout(showFormText);
	$('input').on('input',showLoginBtn);
	//Checkin bubbles
	$('body').on('keypress','.pin [type=password]',function(e){
		if(e.keyCode==13){
			var au = $(e.target).parents('.active-user');
			if($(au).hasClass('patient')){
				tryActiveLogin(au,function(id){
					getCharacter(id,function(ch){
						//DR = ds.CH;
						ds.editCH = formatChar(ch[0]);
						loadPsychologistPanel()
					})
				})
			}else{
				tryActiveLogin(au)
			}
		}
	})
	$('body').on('input','[name="service"],[name="skill_cost"]',function(){
		var inn = $(this).parents('.panel')
		var v = fixInt($(inn).find('[name="service"]').val());
		var sc = $(inn).find('[name="skill_cost"]');
		sc = $(sc).length>0? fixInt($(sc).val()) : 0;
		var cost = fixInt(v+sc);
		var tx = getTaxCost(cost,'s');
		var total = fixInt(cost+tx);
		
		$(inn).find('.egotax').text(tx)
		$(inn).find('.totalEgoCost').text(total)
		var max = $(inn).find('.avail-energy').text()
		if(fixInt(max)< fixInt(total)){
			$(inn).find('.btn.therapy').attr('disabled','disabled')
		}else{
			$(inn).find('.btn.therapy').removeAttr('disabled')
		}
		
	})
	$('body').on('click','.psych.patient.buyer',function(){
		var id = $(this).attr('id')
		getCharacter(id,function(ch){
			ds.editCH2 = formatChar(ch[0]);
			$('.buyer-block').show()
			$('.buyer-block .buyer-name').text('Buyer: '+ds.editCH2.char_name)
			$('.buyer-block .avail-energy').text(ds.editCH2.energy)
			$('.buyer-block [name="buyer_id"]').val(ds.editCH2.char_id)
			toscreen('psych-process')
		})		
	})
	$('body').on('click','.psych-process .relbox.selectable',function(){
		$('.psych-process .relbox.selectable').not(this).removeClass('selected');
		$(this).toggleClass('selected')
	})
	$('body').on('click','.psych.patient:not(.buyer)',function(){
		var id = $(this).attr('id')
		getCharacter(id,function(ch){
			ds.editCH = formatChar(ch[0]);
			loadPsychologistPanel()
		})		
	})
	$('body').on('click','.active-user .btn',function(){
		var au = $(this).parents('.active-user');
		if($(au).hasClass('patient')){
			tryActiveLogin(au,function(id){
				getCharacter(id,function(ch){
					ds.editCH = formatChar(ch[0]);
					loadPsychologistPanel()
				})
			})
		}else{
			tryActiveLogin(au)
		}
	})
	//Login functions
	$('#selCharBtn').click(function(){
		var char = $('#char-list').val();
		doLogin(char);
	})
	//First login check
	/*$('#loginbtn').click(function(event){
		event.preventDefault();
		firstLoginCheck();
	});*/
	$('body').on('submit','#logform',function(e){
		e.preventDefault();
		firstLoginCheck();
	})	
	//LOGOUT
	$('.signbtn').click(logout);
	
	
	
	/*=====================================
	  Source Screen Actions
	//=====================================*/
	
	//Rule Widget Actions
	$('body').on('click','.rule-select:not(.set,[disabled]) .rule-index',function(){
		handleRuleIndexClick(this)
	})
	$('body').on('click','.rule-select:not(.set,[disabled]) .multi.plus, .rule-select:not(.set,[disabled]) .multi.minus',function(e){
		handleMultiItemCount(e)
	})
	$('body').on('click','.rule-select:not(.set,[disabled]) .rule-selected',function(){
		handleRuleSelectClick(this)
	})
	$('body').on('click','.rule-select:not(.set,[disabled]) .rules-wrap .rule-item:not([disabled],.disqual,.on)',function(e){
		handleRuleItemClick(this)
	})
	//CHANGE Race or Nation
	$('body').on('selected','#edit-source.screen #birth-race-save, .edit-source.screen #nation-save',function(){
		handleSelectedBackgroundRule(e.target)
	})
	//CHANGE backgrounds
	$('body').on('selected','.background .rule-select:not(.set)',function(e){
		handleSelectedBackgroundRule(e.target)
	})
	$('body').on('click','#edit-source.screen .btn.save',saveSource)
	
	/*=====================================
	  Mission Contol Actions
	//=====================================*/
	$('body').on('click','.edit-asteroid', function(e){
		var line = $(e.target).hasClass('asteroid')? e.target : $(e.target).parents('.asteroid')
		var id = $(line).attr('id')
		
		//get the mission and view it in edit mode
		mainQuery({
			data: {method:'getAsteroid','id':$(line).attr('id')},
			success: function(html){
				if($(line).hasClass('planet')){
					toscreen('create-asteroid',tmp.createPlanet(html[0]));
				}else{
					toscreen('create-asteroid',tmp.createAsteroid(html[0]))
				}
			}
		})
		return false;//Keeps asteriod/planet from active toggling
	})
	$('body').on('click','.mission-line',function(e){
		var line = $(e.target).hasClass('mission-line')? e.target : $(e.target).parents('.mission-line')
		var info = {};
		info.captain = ds.CH.char_id;
		info.captain_name = ds.CH.char_name;
		if($(line).hasClass('planet')){
			info.planet = $(line).attr('data-planet')
		}
		var admin = $(e.target).parents('#mods.screen').length>0;
		if($(line).hasClass('explore')){
			//toscreen('destination',tmp.destinExplore(info))
			//setAutoCompleteCharacters(".crew-list")
			info.type = 'explore';
			mainQuery({
				data: {method:'singleMission','id':$(line).attr('data-qid')},
				success: function(html){					
					info = html.length>0? html[0] : info;
					info.area = roomlist;
					if(info.ref && typeof info.ref == 'object'){
						var f = _.find(equip_skills,function(h){
							return h.id+'' == info.ref+''; 
						})
						info.ref_name = f.short;
					}
					transformMissionData(info)
				}
			})
		}else if($(line).hasClass('hack')){
			info.servers = core.options.servers;
			info.equip_skills = equip_skills
			info.type = 'hack';
			mainQuery({
				data: {method:'singleMission','id':$(line).attr('data-qid')},
				success: function(html){					
					info = html.length>0? html[0] : info;
					if(info.ref){
						var f = _.find(equip_skills,function(h){
							return h.id+'' == info.ref+''; 
						})
						info.ref_name = f.short;
					}
					transformMissionData(info)
				}
			})
		}else{			
			mainQuery({
				data: {method:'getAsteroid','id':$(line).attr('id')},
				success: function(html){
					transformMissionData(html[0])
				}
			})
		}
		function transformMissionData(info){
			if(info.progress){
				var chars = [info.captain]
				chars = chars.concat(_.compact(_.uniq(info.crew.split(','))))
				mainQuery({
					data: {method:'charactersByID','ids':chars.join(',')},
					success: function(html){
						info.captain = html[0].char_id;
						info.captain_name = html[0].char_name;
						info.crew_list = _.pluck(html.slice(1),'char_name');
						displayAsteroid(info)
					}
				})
			}else{
				//Static
				info.captain = ds.CH.char_id;
				info.captain_name = ds.CH.char_name;
				displayAsteroid(info)
			}
		}
		function displayAsteroid(info){
			info.isCaptain = info.captain == ds.CH.char_id;
			var temp = tmp.destinPilot;
			if(info.type=='hack') temp = tmp.destinHack;
			if(info.type=='explore') temp = tmp.destinExplore;
			info.admin = admin
			if(admin){
				toscreen('amod',temp(info))
			}else{
				toscreen('destination',temp(info))
			}
			mainQuery({
				data:{'method':'allUserCharacters'},
				success: function(html){
					html = _.sortBy(html,'char_name')
					core.autodata = html
					autoCompleteTeams2("#destination.screen",html);
				}
			})
		}
	})
	
	$('body').on('change','.server-select',function(e){
		var v = $(e.target).val()
		var d = $(e.target).parents('#destination.screen')
		$(d).find('.difficulty').removeClass('c u r').addClass(v).find('span').text(v)
	})
	
	function split( val ) {
      return val.split( /,\s*/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }
    $('body').on('click','.auto-hold.set-admin .auto-content',function(){
	    var u = $(this).find('.txt').attr('data-user')
	    var hold =  $(this).parents('.auto-hold')
	    if(u){
		    $(hold).find('.auto-content').removeClass('on')
		    $(this).addClass('on')
		    $(hold).parents('form').find('[name="admin_id"]').val(u)
	    }
    })
	$('body').on('click','.auto-hold .removeFromList',function(){
		var txt	= $(this).parents('.auto-content').find('.txt').text()
		var terms = $(this).parents('.auto-hold').attr('data-value');
		terms = terms.split( /,\s*/ );
		terms = _.reject(terms,function(t){
			return t+'' == txt+'';
		})
		var ids = $(this).parents('.auto-hold').attr('data-ids');
		ids = ids.split( /,\s*/ );
		var f = _.find(core.autodata,function(c){
			return c.char_name == txt;
		})
		ids = _.reject(ids,function(i){
			return i+'' == f.char_id+'';
		})
		//ids.push( f.char_id ); //!!!!! Need to adjust this to ui.item.id or whatever
		ids = _.unique(_.compact(ids));
		
		$(this).parents('.auto-hold').attr('data-ids',ids.join(','))
		$(this).parents('.auto-hold').attr('data-value',terms.join(','))
		$(this).parents('.auto-content').remove();
	})
	$('body').on('click','.long-range-puzzle',function(){
		var id = $(this).parents('.mission-full').attr('data-asteroid');
		var cnt = tmp.longRangeScanner({id:id})
		toscreen('long-range-scan',cnt)
	})
	
	$('body').on('keypress','.scan-pin',function(e){
		if(e.keyCode==13){	
			engageScanner(e)
		}
	})
	/*====================================
		Maintenence Actions
	//====================================*/
	$('body').on('change','#maintenance [name=year_select]',limitMainteneceSelects);
	
	
	
	
	
	/*====================================
	  Admin: MISC Actions
	//=====================================*/
	$('body').on('click','#gamemode',function(){
		var on = $(this).hasClass('check');
		setGameMode(!on) 
		$(this).toggleClass('on')
		$(this).toggleClass('check')
		$('.gm_text').html(on? 'OFF':'ON')
	});
	$('body').on('click','#personalDevice',function(){
		var on = !$(this).hasClass('check');
		$(this).toggleClass('on')
		$(this).toggleClass('check')
		$('.pd_text').html(on? 'YES':'NO')
		if(on){
			localStorage['personalDevice'] = ds.CH.char_id;
		}else{
			localStorage.removeItem('personalDevice')
			detectIdle()
		}
	});
	
	$('body').on('click','#addSkill,#addPsion',function(e){
		var ui = $(e.target).parents('.addskillUI');
		var type = $(ui).find('.sel-wrap.type select').val()
		var skill = $(ui).find('.sel-wrap.name select').val()
		var source = type=='known' || type == 'learn'? core.skills : core.psion;
		
		if(skill){
			var f = _.find(source, function(s){
				return s.id+'' == skill;
			})
			if($('#removeSkillsForm #'+type+' .value #'+f.id).length==0){
				var str = '<div id="'+f.id+'" class="relbox"><div class="fa close btn"></div><div class="inrel">'+f.label+'</div></div>';
				$('#removeSkillsForm #'+type+' .value').append(str)
			}else{
				var method = type.indexOf('learn')==0? 'Aquired':'Learned'
				message('Already '+method,false,true)
			}
		}else{
			var m= type=='known' || type == 'learn'? 'Skill' : 'Power';
			message('Select a '+m,false,true)
		}
	})
	$('body').on('click','.asteroidbank .asteroid',function(e){		
		if(!$(this).hasClass('edit')){
			$(this).toggleClass('live')
			$(this).toggleClass('altered')
		}
	})
	
	$('body').on('click','.give-frag',function(){
		$(this).parents('.gbox').find('.give-frag').toggle()
		$(this).parents('.gbox').find('.frag-bank.form').toggle()
	})
	$('body').on('change','.character-to',function(e){
		var v = $(e.target).val()
		if(v=='station'){
			$(e.target).parents('.frag-bank.form').find('.pan:not(.energy)').addClass('disabled').find('input').attr('disabled','disabled')
		}else{
			$(e.target).parents('.frag-bank.form').find('.pan:not(energy)').removeClass('disabled').find('input').removeAttr('disabled')
		}
	})
	$('body').on('keyup','.frag-bank.form input',function(e){
		var v = $(e.target).val()
		var id = $(e.target).parents('.pan').attr('id')
		id = id == 'energy'? id : id+'_frag';
		var cha = ds.CH;
		var bank = $(e.target).parents('.gbox')
		if($(bank).hasClass('team')){
			cha = _.find(ds.CH.teams,function(t){
				return t.char_id+'' == $(bank).attr('data-id')
			})
		}
		var max = cha[id];
		
		if(v > max){
			$(e.target).val(max)
		}
	})

	
	/*====================================
	  Admin: Edit character Actions
	//=====================================*/
	$('body').on('click','#admin-charlist .btn.search',searchForChar);
	$('body').on('keypress','#searchchars',function(e){
		if(e.keyCode==13){
			searchForChar()
		}
	})
	$('body').on('click','#admin-asteroid .btn.search',searchForMission);
	$('body').on('keypress','#searchmissions',function(e){
		if(e.keyCode==13){
			searchForMission()
		}
	})
	function searchForMission(){
		message();	
		var term = $('#searchmissions').val()
		term = term? term : '*';
		$('.asteroidbank').html('')
		mainQuery({
			data:{'q':term,'method':'searchAsteroids'},
			success: function(html){
				html = _.uniq(html,function(p){return p.id})
				
				if(html.length==0){
					$('.asteroidbank').html('<h3>No Resuts</h3>')	
				}else{
					_.each(html,function(ch){
						$('.asteroidbank').append(tmp.asteroidsm(ch))
					})
				}
			}
		})
	}
	
	function searchForChar(){
		message();	
		var term = $('#admin-charlist #searchchars').val()
		term = term? term : '*';
		searchCharacters(term,function(html){
			$('#admin-charlist .search-results').html('')
			if(html.length==0){
				$('#admin-charlist .search-results').html('<h3>No Resuts</h3>')	
			}
			_.each(html,function(ch){
				ch = formatChar(ch)
				$('#admin-charlist .search-results').append(tmp.listChar(ch))
			})
		})	
	}
	$('body').on('click','#admin-charlist .btn.character',function(){
		var id = $(this).attr('data-char-id');
		var type = $(this).hasClass('team')? 'team' : 'character';
		if(type == 'team'){
			//! also add the remove-calculate for teams*/
			getCharacter(id,function(ch){
				ds.editCH = formatChar(ch[0])
				var c =  tmp.adminTeamPanel(ds.editCH)
				toscreen('admin-char-panel',c)
			})
		}else{
			getCharacter(id,function(ch){
				ds.editCH = formatChar(ch[0])
				var c =  tmp.adminCharPanel(ds.editCH)
				toscreen('admin-char-panel',c)
			})
		}
	})
	$('body').on('click','.editRelForm .relbox .close',function(){
		$(this).parents('.relbox').toggleClass('off')
	})
	$('body').on('click','#editUserForm #birth .relbox .close,#editUserForm #nation .relbox .close',function(e){
		var rel = $(this).parents('.relbox');		
		if($(rel).hasClass('off')){
			$(this).parents('.field-line').find('input').val('');
		}else{
			$(this).parents('.field-line').find('input').val($(this).attr('id'));
		}
	})
	/*====================================
	  Admin: Assign blueprint
	//=====================================*/
	$('body').on('click', '.admin-blueprint #rarity .btn',function(){
		
	})
	$('body').on('click','.admin-blueprint .eqskill',function(){
		skillFilter()
	})
	$('body').on('click','.admin-blueprint .togglegenerate .btn',function(){
		if($(this).attr('id')=='R'){
			$('.specific, .searchfield').addClass('ninja');
			$('.filters .rarity, .filters .eqskillList').removeClass('ninja')
			useFilters()
			skillFilter()
		}else if($(this).attr('id')=='SRCH'){
			$('.specific,.searchfield').removeClass('ninja');
			$('.specific .itemgroup').removeClass('ninja');
			$('.filters .rarity, .filters .eqskillList').addClass('ninja')
			$('.specific .item').removeClass('ninja')
		}else{
			$('.searchfield').addClass('ninja')
			$('.specific').removeClass('ninja');
			$('.filters .rarity, .filters .eqskillList').removeClass('ninja')
			useFilters()
			skillFilter()
		}
	})
	$('body').on('input', '.admin-blueprint .searchfield #searchprints',function(){
		var v = $(this).val().toLowerCase()
		if(v){
			$('.specific .item').each(function(i,e){
				if($(e).text().toLowerCase().indexOf(v)==-1){
					$(e).addClass('ninja').removeClass('on')
				}else{
					$(e).removeClass('ninja')
				}
		})
		}else{
			$('.specific .item').removeClass('ninja')
		}
	})
	$('body').on('click','.admin-blueprint .eqtypeselect .btn, .admin-blueprint #rarity .btn',function(){
		useFilters()
	})
	function skillFilter(){
		var id = $('.admin-blueprint .eqskill.on').attr('id')
		var r  = $('.admin-blueprint #rarity .btn.on').attr('id')
		$('.eqtype').addClass('ninja')
		$('#'+id+'.eqtype').removeClass('ninja')
		$('.eqtype').not('.ninja').find('.'+r+'.item').removeClass('ninja')
	}
	function useFilters(){
		var r  = $('.admin-blueprint #rarity .btn.on').attr('id')
		$('.admin-blueprint .flat-input.sub .temp').removeAttr('disabled')
		$('.admin-blueprint .flat-input.sub .generate').removeAttr('disabled')
		if(r == 'A'){
			$('.admin-blueprint .flat-input.sub .temp').attr('disabled','disabled')
			$('.admin-blueprint .flat-input.sub .generate').attr('disabled','disabled')
		}
		$('.eqtype').not('.ninja').find('.item').addClass('ninja')
		$('.eqtype').not('.ninja').find('.'+r+'.item').removeClass('ninja')
		//$('.eqtype').not('.ninja').find('.'+r+'.item#'+id).removeClass('ninja')
	}
	
});