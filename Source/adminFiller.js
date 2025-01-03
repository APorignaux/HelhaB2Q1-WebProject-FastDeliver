const deliveryTemplate = document.querySelector('#delivery-row-template');
const Table = document.querySelector('#tableBody');

const selectstatus = document.querySelector('#selectStatus');
const dateFilter = document.querySelector('#colisDate');

const searchBar = document.querySelector('#searchBarColis');

async function fetchDeliveries() {
    try{
        Table.innerHTML = '';

        const response = await fetch('/Livraisons',{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
                'email' : "admin@fastdeliver.com"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Unknown error');
        }

        const data = await response.json(); //le methode json est asynchrone et retourne un promesse
        const deliveries = data.results;

        for (let i = 0; i < deliveries.length; i++) {
            const delivery = deliveries[i];
            const deliveryRow = deliveryTemplate.content.cloneNode(true);//crée un clone du template pour chaque livraison

            const deliveryTrackId = deliveryRow.querySelector('.tracking-number');
            deliveryTrackId.innerHTML = delivery.NumSuivis;

            const deliveryDate = deliveryRow.querySelector('.date');
            deliveryDate.innerHTML = delivery.Date;

            const deliveryClient = deliveryRow.querySelector('.client');
            deliveryClient.innerHTML = delivery.ClientEmail;

            const deliveryAddress = deliveryRow.querySelector('.address');
            deliveryAddress.innerHTML = delivery.Addresse;

            const deliveryPoids = deliveryRow.querySelector('.poids');
            deliveryPoids.innerHTML = delivery.Poids;

            const deliveryStatus = deliveryRow.querySelector('.status');
            deliveryStatus.innerHTML = delivery.Status;

            const deliveryPerson = deliveryRow.querySelector('.delivery-person');
            deliveryPerson.innerHTML = delivery.Livreur;

            Table.appendChild(deliveryRow);
        }
    }catch (error) {
        console.error("Erreur :", error);
        alert("Erreur. Impossible de charger les livraisons, " + error);
    }
}

function filterDeliveries() {
    const status = selectstatus.value;
    const date = dateFilter.value;

    const rows = Table.querySelectorAll('tr');
    rows.forEach(row => {
        const statusCell = row.querySelector('.status');
        const dateCell = row.querySelector('.date');

        const rowStatus = statusCell.innerHTML.toLowerCase();
        const rowDate = dateCell.innerHTML;

        //console.log("row :" + rowDate, rowDate == date,"filter :" + date );
        console.log("row :" + rowStatus, rowStatus == status,"filter :" + status );

        if ((status === 'Tous les Status' || status === rowStatus) && (date === '' || date === rowDate)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function searchDeliveries() {
    const search = searchBar.value.toLowerCase();

    const rows = Table.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let found = false;

        cells.forEach(cell => {
            if (cell.innerHTML.toLowerCase().includes(search)) {
                found = true;
            }
        });

        if (found) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

window.onload = fetchDeliveries;
window.onchange = filterDeliveries;
searchBar.addEventListener('keyup', searchDeliveries); //call the function if the user press a key