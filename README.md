# Soft 404 linker to Arquivo.pt

Script that adds a link to Arquivo.pt wayback if the current page URL is archived.
It uses the Arquivo.pt Memento API [rfc 7089](https://tools.ietf.org/html/rfc7089) to search the lastest available memento and adds a link to it if exists.

## Examples of fixed broken links
* https://andremourao.com/courses
* https://www.fccn.pt/SCCN/
* https://webcurator.ddns.net/?p=134
* https://sobre.arquivo.pt/sobre-o-arquivo/sobre-o-arquivo/objectivos-do-arquivo-da-web-portuguesa
* https://sobre.arquivo.pt/sobre/publicacoes-1/automatic-identification-and-preservation-of-r-d
* https://sobre.arquivo.pt/pt/acerca/funcionamento-do-arquivo-pt/arquitectura/
* https://sobre.arquivo.pt/pt/acerca/funcionamento-do-arquivo-pt/tecnologia/
* https://sobre.arquivo.pt/en/about/system-functioning/technology/
* https://sobre.arquivo.pt/en/about/system-functioning/architecture/

## Usage

### One-liner

The simplest use case is to add the script in the HTML section where you want the link and message to the archived page.
The script will then show the link to the archive if there is an archived version of the missing page.

```js
<script type="text/javascript" src="//arquivo.pt/arquivo404.js" async defer onload="ARQUIVO_NOT_FOUND_404.call();"></script>
```

### <a name="custom-messages"></a> Custom message and message placing


Place an empty div with a specific id (e.g. "arquivo404message") where you want the 404 message to appear:

```html
<div id="arquivo404message"></div>
```

Your customized message will show up there if there is an archived version of the missing page.
Then you load and initialize the arquivo404 JS code on the footer.

```js
<script type="text/javascript">
  function start404() {
    ARQUIVO_NOT_FOUND_404
      .messageElementId('arquivo404message')
      // uncomment the following line to test this script 
      //.url("https://sobre.arquivo.pt/colabore/actividades-de-investigacao-e-desenvolvimento/bolsas-1/bolsas")
      .addMessage('pt', '<a href="{archivedURL}">Visite uma versão arquivada desta página de {day} {monthLong}, {year}.</a>')
      .addMessage('en', '<a href="{archivedURL}">Visit an archived version of this page from {day} {monthLong}, {year}.</a>')
      .call();
  }
</script>

<!-- replace https://arquivo.pt/arquivo404.js with your self hosted script  -->
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js" async defer onload="start404();"></script>

...
</body>
```

A minimal functional example is available on [404-page-example.html](404-page-example.html)

## Parameters

Parameters can be passed to arquivo404 by calling the following functions with the desired parameters:
```js
ARQUIVO_NOT_FOUND_404
  .messageElementId('arquivo404message')
  .addMessage('pt', '<a href="{archivedURL}">Visite uma versão arquivada desta página de {day} {monthLong}, {year}.</a>')
  .call();
```

| Method | Description | Arguments | Example |
| -- | -- | -- | -- |
| messageElementId | Id of the element to write the message | messageElementId | `ARQUIVO_NOT_FOUND_404`<br>**`.messageElementId('arquivo404message')`**<br>`.call();` |
| message | Use this message[\*](#note1) regardless of language. | message | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('arquivo404message')`<br>**`.message('message for all languages')`**<br>`.call();` |
| addMessage | Add a message[\*](#note1) for a specific language | language, message | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('arquivo404message')`<br>**`.addMessage('en','english message')`<br>`.addMessage('pt','portuguese message')`**<br>`.call();` |
| language | Force show message on specific language | language | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('arquivo404message')`<br>`.addMessage('en','english message')`<br>`.addMessage('pt','portuguese message')`<br>**`.language('pt')`**<br>`.call();` |
| addArchive | Add web archive using the URL of the Memento API | url |  `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('arquivo404message')`<br>**`.archive('https://arquivo.pt/wayback/timemap/link/')`<br>**`.call();` |
| addArchive | Add web archive using an archive prototype[\*\*](#note2) | { <br>&nbsp;&nbsp;&nbsp;&nbsp;archiveApiUrl, <br>&nbsp;&nbsp;&nbsp;&nbsp;archiveName,<br>&nbsp;&nbsp;&nbsp;&nbsp;timeout <br>} | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('arquivo404message')`<br>**`.archive({`<br>&nbsp;&nbsp;&nbsp;&nbsp;`archiveApiUrl:'https://arquivo.pt/wayback/timemap/link/',`<br>&nbsp;&nbsp;&nbsp;&nbsp;`archiveName: 'Arquivo.pt',`<br>&nbsp;&nbsp;&nbsp;&nbsp;`timeout: 2000`<br>`})`<br>**`.call();`|

#### <a name="note1"></a> \* Message customization with tags
Messages can use tags between curly brackets to display dynamic information like the archived date, the archived URL or the archive's name. E.g.: <br>
`'<a href="{archivedURL}">Visit an earlier version of this page from {day} {monthLong}, {year} at {archiveName}.</a>'` <br>
A comprehensive list of all tags:

| Tag | Description |
| -- | -- |
| `archiveName` | The name of the web archive storing the archived page |
| `archivedURL` | The URL to the archived page |
| `year` | The year of the archived page |
| `month` | The month number (0-11) of the archived page |
| `monthLong` | The month name (e.g.: March) of the archived page |
| `day` | The day of the month of the archived page |
| `hour` | The hour of the erchived page |
| `minute` | The minute of the archived page |
| `second` | The second of the archived page |
| `millisecond` | The millisecond of the archived page |

[See a full example](#custom-messages)

#### <a name="note2"></a> \*\* Archive prototype
An archive prototype is an object with three properties:

| Property | Type | Description |
| -- | -- | -- |
| `archiveApiUrl` | `string` | The URL of the Memento API |
| `archiveName` | `string` | The name of the web archive, to be used with [message tags](#note1) |
| `timeout` | `number` | timeout (in milisseconds) for the API request |

If instead of adding another archive to arquivo404 one wishes to replace the default web archive (Arquivo.pt) with a custom one, the method `archive` should be used instead of `addArchive`.  

## Web Archive
By default uses the Arquivo.pt Memento API, but any other could be used, if the CORS of the web archive allow it.

## CORS
This javascript requires that the Memento API have an open CORS policy.
In practive the web archive server should return the response HTTP header: `Access-Control-Allow-Origin: *`
