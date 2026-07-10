# Proyecto Práctico Integrador: Gestión y Despliegue Controlado

**Universidad Estatal de Milagro (UNEMI)** **Carrera:** Ingeniería en Software  
**Asignatura:** [Nombre de la Asignatura]  

Este repositorio contiene el código fuente y la configuración de despliegue de una aplicación web desarrollada con **Vue 3 y Vite**. El proyecto sirve como evidencia práctica de la aplicación de conceptos de gestión de configuración de software, trabajo colaborativo, control de versiones e infraestructura como código mediante contenedores.

---

## 👥 Equipo de Trabajo y Roles

El trabajo colaborativo se ha organizado bajo la siguiente estructura de roles para simular un entorno real de desarrollo y operaciones:

| Rol | Estudiante | Responsabilidades Principales |
| :--- | :--- | :--- |
| **Líder de Proyecto** | Jackson Reyes | Coordinación, revisión de PRs y gestión de la rama `develop`. |
| **DevOps / Operaciones** | Jackson Reyes | Creación del `Dockerfile`, gestión de contenedores y despliegue. |
| **Desarrollador Frontend** | Melanie Garcia/Isaac Chico | Maquetación, componentes Vue (`Menu`, `Reservation`) y estilos. |
| **Desarrollador Backend** | Edgar Lara/Luis Peñafiel | Lógica de la aplicación y conexión de datos. |
| **Documentador** | Melanie Garcia | Redacción de este README y del informe final en PDF. |

---

## 🛠️ Tecnologías y Herramientas Utilizadas

* **Frontend:** Vue 3, Vite, CSS (Variables y utilidades personalizadas).
* **Control de Versiones:** Git y GitHub (Enfoque GitFlow).
* **Contenedores e Infraestructura:** Docker, Docker Desktop.
* **Servidor Web (Producción):** Nginx (integrado en la imagen Docker).

---

## 🌿 Estrategia de Ramas (GitFlow)

Para este proyecto se implementó un flujo de trabajo estructurado:
* `main`: Entorno de producción. Contiene código funcional y dockerizado.
* `develop`: Entorno de integración. Todas las nuevas características se unen aquí.
* `feature/*`: Ramas temporales para el trabajo individual (ej. `feature/navbar`, `feature/docker-config`). 

---

## 🚀 Despliegue con Docker (Entorno de Producción)

El sistema está configurado para ejecutarse de manera aislada utilizando Docker, implementando un *multi-stage build* para optimizar el peso de la imagen y servir los estáticos a través de Nginx.

### Prerrequisitos
Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/) en su máquina.

### Pasos para ejecutar:
1. Clonar el repositorio:
    ```bash
   git clone [https://github.com/Jreyesi/WebView_Ristorante.git](https://github.com/Jreyesi/WebView_Ristorante.git)
   cd WebView_Ristorante

2. Construir la imagen de Docker:
    ```bash
    docker build -t webview-ristorante 

3. Levantar el contenedor en segundo plano: 
    ```bash
    docker run -d -p 8080:80 --name app_ristorante webview-ristorante

### Entorno de Desarrollo Local (Sin Docker)
Si el equipo de desarrollo necesita levantar el proyecto localmente para realizar cambios en los componentes de Vue con recarga en caliente (Hot-Reload):

1. Asegurarse de tener instalado Node.js.

2. Instalar las dependencias del proyecto:
    ```bash
    npm install

3. Ejecutar el servidor de desarrollo de Vite:
    ```bash
    npm run dev

4. Compilar los archivos para produccion 
    ```bash
    npm run build

### Licencia y Uso
Este proyecto fue configurado y documentado con fines académicos para el componente práctico integrador de la carrera de Ingeniería en Software. La copia de este repositorio para otras evaluaciones no está permitida.
