const statesContainer = document.querySelector('#statesContainer');
const stateTemplate = document.querySelector('.delivery-state-model');

const deliveryDate = document.querySelector('#date');
const deliveryWeight = document.querySelector('#weight');
const deliveryClient = document.querySelector('#client');
const deliveryAddress = document.querySelector('#address');
const deliveryTrackingNum = document.querySelector('#trackingNum');
const delivryStatus = document.querySelector('#status');

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const NumSuivis = params.get('DeliveryID');

async function fillThePage(){
    const response = await fetch('/SuiviLivraison/' + NumSuivis, {
        headers :{
            'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
            'email': localStorage.getItem('email')
        }
    });
    const responseData = await response.json();
    const deliveryTrack = responseData.results;

    deliveryDate.innerHTML = deliveryTrack[deliveryTrack.length -1].DateEstimee;
    deliveryWeight.innerHTML = deliveryTrack[deliveryTrack.length -1].Poids;
    deliveryClient.innerHTML = deliveryTrack[deliveryTrack.length -1].ClientName;
    deliveryAddress.innerHTML = deliveryTrack[deliveryTrack.length -1].Addresse;
    deliveryTrackingNum.innerHTML = deliveryTrack[deliveryTrack.length -1].NumSuivis;
    delivryStatus.innerHTML = deliveryTrack[deliveryTrack.length -1].Status;

    statesContainer.innerHTML = '';
    for (let i = 0; i < deliveryTrack.length; i++) {
        const state = deliveryTrack[i];
        const stateRow = stateTemplate.content.cloneNode(true);

        const status = stateRow.querySelector('.progress-state');
        status.innerHTML = state.Status;

        const date = stateRow.querySelector('.progress-date');
        date.innerHTML = state.Date;

        const hour = stateRow.querySelector('.progress-hour');
        hour.innerHTML = state.Heure;

        const text = stateRow.querySelector('.progress-text');
        text.innerHTML = statusTextGenerator(state.Status);

        statesContainer.appendChild(stateRow);
    }
}

function statusTextGenerator(status){
    switch(status){
        case 'En attente':
            return 'votre colis est en attente de traitement';
        case 'En cours':
            return 'votre colis est en cours de livraison';
        case 'Livré':
            return 'votre colis a été livré';
        case 'Probleme':
            return 'nous avons rencontré un problème lors du traitement de votre colis';
        default:
            return 'Unknown';
    }
}

window.onload = fillThePage;

