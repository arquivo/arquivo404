# Arquivo404: soft 404 linker to Arquivo.pt

If the a broken URL was web-archived by [Arquivo.pt](https://arquivo.pt/?l=en), this script will generate a customizable message containing a link to its oldest web-archived version (memento).  
It uses the [Arquivo.pt Memento API](https://github.com/arquivo/pwa-technologies/wiki/Memento--API) to search for the oldest version memento of the URL. Other web archives that support the [Memento protocol (rfc 7089)](https://datatracker.ietf.org/doc/html/rfc7089) can be added.
If the URL was not web-archived, then no message is presented.

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

The simplest use case is to include the script in the HTML section where the message will be presented.

```js
<script type="text/javascript" src="//arquivo.pt/arquivo404.js" async defer onload="ARQUIVO_NOT_FOUND_404.call();"></script>
```

## Request Methods

The Arquivo404 script exports a globally scoped variable: `ARQUIVO_NOT_FOUND_404`. This object provides methods to costumize how the arquivo404 script searches for the broken URL and the message presented to the users.

| Method | Description | Arguments | Example |
| -- | -- | -- | -- |
| messageElementId | Sets the id of the HTML element to write the message. If none is given, a new `<div>` will be created for this purpose. It will be appended to the parent of the `<script>` element that was used to load this script. | messageElementId : `string` | `ARQUIVO_NOT_FOUND_404`<br>**`.messageElementId('messageDiv')`**<br>`.call();` |
| message | Sets the message to be displayed by arquivo404. | message : `string` | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.message('<a href="{archivedURL}">View an archived version of the page from {date} at {archiveName}</a>')`**<br>`.call();` |
| setDateFormatter | Configures date format using the `date` tag on messages. The default formatting is `YYYY-MM-DD`. `setDateFormatter`'s argument is a function that receives a single javascript `Date` object and returns a `string`.   | dateFormatter : `function` | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.setDateFormatter(date => [date.getMonth()+1, date.getDate() ,date.getFullYear()].join('/')) `**<br>`.message('<a href="{archivedURL}">View an archived version of the page from {date} at {archiveName}</a>')`<br>`.call();` |
| addArchive | Adds a web archive compliant with the Memento API protocol to search for web-archived versions of the broken URL. By default, arquivo404 uses the Arquivo.pt web archive. The argument of this function should have 3 properties: <br> &nbsp;&nbsp;```archiveApiUrl``` - URL to the timemap/link/ endpoint of the API. <br> &nbsp;&nbsp;```archiveName``` - Archive name to be used with the ```archiveName``` tag in the message. <br> &nbsp;&nbsp;```timeout``` - Timeout for the API request. | { <br>&nbsp;&nbsp;&nbsp;&nbsp;archiveApiUrl: `string`, <br>&nbsp;&nbsp;&nbsp;&nbsp;archiveName: `string`,<br>&nbsp;&nbsp;&nbsp;&nbsp;timeout: `number` <br>} | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.addArchive({`<br>&nbsp;&nbsp;&nbsp;&nbsp;`archiveApiUrl:'http://web.archive.org/web/timemap/link/',`<br>&nbsp;&nbsp;&nbsp;&nbsp;`archiveName: 'Internet Archive',`<br>&nbsp;&nbsp;&nbsp;&nbsp;`timeout: 2000`<br>`})`<br>**`.call();`|
| url | Specifies a given URL to search in web archives. If this method isn't used, arquivo404 will search for the URL in `window.location.href`. | url : `string` | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.url('http://www.fccn.pt/SCCN/')`<br>**`.call();`|
| call | Starts the search for an web-archived version of the broken URL |  -  | `ARQUIVO_NOT_FOUND_404`<br>**`.call()`**|

## Message Customization

Messages can use tags between curly brackets to display dynamic information like the ```archived date```, the ```archived URL``` or the ```web archive name```. For example: <br>
`'<a href="{archivedURL}">Visit an earlier version of this page from {date} at {archiveName}.</a>'`:<br>

| Tag | Description |
| -- | -- |
| `archiveName` | The name of the web archive storing the archived page |
| `archivedURL` | The URL that references the web-archived page |
| `date` | The full date of the archived page. The default format is `YYYY-MM-DD`, but it can be configured using the `setDateFormatter` method. |

## Examples

### Presenting the message within a specific HTML element
Place an empty ```<div>``` with a specific id (e.g. "messageDiv") where you want the 404 message to be presented:

```html
<div id="messageDiv"></div>
```

The customized message will be presented within this ```<div>``` element if there is an web-archived version of the missing page.

```html
<script type="text/javascript">
  function start404() {
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
      .call();
  }
</script>
```

Then you load and initialize the arquivo404 Javascript code on the footer. The `onload` attribute of the script element should run your custom function.

```html
<!-- replace https://arquivo.pt/arquivo404.js with your self hosted script  -->
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js" async defer onload="start404();"></script>

...
</body>
```
### Customizing the contents of the message

The message displayed by the arquivo404 script can be customized using the `message` method.

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

### Specifying the URL to search in web archives

Some websites redirect broken links to a soft 404 page that looses track of the original broken URL. In theses cases, by default the arquivo404 script would search for web-archived versions of the soft 404 page, instead of the broken URL.
If the website could keep track of the broken URL that was requested and inject it in its soft 404 page using the ```url```, this issue would be solved:

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

### Costumizing date format in the message

By default, the date is displayed in the `YYYY-MM-DD` format. This can be changed using the `setDateFormatter` method:

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
      .message('<a href="{archivedURL}">View an archived version of the page from {date} at {archiveName}</a>')
      .call();
  }
</script>

<!-- replace https://arquivo.pt/arquivo404.js with your self hosted script  -->
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js" async defer onload="start404();"></script>

...
</body>
```

### Adding web archives to search for the broken URL

Sometimes a missing page that isn't available in Arquivo.pt may have been preserved by other archives such as the [Internet Archive](https://archive.org/). Arquivo404 supports adding web archives that support the Memento protocol.

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

#### Web Archives must have CORS enabled

The arquivo404 javascript requires that the Memento API has an [open CORS policy](https://www.w3.org/wiki/CORS_Enabled).
In practive, the web archive server should return the response HTTP header: `Access-Control-Allow-Origin: *`


### A complete example

A functional example using all of the possible configurations is available on [404-page-example.html](404-page-example.html)


