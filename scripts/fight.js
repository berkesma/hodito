/* Támadó értékek */
var tamado = {katona:1, vedo:0, tamado:4, ijasz:2, lovas:6, elit:5};
var tabornokok_bonusz = [0, 0.03, 0.05, 0.06, 0.07, 0.08, 0.1, 0.2];
var erosebb_szorzo = 0.1;

/* Védő értékek */
var vedo = {katona:1, vedo:4, tamado:0, ijasz:6, toronyij:12, lovas:2, elit:5};

/* Élőhalott szintenkénti bónusz */
var elohalott_szint = [0.4, 0.3, 0.2, 0.1, 0];

var mf_szorzo = 0.4;
var vedelem_szorzo = 0.3;
var verszomj_szorzo = 0.3;

function calculateDefPoints() {
    var faj = $('#csata_vedekezo_faj').val();
    var szint = $('#csata_szint').val();
    var terulet = parseInt(0+$('#csata_vedekezo_terulet').val());
    var ortornyok = parseInt(0+$('#csata_vedekezo_ortornyok').val());
    var moral = parseInt(0+$('#csata_vedekezo_moral').val());
    var katona = parseInt(0+$('#csata_vedekezo_katona').val());
    var vedo = parseInt(0+$('#csata_vedekezo_vedo').val());
    var tamado = parseInt(0+$('#csata_vedekezo_tamado').val());
    var ijasz = parseInt(0+$('#csata_vedekezo_ijasz').val());
    var lovas = parseInt(0+$('#csata_vedekezo_lovas').val());
    var elit = parseInt(0+$('#csata_vedekezo_elit').val());
    /* Katonák pontjai */
    var points = katona * window.vedo.katona;
    points += vedo * window.vedo.vedo;
    points += tamado * window.vedo.tamado;
    points += lovas * window.vedo.lovas;
    points += elit * window.vedo.elit;
    /* Toronyíjászok pontjai */
    var lakashelyzet = parseInt(0+$('#csata_vedekezo_lakashelyzet_tudomany').val());
    if (lakashelyzet==0) {
	    var lakashelyzeti_szorzo = window.tudomany_alap;
	    if (faj==3) {
	        // elf
	        lakashelyzeti_szorzo = 40;
	    } else if (faj==5) {
	        // gnóm
	        lakashelyzeti_szorzo = 50;
	    } else if (faj==6) {
	        // óriás
	        lakashelyzeti_szorzo = 40;
	    } else if (faj==7) {
	        // élőhalott
	        lakashelyzeti_szorzo = 0;
	    }
	    if ($('#csata_vedekezo_tudos').is(':checked')) {
	        // tudós
	        if (faj!=7) {
	            lakashelyzeti_szorzo += 5;
	        }
	    }
    } else {
    	lakashelyzeti_szorzo = lakashelyzet;
    }
    if ((ortornyok*40) < ijasz) {
        if (faj==4) {
            // törpe
            var toronyij = ((ortornyok*40)*1.2)*(1+(lakashelyzeti_szorzo/100));
        } else {
            var toronyij = ortornyok*40*(1+(lakashelyzeti_szorzo/100));
        }
        ijasz = ijasz-toronyij;
    } else {
        var toronyij = ijasz;
        ijasz = 0;
    }
    var toronyij_szorzo = window.vedo.toronyij;
    if (faj==3) {
        // elf
        toronyij_szorzo += 2;
    }
    points += ijasz * window.vedo.ijasz;
    points += toronyij * toronyij_szorzo;
    if (moral==0) {
        moral = 100;
    }
    points = points * (moral/100);
    /* Tornyok pontjai */
    if (faj==5) {
        // gnóm
        if (terulet==0 || ortornyok==0) {
            var ortorony_szorzo = 0;
        } else {
            var ortorony_szorzo = (ortornyok/terulet)*3;
        }
    } else {
        if (terulet==0 || ortornyok==0) {
            var ortorony_szorzo = 0;
        } else {
            var ortorony_szorzo = (ortornyok/terulet)*2;
        }
    }
    if (ortorony_szorzo > 0.3) {
        ortorony_szorzo = 0.3;
    }
    ortorony_bonusz = points * ortorony_szorzo;
    /* MF pontjai */
    var mf_bonusz = 0;
    if (!($('#csata_vedekezo_szovetseg').is(':checked'))) {
        mf_bonusz = points * window.mf_szorzo;
    }
    /* Védelem bónusz */
    var vedelem_bonusz = 0
    if ($('#csata_vedekezo_vedelem').is(':checked')) {
        vedelem_bonusz = points * window.vedelem_szorzo;
    }
    /* Faji bónuszok */
    var faji_bonusz = 0;
    if (faj==1) {
        // elf
        faji_bonusz = points * 0.3;
    } else if (faj==3) {
        // félelf
        faji_bonusz = points * 0.1;
    } else if (faj==6) {
    	// óriás
    	faji_bonusz = points * 0.15;
    } else if (faj==7) {
        // élőhalott
        faji_bonusz = points * window.elohalott_szint[szint-1];
    }
    /* Tudomány bónusz */
    var hadugyi_bonusz = 0;
    var hadugy = parseInt(0+$('#csata_vedekezo_hadugy_tudomany').val());
    if (hadugy==0) {
	    var hadugyi_szorzo = window.tudomany_alap;
	    if (faj==1) {
	        // elf
	        hadugyi_szorzo =  40;
	    } else if (faj==2) {
	        // ork
	        hadugyi_szorzo = 40;
	    } else if (faj==4) {
	        // törpe
	        hadugyi_szorzo = 40;
	    } else if (faj==5) {
	        // gnóm
	        hadugyi_szorzo = 50;
	    } else if (faj==7) {
	        hadugyi_szorzo = 0;
	    }
	    if ($('#csata_vedekezo_tudos').is(':checked')) {
	        // tudós
	        if (faj!=7) {
	            hadugyi_szorzo += 5;
	        }
	    }
    } else {
    	var hadugyi_szorzo = hadugy;
    }
    hadugyi_bonusz = points * (hadugyi_szorzo/100);
    points += hadugyi_bonusz;
    points += faji_bonusz;
    points += mf_bonusz;
    points += ortorony_bonusz;
    points += vedelem_bonusz;
    return points;
}

function calculateAttPoints() {
    var faj = $('#csata_tamado_faj').val();
    var szint = $('#csata_szint').val();
    var moral = parseInt(0+$('#csata_tamado_moral').val());
    var katona = parseInt(0+$('#csata_tamado_katona').val());
    var vedo = parseInt(0+$('#csata_tamado_vedo').val());
    var tamado = parseInt(0+$('#csata_tamado_tamado').val());
    var ijasz = parseInt(0+$('#csata_tamado_ijasz').val());
    var lovas = parseInt(0+$('#csata_tamado_lovas').val());
    var elit = parseInt(0+$('#csata_tamado_elit').val());
    var tabornok = parseInt(0+$('#csata_tamado_tabornok').val());
    /* Katonák pontjai */
    var points = katona * window.tamado.katona;
    points += vedo * window.tamado.vedo;
    points += tamado * window.tamado.tamado;
    points += ijasz * window.tamado.ijasz;
    points += lovas * window.tamado.lovas;
    points += elit * window.tamado.elit;
    if (moral==0) {
        moral = 100;
    }
    points = points * (moral/100);
    if (tabornok==0) {
        tabornok = 1;
    }
    var tabornok_bonusz = points * window.tabornokok_bonusz[tabornok-1];
    /* Erősebb megtámadásáért járó bónusz */
    var erosebb_bonusz = 0;
    if ($('#csata_tamado_erosebb').is(':checked')) {
        erosebb_bonusz = points * window.erosebb_szorzo;
    }
    /* MF bónusz */
    var mf_bonusz = 0
    if (!($('#csata_tamado_szovetseg').is(':checked'))) {
        mf_bonusz = points * window.mf_szorzo;
    }
    /* Vérszomj bónusz */
    var verszomj_bonusz = 0
    if ($('#csata_tamado_verszomj').is(':checked')) {
        verszomj_bonusz = points * window.verszomj_szorzo;
    }
    /* Faji bónuszok */
    var faji_bonusz = 0;
    if (faj==2) {
        // ork
        faji_bonusz = points * 0.3;
    } else if (faj==6) {
    	// óriás
    	faji_bonusz = points * 0.15;
    } else if (faj==7) {
        // élőhalott
        faji_bonusz = points * window.elohalott_szint[szint-1];
    }
    /* Faji maluszok */
    var faji_malusz = 0;
    if (faj==3) {
        // félelf
        faji_malusz = points * 0.1;
    }
    /* Tudomány bónusz */
    var tudomany_bonusz = 0;
    var hadugy = parseInt(0+$('#csata_tamado_tudomany').val());
    if (hadugy==0) {
	    var tudomany_szorzo = window.tudomany_alap;
	    if (faj==1) {
	        // elf
	        tudomany_szorzo =  40;
	    } else if (faj==2) {
	        // ork
	        tudomany_szorzo = 40;
	    } else if (faj==4) {
	        // törpe
	        tudomany_szorzo = 40;
	    } else if (faj==5) {
	        // gnóm
	        tudomany_szorzo = 50;
	    } else if (faj==7) {
	        tudomany_szorzo = 0;
	    }
	    if ($('#csata_tamado_tudos').is(':checked')) {
	        // tudós
	        if (faj!=7) {
	            tudomany_szorzo += 5;
	        }
	    }
    } else {
    	var tudomany_szorzo = hadugy;
    }
    tudomany_bonusz = points * (tudomany_szorzo/100);
    points += tudomany_bonusz;
    points += faji_bonusz;
    points -= faji_malusz;
    points += tabornok_bonusz;
    points += erosebb_bonusz;
    points += mf_bonusz;
    points += verszomj_bonusz;
    return points;
}

function showFightResult() {
    $("#csata_vedekezo").html("Védekező");
    $("#csata_tamado").html("Támadó");
    $("#csata_vedekezo").css("color", "");
    $("#csata_tamado").css("color", "");
    var def = parseInt(calculateDefPoints());
    var att = parseInt(calculateAttPoints());
    if (def > att) {
        /* A védők nyertek */
        $("#csata_vedekezo").html($("#csata_vedekezo").html()+" <span style='font-size: smaller'>("+def+" pont)</span>");
        $("#csata_tamado").html($("#csata_tamado").html()+" <span style='font-size: smaller'>("+att+" pont)</span>");
        $("#csata_vedekezo").css("color", "green");
        $("#csata_tamado").css("color", "red");
    } else {
        /* A támadók nyertek */
        $("#csata_tamado").html($("#csata_tamado").html()+" <span style='font-size: smaller'>("+att+" pont)</span>");
        $("#csata_vedekezo").html($("#csata_vedekezo").html()+" <span style='font-size: smaller'>("+def+" pont)</span>");
        $("#csata_tamado").css("color", "green");
        $("#csata_vedekezo").css("color", "red");
    }
}

function setAttSciMax(elem) {
	var faj = $('#csata_tamado_faj').val();
    var tudomany_szorzo = window.tudomany_alap;
    if (faj==1) {
        // elf
        tudomany_szorzo =  40;
    } else if (faj==2) {
        // ork
        tudomany_szorzo = 40;
    } else if (faj==4) {
        // törpe
        tudomany_szorzo = 40;
    } else if (faj==5) {
        // gnóm
        tudomany_szorzo = 50;
    } else if (faj==7) {
        tudomany_szorzo = 0;
    }
	if ($('#csata_tamado_tudos').is(':checked')) {
		// tudós
        if (faj!=7) {
            tudomany_szorzo += 5;
        }
	}
	$('#'+elem).val(tudomany_szorzo);
}

function setDefSciMax(elem) {
	var faj = $('#csata_vedekezo_faj').val();
    var tudomany_szorzo = window.tudomany_alap;
    if (elem=='hadugy') {
	    if (faj==1) {
	        // elf
	        tudomany_szorzo =  40;
	    } else if (faj==2) {
	        // ork
	        tudomany_szorzo = 40;
	    } else if (faj==4) {
	        // törpe
	        tudomany_szorzo = 40;
	    } else if (faj==5) {
	        // gnóm
	        tudomany_szorzo = 50;
	    } else if (faj==7) {
	        tudomany_szorzo = 0;
	    }
		if ($('#csata_vedekezo_tudos').is(':checked')) {
			// tudós
	        if (faj!=7) {
	            tudomany_szorzo += 5;
	        }
		}
    } else if (elem=='lakashelyzet') {
    	if (faj==3) {
            // félelf
    		tudomany_szorzo = 40;
        } else if (faj==5) {
            // gnóm
        	tudomany_szorzo = 50;
        } else if (faj==6) {
            // óriás
        	tudomany_szorzo = 40;
        } else if (faj==7) {
            // élőhalott
        	tudomany_szorzo = 0;
        }
    	if ($('#csata_vedekezo_tudos').is(':checked')) {
			// tudós
	        if (faj!=7) {
	            tudomany_szorzo += 5;
	        }
		}
    }
    console.log(tudomany_szorzo);
    console.log(elem);
	$('#csata_vedekezo_'+elem+'_tudomany').val(tudomany_szorzo);
}
