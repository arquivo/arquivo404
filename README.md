# Soft 404 linker to Arquivo.pt

Script that adds a link to Arquivo.pt wayback if the current page URL is archived.
It uses the Arquivo.pt Memento API [rfc 7089](https://tools.ietf.org/html/rfc7089) to search the lastest available memento and adds a link to it if exists.

See it in action:
* https://sobre.arquivo.pt/sobre-o-arquivo/sobre-o-arquivo/objectivos-do-arquivo-da-web-portuguesa
* https://sobre.arquivo.pt/sobre/publicacoes-1/automatic-identification-and-preservation-of-r-d
* https://sobre.arquivo.pt/pt/acerca/funcionamento-do-arquivo-pt/arquitectura/
* https://sobre.arquivo.pt/pt/acerca/funcionamento-do-arquivo-pt/tecnologia/
* https://sobre.arquivo.pt/en/about/system-functioning/technology/
* https://sobre.arquivo.pt/en/about/system-functioning/architecture/

## Use 

The simplest use case is to add a script where we want to add the link (message) to the archived page.
```js
<script type="text/javascript" src="//arquivo.pt/arquivo404.js" async defer onload="ARQUIVO_NOT_FOUND_404.call();"></script>
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
<script type="text/javascript" src="//arquivo.pt/arquivo404.js" async defer onload="start404();"></script>
```

| Method | Description | Arguments |
| -- | -- | -- |
| message | Only use a specific message. | message |
| addMessage | Add a language message | language, message | 
| messages | Array of other arrays that have two element each | Array of pairs language-message, eg. `[['pt','Message in PT'],['en','Message in EN']]`
| language | Force show message on specific language | language |
| messageElementId | Id of the element to write the message | messageElementId |
| addArchive | Add web archive | A prototype with archiveApiUrl, archiveName and timeout or a single URL of the Memento API |
| archive | Add a new web archive and remove default one | Same as previous |
| url | Change url to searhc on web archives instead of the current one. | Change url to search on web archives instead of the current page. |

## Web Archive
By default uses the Arquivo.pt Memento API, but any other could be used, if the CORS of the web archive allow it.

## CORS
This javascript requires that the Memento API have an open CORS policy.
In practive the web archive server should return the response HTTP header: `Access-Control-Allow-Origin: *`
