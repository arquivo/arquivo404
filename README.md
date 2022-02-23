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

## Request Methods

The Arquivo404 script exports a globally scoped variable: `ARQUIVO_NOT_FOUND_404`. This object gives the developer methods to configure and costumize how arquivo404 searches for the missing web page and how it displays the archived page to the user.

| Method | Description | Arguments | Example |
| -- | -- | -- | -- |
| messageElementId | Sets the id of the HTML element to write the message. If none is given, a new `<div>` will be created for this purpose. It will be appended to the parent of the `<script>` element that was used to load this script. | messageElementId : `string` | `ARQUIVO_NOT_FOUND_404`<br>**`.messageElementId('messageDiv')`**<br>`.call();` |
| message | Sets the message to be displayed by arquivo404. | message : `string` | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.message('<a href="{archivedURL}">Visite uma versão arquivada desta página de {date}.</a>')`**<br>`.call();` |
| setDateFormatter | Configures the way dates should be formatted when using the `date` tag on messages. The default formatting is `YYYY-MM-DD`. `setDateFormatter`'s argument is a function that should accept a single javascript `Date` object and return a `string`.   | dateFormatter : `function` | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.setDateFormatter(date => [date.getMonth()+1, date.getDate() ,date.getFullYear()].join('/')) `**<br>`.message('<a href="{archivedURL}">Visite uma versão arquivada desta página de {date}.</a>')`<br>`.call();` |
| addArchive | Add a web archive compliant with the Memento API protocol to search for earlier versions of the missing page. By default, arquivo404 uses Arquivo.pt's web archive. The argument of this function should have 3 properties: <br> &nbsp;&nbsp;archiveApiUrl - URL to the timemap/link/ endpoint of the API. <br> &nbsp;&nbsp;archiveName - Archive name to be used with the ```archiveName``` tag in the message. <br> &nbsp;&nbsp;timeout - Timeout for the API request. | { <br>&nbsp;&nbsp;&nbsp;&nbsp;archiveApiUrl: `string`, <br>&nbsp;&nbsp;&nbsp;&nbsp;archiveName: `string`,<br>&nbsp;&nbsp;&nbsp;&nbsp;timeout: `number` <br>} | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.addArchive({`<br>&nbsp;&nbsp;&nbsp;&nbsp;`archiveApiUrl:'http://web.archive.org/web/timemap/link/',`<br>&nbsp;&nbsp;&nbsp;&nbsp;`archiveName: 'Internet Archive',`<br>&nbsp;&nbsp;&nbsp;&nbsp;`timeout: 2000`<br>`})`<br>**`.call();`|
| url | Specify the URL to search for in the web archives. If this method isn't used, arquivo404 will search for the URL in `window.location.href`. | url : `string` | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.url('https://example.com')`<br>**`.call();`|
| call | Starts the search for an archived version of the missing page |  -  | `ARQUIVO_NOT_FOUND_404`<br>**`.call()`**|

## Message Customization

Messages can use tags between curly brackets to display dynamic information like the archived date, the archived URL or the archive's name. E.g.: <br>
`'<a href="{archivedURL}">Visit an earlier version of this page from {date} at {archiveName}.</a>'` <br>
A comprehensive list of all tags:

| Tag | Description |
| -- | -- |
| `archiveName` | The name of the web archive storing the archived page |
| `archivedURL` | The URL to the archived page |
| `date` | The full date of the archived page. The default format is `YYYY-MM-DD`, but it can be configured using the `setDateFormatter` method. |



## Web Archive Configurations
By default uses the Arquivo.pt Memento API, but any other could be used, if the CORS of the web archive allow it.

### CORS
This javascript requires that the Memento API have an open CORS policy.
In practive the web archive server should return the response HTTP header: `Access-Control-Allow-Origin: *`

## Examples

### Placing the message on a specific element
Place an empty div with a specific id (e.g. "messageDiv") where you want the 404 message to appear:

```html
<div id="messageDiv"></div>
```

Your customized message will show up there if there is an archived version of the missing page.

```html
<script type="text/javascript">
  function start404() {
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
      .call();
  }
</script>
```

Then you load and initialize the arquivo404 JS code on the footer. the `onload` attribute of the script element should run your custom function.

```html
<!-- replace https://arquivo.pt/arquivo404.js with your self hosted script  -->
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js" async defer onload="start404();"></script>

...
</body>
```
### Costumizing the contents of the message

The message displayed by Arquivo404 be configured using the `message` method.

```html
<div id="messageDiv"></div>

...

<script type="text/javascript">
  function start404() {
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
      .message('Oops! The page you were searching for seems to be missing! <a href="{archivedURL}">Visit an archived version of the page from {date} at {archiveName}.</a>')
      .call();
  }
</script>

<!-- replace https://arquivo.pt/arquivo404.js with your self hosted script  -->
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js" async defer onload="start404();"></script>

...
</body>
```

### Specifying the URL to search for

Some web pages perform a full redirect to a custom 404 page, so arquivo404 would display archived versions of the 404 page rather than the original page.
If the server can identify the original URL that was requested and inject it on the 404 page, this issue can be solved:

```html
<div id="messageDiv"></div>

...

<script type="text/javascript">
  function start404() {
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
      .url(originalUrl) // Here we're assuming the original URL is stored in this variable
      .call();
  }
</script>

<!-- replace https://arquivo.pt/arquivo404.js with your self hosted script  -->
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js" async defer onload="start404();"></script>

...
</body>
```

### Customizing date format in the custom message

By default, the date is displayed in the `YYYY-MM-DD` format. This can be changed using the `setDateFormatter` method.

```html
<div id="messageDiv"></div>

...

<script type="text/javascript">
  function customDateFormatter(date){
    // formats the date into MM/DD/YYYY
    return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
  }

  function start404() {
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
      .setDateFormatter(customDateFormatter) 
      .message('<a href="{archivedURL}">Visite uma versão arquivada desta página de {date}.</a>')
      .call();
  }
</script>

<!-- replace https://arquivo.pt/arquivo404.js with your self hosted script  -->
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js" async defer onload="start404();"></script>

...
</body>
```

### Adding other archives to search for the missing page

Sometimes a missing page that isn't available in Arquivo.pt may be available in other archives. Arquivo404 allows the use of other archives if they implement the memento protocol.

```html
<div id="messageDiv"></div>

...

<script type="text/javascript">

  function start404() {
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
			.addArchive( {  // adding the Internet Archive 
        timeout: 6000, 
        archiveName: "Internet Archive", 
        archiveApiUrl: "http://web.archive.org/web/timemap/link/" // MUST point towards the timemap/link endpoint of the API.
      } ) 
      .call();
  }
</script>

<!-- replace https://arquivo.pt/arquivo404.js with your self hosted script  -->
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js" async defer onload="start404();"></script>

...
</body>
```

### A complete example

A functional example using all of the possible configurations is available on [404-page-example.html](404-page-example.html)

