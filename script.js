const apiUrl = 'http://localhost:5000/api'; // Adjust this URL if needed

// Handle registration
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const response = await fetch(`${apiUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();
  if (response.ok) {
    document.getElementById('registerMessage').textContent = 'Registration successful!';
  } else {
    document.getElementById('registerMessage').textContent = data.msg;
  }
});

// Handle login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (response.ok) {
    document.getElementById('loginMessage').textContent = 'Login successful!';
    localStorage.setItem('token', data.token);
    document.getElementById('recipeForm').style.display = 'block'; // Show recipe form after login
    loadRecipes(); // Load saved recipes
  } else {
    document.getElementById('loginMessage').textContent = data.msg;
  }
});

// Handle saving a recipe
document.getElementById('recipeFormSubmit').addEventListener('submit', async function(e) {
  e.preventDefault();
  const title = document.getElementById('recipe-title').value;
  const ingredients = document.getElementById('recipe-ingredients').value;
  const token = localStorage.getItem('token');

  const response = await fetch(`${apiUrl}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token // Send token in the header
    },
    body: JSON.stringify({ title, ingredients })
  });

  const data = await response.json();
  if (response.ok) {
    document.getElementById('recipeMessage').textContent = 'Recipe saved!';
    loadRecipes(); // Reload recipes after saving
  } else {
    document.getElementById('recipeMessage').textContent = data.msg;
  }
});

// Load recipes for the logged-in user
async function loadRecipes() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${apiUrl}/recipes`, {
    method: 'GET',
    headers: {
      'x-auth-token': token // Send token in the header
    }
  });

  const recipes = await response.json();
  if (response.ok) {
    const recipeList = document.getElementById('recipes');
    recipeList.innerHTML = ''; // Clear any previous recipes

    recipes.forEach(recipe => {
      const li = document.createElement('li');
      li.textContent = `${recipe.title} - ${recipe.ingredients}`;
      recipeList.appendChild(li);
    });

    document.getElementById('recipeList').style.display = 'block'; // Show recipes section
  } else {
    console.error('Failed to load recipes');
  }
}
