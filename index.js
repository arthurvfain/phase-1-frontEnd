document.addEventListener('DOMContentLoaded',getStuff)
let API_KEY = 'rYwtc500ImXhDQftDD2SbP96hTQsrzGQYYqs6WJZ'
let parkCode = 'acad'
function getStuff()
{
    fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${API_KEY}`).then(resp=>resp.json()).then(console.log)
}