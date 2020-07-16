# Web archive not found 404 fallback

Web archive not found HTTP status 404 ECMAScript handler that uses Memento API (rfc 7089).

## Use 

On the place where you want to have the message.
```js
<script type="text/javascript" src="arquivo404.js" async defer onload="ARQUIVO_NOT_FOUND_404.call();"></script>
```

## Customizations

On a new function initialize by calling other methods before.

```js
<script type="text/javascript">
  function start404() {
    ARQUIVO_NOT_FOUND_404
      .messages([['pt', '<a href="{archivedURL}">Visite uma versão anterior desta página de {day} {monthLong}, {year}.</a>']])
      .call();
  }
</script>
<script type="text/javascript" src="arquivo404.js" async defer onload="start404();"></script>
```

| Method | Description | Arguments |
| -- | -- | -- |
| message | Only use a specific message. | message |
| addMessage | Add a language message | language, message | 
| messages | Array of other arrays that have two element each | Array of pairs language-message, eg. [['pt','Message in PT'],['en','Message in EN']]
| language | Force show message on specific language | language |
| messageElementId | Id of the element to write the message | messageElementId |
| addArchive | Add web archive | A prototype with archiveApiUrl, archiveName and timeout or a single URL of the Memento API |
| archive | Add a new web archive and remove default one | Replace current archive with this one |
| url | Change url to searhc on web archives instead of the current one. | Change url to search on web archives instead of the current page. |


## Web Archive
By default uses the Arquivo.pt Memento API, but any other could be used, if its CORS allow it configuration.

## CORS
Requires that the Memento API have an allowed CORS policy.
In practive the web archive server should return the response HTTP header: \"Access-Control-Allow-Origin: \*\"
