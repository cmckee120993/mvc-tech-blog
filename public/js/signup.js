async function signUp(event) {
    event.preventDefault();

    const username = document.querySelector('#username-create').value.trim();
    const email = document.querySelector('#email-create').value.trim();
    const password = document.querySelector('password-create').value.trim();
    
    if (username && email && password) {
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username, 
                email,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });

        if(response.ok) {
            console.log('New user created.');
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
};

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);