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

        const title = document.getElementById('title');
        title.innerHTML = movieData.results[0].original_title;

        const description = document.getElementById('description');
        description.innerHTML = movieData.results[0].overview;

        
        const posterDIV = document.querySelector('#poster');
        posterDIV.innerHTML = '';

        const posterURL = movieData.results[0].poster_path;
        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w400${posterURL}`;
        posterDIV.appendChild(poster);

        const watchProvider = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=${apiKey}`)
        const watchProviderData = await watchProvider.json()

        

        const countryData = watchProviderData.results[countryCode.toUpperCase()]
        console.log(countryData)
        if(countryData){
            const freeStream = countryData.flatrate || [];
            const toRent = countryData.rent || [];
            const buyToStream = countryData.buy || [];

            if(freeStream.length > 0 || toRent.length > 0 || buyToStream.length > 0){
                const freeRow = document.querySelector('#freeStream .provider-row');
                const buyRow = document.querySelector('#buyStream .provider-row');
                freeRow.innerHTML = '';
                buyRow.innerHTML = '';
                
                const shownProviders = new Set();

                if(buyToStream.length > 0){
                    for(let i=0; i < buyToStream.length; i++){
                        const id = buyToStream[i].provider_id;
                        if(shownProviders.has(id)) continue;
                        shownProviders.add(id);

                        const providerBuy = buyToStream[i].provider_name;
                        const buyElement = document.createElement('div')
                        buyElement.innerHTML = providerBuy;

                        const logoPath = buyToStream[i].logo_path;
                        const logo = document.createElement('img');
                        logo.classList.add('logoImg')
                        logo.src = `https://image.tmdb.org/t/p/w92${logoPath}`


                        const wrapper = document.createElement('div');
                        wrapper.classList.add('provider')
                        wrapper.appendChild(logo);
                        wrapper.appendChild(buyElement)

                        buyRow.appendChild(wrapper)            
                    }    
                } 

                if(freeStream.length > 0){
                    for(let i=0; i < freeStream.length; i++){
                        const id = freeStream[i].provider_id;
                        if(shownProviders.has(id)) continue;
                        shownProviders.add(id);

                        const provider = freeStream[i].provider_name;
                        const providerElement = document.createElement('div');
                        providerElement.innerHTML = provider;

                        const logoPath = freeStream[i].logo_path;
                        const logo = document.createElement('img');
                        logo.classList.add('logoImg')
                        logo.src = `https://image.tmdb.org/t/p/w92${logoPath}`

                        const wrapper = document.createElement('div');
                        wrapper.classList.add('provider')
                        wrapper.appendChild(logo);
                        wrapper.appendChild(providerElement)
                        freeRow.appendChild(wrapper)        
                    }
                }

                if(toRent.length > 0){
                    for(let i=0; i < toRent.length; i++){
                        const id = toRent[i].provider_id;
                        if(shownProviders.has(id)) continue;
                        shownProviders.add(id);

                        const providerRent = toRent[i].provider_name;
                        const rentElement = document.createElement('div')
                        rentElement.innerHTML = providerRent;

                        const logoPath = toRent[i].logo_path;
                        const logo = document.createElement('img');
                        logo.classList.add('logoImg')
                        logo.src = `https://image.tmdb.org/t/p/w92${logoPath}`
                        

                        const wrapper = document.createElement('div');
                        wrapper.classList.add('provider')
                        wrapper.appendChild(logo);
                        wrapper.appendChild(rentElement)
                        freeRow.appendChild(wrapper) 
                    }
                }

            } else {
                console.log('No streaming services available')
            }
        } else {
            console.log('No country data available')
        }
        
    } catch (err){
        console.error(err);
    }
}



const btn = document.querySelector('button');
const input = document.querySelector('input');

async function handleSearch() {
    const movieName = input.value
    const {lat, lon} = await getUserLocation()
    const countryCode = await getCountryCode(lat, lon);

    const labels = document.querySelectorAll('.label')
    labels.forEach(label => {
        label.style.visibility = 'visible';
    });

    getMovieApi(movieName, countryCode);
};



btn.addEventListener('click', handleSearch);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});