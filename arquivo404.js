/**
 * Web archive not found HTTP status 404 ECMAScript handler that uses Memento API (rfc 7089).
 * Requires that the Memento API have an allowed CORS policy.
 * In practive the server should return the response HTTP header: "Access-Control-Allow-Origin: *"
 *
 */
var ARQUIVO_NOT_FOUND_404 = ARQUIVO_NOT_FOUND_404 || (function(){

	var _url = window.location.href;
	var _handled = false;
	var _messageElementId = null;
	var _language = navigator.language || navigator.userLanguage;
	var _dateFormatter = (date) => [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-'); // YYYY/MM/DD
    var _getMostRelevantMemento = (mementoList) => mementoList[0] //oldest memento is the most relevant by default
    var _minDate = null;
    var _maxDate = null;

	var _messagesMap = new Map([ 
		['', '<a href="{archivedURL}">Visite uma vers&atilde;o anterior desta p&aacute;gina no {archiveName}.</a>'] 
	]);

	// List of archives to try
	// timeout in miliseconds
	var _archives = [
		{ timeout: 2000, archiveName: "Arquivo.pt", archiveApiUrl: "https://arquivo.pt/arquivo404server/timemap/link/" } 
	];

	function handleMessage(message) {
		if (!!_messageElementId) {
			document.getElementById(_messageElementId).innerHTML = message;
		} else {
			var scripts = document.getElementsByTagName('script');
			var arquivo404ScriptElement;
			for(var i=0; i<scripts.length; i++) {
				var elementScript = scripts[i];
			    if(elementScript.src.endsWith('arquivo404.js')) {
			    	arquivo404ScriptElement = elementScript;
			    	break;
			    }
			}
			if (arquivo404ScriptElement != null) {
				var elementDiv = document.createElement('div');
		        elementDiv.innerHTML = message;
		        elementScript.parentNode.appendChild(elementDiv);
			} else {
				console.log("Not found arquivo404.js script element. Please define a messageElementId instead.");
			}
		}
	}

	function formatMessage(archive, archivedURL, date) {
		var message = _messagesMap.get(_language);
		if (!message) {
			const shortUserLang = _language.substring(0, _language.indexOf('-'));
			message = _messagesMap.get(shortUserLang);
		} 
		if (!message) {
			// returns first message
			message = _messagesMap.values().next().value;
		}

		const replaceMap = new Map( [ 
			['archiveName', archive.hasOwnProperty('archiveName') ?  archive.archiveName : ''],
			['archivedURL', archivedURL],
			['date', _dateFormatter(date)],
			['year', date.getFullYear()],
			['month', (date.getMonth()+1)],
			['monthLong', new Intl.DateTimeFormat(_language, {  month: 'long' }).format(date)],
			['day', date.getDate()],
			['hour', date.getHours()],
			['minute', date.getMinutes()],
			['second', date.getSeconds()],
			['millisecond', date.getMilliseconds()],
		]);
		replaceMap.forEach(function(value, key){
			message = message.replace(new RegExp('{' + key + '}', 'gi'), value);
		});

		return message;
	}

	function getArchivedURL(mementoLine) {
		const idxFirstSpace = mementoLine.indexOf(' ');
		return mementoLine.substring(1, idxFirstSpace-2);
	}

	function getMementoDate(mementoLine) {
		const datetimeSnip = ' datetime="';
		const idxDatetime = mementoLine.indexOf(datetimeSnip);
		const dateRFC1123InitialPosition = idxDatetime + datetimeSnip.length;
		const datePartial = mementoLine.substring(dateRFC1123InitialPosition);
		const dateRFC1123 = datePartial.substring(0, datePartial.indexOf('"'));
		const date = new Date(dateRFC1123);
		return date;
	}

	function handleMemento(archive, pageUrl, mementoResponse) {
		if (!_handled) {
			var mementoLines = mementoResponse.split(/\r?\n/).filter(function(l){ return l.indexOf('rel="memento"') >= 0});
            if(!!_minDate){
                mementoLines = mementoLines.filter(x => getMementoDate(x) >= _minDate)
            }
            if(!!_maxDate){
                mementoLines = mementoLines.filter(x => getMementoDate(x) <= _maxDate)
            }
			const linesCount = mementoLines.length;
			if (linesCount) {
				const mostRelevantMemento = _getMostRelevantMemento(mementoLines);
				const archivedURL = getArchivedURL(mostRelevantMemento)
				const date = getMementoDate(mostRelevantMemento)

				if (!_handled) {
					_handled = true;
					handleMessage(formatMessage(archive, archivedURL, date));
				}
			}
		}
	}

	function getMementoUsingXMLHttpRequest( archive ) {
		var pageUrl = _url;
		var xmlurl = archive.archiveApiUrl + pageUrl;

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
	        if (xmlhttp.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
	        	if (xmlhttp.status == 200) {
	        		handleMemento(archive, pageUrl, xmlhttp.responseText);
	        	}
	        	else if (xmlhttp.status == 400) {
	        		console.log('There was an error 400');
	        	}
	        	else {
	        		console.log('something else other than 200 was returned');
	        	}
	        }
	    };
	    xmlhttp.open("GET", xmlurl, true);
	    xmlhttp.timeout = archive.hasOwnProperty('timeout') ? archive.timeout : 5000;
	    xmlhttp.send();
	}

	return {

		/**
		 * @deprecated Multilanguage support will be discontinued. `message` is the preferred method.
		 * 
		 * Adds a list of language-messsage pairs
		 * 
		 * @param {Array []} langMessagesMap  Array of other arrays that have two element each
		 * @return {Object} ```this```
		 * 
		 * @example
		 * ```js
		 * .messages([
		 *         ['pt', '<a href="{archivedURL}">Visite uma versão anterior desta pÃ¡gina de {day} {monthLong}, {year} no {archiveName}.</a>'],
		 *         ['en', '<a href="{archivedURL}">Visit an earlier version of this page from {day} {monthLong}, {year} at {archiveName}.</a>'],
		 *      ])
		 * ```
		 */
		messages : function(langMessagesMap) {
			_messagesMap = new Map(langMessagesMap);
			return this;
		},

		/**
		 * @deprecated multilanguage support will be discontinued. 
		 * 
		 * Force show messages on specific language
		 * 
		 * @param {string} language  2-letter code of the language ( ISO 639-1 compliant )
		 * @return {Object} ```this```
		 */
		language : function(language) {
			_language = language;
			return this;
		},

		/**
		 * Specify the arquivo404 message
		 * 
		 * @param {string} message message to be shown
		 * @return {Object} ```this```
		 * 
		 * @example
		 * ```js 
		 * .message('You can view an archived versions on <a href="{archivedURL}">{archivedURL}</a>');
		 * ```
		 */
		message : function(message) {
			_messagesMap = new Map([ ['', message] ]);
			return this;
		},

		/**
		 * @deprecated Multilanguage support will be discontinued. `message` is the preferred method.
		 * 
		 *  Add a language message
		 * 
		 * @param {string} language  2-letter code of the language ( ISO 639-1 compliant )
		 * @param {string} message message to be shown
		 * @return {Object} ```this```
		 * 
		 * @example
		 * ```js 
		 * .addMessage('pt', 'You can view an archived versions on <a href="{archivedURL}">{archivedURL}</a>');
		 * ```
		 */
		addMessage : function(language, message) {
			_messagesMap.set(language, message);
			return this;
		},

		/**
		 * Formats a date object into a string.
		 * @typedef {function(Date): string} DateFormatter
		 */

		/**
		 * Specify how to format the ```date``` tag on the message
		 * 
		 * @param {DateFormatter} dateFormatter function that converts a javascript Date object into a string
		 * @return {Object} ```this```
		 * 
		 * @example changing the date format to MM/DD/YYYY
		 * ```js 
		 * .setDateFormatter(date => [date.getMonth()+1, date.getDate() ,date.getFullYear()].join('/')); 
		 * .message('<a href="{archivedURL}">View an archived version of the page from {date} at {archiveName}</a>');
		 * ```
		 */
		setDateFormatter : function( dateFormatter ){
			if(typeof dateFormatter == 'function'){
				_dateFormatter = dateFormatter;
			}
			return this;
		},

        /**
		 * Specify how to choose which memento to link among all available options returned from the web archive(s). 
         * By default, the oldest result is used.
		 * 
		 * @param {('oldest'|'most-recent')} criterion whether we want to present the oldest or the most recent result
		 * @return {Object} ```this```
		 * 
		 * @example changing to the most recent result
		 * ```js 
		 * .setMostRelevantMemento('most-recent')
		 * ```
		 */
		setMostRelevantMemento : function( criterion ){
            if(criterion === 'oldest' ){
                _getMostRelevantMemento = (mementoList) => mementoList[0]
            } else if(criterion === 'most-recent' ){
                _getMostRelevantMemento = (mementoList) => mementoList[mementoList.length-1]
            }
			return this;
		},

        /**
		 * Specify the minimum date of archived pages. 
		 * 
		 * @param {Date} minDate The oldest date allowed to be presented
		 * @return {Object} ```this```
		 * 
		 * @example Prevent results earlier than 2010
		 * ```js 
		 * .setMinimumDate(new Date("2010-01-01 GMT"))
		 * ```
		 */
		setMinimumDate : function( minDate ){
            _minDate = minDate;
			return this;
		},

        /**
		 * Specify the maximum date of archived pages. 
		 * 
		 * @param {Date} maxDate The maximum date allowed to be presented
		 * @return {Object} ```this```
		 * 
		 * @example Prevent results later than 2010
		 * ```js 
		 * .setMaximumDate(new Date("2010-01-01 GMT"))
		 * ```
		 */
		setMaximumDate : function( maxDate ){
            _maxDate = maxDate;
			return this;
		},

		/**
		 * Specify the id of the HTML element that will contain the message
		 * 
		 * @param {string} messageElementId 
		 * @return {Object} ```this```
		 */
		messageElementId : function(messageElementId) {
			_messageElementId = messageElementId;
			return this;
		},

		/**
		 * An object to configure a web archive
		 * @typedef {Object} ArchiveConfig
		 * @property {string} archiveApiUrl - URL to the timemap/link/ endpoint of the API.
		 * @property {string} archiveName - Archive name to be used with the ```archiveName``` tag in the message.
		 * @property {number} timeout - Timeout for the API request.
		 * 
		 */
		/**
	 	 * Add an additional web archive compliant with the Memento protocol ( RFC 7089 )
		 * 
		 * @param {ArchiveConfig} archive - Object describing the the web archive.
		 * @return {Object} ```this```
		 * 
		 * @example
		 * ```
		 * .addArchive( {timeout: 6000, archiveName: "Internet Archive", archiveApiUrl: "http://web.archive.org/web/timemap/link/"} )
		 * ```
		 */
		addArchive : function(archive) {
			const o = archive.hasOwnProperty('archiveApiUrl') ? archive : {'archiveApiUrl' : archive} ;
			_archives.push(o)
			return this;
		},

		/**
	 	 * Replace all web archives with a web archive compliant with the Memento protocol ( RFC 7089 )
		 * 
		 * @param {ArchiveConfig} archive Object describing the the web archive.
		 * @return {Object} ```this```
		 */
		archive : function(archive) {
			_archives = [];
			this.addArchive(archive);
			return this;
		},

		/**
	 	 * Change url to search on web archives instead of the current page. 
		 * 
		 * @param {string} url - URL to search on web archives like Arquivo.pt
		 * @return {Object} ```this```
		 */
		url : function(url) {
			_url = url;
			return this; 
		},

		/**
		 * Method to be called to start the web archives search.
		 * 
		 * @return {Object} ```this```
		 */
		call : function () {
			for ( let i = 0 ; i < _archives.length ; i ++) {
				const archive = _archives[i];
				getMementoUsingXMLHttpRequest(archive);
			}
		}
    };
}());