

async function deletedelivery(element) {
    const deliveryId = element.innerText;
    try {
        const response = await fetch('/Livraisons/' + deliveryId, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
            alert("Livraison supprimée");
            element.closest('tr').remove();
        } else {
            alert(data.error || "Une erreur inconnue est survenue");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Erreur réseau. Impossible de supprimer la livraison.");
    }
}