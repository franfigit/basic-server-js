console.log("Hola mundo")

window.addEventListener('load', () =>{ //Espera que la página termine de cargarse para hacer que el botón funcione.
    const submitButton = document.querySelector('#submit')
    submitButton?.addEventListener('click', (event)=>{
        event.preventDefault()
        const name = document.querySelector('#name').value // Asigno a la const name lo que haya en el campo #name de http
        const email = document.querySelector('#email').value
        const mensaje = document.querySelector('#message').value
        if(name !== '' && email !== '' && mensaje !== ''){
            document.querySelector('#user-name').innerHTML = name // Asigno lo que contenga la const name a la etiqueta #user-name
            document.querySelector('#user-email').innerHTML = email
            document.querySelector('#user-message').innerHTML = mensaje
            guardaForm(name,email,mensaje)

        } else {
            document.querySelector('#error').classList.add('#show-error')
        }
    })
})