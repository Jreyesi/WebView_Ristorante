<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = ref([])
const menuItems = ref([])

// 'dashboard', 'categories_list', 'categories_add', 'menuitems_list', 'menuitems_add'
const currentView = ref('dashboard')

const newCategory = ref('')
const newItem = ref({
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  categoryId: ''
})

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

const fetchCategories = async () => {
  const res = await fetch('http://localhost:3000/api/categories')
  categories.value = await res.json()
}

const fetchMenuItems = async () => {
  const res = await fetch('http://localhost:3000/api/menu')
  menuItems.value = await res.json()
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

const getCategoryName = (id) => {
  const cat = categories.value.find(c => c.id === id)
  return cat ? cat.name : 'Unknown'
}

onMounted(() => {
  fetchCategories()
  fetchMenuItems()
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
        &rsaquo; <a @click="currentView = currentView.split('_')[0] + '_list'" style="cursor:pointer;">{{ currentView.includes('categories') ? 'Categories' : 'Menu items' }}</a>
      </span>
      <span v-if="currentView.includes('add')">
        &rsaquo; Add
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cat, index) in categories" :key="cat.id" :class="index % 2 === 0 ? 'row1' : 'row2'">
                <th class="field-name"><a>{{ cat.name }}</a></th>
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
