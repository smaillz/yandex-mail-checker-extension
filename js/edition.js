//================================================================
// Copyright 2017 Sonthakit Leelahanon. All rights reserved.
//================================================================
"use strict";


// Require
var thisVersion = 2.30;
var MSISupport = false;
var feedSupport = false;
var siteSupport = true;
var matchPattern = ["*://*.mail.yandex.com/*", "*://*.mail.yandex.by/*", "*://*.mail.yandex.kz/*", "*://*.mail.yandex.ru/*", "*://*.mail.yandex.com.tr/*", "*://*.mail.yandex.ua/*"];
var matchRegExp = ["^https?:\/\/(mail\.yandex\.com|[^\/]+\.mail\.yandex\.com)", "^https?:\/\/(mail\.yandex\.by|[^\/]+\.mail\.yandex\.by)", "^https?:\/\/(mail\.yandex\.kz|[^\/]+\.mail\.yandex\.kz)", "^https?:\/\/(mail\.yandex\.ru|[^\/]+\.mail\.yandex\.ru)", "^https?:\/\/(mail\.yandex\.com\.tr|[^\/]+\.mail\.yandex\.com\.tr)", "^https?:\/\/(mail\.yandex\.ua|[^\/]+\.mail\.yandex\.ua)"];
var checkEmailURL = ["https://mail.yandex.com/lite/inbox", "https://mail.yandex.by/lite/inbox", "https://mail.yandex.kz/lite/inbox", "https://mail.yandex.ru/lite/inbox", "https://mail.yandex.com.tr/lite/inbox", "https://mail.yandex.ua/lite/inbox"];
var emailURL = ["https://mail.yandex.com", "https://mail.yandex.by", "https://mail.yandex.kz", "https://mail.yandex.ru", "https://mail.yandex.com.tr", "https://mail.yandex.ua"];
var errorIndex = "none";

// variant
var siteCount = 6;
var siteName = ["yandex.com", "yandex.by", "yandex.kz", "yandex.ru", "yandex.com.tr", "yandex.ua"];


//================================================
// analyzeHTML
//================================================
function analyzeHTML(input, inboxPref) {
	// Return status -3 =not connected, -2 =log out, -1 =unknown server response, 0+ =number unread email
	// Return "GET" + " " + URL if redirect, Return "POST" + " " + URL + " " + PostData if FORM POST
	// inboxPref mirrors the old preference.inbox flag.
	var totalCount = -1; errorIndex = "point-H1";
	var output = input;
	if (output.length === 0) {
		totalCount = -3;
	} else {
		if ((output.indexOf('type="password"') !== -1) || (output.indexOf("type='password'") !== -1)) {
			totalCount = -2;
		} else {
			var output1 = "";
			var index = output.indexOf('<div class="b-folders">');
			if (index === -1){
				totalCount = -1; errorIndex = "point-H2";
			} else {
				output = output.substr(index+23);
				index = output.indexOf('</div>');
				if (index === -1) {
					totalCount = -1; errorIndex = "point-H3";
				} else {
					output = output.split('</div>',1).toString();
					index = output.indexOf('href="/lite/inbox"');
					if (index === -1) {
						totalCount = -1; errorIndex = "point-H4";
					} else {
						var output1 = output.split('href="/lite/inbox',1).toString();
						index = output1.indexOf('class="b-folders__folder__num"');
						if (index === -1) {
							totalCount = 0;
						} else {
							output1 = output1.substr(index+30);
							index = output1.indexOf('>');
							if (index === -1) {
								totalCount = -1; errorIndex = "point-H5";
							} else {
								output1 = output1.substr(index+1);
								index = output1.indexOf('</span>');
								if (index === -1) {
									totalCount = -1; errorIndex = "point-H6";
								} else {
									output1 = output1.split('</span>',1).toString();
									if (!RegExp(/^\d{1,3}(,\d\d\d)*$|^\d+$/).test(output1)) {
										totalCount = -1; errorIndex = "point-H7";
									} else {
										output1 = output1.replace(/,/g,"");
										totalCount = Number(output1);
									}
								}

							}
						}
					}
					if ((totalCount !== -1) && (inboxPref)) {
						var output2 = "";
						var output3 = "";
						index = output.indexOf('</a>');
						while (index !== -1) {
							output2 = output.split('</a>',1).toString();
							output = output.substr(index+4);
							index = output2.indexOf('class="b-folders__folder__num"');
							if (index !== -1) {
								output1 = output2.substr(index+30);
								index = output1.indexOf('>');
								if (index === -1) {
									totalCount = -1; errorIndex = "point-H8";
									break;
								} else {
									output1 = output1.substr(index+1);
									index = output2.indexOf('href="');
									if (index === -1) {
										totalCount = -1; errorIndex = "point-H9";
										break;
									} else {
										output3 = output2.substr(index+6);
										index = output3.indexOf('"');
										if (index === -1) {
											totalCount = -1; errorIndex = "point-H10";
											break;
										} else {
											output3 = output3.split('"',1).toString();
											if ((output3!='/lite/inbox') &&
												(output3!='/lite/sent') &&
												(output3!='/lite/trash') &&
												(output3!='/lite/spam')) {
												index = output1.indexOf('</span>');
												if (index === -1) {
													totalCount = -1; errorIndex = "point-H11";
													break;
												} else {
													output1 = output1.split('</span>',1).toString();
													if (!RegExp(/^\d{1,3}(,\d\d\d)*$|^\d+$/).test(output1)) {
														totalCount = -1; errorIndex = "point-H12";
														break;
													} else {
														output1 = output1.replace(/,/g,"");
														totalCount = totalCount + Number(output1);
													}
												}
											}
										}
									}
								}
							}
							index = output.indexOf('</a>');
						}
					}
				}
			}
		}
	}
	return totalCount;
}
function findEmailAddress(input) {
	// Yandex Mail lite version use only username, no full email address, and it bold the first letter of username
	var result = "";
	var output = input;
	output = output.replace(/<\/b>/g, "");
	var index = output.indexOf('class="b-user__first-letter">');
	if (index !== -1) {
		output = output.substr(index+29);
		if (output.indexOf('</span>') !== -1) {
			result = output.split('</span>',1).toString();
		}
	}
	return result;
}
