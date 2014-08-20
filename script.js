
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
				encosts[i]=Math.ceil(Math.pow(durs[i]*1.2,0.98));
				goldgets[i]=Math.floor(Math.pow(durs[i]*0.9,1.05)*(1+xp/240));
				
				document.getElementById("lab_setocc_eff_"+i).innerHTML = goldgets[i]+" Gold";
				document.getElementById("lab_setocc_cost_"+i).innerHTML = encosts[i]+" Energie";
			}
			
			if (nextocc===2){
				encosts[i]=Math.floor(1+Math.pow(durs[i]/2.5,0.9));
				goldcosts[i]=Math.floor(durs[i]+((durs[i]-1)*Math.pow(xp,1.2)+Math.pow(durs[i],2)/2)/20);
				xpgets[i]=Math.floor(durs[i]*5/6);
				
				document.getElementById("lab_setocc_eff_"+i).innerHTML = xpgets[i]+" Erfahrung";
				document.getElementById("lab_setocc_cost_"+i).innerHTML = goldcosts[i]+" Gold, "+encosts[i]+" Energie";
			}
			
			if (nextocc===3){
				engets[i]=Math.floor(Math.pow(durs[i]/60*7,1.05));
				goldcosts[i]=Math.floor(engets[i]*((maxenergy-98)+(engets[i]/2))/3);
				//encosts[i]=Math.floor((engets[i]/2)*((maxenergy-80)+(engets[i]/2)));
				encosts[i]=Math.floor(5*(Math.pow(maxenergy-99+engets[i],0.95)-Math.pow(maxenergy-99,0.95)));
				
				document.getElementById("lab_setocc_eff_"+i).innerHTML = engets[i]+" max. Energie";
				document.getElementById("lab_setocc_cost_"+i).innerHTML = goldcosts[i]+" Gold, "+encosts[i]+" Energie";
			}
			
			if (nextocc===4){
				engets[i]=Math.floor(Math.pow(durs[i]/6*5,1.02));
				
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
	if (occ===0){
		if (nextocc===1){
			encost = Math.ceil(Math.pow(nextdur*1.2,0.98));
			if (energy >= encost){
				var r = confirm("Das kostet dich "+encost+" Energie. Start?");
				if (r){
					occ = 1;
					occ_dur=nextdur;
					occ_startTime = Date.parse(new Date());
					energy-=encost;
					alert("Du arbeitest nun fuer "+occ_dur+" Minuten!");
					return true;
				}
			}else{
				alert("Nicht ausreichend Energie uebrig!");
			}
		}
		
		if (nextocc===2){
			encost   = Math.floor(1+Math.pow(nextdur/2.5,0.9));
			goldcost = Math.floor(nextdur+((nextdur-1)*Math.pow(xp,1.2)+Math.pow(nextdur,2)/2)/20);
			if (energy >= encost && gold >= goldcost){
				var r = confirm("Das kostet "+encost+" Energie und "+goldcost+" Gold. Start?");
				if(r){
					occ = 2;
					occ_dur=nextdur;
					occ_startTime = Date.parse(new Date());
					energy -=encost;
					gold -= goldcost;
					alert("Du Lernst nun fuer "+occ_dur+" Minuten!");
					return true;
				}
			}else{
				if (energy < encost) alert("Nicht ausreichend Energie!");
				if (gold < goldcost) alert("Nicht ausreichend Gold!");
			}
		}
		
		if (nextocc===3){
			var enget=Math.floor(Math.pow(nextdur/60*7,1.05));
			goldcost=Math.floor(enget*((maxenergy-98)+(enget/2))/3);
			encost=Math.floor(5*(Math.pow(maxenergy-99+enget,0.95)-Math.pow(maxenergy-99,0.95)));
			if (energy >= encost && gold >= goldcost){
				var r = confirm("Das kostet "+encost+" Energie und "+goldcost+" Gold. Start?");
				if(r){
					occ = 3;
					occ_dur=nextdur;
					occ_startTime = Date.parse(new Date());
					energy -=encost;
					gold -= goldcost;
					alert("Du Trainierst nun fuer "+occ_dur+" Minuten!");
					return true;
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
				return true;
			}
		}
	}
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
		goldget=Math.floor(Math.pow(occ_dur*0.9,1.05)*(1+xp/240));
		gold+=goldget;
		finstr = "Fertig! Du erhaelst "+goldget+" Gold.";
	}
	if (occ===2)
	{
		xpget=Math.floor(occ_dur*5/6);
		xp += xpget;
		finstr = "Fertig! Du erhaelst "+xpget+" Erfahrung.";
	}
	if (occ===3)
	{
		enget=Math.floor(Math.pow(occ_dur/60*7,1.05));
		maxenergy += enget;
		finstr = "Fertig! Deine maximale Ernergie erhoeht sich um "+enget+".";
	}
	if (occ===4)
	{
		enget=Math.floor(Math.pow(occ_dur/6*5,1.02));
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
	
	updateLabel();
	alert(finstr);
}

/*
	Missionen
*/

function createMission()
{
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

function save()
{
	var data = ver+"-"+gold+"-"+xp+"-"+dia+"-"+energy+"-"+maxenergy;
	data = data+"-"+occ+"-"+occ_dur+"-"+occ_startTime;
	data = data+"-"+curMissStart+"-"+curMissAim;
	
	var expire = new Date(getDatePlus(1000*60*60*24*365));
	data +="; expires="+expire.toGMTString();
	//alert(data);
	document.cookie=data;
	alert("Spielstad gespeichert!");
}

function load()
{
	var data=document.cookie;
	//alert(data);
	var datas = data.split("-");
	gold   = parseInt(datas[1]);
	xp     = parseInt(datas[2]);
	dia    = parseInt(datas[3]);
	energy = parseInt(datas[4]);
	maxenergy = parseInt(datas[5]);
	occ    = parseInt(datas[6]);
	occ_dur = parseInt(datas[7]);
	occ_startTime = parseInt(datas[8]);
	
	var version = datas[0].split(".");
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
	}else{
		document.getElementById("r1").style.display="none";
		document.getElementById("r2").style.display="none";
		document.getElementById("r3").style.display="none";
		
		document.getElementById("l2").style.display="table";
		document.getElementById("l3").style.display="none";
	}
	
	if (main===0 && mile ===0 && step<6){
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
	
	updateLabel();
	updateMissionLabel();
	alert("Spielstand geladen!");
}

/*
	Hilfsfunktionen
*/

function init()
{
	ver = "0.1.6";
	vertext = "Challenging!";
	xp = 0;
	gold = 0;
	dia = 0;
	maxenergy=100;
	energy = maxenergy;
	occ = 0;
	nextocc = 0;
	occ_dur = 0;
	occ_startTime = Date.parse(new Date(0));
	
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
	setTimeout(function() {criticalMissionTime();}, timeOffset);
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