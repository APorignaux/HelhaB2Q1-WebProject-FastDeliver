const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const deliveryTrackingNum = params.get('deliveryID');

//Livraison
const inputTrackingNum = document.body.querySelector('#numéro-suivi');  //Livraisons
const inputExpeditionDate = document.body.querySelector('#date-expédition');    //Livraisons
const inputPoids = document.body.querySelector('#poids');   //Livraisons
const inputStatus = document.body.querySelector('#statut'); //Livraisons

//Client
const inputName = document.body.querySelector('#name'); //Client
const inputEmail = document.body.querySelector('#email');   //Client
const inputPhone = document.body.querySelector('#phone');   //Client

//Livreur
const inputDriver = document.body.querySelector('#livreur-nom');    //user
const inputDriverNote = document.body.querySelector('#livreur-notes');  //Livaison

async function fetchDeliveryInfos(deliveryId) {
    try {
        //Livraisons
        const response = await fetch(`/Livraisons/${deliveryId}`);
        const data = await response.json();
        const delivery = data.results;


        inputTrackingNum.value = delivery.NumSuivis;
        console.log(delivery.NumSuivis);
        inputExpeditionDate.value = new Date(delivery.date).toISOString().split('T')[0];
        inputPoids.value = delivery.Poids;
        console.log(delivery.Poids);
        inputStatus.value = delivery.Status;
        console.log(delivery.Status);

        const clientEmail = delivery.Email;

         //Client
        const responseClient = await fetch('/Client/' + clientEmail);
        const dataClient = await responseClient.json();
        const client = dataClient.results;

        inputName.value = client.Nom;
        inputEmail.value = client.Email;
        inputPhone.value = client.Telephone;

        const livreurName = delivery.Livreur;

        //Livreur
        const responseDriver = await fetch('/Livreur/' + livreurName);
        const dataDriver = await responseDriver.json();
        const driver = dataDriver.results;

        inputDriver.value = driver.Nom;
        inputDriverNote.value = delivery.Instructions;

        alert('fine');
    } catch (err) {
        console.error("Error:", err);
        alert("Error. Unable to reach delivery server.");
    }
}

window.onload = function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            // Your code to handle form submission
            alert('Form submission prevented.');
        });
    });
    fetchDeliveryInfos(deliveryTrackingNum);
};