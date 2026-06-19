//================================================================
// Options - Manifest V3 (chrome.storage based)
//================================================================
"use strict";

const MAX_AUTO_CHECK_RANGE = 181;
const NEVER_INTERVAL = 0x7fffffff;

const SITE_NAMES = ["yandex.com", "yandex.by", "yandex.kz", "yandex.ru", "yandex.com.tr", "yandex.ua"];

const DEFAULT_PREFERENCE = {
	lang: "auto",
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

const msg = (key, subs) => I18N.getMessage(key, subs);

async function getPreference() {
	const { preference } = await chrome.storage.local.get("preference");
	return { ...DEFAULT_PREFERENCE, ...(preference ?? {}) };
}

function buildSiteList(selectedSite) {
	const container = $("siteList");
	container.replaceChildren();
	SITE_NAMES.forEach((name, index) => {
		const radio = document.createElement("input");
		radio.type = "radio";
		radio.name = "site";
		radio.id = `site${index}`;
		radio.checked = index === selectedSite;

		const label = document.createElement("label");
		label.className = "field";
		label.append(radio, ` ${name}`);
		container.append(label);
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
	$("lang").value = prefs.lang;
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
		lang: $("lang").value,
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

function applyDynamicTexts() {
	$("name").textContent = msg("name");
	$("aboutName").textContent = msg("name");
	const { version } = chrome.runtime.getManifest();
	$("aboutVersion").textContent = msg("versionLabel", [version]);
	updateAutoCheckText();
}

async function saveForm() {
	await chrome.storage.local.set({ preference: readForm() });
	chrome.runtime.sendMessage({ type: "prefsUpdated" });
	await I18N.reload();
	applyDynamicTexts();
	const status = $("status");
	status.textContent = msg("saved");
	setTimeout(() => { status.textContent = ""; }, 1500);
}

document.addEventListener("DOMContentLoaded", async () => {
	await I18N.ready;
	loadForm(await getPreference());
	applyDynamicTexts();

	$("autoCheckRange").addEventListener("input", updateAutoCheckText);
	$("save").addEventListener("click", saveForm);
});
