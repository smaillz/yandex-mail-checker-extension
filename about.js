//================================================================
// Copyright 2017 Sonthakit Leelahanon. All rights reserved.
//================================================================
"use strict";


//================================================
// Begin here
//================================================
document.addEventListener("DOMContentLoaded", function() {
	chrome.runtime.getBackgroundPage(function(backgroundPage) {
		var backgroundWin = backgroundPage;
		document.getElementById("name").innerText = chrome.i18n.getMessage("name");
		document.getElementById("version").innerText = "Version " + backgroundWin.thisVersion.toFixed(2);
	});
});
window.addEventListener("contextmenu", function(event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
});
