document.addEventListener('DOMContentLoaded',fetchParks)
document.addEventListener('DOMContentLoaded', loadStates)
document.addEventListener('DOMContentLoaded', loadActivities)

//Static Elements *********************
let parkIds = [];
let allParks = document.querySelector('a.nav-link.active');
const containerDiv = document.querySelector('div#park-cards');
const firstDiv = document.querySelector('div#first-col');
const secondDiv = document.querySelector('div#second-col');
const dropdownStates = document.querySelector('ul.dropdown-menu');
const dropdownActivity = document.querySelector('ul.dropdown-menu#activities')
const dropdownMenu = document.querySelector('li.nav-item.dropdown');
let activities = [];
let uniqueActivities = [];
let alternator = 0;
let stateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

//Event Listeners ***********
allParks.addEventListener('click', displayAll)
dropdownStates.addEventListener('click', filterByState)
dropdownActivity.addEventListener('click', filterByActivity)



//Add all state coades to dropdown menu in navbar
function loadStates() {
    dropdownStates.innerHTML = "";
    stateCodes.forEach(appendDropdown)
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
            //console.log(data)
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
    let likeBtn = document.createElement('btn');
    likeBtn.className = 'btn';
    

    if(park.images.length > 0){
    
        parkImg.src = park.images[0].url;
        
        h5.textContent = park.fullName;
        p.textContent = park.description;

        divCardBody.append(h5, p, parkBtn, likeBtn, lineBreak);
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
function appendDropdown(item) {
    //console.log(state)
    let li = document.createElement('li');
    let dropdownItem = document.createElement('a');
    dropdownItem.className = "dropdown-item";

    dropdownItem.textContent = item;
    li.append(dropdownItem);

    if (item.length > 2){
        dropdownActivity.append(li)
    }
    else {

        dropdownStates.append(li);
    }
}



function filterByState(e) {
    containerDiv.innerHTML = ""
    let dropdownState = e.target.innerText;

    fetch(`http://localhost:3000/parks`)
    .then(resp => resp.json())
    .then(data => data.forEach(obj => {
        let parkState = obj.states
        
        if (parkState.includes(dropdownState)){
            appendPark(obj);
            document.querySelector('h1').textContent = dropdownState + " " + "Parks"
        }
    }))
}

//filters by the activity dropdown selected and displays all parks that have selected activity as one
function filterByActivity(e) {
    containerDiv.innerHTML = ""
    let dropdownItem = e.target.innerText

    fetch(`http://localhost:3000/parks`)
    .then(resp => resp.json())
    .then(data => data.forEach(obj => {
        let parkActivities = obj.activities
        parkActivities.forEach(act => {
            let parkAct = act.name
            if(parkAct === dropdownItem){
                appendPark(obj)
                document.querySelector('h1').textContent = `Parks with ${dropdownItem}`
            }
        })
    }))
}

//loads all activities from all parks and pushes them to an array, then passes only the unique values to separate unique array, which is used to populate the activites dropdown
function loadActivities() {
    fetch(`http://localhost:3000/parks`)
    .then(resp => resp.json())
    .then(data =>{ 
        data.forEach(obj =>{ 
            let activityArr = obj.activities;
            activityArr.forEach(act =>{
                let parkActivity = act.name;

                activities.push(parkActivity);
            })
        })
        //make array contain only unique activities
        uniqueActivities = [...new Set(activities)]
        dropdownActivity.innerHTML = ""
        uniqueActivities.forEach(appendDropdown)
  })
}
//likes to make top parks
//sort parks by state in dropdown