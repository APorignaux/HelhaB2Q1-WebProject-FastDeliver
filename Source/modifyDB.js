async function deleteDelivery(element) {
    const deliveryId = element.innerText;
    try {
        const response = await fetch('/Livraisons/' + deliveryId, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
                'email': localStorage.getItem('email')
            }
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Unknown error');
        }

        const data = await response.json();

        if (response.ok) {
            alert("Livraison supprimée");
            element.closest('tr').remove();
        } else {
            throw new Error(data.error || "Une erreur inconnue est survenue");
        }
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur. Impossible de supprimer la livraison.");
    }
}

async function modifyDelivery(element) {
    const deliveryId = element.innerText;
    window.location.href = '/modifyDelivery.html?id=' + deliveryId;
}