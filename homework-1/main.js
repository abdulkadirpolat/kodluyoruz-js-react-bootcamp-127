const listItems = document.querySelector(".list-items");
const searhInput = document.querySelector("#movie-search");

const url = `https://api.themoviedb.org/3/discover/movie?api_key=c2149a8b65bb3175e4ad8360b41427b5&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=5&with_watch_monetization_types=flatrate`;

async function fetchMovies(url, pageNumber) {
  const req = await fetch(url);
  const data = await req.json();
  return [data.results, null];
}

(async () => {
  const [data] = await fetchMovies(url);

  print(data);

  searhInput.addEventListener("input", (e) => {
    e.preventDefault();
    const searchValue = e.target.value.trim().toLowerCase();
    print(filterValue(data, searchValue));
  });
})();

function filterValue(arr, value) {
  return arr.filter((mov) => mov.title.toLowerCase().includes(value));
}

const print = (arr) => {
  listItems.innerHTML = "";
  arr.map((item) => {
    let listitem = document.createElement("li");
    listitem.className = "list-item";
    listitem.id = item.id;
    listitem.innerHTML = `
         <div class="back-opacity">
           <div class="image">
           <img  src= "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${item.poster_path}"  
            title="${item.title}" >
          </div>
          <div class="card-content">
            <div class="title">  
               <p>${item.title}</p>
               <div class="point-card">
                 <p class="point"  >${item.vote_average}</p>   
               </div>
              </div> 
               <div class="date">         
                <time>${item.release_date.slice(0, 4)}</time>
              </div>   
             </div>     
          </div>
          <div class="about">
           ${
             item.overview.length < 240
               ? item.overview
               : `${item.overview.slice(0, 240)}...`
           } 
         </div> 
         `;
    listItems.appendChild(listitem);

    (() => {
      let point = document.querySelector(".point");
      console.log(item);
      if (item.vote_average >= 7) {
        return (point.className = "text-green");
      } else if (item.vote_average >= 5) {
        return (point.className = "text-blue");
      } else {
        return (point.className = "text-red");
      }
    })();
  });
};
