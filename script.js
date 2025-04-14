function getUserLocation(){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude
            resolve({lat, lon});
        },  error => {
            reject('Location access denied', error)
        })
    })
}

async function getCountryCode(lat, lon){
    const apiKey = 'pk.3351a15efd4d628c08b6f7611d957d77';

    try {
        const apiLink = await fetch(`https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json&`)
        const apiData = await apiLink.json()
        console.log(apiData.address.country_code)
    }catch(err) {
        console.error('Something went wrong:', err)
    }
}

async function fetchLocationAndCountry(){
    try {
        const {lat, lon} = await getUserLocation()
        await getCountryCode(lat, lon);
    } catch (err){
        console.error(err)
    }
}

fetchLocationAndCountry()

async function getMovieApi() {
    const apiKey = 'e36770cdb42c075e2599fed112cce5c5'
    try {
        const movieApiLink = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=barbie`)
        const movieData = await movieApiLink.json()
        console.log(movieData)
    } catch (err){
        console.error(err);
    }
}

getMovieApi()