/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable no-undef */
const ingredientTyping = document.querySelector('#ingredients');
const listIngredients = document.querySelector('#list-ingredients');
const submit = document.querySelector('#submit');
const listRecipes = document.querySelector('#list-recipes');
// function googleTranslateElementInit() {
//     new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
// }

function deleteIngredient(btnDelete) {
  listIngredients.removeChild(btnDelete.parentNode);
  if (listIngredients.children.length <= 4) {
    ingredientTyping.removeAttribute('disabled');
  }
}

function addIngredient(ingredient) {
  if (ingredient.value !== '') {
    const ingredientChosen = ingredient.value;
    const listIngredientsItem = document.createElement('li');
    listIngredientsItem.classList.add('list-group-item', 'px-3', 'mx-5', 'd-flex');
    listIngredientsItem.textContent = ingredientChosen;
    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.setAttribute('aria-label', 'Close');
    deleteBtn.classList.add('btn-close');
    deleteBtn.addEventListener('click', function () {
      deleteIngredient(this);
    });
    listIngredientsItem.appendChild(deleteBtn);
    listIngredients.appendChild(listIngredientsItem);
    ingredient.value = '';
    if (listIngredients.children.length === 4) {
      $('.toast').toast('show');
      ingredientTyping.setAttribute('disabled', '');
    }
  }
}

function viewRecipe(btn) {
  fetch(`https://api.spoonacular.com/recipes/${btn.dataset.id}/information?apiKey=ebe9a806e69e419db1144f6d4ccb2cc1`)
    .then((response) => response.json())
    .then((recipe) => {
      listRecipes.classList.add('d-flex', 'flex-column');
      listRecipes.innerHTML = `
      <div class="text-center">
        <h2 class="text-center">${recipe.title}</h2>
        <img class="img-fluid" src=${recipe.image}>
        <hr class="bg-info border-3 border-top border-info">
      </div>
      <div class="row">
          <div class="col-5">
              <h3>Liste des ingrédients</h3>
              <ul class="list-group" id="list-ingredients-recipe">
              </ul>
          </div>
          <div class="col-7">
              <h3>What to do :</h3>
              <ul class="list-group list-group-numbered list-group-flush d-flex flex-column justify-content-center" id="instructions">

              </ul>
          </div>
      </div>
      `;
      recipe.extendedIngredients.forEach((ingredient) => {
        const liIngredient = document.createElement('li');
        liIngredient.classList.add('list-group-item');
        liIngredient.textContent = ingredient.nameClean;
        document.querySelector('#list-ingredients-recipe').appendChild(liIngredient);
      });
      const instructions = recipe.instructions.split('.');
      instructions.forEach((instruction) => {
        if (instruction !== '') {
          const liInstruction = document.createElement('li');
          liInstruction.classList.add('list-group-item');
          liInstruction.textContent = instruction.replace(/<[^>]*>/g, '').trim();
          document.querySelector('#instructions').appendChild(liInstruction);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function searchRecipes() {
  listRecipes.classList.remove('d-flex', 'flex-column');
  const listIngredientsItems = document.querySelectorAll('#list-ingredients li');
  const tabIngredients = [];
  listIngredientsItems.forEach((element) => {
    tabIngredients.push(element.textContent);
  });
  const allIngredients = tabIngredients.toString();
  fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${allIngredients}&number=9&apiKey=ebe9a806e69e419db1144f6d4ccb2cc1`)
    .then((response) => response.json())
    .then((data) => {
      listRecipes.innerHTML = '';
      data.forEach((element) => {
        listRecipes.innerHTML += `
        <div class="d-flex justify-content-center mb-5">
          <div class="card" style="width: 18rem;">
              <img src=${element.image} class="card-img-top" alt="">
              <div class="card-body d-flex flex-column justify-content-between">
                  <h5 class="card-title">${element.title}</h5>
                  <a href="#" class="btn btn-primary view-recipe" data-id='${element.id}'>Go to recipe</a>
              </div>
          </div>
        </div>
        `;
      });
      const btnViewRecipe = document.querySelectorAll('.view-recipe');
      btnViewRecipe.forEach((element) => {
        element.addEventListener('click', function () {
          viewRecipe(this);
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

ingredientTyping.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addIngredient(this);
  }
});
submit.addEventListener('click', searchRecipes);
