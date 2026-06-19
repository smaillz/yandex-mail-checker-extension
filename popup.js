//================================================================
// Copyright 2017 Sonthakit Leelahanon. All rights reserved.
//================================================================
"use strict";


var backgroundWin = null;


//================================================
// Begin here
//================================================
document.addEventListener("DOMContentLoaded", function() {
	chrome.runtime.getBackgroundPage(function(backgroundPage) {
		backgroundWin = backgroundPage;
		document.getElementById("openMail").innerText = "Open " + chrome.i18n.getMessage("email");
		if (backgroundPage.preference.multipleSignIn) {
			document.getElementById("MSIdiv").style.display = "block";
			for (var i=0; i < 3; i++) {
				if ((backgroundWin.MSIstatusStatus[i] === "I") || (backgroundWin.MSIstatusStatus[i] === "V") || (backgroundWin.MSIstatusStatus[i] === "Z")) {
					document.getElementById("openMail" + String.fromCharCode(0x41 + i)).innerText = "Open mail " + String.fromCharCode(0x24B6 + i) + "\u279C" + backgroundWin.MSIstatusCounter[i];
				}
			}
		}
		document.getElementById("openMail").addEventListener("click", function(event) {
			backgroundWin.openMail(backgroundWin.preference.openBehavior);
			window.close();
		});
		document.getElementById("checkNow").addEventListener("click", function(event) {
			backgroundWin.checkNow(false);
			window.close();
		});
		document.getElementById("options").addEventListener("click", function(event) {
			backgroundWin.openURL("options.xhtml", 1);
			window.close();
		});
		document.getElementById("about").addEventListener("click", function(event) {
			backgroundWin.openURL("about.xhtml", 1);
			window.close();
		});
		document.getElementById("openMailA").addEventListener("click", function(event) {
			backgroundWin.openURL(backgroundWin.MSIOpenMailA, 1);
			window.close();
		});
		document.getElementById("openMailB").addEventListener("click", function(event) {
			backgroundWin.openURL(backgroundWin.MSIOpenMailB, 1);
			window.close();
		});
		document.getElementById("openMailC").addEventListener("click", function(event) {
			backgroundWin.openURL(backgroundWin.MSIOpenMailC, 1);
			window.close();
		});
	});
});
window.addEventListener("contextmenu", function(event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
});
