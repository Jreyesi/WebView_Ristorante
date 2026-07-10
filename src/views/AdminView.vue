<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = ref([])
const menuItems = ref([])

// 'dashboard', 'categories_list', 'categories_add', 'menuitems_list', 'menuitems_add', 'about_change'
const currentView = ref('dashboard')

const newCategory = ref('')
const newItem = ref({
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  categoryId: ''
})
const newPrice = ref({ name: '', range: '', icon: '', desc: '' })
const aboutData = ref(null)
const contactData = ref(null)

const getHeaders = () => {
  const token = localStorage.getItem('adminToken')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

const handleAuthError = (res) => {
  if (res.status === 401 || res.status === 403) {
    logout()
    return true
  }
  return false
}

const logout = () => {
  localStorage.removeItem('adminToken')
  router.push('/login')
}

const fetchAbout = async () => {
  const res = await fetch('http://localhost:3000/api/about')
  if (res.ok) {
    aboutData.value = await res.json()
  }
}

const updateAbout = async () => {
  if (!aboutData.value) return
  const formData = new FormData()
  
  formData.append('title', aboutData.value.title)
  formData.append('intro', aboutData.value.intro)
  formData.append('body', aboutData.value.body)
  
  const fileInput = document.getElementById('id_aboutImageFile')
  if (aboutData.value.removeImage) {
    formData.append('removeImage', 'true')
  } else if (fileInput && fileInput.files[0]) {
    formData.append('imageFile', fileInput.files[0])
  } else if (aboutData.value.imageUrl) {
    formData.append('imageUrl', aboutData.value.imageUrl)
  }

  formData.append('val1Icon', aboutData.value.val1Icon)
  formData.append('val1Title', aboutData.value.val1Title)
  formData.append('val1Desc', aboutData.value.val1Desc)
  
  formData.append('val2Icon', aboutData.value.val2Icon)
  formData.append('val2Title', aboutData.value.val2Title)
  formData.append('val2Desc', aboutData.value.val2Desc)
  
  formData.append('val3Icon', aboutData.value.val3Icon)
  formData.append('val3Title', aboutData.value.val3Title)
  formData.append('val3Desc', aboutData.value.val3Desc)

  const token = localStorage.getItem('adminToken')
  const res = await fetch('http://localhost:3000/api/about', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  if (handleAuthError(res)) return
  if (fileInput) fileInput.value = ''
  currentView.value = 'dashboard'
}

const fetchContact = async () => {
  const res = await fetch('http://localhost:3000/api/contact')
  if (res.ok) {
    contactData.value = await res.json()
  }
}

const updateContact = async () => {
  if (!contactData.value) return
  const token = localStorage.getItem('adminToken')
  const res = await fetch('http://localhost:3000/api/contact', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      address: contactData.value.address,
      phone: contactData.value.phone,
      email: contactData.value.email,
      schedule: contactData.value.schedule
    })
  })
  if (handleAuthError(res)) return
  currentView.value = 'dashboard'
}

const fetchCategories = async () => {
  const res = await fetch('http://localhost:3000/api/categories')
  categories.value = await res.json()
}

const fetchMenuItems = async () => {
  const res = await fetch('http://localhost:3000/api/menu')
  menuItems.value = await res.json()
}

const prices = ref([])
const fetchPrices = async () => {
  const res = await fetch('http://localhost:3000/api/prices')
  prices.value = await res.json()
}

const addCategory = async () => {
  if (!newCategory.value) return
  const res = await fetch('http://localhost:3000/api/categories', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name: newCategory.value })
  })
  if (handleAuthError(res)) return
  newCategory.value = ''
  await fetchCategories()
  currentView.value = 'categories_list'
}

const deleteCategory = async (id) => {
  if (!confirm("Are you sure you want to delete this category?")) return;
  const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
  if (handleAuthError(res)) return
  if (!res.ok) {
    const errorData = await res.json()
    alert(errorData.error || 'Error deleting category')
    return
  }
  await fetchCategories()
}

const addItem = async () => {
  if (!newItem.value.title || !newItem.value.categoryId) return
  
  const formData = new FormData()
  formData.append('title', newItem.value.title)
  formData.append('description', newItem.value.description)
  formData.append('price', newItem.value.price)
  formData.append('categoryId', newItem.value.categoryId)
  
  const fileInput = document.getElementById('id_imageFile')
  if (fileInput && fileInput.files[0]) {
    formData.append('imageFile', fileInput.files[0])
  } else if (newItem.value.imageUrl) {
    formData.append('imageUrl', newItem.value.imageUrl)
  }

  const token = localStorage.getItem('adminToken')
  const res = await fetch('http://localhost:3000/api/menu', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  if (handleAuthError(res)) return
  
  newItem.value = { title: '', description: '', price: '', imageUrl: '', categoryId: '' }
  if (fileInput) fileInput.value = ''
  await fetchMenuItems()
  currentView.value = 'menuitems_list'
}

const deleteItem = async (id) => {
  if (!confirm("Are you sure you want to delete this item?")) return;
  const res = await fetch(`http://localhost:3000/api/menu/${id}`, { 
    method: 'DELETE',
    headers: getHeaders()
  })
  if (handleAuthError(res)) return
  fetchMenuItems()
}

const addPrice = async () => {
  if (!newPrice.value.name || !newPrice.value.range) return
  const res = await fetch('http://localhost:3000/api/prices', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(newPrice.value)
  })
  if (handleAuthError(res)) return
  newPrice.value = { name: '', range: '', icon: '', desc: '' }
  await fetchPrices()
  currentView.value = 'prices_list'
}

const deletePrice = async (id) => {
  if (!confirm("Are you sure you want to delete this price item?")) return;
  const res = await fetch(`http://localhost:3000/api/prices/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
  if (handleAuthError(res)) return
  await fetchPrices()
}

const getCategoryName = (id) => {
  const cat = categories.value.find(c => c.id === id)
  return cat ? cat.name : 'Unknown'
}

const viewAbout = async () => {
  await fetchAbout()
  currentView.value = 'about_change'
}

const viewContact = async () => {
  await fetchContact()
  currentView.value = 'contact_change'
}

onMounted(() => {
  fetchCategories()
  fetchMenuItems()
  fetchPrices()
})
</script>

<template>
  <div class="django-admin">
    <!-- Header -->
    <div id="header">
      <div id="branding">
        <h1 id="site-name">
          <a @click="currentView = 'dashboard'" style="cursor:pointer;">Administración de Ristorante</a>
        </h1>
      </div>
      <div id="user-tools">
        Welcome, <strong>admin</strong>.
        <router-link to="/">View site</router-link> /
        <a @click="logout" style="cursor:pointer;">Log out</a>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <a @click="currentView = 'dashboard'" style="cursor:pointer;">Home</a>
      <span v-if="currentView !== 'dashboard'">
        &rsaquo; <a @click="currentView = currentView.split('_')[0] + '_list'" style="cursor:pointer;">{{ currentView.includes('categories') ? 'Categories' : currentView.includes('menu') ? 'Menu items' : 'About' }}</a>
      </span>
      <span v-if="currentView.includes('add') || currentView === 'about_change'">
        &rsaquo; {{ currentView === 'about_change' ? 'Change' : 'Add' }}
      </span>
    </div>

    <!-- Content -->
    <div id="content" class="colMS">
      
      <!-- DASHBOARD VIEW -->
      <div v-if="currentView === 'dashboard'" id="content-main">
        <div class="app-ristorante module">
          <table>
            <caption>
              <a class="section" title="Models in the Ristorante application">Ristorante</a>
            </caption>
            <tbody>
              <tr class="model-category">
                <th scope="row"><a @click="currentView = 'categories_list'">Categories</a></th>
                <td><a @click="currentView = 'categories_add'" class="addlink">Add</a></td>
                <td><a @click="currentView = 'categories_list'" class="changelink">Change</a></td>
              </tr>
              <tr class="model-menuitem">
                <th scope="row"><a @click="currentView = 'menuitems_list'">Menu items</a></th>
                <td><a @click="currentView = 'menuitems_add'" class="addlink">Add</a></td>
                <td><a @click="currentView = 'menuitems_list'" class="changelink">Change</a></td>
              </tr>
              <tr class="model-price-item">
                <th scope="row"><a @click="currentView = 'prices_list'">Prices</a></th>
                <td><a @click="currentView = 'prices_add'" class="addlink">Add</a></td>
                <td><a @click="currentView = 'prices_list'" class="changelink">Change</a></td>
              </tr>
              <tr class="model-about">
                <th scope="row"><a @click="viewAbout">About</a></th>
                <td></td>
                <td><a @click="viewAbout" class="changelink">Change</a></td>
              </tr>
              <tr class="model-contact">
                <th scope="row"><a @click="viewContact">Contact Info</a></th>
                <td></td>
                <td><a @click="viewContact" class="changelink">Change</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CATEGORIES LIST VIEW -->
      <div v-if="currentView === 'categories_list'" id="content-main">
        <ul class="object-tools">
          <li><a @click="currentView = 'categories_add'" class="addlink">Add category</a></li>
        </ul>
        <div class="module" id="changelist">
          <table id="result_list">
            <thead>
              <tr>
                <th scope="col">
                  <div class="text"><a>Category</a></div>
                </th>
                <th scope="col">
                  <div class="text"><a>Action</a></div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cat, index) in categories" :key="cat.id" :class="index % 2 === 0 ? 'row1' : 'row2'">
                <th class="field-name"><a>{{ cat.name }}</a></th>
                <td class="field-action">
                  <a @click="deleteCategory(cat.id)" style="color: #ba2121; cursor: pointer; font-weight: bold;">Delete</a>
                </td>
              </tr>
              <tr v-if="categories.length === 0">
                <td style="padding: 10px;">0 categories found.</td>
              </tr>
            </tbody>
          </table>
          <p class="paginator">{{ categories.length }} categories</p>
        </div>
      </div>

      <!-- CATEGORY ADD VIEW -->
      <div v-if="currentView === 'categories_add'" id="content-main">
        <form @submit.prevent="addCategory">
          <div>
            <fieldset class="module aligned ">
              <div class="form-row field-name">
                <div>
                  <label class="required" for="id_name">Name:</label>
                  <input type="text" v-model="newCategory" id="id_name" required>
                </div>
              </div>
            </fieldset>
            <div class="submit-row">
              <input type="submit" value="Save" class="default" name="_save">
            </div>
          </div>
        </form>
      </div>

      <!-- MENU ITEMS LIST VIEW -->
      <div v-if="currentView === 'menuitems_list'" id="content-main">
        <ul class="object-tools">
          <li><a @click="currentView = 'menuitems_add'" class="addlink">Add menu item</a></li>
        </ul>
        <div class="module" id="changelist">
          <table id="result_list">
            <thead>
              <tr>
                <th scope="col"><div class="text"><a>Title</a></div></th>
                <th scope="col"><div class="text"><a>Category</a></div></th>
                <th scope="col"><div class="text"><a>Price</a></div></th>
                <th scope="col"><div class="text"><a>Action</a></div></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in menuItems" :key="item.id" :class="index % 2 === 0 ? 'row1' : 'row2'">
                <th class="field-title"><a>{{ item.title }}</a></th>
                <td class="field-category">{{ getCategoryName(item.categoryId) }}</td>
                <td class="field-price">{{ item.price }}</td>
                <td class="field-action">
                  <a @click="deleteItem(item.id)" style="color: #ba2121; cursor: pointer; font-weight: bold;">Delete</a>
                </td>
              </tr>
              <tr v-if="menuItems.length === 0">
                <td colspan="4" style="padding: 10px;">0 menu items found.</td>
              </tr>
            </tbody>
          </table>
          <p class="paginator">{{ menuItems.length }} menu items</p>
        </div>
      </div>

      <!-- MENU ITEM ADD VIEW -->
      <div v-if="currentView === 'menuitems_add'" id="content-main">
        <form @submit.prevent="addItem">
          <div>
            <fieldset class="module aligned ">
              <div class="form-row field-category">
                <div>
                  <label class="required" for="id_category">Category:</label>
                  <div class="related-widget-wrapper">
                    <select v-model="newItem.categoryId" id="id_category" required>
                      <option value="" disabled>---------</option>
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-row field-title">
                <div>
                  <label class="required" for="id_title">Title:</label>
                  <input type="text" v-model="newItem.title" id="id_title" required>
                </div>
              </div>
              <div class="form-row field-description">
                <div>
                  <label for="id_description">Description:</label>
                  <textarea v-model="newItem.description" id="id_description" rows="5" cols="40"></textarea>
                </div>
              </div>
              <div class="form-row field-price">
                <div>
                  <label class="required" for="id_price">Price:</label>
                  <input type="text" v-model="newItem.price" id="id_price" required>
                </div>
              </div>
              <div class="form-row field-imageUrl">
                <div>
                  <label for="id_imageFile">Image:</label>
                  <input type="file" id="id_imageFile" accept="image/*" style="border:none; padding:0;">
                </div>
              </div>
            </fieldset>
            <div class="submit-row">
              <input type="submit" value="Save" class="default" name="_save">
            </div>
          </div>
        </form>
      </div>

      <!-- About Us Form View -->
      <div v-if="currentView === 'about_change'" id="content-main">
        <form @submit.prevent="updateAbout">
          <fieldset class="module aligned" v-if="aboutData">
            <div class="form-row">
              <div>
                <label class="required" for="id_title">Título:</label>
                <input type="text" v-model="aboutData.title" class="vTextField" maxlength="255" required id="id_title">
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required" for="id_intro">Introducción:</label>
                <textarea v-model="aboutData.intro" class="vLargeTextField" required id="id_intro" cols="40" rows="3"></textarea>
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required" for="id_body">Cuerpo:</label>
                <textarea v-model="aboutData.body" class="vLargeTextField" required id="id_body" cols="40" rows="5"></textarea>
              </div>
            </div>
            <div class="form-row">
              <div>
                <label for="id_aboutImageFile">Imagen:</label>
                <input type="file" id="id_aboutImageFile" accept="image/*" style="border:none; padding:0;">
              </div>
            </div>
            <div class="form-row">
              <div>
                <label for="id_remove_image">Quitar imagen actual:</label>
                <input type="checkbox" id="id_remove_image" v-model="aboutData.removeImage">
              </div>
            </div>
            
            <h2 style="padding: 10px;">Valor 1</h2>
            <div class="form-row">
              <div>
                <label class="required">Icono 1:</label>
                <input type="text" v-model="aboutData.val1Icon" class="vTextField" maxlength="10" required>
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required">Título 1:</label>
                <input type="text" v-model="aboutData.val1Title" class="vTextField" maxlength="50" required>
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required">Texto 1:</label>
                <input type="text" v-model="aboutData.val1Desc" class="vTextField" maxlength="200" required>
              </div>
            </div>

            <h2 style="padding: 10px;">Valor 2</h2>
            <div class="form-row">
              <div>
                <label class="required">Icono 2:</label>
                <input type="text" v-model="aboutData.val2Icon" class="vTextField" maxlength="10" required>
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required">Título 2:</label>
                <input type="text" v-model="aboutData.val2Title" class="vTextField" maxlength="50" required>
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required">Texto 2:</label>
                <input type="text" v-model="aboutData.val2Desc" class="vTextField" maxlength="200" required>
              </div>
            </div>

            <h2 style="padding: 10px;">Valor 3</h2>
            <div class="form-row">
              <div>
                <label class="required">Icono 3:</label>
                <input type="text" v-model="aboutData.val3Icon" class="vTextField" maxlength="10" required>
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required">Título 3:</label>
                <input type="text" v-model="aboutData.val3Title" class="vTextField" maxlength="50" required>
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required">Texto 3:</label>
                <input type="text" v-model="aboutData.val3Desc" class="vTextField" maxlength="200" required>
              </div>
            </div>

          </fieldset>
          
          <div class="submit-row">
            <input type="submit" value="Save" class="default" name="_save">
          </div>
        </form>
      </div>

      <!-- Contact Info Form View -->
      <div v-if="currentView === 'contact_change'" id="content-main">
        <form @submit.prevent="updateContact">
          <fieldset class="module aligned" v-if="contactData">
            <div class="form-row">
              <div>
                <label class="required" for="id_address">Dirección:</label>
                <textarea v-model="contactData.address" class="vLargeTextField" required id="id_address" cols="40" rows="3"></textarea>
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required" for="id_phone">Teléfono:</label>
                <input type="text" v-model="contactData.phone" class="vTextField" maxlength="50" required id="id_phone">
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required" for="id_email">Email:</label>
                <input type="email" v-model="contactData.email" class="vTextField" maxlength="100" required id="id_email">
              </div>
            </div>
            <div class="form-row">
              <div>
                <label class="required" for="id_schedule">Horarios:</label>
                <textarea v-model="contactData.schedule" class="vLargeTextField" required id="id_schedule" cols="40" rows="4"></textarea>
              </div>
            </div>
          </fieldset>
          <div class="submit-row">
            <input type="submit" value="Save" class="default" name="_save">
          </div>
        </form>
      </div>

      <!-- Prices List View -->
      <div v-if="currentView === 'prices_list'" id="content" class="colM">
        <h1>Select price item to change</h1>
        <div id="content-main">
          <ul class="object-tools">
            <li><a @click="currentView = 'prices_add'" class="addlink">Add price item</a></li>
          </ul>
          <div class="module" id="changelist">
            <div class="results">
              <table id="result_list">
                <thead>
                  <tr>
                    <th scope="col" class="sortable column-name">
                      <div class="text"><a>Name</a></div>
                    </th>
                    <th scope="col" class="sortable column-range">
                      <div class="text"><a>Range</a></div>
                    </th>
                    <th scope="col" class="sortable column-icon">
                      <div class="text"><a>Icon</a></div>
                    </th>
                    <th scope="col" class="sortable column-delete">
                      <div class="text"><a>Delete</a></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, idx) in prices" :key="p.id" :class="idx % 2 === 0 ? 'row1' : 'row2'">
                    <th class="field-name"><a>{{ p.name }}</a></th>
                    <td class="field-range">{{ p.range }}</td>
                    <td class="field-icon">{{ p.icon }}</td>
                    <td class="field-delete">
                      <a @click="deletePrice(p.id)" style="color: #ba2121; cursor:pointer;">Delete</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="paginator">{{ prices.length }} price items</p>
          </div>
        </div>
      </div>

      <!-- Prices Add View -->
      <div v-if="currentView === 'prices_add'" id="content" class="colM">
        <h1>Add price item</h1>
        <div id="content-main">
          <form @submit.prevent="addPrice">
            <fieldset class="module aligned">
              <div class="form-row">
                <div>
                  <label class="required" for="id_name">Name:</label>
                  <input type="text" v-model="newPrice.name" class="vTextField" maxlength="255" required id="id_name">
                </div>
              </div>
              <div class="form-row">
                <div>
                  <label class="required" for="id_range">Range:</label>
                  <input type="text" v-model="newPrice.range" class="vTextField" maxlength="255" required id="id_range">
                </div>
              </div>
              <div class="form-row">
                <div>
                  <label class="required" for="id_icon">Icon:</label>
                  <input type="text" v-model="newPrice.icon" class="vTextField" maxlength="255" required id="id_icon">
                </div>
              </div>
              <div class="form-row">
                <div>
                  <label class="required" for="id_desc">Description:</label>
                  <textarea v-model="newPrice.desc" class="vLargeTextField" required id="id_desc" cols="40" rows="5"></textarea>
                </div>
              </div>
            </fieldset>
            
            <div class="submit-row">
              <input type="submit" value="Save" class="default" name="_save">
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ESTILO CLON DE DJANGO ADMIN */

.django-admin {
  font-family: Roboto, "Lucida Grande", Verdana, Arial, sans-serif;
  color: #333;
  background: #f8f8f8;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  text-align: left;
  line-height: 1.5;
}

a {
  color: #447e9b;
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  color: #036;
}

/* Header */
#header {
  padding: 10px 40px;
  background: #417690;
  color: #ffc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#branding h1 {
  margin: 0;
  font-weight: 300;
  font-size: 24px;
  color: #f5dd5d;
}

#branding h1 a {
  color: inherit;
}

#user-tools {
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: #ffc;
}

#user-tools a {
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}
#user-tools a:hover {
  border-bottom-color: white;
}

/* Breadcrumbs */
.breadcrumbs {
  background: #79aec8;
  padding: 10px 40px;
  border: none;
  font-size: 13px;
  color: #c4dce8;
}

.breadcrumbs a {
  color: white;
}

.breadcrumbs a:hover {
  color: white;
  text-decoration: underline;
}

/* Content */
#content {
  padding: 20px 40px;
}

#content-main {
  width: 100%;
}

/* Modules & Tables */
.module {
  background: white;
  margin-bottom: 30px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

caption {
  padding: 8px;
  background: #79aec8;
  color: white;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

caption a {
  color: white;
}

th, td {
  font-size: 13px;
  padding: 8px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

thead th {
  background: #f8f8f8;
  color: #666;
  padding: 8px;
  font-size: 12px;
  text-transform: uppercase;
  border-bottom: 1px solid #ccc;
}

tr.row1 { background: #fff; }
tr.row2 { background: #f9f9f9; }

th.field-name a, th.field-title a {
  font-weight: bold;
}

a.addlink {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%23447e9b" d="M6 0v12M0 6h12" stroke="%23447e9b" stroke-width="2"/></svg>') 0 50% no-repeat;
  padding-left: 16px;
  font-weight: bold;
}

a.changelink {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%23447e9b" d="M1 10l3-1 7-7-2-2-7 7-1 3z"/></svg>') 0 50% no-repeat;
  padding-left: 16px;
  font-weight: bold;
}

/* Object Tools */
.object-tools {
  font-size: 11px;
  font-weight: bold;
  padding: 0;
  margin: 0 0 15px 0;
  text-align: right;
}

.object-tools li {
  display: inline-block;
  margin-left: 10px;
}

.object-tools a {
  display: block;
  background: #999;
  padding: 5px 12px;
  color: white;
  border-radius: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.object-tools a:hover {
  background: #79aec8;
}

/* Forms */
fieldset {
  margin: 0;
  padding: 0;
  border: none;
}

.form-row {
  border-bottom: 1px solid #eee;
  padding: 10px;
  display: flex;
}

.form-row > div {
  display: flex;
  width: 100%;
}

.form-row label {
  width: 160px;
  font-weight: bold;
  font-size: 13px;
  color: #333;
  padding-right: 10px;
}

.form-row label.required::after {
  content: '*';
  color: red;
  margin-left: 2px;
}

input[type="text"], textarea, select {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px 8px;
  font-family: inherit;
  font-size: 13px;
  width: 300px;
}

textarea {
  width: 400px;
}

input[type="text"]:focus, textarea:focus, select:focus {
  border-color: #79aec8;
  outline: none;
}

/* Submit Row */
.submit-row {
  padding: 12px 14px;
  margin: 0 0 20px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 4px;
  text-align: left;
}

.submit-row input.default {
  background: #417690;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  padding: 10px 15px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.submit-row input.default:hover {
  background: #205067;
}

.paginator {
  font-size: 13px;
  padding: 10px;
  background: #fff;
  border-top: 1px solid #eee;
  margin: 0;
  color: #666;
}
</style>
