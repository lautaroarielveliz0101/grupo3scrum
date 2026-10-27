# Workshop Rolling Code School

Proyecto de landing page para un workshop de programación realizado en HTML, CSS y JavaScript. La página promociona el evento “¿Por dónde empiezo a programar?” de Rolling Code School, con información de speakers, agenda, ubicación, entradas y sponsors.

## Descripción general

Este sitio está pensado como una página institucional/evento para captar inscripción a un taller de programación y fortalecer la imagen del evento. La estructura presenta:

- Hero principal con información destacada del evento
- Sección de datos clave del workshop
- Speakers con perfiles y temáticas
- Agenda completa del evento
- Sección de compra de entradas con cálculo automático de precio
- Showcase de sponsors y niveles de colaboración
- Formulario para postulación como sponsor
- Información de ubicación y mapa
- Footer con redes sociales

## Tecnologías utilizadas

- HTML5
- CSS3
- Bootstrap 5
- JavaScript vanilla
- Font Awesome
- Bootstrap Icons
- Google Fonts

## Funcionalidades principales

- Diseño responsive para desktop y móvil
- Menú hamburguesa para pantallas pequeñas
- Countdown para la fecha límite de inscripción
- Barra de cupos disponibles
- Selector de tipo de entrada y cálculo de subtotal, cargo y total
- Simulación de flujo de pago con manejo de error
- Validación de formulario de sponsor (campos requeridos, email, tamaño y tipo de archivo)
- Vista previa de logo en la postulación de sponsor
- Mapa de ubicación embebido

## Estructura del proyecto

```text
grupo3scrum/
├── index.html
├── README.md
├── CSS/
│   ├── error404style.css
│   ├── sponsors.css
│   ├── sponsotrssub.css
│   └── style.css
├── assets/
│   ├── error404/
│   ├── header icons/
│   ├── iconos sponssortss/
│   └── speakers/
├── img/
│   └── assets-rolling-workshop/
├── js/
│   ├── app.js
│   └── checkout.js
├── pages/
│   └── pagina404.html
└── ...
```

## Archivos principales

- `index.html`: estructura principal del sitio y contenido del evento
- `CSS/style.css`: estilos principales del diseño
- `CSS/sponsorts.css`: estilos del área de sponsors
- `CSS/sponsotrssub.css`: estilos del formulario de sponsor
- `js/app.js`: contador regresivo, validaciones y comportamiento del formulario de sponsor
- `js/checkout.js`: lógica de compra de entradas y flujo de pago simulado

## Cómo ejecutar el proyecto

Como es un proyecto estático, no requiere instalación de dependencias ni build tools.

### Opción 1: abrir directamente

Abre el archivo `index.html` en tu navegador.

### Opción 2: usar un servidor local

```bash
cd c:\Users\Usuario\Desktop\proyecto\grupo3scrum
python -m http.server 8000
```

Luego ingresa en tu navegador a:

```text
http://localhost:8000
```

## Requisitos

- Navegador moderno
- Conexión a internet para cargar Bootstrap, Font Awesome y Google Fonts

## Observaciones

El proyecto incluye secciones con contenido de ejemplo y validaciones front-end simuladas, especialmente en la compra de entradas y en el formulario de sponsors. No hay backend ni persistencia real de datos, por lo que el envío de formularios es únicamente una demostración visual.

## Objetivo del proyecto

Crear una landing page moderna y atractiva para promocionar un evento educativo y tecnológico, enfocada en captar participantes y sponsors para una comunidad de desarrollo y aprendizaje.

