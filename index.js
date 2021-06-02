document.addEventListener('DOMContentLoaded',fetchParks)
document.addEventListener('DOMContentLoaded',getStuff)
// let API_KEY = 'rYwtc500ImXhDQftDD2SbP96hTQsrzGQYYqs6WJZ'
// let parkCode = 'acad'
// function getStuff()
// {
//     fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${API_KEY}`).then(resp=>resp.json()).then(console.log)
// }


let parkIds = [];


//fetches the list of liked parks and passes them to the function populateMenu to filter and append the liked parks
function getStuff()
{
    fetch(`http://localhost:3000/likes`).then(resp=>resp.json()).then(data => populateMenu(data))
}


//fetches all parks and pushes each parks id to the parkIds array
function fetchParks(){
    fetch(`http://localhost:3000/parks`)
    .then(resp => resp.json())
    .then(data => data.forEach(likedParks))
}


//create an array with all the park ids
function likedParks(obj){
    parkIds.push(obj.id)
}


//filters parks for parks that have been liked
function populateMenu(parkArray)
{
    parkArray.forEach(obj => {
        let likedParkId = obj.parkId
        //console.log(likedParkId)
        //console.log(parkIds)
        parkIds.forEach(id => {
            if (id === likedParkId){
                console.log(`here is the id ${id}`)
                 fetch(`http://localhost:3000/parks/${id}`)
                 .then(resp => resp.json())
                 .then(park => appendPark(park))
            }
        })
    })
    
    //console.log(parkArray)
    

    

}

//append park to DOM
function appendPark(park){
    let div = document.createElement('div');
    let h2 = document.createElement('h2');

    h2.textContent = park.fullName;

    div.append(h2);

    document.querySelector('body').append(div);
}

//likes to make top parks
//sort parks by state in dropdown