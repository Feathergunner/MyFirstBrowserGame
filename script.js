
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
	2 = training
	3 = schlafen
*/
var occ_startTime;
var occ_dur;

function init(){
	ver = "0.1.2";
	xp = 0;
	gold = 0;
	dia = 0;
	maxenergy=100;
	energy = maxenergy;
	occ = 0;
	occ_dur = 0;
	occ_startTime = Date.parse(new Date(0));
	updateLabel();
}

function getOccString(occ){
	if (occ===0)
		return "none";
	if (occ===1)
		return "Arbeit";
	if (occ===2)
		return "Training";
	if (occ===3)
		return "Schlafen";
}

function updateLabel(){
	document.getElementById("pan_xp").innerHTML = xp;
	document.getElementById("pan_gold").innerHTML = gold;
	document.getElementById("pan_dia").innerHTML = dia;
	document.getElementById("pan_en").innerHTML = energy + "/" + maxenergy;
}

function work(dur){
	if (occ===0){
		occ_dur=dur;
		var en_cost = dur;
		if (en_cost <= energy){
			var r = confirm("Das kostet dich "+en_cost+" Energy. Machen?");
			if (r){
				occ = 1;
				occ_startTime = Date.parse(new Date());
				energy-=en_cost;
				alert("Du arbeitest nun fuer "+dur+" Minuten!");
				document.getElementById("but_work_1").value="Lohn fordern";
			}
		}else{
			alert("Nicht ausreichend Energy vorhanden! Schlafe vorher!");
		}
	}else{ // occ != "none"
		var time = Date.parse(new Date());
		if (time-occ_startTime > occ_dur*60000){
			if (occ === 1){
				var gain = myround(occ_dur*(100+xp)/100,2);
				alert("Arbeit abgeschlossen. Du erhaelst "+gain+" Gold!");
				gold += gain;
				document.getElementById("but_work_1").value="10 Minuten Arbeit";			
				occ = 0;
			}else{
				alert("Beende erst die aktuelle Aktivitaet: "+getOccString(occ));
			}
		}else{
			var rest = myround(occ_dur-((time-occ_startTime)/60000),1);
			alert("Du bist bereits beschaeftigt: "+getOccString(occ)+", noch "+rest+" Minuten!");
		}
	}
	updateLabel();
}

function train(dur){
	if (occ===0){
		occ_dur=dur;
		var en_cost = dur;
		var gold_cost = myround(dur*xp,2);
		if (en_cost <= energy && gold_cost <= gold){
			var r = confirm("Das kostet dich "+en_cost+" Energy und "+gold_cost+" Gold. Machen?");
			if (r){
				occ = 2;
				occ_startTime = Date.parse(new Date());
				energy-=en_cost;
				gold -= gold_cost;
				alert("Du trainierst nun fuer "+dur+" Minuten!");
				document.getElementById("but_train_1").value="Training beenden.";
			}
		}else{
			if (en_cost>energy) alert("Nicht ausreichend Energy vorhanden! Schlafe vorher!");
			if (gold_cost > gold) alert("Nicht ausreichend Gold vorhanden! Arbeite vorher!");
		}
		
	}else{ // occ != "none"
	
		var time = Date.parse(new Date());
		if (time-occ_startTime > occ_dur*60000){
			if (occ === 2){
				var gain = myround(occ_dur/12,2);
				alert("Training abgeschlossen. Du erhaelst "+gain+" Erfahrung!");
				xp += gain;
				document.getElementById("but_train_1").value="10 Minuten Training";
				occ = 0;
			}else{
				alert("Beende erst die aktuelle Aktivitaet: "+getOccString(occ));
			}
		}else{
			var rest = myround(occ_dur-((time-occ_startTime)/60000),1);
			if (rest <0) rest = 0;
			alert("Du bist bereits beschaeftigt: "+getOccString(occ)+", noch "+rest+" Minuten!");
		}
	}
	updateLabel();
}

function sleep(dur){
	if (occ===0){
		occ_dur=dur;
		var r = confirm("Du schlaefst nun "+dur+" Minuten. Machen?");
		if (r){
			occ = 3;
			occ_startTime = Date.parse(new Date());
			alert("Du schlaefst nun fuer "+dur+" Minuten!");
			document.getElementById("but_sleep_1").value="Aufwachen.";
		}
		
	}else{ // occ != "none"
	
		var time = Date.parse(new Date());
		if (time-occ_startTime > occ_dur*60000){
			if (occ === 3){
				var gain = myround(occ_dur*2,2);
				alert("Ausgeruht. Du erholst dich um "+gain+" Prozent!");
				energy += gain;
				if (energy > maxenergy) energy = maxenergy;
				document.getElementById("but_sleep_1").value="10 Minuten Schlafen";
				occ = 0;
			}else{
				alert("Beende erst die aktuelle Aktivitaet: "+getOccString(occ));
			}
		}else{
			var rest = myround(occ_dur-((time-occ_startTime)/60000),1);
			if (rest <0) rest = 0;
			alert("Du bist bereits beschaeftigt: "+getOccString(occ)+", noch "+rest+" Minuten!");
		}
	}
	updateLabel();
}

function save()
{
	var data = ver+"-"+myround(gold,0)+"-"+myround(xp,0)+"-"+dia+"-"+myround(energy,0)+"-"+maxenergy+"-"+occ+"-"+occ_dur+"-"+occ_startTime;
	document.cookie="Data="+data;
	/*
	document.cookie="gold="+gold;
	document.cookie="xp="+xp;
	document.cookie="dia="+dia;
	document.cookie="en="+energy;
	*/
	alert("Spielstad gespeichert!");
}

function myround(a,b)
{
var t1 = Math.pow(10,b);
//alert(t1);
var t2 = Math.round(a*t1);
//alert(t2);
return (t2/t1);
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
	updateLabel()
	alert("Spielstand geladen!");
	
}
