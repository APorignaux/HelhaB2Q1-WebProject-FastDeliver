document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(form.action, {
        method: form.method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
    }

    const result = await response.json();
    console.log(result);
    if (response.ok) {
        localStorage.setItem('authtoken', result.access_token);
        localStorage.setItem('refreshToken', result.refresh_Token);
        localStorage.setItem('email', result.email);
        window.location.href = result.redirect; // Redirect to the URL specified in the response
        alert("Login successful");
    } else {
        alert(result.message || 'Login failed');
    }
});

