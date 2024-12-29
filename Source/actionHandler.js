let deliveryObjectToFetch = {};

function cancelButtonRedirection() {
    window.location.href = 'admin.html';
}

async function registerButtonHandler(trackingNum) {
    try{
        let driver = whoIsTheDriver(document.querySelector('#livreur-nom').value);
        console.log(document.querySelector('#livreur-nom').value);
        deliveryObjectToFetch =
            {
                "NumSuivis": document.querySelector('#trackingNum').value,
                "Date": document.querySelector('#dateExpedition').value,
                "ClientEmail": document.querySelector('#email').value,
                "Addresse": document.querySelector('#expeditionAddress').value,
                "Poids": document.querySelector('#poids').value,
                "Status": document.querySelector('#statut').value,
                "Livreur": driver,
                "Instructions": document.querySelector('#livreur-notes').value || "Pas de notes"
            }
        const data = deliveryObjectToFetch;
        console.log(data);
       const deleteResponse = await fetch('/Livraisons/' + trackingNum, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(deleteResponse.ok){
            console.log("Delivery deleted successfully");
            await formsSubmiter(data);
            window.location.href = 'admin.html';
        }else{
            throw new Error(data.error || "Une erreur inconnue est survenue");
        }
    }catch (error) {
        console.error("Erreur :", error);
        alert("Erreur. Impossible de d'actualiser la livraison.");
    }
}

async function formsSubmiter(object){

        const response = await fetch('/Livraisons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        });

        const result = await response.json();
        if (response.ok) {
            alert("update successful");
            deliveryObjectToFetch = {}
        } else {
            alert(result.message || 'update failed');
        }
}

function whoIsTheDriver(driverName) {
    if (driverName === "Emma Roux") return "emma@fastdeliver.com";
    else if (driverName === "Marc Bernard") return "marc@fastdeliver.com";
    else if (driverName === "Lucas Dubois") return "lucas@fastdeliver.com";
    else throw new Error("Livreur inconnu");
}

