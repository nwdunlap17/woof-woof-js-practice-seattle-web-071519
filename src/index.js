document.addEventListener('DOMContentLoaded',main)
const DOGURL = 'http://localhost:3000/pups'

function main(event){
    fetch(DOGURL)
    .then(res => res.json())
    .then(json => fillDoggoBar(json))

    document.getElementById('good-dog-filter').addEventListener('click',filterGoodDogs)
}

function filterGoodDogs(event){
    let filterButton = event.target
    if (filterButton.getAttribute('filtering') != 'true'){
        filterButton.setAttribute('filtering','true')
        filterButton.textContent = 'Filter good dogs: ON'
        fetch(DOGURL)
        .then(res => res.json())
        .then(json => json.filter(dog => dog.isGoodDog))
        .then(goodbois => fillDoggoBar(goodbois))


    } else {
        filterButton.textContent = 'Filter good dogs: OFF'
        filterButton.setAttribute('filtering','false')
        fetch(DOGURL)
        .then(res => res.json())
        .then(json => fillDoggoBar(json))
    }
}

function fillDoggoBar(json){
    let dogBar = document.getElementById("dog-bar") 

    while (!!dogBar.firstChild){
        dogBar.removeChild(dogBar.firstChild);
    }

    json.forEach(dog => {
        let dogcontainer = document.createElement("span");
        dogcontainer.setAttribute('dog-id',dog.id);
        dogcontainer.textContent = dog.name;
        dogBar.appendChild(dogcontainer)
        dogcontainer.addEventListener('click',clickDog)
    });
}

function clickDog(event){
    let dogId = event.target.getAttribute("dog-id");
    let address = `http://localhost:3000/pups/${dogId}`
    fetch(address)
    .then(res => res.json())
    .then(json => showDog(json))
}

function showDog(json){
    
    let dogHolder = document.getElementById("dog-info");
    while (!!dogHolder.firstChild){
        dogHolder.removeChild(dogHolder.firstChild);
    }
    
    dogHolder.setAttribute('dog-id',json.id)

    let dogPic = document.createElement("img")
    dogPic.setAttribute('src',json.image)
    dogHolder.appendChild(dogPic)
    
    let dogName = document.createElement("h2")
    dogName.textContent = json.name
    dogHolder.appendChild(dogName)

    let dogButton = document.createElement("button")
    if (json.isGoodDog){
        dogButton.textContent = 'Good Dog'
    } else {
        dogButton.textContent = 'Bad Dog'
    }
    dogButton.addEventListener('click',updateGoodness)
    dogHolder.appendChild(dogButton)
}

function updateGoodness(event){
    let dogId = event.target.parentElement.getAttribute('dog-id')
    
    let goodness

    fetch(`http://localhost:3000/pups/${dogId}`)
    .then(response => response.json()) 
    .then(
        json => {
        fetch(`http://localhost:3000/pups/${dogId}`,{
            method: 'PATCH',
            headers: {
                "Content-Type":'application/json'
            },
            body: JSON.stringify({
                'isGoodDog': !json.isGoodDog
            })
        })

        json.isGoodDog = !json.isGoodDog
        
        if (json.isGoodDog){
            event.target.textContent = 'Good Dog'
        } else {
            event.target.textContent = 'Bad Dog'
        }
    })


}