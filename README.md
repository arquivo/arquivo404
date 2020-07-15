# Web archive not found 404 fallback

Web archive not found HTTP status 404 ECMAScript handler that uses Memento API (rfc 7089).

By default uses the Arquivo.pt Memento API, but any other could be used, if its CORS allow it configuration.

## CORS
Requires that the Memento API have an allowed CORS policy.
In practive the web archive server should return the response HTTP header: \"Access-Control-Allow-Origin: \*\"

## Simples use

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

| Method | Description |
| -- | -- |
| messages | Array of other arrays that have two element each |
| language | Force show message on specific language |
| message | Only use specific message. |
| addMessage | Add a language message | 
| messageContainerId | Element to write the message |
| addArchive | Add web archive |
| archive | Add a new web archive and remove default one |
| url | Change url to searhc on web archives instead of the current one. |
