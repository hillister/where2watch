navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude
    
    async function getCountryCode(){
        const apiKey = 'pk.3351a15efd4d628c08b6f7611d957d77';
    
        try {
            const apiLink = await fetch(`https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json&`)
            const apiData = await apiLink.json()
            console.log(apiData)
            console.log(apiData.address.country_code)
        }catch(err) {
            console.error('Something went wrong:', err)
        }
    }

    getCountryCode();

}, error => {
    console.error('Location access denied', error)
});



