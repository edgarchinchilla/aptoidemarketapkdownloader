// ==UserScript==
// @name            Aptoide Market (Direct) APK Downloader
// @name:es         Descargador directo de Apps de Aptoide Market a su PC
// @namespace       https://www.facebook.com/edgargerardo.chinchillamazate
// @description     Download Apps from Aptoide Market to your PC directly
// @description:es  Descarga Apps desde Aptoide directamente a tu PC
// @author          edgerch@live
// @include         *.aptoide.com/*
// @version         9.7.2
// @released        2014-10-10
// @updated         2019-04-23
// @encoding        utf-8
// @homepageURL     https://github.com/edgarchinchilla/aptoidemarketapkdownloader#readme
// @supportURL      https://github.com/edgarchinchilla/aptoidemarketapkdownloader/issues
// @updateURL       https://github.com/edgarchinchilla/aptoidemarketapkdownloader/raw/master/aptoide.market.downloader.user.js
// @downloadURL     https://github.com/edgarchinchilla/aptoidemarketapkdownloader/raw/master/aptoide.market.downloader.user.js
// @icon            https://github.com/edgarchinchilla/aptoidemarketapkdownloader/raw/master/resources/aptoide-icon-2017-t1-300x300.png
// @grant           metadata
// @grant           GM.xmlHttpRequest
// @license         Creative Commons Attribution License
// ==/UserScript==

// Updated & Enhanced by Edgar Gerardo Chinchilla Mazate
// edgerch@live.com
//  https://greasyfork.org/es/scripts/6952-aptoide-market-direct-apk-downloader
// Thanks to the creator of original script:
//  http://userscripts-mirror.org/scripts/show/180436.html
// Thanks to the language contributors
//  RU: BullFFm (https://github.com/bullffm)

/*
 * GLOBAL VARS
 */

var regEx1                  = null;
var regEx2                  = null;
var rawJSON                 = null;
var isMobile                = false;
var userLangCode            = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage || navigator.browserLanguage);
var url                     = window.location.toString().split('/');
var protocol                = window.location.toString().split(':')[0];
var src                     = document.documentElement.innerHTML;
var domainDownload          = 'http://pool.apk.aptoide.com/';
var divAppDown              = document.createElement('div');
var divContainer            = document.createElement('div');
var btnDownChild            = document.createElement('div');
var loadingAnimationChild   = document.createElement('span');
var btnJSONChild            = document.createElement('div');
var btnStrings              = null;
var downBtnStyle            = null;
var md5                     = null;
var appVer                  = null;
var storeName               = null;
var appState                = null;
var appId                   = null;
var appFileNameExtended     = null;
var appObbFiles             = null;
var apkDownloadURL          = null;
var appJSONURL              = null;
var homeOrSearchPage        = null;

/*
 * DEBUG CONTROL
 */
var debugEnabled = false;

/*
 * Aptoide API (v7)
 */
 // https://www.aptoide.com/webservices/docs/7/app/getMeta
 // https://ws2.aptoide.com/api/7/getAppMeta?apk_id=<value>&app_id=<value>&package_name=<value>&store_name=<value>&apk_md5sum=<value>
 // apk_id          Apk file ID.        +INT31          Example:    2422529
 // app_id          Application ID.     +INT31          Example:    7306243
 // package_name    Apk package name.   PACKAGE_NAME    Example:    "cm.aptoide.pt"
 // store_name      Store name.         DOMAIN_LABEL    Example:    "apps"
 // apk_md5sum      Apk file md5sum.    HEXADECIMAL     Example:    "aefde962dae50881d4353089fa8039f1"
var domainWebService    = 'https://ws2.aptoide.com/api/7/getAppMeta?';

/*
 * STYLE & LANG STUFF
 */

// Icons and Colors
var icons = {
        trusted  : { color : '#01D300', imagen : 'https://github.com/edgarchinchilla/aptoidemarketapkdownloader/raw/master/resources/trusted.png' },
        unknown  : { color : '#6D6D6D', imagen : 'https://github.com/edgarchinchilla/aptoidemarketapkdownloader/raw/master/resources/unknown.png' },
        warning  : { color : '#DDB03B', imagen : 'https://github.com/edgarchinchilla/aptoidemarketapkdownloader/raw/master/resources/warning.png' },
        critical : { color : '#C9391E', imagen : 'https://github.com/edgarchinchilla/aptoidemarketapkdownloader/raw/master/resources/critical.png' },
        generic  : { color : '#FFFFFF', imagen : 'https://github.com/edgarchinchilla/aptoidemarketapkdownloader/raw/master/resources/download.gif' },
        loading  : { color : '#000000', imagen : 'data:image/gif;base64,R0lGODlhKwALAPEAAP///wAAAIKCggAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAKwALAAACMoSOCMuW2diD88UKG95W88uF4DaGWFmhZid93pq+pwxnLUnXh8ou+sSz+T64oCAyTBUAACH5BAkKAAAALAAAAAArAAsAAAI9xI4IyyAPYWOxmoTHrHzzmGHe94xkmJifyqFKQ0pwLLgHa82xrekkDrIBZRQab1jyfY7KTtPimixiUsevAAAh+QQJCgAAACwAAAAAKwALAAACPYSOCMswD2FjqZpqW9xv4g8KE7d54XmMpNSgqLoOpgvC60xjNonnyc7p+VKamKw1zDCMR8rp8pksYlKorgAAIfkECQoAAAAsAAAAACsACwAAAkCEjgjLltnYmJS6Bxt+sfq5ZUyoNJ9HHlEqdCfFrqn7DrE2m7Wdj/2y45FkQ13t5itKdshFExC8YCLOEBX6AhQAADsAAAAAAAAAAAA='}
    };
    // Buttons generic style definition
    downBtnStyle = "text-align: center; " +
                   "color: #FFF; " +
                   "box-shadow: none; " +
                   "border: none; " +
                   "display: -webkit-box; " +
                   "display: -ms-flexbox; " +
                   "display: flex; " +
                   "-webkit-box-pack: center; " +
                   "-ms-flex-pack: center; " +
                   "justify-content: center; " +
                   "margin-bottom: 16px; ";
    
// Lang strings
var langStrings = {
        es      : { downloadAPK : 'Descargar APK', viewJSON : 'Ver JSON de información' },
        en      : { downloadAPK : 'Download APK', viewJSON : 'View JSON information' },
        de      : { downloadAPK : 'Herunterladen APK', viewJSON : 'JSON-Informationen anzeigen' },
        it      : { downloadAPK : 'Scarica APK', viewJSON : 'Visualizzare le informazioni JSON' },
        fr      : { downloadAPK : 'Télécharger APK', viewJSON : 'Voir les informations JSON' },
        ru      : { downloadAPK : 'Скачать APK', viewJSON : 'Просмотр JSON-информации' },
        pl      : { downloadAPK : 'Pobierz APK', viewJSON : 'Wyswietl informacje JSON' }
    };

// Set the default loading animation
loadingAnimationChild.innerHTML = '<img style="border: none;" src="'+ icons.loading.imagen +'" />';
loadingAnimationChild.setAttribute('style', downBtnStyle);

// Set the lang strings for the current user language
btnStrings = getLangStrings(userLangCode)

/*
 * GLOBAL CHECKS
 */

// ONLY EXECUTY THE COMPLETE SCRIPT BEHAVIOR IF THE CURRENT PAGE IS FOR AN APP,
// OTHERWISE (POSSIBLY WE ARE IN THE HOME PAGE, SEARCH PAGE, ETC) DO NOTHING.
regEx1 = new RegExp(protocol + ':\/\/[A-Za-z]*.?aptoide.com\/.*', 'gi');
var homeOrSearchPage = window.location.toString().match(regEx1) || [];
if (homeOrSearchPage.length > 0) {
    // Do nothing, whe are in the home, search, etc. page
    // Show site Scope
    if (debugEnabled) { console.debug('APTOIDE: Homepage'); }
} else {
    // Determine if we are in the mobile version of the site
    // Even if the URL in the browser ends with *aptoide.com, javascript retrieves *aptoide.com/
    try
        {
            regEx1 = new RegExp(protocol + ':\/\/(a-z|A-Z|0-9|-|.)*.aptoide.com\/$', 'gi');
            var mobileMatch = window.location.toString().match(regEx1) || [];
            if (mobileMatch.length > 0)
            {
                isMobile = true;
            } else {
                mobileMatch = window.location.toString().match(/aptoide.com\/[a-z]*\/[a-z]*\/[a-zA-Z0-9-_.]*/gi) || [];
                if (mobileMatch.length == 0) { isMobile = true; }
            }
        }
    catch(err)
        { isMobile = false; }

    /*
     * APTOIDE DESKTOP AND MOBILE SPECIFIC BEHAVIOR
     */

    // DESKTOP
    if (!isMobile)
        {
            // Show site Scope
            if (debugEnabled) { console.debug('APTOIDE: Desktop'); }
            // Get the App MD5
            md5 = src.match(/MD5:<\/strong> [A-Za-z0-9]*/).toString().slice(14);
            // Determine the store name
            regEx1 = new RegExp(protocol + ':\/\/[A-Za-z0-9-_]*\.', 'gi');
            regEx2 = new RegExp(protocol + ':\/\/', 'gi');
            storeName = window.location.toString().match(regEx1).toString().replace(regEx2,'').replace(/.$/,'');
            // TODO: Debug
            if (debugEnabled) { console.debug('Store Name: ' + storeName); }
            // Determine the Application version
            appVer = document.getElementsByClassName('app_meta')[0].innerHTML.split("\n")[4].match(/<\/b>[a-zA-Z0-9-_.]*/gi).toString().split('>')[1].toString();
            // TODO: Debug
            if (debugEnabled) { console.debug('App Version: ' + appVer); }
            // Determine the App state
            appState = src.match(/app_install [a-z]* [a-z]*/).toString().toLowerCase().split(' ');
            appState = appState[appState.length-1].toString();
            // TODO: Debug
            if (debugEnabled) { console.debug('App State: ' + appState); }
            // Update the download link to include the store
            domainDownload = domainDownload + storeName + '/';
            // APP Full download URL
            apkDownloadURL = domainDownload + appFileNameExtended + md5 + '.apk';
            // JSON URL (App Metadata)
            appJSONURL = domainWebService + "store_name=" + storeName + "&package_name=" + url[url.length-4].toString() + "&apk_md5sum=" + md5;
            // TODO: Debug
            if (debugEnabled) { console.debug('JSON Url: ' + appJSONURL); }
            // Get the Aptoide Download Button Block
            divAppDown = document.getElementsByClassName('app_install')[0];
            // Remove all the current download buttons
            while (divAppDown.hasChildNodes()) { divAppDown.removeChild(divAppDown.firstChild); }
            btnDownChild.innerHTML = getButton(appState, apkDownloadURL, btnStrings.downloadAPK);
            // Add the custom APK download button
            divAppDown.appendChild(btnDownChild);
            // Show a loading animation
            divAppDown.appendChild(loadingAnimationChild);
            // Read the App Information and Create the download buttons
            getJSON(appJSONURL);
        }
    // MOBILE
    else
        {
            // Show site Scope
            if (debugEnabled) { console.debug('APTOIDE: Mobile'); }
            // Determine the store name
            storeName = document.getElementsByClassName('header__store-name')[0].innerHTML.toString();
            // TODO: Debug
            if (debugEnabled) { console.debug('Store Name: ' + storeName); }
            // Determine the Application version
            appVer = document.getElementsByClassName('header__stats__item')[1].getElementsByTagName('span')[1].innerHTML.toString();
            // TODO: Debug
            if (debugEnabled) { console.debug('App Version: ' + appVer); }
            // Determine the App ID
            appId = getElementAttributeValue('data-popup-url').match(/app_id=[0-9]*/gi).toString().split('=')[1];
            // TODO: Debug
            if (debugEnabled) { console.debug('App ID: ' + appId); }
            // Determine the App state
            appState = getAllElementsWithAttribute('itemscope')[0].innerHTML.match(/data-popup-badge="badge-[a-zA-Z0-9]*(?=")/gi).toString().split('-');
            appState = appState[appState.length-1].toString();
            // TODO: Debug
            if (debugEnabled) { console.debug('App State: ' + appState); }
            // JSON URL (App Metadata)
            appJSONURL = domainWebService + "store_name=" + storeName + "&app_id=" + appId;
            // TODO: Debug
            if (debugEnabled) { console.debug('JSON Url: ' + appJSONURL); }
            // Get the Aptoide Download Button Block
            divAppDown.setAttribute('class', "customDownloadBtn aptweb-button aptweb-button--big");
            document.getElementsByClassName('aptweb-button--app')[0].parentNode.removeChild(document.getElementsByClassName('aptweb-button--app')[0]);
            divContainer = document.getElementsByClassName('text-box text-box--element')[0];
            divContainer.parentNode.insertBefore(divAppDown, divContainer.nextSibling);
            // Show a loading animation
            divAppDown.appendChild(loadingAnimationChild);
            // Read the App Information and Create the download buttons
            getJSON(appJSONURL);
        }
}

/*
 * PUBLIC FUNCTIONS
 */

// Replace HREF URL for matching elements
function replaceHREFURLForMatchingElements(attribute,newURL)
{
  var ret = false;
  var allElements = document.getElementsByTagName('*');
  for (var i = 0; i < allElements.length; i++)
  {
    if (allElements[i].hasAttribute(attribute))
    {
        // If the element has an "OnClick" attribute, remove it
        if (allElements[i].hasAttribute('OnClick')) {
            allElements[i].removeAttribute('OnClick');
        }
        var childElements = allElements[i].children;
        for (var j = 0; j < childElements.length; j++) {
            // Replace the URL for the direct APK download one
            if (childElements[j].hasAttribute('href')) {
                childElements[j].setAttribute('href',newURL);
                if (debugEnabled) { console.debug('Element ' + childElements[j]); }
            }
            // If the element has an "OnClick" attribute, remove it
            if (childElements[j].hasAttribute('OnClick')) {
                childElements[j].removeAttribute('OnClick');
            }
        }
    }
  }
  return ret;
}

// Get an return a list of elements with matching attribute
function getAllElementsWithAttribute(attribute)
{
  var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute(attribute) !== null)
    {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}

// Get and return an attribute value
function getElementAttributeValue(attribute)
{
  var attributeValue = null;
  var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute(attribute) !== null)
    {
      // Element exists with attribute. Add to array.
      attributeValue = allElements[i].getAttribute(attribute);
    }
  }
  return attributeValue;
}

// Lang strings generator
// LANGS List: https://gist.github.com/JamieMason/3748498
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
        case 'ru':
        case 'ru-ru':
            buttonStrings = { downloadAPK : langStrings.ru.downloadAPK, viewJSONFile : langStrings.ru.viewJSON }
            break;
        case 'pl':
        case 'pl-pl':
            buttonStrings = { downloadAPK : langStrings.pl.downloadAPK, viewJSONFile : langStrings.pl.viewJSON }
            break;
    }
    
    return buttonStrings;
}

// Generate a custom download button for every app state
function getButton(currentState, downloadURL, appDownloadString) {
    var img         = null;
    var retButton   = null;

    if (currentState == 'trusted') {
        downBtnStyle = downBtnStyle + "background-color: " + icons.trusted.color + "; ";
        img = icons.generic.imagen;
    }
    if (currentState == 'unknown') {
        downBtnStyle = downBtnStyle + "background-color: " + icons.unknown.color + "; ";
        img = icons.generic.imagen;
    }
    if ((currentState == 'warn') || (currentState == 'warning')) {
        downBtnStyle = downBtnStyle + "background-color: " + icons.warning.color + "; ";
        img = icons.generic.imagen;
    }
    if (currentState == 'critical') {
        downBtnStyle = downBtnStyle + "background-color: " + icons.critical.color + "; ";
        img = icons.generic.imagen;
    }
    if (null == img) {
        downBtnStyle = downBtnStyle + "background-color: " + icons.generic.color + "; ";
        img = icons.generic.imagen;
    }

    if (debugEnabled) { console.debug('Button Style: ' + downBtnStyle); }
    
    // Formated download button
    retButton = '<span style="vertical-align: middle;"><a style="color: ' + icons.generic.color + '; text-decoration: none;" href="' + downloadURL + '" download="' + appFileNameExtended + ' v' + appVer + '.apk' + '">' + appDownloadString + '</a></span>';
    
    return retButton;
}

// Get the App JSON using Greasemonkey's CORS
function getJSON(jsonURL) {
    var xmlCall = GM.xmlHttpRequest({
      method: "GET",
      headers: {"Accept": "application/json"},
      ignoreCache: true,
      url: jsonURL,
      onload: function(res) {
        rawJSON =JSON.parse(res.responseText);
        createJSONButton();
      },
      onerror: function(res) {
        rawJSON = JSON.parse('{ "error": { "message": "' + res.responseText + '" } }');
        createJSONButton();
      }
    });
}

/*
 * CREATE THE JSON LINK IF THE APP HAS AN OBB FILE
 */

// Replace the Aptoide "download" button for one that links to the direct APK donwload
var createJSONButton = function() {
    // Remove the loading animation
    divAppDown.removeChild(divAppDown.lastChild);
    // Construct the apk filename with the format 'nombreapp-xxx-xxxxxxxx-'
    appFileNameExtended = rawJSON['data']['name'];
    // TODO: Debug
    if (debugEnabled) { console.debug('App File Name: ' + appFileNameExtended); }

    // Update other aptoide links that point to the Store APK with the actual APP full URL
    replaceHREFURLForMatchingElements("data-desktop-download-popup",rawJSON['data']['file']['path']);
    document.querySelector("#directDownloadUrl").setAttribute("href",rawJSON['data']['file']['path']);

    if (isMobile) {
        // Construct the APK download button
        btnDownChild.innerHTML = getButton(appState, rawJSON['data']['file']['path'], btnStrings.downloadAPK);
        // Add the custom APK download button
        divAppDown.appendChild(btnDownChild);
        divAppDown.parentElement.setAttribute("href",rawJSON['data']['file']['path']);
        // Customize the btnJSONChild for Mobile
        btnJSONChild.innerHTML = '<div class="aptweb-button aptweb-button--big" style="' + downBtnStyle + '"><span><a href="' + appJSONURL + '" style="color: #FFF;">' + btnStrings.viewJSONFile + '</a></span></div>';
    } else {
        // Customize the btnJSONChild for Desktop
        btnJSONChild.innerHTML = '<a href="' + appJSONURL + '" id="show_app_malware_data" data-fancybox class="app_install_badge_label">' + btnStrings.viewJSONFile + '</a>';
    }

    // Apply button customization
    divAppDown.setAttribute('style', downBtnStyle);
    if (debugEnabled) { console.debug('Download Button: ' + divAppDown); }
    
    // If the APP has obb files, show a button to see its JSON Info Page
    if (JSON.stringify(rawJSON['data']['obb']) != 'null') {
        if (isMobile)
            divAppDown.parentNode.insertBefore(btnJSONChild, divAppDown.nextSibling);
        else
            divAppDown.appendChild(btnJSONChild);
        if (debugEnabled) { console.debug('JSON Button: ' + btnJSONChild); }
    }
}

/*  FUENTES/RECURSOS
http://upload.wikimedia.org/wikipedia/commons/3/37/Aptoide_Logo.png
https://regex101.com/
http://www.javascripter.net/faq/rgbtohex.htm
http://icons8.com/web-app/for/all/download
http://dataurl.net/#dataurlmaker
http://www.developingwebs.net/html/hexgen.php
http://www.w3schools.com/jsref/jsref_trim_string.asp
http://www.w3schools.com/js/js_timing.asp
http://www.w3schools.com/jsref/jsref_obj_regexp.asp
https://www.w3schools.com/jsref/met_element_setattribute.asp
http://www.w3schools.com/js/js_cookies.asp
http://www.w3schools.com/js/js_popup.asp
http://stackoverflow.com/questions/3466356/alert-json-object
http://stackoverflow.com/questions/3172985/javascript-use-variable-in-string-match
http://stackoverflow.com/questions/9496427/get-elements-by-attribute-when-queryselectorall-is-not-available-without-using-l
http://stackoverflow.com/questions/2934137/how-to-insert-an-element-between-the-two-elements-dynamically
http://stackoverflow.com/questions/5671451/creating-a-javascript-cookie-on-a-domain-and-reading-it-across-sub-domains
http://stackoverflow.com/questions/2155737/remove-css-class-from-element-with-javascript-no-jquery
http://stackoverflow.com/questions/8074295/is-there-a-way-to-load-a-xml-file-from-another-domain-using-just-javascript
http://stackoverflow.com/questions/3926451/how-to-match-but-not-capture-part-of-a-regex
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
https://stackoverflow.com/questions/22191576/javascript-createelement-and-setattribute
https://stackoverflow.com/questions/4777077/removing-elements-by-class-name
Example of Trusted, Warning, Critical and Unknown Apps:
    Trusted:  https://moto-robot-angry-shark.en.aptoide.com/
    Warning:  https://real-tiger-shark-hungry-attack.en.aptoide.com/
    Critical: https://com-hoquamind-flamliesai.en.aptoide.com/
    Unknown:  https://com-devboy-mygame.en.aptoide.com/
    FUENTES/RECURSOS  */
