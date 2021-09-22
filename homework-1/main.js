const baseUrl = "https://api.themoviedb.org/3";
const apiKey = "c2149a8b65bb3175e4ad8360b41427b5";
const previous = document.querySelector("#previous");
const nextBtn = document.querySelector("#next");
const searchInput = document.querySelector("#movie-search");

let pageNumber = 1;
let totalPage = 1;
document.querySelector(".pages").onclick = async (e) => {
  const targetVal = e.target.id;
  if (targetVal === "next" && totalPage !== 500) {
    if (pageNumber !== 0 && pageNumber < totalPage - 1) {
      pageNumber++;

      const [data] = await fetchMovies(pageNumber, searchInput.value);

      print(data);
    }
  } else if (targetVal === "previous") {
    if (pageNumber !== 1 && pageNumber < totalPage) {
      pageNumber--;
      const [data] = await fetchMovies(pageNumber, searchInput.value);
      print(data);
    }
  }
};

const listItems = document.querySelector(".list-items");

//* Process of pulling data from API

async function fetchMovies(currentPage, searchTitle) {
  const url =
    searchTitle === undefined
      ? `${baseUrl}/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_watch_monetization_types=flatrate`
      : `${baseUrl}/search/movie?api_key=${apiKey}&query=${searchTitle}&language=en-US&page=${currentPage}&include_adult=false`;

  const req = await fetch(url);
  const data = await req.json();
  if (data.total_pages !== 0) {
    print(data.results);
    totalPage = data.total_pages;
    pageButtonStyleChanger();
    return [data.results, null];
  } else {
    alert("Geçerli bir arama yap");
  }
}

//* data from input

(async () => {
  const [data] = await fetchMovies();
  pageButtonStyleChanger();
  print(data);
  searchInput.addEventListener("keypress", (e) => {
    const searchValue = e.target.value.trim().toLowerCase();

    pageButtonStyleChanger();

    if (searchValue && e.key === "Enter") {
      pageButtonStyleChanger();
      fetchMovies(data, searchValue);
      pageNumber = 1;
    }
  });
})();

//* Function where data is returned and printed to the screen

const print = (arr) => {
  listItems.innerHTML = "";
  arr.map((item) => {
    let listitem = document.createElement("li");
    listitem.className = "list-item";
    listitem.id = item.id;
    listitem.innerHTML = `
         <div class="back-opacity">
           <div class="image">
           
             <img  src= ${
               item.poster_path === null
                 ? "https://cloud.filmfed.com/defaults/movie-poster/l_movie_poster_default.png"
                 : `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${item.poster_path}`
             } 
              title="${item.title}" >
          </div>
          <div class="card-content">
            <div class="title">  
               <p>${
                 item.title.length < 62
                   ? item.title
                   : `${item.title.slice(0, 62)} ...`
               }</p>
               <div class="point-card">
                 <p class="point"  >${item.vote_average}</p>   
               </div>
              </div> 
               <div class="date">         
                <time>${
                  item.release_date === undefined || ""
                    ? "Undefined time"
                    : item.release_date.slice(0, 4)
                }</time>
              </div>   
             </div>     
          </div>
          ${
            item.overview === ""
              ? null
              : `  <div class="about">
  <h4>Overview:</h4>
  <br />
   ${item.overview} 
 </div> 
    `
          }`;
    listItems.appendChild(listitem);

    //* Color setting of scoring piece

    (() => {
      let point = document.querySelector(".point");

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

const pageButtonStyleChanger = () => {
  nextBtn.style.cursor = `${
    pageNumber !== totalPage - 1 &&
    totalPage !== 500 &&
    totalPage !== 0 &&
    totalPage !== 1
      ? "pointer"
      : "not-allowed"
  }`;
  nextBtn.style.background = `${
    pageNumber !== totalPage - 1 &&
    totalPage !== 500 &&
    totalPage !== 0 &&
    totalPage !== 1
      ? ""
      : "gray"
  }`;
  previous.style.cursor = `${pageNumber !== 1 ? "pointer" : "not-allowed"}`;
  previous.style.background = `${pageNumber !== 1 ? "" : "gray"}`;
};
