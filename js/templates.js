var tmp		= {};
var tmpstr	= {};
var part	= {};
var tmpsc	= {};

tmpstr.select =
'<select>\
	{{#each .}}\
	<option {{#if selected}}selected="selected" {{/if}}value="{{value}}">{{label}}</option>\
	{{/each}}\
</select>';
tmpstr.modOptions = 
'{{#each .}}<option {{#if class}}class="{{class}}" {{/if}}value="{{rel_id}}">{{name}} ({{single}})</option>{{/each}}';

tmpstr.configRace = 
'<div class="topspace"></div><div class="panel low">\
	<h3>{{label}}</h3>\
</div>\
<div class="panel low">\
	<h4>Advantages</h4><p>{{advantage}}</p>\
	<h4>Disadvantages</h4><p>{{disadvantage}}</p>\
</div>';
tmpstr.relbox = 
'<div id="{{id}}" class="relbox"{{#if multi}} data-count="{{info}}"{{/if}}>\
	<div class="fa close btn"></div>\
	<div class="inrel">{{name}}</div>\
</div>'
tmpstr.listbox = 
'<div id="id_{{id}}" data-id="{{id}}" {{#if sk_level}}data-level="{{sk_level}}" {{/if}}{{#if description}}data-message="{{description}}" {{/if}}class="{{#if on}}on flat {{/if}}{{#if attr.[1]}}multi {{/if}}{{#if active}}active selected {{/if}}{{#if description}}with-description {{/if}}{{#if owner}}team-owned {{/if}}{{#ifCond info "banausic"}} banausic exempt {{else ifCond info "supernal"}} supernal exempt {{/ifCond}}{{#if class}}{{class}} {{/if}}btn next fa" data-info="{{info}}"{{#unless attr.[1]}} data-attr="{{attr.[0].label}}"{{/unless}}{{#if owner}} data-owner="{{owner_id}}"{{/if}}>\
	{{#if attr}}\
		<div class="drop{{#if attr.[1]}} hasmore{{#unless info}} more{{/unless}}{{/if}} {{attr_class}}"\
		{{#if info}} data-attr="{{info}}"{{/if}}><div class="drop-wrap">\
		{{#if attr.[1]}}<span class="fa none"></span>{{/if}}\
		{{#each attr}}\
			<span id="{{id}}" class="fa {{label}}" data-ind="{{@index}}"></span>\
		{{/each}}\
		</div></div>\
	{{/if}}\
	<div class="inner">\
		<div class="icon fa" data-message="View More"></div>\
		<div class="inside label">{{label}}</div>\
		<div class="description">{{{prereq}}}</div>\
		{{#if owner}}<h4 class="skill-owner fa team">{{owner}}</h4>{{/if}}\
		{{#ifCond info "banausic"}}<h4 class="national">Banausic Skill</h4>{{/ifCond}}\
		{{#ifCond info "supernal"}}<h4 class="national">Supernal Skill</h4>{{/ifCond}}\
	</div>\
</div>';

tmpstr.listChar = 
'<div id="id_{{char_id}}" data-userid="{{user_id}}" data-char-id="{{char_id}}" class="character btn next fa with-description {{type}}">\
	<div class="inner">\
		<div class="icon fa" data-message="View More"></div>\
		<div class="inside">{{char_name}} / {{fullname}}</div>\
		<div class="description">{{birth_obj.name}}{{#if nation_object}}, {{nation_object.name}}{{/if}}</div>\
	</div>\
</div>';
tmpstr.loginscreen =
'<div class="login-screen screen active" data-screen="main" data-left="0" data-top="0">\
    <div class="topspace"></div>\
    <div id="features" class="ui panel wide main-features functions off">\
	    <div class="circle simple btn filthy-rich" data-cmd="getAllowance" style="display:none">Allowance</div>\
	    <div class="circle simple btn need-char" data-screen-link="source-code">Source Code</div>\
		<div id="fab" class="circle simple btn" data-cmd="doFabricator">Fabricator</div>\
		<div class="circle simple btn" data-cmd="doMarketing">MARKET</div>\
		<div id="psych" class="circle simple btn" data-cmd="doPsychology" style="display:none">Psychology</div>\
		<div id="maint" class="circle simple btn" data-cmd="domaintenance">maintenance</div>\
		<div class="circle simple btn gameon" data-cmd="doMissions" style="display: none">Missions</div>\
		<div class="circle simple btn gameon" data-cmd="doResleeve" style="display: none">TRAUMA</div>\
		<div class="circle simple btn need-admin" data-cmd="toAdmin">Admin</div>\
	 </div>\
	 <div id="main" class="panel main small">\
     	<div class="container">\
        	<div class="lfs-logo halfh"></div>\
            <form id="logform" class="fadeobj">\
            	<div class="flat-input">\
                	<label>U:</label>\
                    <div class="input-hold"><input type="text" name="un" required="required"/></div>\
                </div>\
                <div class="flat-input">\
                	<label>P:</label>\
                    <div class="input-hold"><input type="password" name="pw" required="required"/></div>\
                </div>\
                <div class="flat-input sub">\
                	<input id="loginbtn" type="submit" class="btn on" value="ACCESS" disabled="disabled"/>\
                </div>\
            </form>\
        </div>\
</div>'

tmpsc.scanner = 
'<div v-if="ds.loggedIn"><div class="topspace"></div>\
<div class="panel scanner" :data-scan="[admin? \'staffProcessQr\' : \'processQr\']">\
	<h3 v-if="admin">Map QR codes</h3>\
	<h3 v-else>Scan Fragments</h3>\
    <div v-if="admin" class="frag-select">\
        <label>Import as:</label>\
        <select class="qr-option-select">\
        	<option>Energy</option>\
            <option>Frag</option>\
            <option>Skill</option>\
            <option>Psion</option>\
        </select>\
        <select class="qr-energy-select">\
            <option value="e:5">5</option>\
            <option value="e:25">25</option>\
        </select>\
        <select class="qr-frag-select" style="display:none"></select>\
        <select class="qr-skill-select" style="display:none"></select>\
        <select class="qr-psion-select" style="display:none"></select>\
    </div>\
    <div v-else id="team-drop">\
    	<label>Scan to: </label>\
    	<select id="seldrop">\
    		<option :value="ds.CH.char_id">{{ds.CH.char_name}}</option>\
    		<option v-for="team in ds.CH.teams" :value="team.char_id">{{team.char_name}}</option>\
    	</select>\
    </div>\
    <div id="qr-scaner" class="scanner scan-obj">\
        <div class="controls">\
            <button id="scanbtn" class="scanbtn btn fa">Capture</button>\
            <button id="stopEndbtn" class="stopEndbtn btn fa" style="display:none">Stop</button>\
            <div class="status"><span class="scan">Scanning</span><span class="dup">Already Scanned</span>\
            <span class="success">Success</span><span class="error">Not Found</span><span class="partial">Scan Again</span></div>\
        </div>\
        <div class="cam"><div class="inner"><div class="wrap"><video id="v" autoplay></video></div></div></div>\
        <div class="result"></div>\
        <!--<div class="can"><canvas id="qr-canvas" width="800" height="600"></canvas></div>-->\
    </div>\
</div></div>';

tmpsc.checkin = 
'<div class="functions panel">\
	<div class="actions filter searcher">\
		<div class="btn large fa search"></div>\
		<input id="searchchars" type="text" placeholder="ENTER SEARCH">\
	</div>\
	<div id="new" class="circle btn simple" data-cmd="startCheckin">CHECK IN</div>\
	<div v-for="char in active" :id="char.char_id" :logged="char.loggedIn" class="circle btn active-user" :class="{ \'on\': char.loggedIn==\'true\' }"><span class="char_name">{{char.char_name}}</span>\
		<div class="pin"><input type="password" placeholder="P"/><div class="btn white">GO</div></div>\
	</div>\
</div>';
tmpsc.maintenence = 
'<div v-if="char.exceptions"><div class="topspace"></div><div class="panel">\
	<h3 class="block">Station Settings</h3>\
	<div class="field-group"><form>\
		<div class="insider">\
			<div class="field-line small">\
				<label class="label">Station Energy</label>\
				<div class="value input"><label>{{ops.station_energy}}</label></div>\
			</div>\
			<div class="field-line small">\
				<label class="label percent fa">SALES:</label>\
				<div class="value input">\
					<input v-if="char.exceptions.cemo" type="number" name="tax_sales" :value="ops.tax_sales"/>\
					<label v-else>{{ops.tax_sales}}</label>\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label percent fa">INCOME:</label>\
				<div class="value input">\
					<input v-if="char.exceptions.cemo" type="number" name="tax_income" :value="ops.tax_income"/>\
					<label v-else>{{ops.tax_income}}</label>\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label percent fa">CONSTRUCTION:</label>\
				<div class="value input">\
					<input v-if="char.exceptions.cemo" type="number" name="tax_construct" :value="ops.tax_construct"/>\
					<label v-else>{{ops.tax_construct}}</label>\
				</div>\
			</div>\
		</div>\
	</form></div>\
	<div v-if="event">\
		<h3 class="block">Energy Flow: {{total}} <span class="energy fa"></span></h3>\
		<h3 class="block">Net: {{net}} <span class="energy fa"></span></h3>\
		<div class="field-group"><form>\
			<div class="progressbar two">\
				<div class="earned" :style="\'width:\'+percent+\'%\'">+ {{event.earned}}</div>\
				<div class="spent" :style="\'width:\'+otherPercent+\'%\'">- {{event.spent}}</div>\
			</div>\
		</div>\
	</div>\
	<div v-if="char.exceptions.cemo" class="btn fa save" data-cmd="saveOps">Save Options</div>\
</div></div>';

tmpstr.card = 
'<div class="character-card">\
	{{#ifCond current_sleeve.name "Hologram"}}\
	<h3>You are a hologram.</h3>\
	{{else}}\
	<div id="front-page" class="page">\
		<div class="char-header">\
			<div class="logo-wrap"><div class="logo"></div></div>\
			<div class="char-name">{{char_name}}</div>\
		</div>\
		<div class="card-section top">\
			<div class="title-bar">Character Sheet</div>\
			<div class="valpair pair-left">\
				<div class="key">Bio Dev:</div><div class="value">{{fullname}}</div>\
			</div>\
			<div class="valpair pair-right">\
				<div class="key">Ego:</div><div class="value">{{used_ego}}/{{max_ego}}</div>\
			</div>\
			<div class="valpair pair-left">\
				<div class="key">Config:</div><div class="value">{{config_label}}</div>\
			</div>\
			<div class="valpair pair-right">\
				<div class="key">Tolerence:</div><div class="value">{{ego_tolerence}}</div>\
			</div>\
			<div class="valpair pair-left">\
				<div class="key">Birth Race:</div><div class="value">{{birth_obj.name}}</div>\
			</div>\
			<div class="valpair pair-right">\
				<div class="key">Cunning:</div><div class="value">{{ego_cunning}}</div>\
			</div>\
			<div class="valpair pair-left">\
				<div class="key">Nation:</div><div class="value">{{nation_object.name}}</div>\
			</div>\
			<div class="valpair pair-right">\
				<div class="key">Discipline:</div><div class="value">{{ego_discipline}}</div>\
			</div>\
			<div class="counts">\
				<div class="icons health">{{hp}}</div><div class="icons armor">{{armor}}</div>\
				<div class="icons tp">{{pools.tp}}</div><div class="icons cp">{{pools.cp}}</div><div class="icons dp">{{pools.dp}}</div>\
			</div>\
		</div>\
		{{#if trauma.length}}\
			<div class="card-section trauma">\
			<div class="title-bar">Mental Trauma</div>\
			{{#each trauma}}\
					{{#ifCond label "No Penalty"}}\
					{{else}}\
						<label class="trauma-item">{{label}}</label>\
					{{/ifCond}}\
				{{/each}}\
			</div>\
		{{/if}}\
		<div class="nation-race">\
			{{#each birth_races}}\
			<div class="card-section sm-text{{#ifCond ../birth_races.length 2}} half{{/ifCond}} line2">\
				<div class="title-bar">Birth Race</div>\
				<h3>{{name}}</h3>\
				<hr/>\
				<div class="adv">{{adv}}</div>\
				{{#if disadv}}<div class="dis-adv">{{disadv}}</div>{{/if}}\
			</div>\
			{{/each}}<!--\
			{{#each nations_on}}\
			<div class="card-section sm-text{{#ifCond ../nations_on.length 2}} half{{/ifCond}} line2">\
				<div class="title-bar">Nation</div>\
				<div class="lbl">{{name}}</div>\
				<div class="adv">{{adv}}</div>\
				<div class="dis-adv">{{disadv}}</div>\
				</div>\
			{{/each}}\-->\
		</div>\
		<div class="card-section sm-text line2">\
			<div class="title-bar">Backgrounds</div>\
			{{#each background}}\
				<div class="valpair pair-half second">\
					<h3>{{name}}</h3>\
					<hr/>\
					<div class="adv">{{adv}}</div>\
					{{#if disadv}}<div class="dis-adv">{{disadv}}</div>{{/if}}\
				</div>\
			{{/each}}\
		</div>\
		<div class="card-section sm-text line2">\
			<div class="title-bar">Sleeve Stats</div>\
			<div class="valpair pair-full">\
				<h3>Sleeve Race: {{current_sleeve.name}}</h3>\
				<hr/>\
				{{#if current_sleeve.rules}}<div class="adv">{{current_sleeve.rules}}</div>\
				{{else if current_sleeve.adv}}<div class="adv">{{current_sleeve.adv}}</div>\
				{{/if}}\
				{{#if current_sleeve.disadv}}<div class="dis-adv">{{current_sleeve.disadv}}</div>{{/if}}\
				<div class="mods">\
					{{#if experiment_mod}}\
						<div class="valpair pair-half second">\
							<h3>{{experiment_mod.[0].name}}</h3>\
							<h4>({{experiment_mod.[0].single}})</h4>\
							<hr/>\
							<div class="adv">{{experiment_mod.[0].rules}}</div>\
						</div>\
					{{/if}}<!---->\
					{{#each current_sleeve.module}}\
						<div class="valpair pair-half second">\
							<h3>{{name}}</h3>\
							<h4>({{single}})</h4>\
							<hr>\
							<div class="adv">{{rules}}</div>\
						</div>\
					{{/each}}\
				</div>\
			</div>\
		</div>\
		<!--<div class="card-section skills">\
			<div class="title-bar">Skills + Psionics</div>\
			{{>skillBox active}}\
			<hr/>\
			{{>skillBox psion}}\
		</div>-->\
		{{#if active.length}}\
		<div class="card-section full-skills">\
			<div class="title-bar">Skills</div>\
			{{#each active}}\
				<div class="skill-line">\
					<h3><span class="attr-icon fa {{attrname}}"></span>{{sk_name}}</h3><hr/>\
					{{description}}\
					{{#if eq_prereq}}<h4>Requires: {{eq_prereq}}</h4>{{/if}}\
				</div>\
			{{/each}}\
		</div>\
		{{/if}}\
		{{#if psion.length}}\
		<div class="card-section full-psion">\
			<div class="title-bar">Psionic Powers</div>\
			{{#each psion}}\
				<div class="skill-line">\
				<h3><span class="attr-icon fa {{attrname}}"></span>{{psi_name}}</h3>\
				<hr/>\
				{{description}}\
				</div>\
			{{/each}}\
		</div>\
		{{/if}}\
		{{#if activeWear.length}}\
		<div class="card-section full-psion">\
			<div class="title-bar">Gear</div>\
			{{#each activeWear}}\
				<div class="gear-line">\
				<h3>{{name}}{{#if chargable}} <small> Charges: {{battery}}</small>{{/if}}</h3>\
				<h4>({{single}})</h4>\
				<hr>\
				<div class="adv">{{rules}}</div>\
				<div class="mods">\
					{{#each module}}\
						<div class="valpair pair-half second">\
							<h3>{{name}}</h3>\
							<h4>({{single}})</h4>\
							<hr>\
							<div class="adv">{{rules}}</div>\
						</div>\
					{{/each}}\
					</div>\
				</div>\
			{{/each}}\
		</div>\
		{{/if}}\
	</div>\
	{{/ifCond}}\
</div>';

tmpstr.selectbox = 
'<div class="select-case{{#if single}} onepage{{/if}}" data-page="0" data-count="{{count}}">\
	<div class="inner-box">\
	{{#each list}}\
	<div class="page">\
		{{#each .}}{{>listbox .}}{{/each}}\
	</div>\
	{{/each}}\
	</div>\
	{{#if scrolls}}\
	<div class="scroll-btns">\
		<div class="prev-btn btn fa none"></div>\
		<div class="next-btn btn fa"></div>\
	</div>\
	{{/if}}\
</div>';

tmpstr.options =
'<div class="option-list">\
	<div>Source Code</div>\
	<div>Psychology</div>\
	<div>Fabricator</div>\
	<div>Resleeve</div>\
	<div>Request Mission</div>\
	<div>Admin</div>\
</div>';

tmpstr.skillBox = 
'<div class="skill-list">\
	<div class="inner-box">\
	<div class="list">\
		<div class="index left"><div class="pointbar"><div class="icons dp"></div><div class="icons cp"></div><div class="icons tp"></div></div></div>\
		<div class="index left"><div class="pointbar"><div class="icons dp"></div><div class="icons cp"></div><div class="icons tp"></div></div></div>\
		{{#each .}}<div class="list-line{{#if active}} active{{/if}}">\
			<div class="labl">{{label}}</div>\
			<div class="mark tp">{{#if tolerence}}x{{/if}}</div>\
			<div class="mark cp">{{#if cunning}}x{{/if}}</div>\
			<div class="mark dp">{{#if discipline}}x{{/if}}</div>\
		</div>{{/each}}\
	</div>\
	</div>\
</div>';

tmpstr.skillFullBox = 
'<div class="skill-descriptions">\
	<div class="inner-box">\
	<div class="list">\
		{{#each .}}<div class="list-line">\
			<div class="labl">{{label}}</div>\
			<div class="description">{{description}}</div>\
		</div>{{/each}}\
	</div>\
	</div>\
</div>';

tmpstr.lostGear = 
'<h4>Some Loss Occured</h4>\
{{#if loss}}\
	{{#each loss}}\
		{{#if name}}<div class="fa broken">{{name}}</div>{{/if}}\
		{{#each module}}\
		<div class="fa broken modu">Module: {{name}}</div>\
		{{/each}}\
		{{#if battery}}\
			{{#ifCond battery "0"}}\
			{{else}}\
			<div class="fa broken battery">Battery: {{battery}}</div>\
			{{/ifCond}}\
		{{/if}}\
	{{/each}}\
{{/if}}\
{{#if trauma}}\
<h4> You have suffered Mental Trauma</h4>\
	<div class="fa trauma">{{trauma}}</div>\
{{/if}}';

tmpstr.sublimate =
'<div class="panel resub">\
	<div class="init-content">\
		<div id="doMentalTrauma" class="btn largeBtn" data-cmd="mentalTraumaUI">MENTAL TRAUMA</div><br/>\
		<div id="doResleeve" class="btn largeBtn" data-cmd="resleeveUI">SUBLIMATE</div>\
	</div>\
	<div class="result standard">\
		<h3>Resublimation Successfull</h3>\
		<div class="lost-bank"></div>\
		<p>Generate a birth sleeve?</p>\
		<p class="race">{{ch.birth_obj.name}}</p>\
		<input type="hidden" name="birth_race" value="{{ch.birth_obj.id}}">\
		<div class="yn-btns">\
			<div id="confirmSleeve" class="btn half yes" data-cmd="confirmSleeve">Y</div>\
			<div class="btn half no" data-screen-link="main">N</div>\
		</div>\
	</div>\
	<div class="result nation-tabula">\
		<h3>Resublimation Successfull</h3>\
		<div class="lost-bank"></div>\
		<p>Multiple birth sleeves found in database</p>\
		<p>Generate a birth sleeve?</p>\
		<select name="birth_race" class="race">\
			<option>Select Race</option>\
			{{#each races}}\
				{{#ifCond special "birth_ai"}}{{else}}<option value="{{id}}">{{name}}</option>{{/ifCond}}\
			{{/each}}\
		</select>\
		<div class="yn-btns">\
			<div id="confirmSleeve" class="btn half yes" data-cmd="confirmSleeve">Y</div>\
			<div class="btn half no" data-screen-link="main">N</div>\
		</div>\
	</div>\
	<!--<div class="result ai-message">\
		<h3>Resublimation Successfull</h3>\
		<div class="lost-bank"></div>\
		<p>No birth sleeve found for <br/><br/><span class="race">ARTIFICAL INTELIGENCE</span><br/>In the database</p>\
		<div class="btn half no" data-screen-link="login">DONE</div>\
	</div>-->\
	<div class="result ai-message">\
		<h3>Resublimation Successfull</h3>\
		<div class="lost-bank"></div>\
		<p>Generate a birth sleeve?</p>\
		<p class="race">{{ch.alt_birth_sleeve.name}}</p>\
		<input type="hidden" name="birth_race" value="{{ch.alt_birth_sleeve.id}}">\
		<div class="yn-btns">\
			<div id="confirmSleeve" class="btn half yes" data-cmd="confirmSleeve">Y</div>\
			<div class="btn half no" data-screen-link="login">N</div>\
		</div>\
	</div>\
	<div class="result insufficient">\
		<h3>Resublimation Successfull</h3>\
		<p>Insufficient funds to create a sleeve for <br/><span class="race">{{ch.birth_obj.name}}</span></p>\
		<div class="btn half no" data-screen-link="login">DONE</div>\
	</div>\
</div>';
tmpstr.activityScreen =
'<div class="topspace"></div><div class="panel">\
	<div class="field-group">\
		<div class="insider">\
			<div class="third override">\
				<div class="value input">\
					<select name="year_select">\
					{{log thisDate.[0]}}\
						{{#each years}}\
						{{log label}}\
						{{log ../thisDate}}\
						{{log ../thisDate.[0]}}\
							<option {{#ifCond ../thisDate.[0] label}}selected="selected" {{/ifCond}}>{{label}}</option>\
						{{/each}}\
					</select>\
				</div>\
			</div>\
			<div class="third override">\
				<div class="value input">\
					<select name="month_select">\
						<option {{#ifCond thisDate.[1] "01"}}selected="selected" {{/ifCond}}value="01">Jan</option>\
						<option {{#ifCond thisDate.[1] "02"}}selected="selected" {{/ifCond}}value="02">Feb</option>\
						<option {{#ifCond thisDate.[1] "03"}}selected="selected" {{/ifCond}}value="03">March</option>\
						<option {{#ifCond thisDate.[1] "04"}}selected="selected" {{/ifCond}}value="04">April</option>\
						<option {{#ifCond thisDate.[1] "05"}}selected="selected" {{/ifCond}}value="05">May</option>\
						<option {{#ifCond thisDate.[1] "06"}}selected="selected" {{/ifCond}}value="06">Jun</option>\
						<option {{#ifCond thisDate.[1] "07"}}selected="selected" {{/ifCond}}value="07">Jul</option>\
						<option {{#ifCond thisDate.[1] "08"}}selected="selected" {{/ifCond}}value="08">Aug</option>\
						<option {{#ifCond thisDate.[1] "09"}}selected="selected" {{/ifCond}}value="09">Sept</option>\
						<option {{#ifCond thisDate.[1] "10"}}selected="selected" {{/ifCond}}value="10">Oct</option>\
						<option {{#ifCond thisDate.[1] "11"}}selected="selected" {{/ifCond}}value="11">Nov</option>\
						<option {{#ifCond thisDate.[1] "12"}}selected="selected" {{/ifCond}}value="12">Dec</option>\
					</select>\
				</div>\
			</div>\
			<div class="third">\
				<div class="btn fa refresh" data-cmd="updateMaintenence">View</div>\
			</div>\
		</div>\
	</div>\
	{{#if data.length}}\
		{{#each data}}\
			<div class="activity-line expand-line">\
				<div class="cell expand-button"></div>\
				<div class="cell time">{{times.[0]}}<br/>{{times.[1]}}</div>\
				<div class="cell action">{{action}}</div>\
				<div class=" cell chars">{{fromName}}{{#if toName}} > {{toName}}{{/if}}</div>\
				<div class="underline">\
					<div class="cell info"><h4>Info</h4>{{info}}</div>\
					{{#if pre}}<div class="cell pre"><h4>Before</h4>{{pre}}</div>{{/if}}<!--\
				 -->{{#if post}}<div class="cell post"><h4>After</h4>{{post}}</div>{{/if}}\
				</div>\
			</div>\
		{{/each}}\
	{{else}}\
		<h3>No Activity</h3>\
	{{/if}}\
</div>';
tmpstr.characterConfig = 
'<div class="topspace"></div><div class="panel droid">\
	<h3 class="block">{{char_name}}</h3>\
	<div class="field-group half high{{#if free_ego}} free{{/if}}">\
		<div class="insider">\
			<div class="field-line">\
				<label class="label">BIO DEV:</label>\
				<label class="value">{{first_name}} {{last_name}}</label>\
			</div>\
			<div class="field-line">\
				<label class="label">BIRTH RACE:</label>\
				{{#if birth_obj.name}}\
					<label class="value">{{birth_obj.name}}</label>\
					{{#if birth_races.1.name}}<label class="value">{{birth_races.1.name}}</label>\{{/if}}\
				{{else}}\
					<label id="racename" class="value viewnext fa" data-screen-link="edit-source">Select</label>\
				{{/if}}\
			</div>\
			<div class="field-line nation">\
				<label class="label">NATION:</label>\
				{{#if nation_object.name}}\
					<label class="value">{{nation_object.name}}</label>\
					{{#if nations_on.1.name}}<label class="value">{{nations_on.1.name}}</label>\{{/if}}\
				{{else}}\
					<label id="nationname" class="value viewnext fa" data-screen-link="edit-source">Select</label>\
				{{/if}}\
			</div>\
		</div>\
	</div>\
	<div id="ego-block" class="field-group half high{{#if free_ego}} free{{/if}}">\
		<div class="insider">\
			<div class="field-line small">\
				<label class="label">EGO:</label>\
				<label class="value">{{max_ego}}<span class="free-ego" data-free="{{free_ego}}">/{{free_ego}}</span></label>\
			</div>\
			<div class="field-line small">\
				<label class="label">TOLERENCE:</label>\
				<label class="value" id="t" data-init="{{ego_tolerence}}" data-val="{{ego_tolerence}}" data-min="{{ego_tolerence}}">\
					<span class="num">{{ego_tolerence}}</span>\
					<span class="add ego fa"></span>\
					<span class="minus ego fa"></span>\
				</label>\
			</div>\
			<div class="field-line small">\
				<label class="label">CUNNING:</label>\
				<label id="c" data-init="{{ego_cunning}}" data-val="{{ego_cunning}}" class="value">\
					<span class="num">{{ego_cunning}}</span>\
					<span class="add ego fa"></span>\
					<span class="minus ego fa"></span>\
				</label>\
			</div>\
			<div class="field-line small">\
				<label class="label">DISCIPLINE:</label>\
				<label id="d" data-init="{{ego_discipline}}" data-val="{{ego_discipline}}" class="value">\
					<span class="num">{{ego_discipline}}</span>\
					<span class="add ego fa"></span>\
					<span class="minus ego fa"></span>\
				</label>\
			</div>\
		</div>\
	</div>\
	<div class="field-group sleeve">\
		<div class="insider">\
			<label class="full">Current Sleeve:</label>\
			<div class="padd">\
				<label class="value">{{current_sleeve.name}}</label>\
			</div>\
		</div>\
	</div>\
	{{#if  trauma.length}}\
	<div class="field-group background">\
		<div class="insider">\
			<label class="full">EGO LOSS: <!--<span class="ego-loss-percent">{{ego_loss}}</span>% --></label>\
			<div class="padd trauma-bank">\
				{{#each trauma}}\
					{{#ifCond label "No Penalty"}}\
					{{else}}\
						<label class="trauma-item">{{label}}</label>\
					{{/ifCond}}\
				{{/each}}\
			</div>\
		</div>\
	</div>\
	{{/if}}\
	<div class="field-group background">\
		<div class="insider">\
			<label class="full">BACKGROUNDS:</label>\
			<div class="padd" {{#unless bglist}} style="display:none"{{/unless}}>\
				<label id="backgroundlist" class="value">{{bglist}}</label>\
			</div>\
			{{#if free_bg}}\
				<div class="padd">\
					<label class="value viewnext fa" data-screen-link="edit-source">Select</label>\
				</div>\
			{{/if}}\
		</div>\
	</div>\
	{{#if teams.length}}\
		<div class="field-group teams">\
			<div class="insider">\
				<label class="full fa team">Affiliations:</label>\
				{{#each teams}}\
					<div class="btn next fa" data-id="{{char_id}}" data-cmd="viewTeam">{{char_name}}</div>\
				{{/each}}\
			</div>\
		</div>\
	{{/if}}\
	<div class="field-group">\
        <div class="btn next fa" data-screen-link="edit-source">VIEW BACKGROUNDS</div>\
		<div class="btn next fa" data-screen-link="known">SKILLS + PSIONICS</div>\
		<div class="btn next fa" data-screen-link="config">Skillsets</div>\
		<div class="btn next fa" data-screen-link="inventory">VIEW INVENTORY</div>\
		<div class="btn next fa" data-cmd="viewIndActivity">ACTIVITY</div>\
		<div id="personalDevice" class="btn fa{{#if personalDevice}} on check{{/if}}">P<span class="desktext">ersonal</span> Device: <span class="pd_text">{{#if personalDevice}}YES{{else}}NO{{/if}}</span></div>\
	</div>\
</div>';
tmpstr.editSource =
'<div class="fixed-head">\
	<div class="panel top leave-on">\
		<div class="topline"><h3><span class="desktext">Edit </span>Backgrounds</h3></div>\
		<div class="actions right">\
			<div class="btn large fa save"></div>\
		</div>\
	</div>\
</div>\
</div><div class="panel droid under-fixed">\
	<div class="field-group birth">\
		<div class="insider">\
			<label class="full">BIRTH RACE:</label>\
			{{#unless freeRace}}\
				<div id="birth-race-save" class="rule-select set" data-val="{{races_val}}">\
					{{>ruleBank races.static}}\
				</div>\
			{{else}}\
				<div id="birth-race-save" class="rule-select{{#if birth_races.0.name}} selected{{/if}}" data-count="2" data-val="{{races_val}}">\
					<div class="rule-index">\
						<h3>Select Race</h3>\
					</div>\
					<div class="rule-selected">\
						{{>ruleBank races.selected}}\
					</div>\
					<div class="rules-wrap">\
					{{>ruleBank races.bulk}}\
					</div>\
				</div>\
			{{/unless}}\
		</div>\
	</div>\
	<div class="field-group nation">\
		<div class="insider">\
			<label class="full">NATION:</label>\
			{{#unless freeNation}}\
				<div id="nation-save" class="rule-select set" data-val="{{nations_val}}">\
					{{>ruleBank nations.static}}\
				</div>\
			{{else}}\
				<div id="nation-save" class="rule-select{{#if nations_on.0.name}} selected{{/if}}" data-count="2"  data-val="{{nations_val}}">\
					<div class="rule-index">\
						<h3>Select Nation</h3>\
					</div>\
					<div class="rule-selected">\
						{{>ruleBank nations.selected}}\
					</div>\
					<div class="rules-wrap">\
					{{>ruleBank nations.bulk}}\
					</div>\
				</div>\
			{{/unless}}\
		</div>\
	</div>\
	<div class="field-group background{{#if free_bg}} free{{/if}}">\
		<div class="insider">\
			<label class="full">BACKGROUNDS: \
				<span class="bg-number" data-val="{{max_bg}}">\
					<span class="max-bg">{{max_bg}}</span>\
					<span class="free-bg">/{{free_bg}}</span>\
					{{#if exceptions.birth-aurani}}<span class="aurani-bg">+1 Psionic</span>{{/if}}\
				</span>\
			</label>\
			{{#if locked_bg}}\
				<div id="background-save" class="rule-select set" data-count="{{max_bg}}">\
					{{>ruleBank background_traits.static}}\
				</div>\
			{{else}}\
				<div id="background-save" class="rule-select{{#if background.0.name}} selected{{/if}}" data-count="{{max_bg}}" data-val="{{bg_val}}">\
					<div class="rule-index">\
						<h3>Select Background</h3>\
					</div>\
					<div class="rule-selected">\
						{{>ruleBank background_traits.selected}}\
					</div>\
					<div class="rules-wrap">\
						{{>ruleBank background_traits.bulk}}\
					</div>\
				</div>\
			{{/if}}\
		</div>\
	</div>\
	<div id="nation-independant" class="field-group{{#if exceptions.nation-independant}} on{{/if}}" style="display:none">\
		<div class="insider">\
			<label class="full">Independant Sleeve Mod:</label>\
			{{#if independant_mod}}\
				<div id="independant-mod-save" class="rule-select set" data-val="{{independant_mod.[0].id}}">\
					{{>rule independant_mod.[0]}}\
				</div>\
			{{else}}\
				<div id="independant-mod-save" class="rule-select">\
					<div class="rule-index">\
						<h3>Select Gene/Cyber ware</h3>\
					</div>\
					<div class="rule-selected"></div>\
					<div class="rules-wrap">\
					{{>ruleBank wares}}\
					</div>\
				</div>\
			{{/if}}\
		</div>\
	</div>\
	<div id="experiment-mod" class="field-group{{#if exceptions.extra_mod}} on{{/if}}" style="display:none">\
		<div class="insider">\
			<label class="full">Experimental Mod:</label>\
			{{#if experiment_mod}}\
				<div id="experiment-mod-save" class="rule-select set" data-val="{{experiment_mod.[0].id}}">\
					{{>rule experiment_mod.[0]}}\
				</div>\
			{{else}}\
				<div id="experiment-mod-save" class="rule-select">\
					<div class="rule-index">\
						<h3>Select Gene/Cyber ware</h3>\
					</div>\
					<div class="rule-selected"></div>\
					<div class="rules-wrap">\
					{{>ruleBank morewares}}\
					</div>\
				</div>\
			{{/if}}\
		</div>\
	</div>\
	<div id="exemplar" class="field-group" style="display:none">\
		<div class="insider">\
			<label>Exeplar Pool:</label>\
			{{#ifCond exceptions.nation-banausic_exemplar 0}}\
				<label>Tolerence</label>\
			{{else ifCond exceptions.nation-banausic_exemplar 1}}\
				<label>Discipline</label>\
			{{else ifCond exceptions.nation-banausic_exemplar 2}}\
				<label>Cunning</label>\
			{{else}}\
				<select>\
					<option>Select</option>\
					<option value="0">Tolerence</option>\
					<option value="2">Cunning</option>\
					<option value="1">Discipline</option>\
				</select>\
			{{/ifCond}}\
		</div>\
	</div>\
</div>'
tmpstr.ruleBank =
'{{#each .}}{{>rule .}}{{/each}}';
tmpstr.rule =
'<div id="{{id}}" class="rule-item{{#unless static}} btn{{#if active}} on{{/if}}{{/unless}}{{#if adv}}{{#if disadv}} both{{/if}}{{/if}}"{{#if multi}} data-count="{{info}}" data-init="{{info}}"{{/if}}>\
	<h3>{{{name}}}{{#if multi}}<div class="count-num">{{info}}</div>{{/if}}</h3>\
	{{#if adv}}<div class="adv add fa">{{adv}}</div>{{/if}}<!-->\
	{{#if disadv}}<div class="disadv minus fa">{{disadv}}</div>{{/if}}\
	{{#unless adv}}{{#unless disadv}}<div class="adv add fa">{{rules}}</div>{{/unless}}{{/unless}}\
	{{#if req}}<div class="req hash fa">{{req}}</div>{{/if}}<!---->\
	{{#if multi}}\
		<div class="multi plus white btn fa">Additional</div>\
		<div class="multi minus white btn fa">MINUS</div>\
	{{/if}}\
</div>';
tmpstr.sleeveList =
'<div class="topspace"></div><div class="panel">\
	<h3>SELECT SLEEVE</h3><div class="inline-btn fa plus add-sleeve"></div>\
	<div id="config-select">\
		<div id="1" data-id="1" class="with-description btn next fa">\
			<div class="icon fa" data-message="View More"></div>\
			<div class="inside">Alien Race(Birth Race), 3 Genes mods, 4 Cyberware mods</div>\
			<div class="description">Discipline 1, , </div>\
		</div>\
		<div id="1" data-id="1" class="with-description btn next fa">\
			<div class="icon fa" data-message="View More"></div>\
			<div class="inside">Alien Race, 3 Genes mods, 4 Cyberware mods</div>\
			<div class="description">Discipline 1, , </div>\
		</div>\
	</div>\
</div>';
tmpstr.editConfig = 
'<div class="fixed-head">\
	<div class="panel top" data-config-id="{{config_id}}">\
		<div class="actions left ego">\
			<div class="btn figure fa discipline">\
				<span class="min">{{used_d}}</span>/<span class="max">{{ego_discipline_max}}</span>\
			</div>\
			<div class="btn figure fa cunning">\
				<span class="min">{{used_c}}</span>/<span class="max">{{ego_cunning_max}}</span>\
			</div>\
			<div class="btn figure fa tolerence">\
				<span class="min">{{used_t}}</span>/<span class="max">{{ego_tolerence}}</span>\
			</div>\
		</div>\
		<div class="divider"></div>\
		<div class="actions egoops">\
			<div class="btn fa id" data-action="card" data-message="View Sleeve Card"></div>\
			<div class="btn fa large save" data-action="save-config" data-message="Save Config"></div>\
			<div class="btn fa large copy" data-action="copy-config" data-message="Copy to New Configuration"></div>\
			<div class="btn fa large print" data-action="print-config" data-message="Print Configuration"></div>\
		</div>\
		<div style="clear:both"></div>\
	</div>\
</div>\
<input type="hidden" name="char_id" value="{{char_id}}">\
<input type="hidden" name="edit-config" value="{{edit}}">\
{{#if hasExceptions}}\
<div class="panel leave-on under-fixed createbar">\
	{{#unless creation}}<!---->\
		{{#if exceptions.extra_skills}}\
			<h4 class="fa bullet"><span id="extra-skilled">0</span>/2 Cunning or Discipline skills over the maximum</h4>\
		{{/if}}<!---->\
		{{#if knack}}<h4 class="fa bullet">+1 Extra Psionic</h4>{{/if}}\
		{{#if exceptions.soldier}}<h4 class="fa bullet">-1 Cunning Slot </h4>{{/if}}\
		{{#if exceptions.scholar}}<h4 class="fa bullet">-1 Discipline Slot</h4>{{/if}}\
	{{/unless}}\
</div>\
{{/if}}\
<div class="panel low{{#unless hasExceptions}} under-fixed{{/unless}} double last-panel">\
	<div class="topbar">\
		<div class="half">\
			<label>Label: </label><input id="config-label" class="value" type="text" maxlength="30" value="{{config_label}}"/>\
		</div>\
		<div class="half">\
			<label>Edited:</label><label class="last-edit value">{{last_edit}}</label>\
		</div>\
	</div>\
	<div class="skill-table">\
		<div id="psion" class="relationbox{{#if diverge}} divergent{{/if}}" data-key="psion" data-subject="{{config_id}}" data-json="">\
			{{#if psion}}\
				<h3>PSIONICS</h3>\
				{{#each psion}}\
					{{>listbox .}}\
				{{/each}}\
			{{/if}}\
		</div>\
		<div id="known" class="relationbox" data-key="skill" data-subject="{{#if config_id}}{{config_id}}{{else}}config_id{{/if}}" data-json="">\
			{{#if known}}\
				<h3>Skills</h3>\
				{{#each known}}\
					{{>listbox .}}\
				{{/each}}\
			{{/if}}\
		</div>\
		<div id="skill-soft" class="field-group{{#if skillsoft}} on{{/if}}"{{#unless skillsoft}} style="display:none"{{/unless}}>\
			<div class="insider">\
				<label class="full">Skill Soft Skill:</label>\
				<div id="skill-soft-save" class="rule-select{{#if skillsoft.sk_name}} selected{{/if}}">\
					<div class="rule-index">\
						<h3>Select Skill</h3>\
					</div>\
					<div class="rule-selected">\
						{{#if skillsoft.sk_name}}\
						<div class="rule-item">\
							{{#if skillsoft.attr}}\
								<div class="drop {{skillsoft.attr_class}}"\><div class="drop-wrap">\
								{{#each skillsoft.attr}}\
									<span id="{{id}}" class="fa {{label}}" data-ind="{{@index}}"></span>\
								{{/each}}\
								</div></div>\
							{{/if}}\
							<div class="inner">\
								<div class="icon fa" data-message="View More"></div>\
								<div class="inside label">{{skillsoft.label}}</div>\
								<div class="description">{{{skillsoft.prereq}}}</div>\
							</div>\
						</div>\
						{{/if}}\
					</div>\
					<div class="rules-wrap">\
					{{#each known}}\
						{{#ifCond info "banausic"}}\
						{{else ifCond info "supernal"}}\
						{{else}}\
							<div id="id_{{id}}" data-id="{{id}}" data-level="{{sk_level}}" data-message="{{description}}" class="{{#ifCond ../skillsoft.sk_id id}}selected {{/ifCond}} rule-item btn next fa" data-info="{{info}}" data-attr="{{attr.[0].label}}">\
								{{#if attr}}\
									<div class="drop {{attr_class}}"\><div class="drop-wrap">\
									{{#each attr}}\
										<span id="{{id}}" class="fa {{label}}" data-ind="{{@index}}"></span>\
									{{/each}}\
									</div></div>\
								{{/if}}\
								<div class="inner">\
									<div class="icon fa" data-message="View More"></div>\
									<div class="inside label">{{label}}</div>\
									<div class="description">{{{prereq}}}</div>\
								</div>\
							</div>\
						{{/ifCond}}\
					{{/each}}\
					</div>\
				</div>\
			</div>\
		</div>\
	</div>\
</div>';
tmpstr.configList=
'<div class="topspace"></div><div class="panel">\
	<div class="">\
    	<h3>SELECT SKILLSET CONFIG</h3>\
        <div class="inline-btn fa plus add-config" data-cmd="editConfig"></div>\
        <div id="config-select">\
			{{#each .}}\
				<div id="id_{{id}}" data-id="{{id}}" class="{{#if active}}active selected {{/if}}btn next fa">\
					<div class="fa check activate-config" data-message="Set Active"></div>\
					<div class="inner stop-cmd"><div class="icon fa" data-message="View More"></div><div class="inside label">{{label}}</div></div>\
				</div>\
			{{/each}}\
		</div>\
	</div>\
</div>';
tmpstr.resleeve = 
'<div class="fixed-head">\
	<div class="panel top" data-config-id="{{config_id}}">\
		<div class="actions left ego">\
			<div class="btn figure fa discipline">\
				<span class="min">{{#if used_d}}{{used_d}}{{/if}}</span>/<span class="max">{{ego_discipline}}</span>\
			</div>\
			<div class="btn figure fa cunning">\
				<span class="min">{{#if used_c}}{{used_c}}{{/if}}</span>/<span class="max">{{ego_cunning}}</span>\
			</div>\
			<div class="btn figure fa tolerence">\
				<span class="min">{{#if used_t}}{{used_t}}{{/if}}</span>/<span class="max">{{ego_tolerence}}</span>\
			</div>\
			<div class="btn figure fa energy">\
				<span class="min">0</span>/<span class="max">{{energy}}</span>\
			</div>\
		</div>\
		<div class="divider"></div>\
		<div class="actions egoops">\
			<div class="btn fa id" data-action="card" data-message="View Sleeve Card"></div>\
			<div class="btn fa large save" data-action="save-config" data-message="Save Config"></div>\
			<div class="btn fa large copy" data-action="copy-config" data-message="Copy to New Configuration"></div>\
			<div class="btn fa large print" data-action="print-config" data-message="Print SKillset Configuration"></div>\
		</div>\
		<div style="clear:both"></div>\
	</div>\
</div>\
<input type="hidden" name="char_id" value="{{char_id}}">\
<input type="hidden" name="edit-config" value="{{edit}}">\
{{#if hasExceptions}}\
<div class="panel leave-on under-fixed createbar">\
	{{#unless creation}}<!---->\
		{{#if exceptions.extra_skills}}\
			<h4 class="fa bullet">+2 Cunning or Discipline skills over the maximum</h4>\
		{{/if}}<!---->\
		{{#if knack}}<h4 class="fa bullet">+1 Extra Psionic</h4>{{/if}}\
	{{/unless}}\
</div>\
{{/if}}\
<div class="panel low{{#unless hasExceptions}} under-fixed{{/unless}} double last-panel">\
	<div class="skill-table">\
		<div id="body" class="relationbox" data-key="body" data-subject="{{#if config_id}}{{config_id}}{{else}}config_id{{/if}}" data-json="">\
			{{#if sleeves}}\
				<h3>Body</h3>\
				{{#each sleeves}}\
					<div id="id_{{id}}" data-id="{{id}}" class="btn next fa" data-info="stored" data-attr="0">\
						<div class="inner">\
							<div class="icon fa"></div>\
							<div class="inside label">{{name}} x{{count}}</div>\
							<div class="description"></div>\
						</div>\
					</div>\
				{{/each}}\
			{{/if}}\
		</div>\
		<div id="psion" class="relationbox{{#if diverge}} divergent{{/if}}" data-key="psion" data-subject="{{config_id}}" data-json="">\
			{{#if psion}}\
				<h3>PSIONICS</h3>\
				{{#each psion}}\
					{{>listbox .}}\
				{{/each}}\
			{{/if}}\
		</div>\
		<div id="known" class="relationbox" data-key="skill" data-subject="{{#if config_id}}{{config_id}}{{else}}config_id{{/if}}" data-json="">\
			{{#if known}}\
				<h3>Skills</h3>\
				{{#each known}}\
					{{>listbox .}}\
				{{/each}}\
			{{/if}}\
		</div>\
	</div>\
</div>';

tmpstr.knownSkills=
'<div class="fixed-head"><div class="panel top leave-on">\
	<div class="actions left tabs">\
		<div id="known" class="btn fa on">SKILLS</div>\
		<div id="psion" class="btn fa"{{#unless psion.length}} data-nobg="true" disabled="disabled" data-message="Requires certain backgrounds to enable"{{/unless}}>PSIONICS</div></div>\
		<div class="divider"></div>\
		<div class="actions{{#if creation}} creation{{/if}}">\
			<div class="topline"><h3> <span class="known-count">{{skills_known}}</span>/<span class="known-max">{{ego}}</span></h3></div>\
			{{#unless creation}}\
				<div class="btn large fa view" data-message="Show All Skills"></div>\
				<div class="btn large fa view off" data-message="Hide Un-aquired skills" style="display:none"></div>\
			{{/unless}}\
			<div class="btn large fa save"{{#if creation}} disabled="disabled"{{/if}}></div>\
		</div>\
		<div class="actions left ego" style="display:none">\
			<div class="btn figure fa discipline">\
				<span class="min">{{used_d}}</span>/<span class="max">{{ego_discipline}}</span>\
			</div>\
			<div class="btn figure fa cunning">\
				<span class="min">{{used_c}}</span>/<span class="max">{{ego_cunning}}</span>\
			</div>\
			<div class="btn figure fa tolerence">\
				<span class="min">{{used_t}}</span>/<span class="max">{{ego_tolerence}}</span>\
			</div>\
		</div>\
		<div style="clear:both"></div>\
	</div>\
</div>\
{{#if hasExceptions}}\
<div class="panel leave-on under-fixed createbar">\
	{{#if creation}}<h4 class="fa bullet">Select all know skills or psionics to save</h3>{{/if}}\
	{{#unless creation}}<!---->\
		{{#if extra_404}}\
		<h4 class="fa bullet">\
			<span class="non404" style="display:none">Save to aquire skills</span>\
			<span class="add404">Choose <span class="aquiredCount">{{#ifCond exceptions.extra_skills 1}}1{{else}}2{{/ifCond}}</span> Un-aquired Skills To Aquire. (use the <span class="fa view"></span>to view)</span>\
		</h4>\
		{{/if}}\
		{{#if exceptions.extra_skills}}\
			<h4 class="fa bullet">+2 Known skills over the maximum</h4>\
		{{/if}}<!---->\
		{{#if knack}}<h4 class="fa bullet">+1 Extra Psionic</h4>{{/if}}\
	{{/unless}}\
	{{#if exceptions.nation-banausic}}{{#unless banausic}}<h4 class="fa bullet">Designate 1 skill as your Banaustic Union Skill. <small>You can choose unaquired skills (use the <span class="fa view"></span>to view)</small></h4>{{/unless}}{{/if}}\
	{{#if exceptions.nation-supernal}}{{#unless supernal}}<h4 class="fa bullet">Designate 1 skill as your Supernal Collective Skill. <small>You can choose unaquired skills (use the <span class="fa view"></span>to view)</small></h4>{{/unless}}{{/if}}\
</div>\
{{/if}}\
<div id="known" class="panel skill-table{{#unless hasExceptions}} under-fixed{{/unless}}{{#if extra_404}} extra_skills{{/if}} double known relationbox" data-screen="known-details" data-left="3" data-key="known" data-subject="{{char_id}}" data-json="">\
	{{#each skills}}\
		<h3 class="block section{{#if noskills}} noskills{{/if}}">{{name}}</h3>\
		{{#each skills}}\
			{{>listbox .}}\
		{{/each}}\
	{{/each}}\
</div>\
<div id="psion" class="panel skill-table{{#unless hasExceptions}} under-fixed{{/unless}} double psion relationbox off{{#if diverge}} divergent{{/if}}" data-screen="known-details" data-left="3" data-key="psion" data-subject="{{char_id}}" data-json="">\
	{{#each psion}}\
		<h3 class="block section{{#if noskills}} noskills{{/if}}">{{name}}</h3>\
		{{#each powers}}\
			{{>listbox .}}\
		{{/each}}\
	{{/each}}\
</div>';
tmpstr.fabricator =
'<div class="fixed-head ui">\
	<div class="panel top leave-on">\
		<div class="actions tabs">\
			{{#each equipment}}\
				<div id="{{toLowerCase short}}" class="{{toLowerCase short}} btn five fa{{#ifCond @index 0}} on{{/ifCond}}" data-cmd="showequip"><span class="desktext">{{short}}</span></div>\
			{{/each}}\
		</div>\
		<div class="actions searchbar">\
			<!--<div class="pan five">\
				<div class="fa tax construct">{{ctax}}%</div>\
			</div>-->\
			<!--<div class="pan five">\
				<div class="fa energy">{{energy}}</div>\
			</div>-->\
			<div class="showFilter search fa pan five"></div>\
			<!--<div id="basic" class="basic pan five fa frag">{{basic_frag}}</div>\
			<div id="tactical" class="tactical pan five fa frag ninja">{{tactical_frag}}</div>\
			<div id="biomedical" class="biomedical pan five fa frag ninja">{{biomedical_frag}}</div>\
			<div id="cybernetic" class="cybernetic pan five fa frag ninja">{{cybernetic_frag}}</div>\
			<div id="chemical" class="chemical pan five fa frag ninja">{{chemical_frag}}</div>-->\
			<div class="filters">\
				<div class="pan drop">\
					<label>Rare: </label>\
					<select id="rare-select">\
						<option value="*">All</option>\
						<option value="A">Readily</option>\
						<option value="C">Common</option>\
						<option value="U">Uncommon</option>\
						<option value="R">Rare</option>\
						<option value="T">Template</option>\
					</select>\
				</div>\
				<div class="pan drop typeselect">\
					<label>Type: </label>\
					{{#each equipment}}\
						<select id="{{toLowerCase short}}"{{#if @index}} class="ninja"{{/if}}>\
							<option value="*">All</option>\
							{{#each types}}\
								<option value="{{slug}}">{{name}}</option>\
							{{/each}}\
						</select>\
					{{/each}}\
				</div>\
			</div>\
		</div>\
	</div>\
</div>\
<div class="panel under-fixed frag-panel leave-on fab{{#if teams.length}} in-use{{/if}}">\
	{{#if teams.length}}<div class="using">IN USE</div>{{/if}}\
	{{#if teams.length}}<div class="three use-btn btn">USE</div>{{/if}}\
	{{#if teams.length}}<h3 class="block">{{char_name}}<span class="desktext">  Frags</span></h3>{{/if}}\
	<div class="pan six">\
		<div class="fa energy">{{energy}}</div>\
	</div>\
	<div id="basic" class="basic pan six fa frag focus">{{basic_frag}}</div>\
	<div id="tactical" class="tactical pan six fa frag">{{tactical_frag}}</div>\
	<div id="biomedical" class="biomedical pan six fa frag">{{biomedical_frag}}</div>\
	<div id="cybernetic" class="cybernetic pan six fa frag">{{cybernetic_frag}}</div>\
	<div id="chemical" class="chemical pan six fa frag">{{chemical_frag}}</div>\
</div>\
{{#each teams}}\
<div class="panel frag-panel leave-on fab team" data-id="{{char_id}}">\
	<div class="using">IN USE</div>\
	<div class="use-btn btn">USE</div>\
	<h3 class="block">{{char_name}}<span class="desktext"> Frags</span></h3>\
		<div class="pan six">\
			<div class="fa energy">{{energy}}</div>\
		</div>\
		<div id="basic" class="basic pan six fa frag focus">{{basic_frag}}</div>\
		<div id="tactical" class="tactical pan six fa frag">{{tactical_frag}}</div>\
		<div id="biomedical" class="biomedical pan six fa frag">{{biomedical_frag}}</div>\
		<div id="cybernetic" class="cybernetic pan six fa frag">{{cybernetic_frag}}</div>\
		<div id="chemical" class="chemical pan six fa frag">{{chemical_frag}}</div>\
</div>\
{{/each}}\
{{#each equipment}}\
	<div id="{{toLowerCase short}}" class="panel ghost bluprints{{#if @index}} off{{/if}}">\
		<div class="blueprint-wrap">\
			{{#each items}}\
				{{>blueprint}}\
			{{/each}}\
		</div>\
	</div>\
{{/each}}';
tmpstr.teamgear =
'<div  data-gear-id="{{rel_id}}" data-equip-id="{{id}}"class="team-gear rare-{{rarity}} {{toLowerCase skillstr}} {{typestr}} {{toLowerCase name}} {{rel_info}}" >\
	<div class="inner">\
		<div class="market-overlay field-group">\
			<div class="inn give ninja">\
				<div class="field-line full">\
					<label class="label center remove">Give To:</label>\
					<div class="field-line full has-owner" data-id="{{owner_id}}">\
						<input name="character-to" type="text" placeholder="Choose Ego"/>\
					</div>\
				</div>\
				<div class="field-line btn half cancel" data-cmd="closeOverlay">Cancel</div>\
				<div class="field-line btn half execute" data-cmd="giveAwayGear">Confirm</div>\
			</div>\
		</div>\
		<div class="info-box top">\
			<div class="icon fa" data-message="View More"></div>\
			<div class="wbox name" data-message="{{name}}"><div class="inside">{{name}}</div></div>\
		</div>\
		<div class="picture {{toLowerCase skillstr}} {{toLowerCase typestr}} {{image}}"></div>\
		<div class="info-box">\
			<div class="wbox mode status">\
				<div class="inside">{{#if available}}{{available}} {{/if}}{{single}}</div>\
			</div>\
			<div class="wbox count">\
				<div class="inside">\
					{{#ifCond single "Battery"}}\
						<div class="battery-case charge-{{capacity}}">\
							<div class="segment"></div><div class="segment"></div><div class="segment"></div><div class="segment"></div><div class="segment"></div>\
						</div>\
					{{/ifCond}}\
					<div class="countum"><small>x</small><span class="counter">1</span></div>\
				</div>\
			</div>\
		</div>\
	</div>\
	<div class="inner low">\
		<div class="toolbox take">\
			<div class="obj-wrap{{#unless modable}} full{{/unless}}">\
				<div class="obj fa take" data-cmd="takeItem">TAKE</div>\
			</div>\
		</div>\
	</div>\
	{{#if isAdmin}}<div class="toolbox inner low give-item"><div class="obj-wrap give"><div class="obj fa give" data-action="give">GIVE</div></div></div>{{/if}}\
</div>';
tmpstr.mod =
'<div  data-gear-id="{{rel_id}}" data-equip-id="{{id}}"class="overlay-parent module rare-{{rarity}} {{toLowerCase skillstr}} {{typestr}} {{toLowerCase name}} {{rel_info}}" >\
	<div class="inner">\
		<div class="market-overlay field-group">\
			<div class="inn give ninja">\
				<div class="field-line full">\
					<label class="label center remove">Give To:</label>\
					<div class="field-line full has-owner" data-id="{{owner_id}}">\
						<input name="character-to" type="text" placeholder="Choose Ego"/>\
					</div>\
				</div>\
				<div class="field-line btn half cancel" data-cmd="closeOverlay">Cancel</div>\
				<div class="field-line btn half execute" data-cmd="giveAwayGear">Confirm</div>\
			</div>\
		</div>\
		<div class="info-box top">\
			<div class="icon fa" data-message="View More"></div>\
			<div class="wbox name" data-message="{{name}}"><div class="inside">{{name}}</div></div>\
		</div>\
		<div class="picture {{toLowerCase skillstr}} {{toLowerCase typestr}} {{image}}"></div>\
		<div class="info-box">\
			<div class="wbox mode status">\
				<div class="inside">{{#if available}}{{available}} {{/if}}{{single}}</div>\
			</div>\
			{{#if supplement}}\
			<div class="wbox ">\
				<div class="inside">\
					Installs to:<br/>{{supplement}}\
				</div>\
			</div>\
			{{/if}}\
			<div class="wbox count">\
				<div class="inside">\
					{{#ifCond single "Battery"}}\
						<div class="battery-case charge-{{capacity}}">\
							<div class="segment"></div><div class="segment"></div><div class="segment"></div><div class="segment"></div><div class="segment"></div>\
						</div>\
					{{/ifCond}}\
					<div class="countum"><small>x</small><span class="counter">{{count}}</span></div>\
				</div>\
			</div>\
		</div>\
	</div>\
	<div class="inner low installed">\
		<div class="toolbox installed">\
			INSTALLED\
		</div>\
	</div>\
	<div class="toolbox inner low give-item"><div class="obj-wrap give"><div class="obj fa give" data-action="give">GIVE</div></div></div>\
</div>';
tmpstr.sleeve =
'<div data-gear-id="{{rel_id}}" data-equip-id="{{id}}"class="overlay-parent gear rare-{{rarity}} {{toLowerCase skillstr}} {{typestr}} {{toLowerCase name}} {{rel_info}}{{#ifCond rel_info "equip"}} on{{/ifCond}}{{#if tooHigh}} tooHigh{{/if}}" data-tolerence="{{required}}" data-slots="{{slotcost}}" data-hp="{{extra}}">\
	<div class="inner">\
		<div class="market-overlay field-group">\
			<div class="inn resleeve ninja">\
				<div class="field-line full">\
				<label class="label center">Resleeving will incure penalties to your pool</label>\
				</div>\
				<div class="field-line btn half cancel" data-cmd="closeOverlay">Cancel</div>\
				<div class="field-line btn half sleeve" data-cmd="resleeveAs">Confirm</div>\
			</div>\
			<div class="inn addmod modpanel ninja">\
				<div class="field-line full">\
					<select id="modselect"><option class="init" value="false">Select Mod</option></select>\
				</div>\
				<div class="field-line btn half leftcol cancel" data-cmd="closeOverlay">Cancel</div>\
				<div class="field-line btn half rightcol sleeve" data-mod="modules" data-cmd="changeMod">Confirm</div>\
			</div>\
			<div class="inn removemod modpanel ninja">\
				<div class="field-line full">\
					<label class="center">Remove this Mod</label>\
				</div>\
				<div class="field-line btn half leftcol cancel" data-cmd="closeOverlay">Cancel</div>\
				<div class="field-line btn half rightcol" data-ind="0" data-cmd="removeMod">Confirm</div>\
			</div>\
			<div class="inn cryo ninja">\
				<div class="field-line full">\
				<label class="label center remove">Remove from Cryo?</label>\
				<label class="label center available">Store in Cryo?</label>\
				</div>\
				<div class="field-line btn half cancel" data-cmd="closeOverlay">Cancel</div>\
				<div class="field-line btn half execute" data-cmd="toggleCryo">Confirm</div>\
			</div>\
			<div class="inn give ninja">\
				<div class="field-line full">\
				<label class="label center remove">Give To:</label>\
				<div class="field-line full has-owner" data-id="{{owner_id}}">\
					<input name="character-to" type="text" placeholder="Choose Ego"/>\
				</div>\
				</div>\
				<div class="field-line btn half cancel" data-cmd="closeOverlay">Cancel</div>\
				<div class="field-line btn half execute" data-cmd="giveAwayGear">Confirm</div>\
			</div>\
		</div>\
		<div class="info-box top">\
			<div class="icon fa" data-message="View More"></div>\
			<div class="wbox name" data-message="{{name}}"><div class="inside">{{name}}</div></div>\
		</div>\
		<div class="picture {{toLowerCase skillstr}} {{toLowerCase typestr}} {{image}}"></div>\
		<div class="info-box">\
			<div class="wbox count">\
				<div class="inside">\
					{{#if chargable}}\
						<div class="battery-case charge-{{battery}}">\
							<div class="segment"></div><div class="segment"></div><div class="segment"></div><div class="segment"></div><div class="segment"></div>\
						</div>\
					{{else if cryo}}\
						<div class="cryo-chamber cryo fa" data-message="Change Cryo Status" data-action="cryo"></div>\
					{{/if}}\
					<div class="countum"><small>x</small><span class="counter">{{count}}</span></div>\
				</div>\
			</div>\
			<div class="wbox tol">\
				<div class="inside"><span class="label fa Tolerence">REQ:</span>\
				<span class="tolnum{{#if adjust_capacty}} adjust{{/if}}"><span class="original">{{capacity}}</span>{{#if adjust_capacty}} {{adjust_capacty}}{{/if}}</span><!---->\
				{{#if minusTol}}-{{minusTol}}{{/if}}</div>\
			</div>\
			<div class="wbox tol">\
				<div class="inside"><span class="label fa Tolerence">SLOTS:</span><span class="tolslots{{#if adjust_slots}} adjust{{/if}}"><span class="original">{{slotcost}}</span>{{#if adjust_slots}} {{adjust_slots}}{{/if}}</span></div>\
			</div>\
		</div>\
	</div>\
	<div class="inner low">\
		<div class="toolbox {{toolbox}}">\
			{{#if modable}}<div class="obj-wrap first"><div class="obj fa mod" data-action="addmod">ADD MOD</div></div>{{/if}}\
			<div class="obj-wrap{{#unless modable}} full{{/unless}}">\
				{{#if cannot_sleeve}}\
					<div class="obj fa static">RESTRICTED</div>\
				{{else if sleevable}}\
					<div class="obj fa equipped slv cost" data-cmd="resleeveItem"><span class="un"></span>SLEEVE</div>\
					<div class="obj fa equipped slv free" data-cmd="resleeveFreeItem"><span class="un"></span>SLEEVE</div>\
					<div class="obj fa ego-error static">ERROR</div>\
				{{else}}\
					<div class="obj fa equipped{{#if multi_equip}} multi{{/if}}" data-cmd="equipItem">EQUIP</div>\
				{{/if}}\
				<div class="obj fa tol-limit static"><span class="fa Tolerence">NOT ENOUGH</span></div>\
			</div>\
			<!--{{#if module.length}}\
				<div class="obj-wrap full secondrow">\
					<div class="obj fa mod" data-cmd="equipItem">({{module.length}}) SHOW MODS</div>\
				</div>\
			{{/if}}-->\
		</div>\
	</div>\
	{{#if module.length}}\
		<div class="inner mods low">\
			<div class="toolbox module-list">\
				{{#each module}}\
					<div class="obj-wrap mod-line {{#ifCond typestr "genemods"}}gene{{else}}cyber{{/ifCond}}"{{#if rel_id}} data-id="{{rel_id}}"{{/if}}>\
						<div class="obj fa minus"{{#if rel_id}} data-id="{{rel_id}}"{{/if}}>{{#if name}}{{name}}{{else}}{{.}}{{/if}}</div>\
					</div>\
				{{/each}}\
			</div>\
		</div>\
	{{/if}}\
	<div class="toolbox inner low give-item"><div class="obj-wrap give"><div class="obj fa give" data-action="give">GIVE</div></div></div>\
</div>';

tmpstr.gear =
'<div data-gear-id="{{rel_id}}" data-equip-id="{{id}}"class="overlay-parent gear rare-{{rarity}} {{toLowerCase skillstr}} {{typestr}} {{toLowerCase name}} {{rel_info}}{{#ifCond rel_info "equip"}} on{{/ifCond}}" data-eqtype="{{typestr}}">\
	<div class="inner">\
		<div class="market-overlay field-group">\
			<div class="inn give ninja">\
				<div class="field-line full">\
					<label class="label center remove">Give To:</label>\
					<div class="field-line full has-owner" data-id="{{owner_id}}">\
						<input name="character-to" type="text" placeholder="Choose Ego"/>\
					</div>\
				</div>\
				<div class="field-line btn half cancel" data-cmd="closeOverlay">Cancel</div>\
				<div class="field-line btn half execute" data-cmd="giveAwayGear">Confirm</div>\
			</div>\
			<div class="inn build ninja">\
				<div class="field-line full center">\
					<label>Stored: <span class="invcount">{{#if count}}{{count}}{{else}}0{{/if}}</span></label>\
				</div>\
				<div class="field-line full">\
					<label class="label center">Spend <span class="fa energy">{{total}}</span> energy?</label>\
				</div>\
				<div class="field-line btn full execute">Confirm</div>\
			</div>\
			<div id="shift-mod" class="inn addmod ninja">\
				<div id="first" class="modpanel">\
					{{#if chargable}}<div class="field-line full">\
						<label id="battery" class="fa exchange">BATTERY</label>\
					</div>{{/if}}\
					{{#if hasMod1}}<div class="field-line full">\
						<label id="mod1" class="fa exchange">ADD MOD1</label>\
					</div>{{/if}}\
					{{#if hasMod2}}<div class="field-line full">\
						<label id="mod2" class="fa exchange">ADD MOD2</label>\
					</div>{{/if}}\
				</div>\
				<div id="battery" class="modpanel">\
					<h4 class="fa charge">Change batttery</h4>\
					<div class="field-line full">\
						<select id="batterySelect"><option class="init" value="false">Select Battery</option></select>\
					</div>\
					<div class="field-line btn half leftcol cancel" data-cmd="closeOverlay">Cancel</div>\
					<div class="field-line btn half rightcol sleeve" data-mod="battery" data-cmd="changeMod">Confirm</div>\
				</div>\
				<div id="mod1" class="modpanel">\
					<h4 class="fa mod">Change Mod 1</h4>\
					<div class="field-line full">\
						<select id="modselect"><option class="init" value="false">Select Mod</option></select>\
					</div>\
					<div class="field-line btn half leftcol cancel" data-cmd="closeOverlay">Cancel</div>\
					<div class="field-line btn half rightcol sleeve" data-mod="mod1" data-cmd="changeMod">Confirm</div>\
				</div>\
				<div id="mod2" class="modpanel">\
					<h4 class="fa mod">Change Mod 2</h4>\
					<div class="field-line full">\
						<select id="modselect"><option class="init" value="false">Select Mod</option></select>\
					</div>\
					<div class="field-line btn half leftcol cancel" data-cmd="closeOverlay">Cancel</div>\
					<div class="field-line btn half rightcol sleeve" data-mod="mod2" data-cmd="changeMod">Confirm</div>\
				</div>\
			</div>\
		</div>\
		<div class="info-box top">\
			<div class="icon fa" data-message="View More"></div>\
			<div class="wbox name" data-message="{{name}}"><div class="inside">{{name}}</div></div>\
		</div>\
		<div class="picture {{toLowerCase skillstr}} {{toLowerCase typestr}} {{image}}"></div>\
		<div class="info-box">\
			<div class="wbox count">\
				<div class="inside">\
					{{#if chargable}}\
						<div class="battery-case charge-{{battery}}">\
							<div class="segment"></div><div class="segment"></div><div class="segment"></div><div class="segment"></div><div class="segment"></div>\
						</div>\
					{{/if}}\
					<div class="countum"><small>x</small><span class="counter">{{count}}</span></div>\
				</div>\
			</div>\
			<div class="wbox mode mode-1{{#if module.[0]}} used{{/if}}">\
				<div class="inside {{#if hasMod1}} availble{{/if}}">{{#if module.[0]}}{{module.[0]}}{{else if hasMod1}}open mod slot{{/if}}</div>\
			</div>\
			<div class="wbox mode mod-2{{#if module.[1]}} used{{/if}}">\
				<div class="inside {{#if hasMod2}} availble{{/if}}">{{#if module.[1]}}{{ module.[1]}}{{else if hasMod2}}open mod slot{{/if}}</div>\
			</div>\
		</div>\
	</div>\
	<div class="inner low">\
		<div class="toolbox {{toolbox}}">\
			{{#if modable}}<div class="obj-wrap first"><div class="obj fa mod" data-action="addmod">ADD MOD</div></div>{{/if}}\
			<div class="obj-wrap{{#unless modable}} full{{/unless}}">\
				<div class="obj fa equipped{{#if multi_equip}} multi{{/if}}" data-cmd="equipItem">EQUIP</div>\
			</div>\
		</div>\
	</div>\
	<div class="toolbox inner low give-item"><div class="obj-wrap give"><div class="obj fa give" data-action="give">GIVE</div></div></div>\
</div>';
tmpstr.blueprint = 
'<div data-gear-id="{{gear_id}}" data-owner="{{char_id}}" data-equip-id="{{id}}"class="overlay-parent {{#if owned}}owned {{/if}}{{#if template}}blueprint template rare-T{{else}}blueprint rare-{{rarity}}{{/if}} {{toLowerCase skillstr}} {{typestr}} {{toLowerCase name}}{{#if tooMuch}} tooMuch{{/if}}" {{#unless owned}}{{#if rent}}data-renter="{{char_id}}" data-rent="{{market}}" {{/if}}{{/unless}}data-cost="{{total}}" data-base="{{cost}}" data-taxes="{{taxcost}}">\
	<div class="inner">\
		{{>marketoverlay .}}\
		<div class="info-box top">\
			<div class="icon fa" data-message="View More"></div>\
			<div class="wbox name" data-message="{{name}}"><div class="inside">{{name}}</div></div>\
		</div>\
		<div class="picture {{toLowerCase skillstr}} {{toLowerCase typestr}} {{image}}"><div class="progressbar large" style="width:{{percent}}%"></div></div>\
		<div class="info-box">\
			<div class="wbox status">\
				<div class="inside">{{#if available}}{{available}} {{/if}}{{single}}</div>\
			</div>\
			<div class="wbox status halv">\
				<div class="inside">{{#if template}}Template{{else}}Blueprint{{/if}}</div>\
			</div>\
			<div class="wbox cost halv">\
				<div class="inside">Stored: <span class="invcount">{{#if count}}{{count}}{{else}}0{{/if}}</span></div>\
			</div>\
			<div class="wbox owner">\
				<div class="inside{{#if team}} fa team{{/if}}">Owner:{{owner}}</div>\
			</div>\
			<div class="wbox total">\
				{{#if template}}\
					<div class="wbox cost">\
						<div class="inside">Progress: <span class="frag-info">{{info}}</span> / {{fragcost}}</div>\
					</div>\
				{{else if sell}}\
					<div class="wbox cost">\
						<div class="inside">Cost: {{market}} +<span class="fa tax">{{salestax}}</span></div>\
					</div>\
				{{else if owned}}\
					<div class="wbox cost">\
						<div class="inside">Cost: {{cost}} +<span class="fa tax">{{contax}}</span></div>\
					</div>\
				{{else}}\
					<div class="wbox cost">\
						<div class="inside">Cost: {{cost}} +<span class="fa tax">{{contax}}</span>{{#if rent}} +<span class="fa rent">{{market}}</span>{{/if}}</div>\
					</div>\
				{{/if}}\
				<div class="inside energy"><span class="fa energy">{{total}}</span></div>\
			</div>\
		</div>\
	</div>\
	<div class="inner low">\
		<div class="toolbox {{toolbox}}">\
			{{#ifCond toolbox "template_market_owned"}}\
				<div class="obj-wrap first"><div class="obj sell fa{{#if sell}} active{{/if}}" data-action="sell">Sell</div></div>\
			{{else ifCond toolbox "template_build_owned"}}\
				<div class="obj-wrap"><div class="obj fa puzzle" data-action="complete">COMPLETE</div>\</div>\
				<div class="obj-wrap"><div class="obj fa give" data-action="give">GIVE</div>\</div>\
				<div class="obj-wrap"><div class="obj fa deconstruct" data-action="deconstruct">DECONSTRUCT</div></div>\
			{{else ifCond toolbox "template_market_sell"}}\
				<div class="obj-wrap first desktext"><div class="obj">FOR SALE</div></div>\
				<div class="obj-wrap"><div class="obj fa sell" data-action="buy">BUY</div>\</div>\
			{{else ifCond toolbox "blueprint_build_owned"}}\
				{{#if hasSkill}}\
					<div class="obj-wrap"><div class="obj build fa" data-action="build" data-cmd="getItemCount">Build</div><div class="obj fa energy tooexpensive">NOT ENOUGH</div></div>\
					<div class="obj-wrap"><div class="obj rent fa{{#if rent}} active{{/if}}" data-action="rent">Rent</div></div>\
				{{else}}\
					<div class=""><div class="obj build required fa">Need {{requiredSkill}}</div></div>\
					<div class="obj-wrap"><div class="obj rent fa{{#if rent}} active{{/if}}" data-action="rent">Rent</div></div>\
				{{/if}}\
				<div class="obj-wrap"><div class="obj fa deconstruct" data-action="deconstruct">DECONSTRUCT</div></div>\
				<div class="obj-wrap"><div class="obj fa give" data-action="give">GIVE</div>\</div>\
			{{else ifCond toolbox "blueprint_market_owned"}}\
				<div class="obj-wrap first"><div class="obj sell fa{{#if sell}} active{{/if}}" data-action="sell">Sell</div></div>\
				<div class="obj-wrap"><div class="obj rent fa{{#if rent}} active{{/if}}" data-action="rent">Rent</div></div>\
				<div class="obj-wrap"><div class="obj fa give" data-action="give">GIVE</div>\</div>\
			{{else ifCond toolbox "blueprint_build_open"}}\
				{{#if hasSkill}}\
					<div class="obj-wrap first desktext"><div class="obj">OPEN USE</div></div>\
					<div class="obj-wrap"><div class="obj fa build" data-action="build" data-cmd="getItemCount">Build</div><div class="obj fa energy tooexpensive">NOT ENOUGH</div></div>\
				{{else}}\
					<div class=""><div class="obj build required fa">Need {{requiredSkill}}</div></div>\
				{{/if}}\
			{{else ifCond toolbox "blueprint_market_sell"}}\
				<div class="obj-wrap first desktext"><div class="obj">FOR SALE</div></div>\
				<div class="obj-wrap"><div class="obj fa sell" data-action="buy">BUY</div>\</div>\
			{{else ifCond toolbox "blueprint_build_rent"}}\
				{{#if hasSkill}}\
					<div class="obj-wrap first desktext"><div class="obj">FOR RENT</div></div>\
					<div class="obj-wrap"><div class="obj fa build" data-action="build" data-cmd="getItemCount">Build</div><div class="obj fa energy tooexpensive">NOT ENOUGH</div></div>\
				{{else}}\
					<div class=""><div class="obj build required fa">Need {{requiredSkill}}</div></div>\
				{{/if}}\
			{{/ifCond}}\
		</div>\
	</div>\
</div>';
tmpstr.marketoverlay =
'<div class="market-overlay field-group">\
	<div class="inn sell rent ninja{{#if market}} onmarket{{/if}}">\
		<div class="field-line full">\
			<label class="label">Price</label>\
			<input class="value" type="number" name="price" value="{{#if market}}{{market}}{{else}}0{{/if}}" min="0">\
		</div>\
		<div class="field-line full">\
			<label class="label">To</label>\
			<select class="value" name="to" data-vis="{{visible}}">\
				<option value="*">Any</option>\
				{{#each characters}}\
					<option value="{{char_id}}">{{char_name}}</option>\
				{{/each}}\
			</select>\
		</div>\
		<div class="market btns">\
			<div class="field-line full btn execute">Submit</div>\
			<div class="field-line full btn cancel">Cancel</div>\
		</div>\
	</div>\
	<div class="inn give ninja">\
		<div class="field-line full">\
			<label class="label">Give To</label>\
			<input name="character-to" type="text" placeholder="Choose Ego"/>\
		</div>\
		<div class="market btns">\
			<div class="field-line full btn execute">Confirm</div>\
		</div>\
	</div>\
	<div class="inn build ninja">\
		<div class="field-line full center">\
			<label>Stored: <span class="invcount">{{#if count}}{{count}}{{else}}0{{/if}}</span></label>\
		</div>\
		<div class="field-line full">\
			<label class="label center">Spend <span class="fa energy">{{total}}</span> energy?</label>\
		</div>\
		<div class="field-line btn full execute">Confirm</div>\
	</div>\
	<div class="inn buy ninja">\
		<div class="field-line full">\
		<label class="label center">Spend <span class="fa energy">{{total}}</span> energy?</label>\
		</div>\
		<div class="field-line btn full execute">Purchase</div>\
	</div>\
	<div class="inn complete ninja" data-init="{{info}}" data-max="{{fragcost}}">\
		<div class="field-line full small">\
			<label class="label">Add Frag</label>\
			<input class="value" type="number" name="fragment" value="0" min="0">\
		</div>\
		<div class="field-line btn full execute">Confirm</div>\
		<div class="field-line full">\
			<label class="label center"><span class="plus">{{info}}</span> / {{fragcost}}</label>\
			<div class="progressbar three" style="width:{{percent}}%"></div><div class="proposedProgress" style="margin-left:{{percent}}%"></div>\
		</div>\
	</div>\
	<div class="inn deconstruct ninja">\
		<div class="field-line full">\
			{{#if template}}\
				<input name="fragcount" type="hidden" value="{{deconstruct}}">\
				<label class="label center">Deconstruct for {{deconstruct}} <span class="fa fragment {{toLowerCase skillstr}}"></span> fragments?</label>\
			{{else}}\
				<label class="label center">Deconstruct for <span class="fa energy"> {{deconstruct}}</span> energy?</label>\
			{{/if}}\
		</div>\
		<div class="field-line btn full execute">Confirm</div>\
		<div><label>Inventory: <span class="invcount">{{#if count}}{{count}}{{else}}0{{/if}}</span></label></div>\
	</div>\
</div>';

tmpstr.marketblue =
'<div data-gear-id="{{gear_id}}" data-equip-id="{{id}}"class="overlay-parent {{#if owned}}owned {{/if}}{{#if template}}blueprint template rare-T{{else}}blueprint rare-{{rarity}}{{/if}} {{toLowerCase skillstr}} {{typestr}} {{toLowerCase name}}{{#if tooMuch}} tooMuch{{/if}}" data-cost="{{total}}">\
	<div class="inner">\
		<div class="market-overlay field-group">\
			<div class="inn sell rent ninja{{#if market}} onmarket{{/if}}">\
				<div class="field-line full">\
					<label class="label">Price</label>\
					<input class="value" type="number" name="price" value="{{#if market}}{{market}}{{else}}0{{/if}}" min="0">\
				</div>\
				<div class="field-line full">\
					<label class="label">To</label>\
					<select class="value" name="to" data-vis="{{visible}}">\
						<option value="*">Any</option>\
						{{#each characters}}\
							<option value="{{char_id}}">{{char_name}}</option>\
						{{/each}}\
					</select>\
				</div>\
				<div class="market btns">\
					<div class="field-line full btn execute">Submit</div>\
					<div class="field-line full btn cancel">Cancel</div>\
				</div>\
			</div>\
			<div class="inn build ninja">\
				<div class="field-line full center">\
					<label>Stored: <span class="invcount">{{#if count}}{{count}}{{else}}0{{/if}}</span></label>\
				</div>\
				<div class="field-line full">\
					<label class="label center">Spend <span class="fa energy">{{total}}</span> energy?</label>\
				</div>\
				<div class="field-line btn full execute">Confirm</div>\
			</div>\
			<div class="inn buy ninja">\
				<div class="field-line full">\
				<label class="label center">Spend <span class="fa energy">{{total}}</span> energy?</label>\
				</div>\
				<div class="field-line btn full execute">Purchase</div>\
			</div>\
			<div class="inn complete ninja" data-init="{{info}}" data-max="{{fragcost}}">\
				<div class="field-line full small">\
					<label class="label">Add Frag</label>\
					<input class="value" type="number" name="fragment" value="0" min="0">\
				</div>\
				<div class="field-line btn full execute">Confirm</div>\
				<div class="field-line full">\
					<label class="label center"><span class="plus">{{info}}</span> / {{fragcost}}</label>\
					<div class="progressbar four" style="width:{{percent}}%"></div>\
				</div>\
			</div>\
			<div class="inn deconstruct ninja">\
				<div class="field-line full">\
					{{#if template}}\
						<label class="label center">Deconstruct for {{deconstruct}} <span class="fa fragment {{toLowerCase skillstr}}"></span> fragments?</label>\
					{{else}}\
						<label class="label center">Deconstruct for <span class="fa energy"> {{deconstruct}}</span> energy?</label>\
					{{/if}}\
				</div>\
				<div class="field-line btn full execute">Confirm</div>\
				<div><label>Inventory: <span class="invcount">{{#if count}}{{count}}{{else}}0{{/if}}</span></label></div>\
			</div>\
		</div>\
		<div class="info-box top">\
			<div class="icon fa" data-message="View More"></div>\
			<div class="wbox name" data-message="{{name}}"><div class="inside">{{name}}</div></div>\
		</div>\
		<div class="picture {{toLowerCase skillstr}} {{toLowerCase typestr}} {{image}}"><div class="progressbar one" style="width:{{percent}}%"></div></div>\
		<div class="info-box">\
			<div class="wbox status">\
				<div class="inside">{{#if available}}{{available}} {{/if}}{{single}}</div>\
			</div>\
			<div class="wbox status halv">\
				<div class="inside">{{#if template}}Template{{else}}Blueprint{{/if}}</div>\
			</div>\
			<div class="wbox cost halv">\
				<div class="inside">Stored: <span class="invcount">{{#if count}}{{count}}{{else}}0{{/if}}</span></div>\
			</div>\
			<div class="wbox owner">\
				<div class="inside{{#if team}} team{{/if}}">Owner:{{owner}}</div>\
			</div>\
			<div class="wbox total">\
				{{#if template}}\
					<div class="wbox cost">\
						<div class="inside">Progress: {{info}} / {{fragcost}}</div>\
					</div>\
					{{else if owned}}\
					<div class="wbox cost">\
						<div class="inside">Cost: {{cost}}{{#if rent}} + <span class="fa rent">{{market}}</span> + {{/if}}{{#if tax}}<span class="fa tax">{{tax}}</span>{{/if}}</div>\
					</div>\
					{{/if}}\
				<div class="inside energy"><span class="fa energy">{{total}}</span></div>\
			</div>\
		</div>\
	</div>\
	<div class="inner low">\
		<div class="toolbox {{toolbox}}">\
			{{#ifCond toolbox "template_owned"}}\
				<div class="obj-wrap first"><div class="obj sell fa" data-action="sell">Sell</div></div>\
				<div class="obj-wrap"><div class="obj fa puzzle" data-action="complete">COMPLETE</div>\</div>\
			{{else ifCond toolbox "template_sell"}}\
				<div class="obj-wrap first desktext"><div class="obj">FOR SALE</div></div>\
				<div class="obj-wrap"><div class="obj fa sell" data-action="buy">BUY</div>\</div>\
			{{else ifCond toolbox "blueprint_owned"}}\
				<div class="obj-wrap right"><div class="obj fa deconstruct" data-action="deconstruct"></div></div>\
				<div class="obj-wrap first"><div class="obj sell fa{{#if sell}} active{{/if}}" data-action="sell">Sell</div></div>\
				<div class="obj-wrap"><div class="obj rent fa{{#if rent}} active{{/if}}" data-action="rent">Rent</div></div>\
				<div class="obj-wrap"><div class="obj build fa" data-action="build" data-cmd="getItemCount">Build</div><div class="obj fa energy tooexpensive">NOT ENOUGH</div></div>\
			{{else ifCond toolbox "blueprint_open"}}\
				<div class="obj-wrap first desktext"><div class="obj">OPEN USE</div></div>\
				<div class="obj-wrap"><div class="obj fa build" data-action="build"  data-cmd="getItemCount">Build</div><div class="obj fa energy tooexpensive">NOT ENOUGH</div></div>\
			{{else ifCond toolbox "blueprint_sell"}}\
				<div class="obj-wrap first desktext"><div class="obj">FOR SALE</div></div>\
				<div class="obj-wrap"><div class="obj fa sell" data-action="buy">BUY</div>\</div>\
			{{else ifCond toolbox "blueprint_rent"}}\
				<div class="obj-wrap first desktext"><div class="obj">FOR RENT</div></div>\
				<div class="obj-wrap"><div class="obj fa build" data-action="build" data-cmd="getItemCount">Build</div><div class="obj fa energy tooexpensive">NOT ENOUGH</div></div>\
			{{/ifCond}}\
		</div>\
	</div>\
</div>';

tmpstr.admin =
'<div class="topspace"></div><div class="panel">\
	<div id="gamemode" class="btn fa{{#ifCond gamemode "true"}} on check{{else ifCond gamemode true}} on check{{/ifCond}}">GAMEMODE: <span class="gm_text">{{#ifCond gamemode "true"}}ON{{else ifCond gamemode true}}ON{{else}}OFF{{/ifCond}}</span></div>\
	<div class="btn next fa" data-cmd="qrScanner">QR Scannner</div>\
	<div class="btn next fa" data-cmd="gameOptions">Game Options</div>\
	<div class="btn next fa" data-cmd="addUser">Add User</div>\
	<div class="btn next fa" data-cmd="addTeam">Add Team</div>\
	<div class="btn next fa" data-cmd="viewCharacters">View Characters</div>\
	<div class="btn next fa" data-cmd="viewAsteroids">Asteroids & Planets</div>\
	<div class="btn next fa" data-cmd="modQueue">Mod Queue</div>\
	<div class="btn next fa" data-cmd="toActivity">Activity</div>\
</div>';
tmpstr.modList = 
'<div class="topspace"></div><div class="panel">\
	{{#each .}}\
		{{>moditem.}}\
	{{/each}}\
</div>';
tmpstr.charSelect = 
'<div class="fixed-head">\
	<div class="panel top leave-on">\
		<div class="topline desktext"><h3>Characters</h3></div>\
		<div class="actions searcher">\
			<div class="btn large fa search"></div>\
			<input id="searchchars" type="text" placeholder="ENTER SEARCH">\
		</div>\
	</div>\
</div>\
</div><div class="search-results panel under-fixed "><h3 disabled="disabled">SEARCH BY USERS OR CHARACTERS ABOVE</h3></div>';
tmpstr.maintenance = 
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Station Settings</h3>\
	<div class="field-group"><form>\
		<div class="insider">\
			<div class="field-line small">\
				<label class="label">Station Energy</label>\
				<div class="value input"><label>{{ops.station_energy}}</label></div>\
			</div>\
			<div class="field-line small">\
				<label class="label percent fa">SALES:</label>\
				<div class="value input">\
				{{#if ch.exceptions.cemo}}\
					<input type="number" name="tax_sales" value="{{ops.tax_sales}}"/>\
				{{else}}\
					<label>{{ops.tax_sales}}</label>\
				{{/if}}\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label percent fa">INCOME:</label>\
				<div class="value input">\
				{{#if ch.exceptions.cemo}}\
					<input type="number" name="tax_income" value="{{ops.tax_income}}"/>\
				{{else}}\
					<label>{{ops.tax_income}}</label>\
				{{/if}}\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label percent fa">CONSTRUCTION:</label>\
				<div class="value input">\
				{{#if ch.exceptions.cemo}}\
					<input type="number" name="tax_construct" value="{{ops.tax_construct}}"/>\
				{{else}}\
					<label>{{ops.tax_construct}}</label>\
				{{/if}}\
				</div>\
			</div>\
		</div>\
	</form></div>\
	<h3 class="block">Status: {{evt}}</h3>\
	<div class="field-group">\
		<div class="insider">\
			<div class="third override">\
				<div class="value input">\
					<select name="year_select">\
					{{log thisDate.[0]}}\
						{{#each years}}\
						{{log label}}\
						{{log ../thisDate}}\
						{{log ../thisDate.[0]}}\
							<option {{#ifCond ../thisDate.[0] label}}selected="selected" {{/ifCond}}>{{label}}</option>\
						{{/each}}\
					</select>\
				</div>\
			</div>\
			<div class="third override">\
				<div class="value input">\
					<select name="month_select">\
						<option {{#ifCond thisDate.[1] "01"}}selected="selected" {{/ifCond}}value="01">Jan</option>\
						<option {{#ifCond thisDate.[1] "02"}}selected="selected" {{/ifCond}}value="02">Feb</option>\
						<option {{#ifCond thisDate.[1] "03"}}selected="selected" {{/ifCond}}value="03">March</option>\
						<option {{#ifCond thisDate.[1] "04"}}selected="selected" {{/ifCond}}value="04">April</option>\
						<option {{#ifCond thisDate.[1] "05"}}selected="selected" {{/ifCond}}value="05">May</option>\
						<option {{#ifCond thisDate.[1] "06"}}selected="selected" {{/ifCond}}value="06">Jun</option>\
						<option {{#ifCond thisDate.[1] "07"}}selected="selected" {{/ifCond}}value="07">Jul</option>\
						<option {{#ifCond thisDate.[1] "08"}}selected="selected" {{/ifCond}}value="08">Aug</option>\
						<option {{#ifCond thisDate.[1] "09"}}selected="selected" {{/ifCond}}value="09">Sept</option>\
						<option {{#ifCond thisDate.[1] "10"}}selected="selected" {{/ifCond}}value="10">Oct</option>\
						<option {{#ifCond thisDate.[1] "11"}}selected="selected" {{/ifCond}}value="11">Nov</option>\
						<option {{#ifCond thisDate.[1] "12"}}selected="selected" {{/ifCond}}value="12">Dec</option>\
					</select>\
				</div>\
			</div>\
			<div class="third">\
				<div class="btn fa refresh" data-cmd="updateMaintenence">View</div>\
			</div>\
		</div>\
	</div>\
	<!--<h3 class="block">Energy Flow: {{total}} <span class="energy fa"></span></h3>\
	<h3 class="block">Net: {{net}} <span class="energy fa"></span></h3>-->\
	<div class="field-group"><form>\
		<div class="progressbar two">\
			<div class="earned" style="width:{{percent}}%">+ {{earn}}</div>\
			<div class="spent" style="width:{{otherPercent}}%">- {{spent}}</div>\
		</div>\
	</div>\
	{{#if fullview}}\
		<div class="field-group specifics">\
			<div class="insider">\
			{{#each lines}}\
				<div class="field-line small{{#if minus}} minus{{/if}}">\
					<label class="label">{{label}}:</label>\
					<div class="value input">{{value}}</div>\
				</div>\
			{{/each}}\
			</div>\
		</div>\
		<div class="field-group specifics">\
			<div class="insider">\
				<div class="field-line small">\
					<label class="label">Net:</label>\
					<div class="value input">{{net}}</div>\
				</div>\
			</div>\
		</div>\
	{{/if}}\
	{{#if ch.exceptions.cemo}}<div class="btn fa save" data-cmd="saveOps">Save Options</div>{{/if}}\
</div>';
tmpstr.gameOps = 
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Game Options</h3>\
	<div class="field-group"><form>\
		<div class="insider">\
			<div class="field-line small">\
				<label class="label">BACKGROUNDS:</label>\
				<div class="value input"><input type="number" name="max_background" value="{{max_background}}"/></div>\
			</div>\
			<div class="field-line small">\
				<label class="label">MAX EGO:</label>\
				<div class="value input"><input type="number" name="max_ego" value="{{max_ego}}"/></div>\
			</div>\
			<div class="field-line small">\
				<label class="label percent fa">SALES:</label>\
				<div class="value input"><input type="number" name="tax_sales" value="{{tax_sales}}"/></div>\
			</div>\
			<div class="field-line small">\
				<label class="label percent fa">INCOME:</label>\
				<div class="value input"><input type="number" name="tax_income" value="{{tax_income}}"/></div>\
			</div>\
			<div class="field-line small">\
				<label class="label percent fa">CONSTRUCTION:</label>\
				<div class="value input"><input type="number" name="tax_construct" value="{{tax_construct}}"/></div>\
			</div>\
			<div class="field-line small">\
				<label class="label">Station Energy:</label>\
				<div class="value input"><input type="number" name="station_energy" value="{{station_energy}}"/></div>\
			</div>\
			<div class="field-line small">\
				<label class="label">CRYO STORAGE:</label>\
				<div class="value input"><input type="number" name="cryo_count" value="{{cryo_count}}"/></div>\
			</div>\
			<div class="field-line small">\
				<label class="label">SERVERS:</label>\
				<div class="value input"><input type="number" name="servers" value="{{servers}}"/></div>\
			</div>\
		</div>\
	</form></div>\
	<div class="btn fa save" data-cmd="adminSaveOps">Save Options</div>\
</div>';
tmpstr.adminCharPanel =
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">ADMIN: {{char_name}}</h3>\
	<div class="field-group">\
		<div class="btn next fa" data-cmd="adminCharacterPanel" data-id="{{char_id}}"><span class="desktext">EDIT </span>USER + CHARACTER</div>\
		<div class="btn next fa" data-cmd="loginAsChar" data-id="{{char_id}}">LOG IN AS <span class="desktext">CHARACTER</span></div>\
		<div class="btn next fa" data-cmd="adimRemoveSkills">SKILLS + PSIONICS</div>\
		<div class="btn next fa" data-cmd="adimRemoveEquipment">EQUIPMENT</div>\
		<div class="btn next fa" data-cmd="addBluePrint">ADD GEAR/BLUEPRINT</div>\
	</div>\
</div>';
tmpstr.adminTeamPanel =
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">ADMIN: {{char_name}}</h3>\
	<div class="field-group">\
		<div class="btn next fa" data-cmd="editTeam" data-id="{{char_id}}"><span class="desktext">EDIT </span> Team</div>\
		<div class="btn next fa" data-cmd="loginAsAdmin">LOG IN AS <span class="desktext">ADMIN</span></div>\
		<div class="btn next fa" data-cmd="adimRemoveSkills">SKILLS + PSIONICS</div>\
		<div class="btn next fa" data-cmd="adimRemoveEquipment">EQUIPMENT</div>\
		<div class="btn next fa" data-cmd="addBluePrint">ADD GEAR/BLUEPRINT</div>\
	</div>\
</div>';
tmpstr.adminBlueprint =
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Add Blueprint<span class="desktext"> to {{char_name}}</span></h3>\
	<hr />\
	<div class="field-group checklist togglegenerate">\
		<div id="R" class="btn third on check fa">RANDOM</div>\
		<div id="S" class="btn third fa">SPECIFIC</div>\
		<div id="SRCH" class="btn third fa">SEARCH</div>\
	</div>\
	<div class="field-group searchfield ninja">\
		<div class="actions searcher">\
			<div class="btn large fa search"></div>\
			<input id="searchprints" type="text" placeholder="ENTER SEARCH">\
		</div>\
	</div>\
	<div class="filters">\
		<h3 class="block rarity">RARITY</h3>\
		<div id="rarity" class="field-group checklist rarity">\
			<div id="A" class="btn fa">A<span class="desktext">LWAYS</span></div>\
			<div id="C" class="btn fa on check">C<span class="desktext">OMMON</span></div>\
			<div id="U" class="btn fa">U<span class="desktext">NCOMMON</span></div>\
			<div id="R" class="btn fa">R<span class="desktext">ARE</span></div>\
		</div>\
		<div class="field-group checklist eqskillList">\
		<h3 class="block">SKILL</h3>\
		{{#each equipment}}\
			<div id="{{toLowerCase short}}" data-order="{{@index}}" class="eqskill btn fa{{#unless @index}} on check{{/unless}}">{{short}}</div>\
		{{/each}}\
		</div>\
		<div class="specific ninja">\
			<h3 class="block">ITEMS</h3>\
			{{#each equipment}}\
				<div id="{{toLowerCase short}}" class="itemgroup eqtype field-group checklist {{#if @index}}ninja{{/if}}">\
					{{#each items}}\
						<div id="{{typestr}}" data-id="{{id}}" class="item btn fa {{rarity}}{{#ifCond rarity "C"}}{{else}} ninja{{/ifCond}}">{{name}} <small>({{single}})</small></div>\
					{{/each}}\
				</div>\
			{{/each}}\
		</div>\
		<div class="flat-input sub">\
			<div class="btn fa third temp"     data-type="temp" data-cmd="generateBlueprint">Add Template</div>\
			<div class="btn fa third generate" data-type="blue" data-cmd="generateBlueprint">Add Blueprint</div>\
			<div class="btn fa third equipped" data-type="gear" data-cmd="generateBlueprint">Add Gear</div>\
		</div>\
	</div>\
</div>';
tmpstr.editCharacter = 
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">User Info</h3>\
	<form id="editUserForm" class="fadeobj editRelForm">\
		<input name="user_id" type="hidden" value="{{user_id}}">\
		<div class="field-group"><form>\
			<div class="insider">\
				<div class="field-line">\
					<label class="label">Name:</label>\
					<div class="value input half"><input type="text" name="first_name" placeholder="First" value="{{first_name}}" class="req"></div>\
					<div class="value input half"><input type="text" name="last_name" placeholder="Last" value="{{last_name}}" class="req"></div>\
				</div>\
				<div class="field-line">\
					<label class="label">Username:</label>\
					<div class="value input"><input type="text" name="user_name" value="{{user_name}}" class="req"></div>\
				</div>\
				<div class="field-line">\
					<label class="label">Password:</label>\
					<div class="value input"><input type="number" name="user_pass" placeholder="Numbers and . only" value="{{user_pass}}\" class="req"></div>\
				</div>\
				<div class="field-line">\
					<label class="label">Email:</label>\
					<div class="value input"><input type="text" name="email" value="{{email}}"></div>\
				</div>\
				 <div class="field-line">\
					<label class="label">Access:</label>\
					<div class="value input"><select name="user_level">\
						<option value="">Player</option>\
						<option value="admin"{{#ifCond user_level "admin"}} selected="selected"{{/ifCond}}>Admin</option>\
					</select></div>\
				</div>\
			</div>\
		</div>\
		<h3 class="block">Character Info</h3>\
		<div class="field-group">\
			<input name="char_id" type="hidden" value="{{char_id}}">\
			<div class="insider">\
				<div class="field-line">\
					<label class="label">Character:</label>\
					<div class="value input"><input type="text" name="char_name" value="{{char_name}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Cunning</label>\
					<div class="value input"><input type="number" name="ego_cunning" value="{{ego_cunning}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Discipline</label>\
					<div class="value input"><input type="number" name="ego_discipline" value="{{ego_discipline}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Tolerence</label>\
					<div class="value input"><input type="number" name="ego_tolerence" value="{{ego_tolerence}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Extra Bg</label>\
					<div class="value input"><input type="number" name="extra_bg" value="{{extra_bg}}"></div>\
				</div>\
				<div id="birth" class="field-line">\
					<label class="label">Birth Race</label>\
					<div class="value">\
						{{#if birth_obj.name}}\
							<input name="birth_race" type="hidden" value="{{birth_obj.id}}">\
							{{>relbox birth_obj}}\
						{{else}}\
							NOT SET\
						{{/if}}\
					</div>\
				</div>\
				<div id="nation" class="field-line">\
					<label class="label">Nation</label>\
					<div class="value">\
						{{#if nation_object.name}}\
							<input name="nation" type="hidden" value="{{nation_object.id}}">\
							{{>relbox nation_object}}\
						{{else}}\
							NOT SET\
						{{/if}}\
					</div>\
				</div>\
				<div id="background" class="field-line">\
					<label class="label">Backgrounds</label>\
					<div class="value">\
						{{#if background.length}}\
							{{#each background}}\
								{{>relbox .}}\
							{{/each}}\
						{{else}}\
							NONE\
						{{/if}}\
					</div>\
				</div>\
			</div>\
		</div>\
    	<h3 class="block">Fragments</h3>\
		<div class="field-group">\
			<div class="insider">\
				<div class="field-line small">\
					<label class="label">Energy:</label>\
					<div class="value input"><input type="text" name="energy" value="{{energy}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Basic:</label>\
					<div class="value input"><input type="text" name="basic_frag" value="{{basic_frag}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Tactical:</label>\
					<div class="value input"><input type="text" name="tactical_frag" value="{{tactical_frag}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Biomedical:</label>\
					<div class="value input"><input type="text" name="biomedical_frag" value="{{biomedical_frag}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Cyber:</label>\
					<div class="value input"><input type="text" name="cybernetic_frag" value="{{cybernetic_frag}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Chemical:</label>\
					<div class="value input"><input type="text" name="chemical_frag" value="{{chemical_frag}}"></div>\
				</div>\
			</div>\
		</div>\
		 <div class="flat-input sub">\
        	<div class="btn fa save" data-cmd="editUser">Save User</div>\
    	</div>\
	</form>\
</div>';

tmpstr.removeSkills = 
'<div class="topspace"></div><div class="panel">\
	<form id="removeSkillsForm" class="fadeobj editRelForm">\
		<input name="char_id" type="hidden" value="{{ch.char_id}}">\
		<h3 class="block">Add Skill</h3>\
		<div class="addskillUI flat-input sub">\
	        <div class="uibox">\
		        <div class="sel-wrap type"><select id="skillType">\
					<option value="learn">Aquire</option>\
					<option value="known">Learn</option>\
				</select></div>\
		        <div class="sel-wrap name"><select id="skillName">\
					<option value>Select Skill</option>\
					{{#each core.skills}}\
						<option value="{{sk_id}}">{{sk_name}}</option>\
					{{/each}}\
				</select></div>\
				<div id="addSkill" class="btn fa plus"></div>\
			</div>\
	    </div>\
		<h3 class="block">Aquired Skills</h3>\
		<div id="learn" class="field-group">\
			<div class="value">\
				{{#if ch.learn.length}}\
					{{#each ch.learn}}\
						{{>relbox .}}\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
		<h3 class="block">Learned Skills</h3>\
		<div id="known" class="field-group">\
			<div class="value">\
				{{#if ch.known.length}}\
					{{#each ch.known}}\
						{{>relbox .}}\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
		<h3 class="block">Add Psionic</h3>\
		<div class="addskillUI flat-input sub">\
	        <div class="uibox">\
		        <div class="sel-wrap type"><select id="skillType">\
					<option value="learnp">Aquire</option>\
					<option value="psion">Learn</option>\
				</select></div>\
				<div class="sel-wrap name"><select id="psionName">\
					<option value>Select Psionic</option>\
					{{#each core.psion}}\
						<option value="{{psi_id}}">{{psi_name}}</option>\
					{{/each}}\
				</select></div>\
				<div id="addPsion" class="btn fa plus"></div>\
			</div>\
	    </div>\
		<h3 class="block">Aquired Psionics</h3>\
		<div id="learnp" class="field-group">\
			<div class="value">\
				{{#if ch.learnp.length}}\
					{{#each ch.learnp}}\
						{{>relbox .}}\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
		<h3 class="block">Learned Psionics</h3>\
		<div id="psion" class="field-group">\
			<div class="value">\
				{{#if ch.psion.length}}\
					{{#each ch.psion}}\
						{{>relbox .}}\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
		<div class="flat-input sub">\
        	<div class="btn fa save" data-cmd="saveEditSkills">Save Changes</div>\
    	</div>\
	</form>\
</div>';
tmpstr.removeEquipment = 
'<div class="topspace"></div><div class="panel">\
	<form id="removeEquipmentForm" class="fadeobj editRelForm">\
		<input name="char_id" type="hidden" value="{{ch.char_id}}">\
		<div id="learn" class="field-group">\
			<div class="value">\
				{{#if ch.gear.length}}\
					{{#each ch.gear}}\
						{{>relbox .}}\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
		<div class="flat-input sub">\
        	<div class="btn fa save" data-cmd="saveEditEquipment">Save Changes</div>\
    	</div>\
	</form>\
</div>';

tmpstr.addUser = 
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Add User</h3>\
	<form id="newUserForm" class="fadeobj">\
		<div class="field-group"><form>\
			<div class="insider">\
				<div class="field-line">\
					<label class="label">Name:</label>\
					<div class="value input half"><input type="text" name="first_name" placeholder="First" class="req"></div>\
					<div class="value input half"><input type="text" name="last_name" placeholder="Last" class="req"></div>\
				</div>\
				<div class="field-line">\
					<label class="label">Username:</label>\
					<div class="value input"><input type="text" name="user_name" class="req"></div>\
				</div>\
				<div class="field-line">\
					<label class="label">Password:</label>\
					<div class="value input"><input type="number" name="user_pass" placeholder="Numbers and . only" class="req"></div>\
				</div>\
				<div class="field-line">\
					<label class="label">Email:</label>\
					<div class="value input"><input type="text" name="email"></div>\
				</div>\
				 <div class="field-line">\
					<label class="label">Access:</label>\
					<div class="value input"><select name="user_level">\
						<option value="">Player</option>\
						<option value="admin">Admin</option>\
					</select></div>\
				</div>\
			</div>\
		</div>\
		<div class="field-group"><form>\
			<div class="insider">\
				<div class="field-line">\
					<label class="label">Character:</label>\
					<div class="value input"><input type="text" name="char_name" class="req"></div>\
				</div>\
			</div>\
		</div>\
        <div class="flat-input sub">\
        	<div class="btn fa save" data-cmd="saveUser">Save User</div>\
    	</div>\
	</form>\
</div>';

tmpstr.addTeam = 
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Add Team</h3>\
	<form id="newTeamForm" class="fadeobj">\
		<div class="field-group"><form>\
			<div class="insider">\
				<div class="field-line full">\
					<div class="value input"><input type="text" name="team_name" class="req" placeholder="Team Name"></div>\
				</div>\
				<input type="hidden" name="admin_id" value=""/>\
				<div class="field-line full">\
					<div class="auto-hold set-admin" data-value="" data-ids="" name="team">\
						<span class="auto-html"></span>\
						<textarea class="auto-list" placeholder="Add Member"></textarea>\
					</div>\
				</div>\
			</div>\
			<div class="legend">\
				<label class="fa team on">= Leader</label>\
				<label class="fa team off"> = Member</label>\
			</div>\
		</div>\
        <div class="flat-input sub">\
        	<div class="btn fa save" data-cmd="saveTeam">Save Team</div>\
    	</div>\
	</form>\
</div>';
tmpstr.editTeam = 
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Characters</h3>\
	<form id="editTeamForm" class="fadeobj editRelForm">\
		<input type="hidden" value="{{team.char_id}}" name="char_id">\
		<div class="field-group"><form>\
			<div class="insider">\
				<div class="field-line full">\
					<div class="value input"><input type="text" name="team_name" class="req" placeholder="Team Name"  value="{{team.char_name}}"></div>\
				</div>\
				<input type="hidden" name="admin_id" value="{{team.user_id}}"/>\
				<div class="field-line full">\
					<div class="auto-hold set-admin" data-value="{{member_list}}" data-ids="{{member_ids}}" name="team">\
						<span class="auto-html">{{>autoUserList2 members}}</span>\
						<textarea class="auto-list" placeholder="Add Member"></textarea>\
					</div>\
				</div>\
			</div>\
			<div class="legend">\
				<label class="fa team on">= Leader</label>\
				<label class="fa team off"> = Member</label>\
			</div>\
		</div>\
    	<h3 class="block">Fragments</h3>\
		<div class="field-group">\
			<div class="insider">\
				<div class="field-line small">\
					<label class="label">Energy:</label>\
					<div class="value input"><input type="text" name="energy" value="{{team.energy}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Basic:</label>\
					<div class="value input"><input type="text" name="basic_frag" value="{{team.basic_frag}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Tactical:</label>\
					<div class="value input"><input type="text" name="tactical_frag" value="{{team.tactical_frag}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Biomedical:</label>\
					<div class="value input"><input type="text" name="biomedical_frag" value="{{team.biomedical_frag}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Cyber:</label>\
					<div class="value input"><input type="text" name="cybernetic_frag" value="{{team.cybernetic_frag}}"></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Chemical:</label>\
					<div class="value input"><input type="text" name="chemical_frag" value="{{team.chemical_frag}}"></div>\
				</div>\
			</div>\
		</div>\
		 <div class="flat-input sub">\
        	<div class="btn fa save" data-cmd="saveEditTeam">Save Team</div>\
    	</div>\
	</form>\
</div>';

tmpstr.playerEditTeam = 
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Members</h3>\
	<form id="editTeamForm" class="fadeobj editRelForm">\
		<input type="hidden" value="{{team.char_id}}" name="char_id">\
		<div class="field-group">\
			<div class="insider">\
				<div class="field-line full">\
					<div class="value input">\
						{{#if team_data.isAdmin}}\
							<input type="text" name="team_name" class="req" placeholder="Team Name"  value="{{team.char_name}}">\
						{{else}}\
							<label>{{team.char_name}}</label>\
						{{/if}}\
					</div>\
				</div>\
				<input type="hidden" name="admin_id" value="{{team.user_id}}"/>\
				<div class="field-line full">\
					<div class="auto-hold{{#if team_data.isAdmin}} set-admin{{/if}}" data-value="{{member_list}}" data-ids="{{member_ids}}" name="team">\
						<span class="auto-html">{{>autoUserList2 members}}</span>\
						{{#if team_data.isAdmin}}<textarea class="auto-list" placeholder="Add Member"></textarea>\{{/if}}\
					</div>\
				</div>\
				{{#if team_data.isAdmin}}\
					<div class="legend">\
						<label class="fa team on">= Leader</label>\
						<label class="fa team off"> = Member</label>\
					</div>\
				{{/if}}\
			</div>\
		</div>\
		<br/>\
    	<h3 class="block">Fragments</h3>\
		<div class="field-group">\
			<div class="insider">\
				<div class="field-line small">\
					<label class="label">Energy:</label>\
					<div class="value input"><label>{{team.energy}}</label></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Basic:</label>\
					<div class="value input"><label>{{team.basic_frag}}</label></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Tactical:</label>\
					<div class="value input"><label>{{team.tactical_frag}}</label></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Biomedical:</label>\
					<div class="value input"><label>{{team.biomedical_frag}}</label></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Cyber:</label>\
					<div class="value input"><label>{{team.cybernetic_frag}}</label></div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Chemical:</label>\
					<div class="value input"><label>{{team.chemical_frag}}<label></div>\
				</div>\
			</div>\
		</div>\
		<div class="flat-input sub">\
		{{#if team_data.isAdmin}}\
        	<div class="btn fa save" data-cmd="saveEditTeam">Save Team</div>\
        {{else}}\
        	<div class="btn fa save" data-cmd="leaveTeam">Leave Team</div>\
        {{/if}}\
    	</div>\
    	{{#unless team_data.isAdmin}}\
    		<div class="secondary-prompt">\
        		<div class="inner">\
		        	<label>Are you sure?</label>\
		        	<div class="yn-btns">\
		        		<div id="confirmSleeve" class="btn half yes" data-cmd="confirmLeaveTeam">Y</div>\
		        		<div class="btn half no" data-cmd="cancelLeaveTeam">N</div>\
		        	</div>\
	        	</div>\
        	</div>\
    	{{/unless}}\
	</form>\
</div>\
<div class="panel">\
	<div class="field-group skill-list">\
		<h3 class="block">Skills & Psionics</h3>\
		{{#if skill_count}}\
			{{#each team_data.learn}}\
				<div class="btn fa figure">{{sk_name}}</div>\
			{{/each}}\
			{{#each team_data.learnp}}\
				<div class="btn fa figure">{{psi_name}}</div>\
			{{/each}}\
		{{else}}\
			<div class="btn fa">None</div>\
		{{/if}}\
	</div>\
	<div class="field-group gear-list">\
		<h3 class="block">Gear and Blueprints</h3>\
		{{#if gear_count}}\
			{{#each team_data.temp}}\
				<div class="i_temp btn fa figure" data-message="Template">{{name}}</div>\
			{{/each}}\
			{{#each team_data.blue}}\
				<div class="i_blue btn fa figure" data-message="Blueprint">{{name}}</div>\
			{{/each}}\
			{{#each team_data.gear}}\
				<div class="i_gear btn fa figure" data-message="Gear">{{name}}</div>\
			{{/each}}\
		{{else}}\
			<div class="btn fa">None</div>\
		{{/if}}\
	</div>\
</div>';

tmpstr.checkin =
'<div class="functions panel">\
<div class="actions filter searcher"><div class="btn large fa search"></div><input id="searchchars" type="text" placeholder="ENTER SEARCH"></div>\
	<div id="{{new}}" class="circle btn simple" data-cmd="startCheckin">CHECK IN</div>\
	{{#each characters}}\
		<div id="{{char_id}}" class="circle btn active-user"><span class="char_name">{{char_name}}</span>\
			<div class="pin"><input type="password" placeholder="P"/><div class="btn white">GO</div></div>\
		</div>\
	{{/each}}\
</div>';
tmpstr.psych =
'<div class="functions panel">\
	<div class="actions filter searcher"><div class="btn large fa search"></div><input id="searchchars" type="text" placeholder="ENTER SEARCH"></div>\
	{{#each characters}}\
		<div id="{{char_id}}" class="psych patient circle btn aactive-user"><span class="char_name">{{char_name}}</span>\
			{{#if ../psych}}<div class="psi-skills">{{#each known}}\
				<span class="skill">{{sk_name}}</span>\
			{{/each}}</div>{{/if}}\
			<div class="pin"><input type="password" placeholder="P"/><div class="btn white">GO</div></div>\
		</div>\
	{{/each}}\
</div>';
tmpstr.patientChart = 
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Patient: {{char_name}}</h3>\
	<div class="field-group half high{{#if free_ego}} free{{/if}}">\
		<div class="insider">\
			<div class="field-line">\
				<label class="label">BIRTH RACE:</label>\
				{{#if birth_obj.name}}\
					<label class="value">{{birth_obj.name}}</label>\
					{{#if birth_races.1.name}}<label class="value">{{birth_races.1.name}}</label>\{{/if}}\
				{{else}}\
					<label id="racename" class="value viewnext fa">Unset</label>\
				{{/if}}\
			</div>\
			<div class="field-line nation">\
				<label class="label">NATION:</label>\
				{{#if nation_object.name}}\
					<label class="value">{{nation_object.name}}</label>\
					{{#if nations_on.1.name}}<label class="value">{{nations_on.1.name}}</label>\{{/if}}\
				{{else}}\
					<label id="nationname" class="value viewnext fa">Unset</label>\
				{{/if}}\
			</div>\
		</div>\
	</div>\
	<div id="ego-block" class="field-group half high{{#if free_ego}} free{{/if}}">\
		<div class="insider">\
			<div class="field-line small">\
				<label class="label">EGO:</label>\
				<label class="value">{{max_ego}}<span class="free-ego" data-free="{{free_ego}}">/{{free_ego}}</span></label>\
			</div>\
			<div class="field-line small">\
				<label class="label">TOLERENCE:</label>\
				<label class="value" id="t" data-init="{{ego_tolerence}}" data-val="{{ego_tolerence}}" data-min="{{ego_tolerence}}">\
					<span class="num">{{ego_tolerence}}</span>\
				</label>\
			</div>\
			<div class="field-line small">\
				<label class="label">CUNNING:</label>\
				<label id="c" data-init="{{ego_cunning}}" data-val="{{ego_cunning}}" class="value">\
					<span class="num">{{ego_cunning}}</span>\
				</label>\
			</div>\
			<div class="field-line small">\
				<label class="label">DISCIPLINE:</label>\
				<label id="d" data-init="{{ego_discipline}}" data-val="{{ego_discipline}}" class="value">\
					<span class="num">{{ego_discipline}}</span>\
				</label>\
			</div>\
		</div>\
	</div>\
	<div class="field-group sleeve">\
		<div class="insider">\
			<label class="full">Current Sleeve:</label>\
			<div class="padd">\
				<label class="value">{{current_sleeve.name}}</label>\
			</div>\
		</div>\
	</div>\
	{{#if  trauma.length}}\
	<div class="field-group background">\
		<div class="insider">\
			<label class="full">EGO LOSS: <!--<span class="ego-loss-percent">{{ego_loss}}</span>% --></label>\
			<div class="padd trauma-bank">\
				{{#each trauma}}\
					{{#ifCond label "No Penalty"}}\
					{{else}}\
						<label class="trauma-item">{{label}}</label>\
					{{/ifCond}}\
				{{/each}}\
			</div>\
		</div>\
	</div>\
	{{/if}}\
	<div class="field-group background">\
		<div class="insider">\
			<label class="full">BACKGROUNDS:</label>\
			<div class="padd" {{#unless bglist}} style="display:none"{{/unless}}>\
				<label id="backgroundlist" class="value">{{bglist}}</label>\
			</div>\
			{{#if free_bg}}\
				<div class="padd">\
					<label class="value viewnext fa" data-screen-link="edit-source">Select</label>\
				</div>\
			{{/if}}\
		</div>\
	</div>\
	<h3 class="block">Skills</h3>\
		<div id="learn" class="field-group">\
			<div class="value">\
				{{#if totalSkills}}\
					{{#each known}}\
						<div id="{{rel_id}}" class="relbox btn with-description on"><div class="inrel">{{name}}</div></div>\
					{{/each}}\
					{{#each learn}}\
						<div id="{{rel_id}}" class="relbox"><div class="inrel">{{name}}</div></div>\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
		<h3 class="block">Psionics</h3>\
		<div id="learnp" class="field-group">\
			<div class="value">\
				{{#if totalPsion}}\
					{{#each psion}}\
						<div id="{{rel_id}}" class="relbox btn with-description on"><div class="inrel">{{name}}</div></div>\
					{{/each}}\
					{{#each learnp}}\
						<div id="{{rel_id}}" class="relbox"><div class="inrel">{{name}}</div></div>\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
</div>';
tmpstr.psychList = 
'<div class="topspace"></div><div class="panel">\
	<!--<div class="btn next fa" data-cmd="psychSellSkill">Sell Skill</div>-->\
	<div class="btn next fa" data-cmd="patientChart"><span class="desktext">Patient </span>Charts</div>\
	<div class="btn next fa" data-cmd="embedSkill"><span class="desktext">Embed </span>Skill</div>\
	<div class="btn next fa" data-cmd="embedPsionic"><span class="desktext">Embed </span>Psionic</div>\
	{{#if dr.exceptions.restore}}<div class="btn next fa" data-cmd="fixTrauma"><span class="desktext">Repair </span>Trauma</div>{{/if}}\
	{{#if dr.exceptions.cognit}}<div class="btn next fa" data-cmd="changeEgo"><span class="desktext">Change </span>Ego</div>{{/if}}\
	{{#if dr.exceptions.electro}}<div class="btn next fa" data-cmd="removeSkill"><span class="desktext">Remove </span>Skill</div>{{/if}}\
</div>';
tmpstr.psychReset =
'<div class="topspace"></div><div class="panel">\
	<input type="hidden" name="subject" value="{{char.char_id}}"/>\
	<h3 class="block">Reset Ego Pools?</h3>\
	<div class="field-group">\
		<div class="insider">\
			<div class="field-line small">\
				<label class="label">Service Fee</label>\
				<div class="value input">\
					<input type="number" name="service" value="0" min="0">\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label fa tax">Tax</label>\
				<div class="value input">\
					<label class="egotax">0</label>\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label">Total</label>\
				<div class="value input">\
					<label class="totalEgoCost" style="color:black">0</label>\
				</div>\
			</div>\
		</div>\
	</div>\
	<h3 class="block">Patient: {{char.char_name}}</h3>\
	<div class="field-group">\
		<div class="insider">\
			<div class="field-line small">\
				<label class="label fa energy">Available</label>\
				<div class="value input">\
					<label class="avail-energy">{{char.energy}}</label>\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label">Pin</label>\
				<div class="value input">\
					<strong><input type="password" name="pin"></strong>\
				</div>\
			</div>\
			<div class="btn fa therapy" data-cmd="resetEgo">RESET EGO</div>\
		</div>\
	</div>\
</div>';
tmpstr.psychEmbed =
'<div class="topspace"></div><div class="panel">\
	<input type="hidden" name="subject" value="{{char.char_id}}"/>\
	<h3 class="block">Embed Skill</h3>\
	<div class="field-group">\
		<div class="insider">\
			<div class="field-line small">\
				<label class="label">Service Fee</label>\
				<div class="value input">\
					<input type="number" name="service" value="0" min="0">\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label fa tax">Tax</label>\
				<div class="value input">\
					<label class="egotax">0</label>\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label">Total</label>\
				<div class="value input">\
					<label class="totalEgoCost" style="color:black">0</label>\
				</div>\
			</div>\
		</div>\
	</div>\
	<h3 class="block">Patient: {{char.char_name}}</h3>\
	<div class="field-group">\
		<div class="addskillUI flat-input sub">\
		    <div class="uibox">\
			    <div class="sel-wrap type"><select id="embedType">\
					<option value="random">Random</option>\
					<option value="specific">Specific</option>\
				</select></div>\
				<div class="sel-wrap name"><select style="display:none" id="chooseEmbed">\
					<option value>Select Skill</option>\
					{{#each skills}}\
						<option value="{{id}}">{{sk_name}}</option>\
					{{/each}}\
				</select></div>\
			</div>\
		</div>\
	</div>\
	<div class="field-group">\
		<div class="insider">\
			<div class="field-line widelabel small">\
				<label class="label fa basic">Basic: {{char.basic_frag}}</label>\
				<div class="value input">\
					<input class="spendFrag" name="basic_frag" type="number" max="{{char.basic_frag}}" min="0" value="0"{{#unless char.basic_frag}} disabled="disabled"{{/unless}}>\
				</div>\
			</div>\
			<div class="field-line widelabel small">\
				<label class="label fa tactical">Tactical: {{char.tactical_frag}}</label>\
				<div class="value input">\
					<input class="spendFrag" name="tactical_frag" type="number" max="{{char.tactical_frag}}" min="0" value="0"{{#unless char.tactical_frag}} disabled="disabled"{{/unless}}>\
				</div>\
			</div>\
			<div class="field-line widelabel small">\
				<label class="label fa biomedical">Biomedical: {{char.biomedical_frag}}</label>\
				<div class="value input">\
					<input class="spendFrag" name="biomedical_frag" type="number" max="{{char.biomedical_frag}}" min="0" value="0"{{#unless char.biomedical_frag}} disabled="disabled"{{/unless}}>\
				</div>\
			</div>\
			<div class="field-line widelabel small">\
				<label class="label fa cybernetic">Cyber: {{char.cybernetic_frag}}</label>\
				<div class="value input">\
					<input class="spendFrag" name="cybernetic_frag" type="number" max="{{char.cybernetic_frag}}" min="0" value="0"{{#unless char.cybernetic_frag}} disabled="disabled"{{/unless}}>\
				</div>\
			</div>\
			<div class="field-line widelabel small">\
				<label class="label fa chemical">Chemical: {{char.chemical_frag}}</label>\
				<div class="value input">\
					<input class="spendFrag" name="chemical_frag" type="number" max="{{char.chemical_frag}}" min="0" value="0"{{#unless char.chemical_frag}} disabled="disabled"{{/unless}}>\
				</div>\
			</div>\
			<hr/>\
			<div class="field-line widelabel small">\
				<label class="label fa">TOTAL:</label>\
				<div class="value input">\
					<p><span class="spending">0</span>/<span class="needed">10</span></p>\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label">Pin</label>\
				<div class="value input">\
					<strong><input type="password" name="pin"></strong>\
				</div>\
			</div>\
			<div class="btn fa therapy" data-cmd="doEmbedSkill">Embed Skill</div>\
		</div>\
	</div>\
</div>';
tmpstr.psychEmbedPsion =
'<div class="topspace"></div><div class="panel">\
	<input type="hidden" name="subject" value="{{char.char_id}}"/>\
	<h3 class="block">Embed Psionics</h3>\
	<div class="field-group">\
		<div class="insider">\
			<div class="field-line small">\
				<label class="label">Service Fee</label>\
				<div class="value input">\
					<input type="number" name="service" value="0" min="0">\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label fa tax">Tax</label>\
				<div class="value input">\
					<label class="egotax">0</label>\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label">Total</label>\
				<div class="value input">\
					<label class="totalEgoCost" style="color:black">0</label>\
				</div>\
			</div>\
		</div>\
	</div>\
	<h3 class="block">Patient: {{char.char_name}}</h3>\
	<div class="field-group">\
		<div class="addskillUI flat-input sub">\
		    <div class="uibox">\
			    <div class="sel-wrap type"><select id="embedType">\
					<option value="random">Random</option>\
					<option value="specific">Specific</option>\
				</select></div>\
				<div class="sel-wrap name"><select style="display:none" id="chooseEmbed">\
					<option value>Select Psionic</option>\
					{{#each  psion}}\
						<option value="{{id}}">{{psi_name}}</option>\
					{{/each}}\
				</select></div>\
			</div>\
		</div>\
	</div>\
	<div class="field-group">\
		<div class="insider">\
			<div class="field-line widelabel small">\
				<label class="label fa basic">Basic: {{char.basic_frag}}</label>\
				<div class="value input">\
					<input class="spendFrag" name="basic_frag" type="number" max="{{char.basic_frag}}" min="0" value="0"{{#unless char.basic_frag}} disabled="disabled"{{/unless}}>\
				</div>\
			</div>\
			<div class="field-line widelabel small">\
				<label class="label fa tactical">Tactical: {{char.tactical_frag}}</label>\
				<div class="value input">\
					<input class="spendFrag" name="tactical_frag" type="number" max="{{char.tactical_frag}}" min="0" value="0"{{#unless char.tactical_frag}} disabled="disabled"{{/unless}}>\
				</div>\
			</div>\
			<div class="field-line widelabel small">\
				<label class="label fa biomedical">Biomedical: {{char.biomedical_frag}}</label>\
				<div class="value input">\
					<input class="spendFrag" name="biomedical_frag" type="number" max="{{char.biomedical_frag}}" min="0" value="0"{{#unless char.biomedical_frag}} disabled="disabled"{{/unless}}>\
				</div>\
			</div>\
			<div class="field-line widelabel small">\
				<label class="label fa cybernetic">Cyber: {{char.cybernetic_frag}}</label>\
				<div class="value input">\
					<input class="spendFrag" name="cybernetic_frag" type="number" max="{{char.cybernetic_frag}}" min="0" value="0"{{#unless char.cybernetic_frag}} disabled="disabled"{{/unless}}>\
				</div>\
			</div>\
			<div class="field-line widelabel small">\
				<label class="label fa chemical">Chemical: {{char.chemical_frag}}</label>\
				<div class="value input">\
					<input class="spendFrag" name="chemical_frag" type="number" max="{{char.chemical_frag}}" min="0" value="0"{{#unless char.chemical_frag}} disabled="disabled"{{/unless}}>\
				</div>\
			</div>\
			<hr/>\
			<div class="field-line widelabel small">\
				<label class="label fa">TOTAL:</label>\
				<div class="value input">\
					<p><span class="spending">0</span>/<span class="neededP">30</span></p>\
				</div>\
			</div>\
			<div class="field-line small">\
				<label class="label">Pin</label>\
				<div class="value input">\
					<strong><input type="password" name="pin"></strong>\
				</div>\
			</div>\
			<div class="btn fa therapy" data-cmd="doEmbedPsion">Embed Psionic</div>\
		</div>\
	</div>\
</div>';
tmpstr.psychSell =
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Aquired Skills</h3>\
	<form id="psySkillsForm" class="fadeobj editRelForm">\
		<input name="char_id" type="hidden" value="{{char.char_id}}">\
		<div id="learn" class="field-group">\
			<div class="value">\
				{{#if char.learn.length}}\
					{{#each char.learn}}\
						<div id="{{rel_id}}" class="relbox selectable"><div class="inrel">{{name}}</div></div>\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
		<h3 class="block">Aquired Psionics</h3>\
		<div id="learnp" class="field-group">\
			<div class="value">\
				{{#if char.learnp.length}}\
					{{#each char.learnp}}\
						<div id="{{rel_id}}" class="relbox selectable"><div class="inrel">{{name}}</div></div>\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
		<h3 class="block">Skill Cost</h3>\
		<div class="field-group">\
			<div class="insider">\
				<div class="field-line small">\
					<label class="label">Skill Price</label>\
					<div class="value input">\
						<input type="number" name="skill_cost" value="0" min="0">\
					</div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Service Fee</label>\
					<div class="value input">\
						<input type="number" name="service" value="0" min="0">\
					</div>\
				</div>\
				<div class="field-line small">\
					<label class="label fa tax">Tax</label>\
					<div class="value input">\
						<label class="egotax">0</label>\
					</div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Total</label>\
					<div class="value input">\
						<label class="totalEgoCost" style="color:black">0</label>\
					</div>\
				</div>\
			</div>\
		</div>\
		<h3 class="block">Patient: {{char.char_name}}</h3>\
		<div class="field-group seller">\
			<div class="insider">\
				<div class="field-line small">\
					<label class="label">Pin</label>\
					<div class="value input">\
						<strong><input type="password" name="pin"></strong>\
					</div>\
				</div>\
			</div>\
		</div>\
		<div class="flat-input sub choosebuyer"><div class="btn fa therapy" data-cmd="skillBuyer">Choose Buyer</div></div>\
		<div class="buyer-block" style="display:none">\
			<h3 class="block buyer-name"></h3>\
			<input name="buyer_id" type="hidden" value="">\
			<div class="field-group buyer">\
				<div class="insider">\
					<div class="field-line small">\
						<label class="label fa energy">Available</label>\
						<div class="value input">\
							<label class="avail-energy"></label>\
						</div>\
					</div>\
					<div class="field-line small">\
						<label class="label">Pin</label>\
						<div class="value input">\
							<strong><input type="password" name="buypin"></strong>\
						</div>\
					</div>\
				</div>\
			</div>\
			<div class="flat-input sub"><div class="btn fa therapy" data-cmd="psySellSelectedSkill">SELL SKILL</div></div>\
		</div>\
	</form>\
</div>';
tmpstr.psychTrauma = 
'<div class="topspace"></div><div class="panel">\
	<input type="hidden" name="subject" value="{{char.char_id}}"/>\
	<h3 class="block">TRAUMA</h3>\
	{{#if char.editTrauma}}\
		<div class="field-group editRelForm">\
			{{#each char.editTrauma }}\
			<div id="{{p_id}}" class="relbox">\
				{{#ifCond @index 0}}<div class="fa close btn"></div>{{/ifCond}}\
				<div class="inrel">{{label}}</div>\
			</div>\
			{{/each}}\
		</div>\
		<h3 class="block">Remove Trauma?</h3>\
		<div class="field-group">\
			<div class="insider">\
				<div class="field-line small">\
					<label class="label">Service Fee</label>\
					<div class="value input">\
						<input type="number" name="service" value="0" min="0">\
					</div>\
				</div>\
				<div class="field-line small">\
					<label class="label fa tax">Tax</label>\
					<div class="value input">\
						<label class="egotax">0</label>\
					</div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Total</label>\
					<div class="value input">\
						<label class="totalEgoCost" style="color:black">0</label>\
					</div>\
				</div>\
			</div>\
		</div>\
		<h3 class="block">Patient: {{char.char_name}}</h3>\
		<div class="field-group">\
			<div class="insider">\
				<div class="field-line small">\
					<label class="label fa energy">Available</label>\
					<div class="value input">\
						<label class="avail-energy">{{char.energy}}</label>\
					</div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Pin</label>\
					<div class="value input">\
						<strong><input type="password" name="pin"></strong>\
					</div>\
				</div>\
				<div class="btn fa therapy" data-cmd="removeTrauma">RESET TRAUMA</div>\
			</div>\
		</div>\
	{{else}}\
		<h3>No trauma present</h3>\
	{{/if}}\
</div>';
tmpstr.psychSkill = 
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Skills</h3>\
	<form id="psySkillsForm" class="fadeobj editRelForm">\
		<input name="char_id" type="hidden" value="{{char.char_id}}">\
		<div id="known" class="field-group">\
			<div class="value">\
				{{#if char.known.length}}\
					{{#each char.known}}\
						{{>relbox .}}\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
		<h3 class="block">Psionics</h3>\
		<div id="psion" class="field-group">\
			<div class="value">\
				{{#if char.psion.length}}\
					{{#each char.psion}}\
						{{>relbox .}}\
					{{/each}}\
				{{else}}\
					NONE\
				{{/if}}\
			</div>\
		</div>\
		<h3 class="block">Remove Skill Cost</h3>\
		<div class="field-group">\
			<div class="insider">\
				<div class="field-line small">\
					<label class="label">Service Fee</label>\
					<div class="value input">\
						<input type="number" name="service" value="0" min="0">\
					</div>\
				</div>\
				<div class="field-line small">\
					<label class="label fa tax">Tax</label>\
					<div class="value input">\
						<label class="egotax">0</label>\
					</div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Total</label>\
					<div class="value input">\
						<label class="totalEgoCost" style="color:black">0</label>\
					</div>\
				</div>\
			</div>\
		</div>\
		<h3 class="block">Patient: {{char.char_name}}</h3>\
		<div class="field-group">\
			<div class="insider">\
				<div class="field-line small">\
					<label class="label fa energy">Available</label>\
					<div class="value input">\
						<label class="avail-energy">{{char.energy}}</label>\
					</div>\
				</div>\
				<div class="field-line small">\
					<label class="label">Pin</label>\
					<div class="value input">\
						<strong><input type="password" name="pin"></strong>\
					</div>\
				</div>\
				<div class="btn fa therapy" data-cmd="psyEditSkills">REMOVE SKILL</div>\
			</div>\
		</div>\
	</form>\
</div>';
tmpstr.store =
'<div class="fixed-head">\
	<div class="panel top">\
		<div class="actions tabs">\
			<div id="all" class="all btn fa on"><span class="desktext">ALL</span></div>\
			<div id="sell" class="sell btn fa"><span class="desktext">FOR SALE</span></div>\
			<div id="owned" class="owned btn fa"><span class="desktext">OWNED</span></div>\
		</div>\
		<!--<div class="actions searchbar">\
			<div class="pan half">\
				<div class="fa tax sales">{{tax}}%</div>\
			</div>\
			<div class="pan half">\
				<div class="fa energy">{{energy}}</div>\
			</div>\
		</div>-->\
		<div style="clear:both"></div>\
	</div>\
</div>\
<div class="panel under-fixed frag-panel leave-on fab{{#if teams.length}} in-use{{/if}}">\
	{{#if teams.length}}<div class="using">IN USE</div>{{/if}}\
	{{#if teams.length}}<div class="one use-btn btn">USE</div>{{/if}}\
	{{#if teams.length}}<h3 class="block">{{char_name}}<span class="desktext">  Frags</span></h3>{{/if}}\
	<div class="pan six">\
		<div class="fa energy">{{energy}}</div>\
	</div>\
	<div id="basic" class="basic pan six fa frag focus">{{basic_frag}}</div>\
	<div id="tactical" class="tactical pan six fa frag">{{tactical_frag}}</div>\
	<div id="biomedical" class="biomedical pan six fa frag">{{biomedical_frag}}</div>\
	<div id="cybernetic" class="cybernetic pan six fa frag">{{cybernetic_frag}}</div>\
	<div id="chemical" class="chemical pan six fa frag">{{chemical_frag}}</div>\
</div>\
{{#each teams}}\
<div class="panel frag-panel leave-on fab team" data-id="{{char_id}}">\
	<div class="using">IN USE</div>\
	<div class="two use-btn btn">USE</div>\
	<h3 class="block">{{char_name}}<span class="desktext"> Frags</span></h3>\
		<div class="pan six">\
			<div class="fa energy">{{energy}}</div>\
		</div>\
		<div id="basic" class="basic pan six fa frag">{{basic_frag}}</div>\
		<div id="tactical" class="tactical pan six fa frag">{{tactical_frag}}</div>\
		<div id="biomedical" class="biomedical pan six fa frag">{{biomedical_frag}}</div>\
		<div id="cybernetic" class="cybernetic pan six fa frag">{{cybernetic_frag}}</div>\
		<div id="chemical" class="chemical pan six fa frag">{{chemical_frag}}</div>\
</div>\
{{/each}}\
<div class="panel ghost bluprints{{#if @index}} off{{/if}}">\
	<div class="gear-wrap temp">\
		<div class="owned-panel item-pan">\
			<h3 class="block">Owned</h3>\
			{{#each marketplace}}{{#if owned}}{{>marketitem}}{{/if}}{{/each}}\
		</div>\
		<div class="sale-panel item-pan">\
			<h3 class="block">For Sale</h3>\
			{{#each marketplace}}{{#unless owned}}{{>marketitem}}{{/unless}}{{/each}}\
		</div>\
	</div>\
</div>';
tmpstr.marketitem = 
'<div id="{{rel_id}}" data-gear-id="{{gear_id}}" class="market-line rare-{{rarity}} {{#if sell}} on-market{{/if}}{{#if team}} team-item{{/if}} i_{{rel_key}}">\
	<div class="main-line">\
		<div class="btn_hold fa m_{{#if owned}}buy{{else}}sell{{/if}}">\
			{{#if owned}}<div class="trade_btn active fa close"></div>{{#if sellable}}<div class="trade_btn active fa sell">Sell</div>{{/if}}\
			{{else}}<div class="trade_btn active fa close"></div><div class="trade_btn active fa buy">Buy</div><div class="trade_btn fa energy">{{total}}</div>{{/if}}\
		</div>\
		<div class="leftLine">\
			<div class="icon fa i_{{rel_key}}" data-message="{{message}}"></div>\
			<div class="name"><span class="countnum">{{count}}</span> <span class="eq-name">{{name}}</span><span class="b-cost">{{cost}} <span class="fa build"></span></span></div>\
		</div>\
		{{#unless owned}}<div class="line2">{{seller}}</div>{{/unless}}\
		{{#if team}}<div class="line2 fa team">{{seller}}</div>{{/if}}\
		{{#ifCond rel_key "temp"}}\
			<div class="line2">Complete: {{#if percent}}{{percent}}{{else}}0{{/if}}%</div>\
		{{/ifCond}}\
		{{#if modstr}}\
			<div class="line2">Install: {{modstr}}</div>\
		{{/if}}\
	</div>\
	<div class="purchase-line{{#if owned}} owned{{else}} forsale{{/if}}">\
		<div class="inner">\
			{{#if owned}}\
				<div class="field-line half">\
					<label class="label">Price</label>\
					<label class="static value">{{#if market}}{{market}}{{else}}0{{/if}}</label>\
					<input class="dynamic value" type="number" name="price" value="{{#if market}}{{market}}{{else}}0{{/if}}" min="0">\
				</div>\
				<div class="field-line half">\
					<label class="label">Tax: <span class="taxcost">{{salestax}}</span></label>\
				</div>\
				<br/>\
				<div class="field-line half">\
					<label class="label">Total: <span class="totalcost">{{#ifCond total "N/A"}}0{{else}}{{total}}{{/ifCond}}</span></label>\
				</div>\
				<div class="field-line half">\
					<label class="label">To</label>\
					<label class="static value char"></label>\
					<select class="dynamic value" name="to" data-vis="{{visible}}">\
						<option value="*">Any</option>\
						{{#each characters}}\
							<option value="{{char_id}}">{{char_name}}</option>\
						{{/each}}\
					</select>\
				</div>\
				<div class="market btns">\
					<div class="dynamic field-line full btn white execute">Sell</div>\
					<div class="static field-line full btn cancel">Cancel</div>\
				</div>\
			{{else}}\
				<input type="hidden" name="owner" value="{{owner}}">\
				<div class="field-line half">\
					<label class="label">Price</label>\
					<label class="static value">{{#if market}}{{market}}{{else}}0{{/if}}</label>\
					<input class="dynamic value" type="number" name="price" value="{{#if market}}{{market}}{{else}}0{{/if}}" min="0">\
				</div>\
				<div class="field-line half">\
					<label class="label">Tax: <span class="taxcost">{{salestax}}</span></label>\
				</div>\
				<br/>\
				<div class="field-line half">\
					<label class="label">Total {{total}}</label>\
				</div>\
				<div class="market btns">\
					<div class="field-line full btn white execute">Submit</div>\
					<div class="field-line full btn cancel">Cancel</div>\
				</div>\
			{{/if}}\
		</div>\
	</div>\
</div>';
tmpstr.giveBox = 
'<div class="panel frag-panel leave-on has-owner gbox{{#ifCond type "char"}} under-fixed{{else}} team{{/ifCond}}" data-id="{{char_id}}">\
	{{#ifCond type "team"}}\
		{{#if isAdmin}}<div class="give-frag btn">GIVE</div>\<div class="give-frag btn cancel" style="display:none">CANCEL</div>{{/if}}\
	{{else}}\
		<div class="give-frag btn">GIVE</div>\
		<div class="give-frag btn cancel" style="display:none">CANCEL</div>\
	{{/ifCond}}\
	<h3 class="block" style="padding:10px;">{{#ifCond type "team"}}{{char_name}} {{/ifCond}}Fragments</h3>\
	<div class="frag-bank counter">\
		<div id="energy" class="fa pan six energy" data-message="Energy">{{#if energy}}{{energy}}{{else}}0{{/if}}</div>\
		<div id="basic" class="basic pan six fa frag" data-message="Basic">{{#if basic_frag}}{{basic_frag}}{{else}}0{{/if}}</div>\
		<div id="tactical" class="tactical pan six fa frag" data-message="Tactical">{{#if tactical_frag}}{{tactical_frag}}{{else}}0{{/if}}</div>\
		<div id="biomedical" class="biomedical pan six fa frag"data-message="Biomedical">{{#if biomedical_frag}}{{biomedical_frag}}{{else}}0{{/if}}</div>\
		<div id="cybernetic" class="cybernetic pan six fa frag" data-message="Cybernetic">{{#if cybernetic_frag}}{{cybernetic_frag}}{{else}}0{{/if}}</div>\
		<div id="chemical" class="chemical pan six fa frag" data-message="Chemical">{{#if chemical_frag}}{{chemical_frag}}{{else}}0{{/if}}</div>\
	</div>\
	<div class="frag-bank form field-group" style="display:none">\
		<div id="energy" class="fa pan energy" data-message="Energy"><input type="number" min="0" value="0" max="{{energy}}" name="energy"></div>\
		<div id="basic" class="basic pan fa frag" data-message="Basic"><input type="number" min="0" value="0" max="{{basic_frag}}" name="basic_frag"></div>\
		<div id="tactical" class="tactical pan fa frag" data-message="Tactical"><input type="number" min="0" value="0" max="{{tactical_frag}}"  name="tactical_frag"></div>\
		<div id="biomedical" class="biomedical pan fa frag" data-message="Biomedical"><input type="number" min="0" value="0" max="{{biomedical_frag}}" name="biomedical_frag"></div>\
		<div id="cybernetic" class="cybernetic pan fa frag" data-message="Cybernetic"><input type="number" min="0" value="0" max="{{cybernetic_frag}}" name="cybernetic_frag"></div>\
		<div id="chemical" class="chemical pan fa frag" data-message="Chemical"><input type="number" min="0" value="0" max="{{chemical_frag}}" name="chemical_frag"></div>\
		<div class="character-to field-line">\
			<label class="label">Give To:</label>\
			<div class="value input has-owner">\
				<input type="text" name="character-to" placeholder="Enter Person/Team">\
			</div>\
		</div>\
		<div id="giveFragBtn" data-cmd="giveAwayFrags" class="fa btn">SEND</div>\
	</div>\
</div>';
tmpstr.inventory =
'<div class="fixed-head inventory-wrap">\
	<div class="panel top">\
		<div class="topline"><h3 class="desktext">Inventory </h3></div>\
		<div class="actions right"><div class="btn fa large qrcode" data-action="scan-qr" data-cmd="fragScanner" data-message="Scan Fragments"></div></div>\
		<div class="actions tabs">\
			<div id="all" class="all btn fa on"><span class="desktext">ALL</span></div>\
			<div id="equipped" class="equipped btn fa"><span class="desktext">EQUIPPED</span></div>\
			<div id="cryo" class="cryo btn fa">\
				<span class="cryo-used">{{cryoinfo.used}}</span>/<span class="cryo-max">{{cryoinfo.max}}</span><span class="desktext">: CRYO</span>\
			</div>\
			<div id="module" class="mod btn fa"><span class="desktext">MODULES</span></div>\
		</div>\
		<div style="clear:both"></div>\
	</div>\
</div>\
{{>giveBox .}}\
{{#each teams}}\
	{{>giveBox .}}\
{{/each}}\
<div class="panel ghost bluprints{{#if @index}} off{{/if}}">\
	{{#if experiment_mod}}<div class="panel slim"><h3>{{experiment_mod.[0].name}}</h3>({{experiment_mod.[0].single}}) Will be applied to all equipped sleeves</div>{{/if}}\
	<div class="gear-wrap sleeves{{#if cryoinfo.free}} available{{/if}}{{#ifCond current_sleeve.special "hologram"}} hologram{{/ifCond}}">\
		{{#each sleeves}}{{>sleeve}}{{/each}}\
	</div>\
	<div class="gear-wrap equipment">\
		{{#each gearz}}{{>gear}}{{/each}}\
	</div>\
	<div class="gear-wrap mods">\
		{{#each modz}}{{>mod}}{{/each}}\
	</div>\
	{{#each teams}}\
	<div id="{{char_id}}" class="gear-wrap teamgr">\
		<div class="panel low team-panel"><h3 class="block fa team">{{char_name}}</h3></div>\
		{{#each gear}}{{>teamgear}}{{/each}}\
	</div>\
	{{/each}}\
</div>';
tmpstr.skillFull = 
'<div class="topspace"></div><div id="id_{{id}}" data-id="{{id}}" data-owner= {{owner}} data-type="{{type}}" class="full-skill">\
	<div class="panel low">\<h3>{{label}}</h3></div>\
	<div class="panel low">Prerequisite: {{#if prereq}}{{{prereq}}}{{else}}None{{/if}}</div>\
	<div class="panel low">{{description}}</div>\
	{{#unless team}}\
		{{#if aquired}}\
			<div class="panel giveskill">\
				<div class="flat-input sub giveline"><div class="btn fa give" data-cmd="saveTeam">Give To</div></div>\
				<div class="flat-input sub">\
					<div class="inn give">\
						<div class="field-line full">\
							<div class="field-line full has-owner" data-id="28">\
								<input name="character-to" type="text" placeholder="Choose Ego" class="ui-autocomplete-input" autocomplete="off">\
							</div>\
						</div>\
					<div class="field-line btn half cancel" data-cmd="closeOverlay">Cancel</div>\
					<div class="field-line btn half execute" data-cmd="giveAwaySkill">Confirm</div>\
				</div>\
			</div>\
		{{/if}}\
	{{/unless}}\
</div>';
tmpstr.blueprintFull = 
'<div class="topspace"></div><div class="panel ghost">\
	<div data-equip-id="{{id}}"class="gear full rare-{{rarity}} {{toLowerCase skillstr}} {{typestr}} {{toLowerCase name}}{{#if tooMuch}} tooMuch{{/if}}" data-cost="{{total}}">\
		<div class="inner">\
			<div class="info-box top">\
				<div class="wbox name" data-message="{{name}}">{{name}}</div>\
			</div>\
			<div class="picture {{toLowerCase skillstr}} {{toLowerCase typestr}} {{image}}"></div>\
			<div class="info-box">\
				<div class="wbox status">{{#if available}}{{available}} {{/if}}{{single}}</div>\
				<div class="wbox cost">Inventory: <span class="invcount">{{#if count}}{{count}}{{else}}0{{/if}}</span></div>\
				<div class="wbox cost">Cost: {{cost}}{{#if rent}} + <span class="fa rent">{{rent}}</span> + {{/if}}{{#if tax}}<span class="fa tax">{{tax}}</span>{{/if}}</div>\
				{{#if chargable}}\
					<div class="wbox charges">\
						<span>Charges installed:</span>\
						<div class="battery-case charge-{{battery}}">\
							<div class="segment"></div><div class="segment"></div><div class="segment"></div><div class="segment"></div><div class="segment"></div>\
						</div>\
					</div>\
				{{/if}}\
				{{#if batterymod}}\
					<div class="wbox"><span>Battery Slot: 1</span></div>\
				{{/if}}\
				{{#if modcount}}\
					<div class="wbox"><span>Module Slots: {{modcount}}</span></div>\
				{{/if}}\
				{{#if slotuses}}\
					<div class="wbox tol">\
						<span class="label fa Tolerence">REQ:</span>\
						<span class="tolnum">{{capacity}}</span>{{#if plusTol}}+{{plusTol}}{{/if}}<!---->\
						{{#if minusTol}}-{{minusTol}}{{/if}}\
					</div>\
					<div class="wbox tol">\
						<span class="label fa Tolerence">SLOTS:</span><span class="tolslots fa Tolerence">{{slotuses}}{{#if addSlot}}+{{addSlot}}{{/if}}</span>\
					</div>\
				{{/if}}\
				{{#ifCond supplement.length 0}}\
				{{else ifCond supplement.length 1}}\
					<div class="wbox status">Installs into: {{supplement}}</div>\
				{{else}}\
					<div class="wbox status">Installs into: {{supplement}}</div>\
				{{/ifCond}}\
			</div>\
			<div style="clear:both"></div>\
		</div>\
		<div class="inner rules">\
			{{rules}}\
		</div>\
		<div class="mods">\
			{{#each module}}\
				<div class="wbox half">{{name}}<hr/>{{#if available}}{{available}} {{/if}}{{single}}<hr/>{{rules}}</div>\
			{{/each}}<!---->\
			{{#ifCond single "Sleeve"}}\
			{{else}}\
			{{#if hasMod1}}{{#unless module.[0]}}<div class="wbox half">open mod slot</div>{{/unless}}{{/if}}<!---->\
			{{#if hasMod2}}{{#unless module.[1]}}<div class="wbox half">open mod slot</div>{{/unless}}{{/if}}\
			{{/ifCond}}\
		</div>\
	</div>\
</div>';
tmpstr.missionqueue =
'<div class="fixed-head inventory-wrap">\
	<div class="panel top">\
		<div class="actions tabs">\
			<div id="all" class="all btn fa on"><span class="desktext">ACTIVE</span></div>\
			<div id="mine" class="equipped btn fa">MY<span class="desktext">MISSIONS</span></div>\
			<div id="cryo" class="cryo btn fa">COMPLETE</div>\
		</div>\
		<div style="clear:both"></div>\
	</div>\
</div>\
<div class="panel under-fixed ghost missons">\
	<div class="field-group">\
		<div class="mission-line explore"><div class="icon fa"></div><div class="m-name">Station Exploration</div></div>\
		<div class="mission-line hack"><div class="icon fa"></div><div class="m-name">Hack Server</div></div>\
		{{#each asteroids}}{{>astroidLine}}{{/each}}\
		{{#each mods}}{{>modLine}}{{/each}}\
	</div>\
</div>';
tmpstr.astroidLine = 
'<div id="{{id}}" data-qid="{{qid}}" class="mission-line pilot {{difficulty}} progress-{{progress}}{{#if planet}} planet{{/if}}"{{#if planet}} data-planet="{{planet}}"{{/if}}>\
	<div class="icon fa" data-message="Pilot"></div>\
	<div class="m-name">{{#if planet}}{{planet}}: {{/if}}{{name}}</div>\
	<div class="dis">Dis: {{distance}} sectors</div>\
	<div class="details">Details: {{#ifCond unlocked "1"}}{{special}}{{else}}????{{/ifCond}}</div>\
	<div class="details"><span class="captain">{{captain_name}}</span>{{#if crew}}, {{crew}}{{/if}}</div>\
</div>';
tmpstr.modLine = 
'<div data-qid="{{qid}}" class="mission-line {{type}} {{subtype}} progress-{{progress}}">\
	<div class="icon fa" data-message="{{type}}"></div>\
	<div class="m-name">{{name}}</div>\
	<div class="details"><span class="captain">{{captain_name}}</span>{{#if crew}}, {{crew}}{{/if}}</div>\
</div>';
tmpstr.moditem =
'<div id="{{id}}" data-qid="{{qid}}" class="mission-line {{type}} {{difficulty}}">\
	<div class="icon fa" data-message="{{type}}"></div>\
	<div class="m-name">{{name}}</div>\
	{{#if special}}\
		<div class="dis">Dis: {{distance}} sectors</div>\
		<div class="dis">Unlocked: {{#ifCond unlocked "1"}}yes{{else}}no{{/ifCond}}</div>\
		<div class="dis">Details: {{#ifCond unlocked "1"}}{{special}}{{else}}????{{/ifCond}}</div>\
	{{/if}}\
	<div class="details"><span class="captain">{{captain_name}}</span>{{#if crew}}, {{crew}}{{/if}}</div>\
</div>';
tmpstr.destinExplore =
'<div class="topspace"></div><div data-type="explore" data-qid="{{qid}}" class="panel mission-full explore{{#if isCaptain}} isCaptian{{/if}}{{#if admin}} isCaptian admin{{/if}}  progress-{{progress}}">\
	<input type="hidden" name="captain" value="{{captain}}"/>\
	<div class="mission-img"></div>\
	<div class="tick status">{{#ifCond progress "s"}}IN PROGRESS{{else ifCond progress "f"}}FAILED{{else ifCond progress "c"}}COMPLETE{{else}}OPEN{{/ifCond}}</div>\
	<div class="tick objective"><small>Objective:</small>Explore Station</div>\
	<div class="tick level"><small>Area: </small>\
		<select name="ref" class="area-select">\
			<option value="">Select Area</option>\
			{{#each area}}\
				<option value="{{id}}">{{label}}</option>\
			{{/each}}\
		</select>\
	</div>\
	<div class="tick"><small>Captain:</small>{{captain_name}}</div>\
	<div class="tick"><small>Required Specialist:</small>Structural Engineer</div>\
	<div class="tick full"><small>Crew: </small>\
		{{#if crew_list}}\
			<input type="hidden" name="crew" data-value="{{crew}}"/>\
			{{crew_list}}\
		{{else}}\
			<div class="crew-hold auto-hold" data-value="" data-ids="" name="crew">\
				<span class="crew-html auto-html"></span>\
				<textarea class="crew-list auto-list" placeholder="Add Crewmember"></textarea>\
			</div>\
		{{/if}}\
	</div>\
	<div class="tick full description">\
		{{#if admin}}\
			<div class="mission-btn cancel btn next fa half"   data-purpose="cacnel" data-cmd="adminMissionStatus">CANCEL</div>\
			<div class="mission-btn complete btn next fa half" data-purpose="success" data-cmd="adminMissionStatus">SUCCESS</div>\
			<div class="mission-btn cancel btn next fa half" data-purpose="fail" data-cmd="adminMissionStatus">FAIL</div>\
		{{else}}\
			<p><small>Captian Controls: </small></p>\
			<div class="mission-btn begin btn next fa" data-cmd="beginMission">BEGIN MISSION</div>\
			<div class="mission-btn cancel btn next fa half" data-cmd="cancelMission">CANCEL MISSION</div>\
			<div class="mission-btn complete btn next fa half" data-cmd="endMission">COMPLETE MISSION</div>\
			{{#ifCond progress "c"}}\
				<p>Mission Accomplished</p>\
			{{/ifCond}}\
			<p class="not-captain">You are not the captain.</p>\
		{{/if}}\
	</div>\
</div>';
tmpstr.destinHack = 
'<div class="topspace"></div><div data-type="hack" data-qid="{{qid}}" class="panel mission-full hack{{#if isCaptain}} isCaptian{{/if}}{{#if admin}} isCaptian admin{{/if}} progress-{{progress}}">\
	<input type="hidden" name="captain" value="{{captain}}"/>\
	<div class="mission-img"></div>\
	<div class="difficulty {{#if subtype}}{{subtype}}{{else}}c{{/if}}">CLASS-<span>{{#if subtype}}{{subtype}}{{else}}c{{/if}}</span></div>\
	<div class="tick status">{{#ifCond progress "s"}}IN PROGRESS{{else ifCond progress "f"}}FAILED{{else ifCond progress "c"}}COMPLETE{{else}}OPEN{{/ifCond}}</div>\
	<div class="tick objective"><small>Objective:</small>Hack Sever</div>\
	<div class="tick level"><small>Level: </small>\
		{{#ifCond subtype "c"}}Simple\
		{{else ifCond subtype "u"}}Complex\
		{{else ifCond subtype "r"}}Conundrum\
		{{else ifCond servers "1"}}Simple<input type="hidden" name="subtype" value="c">\
		{{else ifCond servers "2"}}\
			<select name="subtype" class="server-select">\
				<option value="c">Simple</option>\
				<option value="u">Complex</option>\
			</select>\
		{{else}}\
			<select name="subtype" class="server-select">\
				<option value="c">Simple</option>\
				<option value="u">Complex</option>\
				<option value="r">Conundrum</option>\
			</select>\
		{{/ifCond}}\
	</div>\
	<div class="tick level"><small>Discipline: </small>\
		{{#if progress}}{{ref_name}}{{else}}\
		<select name="ref">\
			{{#each equip_skills}}\
				<option value="{{id}}">{{short}}</option>\
			{{/each}}\
		</select>\
		{{/if}}\
	</div>\
	<div class="tick"><small>Captain:</small>{{captain_name}}</div>\
	<div class="tick"><small>Required Specialist:</small>Hacking</div>\
	<div class="tick full"><small>Crew: </small>\
		{{#if crew_list}}\
			<input type="hidden" name="crew" data-value="{{crew}}"/>\
			{{crew_list}}\
		{{else}}\
			<div class="crew-hold auto-hold" data-value="" data-ids="" name="crew">\
				<span class="crew-html auto-html"></span>\
				<textarea class="crew-list auto-list" placeholder="Add Crewmember"></textarea>\
			</div>\
		{{/if}}\
	</div>\
	<div class="tick full description">\
		{{#if admin}}\
			<div class="mission-btn cancel btn next fa half"   data-purpose="cacnel" data-cmd="adminMissionStatus">CANCEL</div>\
			<div class="mission-btn complete btn next fa half" data-purpose="success" data-cmd="adminMissionStatus">SUCCESS</div>\
			<div class="mission-btn cancel btn next fa half" data-purpose="fail" data-cmd="adminMissionStatus">FAIL</div>\
		{{else}}\
			<p><small>Captian Controls: </small></p>\
			<div class="mission-btn begin btn next fa" data-cmd="beginMission">BEGIN MISSION</div>\
			<div class="mission-btn cancel btn next fa half" data-cmd="cancelMission">CANCEL MISSION</div>\
			<div class="mission-btn complete btn next fa half" data-cmd="endMission">COMPLETE MISSION</div>\
			{{#ifCond progress "c"}}\
				<p>Mission Accomplished</p>\
			{{/ifCond}}\
			<p class="not-captain">You are not the captain.</p>\
		{{/if}}\
	</div>\
</div>';
tmpstr.destinPilot = 
'<div class="topspace"></div><div data-type="pilot" data-qid="{{qid}}" data-asteroid="{{id}}" class="panel mission-full pilot{{#if isCaptain}} isCaptian{{/if}}{{#if admin}} isCaptian admin{{/if}} progress-{{progress}}{{#if planet}} planet{{/if}}">\
	<input type="hidden" name="captain" value="{{captain}}"/>\
	<input type="hidden" name="ref" value="{{id}}"/>\
	<div class="mission-img"></div>\
	<div class="difficulty {{difficulty}}">CLASS-<span>{{difficulty}}</span></div>\
	<div class="tick status">{{#ifCond progress "s"}}IN PROGRESS{{else ifCond progress "f"}}FAILED{{else ifCond progress "c"}}COMPLETE{{else}}OPEN{{/ifCond}}</div>\
	<div class="tick objective"><small>Objective:</small>Pilot to {{#if planet}}{{planet}}: {{/if}}{{name}}</div>\
	<div class="tick dist"><small>Distace:</small>{{distance}} sectors</div>\
	<div class="tick"><small>Captain:</small>{{captain_name}}</div>\
	<div class="tick"><small>Required Specialist:</small>Pilot</div>\
	<div class="tick full"><small>Crew: </small>\
		{{#if crew_list}}\
			<input type="hidden" name="crew" data-value="{{crew}}"/>\
			<div class="crew-hold auto-hold">\
			{{#each crew_list}}\
				<span class="auto-content"><span class="txt">{{.}}</span></span>\
			{{/each}}\
			</div>\
		{{else}}\
			<div class="crew-hold" data-value="" name="crew" data-ids="">\
				<span class="crew-html auto-html"></span>\
				<textarea class="crew-list auto-list" placeholder="Add Crewmember"></textarea>\
			</div>\
		{{/if}}\
	</div>\
	<div class="tick full description">\
		{{#ifCond unlocked "1"}}\
			<p><small>Condition: </small></p><p>{{special}}<p>\
		{{else}}\
			<p>Condition: ???</p>{{#unless admin}}<div class="long-range-puzzle btn next fa">{{#if planet}}SCAN AREA{{else}}SCAN SURFACE{{/if}}</div>{{/unless}}\
		{{/ifCond}}\
	</div>\
	<div class="tick full description controls">\
		{{#if admin}}\
			<div class="mission-btn cancel btn next fa half"   data-purpose="scan" data-cmd="adminMissionStatus">SCAN</div>\
			<div class="mission-btn cancel btn next fa half"   data-purpose="cancel" data-cmd="adminMissionStatus">CANCEL</div>\
			<div class="mission-btn complete btn next fa half" data-purpose="success" data-cmd="adminMissionStatus">SUCCESS</div>\
			<div class="mission-btn cancel btn next fa half" data-purpose="fail" data-cmd="adminMissionStatus">FAIL</div>\
		{{else}}\
			<p><small>Captian Controls: </small></p>\
			<div class="mission-btn begin btn next fa" data-cmd="beginMission">BEGIN MISSION</div>\
			<div class="mission-btn cancel btn next fa half" data-cmd="cancelMission">CANCEL MISSION</div>\
			<div class="mission-btn complete btn next fa half" data-cmd="endMission">COMPLETE MISSION</div>\
			{{#ifCond progress "c"}}\
				<p>Mission Accomplished</p>\
			{{/ifCond}}\
			<p class="not-captain">You are not the captain.</p>\
		{{/if}}\
	</div>\
</div>';
tmpstr.destinPlanet = 
'<div class="topspace"></div><div data-type="pilot-planet" data-qid="{{qid}}" data-planet="{{id}}" class="panel mission-full pilot-planet{{#if isCaptain}} isCaptian{{/if}}{{#if admin}} isCaptian admin{{/if}} progress-{{progress}}">\
	<input type="hidden" name="captain" value="{{captain}}"/>\
	<input type="hidden" name="ref" value="{{id}}"/>\
	<div class="mission-img"></div>\
	<div class="difficulty {{difficulty}}">CLASS-<span>{{difficulty}}</span></div>\
	<div class="tick status">{{#ifCond progress "s"}}IN PROGRESS{{else ifCond progress "f"}}FAILED{{else ifCond progress "c"}}COMPLETE{{else}}OPEN{{/ifCond}}</div>\
	<div class="tick objective"><small>Objective:</small>Explore {{name}}</div>\
	<div class="tick dist"><small>Distace:</small>{{distance}} sectors</div>\
	<div class="tick"><small>Captain:</small>{{captain_name}}</div>\
	<div class="tick"><small>Required Specialist:</small>Pilot</div>\
	<div class="tick full"><small>Crew: </small>\
		{{#if crew_list}}\
			<input type="hidden" name="crew" data-value="{{crew}}"/>\
			<div class="crew-hold auto-hold">\
			{{#each crew_list}}\
				<span class="auto-content"><span class="txt">{{.}}</span></span>\
			{{/each}}\
			</div>\
		{{else}}\
			<div class="crew-hold" data-value="" name="crew" data-ids="">\
				<span class="crew-html auto-html"></span>\
				<textarea class="crew-list auto-list" placeholder="Add Crewmember"></textarea>\
			</div>\
		{{/if}}\
	</div>\
	<div class="tick full description">\
		{{#ifCond unlocked "1"}}\
			<p><small>Condition: </small></p><p>{{special}}<p>\
		{{else}}\
			<p>Condition: ???</p>{{#unless admin}}<div class="long-range-puzzle btn next fa">SCAN AREA</div>{{/unless}}\
		{{/ifCond}}\
	</div>\
	<div class="tick full description controls">\
		{{#if admin}}\
			<div class="mission-btn cancel btn next fa half"   data-purpose="scan" data-cmd="adminMissionStatus">SCAN</div>\
			<div class="mission-btn cancel btn next fa half"   data-purpose="cancel" data-cmd="adminMissionStatus">CANCEL</div>\
			<div class="mission-btn complete btn next fa half" data-purpose="success" data-cmd="adminMissionStatus">SUCCESS</div>\
			<div class="mission-btn cancel btn next fa half" data-purpose="fail" data-cmd="adminMissionStatus">FAIL</div>\
		{{else}}\
			<p><small>Captian Controls: </small></p>\
			<div class="mission-btn begin btn next fa" data-cmd="beginMission">BEGIN MISSION</div>\
			<div class="mission-btn cancel btn next fa half" data-cmd="cancelMission">CANCEL MISSION</div>\
			<div class="mission-btn complete btn next fa half" data-cmd="endMission">COMPLETE MISSION</div>\
			{{#ifCond progress "c"}}\
				<p>Mission Accomplished</p>\
			{{/ifCond}}\
			<p class="not-captain">You are not the captain.</p>\
		{{/if}}\
	</div>\
</div>';
tmpstr.adminAsteroid =
'<div class="fixed-head"><div class="panel top leave-on">\
		<div class="topline"><h3 class="desktext">All Asteroids</h3></div>\
		<div class="actions">\
			<div id="buildAsteroid" data-cmd="buildAsteroid" data-message="Create Asteroid" class="btn large fa plus energy"></div>\
			<div id="buildPlanet" data-cmd="buildPlanet" data-message="Create Planet Mission" class="btn large fa plus planet"></div>\
			<div id="updateAsteroids" data-cmd="updateAsteroids" data-message="Update Missions" class="btn large fa save"></div>\
		</div>\
		<div style="clear:both"></div>\
	</div>\
</div>\
<div class="panel under-fixed ghost">\
	<div class="actions filter searcher">\
			<div class="btn large fa search"></div>\
			<input id="searchmissions" type="text" placeholder="ENTER SEARCH">\
		</div>\
</div>\
<div class="panel">\
	<div class="asteroidbank">\
	{{#each asteroids}}\
		{{>asteroidsm}}\
	{{/each}}\
	<div>\
</div>';
tmpstr.longRangeScanner =
'<div class="topspace"></div><div id="{{id}}" class="panel scan">\
	<h3>Seek Station Management to continue</h3>\
	<input class="scan-pin" type="password" placeholder="Passcode">\
	<div class="btn fa save" data-cmd="engageScanner">Engage Scanners</div>\
</div>';
tmpstr.endmission =
'<div class="topspace"></div><div id="{{id}}" data-type="{{type}}" class="panel endmission">\
	<h3>Seek Station Management to continue</h3>\
	<input class="mission-pin" type="password" placeholder="Passcode">\
	<div class="btn fa half yes" data-cmd="successMission">SUCCESS</div>\
	<div class="btn fa half no" data-cmd="failMission">FAIL</div>\
</div>';
tmpstr.autoUserList =
'{{#each .}}\
	<span class="auto-content"><span class="ico"></span><span class="txt" data-val="{{.}}">{{.}}</span><span class="removeFromList">x</span></span>\
{{/each}}';
tmpstr.autoUserList2 =
'{{#each .}}\
	<span class="auto-content{{#if on}} on{{/if}}"><span class="ico"></span><span class="txt" data-user="{{user_id}}" data-val="{{char_id}}">{{char_name}}</span><span class="removeFromList">x</span></span>\
{{/each}}';
tmpstr.asteroidsm = 
'<div id="{{id}}" class="asteroid btn{{#ifCond status "i"}}{{else}} live{{/ifCond}}{{#if planet}} planet{{/if}}">\
	<div class="edit fa edit-asteroid" data-message="Edit"></div>\
	<div class="mission-type {{difficulty}} fa"></div>\
	<div class="a-class {{difficulty}}">{{difficulty}}</div>\
	<h4>{{name}}</h4><hr />\
	<p>Distance: {{distance}} sectors, <i>{{short}}</i></p>\
	{{#if special}}<p><strong>Locked: {{special}}</strong></p>{{/if}}\
</div>';
tmpstr.createAsteroid =
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Asteroids</h3>\
	<form id="newAsteroid" name="newAsteroid">\
        <div class="field-group">\
            <div class="insider">\
				<div class="field-line">\
                    <label class="label">Name:</label>\
                    <div class="value input">\
                        <input class="req" name="name" placeholder="Asteroid name" type="text" value="{{name}}">\
                    </div>\
                </div>\
                 <div class="field-line">\
                    <label class="label">Distance:</label>\
                    <div class="value input">\
                        <input class="req" type="number" min="1" name="distance" value="1" value="{{distance}}">\
                    </div>\
                </div>\
                <div class="field-line">\
                	<label class="label">Difficulty:</label>\
                	<div class="value input">\
                		<select name="difficulty">\
                			<option value="e"{{#ifCond difficulty "e"}} selected="selected"{{/ifCond}}">Easy</option>\
                			<option value="m"{{#ifCond difficulty "m"}} selected="selected"{{/ifCond}}>Medium</option>\
                			<option value="h"{{#ifCond difficulty "h"}} selected="selected"{{/ifCond}}>Hard</option>\
                		</select>\
					</div>\
				</div>\
				 <div class="field-line">\
                    <label class="label">Status:</label>\
                    <div class="value input">\
                		<select name="status">\
                			<option value="a"{{#ifCond progress "a"}} selected="selected"{{/ifCond}}>Active</option>\
                			<option value="u"{{#ifCond progress "u"}} selected="selected"{{/ifCond}}>Active Unlocked</option>\
                			<option value="i"{{#ifCond progress "i"}} selected="selected"{{/ifCond}}>Inactive</option>\
                			<option value="c"{{#ifCond progress "c"}} selected="selected"{{/ifCond}}>Complete</option>\
                		</select>\
					</div>\
                </div>\
                <div class="field-line">\
                    <label class="label">Description:</label>\
                    <div class="value input">\
                        <textarea class="req" name="special" placeholder="Long description only revealed on long range scanning.">{{special}}</textarea>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class="flat-input sub">\
        	<div class="btn fa save" data-cmd="saveAsteroid">{{#if id}}Edit{{else}}Create{{/if}} Asteroid</div>\
        </div>\
	</form>\
</div>';

tmpstr.createPlanet =
'<div class="topspace"></div><div class="panel">\
	<h3 class="block">Explore Planet</h3>\
	<form id="newPlanet" name="newPlanet">\
        <div class="field-group">\
            <div class="insider">\
				<div class="field-line">\
                    <label class="label">Planet:</label>\
                    <div class="value input">\
                		<select name="planet">\
                			<option value="The Hollow"{{#ifCond planet "The Hollow"}} selected="selected"{{/ifCond}}>The Hollow</option>\
                		</select>\
					</div>\
                </div>\
				<div class="field-line">\
                    <label class="label">Name:</label>\
                    <div class="value input">\
                        <input class="req" name="name" placeholder="Area Description" type="text" value="{{name}}">\
                    </div>\
                </div>\
                 <div class="field-line">\
                    <label class="label">Distance:</label>\
                    <div class="value input">\
                        <input class="req" type="number" min="1" name="distance" value="{{distance}}">\
                    </div>\
                </div>\
                <div class="field-line">\
                	<label class="label">Difficulty:</label>\
                	<div class="value input">\
                		<select name="difficulty">\
                			<option value="e"{{#ifCond difficulty "e"}} selected="selected"{{/ifCond}}">Easy</option>\
                			<option value="m"{{#ifCond difficulty "m"}} selected="selected"{{/ifCond}}>Medium</option>\
                			<option value="h"{{#ifCond difficulty "h"}} selected="selected"{{/ifCond}}>Hard</option>\
                		</select>\
					</div>\
				</div>\
				 <div class="field-line">\
                    <label class="label">Status:</label>\
                    <div class="value input">\
                		<select name="status">\
                			<option value="a"{{#ifCond progress "a"}} selected="selected"{{/ifCond}}>Active</option>\
                			<option value="u"{{#ifCond progress "u"}} selected="selected"{{/ifCond}}>Active Unlocked</option>\
                			<option value="i"{{#ifCond progress "i"}} selected="selected"{{/ifCond}}>Inactive</option>\
                			<option value="c"{{#ifCond progress "c"}} selected="selected"{{/ifCond}}>Complete</option>\
                		</select>\
					</div>\
                </div>\
                <div class="field-line">\
                    <label class="label">Description:</label>\
                    <div class="value input">\
                        <textarea class="req" name="special" placeholder="Long description only revealed on long range scanning.">{{special}}</textarea>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class="flat-input sub">\
        	<div class="btn fa save" data-cmd="savePlanetMission">{{#if id}}Edit{{else}}Create{{/if}} Planet Mission</div>\
        </div>\
	</form>\
</div>';

var parts = ['listbox','selectbox','skillBox','skillFullBox','select','rule','ruleBank','relbox','marketblue','gear','mod','sleeve','marketoverlay','blueprint','marketitem','asteroidsm','astroidLine','modLine','moditem','autoUserList','autoUserList2','giveBox','teamgear'];
function single(name){
	var last = name.substring(name.length-1)
	return last=='s'? name.substring(0,name.length-1) : name;
}

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	if(v1+'' === v2+'' || (this[v1]===v2 && typeof v2 != 'undefined')) {
		return options.fn(this);
	}
	return options.inverse(this);
});
Handlebars.registerHelper('string', function(v1, options) {
	return JSON.stringify(v1);
});
Handlebars.registerHelper('toLowerCase', function(str) {
	str = str? str : '';
  return str.toLowerCase();
});
buildTemplates();

function updateTemplate(t){
	tmpstr[t] = tmpstr[t].replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" );
	tmpstr[t] = tmpstr[t].replace( new RegExp( "\>[\n\t ]+\{{", "g" ) , ">{{" );
	tmpstr[t] = tmpstr[t].replace( new RegExp( "}}[\n\t ]+\<" , "g" ) , "}}<" );
	tmp[t] = Handlebars.compile(tmpstr[t]);
}
function buildTemplates(){
	_.each(_.keys(tmpstr),function(t){
		tmpstr[t] = tmpstr[t].replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" );
		tmpstr[t] = tmpstr[t].replace( new RegExp( "\>[\n\t ]+\{{", "g" ) , ">{{" );
		tmpstr[t] = tmpstr[t].replace( new RegExp( "}}[\n\t ]+\<" , "g" ) , "}}<" );
	});
	_.each(parts,function(p){
		Handlebars.registerPartial(p,tmpstr[p]);
	});
	_.each(_.keys(tmpstr),function(t){
		tmp[t] = Handlebars.compile(tmpstr[t]);
	});
	
}