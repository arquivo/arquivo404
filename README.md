# Arquivo404: soft 404 linker to Arquivo.pt

Arquivo404 automatically fixes links to broken URLs.

If a broken URL on a given website was web-archived by [Arquivo.pt](https://arquivo.pt/?l=en), the arquivo404 script will generate a customizable message containing a link to its oldest web-archived version (memento). If the URL was not web-archived, then no message is presented.

It uses the [Arquivo.pt Memento API](https://github.com/arquivo/pwa-technologies/wiki/Memento--API) to search for the oldest web-archived version of the broken URL. 

Other web archives that support the [Memento protocol (rfc 7089)](https://datatracker.ietf.org/doc/html/rfc7089) can be added.

## Examples of links to broken URLs fixed with arquivo404
* https://www.fccn.pt/SCCN/
* https://www.nau.edu.pt/pt/entidades/administracao-publica/fct/
* https://www.b-on.pt/sobre/index.aspx?area_id=3
* https://www.b-on.pt/sobre/index.aspx
* https://www.cert.rcts.pt/pt/sobre/filiacao/
* https://www.cienciavitae.pt/destaques/
* https://www.cienciavitae.pt/uploads/2018/11/Poster_CI%C3%8ANCIAVITAE.pdf
* https://ifilnova.pt/pt/pages/nuno-venturinha
* https://andremourao.com/courses
* https://sobre.arquivo.pt/sobre-o-arquivo/sobre-o-arquivo/objectivos-do-arquivo-da-web-portuguesa
* https://sobre.arquivo.pt/sobre/publicacoes-1/automatic-identification-and-preservation-of-r-d
* https://sobre.arquivo.pt/pt/acerca/funcionamento-do-arquivo-pt/arquitectura/
* https://sobre.arquivo.pt/pt/acerca/funcionamento-do-arquivo-pt/tecnologia/
* https://sobre.arquivo.pt/en/about/system-functioning/technology/
* https://sobre.arquivo.pt/en/about/system-functioning/architecture/

## One-line installation

The simplest way to install the arquivo404 script is to include it in the HTML element where the message will be presented. Here are 2 examples of one-liners that display the Arquivo404 message in english and in portuguese, respectively. 

### EN 
```js
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js" async defer onload="ARQUIVO_NOT_FOUND_404.message('<a href=\'{archivedURL}\'>View an archived version of the page from {date} at {archiveName}</a>').call();"></script>
```

### PT
```js
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js" async defer onload="ARQUIVO_NOT_FOUND_404.call();"></script>
```


You may download the javacript file available at https://arquivo.pt/arquivo404.js to your web server and change the "src" attribute to its new path.


## Methods to customize arquivo404 search and message

The Arquivo404 script exports a globally scoped variable: `ARQUIVO_NOT_FOUND_404`. This object provides methods to customize how the arquivo404 script searches for the broken URL and the message presented to the users.

| Method | Description | Arguments | Example |
| -- | -- | -- | -- |
| messageElementId | Sets the id of the HTML element to write the message. If none is given, a new `<div>` will be created for this purpose. It will be appended to the parent of the `<script>` element that was used to load this script. | messageElementId : `string` | `ARQUIVO_NOT_FOUND_404`<br>**`.messageElementId('messageDiv')`**<br>`.call();` |
| message | Sets the message to be displayed by arquivo404. | message : `string` | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.message('<a href="{archivedURL}">View an archived version of the page from {date} at {archiveName}</a>')`**<br>`.call();` |
| setDateFormatter | Configures date format using the `date` tag on messages. The default formatting is `YYYY-MM-DD`. `setDateFormatter`'s argument is a function that receives a single javascript `Date` object and returns a `string`.   | dateFormatter : `function` | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.setDateFormatter(date => [date.getMonth()+1, date.getDate() ,date.getFullYear()].join('/')) `**<br>`.message('<a href="{archivedURL}">View an archived version of the page from {date} at {archiveName}</a>')`<br>`.call();` |
| addArchive | Adds a web archive compliant with the Memento API protocol to search for web-archived versions of the broken URL. By default, arquivo404 uses the Arquivo.pt web archive. The argument of this function should have 3 properties: <br> &nbsp;&nbsp;```archiveApiUrl``` - URL to the timemap/link/ endpoint of the API. <br> &nbsp;&nbsp;```archiveName``` - Archive name to be used with the ```archiveName``` tag in the message. <br> &nbsp;&nbsp;```timeout``` - Timeout for the API request. | { <br>&nbsp;&nbsp;&nbsp;&nbsp;archiveApiUrl: `string`, <br>&nbsp;&nbsp;&nbsp;&nbsp;archiveName: `string`,<br>&nbsp;&nbsp;&nbsp;&nbsp;timeout: `number` <br>} | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.addArchive({`<br>&nbsp;&nbsp;&nbsp;&nbsp;`archiveApiUrl:'http://web.archive.org/web/timemap/link/',`<br>&nbsp;&nbsp;&nbsp;&nbsp;`archiveName: 'Internet Archive',`<br>&nbsp;&nbsp;&nbsp;&nbsp;`timeout: 2000`<br>`})`<br>**`.call();`|
| url | Specifies a given URL to search in web archives. If this method isn't used, arquivo404 will search for the URL in `window.location.href`. | url : `string` | `ARQUIVO_NOT_FOUND_404`<br>`.messageElementId('messageDiv')`<br>**`.url('http://www.fccn.pt/SCCN/')`<br>**`.call();`|
| call | Executes the arquivo404 script |  -  | `ARQUIVO_NOT_FOUND_404`<br>**`.call()`**|

### Special tags for custom message

Messages can use tags between curly brackets to display the following dynamic information:

| Tag | Description |
| -- | -- |
| `archiveName` | The name of the web archive preserving the content of the broken URL |
| `archivedURL` | The URL that references the web-archived content|
| `date` | The date when the content was web-archived. The default format is `YYYY-MM-DD`, but it can be customized using the `setDateFormatter` method. |

## Usage examples

### Presenting the message within a specific HTML element


1. Import the arquivo404 script in the header of the soft 404 webpage:
```html
<head>
...
<script type="text/javascript" src="https://arquivo.pt/arquivo404.js"></script>
...
</head>
```

2. Create an empty ```<div>``` with a specific id (e.g. "messageDiv") where you want the arquivo404 message to be presented: 

```html
<body>
...
<div id="messageDiv"></div>
```

3. Customize the ```ARQUIVO_NOT_FOUND_404``` object using the ```messageElementId``` method to identify the created ```<div>``` and run arquivo404 script by invoking the ```call()``` method:

```html
<script type="text/javascript">
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
      .call();
</script>
...
</body>
```



### Customizing the message 

The message displayed by the arquivo404 script can be customized using the `message` method:

```html
<script type="text/javascript">
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
      .message('Oops! The page you were searching for seems to be missing! <a href="{archivedURL}">Visit an archived version of the page from {date} at {archiveName}.</a>')
      .call();
</script>
...
</body>
```


### Specifying a given URL to search in web archives

Some websites redirect broken links to a soft 404 page that looses track of the broken URL. 

In these cases, by default the arquivo404 script would search for web-archived versions of the soft 404 page, instead of the broken URL.

If the website could keep track of the broken URL that was requested and inject it in its soft 404 page using the ```url``` method, this issue would be solved:

```html
<script type="text/javascript">
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
      .url(originalUrl) // Here we're assuming the original URL is stored in this variable
      .call();
</script>
...
</body>
```

### Customizing date format in the message

By default, the date is displayed in the `YYYY-MM-DD` format. This can be changed using the `setDateFormatter` method:

```html
<script type="text/javascript">
  function customDateFormatter(date){
    // formats the date into MM/DD/YYYY
    return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
  }
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
      .setDateFormatter(customDateFormatter) 
      .message('<a href="{archivedURL}">View an archived version of the page from {date} at {archiveName}</a>')
      .call();
</script>
...
</body>
```

### Adding web archives to search for the broken URL


Sometimes a missing page that isn't available in Arquivo.pt may have been preserved by other archives such as the [Internet Archive](https://archive.org/). Arquivo404 supports adding web archives that support the Memento protocol.

```html
<script type="text/javascript">
    ARQUIVO_NOT_FOUND_404
      .messageElementId('messageDiv')
	.addArchive( {  // adding the Internet Archive 
        timeout: 6000, 
        archiveName: "Internet Archive", 
        archiveApiUrl: "http://web.archive.org/web/timemap/link/" // MUST point towards the timemap/link endpoint of the API.
      } ) 
      .call();
</script>
...
</body>
```

#### Web Archives must have CORS enabled

The arquivo404 javascript requires that the Memento API has an [open CORS policy](https://www.w3.org/wiki/CORS_Enabled).
In practice, the web archive server should respond with the HTTP header: `Access-Control-Allow-Origin: *`


### A complete example

A functional example using all of the possible configurations is available on [404-page-example.html](404-page-example.html)


