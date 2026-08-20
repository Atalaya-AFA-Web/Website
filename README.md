# Web del AFA Colegio Atalaya

Sitio web de la Asociación de Familias de Alumnos del Colegio Atalaya de Santander
(CIF G-39039813).

Web estática: HTML, CSS y JavaScript, sin frameworks ni proceso de compilación.

## Estructura del proyecto

```
.
├── index.html                    Página de inicio
│
├── paginas/                      Todas las páginas interiores
│   ├── el-afa/index.html         Quiénes somos, junta, organización
│   ├── actividades/
│   │   ├── index.html            Calendario del curso por trimestres
│   │   ├── reunion-bienvenida/   Ficha de actividad (sin inscripción)
│   │   │   ├── index.html
│   │   │   └── reunion-bienvenida.ics   Descarga para el calendario
│   │   └── taller-familiar/      Ficha de actividad (con inscripción)
│   │       ├── index.html
│   │       └── taller-familiar.ics
│   ├── formularios/index.html    Altas, inscripciones, documentación y FAQ
│   ├── actualidad/index.html     Listado de noticias
│   ├── contacto/index.html       Formulario y datos de contacto
│   ├── privacidad/index.html     Política de privacidad
│   └── aviso-legal/index.html    Aviso legal
│
├── css/
│   ├── styles.css                Base: variables, botones, header, footer,
│   │                             tarjetas y secciones de la home
│   └── paginas.css               Componentes de las páginas interiores:
│                                 cabecera de página, migas de pan, prosa,
│                                 acordeón, formularios, paginación…
│
├── js/
│   ├── config.js                 ⚙ ÚNICO FICHERO A EDITAR PARA CONFIGURAR
│   │                             el sitio: servicio de formularios, enlaces
│   │                             a Google Forms y redes sociales
│   ├── main.js                   Común: menú móvil, enlace activo, filtros
│   ├── enlaces-externos.js       Común: aplica los enlaces de config.js
│   ├── acordeon.js               Solo en Formularios (preguntas frecuentes)
│   └── formulario-contacto.js    Solo en Contacto (validación y envío)
│
├── img/                          Imágenes del sitio
│   ├── cabecera.webp             Foto de la portada (escritorio)
│   ├── cabecera-movil.webp       La misma, más ligera para móviles
│   ├── favicon.svg
│   └── junta/                    Fotos de la junta (si se publican)
│
├── docs/                         PDF públicos: estatutos, actas, memorias
│
└── GUIA-FORMULARIOS.md           Guía de la junta para montar Web3Forms y
                                  los Google Forms, y conectarlos a la web
```

### Por qué esta estructura

- **Una carpeta por página** (`paginas/el-afa/index.html` en lugar de
  `paginas/el-afa.html`): la URL queda limpia (`/paginas/el-afa/`) y cada
  sección tiene un sitio propio donde crecer. Si mañana hay fichas de noticias
  individuales, van dentro de `paginas/actualidad/`.
- **Las páginas de apartado están todas al mismo nivel**, así que usan
  exactamente las mismas rutas relativas (`../../css/`, `../otra-seccion/`).
  Eso hace que el bloque de header y footer sea **idéntico** en todas ellas, y
  copiarlo de una a otra funcione sin retocar nada.
- **Las fichas de detalle** (una actividad, una noticia) van un nivel más
  abajo, dentro de su apartado: `paginas/actividades/reunion-bienvenida/`. Así
  la URL agrupa bien y cada ficha tiene su carpeta para sus propios archivos
  (el `.ics`, fotos de esa actividad…). Estas páginas usan `../../../css/` y
  comparten entre ellas su propia variante del header, marcada en el HTML como
  «VARIANTE DE PÁGINA DE DETALLE».
- **CSS en dos ficheros**: `styles.css` lo cargan todas las páginas;
  `paginas.css` solo las interiores. Evita un único fichero gigante sin caer en
  un fichero por página.
- **JS troceado por uso**: lo común en `main.js`, lo específico en su propio
  fichero, que solo se carga donde hace falta.

### Cómo añadir una página nueva

1. Crea `paginas/nueva-seccion/index.html`.
2. Copia el bloque de `<head>`, el header y el footer de cualquier página de
   `paginas/` (son idénticos, no hay que tocar rutas).
3. Escribe el contenido dentro de `<main>`.
4. Si debe salir en el menú, añade el `<li>` correspondiente en **todas** las
   páginas y en `index.html`.

No hace falta marcar el enlace activo del menú: `main.js` lo detecta a partir
de la URL. En las fichas de detalle resalta el apartado que las contiene — en
la ficha de una actividad se ilumina «Actividades».

### Cómo añadir la ficha de una actividad

1. Crea `paginas/actividades/nombre-actividad/index.html`.
2. Copia entera la ficha de `reunion-bienvenida/` y cambia el contenido: las
   rutas ya son correctas, porque está al mismo nivel.
3. Si quieres el botón «Añadir a mi calendario», copia también el `.ics` y
   ajusta fechas, título y lugar. **Las horas van en UTC**: septiembre a
   octubre y de abril a octubre, Madrid es UTC+2, así que las 18:00 se escriben
   como `160000Z`; el resto del año es UTC+1 y serían `170000Z`.
4. Enlaza la ficha desde la tarjeta correspondiente en
   `paginas/actividades/index.html` y, si es una de las tres próximas, también
   desde `index.html`.

Hay dos fichas de ejemplo, según el tipo de actividad:

- **`reunion-bienvenida/`** — actividad de entrada libre, sin inscripción.
- **`taller-familiar/`** — actividad con aforo: incluye el bloque de estado de
  la inscripción y los botones marcados con `data-enlace="inscripcionActividad"`,
  que se activan solos al configurar el Google Form. En el HTML hay un
  comentario explicando cómo pasar el bloque a «plazas agotadas».

Copia la que se parezca más a lo que vas a publicar.

## Cómo trabajar en local

Puedes abrir `index.html` haciendo doble clic. Para que las rutas se comporten
igual que en producción, es mejor servirlo por HTTP:

```bash
python -m http.server 8000
# Luego abre http://localhost:8000
```

## Personalización rápida

- **Colores**: variables `--green-*` al principio de `css/styles.css`.
- **Foto de la portada**: sustituye `img/cabecera.webp` y `img/cabecera-movil.webp`
  conservando los nombres. Ojo con dos cosas:
  - **Los nombres van en minúsculas.** GitHub Pages corre sobre Linux y
    distingue mayúsculas, así que `Cabecera.webp` y `cabecera.webp` son ficheros
    distintos: en Windows funcionaría y en producción daría un 404.
  - **Comprueba el contraste del texto.** El titular es blanco sobre la foto. Si
    pones una imagen más clara, hay que ajustar la opacidad de `.hero-overlay`
    en `css/styles.css`. El mínimo que exige la WCAG es 3:1 para el titular
    (texto grande) y 4,5:1 para el subtítulo.
- **Fotos de noticias**: clases `.news-thumb-a/b/c` en `css/styles.css`.
- **Fotos de la junta**: sustituye cada `<span class="avatar">` por
  `<img class="avatar" src="../../img/junta/nombre.jpg" alt="Nombre Apellido">`.

## Pendiente de completar

Estos puntos están marcados con `<!-- TODO -->` en el código:

- Importe de la cuota del curso 2026–2027.
- Fechas definitivas de las actividades del segundo y tercer trimestre.
- Enlaces reales de los formularios (ahora abren el correo del AFA).
- PDF de estatutos, actas y memorias en `docs/`.
- URL de las redes sociales del AFA.
- Comprobar el origen y la licencia de la foto de portada.
- Revisión del aviso legal y la política de privacidad por parte de la junta.
- Activar el reenvío del Gmail técnico al correo público.
- Envío de prueba real del formulario desde la web publicada.

## Configuración: `js/config.js`

Todo lo que depende de un servicio externo está en un solo fichero,
`js/config.js`. La regla es simple: **si un valor está vacío, la web usa un
comportamiento de reserva que ya funciona**; en cuanto lo rellenas, se usa el
servicio. No hay que tocar HTML para ponerlo en marcha.

| Qué configurar | Sin configurar (ahora) | Configurado |
|---|---|---|
| `formulario.endpoint` | El formulario abre el gestor de correo de la familia con el mensaje redactado | Se envía en segundo plano y se muestra la confirmación en la propia página |
| `enlaces.altaSocio` y compañía | Los botones abren un correo al AFA | Abren el Google Form correspondiente |
| `redes.*` | Los iconos del pie se ocultan | Se muestran y enlazan |

### Poner el formulario de contacto en marcha (Web3Forms)

Una web estática **no puede enviar correos por sí misma**: no hay servidor que
procese el envío. Hace falta un servicio que lo reciba y lo reenvíe al correo
del AFA. El recomendado es **Web3Forms**, porque se da de alta solo con un
correo, sin crear cuenta ni contraseña: la clave queda ligada a
`afa@colegioatalaya.com`, así que **cuando cambie la junta no hay credenciales
que traspasar**.

**Ya está configurado.** La clave de Web3Forms está en `js/config.js` y está
ligada a la cuenta técnica `colegioatalaya.afa.web@gmail.com`, que es donde
llegan los mensajes.

Queda un paso por hacer: **activar el reenvío automático** de ese Gmail al
correo público, para que los mensajes lleguen al buzón que la junta consulta.
En Gmail: *Ajustes → Reenvío y correo POP/IMAP → Añadir dirección de reenvío*.

Si algún día hay que cambiar de clave o de servicio, se edita solo el apartado
`formulario` de `config.js`.

Con **Formspree** o **Basin** el proceso es el mismo, salvo que la clave va
dentro de la URL: se rellena solo `endpoint` y `accessKey` se deja vacío.

> ⚠ **La access key es pública por diseño**: viaja en el código de la página.
> No es un secreto peligroso (solo permite enviar mensajes a vuestro propio
> correo), pero alguien podría usarla para enviaros spam. La defensa gratuita
> es la trampa anti-spam que ya lleva el formulario. Si llega a molestar, se
> regenera la clave o se pasa al plan de pago, que permite limitar por dominio.

Recuerda que el plan gratuito de estos servicios tiene un tope de envíos al
mes. Comprueba el límite vigente al darte de alta; para el volumen de un AFA
suele sobrar de largo.

### Alta de socio: mejor un Google Form

Para el alta la recomendación es distinta: usad un **Google Form**. Las
respuestas caen en una hoja de cálculo que tesorería puede usar directamente,
sin programar nada. Pega su URL en `enlaces.altaSocio` dentro de `config.js` y
el botón "Solicitar alta" pasa a abrirlo automáticamente.

> ⚠ **No pidáis el IBAN en un formulario web.** Para la domiciliación de la
> cuota, usad una orden SEPA en PDF que la familia firme y entregue en mano o
> envíe por correo. Es lo que hacen las AMPAS y evita un problema de
> protección de datos innecesario.

## La dirección de la sede

Aparece en cuatro sitios: `el-afa` (datos de la asociación), `contacto` (bloque
"Cómo llegar"), `privacidad` y `aviso-legal`. Si algún día cambia, hay que
tocar esos cuatro ficheros — a diferencia del correo, no está centralizada,
porque va en el HTML para que los buscadores la indexen.

```
Colegio Atalaya
Bajada Rumayor, s/n
39006 Santander (Cantabria)
```

En "Cómo llegar" se muestra la dirección con un enlace a Google Maps **en lugar
de un mapa incrustado**. El motivo es de protección de datos: un `iframe` de
Google Maps se carga al abrir la página y comunica la IP de quien la visita a
Google sin que haya hecho nada; con el enlace, ese dato solo se comparte si la
persona decide pulsar. Si preferís el mapa incrustado, en el HTML hay un
comentario explicando cómo hacerlo y qué añadir a la política de privacidad.

## Documentos descargables

Los PDF van en la carpeta `docs/`. Subir un documento es literalmente
arrastrarlo a esa carpeta en github.com y confirmar el cambio: GitHub Pages
sirve cualquier fichero estático, así que en un par de minutos es descargable.

Los cuatro documentos de la web aparecen ahora como **"Pendiente de publicar"**
(apagados y no clicables). Cuando subas el PDF con el nombre esperado, quitas
la clase `is-pending` de ese enlace y queda activo. Los nombres exactos están
en `docs/README.md`.

## Publicación (GitHub Pages)

1. `Settings` → `Pages`.
2. En **Source** elige `Deploy from a branch`.
3. Branch: `main`, carpeta `/ (root)`. Guarda.
4. En unos minutos la web estará disponible en la URL que indique esa pantalla.

Requiere que el repositorio sea público (o un plan GitHub Pro para repos privados).

## Protección de datos

Este repositorio contiene solo el código de la web pública. **No se suben**
listados de socios, actas con NIF, ni documentación interna: el historial de Git
conserva los ficheros incluso después de borrarlos.

Antes de publicar fotografías en las que aparezcan menores, hay que contar con el
consentimiento por escrito de sus familias.

## Contacto

afa@colegioatalaya.com
