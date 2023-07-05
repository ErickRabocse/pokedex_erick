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
              <p>Type: ${pokeTypes}</p>
              <img src="${pokeForm}"/>
            </div>
            `;
          });
      });
  });
};

function showModal(el) {
  let id = el.id;
  fetch(`https://pokeapi.co/api/v2/pokemon/${Number(id) + 1}/`)
    .then((res) => res.json())
    .then((data) => {
      // console.log("this is the data: ", data);
      let pokeMoves = data.moves;
      let arrayOfMoves = Array.from(pokeMoves);
      let showMoves = "";
      arrayOfMoves.forEach((move) => {
        // console.log(move.move.name);
        showMoves += `${move.move.name} | `;
      });

      let modalBox = `
  <section class="modal">
    <div class="modal_container">
      <img src="${data.sprites.front_default}" class="modal_img" width="250">
      <p class="modal_name"><strong>NAME:</strong> ${data.name}</p>
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
      // pokemonsSection.innerHTML = modalBox;
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
      //MODAL BOXES count
      console.log("This is a modal box: ", modalWindow);
    });
}
