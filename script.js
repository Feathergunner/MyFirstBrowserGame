
var ver;
var vertext;
var xp;
var gold;
var dia;
var maxenergy;
var energy;

var curMissStart;
var curMissObj;
var curMissAim;
var missionTimeRange;
var missionAimRange;
var curMissTimer;

var occ;
/*
	0 = none
	1 = arbeit
	2 = lernen
	3 = training
	4 = schlafen
*/
var occ_startTime;
var occ_dur;

var nextocc;
var nextdur;

var skey;

/*
	Auswahl und Durchfuehrung von Aktivitaeten
*/

function chooseNextOcc(newocc)
{
	nextocc = newocc;
	if (occ===0){
		var durs = [0, 10, 30, 60, 120, 240, 480];
		var encosts   = [0];
		var engets    = [0];
		var goldcosts = [0];
		var goldgets  = [0];
		var xpgets    = [0];
		
		for (i=1; i<7; i++){
			if
			 (nextocc===1){
				encosts[i]  = compWork_cost_EN(durs[i]);
				goldgets[i] = compWork_gain_GO(durs[i], xp);
				
				document.getElementById("lab_setocc_eff_"+i).innerHTML = goldgets[i]+" Gold";
				document.getElementById("lab_setocc_cost_"+i).innerHTML = encosts[i]+" Energie";
			}
			
			if (nextocc===2){
				xpgets[i]    = compLearn_gain_XP(durs[i]);
				encosts[i]   = compLearn_cost_EN(durs[i]);
				goldcosts[i] = compLearn_cost_GO(xp, xpgets[i]);
				
				document.getElementById("lab_setocc_eff_"+i).innerHTML = xpgets[i]+" Erfahrung";
				document.getElementById("lab_setocc_cost_"+i).innerHTML = goldcosts[i]+" Gold, "+encosts[i]+" Energie";
			}
			
			if (nextocc===3){
				engets[i]    = compTrain_gain_MEN(durs[i]);
				goldcosts[i] = compTrain_cost_GO(maxenergy, engets[i]);
				encosts[i]   = compTrain_cost_EN(maxenergy, engets[i]);
				
				document.getElementById("lab_setocc_eff_"+i).innerHTML = engets[i]+" max. Energie";
				document.getElementById("lab_setocc_cost_"+i).innerHTML = goldcosts[i]+" Gold, "+encosts[i]+" Energie";
			}
			
			if (nextocc===4){
				engets[i] = compSleep_gain_EN(durs[i]);
				
				document.getElementById("lab_setocc_eff_"+i).innerHTML = engets[i]+" Energie";
				document.getElementById("lab_setocc_cost_"+i).innerHTML = "0";
			}
		}
		
		document.getElementById("r1").style.display="block";
		document.getElementById("r2").style.display="table";
		document.getElementById("r3").style.display="none";
		
	}else{
		var rest = myround(occ_dur-((time-occ_startTime)/60000),1);
		alert("Du bist bereits beschaeftigt: "+getOccString(occ)+", noch "+rest+" Minuten!");
	}
}

function setOccDur(newdur)
{
	nextdur=newdur;
	s = startOcc();
	if(s){
		updateLabel();
	
		document.getElementById("r1").style.display="none";
		document.getElementById("r2").style.display="none";
		document.getElementById("r3").style.display="none";
	
		document.getElementById("l2").style.display="none";
		document.getElementById("l3").style.display="table";
		document.getElementById("pan_cur_occ").innerHTML=getOccString(occ);
		var worktimer = setInterval(function() {startTimer()},1000);
	}
	//var testtimer = setInterval(function() {alert("timetest")},1000);
}

function startOcc()
{
	var ret = false;
	if (occ===0){
		if (nextocc===1){
			encost = compWork_cost_EN(nextdur);
			if (energy >= encost){
				var r = confirm("Das kostet dich "+encost+" Energie. Start?");
				if (r){
					occ = 1;
					occ_dur=nextdur;
					occ_startTime = Date.parse(new Date());
					energy-=encost;
					alert("Du arbeitest nun fuer "+occ_dur+" Minuten!");
					ret = true;
				}
			}else{
				alert("Nicht ausreichend Energie uebrig!");
			}
		}
		
		if (nextocc===2){
			var xpget = compLearn_gain_XP(nextdur);
			encost    = compLearn_cost_EN(nextdur);
			goldcost  = compLearn_cost_GO(xp, xpget);
			if (energy >= encost && gold >= goldcost){
				var r = confirm("Das kostet "+encost+" Energie und "+goldcost+" Gold. Start?");
				if(r){
					occ = 2;
					occ_dur=nextdur;
					occ_startTime = Date.parse(new Date());
					energy -=encost;
					gold -= goldcost;
					alert("Du Lernst nun fuer "+occ_dur+" Minuten!");
					ret = true;
				}
			}else{
				if (energy < encost) alert("Nicht ausreichend Energie!");
				if (gold < goldcost) alert("Nicht ausreichend Gold!");
			}
		}
		
		if (nextocc===3){
			var enget = compTrain_gain_MEN(nextdur);
			goldcost  = compTrain_cost_GO(maxenergy, enget);
			encost    = compTrain_cost_EN(maxenergy, enget);
			if (energy >= encost && gold >= goldcost){
				var r = confirm("Das kostet "+encost+" Energie und "+goldcost+" Gold. Start?");
				if(r){
					occ = 3;
					occ_dur=nextdur;
					occ_startTime = Date.parse(new Date());
					energy -=encost;
					gold -= goldcost;
					alert("Du Trainierst nun fuer "+occ_dur+" Minuten!");
					ret = true;
				}
			}else{
				if (energy < encost) alert("Nicht ausreichend Energie!");
				if (gold < goldcost) alert("Nicht ausreichend Gold!");
			}
		}
		if (nextocc===4){
			var r = confirm("Du schlaefst nun "+nextdur+" Minuten. Machen?");
			if (r){
				occ = 4;
				occ_dur=nextdur;
				occ_startTime = Date.parse(new Date());
				alert("Du schlaefst nun fuer "+occ_dur+" Minuten!");
				ret = true;
			}
		}
		if (ret){
			var fintime = Date.parse(new Date())+occ_dur*60*1000;
			document.getElementById("title").innerHTML="MFBG - "+getOccString(occ)+" bis "+getTimeString(fintime)+" Uhr";
		}
	}
	return ret;
}

function startTimer()
{
	//alert(timer");
	if (occ>0){
		var rest = occ_dur-myround((Date.parse(new Date())-occ_startTime)/60000,1);
		if (rest>1) document.getElementById("pan_cur_rest").innerHTML = rest.toFixed(1)+" Minuten";
		else{
			rest = (occ_dur*60)-myround((Date.parse(new Date())-occ_startTime)/1000,0);
			if (rest>0) document.getElementById("pan_cur_rest").innerHTML = rest+" Sekunden";
			else finishJob();
		}
	}
}

function finishJob()
{
	var finstr;
	if (occ===1)
	{
		goldget = compWork_gain_GO(occ_dur, xp);
		gold+=goldget;
		finstr = "Fertig! Du erhaelst "+goldget+" Gold.";
	}
	if (occ===2)
	{
		xpget = compLearn_gain_XP(occ_dur);
		xp += xpget;
		finstr = "Fertig! Du erhaelst "+xpget+" Erfahrung.";
	}
	if (occ===3)
	{
		enget = compTrain_gain_MEN(occ_dur);
		maxenergy += enget;
		finstr = "Fertig! Deine maximale Ernergie erhoeht sich um "+enget+".";
	}
	if (occ===4)
	{
		enget = compSleep_gain_EN(occ_dur);
		if (energy+enget > maxenergy) enget = maxenergy-energy;
		energy += enget;
		finstr = "Fertig! Du regenerierst "+enget+" Energie.";
	}
	occ = 0;
	occ_dur = 0;
	occ_startTime = Date.parse(new Date(0));
	nextocc=0;
	
	document.getElementById("r3").style.display="inline";
	
	document.getElementById("l2").style.display="table";
	document.getElementById("l3").style.display="none";
	
	document.getElementById("title").innerHTML="MyFirstBrowserGame";
	
	updateLabel();
	alert(finstr);
}

/*
	Missionen
*/

function createMission()
{
	clearTimeout(curMissTimer);
	var randTimeOffset = 30+Math.floor(30*Math.random());
	var d= Date.parse(new Date());
	curMissStart = d+(randTimeOffset*60*1000);
	curMissObj = "Energie";
	curMissAim = 10+Math.floor((maxenergy-20)*Math.random());
	
	updateMissionLabel()
}

function criticalMissionTime()
{
	document.getElementById("but_Miss_exec").style.display="inline";
	itv = setTimeout(function() {createMission();}, missionTimeRange*60*1000);
}

function executeMission()
{
	if (energy>=curMissAim && energy <= curMissAim+missionAimRange){
		dia+=1;
		alert("Mission erfolgreich erfuellt. Du erhaelst 1 Diamanten!");
	}else{
		alert("Missionsbedingungen wurden nicht erfuellt!");
	}
	updateLabel();
	document.getElementById("but_Miss_exec").style.display="none";
}

/*
	Laden und Speichern
*/

function load_FromCookie()
{
	var c = document.cookie;
	if (c.substring(0,5)==="Data="){
		var cdata = c.substring(5,c.length);
		load(decode(cdata));
	}else{
		load(c);
		var d = new Date(0);
		document.cookie = "reset; expires="+d.toGMTString();
		saveToCookie();
	}
}

function saveToCookie()
{
	var data = "Data="+encode(createSaveString());
	
	var expire = new Date(getDatePlus(1000*60*60*24*365));
	data +="; expires="+expire.toGMTString();
	//alert(data);
	document.cookie=data;
	alert("Spielstad gespeichert!");
}

function load(data)
{
	var data = data;
	//alert(data);
	getDataFromString(data);
	
	updateLabel();
	updateMissionLabel();
	alert("Spielstand geladen!");
}

function exportData()
{
	alert(encode(createSaveString()));
}

function importData()
{
	var cdata = prompt("Exportierten Datenstring hier eingeben:");
	load(decode(cdata));
}

function createSaveString()
{
	var data = ver+"-"+gold+"-"+xp+"-"+dia+"-"+energy+"-"+maxenergy;
	data = data+"-"+occ+"-"+occ_dur+"-"+occ_startTime;
	data = data+"-"+curMissStart+"-"+curMissAim;
	return data;
}

function getDataFromString(str)
{
	var datas = str.split("-");
	gold   = parseInt(datas[1]);
	xp     = parseInt(datas[2]);
	dia    = parseInt(datas[3]);
	energy = parseInt(datas[4]);
	maxenergy = parseInt(datas[5]);
	occ    = parseInt(datas[6]);
	occ_dur = parseInt(datas[7]);
	occ_startTime = parseInt(datas[8]);
	
	var version = datas[1].split(".");
	var main = parseInt(version[0]);
	var mile = parseInt(version[1]);
	var step = parseInt(version[2]);
	
	if(occ>0){
		document.getElementById("r1").style.display="none";
		document.getElementById("r2").style.display="none";
		document.getElementById("r3").style.display="none";
	
		document.getElementById("l2").style.display="none";
		document.getElementById("l3").style.display="table";
		document.getElementById("pan_cur_occ").innerHTML=getOccString(occ);
		var worktimer = setInterval(function() {startTimer()},1000);
		var fintime = occ_startTime+occ_dur*60*1000;
		document.getElementById("title").innerHTML="MFBG - "+getOccString(occ)+" bis "+getTimeString(fintime)+" Uhr";
	}else{
		document.getElementById("r1").style.display="none";
		document.getElementById("r2").style.display="none";
		document.getElementById("r3").style.display="none";
		
		document.getElementById("l2").style.display="table";
		document.getElementById("l3").style.display="none";
	}
	
	if (main===0 && mile <=1 && step<6){
		createMission();
	}else{
		curMissStart = parseInt(datas[9]);
		if (curMissStart - Date.parse(new Date()) < 5000){
			createMission();
		}else{
		curMissAim = parseInt(datas[10]);
		curMissObj = "Energie";
		}
	}
}

/*
	Verschluesselung mit vereinfachtem CBC-Mode
	sodass Cypherstring in Cookie gespeichert werden kann
*/

function encode(data)
{
	var rkey;
	var nextc;
	var cipher = "";
	
		
	for (var i=0;i<data.length;i++){
		if (i===0){
			rkey = ((data.charCodeAt(i)-32)+skey)%91;
		}else{
			rkey = ((data.charCodeAt(i)-32)+rkey)%91;
		}
		nextc = rkey+32;
		if (nextc===32) nextc = 123;
		if (nextc===44) nextc = 124;
		if (nextc===59) nextc = 125;
		if (nextc===61) nextc = 126;
		cipher = cipher + String.fromCharCode(nextc);
	}
	return cipher;
}
	
function decode(cypher)
{
	var data = "";
	var curc;
	
	for (var i=cypher.length-1; i>=0; i--){
		curc = cypher.charCodeAt(i);
		prefc = cypher.charCodeAt(i-1);
		if (curc===123) curc = 32;
		if (curc===124) curc = 44;
		if (curc===125) curc = 59;
		if (curc===126) curc = 61;
		if (prefc===123) prefc = 32;
		if (prefc===124) prefc = 44;
		if (prefc===125) prefc = 59;
		if (prefc===126) prefc = 61;
		if (i>0){
			m = (curc-prefc+91)%91+32;
		}else{
			m = (curc-skey+59)%91+32;
		}
		data = String.fromCharCode(m)+data;
	}
	return data;
}

/*
	Berechnen von Kosten & Nutzen der Aktivitaeten
*/

function compWork_cost_EN(dur)
{
	return Math.ceil(Math.pow(dur*1.2,0.98));
}

function compLearn_cost_EN(dur)
{
	return Math.floor(1+Math.pow(dur/2,0.9));
}

function compLearn_cost_GO(curxp, xpget)
{
	//return Math.floor(dur+((dur-1)*Math.pow(curxp,1.5)+Math.pow(dur,1.2)/2)/20);
	var xpg = curxp+xpget;
	return Math.ceil((Math.pow(xpg,1.5)+xpg-Math.pow(curxp,1.5)-curxp)/5);
}

function compTrain_cost_EN(maxen, newen)
{
	return Math.floor(5*(Math.pow(maxen-99+newen,0.95)-Math.pow(maxen-99,0.95)));
}

function compTrain_cost_GO(maxen, newen)
{
	//return Math.floor(newen*((maxen-98)+(newen/2))/3);
	var gesen = maxen-99+newen;
	maxen -= 99;
	return Math.ceil((Math.pow(gesen,1.9)+gesen-Math.pow(maxen,1.9)-maxen)/3);
}

function compWork_gain_GO(dur, curxp)
{
	return Math.floor(Math.pow(dur*0.9,1.05)*(1+curxp/240));
}

function compLearn_gain_XP(dur)
{
	return Math.floor(dur*5/6);
}

function compTrain_gain_MEN(dur)
{
	return Math.floor(Math.pow(dur/60*7,1.05));
}

function compSleep_gain_EN(dur)
{
	return Math.floor(Math.pow(dur/6*5,1.02));
}

/*
	Hilfsfunktionen
*/

function init()
{
	ver = "0.1.7";
	vertext = "Export & Import International!";
	xp = 0;
	gold = 0;
	dia = 0;
	maxenergy=100;
	energy = maxenergy;
	occ = 0;
	nextocc = 0;
	occ_dur = 0;
	occ_startTime = Date.parse(new Date(0));
	
	skey = 42;
	
	missionTimeRange = 10;
	missionAimRange = 10;
	createMission();
	
	updateLabel();
	
	document.getElementById("label_version").innerHTML= "Ver. "+ver+" "+vertext;
	
	document.getElementById("r1").style.display="none";
	document.getElementById("r2").style.display="none";
	
	document.getElementById("l3").style.display="none";
}

function getOccString(occ)
{
	if (occ===0)
		return "none";
	if (occ===1)
		return "Arbeit";
	if (occ===2)
		return "Lernen";
	if (occ===3)
		return "Training";
	if (occ===4)
		return "Schlafen";
}

function updateLabel()
{
	document.getElementById("pan_xp").innerHTML = xp;
	document.getElementById("pan_gold").innerHTML = gold;
	document.getElementById("pan_dia").innerHTML = dia;
	document.getElementById("pan_en").innerHTML = energy + "/" + maxenergy;
}

function updateMissionLabel()
{
	var timeOffset = curMissStart - Date.parse(new Date());
	var startTime = getTimeString(curMissStart);
	var endTime = getTimeString(curMissStart+missionTimeRange*60*1000);
	document.getElementById("pan_cur_miss_time").innerHTML = startTime+" - "+endTime;
	document.getElementById("pan_cur_miss_obj").innerHTML = curMissObj+" zwischen: "+curMissAim+" - "+(curMissAim+missionAimRange)+".";
	document.getElementById("but_Miss_exec").style.display="none";
	curMissTimer = setTimeout(function() {criticalMissionTime();}, timeOffset);
}

function getTimeString(timeInMS)
{
	var d=new Date(timeInMS);
	var hours = d.getHours().toString();
	var minutes = d.getMinutes().toString();
	if (hours.length === 1) hours = "0"+hours;
	if (minutes.length === 1) minutes = "0"+minutes;
	return hours+":"+minutes;
}

function myround(a,b)
{
	/*
	Old:
	if (b===0) return Math.floor(a);
	else{
		var t1 = Math.pow(10,b);
		var t2 = Math.floor(a*t1);
		return (t2/t1);
	}
	*/
	return a.toFixed(b);
}

function getDatePlus(plus)
{
	var time=Date.parse(new Date())+plus;
	return time;
}