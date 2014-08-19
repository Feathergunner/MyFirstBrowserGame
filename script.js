
var ver;
var xp;
var gold;
var dia;
var maxenergy;
var energy;

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

//var worktimer = setInterval(function() {startTimer()},1000);

function init(){
	ver = "0.1.3c";
	xp = 0;
	gold = 0;
	dia = 0;
	maxenergy=100;
	energy = maxenergy;
	occ = 0;
	nextocc = 0;
	occ_dur = 0;
	occ_startTime = Date.parse(new Date(0));
	updateLabel();
	
	document.getElementById("r1").style.display="none";
	document.getElementById("r2").style.display="none";
	
	document.getElementById("l3").style.display="none";
}

function getOccString(occ){
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

function updateLabel(){
	document.getElementById("pan_xp").innerHTML = xp;
	document.getElementById("pan_gold").innerHTML = gold;
	document.getElementById("pan_dia").innerHTML = dia;
	document.getElementById("pan_en").innerHTML = energy + "/" + maxenergy;
}

function chooseNextOcc(newocc)
{
	nextocc = newocc;
	if (occ===0){
		var durs = [0, 10, 30, 60, 120, 240, 2];
		var encosts   = [0];
		var engets    = [0];
		var goldcosts = [0];
		var goldgets  = [0];
		var xpgets    = [0];
		
		for (i=1; i<7; i++){
			if
			 (nextocc===1){
				encosts[i]=durs[i];
				goldgets[i]=myround(durs[i]*(1+xp/1000),0);
				
				document.getElementById("lab_setocc_eff_"+i).innerHTML = goldgets[i]+" Gold";
				document.getElementById("lab_setocc_cost_"+i).innerHTML = encosts[i]+" Energie";
			}
			
			if (nextocc===2){
				encosts[i]=myround(durs[i]/3,0);
				goldcosts[i]=myround(durs[i]*(xp+1),0);
				xpgets[i]=myround(durs[i],0);
				
				document.getElementById("lab_setocc_eff_"+i).innerHTML = xpgets[i]+" Erfahrung";
				document.getElementById("lab_setocc_cost_"+i).innerHTML = goldcosts[i]+" Gold, "+encosts[i]+" Energie";
			}
			
			if (nextocc===3){
				engets[i]=myround(durs[i]/30,0);
				goldcosts[i]=durs[i]/2;
				encosts[i]=durs[i]*3;
				
				document.getElementById("lab_setocc_eff_"+i).innerHTML = engets[i]+" max. Energie";
				document.getElementById("lab_setocc_cost_"+i).innerHTML = goldcosts[i]+" Gold, "+encosts[i]+" Energie";
			}
			
			if (nextocc===4){
				engets[i]=durs[i]*2;
				
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
			encost = nextdur;
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
				alert("Nicht ausreichend Energie &uumlbrig!");
			}
	}
	if (nextocc===2){
		encost   = myround(nextdur/3,0);
		goldcost = myround(nextdur*(xp+1),0);
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
		goldcost=nextdur/2;
		encost=nextdur*3;
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

function finishJob()
{
	var finstr;
	if (occ===1)
	{
		goldget=myround(occ_dur*(1+xp/1000),0);
		gold+=goldget;
		finstr = "Fertig! Du erhaelst "+goldget+" Gold.";
	}
	if (occ===2)
	{
		xpget=myround(occ_dur,0);
		xp += xpget;
		finstr = "Fertig! Du erhaelst "+xpget+" Erfahrung.";
	}
	if (occ===3)
	{
		enget=myround(occ_dur/30,0);
		maxenergy += enget;
		finstr = "Fertig! Deine maximale Ernergie erhoeht sich um "+enget+".";
	}
	if (occ===4)
	{
		enget=occ_dur*2;
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


function save()
{
	var data = ver+"-"+gold+"-"+xp+"-"+dia+"-"+energy+"-"+maxenergy+"-"+occ+"-"+occ_dur+"-"+occ_startTime;
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
	updateLabel();
	
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
	
	alert("Spielstand geladen!");
}


function startTimer()
{
	//alert(timer");
	if (occ>0){
		var rest = occ_dur-myround((Date.parse(new Date())-occ_startTime)/60000,1);
		if (rest>1) document.getElementById("pan_cur_rest").innerHTML = rest+" Minuten";
		else{
			rest = (occ_dur*60)-myround((Date.parse(new Date())-occ_startTime)/1000,0);
			if (rest>0) document.getElementById("pan_cur_rest").innerHTML = rest+" Sekunden";
			else finishJob();
		}
	}
}

function stopTimer()
{
	//clearInterval(worktimer);
	finishJob();
}

function myround(a,b)
{
var t1 = Math.pow(10,b);
var t2 = Math.round(a*t1);
return (t2/t1);
}

function getDatePlus(plus)
{
	var time=Date.parse(new Date())+plus;
	return time;
}
