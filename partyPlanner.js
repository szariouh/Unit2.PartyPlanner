const EVENTS_URI = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2308-ACC-PT-WEB-PT-A/events"

const state = {
    events: [],
};

const partiesList = document.querySelector('#display-parties');
const formElement = document.querySelector('#create-party')
formElement.addEventListener("submit", createParty);

//GET EVENTS
const getParties = async () => {
    try {
        const response = await fetch(EVENTS_URI);
        const json = await response.json();
        const parties = json.data;
        if(json.error){
            throw new Error(json.error);
        }
        state.events = parties;
    } catch (error) {
        console.error(error)
    }
};

//POST EVENT
//name, time, location, description
async function createParty(event){
    try {         
        event.preventDefault();
        const partyObj = {
            name: formElement.name.value,
            description: formElement.description.value,
            date: new Date(formElement.dateTime.value).toISOString(),
            location: formElement.location.value
        };
        
        const response = await fetch(EVENTS_URI, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(partyObj),
        });
        const json = await response.json();
        if(json.error){
            throw new Error(json.error);
        }
        init();
    }catch(error){
        console.error(error)
    }
}

//DELETE EVENT

const deleteParty = async (id) => {
    try {
        const response = await fetch(`${EVENTS_URI}/${id}`, { method: "DELETE", });
        if (!response.ok) {
            throw new Error("Party could not be deleted.");
          }
        init();
       
    } catch (error) {
        console.error(error);
    }
};

function renderEvents() {
    if(!state.events || !state.events.length){
        partiesList.innerHTML = "<h1>No events found!!!</h1>";
       return;
    }

    const partyItems = state.events.map(party =>{
        const partyItem = document.createElement("li");  
        partyItem.classList.add("party");          
        partyItem.innerHTML =                           
        `
        <h2>${party.name}</h2>
        <p>ID: ${party.id}</p>
        <p>${party.description}<p>
        <p>Date: ${party.date}</p>
        <p>Location: ${party.location}</p>
        `;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Party";
        deleteButton.classList.add("deleteButton")
        partyItem.append(deleteButton);


        deleteButton.addEventListener("click", () => deleteParty(party.id))


        return partyItem;
    });
    partiesList.replaceChildren(...partyItems);
}

const init = async () => {
    await getParties();
    renderEvents();
};

// ...

init();
