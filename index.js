document.addEventListener('DOMContentLoaded',fetchParks)


let parkIds = [];
let allParks = document.querySelector('a.nav-link.active');
const containerDiv = document.querySelector('div#park-cards');
const firstDiv = document.querySelector('div#first-col');
const secondDiv = document.querySelector('div#second-col');
let alternator = 0;

//Event Listeners ***********
allParks.addEventListener('click', displayAll)



//fetches the list of liked parks and passes them to the function populateMenu to filter and append the liked parks
function getStuff()
{
    fetch(`http://localhost:3000/likes`).then(resp=>resp.json()).then(data => populateMenu(data))
}


//fetches all parks and pushes each parks id to the parkIds array
function fetchParks(){
    fetch(`http://localhost:3000/parks`)
    .then(resp => resp.json())
    .then(data => {
        parkIds = [];
        firstDiv.innerHTML = ""
        secondDiv.innerHTML = ""
        data.forEach(likedParks);
        getStuff();
    })

}

function displayAll() {
    fetch(`http://localhost:3000/parks`)
    .then(resp => resp.json())
    .then(data => {
        document.querySelector('h1').textContent = "All Parks"
        firstDiv.innerHTML = ""
        secondDiv.innerHTML = ""
        data.forEach(data => {
            console.log(data)
            appendPark(data)
    })
})
}


//create an array with all the park ids
function likedParks(obj){
    //console.log(obj.id)
    parkIds.push(obj.id)
    //console.log(parkIds);
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
                //console.log(`here is the id ${id}`)
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
    //console.log(park)
    

    let divCard = document.createElement('div');
    divCard.className = "card col-6";
    let parkImg = document.createElement('img');
    parkImg.className = "card-img-top";
    let divCardBody = document.createElement('div');
    divCardBody.className = "card-body";
    divCardBody.id = park.id
    let h5 = document.createElement('h5');
    h5.className = "card-title";
    let p = document.createElement('p');
    p.className = "card-text";
    let parkBtn = document.createElement('btn');
    parkBtn.className = "btn";
    let lineBreak = document.createElement('br');
    parkBtn.addEventListener('click', e => loadParkPage(e))
    parkBtn.innerHTML = "Park Site"

    if(park.images.length > 0){

        parkImg.src = park.images[0].url;
        
        h5.textContent = park.fullName;
        p.textContent = park.description;
        if (alternator % 2 === 0) {
            divCardBody.append(h5, p, parkBtn, lineBreak);
            divCard.append(parkImg, divCardBody);
            firstDiv.append(divCard);
            

        }
        else{
            divCardBody.append(h5, p, parkBtn, lineBreak);
            divCard.append(parkImg, divCardBody);
            secondDiv.append(divCard);
            
        }
        
    }

    alternator++;
    
}

function loadParkPage(e) {
    let parkId = e.path[1].id;

    fetch(`http://localhost:3000/parks/${parkId}`)
    .then(res => res.json())
    .then(data => window.open(data.url))
}

//likes to make top parks
//sort parks by state in dropdown