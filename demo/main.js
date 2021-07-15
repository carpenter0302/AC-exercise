let button = document.querySelector('button')
let show = document.querySelector('#show')

button.addEventListener('click',function(){
    axios.get('https://api.lyrics.ovh/v1/coldplay/yellow')
    .then(function (response) {
        show.innerHTML = response.data.lyrics
    }).catch(function (error) {
        console.log(error)
    })
})

