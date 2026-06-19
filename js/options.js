//================================================================
// Options - Manifest V3 (chrome.storage based)
//================================================================
"use strict";

const MAX_AUTO_CHECK_RANGE = 181;
const NEVER_INTERVAL = 0x7fffffff;

const SITE_NAMES = ["yandex.com", "yandex.by", "yandex.kz", "yandex.ru", "yandex.com.tr", "yandex.ua"];

const DEFAULT_PREFERENCE = {
	site: 0,
	inbox: true,
	interval: 30,
	showToolbarNumber: true,
	showPopup: true,
	resetCounter: true,
	reUseExistingMailTab: true,
	openBehavior: 1,
};

const $ = (id) => document.getElementById(id);

const msg = (key, subs) => {
	try {
		return chrome.i18n.getMessage(key, subs) || key;
	} catch {
		return key;
	}
};

async function getPreference() {
	const { preference } = await chrome.storage.local.get("preference");
	return { ...DEFAULT_PREFERENCE, ...(preference ?? {}) };
}

function buildSiteList(selectedSite) {
	const container = $("siteList");
	container.replaceChildren();
	SITE_NAMES.forEach((name, index) => {
		const label = document.createElement("label");
		const radio = document.createElement("input");
		radio.type = "radio";
		radio.name = "site";
		radio.id = `site${index}`;
		radio.checked = index === selectedSite;
		label.append(radio, ` ${name}`);

		const row = document.createElement("div");
		row.className = "row";
		row.append(label);
		container.append(row);
	});
}

function updateAutoCheckText() {
	const value = Number($("autoCheckRange").value);
	let text;
	if (value === MAX_AUTO_CHECK_RANGE) {
		text = msg("never");
	} else if (value >= 60) {
		const hours = Math.floor(value / 60);
		const minutes = value % 60;
		text = `${hours} ${msg("hoursShort")}`;
		if (minutes !== 0) { text += ` ${minutes} ${msg("minutesShort")}`; }
	} else {
		text = `${value} ${msg("minutesShort")}`;
	}
	$("autoCheckText").textContent = msg("checkEvery", [text]);
}

function intervalToSlider(interval) {
	if (interval === NEVER_INTERVAL) { return MAX_AUTO_CHECK_RANGE; }
	return Math.min(180, Math.max(1, interval));
}

function sliderToInterval(slider) {
	return slider === MAX_AUTO_CHECK_RANGE ? NEVER_INTERVAL : slider;
}

function loadForm(prefs) {
	buildSiteList(prefs.site);
	$("inbox").checked = prefs.inbox;
	$("autoCheckRange").value = intervalToSlider(prefs.interval);
	updateAutoCheckText();
	$("showToolbarNumber").checked = prefs.showToolbarNumber;
	$("showPopup").checked = prefs.showPopup;
	$("noPopup").checked = !prefs.showPopup;
	$("resetCounter").checked = prefs.resetCounter;
	$("reUseExistingMailTab").checked = prefs.reUseExistingMailTab;
	$("openEmailInCurrentTab").checked = prefs.openBehavior === 0;
	$("openEmailInNewTab").checked = prefs.openBehavior === 1;
	$("openEmailInNewBackgroundTab").checked = prefs.openBehavior === 2;
}

function readForm() {
	const selectedSite = SITE_NAMES.findIndex((_, i) => $(`site${i}`)?.checked);
	let openBehavior = 1;
	if ($("openEmailInCurrentTab").checked) {
		openBehavior = 0;
	} else if ($("openEmailInNewBackgroundTab").checked) {
		openBehavior = 2;
	}

	return {
		site: selectedSite === -1 ? 0 : selectedSite,
		inbox: $("inbox").checked,
		interval: sliderToInterval(Number($("autoCheckRange").value)),
		showToolbarNumber: $("showToolbarNumber").checked,
		showPopup: $("showPopup").checked,
		resetCounter: $("resetCounter").checked,
		reUseExistingMailTab: $("reUseExistingMailTab").checked,
		openBehavior,
	};
}

async function saveForm() {
	await chrome.storage.local.set({ preference: readForm() });
	chrome.runtime.sendMessage({ type: "prefsUpdated" });
	const status = $("status");
	status.textContent = msg("saved");
	setTimeout(() => { status.textContent = ""; }, 1500);
}

document.addEventListener("DOMContentLoaded", async () => {
	try {
		$("name").textContent = chrome.i18n.getMessage("name");
	} catch {
		// i18n is optional here.
	}

	loadForm(await getPreference());

	$("autoCheckRange").addEventListener("input", updateAutoCheckText);
	$("save").addEventListener("click", saveForm);
});
