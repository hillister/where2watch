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

        return apiData.address.country_code
    }catch(err) {
        console.error('Something went wrong:', err)
    }
}

async function getMovieApi(movie, countryCode) {
    const apiKey = 'e36770cdb42c075e2599fed112cce5c5'
    try {
        const movieApiLink = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`)
        const movieData = await movieApiLink.json()
        const movieID = await movieData.results[0].id 

        const watchProvider = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=${apiKey}`)
        const watchProviderData = await watchProvider.json()

        console.log(movieData.results[0].original_title)
        console.log(movieData.results[0].overview)
        console.log(movieData.results[0].poster_path)

        const freeStream = watchProviderData.results[countryCode.toUpperCase()].flatrate;
        const buyToStream = watchProviderData.results[countryCode.toUpperCase()].buy;


        for(let i=0; i < freeStream.length; i++){
            console.log(freeStream[i].provider_name)
            console.log(freeStream[i].logo_path)

        }


        for(let i=0; i < buyToStream.length; i++){
            console.log(buyToStream[i].provider_name)
            console.log(buyToStream[i].logo_path)
        }

    } catch (err){
        console.error(err);
    }
}



const btn = document.querySelector('button');
const input = document.querySelector('input');

btn.addEventListener('click', async () => {
    const movieName = input.value
    const {lat, lon} = await getUserLocation()
    const countryCode = await getCountryCode(lat, lon);

    getMovieApi(movieName, countryCode);
})

