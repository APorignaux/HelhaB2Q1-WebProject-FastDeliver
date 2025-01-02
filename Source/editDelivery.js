let deliveryTrackingNum = -1;
let livreurName = -1;
//Livraison
const inputTrackingNum = document.body.querySelector('#trackingNum');  //Livraisons
const inputExpeditionDate = document.body.querySelector('#dateExpedition');    //Livraisons
const inputPoids = document.body.querySelector('#poids');   //Livraisons
const inputStatus = document.body.querySelector('#statut'); //Livraisons
const headerTrackingNum = document.body.querySelector('#headerTrackNum');

//Client
const inputName = document.body.querySelector('#name'); //Client
const inputEmail = document.body.querySelector('#email');   //Client
const inputPhone = document.body.querySelector('#phone');   //Client
const inputExpeditionAddress = document.body.querySelector('#expeditionAddress');

//Livreur
const inputDriver = document.body.querySelector('#livreur-nom');    //user
const inputDriverNote = document.body.querySelector('#livreur-notes');  //Livaison

function getDeliveryTrackingNum() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if(params.has('deliveryID'))
    {
        deliveryTrackingNum = params.get('deliveryID');
        console.log("ID retrieved successfully: " + deliveryTrackingNum);
        fetchDeliveryInfos(deliveryTrackingNum);
    }
    else if(params.has('newDeliveryID'))
    {
        deliveryTrackingNum = params.get('newDeliveryID');
        console.log("New ID generated successfully: " + deliveryTrackingNum);
        inputTrackingNum.value = deliveryTrackingNum;
    }
    else console.log("ID non existant");
}

async function fetchDeliveryInfos(trackingNum) {
    fetch('/Livraisons/' + trackingNum)
        .then(response => response.json())
        .then(data => {
            const delivery = data.result;
            console.log(delivery);

            inputTrackingNum.value = delivery.NumSuivis;
            headerTrackingNum.innerHTML = delivery.NumSuivis;
            inputExpeditionDate.value = new Date(delivery.Date).toISOString().substring(0, 10);
            inputPoids.value = delivery.Poids;
            inputStatus.value = delivery.Status;

            if(delivery.Instructions === null) inputDriverNote.innerText = "Pas de notes";
            else inputDriverNote.innerText = delivery.Instructions;

            const clientEmail = delivery.ClientEmail;
            livreurName = delivery.Livreur;

            return fetch('/Client/' + clientEmail);
        })
        .then(responseClient => responseClient.json())
        .then(dataClient => {
            const client = dataClient.result;

            inputName.value = client.Nom;
            inputEmail.value = client.Email;
            inputPhone.value = client.Telephone;
            inputExpeditionAddress.value = client.Addresse;

            return fetch('/Livreur/' + livreurName);
        })
        .then(responseDriver => responseDriver.json())
        .then(dataDriver => {
            const driver = dataDriver.result;

            inputDriver.value = driver.Nom;
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error occurred while filling the input.");
        });
}

window.onload = function() {
    getDeliveryTrackingNum()
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            // Your code to handle form submission
            alert('Form submission prevented.');
        });
    });
};

/*
// same code using .then() instead of async/await

 */

/*
// fetchDeliveryInfo using async/await
        try {
            //Livraisons
            console.log(trackingNum);
            const response = await fetch('/Livraisons/' + trackingNum);
            const data = await response.json();
            const delivery = data.result;

            console.log(delivery);


            inputTrackingNum.value = delivery.NumSuivis;
            inputExpeditionDate.value = new Date(delivery.Date).toISOString().substring(0, 10);
            inputPoids.value = delivery.Poids;
            inputStatus.value = delivery.Status;

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
        alert("Error occured while filling the input.");
    }
 */