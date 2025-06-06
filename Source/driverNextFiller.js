const currentDeliveryTemplate= document.body.querySelector('#currentDeliveryTemplate');
const currentDeliverycore = document.body.querySelector('#current-delivery-core-info');
const currentDeliveryDiv = document.body.querySelector('#currentDeliveryDiv');
const currentDeliveryId = document.body.querySelector('#packageNumber');

const noDeliveryDiv = document.body.querySelector('#NoDeliveriesDiv');

const nextDeliveryTemplate = document.body.querySelector('#nextDeliveryTemplate');
const nextDeliveryCore = document.body.querySelector('#next-delivery-core-info');
const nextDeliveryDiv = document.body.querySelector('#nextDeliveryDiv');

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const livreurMail = params.get('user');

async function fetchCurrentDelivery() {
    currentDeliverycore.innerHTML = '';
    const response = await fetch('/Livraisons', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
            'email' : livreurMail
        }
    });

    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
    }

    const DeliveryData = await response.json();
    const delivery = DeliveryData.results;
    let driverDeliveries = [];

    const responseClient = await fetch('/Client', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
            'email' : livreurMail
        }
    });

    if(!responseClient.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
    }

    const ClientData = await responseClient.json();
    const client = ClientData.results;
    let currentClient = undefined;
    console.log(delivery);
    //chercher dans les livraisons celle qui appartient au livreur connecté et la plus recente
    Object.values(delivery).forEach(deliveryItem => {       //Object.value() fais une liste avec un JSON Output: ['John', 30, 'New York']
        if (deliveryItem.Livreur == livreurMail && deliveryItem.Status !== 'Livré' && deliveryItem.Status !== 'Problème') {         //deliveryItem représente une paire clé-valeur ex,  Livreur: 'emma@fastdeliver.com'
            driverDeliveries.push(deliveryItem);
        }
    });

    if (driverDeliveries.length === 0) {
        noDeliveryDiv.classList.remove('hidden');
        currentDeliveryDiv.classList.add('hidden');
        nextDeliveryDiv.classList.add('hidden');
        console.log('No current deliveries found for the driver.');
        return;
    }

    // Sort deliveries by date from earliest to latest
    driverDeliveries.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    console.log(driverDeliveries);
    // fill current delivery

    const currentDelivery = driverDeliveries[0];
    const currentDeliveryRow = currentDeliveryTemplate.content.cloneNode(true);

    //find the right client
    Object.values(client).forEach(clientItem => {
        if(clientItem.Email === currentDelivery.ClientEmail){
            currentClient = clientItem;
        }
    });

    const currentDeliveryTrackId = currentDeliveryDiv.querySelector('#packageNumber');
    currentDeliveryTrackId.innerHTML = currentDelivery.NumSuivis;

    const currentDeliveryName = currentDeliveryRow.querySelector('.current-delivery-name');
    currentDeliveryName.innerHTML = currentClient.Nom;    //table client

    const currentDeliveryphone = currentDeliveryRow.querySelector('.current-delivery-phone');
    currentDeliveryphone.innerHTML = currentClient.Telephone;   //table client

    const currentDeliveryAddress = currentDeliveryRow.querySelector('.current-delivery-address');
    currentDeliveryAddress.innerHTML = currentDelivery.Addresse;

    const currentDeliveryInstructions = currentDeliveryRow.querySelector('.current-delivery-instructions');
    currentDeliveryInstructions.innerHTML = currentDelivery.Instructions;

    currentDeliverycore.appendChild(currentDeliveryRow);
}

async function fetchNextDelivery() {
    nextDeliveryCore.innerHTML = '';
    const response = await fetch('/Livraisons', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
            'email' : livreurMail
        }
    });

    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
    }

    const DeliveryData = await response.json();
    let delivery = DeliveryData.results;

    // remove all non 'en attente' deliveries && filtering for the driver
    delivery = delivery.filter(deliveryItem => deliveryItem.Status === 'En attente');
    delivery = delivery.filter(deliveryItem => deliveryItem.Livreur === livreurMail);
    // remove the first one
    delivery.shift();

    nextDeliveryCore.innerHTML = '';
    for(let i = 0; i < delivery.length; i++){
        const deliveryItem = delivery[i];

        const nextDeliveryRow = nextDeliveryTemplate.content.cloneNode(true);

        const nextDeliveryTrackId = nextDeliveryRow.querySelector('.delivery-tracking-number');
        nextDeliveryTrackId.innerHTML = deliveryItem.NumSuivis;

        const nextDeliveryAddress = nextDeliveryRow.querySelector('.delivery-address');
        nextDeliveryAddress.innerHTML = deliveryItem.Addresse;

        nextDeliveryCore.appendChild(nextDeliveryRow);
    }

}

window.onload = function() {
    fetchCurrentDelivery();
    fetchNextDelivery();
};