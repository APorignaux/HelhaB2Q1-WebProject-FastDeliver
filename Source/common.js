const h1GoBackHome = document.querySelector('#goBackHome');
const refreshInterval = 55 * 60 * 1000; // 55 minutes in millisec


async function fetchNewToken() {
    const token = localStorage.getItem('refreshToken');
    const authtoken = localStorage.getItem('authtoken');
    if (!token) {
        throw new Error('No refresh token available');
    }

    const refreshResponse = await fetch('/RefreshToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authtoken
        },
        body: JSON.stringify({
            'refresh': token
        })
    });

    if (!refreshResponse.ok) {
        const errorData = await refreshResponse.json();
        throw new Error(errorData.error || 'Unknown error');
    }

    const refreshData = await refreshResponse.json();
    localStorage.setItem('authtoken', refreshData.accessToken);
}



setInterval(async () => {
    try {
        console.log('Refreshing token...');
        await fetchNewToken();
        console.log('Token refreshed successfully');
    } catch (error) {
        console.error('Error refreshing token:', error);
    }
}, refreshInterval);

h1GoBackHome.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '/index.html';
});