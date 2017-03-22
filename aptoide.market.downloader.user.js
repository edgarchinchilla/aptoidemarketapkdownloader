// ==UserScript==
// @name            Aptoide Market (Direct) APK Downloader
// @name:es         Descargador directo de Apps de Aptoide Market a su PC
// @namespace       https://www.facebook.com/edgargerardo.chinchillamazate
// @description     Download Apps from Aptoide Market to your PC directly
// @description:es  Descarga Apps desde Aptoide directamente a tu PC
// @author          edgerch@live
// @include         *.aptoide.com/*
// @version         9.2
// @released        2014-10-10
// @updated         2017-03-22
// @encoding        utf-8
// @homepageURL     https://github.com/edgarchinchilla/aptoidemarketapkdownloader#readme
// @supportURL      https://github.com/edgarchinchilla/aptoidemarketapkdownloader/issues
// @updateURL       https://github.com/edgarchinchilla/aptoidemarketapkdownloader/raw/master/aptoide.market.downloader.user.js
// @downloadURL     https://github.com/edgarchinchilla/aptoidemarketapkdownloader/raw/master/aptoide.market.downloader.user.js
// @icon            http://aptoidapkinstaller.com/wp-content/uploads/2017/03/cropped-Untitled-3-1-300x300.png
// @grant           metadata
// @grant           GM_xmlhttpRequest
// @license         Creative Commons Attribution License
// ==/UserScript==

// Updated & Enhanced by Edgar Gerardo Chinchilla Mazate
// edgerch@live.com
//  https://greasyfork.org/es/scripts/6952-aptoide-market-direct-apk-downloader
// Thanks to the creator of original script:
//  http://userscripts-mirror.org/scripts/show/180436.html

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
var divAppDown              = null;
var btnDownChild            = document.createElement('div');
var loadingAnimationChild   = document.createElement('div');
var btnJSONChild            = document.createElement('div');
var btnStrings              = null;
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

// Trusted: #82CE27, Unknown: #787878, Warning: #D3A22B, Generic: #FFFFFF
var icons = {
        trusted : { color : '#82CE27', imagen : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA20lEQVRoge3U0QnDMAwEUC0T+zejdKTgDpIRukixR+gIHsH9aBvSxg7Bii1B70CfOe4RMBFyLM7b5LxN0jvYAURbANEWQLQFEG0BRFsA0RZAWozgXIsuQAABBBBAAAGkKSSY2XkbKyDRBXvTAQlmJiKawjDmMDtd8Xo3FyKio5jWfyROYRhLmELXgnh/89AA2cVkuqoQvSBFzE9XNaInJItZdbEQvSEbzKeLi5CAfGHW4SCkIBsMFyEJWTBnIKQhyb1eLzZCA+S0A0R6OCCAAAIIICoOEOnhfwl5AjNcdLJj7fAFAAAAAElFTkSuQmCC' },
        unknown : { color : '#787878', imagen : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA0UlEQVRoge3TwQnDMAyFYY2UUbqM8rRNRuhIHcEjpKeACTZNq9gS9P3g60PfwSLsWma2m9kefYc7QrJFSLYIyRYh2SIkW4Rki5ARR3jeiC1CCCGEEEIIIWQwZANQvoUAKACeWSCbiIiqLi1MbwtAWdf1ISJyFTMUAqCo6tLDtLZqhKouZvYKh3zCnLd+Rcz6I11MveVBTIP0MMeWFzEV0sIcW17EdMgZU+dBhEBaGC8iDFJj7kCEQg7MHYhwyJ2PkOjDCSGEEEIISfEIiT78LyFvr8ktYejWvv0AAAAASUVORK5CYII=' },
        warning : { color : '#D3A22B', imagen : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA2klEQVRoge3RywnDMBBFUbUTJguVkg4FkwLSS2SvU4JKkBchxoklY/SbgbwLWhkec7Ax6FyeKXqmKH1HdYBoCxBtAaItQLQFiLYA0RYgPY6oeT22AAEEEEAAAQSQnpCJyXmmUAAJnq8PFZCJyRljzOzIpjAHW+F5v9ze385hev+RMDuyOUxma0XMjuzE9NIAOcQktooQoyBZzM9WMWIkJInZbFUhRkN2mM9WLUIC8oXZVoOQguwwtQhJyIppgZCGRM8UWiA0QJo9QKQPBwQQQAABRMUDRPrwv4QsbtM1ei5ekAMAAAAASUVORK5CYII=' },
        generic : { color : '#FFFFFF', imagen : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA3UlEQVRoge3WwQ3DIBBEUZdEKenQJaQkl0AJk0NQ5KxthGBh9jD/mmjYd/O2qbZQYt8xnCDREiRagkRLkGgJEi1BoiXIjCNGmrEliMfjnluCeDzuuSWIx+OeW4J4PO65JUhDO4DcAckA3lEge/lvusNUtjKAV/mtCTMbkgGkJ8zD1hmRABwRIFXMzVYXYhXkEWO2uhErIbeY09YQYjXkgjltDSEYkD+M2etGsCAXzCiCCflhPBAA+RMFX8zhMcSGuCUI+3CbIOzDbYKwD7cJwj7cJgj7cJsg7MNttVs/a36ck46gS9MAAAAASUVORK5CYII=' },
        loading : { color : '#000000', imagen : 'data:image/gif;base64,R0lGODlhKwALAPEAAP///wAAAIKCggAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAKwALAAACMoSOCMuW2diD88UKG95W88uF4DaGWFmhZid93pq+pwxnLUnXh8ou+sSz+T64oCAyTBUAACH5BAkKAAAALAAAAAArAAsAAAI9xI4IyyAPYWOxmoTHrHzzmGHe94xkmJifyqFKQ0pwLLgHa82xrekkDrIBZRQab1jyfY7KTtPimixiUsevAAAh+QQJCgAAACwAAAAAKwALAAACPYSOCMswD2FjqZpqW9xv4g8KE7d54XmMpNSgqLoOpgvC60xjNonnyc7p+VKamKw1zDCMR8rp8pksYlKorgAAIfkECQoAAAAsAAAAACsACwAAAkCEjgjLltnYmJS6Bxt+sfq5ZUyoNJ9HHlEqdCfFrqn7DrE2m7Wdj/2y45FkQ13t5itKdshFExC8YCLOEBX6AhQAADsAAAAAAAAAAAA='}
    };
    
// Lang strings
var langStrings = {
        es      : { downloadAPK : 'Descargar APK', viewJSON : 'Ver JSON' },
        en      : { downloadAPK : 'Download APK', viewJSON : 'View JSON' },
        de      : { downloadAPK : 'Herunterladen APK', viewJSON : 'Sehen JSON' },
        it      : { downloadAPK : 'Scarica APK', viewJSON : 'Vedere JSON' },
        fr      : { downloadAPK : 'Télécharger APK', viewJSON : 'Voir JSON' }
    };

// Set the default loading animation
loadingAnimationChild.innerHTML = '<img src="'+ icons.loading.imagen +'" />';

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
} else {
    // Determine if we are in the mobile version of the site
    // Even if the URL in the browser ends with *aptoide.com, javascript retrieves *aptoide.com/
    try
        {
            regEx1 = new RegExp(protocol + ':\/\/[A-Za-z0-9.-_]*aptoide.com\/$', 'gi');
            var mobileMatch = window.location.toString().match(regEx1) || [];
            if (mobileMatch.length > 0) { isMobile = true; }
            else
            {
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
            // Get the App MD5
            md5 = src.match(/MD5:<\/strong> [A-Za-z0-9]*/).toString().slice(14);
            // Determine the store name
            regEx1 = new RegExp(protocol + ':\/\/[A-Za-z0-9-_]*\.', 'gi');
            regEx2 = new RegExp(protocol + ':\/\/', 'gi');
            storeName = window.location.toString().match(regEx1).toString().replace(regEx2,'').replace(/.$/,'');
            // Determine the Application version
            appVer = document.getElementsByClassName('app_meta')[0].innerHTML.split("\n")[4].match(/<\/b>[a-zA-Z0-9-_.]*/gi).toString().split('>')[1].toString();
            // Determine the App state
            appState = src.match(/app_install [a-z]* [a-z]*/).toString().toLowerCase().split(' ');
            appState = appState[appState.length-1].toString();
            // Update the download link to include the store
            domainDownload = domainDownload + storeName + '/';
            // construct the apk filename with the format 'nombreapp-xxx-xxxxxxxx-'
            appFileNameExtended = url[url.length-4].toString().replace(/\./g, '-').replace(/_/g, '-').toLowerCase() + '-' + url[url.length-3] + '-' + url[url.length-2] + '-';
            // APP Full download URL
            apkDownloadURL = domainDownload + appFileNameExtended + md5 + '.apk';
            // JSON URL (App Metadata)
            appJSONURL = domainWebService + "store_name=" + storeName + "&package_name=" + url[url.length-4].toString() + "&apk_md5sum=" + md5;
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
            var appMetaData = null;
            // Determine the store name
            storeName = getAllElementsWithAttribute('itemscope')[0].innerHTML.match(/"header__store-name">[a-zA-Z0-9-_.]*/gi).toString().split('>')[1].toString();
            // Determine the Application version
            appVer = document.getElementsByClassName('header__stats__item')[1].getElementsByTagName('span')[1].toString();
            // Determine the App ID
            appId = document.getElementsByClassName('aptweb-button--big')[0].getElementsByTagName('span')[0].innerHTML.match(/app_id=[0-9]*/gi).toString().split('=')[1];
            // Determine the App state
            appState = getAllElementsWithAttribute('itemscope')[0].innerHTML.match(/data-popup-badge="badge-[a-zA-Z0-9]*(?=")/gi).toString().split('-');
            appState = appState[appState.length-1].toString();
            // JSON URL (App Metadata)
            appJSONURL = domainWebService + "store_name=" + storeName + "&app_id=" + appId;
            // Get the Aptoide Download Button Block
            divAppDown = document.getElementsByClassName('aptweb-button--big')[0];
            // Remove all the current download buttons
            while (divAppDown.hasChildNodes()) { divAppDown.removeChild(divAppDown.firstChild); }
            // Show a loading animation
            divAppDown.appendChild(loadingAnimationChild);
            // Read the App Information and Create the download buttons
            getJSON(appJSONURL);
        }
}

/*
 * PUBLIC FUNCTIONS
 */

// Utilities
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
    
// Lang strings generator
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
    var col         = null;
    var img         = null;
    var mobileBtn   = null;
    var retButton   = null;

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
    if (isMobile)
        retButton = '<style> .icon { width: 20px; height: 20px; } .lnk { color: ' + col + '; text-decoration: none; } .lnk a:link { color: ' + col + '; text-decoration: none; } .lnk a:hover { color: #000000; text-decoration: none !important; }</style><span><a class="lnk" href="' + downloadURL + '" download="' + url[url.length-1] + ' ' + appVer + '.apk' + '"><img class="icon" src="'+ img +'" />&nbsp;' + appDownloadString + '</a></span>';
    else
        retButton = '<style> .icon { width: 20px; height: 20px; } .lnk { color: ' + col + '; text-decoration: none; } .lnk a:link { color: ' + col + '; text-decoration: none; } .lnk a:hover { color: #000000; text-decoration: none !important; }</style><font size="4" color="#00FF33"><a class="lnk" href="' + downloadURL + '" download="' + url[url.length-1] + ' ' + appVer + '.apk' + '"><img class="icon" src="'+ img +'" />&nbsp;' + appDownloadString + '&nbsp;<div class="app_install_badge"></div></a></font>';

    return retButton;
}

// Get the App JSON using Greasemonkey's CORS
function getJSON(jsonURL) {
    var xmlCall = GM_xmlhttpRequest({
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
    btnJSONChild.innerHTML = '<a href="' + appJSONURL + '">JSON</a>';

    if (isMobile)
    {
        btnDownChild.innerHTML = getButton(appState, rawJSON['data']['file']['path'], btnStrings.downloadAPK);
        btnDownChild.setAttribute("style", "height: auto; width: auto;");

        // Add the custom APK download button
        divAppDown.appendChild(btnDownChild);
        // Customize the btnJSONChild
        btnJSONChild.innerHTML = '<div class="aptweb-button aptweb-button--big aptweb-button--green"><span><a href="' + appJSONURL + '">JSON</a></span></div>';
    }
    
    if (JSON.stringify(rawJSON['data']['obb']) != 'null')
    {

        if (isMobile)
            divAppDown.parentNode.insertBefore(btnJSONChild, divAppDown.nextSibling);
        else
            divAppDown.appendChild(btnJSONChild);
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
    FUENTES/RECURSOS  */