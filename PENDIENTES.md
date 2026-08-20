# Tareas pendientes · Web de la AFA Atalaya

Estado a 20 de agosto de 2026.

**Entorno actual:** repositorio en `C:\PERSONAL\AFA Atalaya\Website` (GitHub,
gestionado con SourceTree) y despliegue automático en Vercel.

> La carpeta `C:\PERSONAL\AFA Atalaya\WEB AFA` es de trabajo, no es el repo.
> Comprobado hoy: los 21 ficheros de código y contenido son **idénticos** en las
> dos carpetas, así que no hay nada desincronizado. Conviene decidir si se
> mantiene esa carpeta doble o se trabaja solo contra el repo — dos copias de lo
> mismo acaban divergiendo.

---

## 1. Corregir ya (afecta a lo que está publicado)

- [x] ~~Contenido viejo publicado en `paginas/el-afa/`~~ — **neutralizado.**
      Ese `index.html` ya no tiene la página antigua: es una redirección a
      `la-afa/` con `noindex`. Además `vercel.json` redirige la ruta de forma
      permanente (301), así que cualquier enlace antiguo sigue funcionando.
- [ ] **Borrar la carpeta `paginas/el-afa/` en SourceTree.** Ya no hace daño,
      pero sobra. No puedo borrarla yo: el puente con tu equipo permite escribir
      pero no eliminar. Dentro hay también un `_prueba.txt` que generé al
      comprobar los permisos; se va con la carpeta.
      *En SourceTree: eliminar la carpeta, confirmar el borrado y push.*

- [ ] **Quitar `img/Cabecera.png` (2 MB) del repositorio.** No se usa: la web
      carga `cabecera.webp` (105 KB) y `cabecera-movil.webp` (47 KB). Está además
      dentro del historial de Git, así que borrarla ahora reduce el repo de cara
      al futuro pero no lo limpia del todo. No es grave; simplemente no hace
      falta que esté.

- [ ] **Actualizar las instrucciones de despliegue.** El `README.md` y
      `docs/README.md` explican cómo publicar con **GitHub Pages** y citan sus
      límites. Ya no aplica: estáis en Vercel. Hay que reescribir esa parte.
- [x] ~~Añadir `vercel.json`~~ — **hecho.** Incluye la redirección de `el-afa`,
      cabeceras de seguridad (`X-Content-Type-Options`, `X-Frame-Options`,
      `Referrer-Policy`, `Permissions-Policy`) y caché de un mes para `/img/`.

- [ ] **Consecuencia buena del cambio a Vercel:** con Pages el repositorio tenía
      que ser público para publicar gratis. En Vercel **no**: podéis tener el
      repo privado y la web pública. Merece la pena decidirlo, porque cambia el
      criterio de qué se puede subir.

---

## 2. Dejar el formulario funcionando de verdad

La clave de Web3Forms ya está puesta en `js/config.js`. Falta lo último:

- [ ] **Activar el reenvío del Gmail técnico al público.** Sin esto los mensajes
      del formulario se quedan en `colegioatalaya.afa.web@gmail.com`, que nadie
      consulta a diario, en lugar de llegar a `colegioatalaya.afa@gmail.com`.
      *Ajustes → Reenvío y correo POP/IMAP → Añadir dirección de reenvío* (hay
      que confirmar desde el correo de destino).

- [ ] **Enviar un mensaje de prueba desde la web publicada** y comprobar tres
      cosas: que llega, que no cae en spam, y que al responder la respuesta va a
      la familia y no a vosotros mismos.

- [ ] **Marcar los correos de Web3Forms como «no es spam»** la primera vez.
      Esto no es un detalle menor: en la memoria del taller de atragantamientos
      ya consta que *«algunos emails de AFA han llegado al buzón de spam»* y
      familias inscritas no vieron el recordatorio. Es un problema real que ya
      os ha pasado.

---

## 3. Formularios de Google por crear

Cada uno se activa pegando su URL en `js/config.js` → `enlaces`.

- [ ] `altaSocio` — alta de socio. **Activa los 20 botones «Hazte socio»** del
      sitio. Los campos propuestos están en `GUIA-FORMULARIOS.md`, sección 3.
- [ ] `inscripcionActividad` — un único formulario reutilizable para todo el
      curso, con desplegable de actividad. Activa el botón del Taller familiar.
- [ ] `comisiones` — para apuntarse a una comisión de trabajo.
- [ ] `autorizacionImagen` — solo si queréis gestionarlo aparte del alta.
- [ ] `propuestas` — **no hace falta.** El formulario de contacto ya tiene
      «Propuesta o sugerencia» en el desplegable de motivo.

> **Ojo:** ya tenéis en circulación un Google Form de *cesión y protección de
> datos* (aparece en la circular del curso de primeros auxilios). Conviene
> decidir si ese formulario se integra en el alta de socio o se mantiene aparte,
> para no pedir dos veces lo mismo a las familias.

---

## 4. Contenido real que sustituye a los ejemplos

**Esto es lo más valioso que hay pendiente.** Ahora mismo la sección de
Actualidad y el calendario llevan contenido inventado de relleno. En
`03. Actividades AFA` hay **cinco actividades reales del curso 2025–2026** con
sus memorias, y son mucho mejores que cualquier ejemplo:

| # | Actividad | Fecha | Datos que ya tenemos |
|---|---|---|---|
| 01 | 1.er Concurso de Postales Navideñas | 5–19 dic 2025 | **58 alumnos** de todas las etapas · 9 vales de 10 € donados por **Librería Gil** · las postales se donaron a la **Residencia Isasti** (Lanestosa) |
| 02 | Merienda del Carnaval del Atalaya | 13 feb 2026 | **52 personas** en la organización · coste 837,06 € · repostería casera de las familias · disfraces en grupo en infantil |
| 03 | Charla sobre alimentación y atragantamientos (0–5 años) | 15 abr 2026 | Ponente **Lara del Valle**, matrona y consultora IBCLC · **17 familias** · gratuita |
| 04 | Taller de Primeros Auxilios (RCP) con **Cruz Roja** | 29 abr 2026 | 15:00–16:30 · aforo 35 · gratuito para familias asociadas |
| 05 | Merienda literaria | 2026 | Solo hay hoja de respuestas, **sin memoria** |

Tareas que salen de aquí:

- [x] ~~Reescribir las noticias de Actualidad~~ — **hecho.** Seis entradas
      reales en orden cronológico, con los filtros ajustados al contenido real
      (Actividades · Formación · Concursos · La AFA).
- [x] ~~Crear la página del curso pasado~~ — **hecho:**
      `paginas/actividades/curso-2025-2026/`. Las cinco actividades con sus
      cifras de participación, las entidades colaboradoras y un apartado de
      «qué aprendimos» sacado de las propias memorias. Enlazada desde la
      portada, desde Actividades y desde cada noticia.
      **Sin datos personales, sin importes y sin desgloses de gastos**, como
      pediste. Repásala y dime qué ajustar.
- [ ] **Revisar el calendario 2026–2027.** Las fechas que hay ahora (12 y 25 de
      septiembre, 10 de octubre) las puse como marcador de posición. Con el
      histórico se pueden proponer fechas reales: el concurso de postales cae en
      diciembre, la merienda de Carnaval en febrero.
- [ ] **Repetir la charla de atragantamientos.** Su propia memoria lo recomienda:
      *«estaría muy bien repetir en años posteriores»*.
- [ ] **Escribir la memoria de la Merienda literaria**, que es la única de las
      cinco que no la tiene.

---

## 5. Documentos por publicar en `docs/`

La sección de documentación tiene cuatro entradas marcadas como «Pendiente de
publicar». Los originales existen ya:

- [ ] **Estatutos** → hay un `.docx` y ocho fotos JPEG. Hay que **exportar el
      .docx a PDF** (las fotos no valen: pesan más y no se pueden buscar).
      Nombre esperado: `estatutos-afa-atalaya.pdf`
- [ ] **Acta de constitución de la junta** → existe `Acta Asamblea 20260320.pdf`
      firmada. **Antes de publicarla hay que comprobar si contiene NIF**: el acta
      que vi incluye los NIF de los seis miembros de la junta, y eso no puede
      subirse a la web. Habría que publicar una versión sin esos datos.
      Nombre esperado: `acta-constitucion-junta-2026-03-20.pdf`
- [ ] **Memoria del curso** → se puede montar una memoria 2025–2026 juntando las
      cinco actividades. Ojo: las memorias actuales incluyen desgloses de gastos
      con nombres de personas (aparece quién adelantó dinero en efectivo) — eso
      hay que quitarlo de la versión pública.
      Nombre esperado: `memoria-curso-2025-2026.pdf`
- [ ] **Bases de los concursos** → están dentro de la memoria del concurso de
      postales; se pueden extraer.

> Recordatorio: al subir cada PDF hay que quitarle la clase `is-pending` a su
> enlace en `paginas/formularios/index.html` para que deje de estar apagado.

---

## 6. Datos que siguen faltando

- [ ] **Importe de la cuota** del curso 2026–2027 (aparece como «pendiente de
      publicar» en la página de La AFA).
- [ ] **Lista real de cursos del colegio**, para el desplegable del formulario
      de alta.
- [ ] **Aforo del Taller familiar** (ahora dice solo «aforo limitado»).
- [ ] **URL de Instagram, Facebook y WhatsApp.** Mientras estén vacías en
      `config.js`, los iconos del pie se ocultan solos.
- [ ] **Temática concreta del Taller familiar** del 25 de septiembre.
- [ ] **Revisar las descripciones de las nueve comisiones**: la lista es la que
      pasó la junta, pero las descripciones de una línea las redacté yo por
      inferencia. Convivencia y Movilidad e Infraestructuras son las que más
      conviene confirmar.
- [ ] **Origen y licencia de la foto de cabecera** (parece generada con IA o de
      banco de imágenes; si fueran niños del colegio haría falta consentimiento).

---

## 7. Mejoras que salen de vuestras propias memorias

Las memorias documentan las dificultades de cada actividad, y varias las resuelve
la web. Merece la pena atacarlas explícitamente:

- [ ] **«Los alumnos de secundaria no se enteraron»** (concurso de postales). El
      cartel estaba en la corchera de la entrada, por donde no pasan. La web es
      justo el canal que no depende de dónde esté el cartel — conviene decirlo en
      la reunión de bienvenida y en los grupos de WhatsApp.
- [ ] **«Falta de lectura de las bases; es necesario contenido más visual»**.
      Cuando se publiquen las bases de un concurso, mejor una página con los
      puntos claros que un PDF denso.
- [ ] **«Algunas personas tuvieron dificultad en localizar el buzón»**. La
      página de Contacto menciona el buzón pero no dice dónde está exactamente.
      Añadir la ubicación concreta.
- [ ] **«Dudas sobre el nivel de protección de datos necesario»**. La política de
      privacidad de la web ya cubre buena parte de esto; conviene que la junta la
      lea y la valide, que es una tarea que sigue abierta.

---

## 8. Revisión legal

- [ ] **Revisar el aviso legal y la política de privacidad.** Están redactados y
      marcados como borrador. Los debería leer la junta y, si es posible, alguien
      con criterio jurídico.
- [ ] **Actualizar la fecha de «última actualización»** de los dos textos al
      publicarlos.
- [ ] **Decidir sobre Google Fonts.** La web carga la tipografía desde los
      servidores de Google, lo que comunica la IP de quien visita la web. Está
      declarado en la política de privacidad, pero si preferís eliminar ese punto
      se descarga la fuente y se sirve desde `img/` — son diez minutos.

---

## 9. Mejoras técnicas (no urgentes)

- [ ] **Dominio propio.** El plan Pro incluye **un dominio gratis el primer
      año**. Da mucha más credibilidad que una URL `*.vercel.app` en una
      circular del colegio.
- [ ] **Página 404 propia**, coherente con el diseño.
- [ ] **`sitemap.xml` y `robots.txt`**, para que Google indexe bien.
- [ ] **Panel de administración.** Ver el apartado siguiente.

---

## 10. Sobre Vercel Pro y el panel de administración

Consultado en su documentación:

**Las funciones de servidor NO son lo que se paga.** Están incluidas también en
el plan gratuito (1 000 000 de invocaciones al mes). Pasar a Pro no os
«desbloquea» el servidor: ya lo tenéis.

Lo que Pro aporta de verdad en vuestro caso:

| | Gratis (Hobby) | Pro |
|---|---|---|
| Funciones de servidor | Sí | Sí, con más límites |
| **Uso** | **Solo personal, no comercial** | Sin esa restricción |
| Equipo con roles | No | Sí (puestos de solo lectura **gratis**) |
| Dominio | De pago | **Uno gratis el primer año** |
| Almacenamiento de ficheros (Blob) | Sí | Sí |

**El argumento de peso para pagar no es técnico, es de legitimidad y de
gobierno:** el plan gratuito está limitado a uso personal y no comercial, y una
asociación no es una persona. Y sobre todo, Pro permite que **varias personas de
la junta tengan acceso con roles distintos** en lugar de compartir una cuenta —
que es justo el problema que venimos evitando en todo el proyecto.

### Y sobre el panel de administración

Un panel necesita tres cosas, no una:

1. **Servidor** → lo tenéis en los dos planes.
2. **Almacenamiento** → Vercel Blob para ficheros; una base de datos se contrata
   aparte y tiene coste propio.
3. **Autenticación** → hay que construirla o contratarla. **Esto es el 80 % del
   trabajo real**, y es lo que ningún plan te da hecho.

Mi recomendación sigue siendo la misma que antes, y ahora con más razón: para
esto no hace falta construir nada. Un **CMS basado en Git** (Pages CMS, Decap,
Sveltia) da un panel con login, editor visual y subida de archivos, guarda cada
cambio como un commit y **no necesita servidor, ni base de datos, ni
autenticación propia**. Es menos código, menos que mantener y sin coste.

Construir un panel propio sobre Vercel tiene sentido si algún día necesitáis
algo que un CMS no cubra: control de aforos en tiempo real, un área privada para
socios o pagos en línea. Mientras el objetivo sea «editar textos y subir PDF sin
tocar HTML», el CMS gana por mucho.

---

## Orden que propongo

1. Borrar `paginas/el-afa/` — es lo único que está mal en producción.
2. Activar el reenvío del Gmail y probar el formulario.
3. Reescribir Actualidad con las cuatro actividades reales.
4. Crear el Google Form de alta y pegar su URL.
5. Publicar estatutos y memoria (con los datos personales quitados).
6. El resto, según vaya haciendo falta.
