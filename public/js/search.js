let movieSearch = document.querySelector('.search-input');
let searchWrapper = document.querySelector('.search-wrapper');
let searchedMovies = document.querySelector('.searched-movies');



movieSearch.addEventListener('keyup', async function(e){
let name = movieSearch.value;
let nameUp = name.toUpperCase()

searchedMovies.style.display = 'block';

console.log(e);

if(e.key === 'Backspace'){
            if(movieSearch.value === ''){
                searchedMovies.style.display = 'none';
            }
        }



console.log(nameUp);

try{
      const res = await fetch('/genesix/movie-search',{
        method: 'POST',
        body: JSON.stringify({nameUp}),
        headers: {'Content-Type':'application/json'}
        })

        let datas = await res.json();
        let result = await datas.all;

        searchWrapper.innerHTML = '';
        

        if(result.length > 0){
            searchWrapper.style.display = 'block';
            result.forEach(single => {
                searchWrapper.innerHTML += `<div class="movie-search">
                                <div class="movie-wrapper">
                                    <div><img src="/Movies/${single.image}" alt=""></div>
                                    <a href="/genesix/${single._id}">
                                        <div class="title">
                                            <div>Title: <span>${single.title}</span></div>
                                            <div>${single.year}</div>
                                            <div class="quality">${single.quality}</div>
                                        </div>
                                    </a>
                                </div>
                            </div>`;
            });
        }else{
            
            searchWrapper.innerHTML = 'no result found';
            searchWrapper.style.color = '#fff';
            searchWrapper.style.display = 'flex';
            searchWrapper.style.justifyContent = 'center';
            searchWrapper.style.alignItems = 'center';
            
        }

}
catch(err){
    console.log(err.message)
}

})