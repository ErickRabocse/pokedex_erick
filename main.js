// buscador de pokemones --> filtrar por nombre.
/* * *  POKEAPI * * */
let pokemonsSection = document.querySelector(".pokemons");
const pokeApi = fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151");
pokeApi
  .then((results) => results.json())
  .then((data) => {
    // Creating cards
    let results = data.results;
    showPokemons(results);
  })
  .catch((err) => console.log(err.message));

//DISPLAY ALL POKEMONS
const showPokemons = (results) => {
  results.forEach((element, index) => {
    pokeURL = fetch(`${element.url}`);
    pokeURL
      .then((results) => results.json())
      .then((data) => {
        let pokemonName = element.name;
        let pokeTypes = data.types[0].type.name;
        let pokeOrder = data.order;
        let pokeformURL = fetch(
          `https://pokeapi.co/api/v2/pokemon-form/${index + 1}/`
        );
        pokeformURL
          .then((info) => info.json())
          .then((data) => {
            let pokeForm = data.sprites.front_default;
            pokemonsSection.innerHTML += `
            <div class="card_container" id="card_box">
              <button class="pokeButton" id="${index}" onclick="showModal(this)" >${
              pokemonName.substring(0, 1).toUpperCase() +
              pokemonName.substring(1)
            }</button>
              <p>Order: ${pokeOrder}</p>
              <p>Type: ${pokeTypes}</p>
              <img src="${pokeForm}"/>
            </div>
            `;
          });
      });
  });

  // FILTER POKEMONS
  const inputName = document.querySelector(".input_search_name");
  const findBtn = document.querySelector(".search_name");

  const filterPokemon = () => {
    const inputPokeName = inputName.value.toLowerCase();
    results.filter((el, index) => {
      if (inputPokeName === el.name.toLowerCase()) {
        console.log(el.url);
        console.log("found it");
        pokemonsSection.innerHTML = "";
        //INSERT POKEMON
        let pokeURL = fetch(`${el.url}`);
        pokeURL
          .then((results) => results.json())
          .then((data) => {
            console.log(data);
            //CREATE POKEMON CARD
            let pokemonName = data.name;
            let pokeTypes = data.types[0].type.name;
            let pokeOrder = data.order;
            let pokeForm = data.sprites.front_default;
            pokemonsSection.innerHTML += `
            <div class="card_container" id="card_box">
              <button class="pokeButton" id="${index}" onclick="showModal(this)" >${
              pokemonName.substring(0, 1).toUpperCase() +
              pokemonName.substring(1)
            }</button>
              <p>Order: ${pokeOrder}</p>
              <p>Type: ${pokeTypes}</p>
              <img src="${pokeForm}"/>
            </div>
            `;
          });
        //BUTTON TOGGLE TO SHOW ALL POKEMONS AGAIN
        inputName.value = "";
        findBtn.innerText = "Show all";
        findBtn.style.backgroundColor = "red";
        findBtn.style.color = "white";
        findBtn.addEventListener("click", function () {
          window.location.reload(true);
        });
      }
    });
  };
  findBtn.addEventListener("click", filterPokemon);

  //FILTER TYPES
  const inputType = document.querySelector(".input_search_type");
  const typeBtn = document.querySelector(".search_type");

  const filterType = () => {
    const inputPokeType = inputType.value.toLowerCase();
    results.filter((el, index) => {
      console.log("This is el: ", el);
      console.log(el.url);
      console.log("found it");
      pokemonsSection.innerHTML = "";
      //INSERT POKEMON
      let pokeURL = fetch(`${el.url}`);
      pokeURL
        .then((results) => results.json())
        .then((data) => {
          //CHECKING IF THE POKEMON TYPE MATCHES THE SEARCH
          if (inputPokeType !== data.types[0].type.name) {
            return;
          } else if (inputPokeType === data.types[0].type.name) {
            //CREATE POKEMON CARD
            let pokemonName = data.name;
            let pokeTypes = data.types[0].type.name;
            let pokeOrder = data.order;
            let pokeForm = data.sprites.front_default;
            pokemonsSection.innerHTML += `
            <div class="card_container" id="card_box">
              <button class="pokeButton" id="${index}" onclick="showModal(this)" >${
              pokemonName.substring(0, 1).toUpperCase() +
              pokemonName.substring(1)
            }</button>
              <p>Order: ${pokeOrder}</p>
              <p>Type: ${pokeTypes}</p>
              <img src="${pokeForm}"/>
            </div>
            `;
          }
        });
      //CLEARING INPUT TYPE (NO TOGGLE BUTTON)
      inputType.value = "";
    });
  };
  typeBtn.addEventListener("click", filterType);
};

//* * *  DISPLAYS MODALS * * *
function showModal(el) {
  console.log("hi");
  console.log("this is el: ", el);
  let id = el.id;
  fetch(`https://pokeapi.co/api/v2/pokemon/${Number(id) + 1}/`)
    .then((res) => res.json())
    .then((data) => {
      let pokeMoves = data.moves;
      let arrayOfMoves = Array.from(pokeMoves);
      let showMoves = "";
      arrayOfMoves.forEach((move) => {
        showMoves += `${move.move.name} | `;
      });

      let modalBox = `
  <section class="modal">
    <div class="modal_container">
      <img src="${data.sprites.front_default}" class="modal_img" width="250">
      <p class="modal_name"><strong>NAME:</strong> ${data.name}</p>
      <p class="modal_order"><strong>ORDER:</strong> ${data.order}</p>
      <p class="modal_type"><strong>TYPE:</strong> ${
        data.types[0].type.name
      }</p>
            <p class="modal_weight"><strong>WEIGHT:</strong> ${parseFloat(
              data.weight
            )}</p>
      <p class="modal_moves"><strong>MOVES:</strong> ${showMoves}</p>
      <a href="#" class="modal_close">Close</a>
    </div>
  </section>
  `;
      pokemonsSection.insertAdjacentHTML("beforebegin", modalBox);
      //scrolls to the top of the site
      window.scrollTo(0, 0);
      //close btn
      const closeBtn = document.querySelector(".modal_close");
      const modalWindow = document.querySelector(".modal");
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modalWindow.remove();
      });
    });
}
