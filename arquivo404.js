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

	var _messagesMap = new Map([ 
		['en', '<a href="{archivedURL}">View an archived version of the page from {day} {monthLong}, {year} at {archiveName}</a>'],
		['pt', '<a href="{archivedURL}">Visite uma vers&atild;o anterior desta p&aacute;gina de {day} {monthLong}, {year} no {archiveName}.</a>'] 
	]);

	// List of archives to try
	// timeout in miliseconds
	var _archives = [
		{ timeout: 2000, archiveName: "Arquivo.pt", archiveApiUrl: "https://arquivo.pt/wayback/timemap/link/" } , 
		//{ timeout: 5000, archiveName: "Internet Archive", archiveApiUrl: "https://cors-anywhere.herokuapp.com/http://web.archive.org/web/timemap/link/" }
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
			['year', date.getFullYear()],
			['month', date.getMonth()],
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
			var mementoLines = mementoResponse.split(/\r?\n/);
			const linesCount = mementoLines.length;
			if (linesCount >= 2) {
				const lastMemento = mementoLines[linesCount-2];

				const archivedURL = getArchivedURL(lastMemento)
				const date = getMementoDate(lastMemento)

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

		// Array of other arrays that have two element each
		// Example:
		//   .messages([
		//         ['pt', '<a href="{archivedURL}">Visite uma versão anterior desta página de {day} {monthLong}, {year} no {archiveName}.</a>'],
		//         ['en', '<a href="{archivedURL}">Visit an earlier version of this page from {day} {monthLong}, {year} at {archiveName}.</a>'],
		//      ])
		messages : function(langMessagesMap) {
			_messagesMap = new Map(langMessagesMap);
			return this;
		},

		// Force show message on specific language
		language : function(language) {
			_language = language;
			return this;
		},

		// Only use a single message for all language.
		// Example:
		//   .message('You can view an archived versions on <a href="{archivedURL}">{archivedURL}</a>');
		message : function(message) {
			_messagesMap = new Map([ ['', message] ]);
			return this;
		},

		// Add a language message
		// Example:
		//   .addMessage('pt', 'You can view an archived versions on <a href="{archivedURL}">{archivedURL}</a>');
		addMessage : function(language, message) {
			_messagesMap.set(language, message);
		},

		// Id of the element to write the message
		messageElementId : function(messageElementId) {
			_messageElementId = messageElementId;
			return this;
		},

		// A prototype with archiveApiUrl, archiveName and timeout or a single URL of the Memento API
		// Example:
		//   .addArchive( {timeout: 2000, archiveName: "Arquivo.pt Preprod", archiveApiUrl: "https://preprod.arquivo.pt/wayback/timemap/link/"} )
		addArchive : function(archive) {
			// timeout: 2000, archiveName: "Arquivo.pt", archiveApiUrl
			const o = archive.hasOwnProperty('archiveApiUrl') ? archive : {'archiveApiUrl' : archive} ;
			_archives.push(o)
			return this;
		},

		// Replace current archive with this one
		archive : function(archive) {
			_archives = [];
			this.addArchive(archive);
			return this;
		},

		// Change url to search on web archives instead of the current page.
		url : function(url) {
			_url = url;
			return this;
		},

		// method to be called to start the web archives search.
		call : function (url) {
			for ( let i = 0 ; i < _archives.length ; i ++) {
				const archive = _archives[i];
				getMementoUsingXMLHttpRequest(archive);
			}
		}
    };
}());
