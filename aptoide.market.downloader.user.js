// ==UserScript==
// @name			Aptoide Market (Direct) APK Downloader
// @name:es			Descargador directo de Apps de Aptoide Market a su PC
// @namespace		https://www.facebook.com/edgargerardo.chinchillamazate
// @description 	Download Apps from Aptoide Market to your PC directly
// @description:es	Descarga Apps desde Aptoide directamente a tu PC
// @author			edgerch@live
// @include			http://*.store.aptoide.com/*
// @version			8.0a
// @released        2014-10-10
// @updated         2016-06-06
// @encoding		utf-8
// @homepage		https://greasyfork.org/es/scripts/6952-aptoide-market-direct-apk-downloader
// @updateURL		https://greasyfork.org/scripts/6952-aptoide-market-direct-apk-downloader/code/Aptoide%20Market%20(Direct)%20APK%20Downloader.user.js
// @downloadURL		https://greasyfork.org/scripts/6952-aptoide-market-direct-apk-downloader/code/Aptoide%20Market%20(Direct)%20APK%20Downloader.user.js
// @icon			http://upload.wikimedia.org/wikipedia/commons/3/37/Aptoide_Logo.png
// @grant			metadata
// @grant			GM_xmlhttpRequest
// @license			Creative Commons Attribution License
// ==/UserScript==

// Updated & Enhanced by Edgar Gerardo Chinchilla Mazate
// edgerch@live.com
// 		https://greasyfork.org/es/scripts/6952-aptoide-market-direct-apk-downloader
// Thanks to the creator of original script:
//		Original Thread: http://userscripts-mirror.org/scripts/show/180436.html

/*
 * GLOBAL VARS
 */

var rawJSON 			= null;
var isMobile 			= false;
var userLangCode 		= navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage || navigator.browserLanguage);
var url 				= window.location.toString().split('/');
var src 				= document.documentElement.innerHTML;
var md5 				= src.match(/MD5:<\/strong> [A-Za-z0-9]*/).toString().slice(14);
var appVer 				= null;
var storeName			= null;
var appState			= null;
var domainWebService 	= 'http://www.aptoide.com/webservices/getApkInfo/';

/*
 * GLOBAL CHECKS
 */

// Determine if we are in the mobile version of the site
if (window.location.toString().match(/http:\/\/m\./))
	{ isMobile = true; }

// Determine the Application version
try
	{ appVer = appVer = document.getElementsByClassName('app_meta')[(isMobile ? 1 : 0)].innerHTML.split("\n")[(isMobile ? 1 : 4)].match(/Versión:\s<\/b>([a-z]|[A-Z]|[0-9]|\.|[-]|[_])*/gm).toString().slice(13); }
catch(err)
	{ appVer = appVer = document.getElementsByClassName('app_meta')[(isMobile ? 1 : 0)].innerHTML.split("\n")[(isMobile ? 1 : 4)].match(/Version:\s<\/b>([a-z]|[A-Z]|[0-9]|\.|[-]|[_])*/gm).toString().slice(13); }

// Determine the store name
if (isMobile)
	{ storeName = window.location.toString().match(/http:\/\/m\.[A-Za-z0-9-_]*\./i).toString().replace(/http:\/\/m./,'').replace(/.$/,''); }
else
	{ storeName = window.location.toString().match(/http:\/\/[A-Za-z0-9-_]*\./i).toString().replace(/http:\/\//,'').replace(/.$/,''); }

// Determine the App state
if (isMobile)
	{ appState = src.match(/btn app_install [a-z]*/).toString().toLowerCase().split(' '); }
else
	{ appState = src.match(/app_install [a-z]* [a-z]*/).toString().toLowerCase().split(' '); }

/*
 * CONSTRUCT THE APK Links
 */

// Update the download link to include the store
var domainDownload = 'http://pool.apk.aptoide.com/' + storeName + '/';

// construct the apk filename with the format 'nombreapp-xxx-xxxxxxxx-'
var file = url[url.length-4].toString().replace(/\./g, '-').replace(/_/g, '-').toLowerCase() + '-' + url[url.length-3] + '-' + url[url.length-2] + '-';

// APP Full download URL
var apkDownloadURL = domainDownload + file + md5 + '.apk';
// JSON URL, Format: nameofstore/name.of.app/version.of.app/json
var appJSONURL = domainWebService + storeName + '/' + url[url.length-4].toString() + '/' + appVer + '/json';

/*
 * STYLE & LANG STUFF
 */

// Trusted: #82CE27, Unknown: #787878, Warning: #D3A22B, OBB: #E8012C
var icons = {
		trusted : { color : '#82CE27', imagen : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA20lEQVRoge3U0QnDMAwEUC0T+zejdKTgDpIRukixR+gIHsH9aBvSxg7Bii1B70CfOe4RMBFyLM7b5LxN0jvYAURbANEWQLQFEG0BRFsA0RZAWozgXIsuQAABBBBAAAGkKSSY2XkbKyDRBXvTAQlmJiKawjDmMDtd8Xo3FyKio5jWfyROYRhLmELXgnh/89AA2cVkuqoQvSBFzE9XNaInJItZdbEQvSEbzKeLi5CAfGHW4SCkIBsMFyEJWTBnIKQhyb1eLzZCA+S0A0R6OCCAAAIIICoOEOnhfwl5AjNcdLJj7fAFAAAAAElFTkSuQmCC' },
		unknown : { color : '#787878', imagen : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA0UlEQVRoge3TwQnDMAyFYY2UUbqM8rRNRuhIHcEjpKeACTZNq9gS9P3g60PfwSLsWma2m9kefYc7QrJFSLYIyRYh2SIkW4Rki5ARR3jeiC1CCCGEEEIIIWQwZANQvoUAKACeWSCbiIiqLi1MbwtAWdf1ISJyFTMUAqCo6tLDtLZqhKouZvYKh3zCnLd+Rcz6I11MveVBTIP0MMeWFzEV0sIcW17EdMgZU+dBhEBaGC8iDFJj7kCEQg7MHYhwyJ2PkOjDCSGEEEIISfEIiT78LyFvr8ktYejWvv0AAAAASUVORK5CYII=' },
		warning : { color : '#D3A22B', imagen : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA2klEQVRoge3RywnDMBBFUbUTJguVkg4FkwLSS2SvU4JKkBchxoklY/SbgbwLWhkec7Ax6FyeKXqmKH1HdYBoCxBtAaItQLQFiLYA0RYgPY6oeT22AAEEEEAAAQSQnpCJyXmmUAAJnq8PFZCJyRljzOzIpjAHW+F5v9ze385hev+RMDuyOUxma0XMjuzE9NIAOcQktooQoyBZzM9WMWIkJInZbFUhRkN2mM9WLUIC8oXZVoOQguwwtQhJyIppgZCGRM8UWiA0QJo9QKQPBwQQQAABRMUDRPrwv4QsbtM1ei5ekAMAAAAASUVORK5CYII=' },
		generic : { color : '#FFFFFF', imagen : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA3UlEQVRoge3WwQ3DIBBEUZdEKenQJaQkl0AJk0NQ5KxthGBh9jD/mmjYd/O2qbZQYt8xnCDREiRagkRLkGgJEi1BoiXIjCNGmrEliMfjnluCeDzuuSWIx+OeW4J4PO65JUhDO4DcAckA3lEge/lvusNUtjKAV/mtCTMbkgGkJ8zD1hmRABwRIFXMzVYXYhXkEWO2uhErIbeY09YQYjXkgjltDSEYkD+M2etGsCAXzCiCCflhPBAA+RMFX8zhMcSGuCUI+3CbIOzDbYKwD7cJwj7cJgj7cJsg7MNttVs/a36ck46gS9MAAAAASUVORK5CYII=' },
		obb     : { color : '#E8012C', imagen : 'data:image/png;base64,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' },
		info 	: { color : '#696969', imagen : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABgUExURXh4eOvr615eXtPT08zMzOPj42lpaWRkZNvb22tra8TExGZmZmFhYby8vPX19fn5+f///2BgYIuLi/Dw8KysrKSkpLS0tJycnIKCgpSUlFlZWfz8/FVVVW9vb0pKSv///zfkqpcAAAAgdFJOU/////////////////////////////////////////8AXFwb7QAAA6dJREFUeNrsl9uSpCoQRTFRUEAoobyh9Pz/Xw6KlqhUdXfMy3k4aRheYC8yIQVEf/7R0P+ADwBVsOc4IIR0W+Ps14CMjQgayjkntAEyPPH0GwDWRPCqctV6OucIBfTMfgrIB0HcIo7NVbRqs58ACt1UV/XG4K6evgXUhKTlqwmdfQbIXlQfjTj8CWA0r74zyt4DsqSekPMzr98BpCYJOSXrGRPYG0CfaJ/wtjRleya4MgnoaCri7rHYpQyZBKBMjR4fHsGGk3ekTwBSHVCJdgO04pxS+Q3AqPs5oKoGdQGoITnob0KIsmEHMJ5O4FcnXgMcpjNAv0vd1DAuvUDxCVDsFcgr93z+LNdlYuBLMm2Pe0XenwBPvouDPhy+WkPJOrcEYpTYzskYoMmr9XCGe0BtXhS14wf91cIWQwBId6CDevGXQGvWLmSCHPTdFf6MACWskrNxUW9jKN2t0EN0BKjpXU+a+mHkCpgQTxDQdADaRAVoH4yz4EECTypnDsCYaH94YGjKFVDQFACyA6Dv5QJLB2haATWkALb4BOCV7AG2T2lsUoA5Btz7gKOGC7zqjdtC4G896H0NHmy5rg+UC6RWQA7ri3CGY10zI0Ardn1s0IcIekgUcuKiTvS9lALkWxrRlJ4jeQBwCiCc3CJIOcCpjhIpc/7F1WDcxsDeyyglEH8LckhUgZCGygmaBOSRB9Pz3oog4VPEQAESBJdFAIXpDQB6HwOr2xuBwyhjD4y++WnrLQLrVG3vAeanGUnW1xiEyLYIbP5ANw/EkKkYoIrh4gKgbUX56h93B7itzRQDJlNfGrFbGrL+kdFLmaDNUMjzuiALDd7tw2y3zWcPhaw4G6UNM5eFZcryStAUYNKzuAJsvztwLK6q6E4u2C0PzXDXw4B3B6Ll3ZS9jQgAy2SgWGXv+ooV6r4/mDKsLW0OQqPH0c1Xva/A61cApy2OKjxBNN4AoPGHtbMND+HNcm0E8K40U3qXVuTjQtgUq3IBhZtwFeC6Mpve7BM9oQUQDcAGCDf7Q+Pdt4jhWH/ZqcoCd2j2zQQnXpgjgpGd2r/vlQvMejGfpDtBgEVdHsef2q2rrMxrTWdY3TjUS5eiZ44LOX2z3Z+8E3ndI5jt2qxYusTOM9fPPC8z9YM/FmU8gnX94CjMX19ftiFofNaLXE4/+2dSxgeS56zunt66jrHcO5+Sv/1rm6RnlBjni2FcFplR0y//GyclpTFZZoyRb8T/jV/fvwIMANBOI31+ww8GAAAAAElFTkSuQmCC' },
		loading	: { color : '#000000', imagen : 'data:image/gif;base64,R0lGODlhKwALAPEAAP///wAAAIKCggAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAKwALAAACMoSOCMuW2diD88UKG95W88uF4DaGWFmhZid93pq+pwxnLUnXh8ou+sSz+T64oCAyTBUAACH5BAkKAAAALAAAAAArAAsAAAI9xI4IyyAPYWOxmoTHrHzzmGHe94xkmJifyqFKQ0pwLLgHa82xrekkDrIBZRQab1jyfY7KTtPimixiUsevAAAh+QQJCgAAACwAAAAAKwALAAACPYSOCMswD2FjqZpqW9xv4g8KE7d54XmMpNSgqLoOpgvC60xjNonnyc7p+VKamKw1zDCMR8rp8pksYlKorgAAIfkECQoAAAAsAAAAACsACwAAAkCEjgjLltnYmJS6Bxt+sfq5ZUyoNJ9HHlEqdCfFrqn7DrE2m7Wdj/2y45FkQ13t5itKdshFExC8YCLOEBX6AhQAADsAAAAAAAAAAAA='}
	};
	
// Lang strings
var langStrings = {
		es		: { downloadAPK : 'Descargar APK', viewJSON : 'Ver JSON' },
		en		: { downloadAPK : 'Download APK', viewJSON : 'View JSON' },
		de		: { downloadAPK : 'Herunterladen APK', viewJSON : 'Sehen JSON' },
		it		: { downloadAPK : 'Scarica APK', viewJSON : 'Vedere JSON' },
		fr		: { downloadAPK : 'Télécharger APK', viewJSON : 'Voir JSON' }
	};

/*
 * PUBLIC FUNCTIONS
 */
	
// Generador de las cadenas de idioma
function getLangStrings(langCode) {
	var buttonStrings = new Object();
	
	switch (langCode.toString().toLowerCase())
	{
		case 'es':
		case 'es-es':
		case 'es-es':
		case 'es-ar':
		case 'es-bo':
		case 'es-cl':
		case 'es-co':
		case 'es-cr':
		case 'es-do':
		case 'es-ec':
		case 'es-sv':
		case 'es-gt':
		case 'es-hn':
		case 'es-mx':
		case 'es-ni':
		case 'es-pa':
		case 'es-py':
		case 'es-pe':
		case 'es-pr':
		case 'es-uy':
		case 'es-ve':
		default:
			buttonStrings = { downloadAPK : langStrings.es.downloadAPK, viewJSONFile : langStrings.es.viewJSON }
			break;
		case 'en':
		case 'en-us':
		case 'en-gb':
		case 'en-au':
		case 'en-bz':
		case 'en-ca':
		case 'en-ie':
		case 'en-jm':
		case 'en-nz':
		case 'en-ph':
		case 'en-za':
		case 'en-tt':
		case 'en-zw':
			buttonStrings = { downloadAPK : langStrings.en.downloadAPK, viewJSONFile : langStrings.en.viewJSON }
			break;
		case 'de':
		case 'de-de':
		case 'de-at':
		case 'de-li':
		case 'de-lu':
		case 'de-ch':
			buttonStrings = { downloadAPK : langStrings.de.downloadAPK, viewJSONFile : langStrings.de.viewJSON }
			break;
		case 'it':
		case 'it-ch':
			buttonStrings = { downloadAPK : langStrings.it.downloadAPK, viewJSONFile : langStrings.it.viewJSON }
			break;
		case 'fr':
		case 'fr-be':
		case 'fr-ca':
		case 'fr-fr':
		case 'fr-lu':
		case 'fr-mc':
		case 'fr-ch':
			buttonStrings = { downloadAPK : langStrings.fr.downloadAPK, viewJSONFile : langStrings.fr.viewJSON }
			break;
	}
	
	return buttonStrings;
}

// Generate a custom download button for every app state
function getButton(currentState, downloadURL, appDownloadString) {
	var col 		= null;
	var img 		= null;
	var mobileBtn 	= null;

	if (currentState == 'trusted') {
		col = icons.generic.color;
		img = icons.generic.imagen; 
		if (isMobile)
			mobileBtn = 'btn app_install trusted';
	}
	if (currentState == 'unknown') {
		col = icons.generic.color;
		img = icons.generic.imagen;
		if (isMobile)
			mobileBtn = 'btn app_install unknown'; 
	}
	if ((currentState == 'warn') || (currentState == 'warning')) {
		col = icons.generic.color;
		img = icons.generic.imagen;
		if (isMobile)
			mobileBtn = 'btn app_install warning';
	}
	
	// Formated download button
	return '<style> .icon { width: 20px; height: 20px; } .lnk { color: ' + col + '; text-decoration: none; } .lnk a:link { color: ' + col + '; text-decoration: none; } .lnk a:visited { color: ' + col + '; text-decoration: none; } .lnk a:hover { color: #000000; text-decoration: none !important; }</style><font size="4" color="#00FF33"><a class="lnk ' + mobileBtn + '" id="downBtn" href="' + downloadURL + '" download="' + url[url.length-1] + ' ' + appVer + '.apk' + '"><img class="icon" src="'+ img +'" />&nbsp;' + appDownloadString + '&nbsp;<div class="app_install_badge"></div></a></font>';
}

// Get the App JSON using Greasemonkey's CORS
function getJSON() {
	var ret = GM_xmlhttpRequest({
	  method: "GET",
	  url: appJSONURL,
	  onload: function(res) {
	    rawJSON = JSON.parse(res.responseText);
	  }
	});
}
	
/*
 * CREATE THE APK DOWNLOAD ELEMENT (FOR CURRENT STATE)
 */

// Agregamos un botón de descarga al sitio en el apartado del botón "Instalar"
var downloadButton = function() {
	var divAppDown 		= null;
	var btnDownChild 	= document.createElement('div');
	var btnStrings 		= getLangStrings(userLangCode);

	if(isMobile)
		{ divAppDown = document.getElementsByClassName('install_area')[0]; }
	else
		{ divAppDown = document.getElementsByClassName('app_install')[0]; }

	btnDownChild.innerHTML = getButton(appState[appState.length-1], apkDownloadURL, btnStrings.downloadAPK);
	// Remove all the current download buttons
	while (divAppDown.hasChildNodes()) { divAppDown.removeChild(divAppDown.firstChild); }
	// Add the custom APK download button
	divAppDown.appendChild(btnDownChild);
	
	// Parse the JSON
	getJSON();
	// Show a loading animation
	loadingAnimationChild 			= document.createElement('div');
	loadingAnimationChild.innerHTML = '<img src="'+ icons.loading.imagen +'" />';
	divAppDown.appendChild(loadingAnimationChild);
	setTimeout(function(){
	// Remove the loading animation
	divAppDown.removeChild(divAppDown.lastChild);
	var obbQty = 1;
	if (rawJSON.hasOwnProperty('obb'))
		{
			// Add as many obb download buttons as OBBs exists in the App JSON
			for (var prop in rawJSON.obb) {
				var heightFix 		= null;
				var btnJSONChild 	= document.createElement('div');
				

				if (isMobile) { heightFix = '</style><span style="height: 4px; display: block;"></span>'; }
				btnJSONChild.innerHTML = '&nbsp;&nbsp;<style> .iconObb { width: 40px; height: 20px; margin-bottom: -3px; display: inline-block; } .json { color: ' + icons.obb.color + '; text-decoration: none; } .json a:link { color: ' + icons.obb.color + '; text-decoration: none; } .json a:visited { color: ' + icons.obb.color + '; text-decoration: none; } .json a:hover { color: #000000; text-decoration: none !important; }</style>' + heightFix + '<a href="' + rawJSON.obb[prop].path + '" class="json"><img class="iconObb" src="'+ icons.obb.imagen +'" /><span style="color: ' + icons.obb.color + '; font-size: ' + (isMobile ? 1.8 : 0.9) + 'em;">' + obbQty + '</span></a>';
				divAppDown.appendChild(btnJSONChild);
				obbQty++;
			}
		}
	},5000);
}

// Execute the function
downloadButton();

/*	FUENTES/RECURSOS
http://www.javascripter.net/faq/rgbtohex.htm
http://icons8.com/web-app/for/all/download
http://dataurl.net/#dataurlmaker
http://www.developingwebs.net/html/hexgen.php
http://www.w3schools.com/jsref/jsref_trim_string.asp
http://www.w3schools.com/js/js_timing.asp
http://www.w3schools.com/jsref/jsref_obj_regexp.asp
http://www.w3schools.com/js/js_cookies.asp
http://www.w3schools.com/js/js_popup.asp
http://stackoverflow.com/questions/5671451/creating-a-javascript-cookie-on-a-domain-and-reading-it-across-sub-domains
http://stackoverflow.com/questions/2155737/remove-css-class-from-element-with-javascript-no-jquery
http://stackoverflow.com/questions/8074295/is-there-a-way-to-load-a-xml-file-from-another-domain-using-just-javascript
http://stackoverflow.com/questions/17883692/how-to-set-time-delay-in-javascript
http://stackoverflow.com/questions/10125561/yql-request-not-working-when-using-url
http://stackoverflow.com/questions/859024/how-can-i-use-jquery-in-greasemonkey
http://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
http://jsfiddle.net/3s7Ly/20/
http://www.aptoide.com/webservices/getApkInfo/nameofstore/name.of.app/version.of.app/xml
http://ajaxpatterns.org/XMLHttpRequest_Call#Creating_XMLHttpRequest_Objects
http://www.jibbering.com/2002/4/httprequest.html
https://developer.yahoo.com/yql/guide/yql-code-examples.html
https://developer.yahoo.com/javascript/howto-proxy.html
https://github.com/yql
http://www.360doc.com/content/06/1119/16/14389_265247.shtml
https://code.google.com/p/download-data-uri/
http://www.metamodpro.com/browser-language-codes
http://userscripts-mirror.org/scripts/review/119798
	FUENTES/RECURSOS  */