document.addEventListener('DOMContentLoaded',fetchParks)
document.addEventListener('DOMContentLoaded', loadStates)


let parkIds = [];
let allParks = document.querySelector('a.nav-link.active');
const containerDiv = document.querySelector('div#park-cards');
const firstDiv = document.querySelector('div#first-col');
const secondDiv = document.querySelector('div#second-col');
const dropdownUl = document.querySelector('ul.dropdown-menu');
const dropdownMenu = document.querySelector('li.nav-item.dropdown');
let alternator = 0;
let stateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

//Event Listeners ***********
allParks.addEventListener('click', displayAll)
dropdownUl.addEventListener('click', filterByState)



//Add all state coades to dropdown menu in navbar
function loadStates() {
    dropdownUl.innerHTML = "";
    stateCodes.forEach(appendStates)
}
    
    


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
        containerDiv.innerHTML = ""
        data.forEach(likedParks);
        getStuff();
    })

}

function displayAll() {
    fetch(`http://localhost:3000/parks`)
    .then(resp => resp.json())
    .then(data => {
        document.querySelector('h1').textContent = "All Parks"
        containerDiv.innerHTML = "";
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
    divCard.className = "card";
    let parkImg = document.createElement('img');
    parkImg.className = "card-img-top";
    let divCardBody = document.createElement('div');
    divCardBody.className = "card-body";
    //divCardBody.id = 'card-booty'
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

        divCardBody.append(h5, p, parkBtn, lineBreak);
        divCard.append(parkImg, divCardBody);
        containerDiv.append(divCard);
        console.log('iran!')
        // if (alternator % 2 === 0) {
        //     divCardBody.append(h5, p, parkBtn, lineBreak);
        //     divCard.append(parkImg, divCardBody);
        //     firstDiv.append(divCard);
            

        // }
        // else{
        //     divCardBody.append(h5, p, parkBtn, lineBreak);
        //     divCard.append(parkImg, divCardBody);
        //     secondDiv.append(divCard);
            
        // }
        
    }

    alternator++;
    
}

function loadParkPage(e) {
    let parkId = e.path[1].id;
    //console.log(e.path[1].id)

    fetch(`http://localhost:3000/parks/${parkId}`)
    .then(res => res.json())
    .then(data => window.open(data.url))
}

//appends state code to dropdown 
function appendStates(state) {
    //console.log(state)
    let li = document.createElement('li');
    let stateCode = document.createElement('a');
    stateCode.className = "dropdown-item";

    stateCode.textContent = state;
    li.append(stateCode);
    dropdownUl.append(li);
}



function filterByState(e) {
    containerDiv.innerHTML = ""
    let dropdownState = e.target.innerText;

    fetch(`http://localhost:3000/parks`)
    .then(resp => resp.json())
    .then(data => data.forEach(obj => {
        let parkState = obj.states
        
        if (parkState === dropdownState){
            appendPark(obj);
            document.querySelector('h1').textContent = dropdownState + " " + "Parks"
        }
    }))
}
//likes to make top parks
//sort parks by state in dropdown