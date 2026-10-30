# Workshop Rolling Code School — ¿Por dónde empiezo a programar?

Landing page del workshop **"¿Por dónde empiezo a programar?"** de Rolling Code School: una tarde con diez speakers para ordenar los primeros pasos en programación (qué aprender, cómo practicar y cómo mostrar lo que sabés).

El sitio reúne toda la información del evento en una sola página:

- **Hero** con fecha, lugar y precio de las entradas.
- **Speakers** y **agenda** de las charlas.
- **Precios** con contador regresivo del Early Bird y barra de cupos.
- **Checkout** de entradas en 4 pasos (entrada, datos, pago, listo).
- **Sponsors** por niveles (Diamante, Oro, Bronce) y formulario para sumarse como sponsor.
- **Ubicación** con mapa y **footer** con redes.
- **Chatbot** (RollingChat) para consultas.
- **Switch de modo oscuro / claro** en el header, que recuerda la preferencia del usuario.
- **Página de error 404** personalizada.

Proyecto realizado por el Grupo 3 trabajando con la metodología Scrum.

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de las páginas |
| CSS3 | Estilos propios, variables CSS y tema claro |
| JavaScript (vanilla) | Contador, barra de cupos, checkout y switch de tema |
| [Bootstrap 5.3](https://getbootstrap.com/) | Grilla, utilidades y componentes |
| [Bootstrap Icons](https://icons.getbootstrap.com/) y [Font Awesome 6](https://fontawesome.com/) | Íconos |
| [Google Fonts — Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Tipografía |
| [Chatbase](https://www.chatbase.co/) | Chatbot embebido |

Todas las librerías se cargan por CDN, así que no hace falta instalar dependencias.

## Instalación

**Requisitos:** un navegador moderno y [Git](https://git-scm.com/). Para levantar un servidor local, cualquiera de estas opciones: la extensión **Live Server** de VS Code, Node.js o Python.

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/JoseSimonDiaz/workshop.git
   cd workshop
   ```

2. Levantar un servidor local desde la carpeta raíz del proyecto (elegí una opción):

   - **VS Code:** clic derecho sobre `index.html` → *Open with Live Server*.
   - **Node.js:** `npx serve .`
   - **Python:** `python -m http.server 5500`

3. Abrir en el navegador la URL que indique el servidor (por ejemplo `http://localhost:5500`).

> **Importante:** usá un servidor local en lugar de abrir `index.html` con doble clic. La página 404 carga sus estilos con rutas absolutas (`/CSS/...`), que solo funcionan cuando el sitio se sirve desde la raíz del proyecto.

## Estructura de carpetas

```
workshop/
├── index.html              # Landing principal (todas las secciones)
├── pages/
│   └── pagina404.html      # Página de error 404
├── CSS/
│   ├── style.css           # Estilos generales de la landing
│   ├── sponsorts.css       # Sección de sponsors (niveles y tarjetas)
│   ├── sponsotrssub.css    # Formulario "Sumate como sponsor"
│   ├── tema-claro.css      # Switch de tema y paleta del modo claro
│   └── error404style.css   # Estilos de la página 404
├── js/
│   ├── app.js              # Switch de tema, contador regresivo y barra de cupos
│   └── checkout.js         # Lógica del checkout de entradas
├── assets/
│   ├── header icons/       # Logo y favicon
│   ├── speakers/           # Fotos de los speakers
│   ├── iconos sponssortss/ # Logos e íconos de sponsors
│   └── error404/           # Ilustración de la página 404
└── README.md
```

## Modo oscuro / claro

El diseño original es oscuro. El switch del header agrega `data-tema="claro"` a la etiqueta `<html>` y guarda la elección en `localStorage`. Si el usuario todavía no eligió ningún tema, la página usa el de su sistema operativo.

Todo el modo claro está en `CSS/tema-claro.css`. Para ajustar un color del tema claro, editá las variables del bloque `html[data-tema="claro"]` de ese archivo.
