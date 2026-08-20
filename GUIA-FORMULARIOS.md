# Guía: formularios de la web de la AFA Atalaya

Documento de trabajo para la junta. No se publica en la web: es la guía para
montar los formularios y dejarlos conectados.

---

## 1. Arquitectura de correos y cuentas

Separar el contacto general de la recogida de datos de familias es acertado, y
por una razón que va más allá del orden: **el listado de socios contiene datos
personales de familias y de menores, y conviene que lo vea el menor número de
personas posible.** Si todo cuelga del mismo buzón, cualquiera que atienda los
mensajes del día a día tiene acceso también a la base de datos de socios.

### Las dos cuentas

| | Cuenta técnica | Correo público |
|---|---|---|
| **Dirección** | `colegioatalaya.afa.web@gmail.com` | `colegioatalaya.afa@gmail.com` |
| **Para qué** | Clave de Web3Forms · Propietaria de los Google Forms y de las hojas de respuestas | Es el que aparece en la web; el que las familias usan para escribir |
| **Quién debe entrar** | Secretaría y tesorería (contiene datos de socios) | Quien atienda mensajes |
| **Dónde se configura** | En Web3Forms y en Google | `email` en `js/config.js` |

> ⚠ **Ojo, las dos direcciones se parecen mucho.** La técnica lleva `.web`
> antes de la arroba y la pública no. Merece la pena escribirlo así en el acta
> o donde documentéis las cuentas, porque es un error fácil de cometer:
>
> - `colegioatalaya.afa@gmail.com` → **pública**, la que ven las familias
> - `colegioatalaya.afa.web@gmail.com` → **técnica**, Web3Forms y Google Forms

### ⚠ El punto que no hay que pasar por alto: el reenvío

La clave de Web3Forms está registrada con la cuenta técnica, así que **los
mensajes del formulario de contacto van a aterrizar en ese Gmail, no en el
correo público.** Si nadie mira ese buzón, los mensajes de las familias se
quedan ahí.

Solución, y es de un minuto: **activa el reenvío automático en el Gmail.**

1. Entra en `colegioatalaya.afa.web@gmail.com`.
2. Rueda de ajustes → *Ver todos los ajustes* → pestaña **Reenvío y correo POP/IMAP**.
3. *Añadir una dirección de reenvío* → escribe `colegioatalaya.afa@gmail.com`.
4. Google manda un correo de confirmación a esa dirección: hay que abrirlo y
   confirmar desde ahí.
5. Vuelve y marca **Reenviar una copia del correo entrante a…**, dejando la
   opción de *conservar la copia en Gmail*.

Así los mensajes llegan al buzón que la gente sí mira, y a la vez queda una
copia en la cuenta técnica como respaldo.

> Alternativa si preferís no reenviar: registrar Web3Forms directamente con el
> correo público. Solo hay que crear otra Access Key desde ese correo y pegarla
> en `config.js`. Las dos opciones son válidas; el reenvío tiene la ventaja de
> que la clave queda ligada a una cuenta que no cambia.

### Dos avisos sobre la cuenta técnica

**Que sea de la AFA, no personal.** `colegioatalaya.afa.web@gmail.com` cumple:
es una cuenta creada para esto. **Guarda la contraseña donde la junta pueda
recuperarla**, no solo en tu cabeza o en tu navegador — ahí va a vivir la base
de datos de socios.

**Añade una segunda persona como recuperación.** En la configuración de la
cuenta de Google, pon el correo de otra persona de la junta como dirección de
recuperación. Es lo que evita que la cuenta se quede inaccesible cuando alguien
se va o pierde el móvil.

---

## 2. Paso a paso: formulario de contacto con Web3Forms

### 2.1 Crear la clave

1. Entra en **web3forms.com**.
2. En la caja de la página principal escribe
   **colegioatalaya.afa.web@gmail.com** y pulsa el botón de crear la clave de
   acceso (*Create Access Key*).
3. Te llega un correo a ese Gmail con la **Access Key**: una cadena larga tipo
   `a1b2c3d4-5e6f-...`. Puede tardar un par de minutos y a veces cae en *spam*.
4. Confirma el correo si te lo pide. No hace falta crear contraseña ni cuenta.

> El formulario de la web ya está construido y validado. En Web3Forms **no
> tienes que diseñar nada**: solo sirve de pasarela para que el mensaje llegue a
> tu bandeja.

### 2.2 Conectarlo a la web — ✅ YA HECHO

`js/config.js` ya tiene la configuración puesta:

```js
formulario: {
  endpoint: "https://api.web3forms.com/submit",
  accessKey: "75d5743a-e557-4e2e-989b-0388db3af9b5",
  asunto: "Nuevo mensaje desde la web de la AFA"
},
```

El asunto de cada correo lleva añadido el motivo que elija la familia, para
poder clasificar los mensajes desde la lista de la bandeja sin abrirlos.

Si algún día hay que regenerar la clave (por spam, por ejemplo), se cambia solo
esa línea.

### 2.3 Probarlo

1. Sube el cambio y espera a que GitHub Pages lo publique (1–2 minutos).
2. Entra en la página de Contacto **de la web publicada**, no en local.
3. Rellena el formulario con tu propio correo y envíalo.
4. Comprueba tres cosas:
   - Aparece el aviso verde de confirmación en la página.
   - Llega el correo a la bandeja (mira también *spam* la primera vez).
   - Al darle a *Responder* en ese correo, la respuesta va **a la familia**, no
     a vosotros mismos.

Si algo falla, la web muestra un aviso en rojo pidiendo que escriban
directamente al correo de la AFA, así que ningún mensaje se pierde por el camino.

### 2.4 Mantenimiento

- Marca los correos de Web3Forms como "no es spam" la primera vez, para que los
  siguientes lleguen bien.
- El plan gratuito tiene un tope de envíos al mes: compruébalo en su web al dar
  de alta. Para un AFA sobra de largo.
- Si algún día recibís spam por el formulario, se regenera la clave desde el
  panel de Web3Forms y se pega la nueva en `config.js`.

---

## 3. Formulario de alta de socio (Google Forms)

### 3.1 Por qué Google Forms y no un formulario en la web

El alta no es un mensaje: son **datos estructurados** que hay que consultar,
filtrar y cruzar con los pagos durante todo el curso. Con Google Forms las
respuestas caen solas en una hoja de cálculo que tesorería puede ordenar,
buscar y exportar. Reproducir eso en la web exigiría una base de datos.

### 3.2 Propuesta de formulario

Título sugerido: **Alta de socio · AFA Colegio Atalaya · Curso 2026–2027**

Descripción (debajo del título):

> Con esta solicitud tu familia pasa a formar parte de la AFA del Colegio Atalaya
> de Santander. La cuota es **anual y por unidad familiar**, no por alumno.
>
> Responsable del tratamiento: Asociación de Familias de Alumnos del Colegio
> Atalaya de Santander (CIF G-39039813). Usaremos estos datos únicamente para
> gestionar tu condición de socio y para informarte de las actividades de la AFA.
> No se ceden a terceros. Puedes ejercer tus derechos de acceso, rectificación
> y supresión escribiendo a colegioatalaya.afa@gmail.com. Más información en nuestra
> política de privacidad: [enlace a la página de privacidad de la web].

---

#### Sección 1 — Persona de contacto

| Campo | Tipo | Obligatorio |
|---|---|---|
| Nombre y apellidos | Respuesta corta | Sí |
| Relación con el alumnado | Desplegable: Madre / Padre / Tutor o tutora legal | Sí |
| Correo electrónico | Respuesta corta (validación: correo) | Sí |
| Teléfono móvil | Respuesta corta | Sí |
| Segunda persona de contacto (nombre) | Respuesta corta | No |
| Teléfono de la segunda persona | Respuesta corta | No |

*Texto de ayuda en el teléfono:* "Lo usamos solo para avisos urgentes
relacionados con actividades de la AFA."

---

#### Sección 2 — Alumnado matriculado en el centro

Google Forms no permite bloques repetibles, así que se dejan cuatro huecos:
el primero obligatorio y los otros tres opcionales.

| Campo | Tipo | Obligatorio |
|---|---|---|
| Alumno/a 1 · Nombre y apellidos | Respuesta corta | Sí |
| Alumno/a 1 · Curso 2026–2027 | Desplegable con los cursos del centro | Sí |
| Alumno/a 2 · Nombre y apellidos | Respuesta corta | No |
| Alumno/a 2 · Curso | Desplegable | No |
| Alumno/a 3 · Nombre y apellidos | Respuesta corta | No |
| Alumno/a 3 · Curso | Desplegable | No |
| Alumno/a 4 · Nombre y apellidos | Respuesta corta | No |
| Alumno/a 4 · Curso | Desplegable | No |

*Cabecera de sección:* "Indica solo los hijos e hijas matriculados este curso
en el Colegio Atalaya. Si son más de cuatro, escríbenoslo al final."

Para el desplegable de cursos, la lista habitual sería: Infantil 3 años,
Infantil 4 años, Infantil 5 años, 1.º a 6.º de Primaria, 1.º a 4.º de ESO, y
Bachillerato si el centro lo tiene. **Ajústalo a los cursos reales del colegio.**

---

#### Sección 3 — Cuota

| Campo | Tipo | Obligatorio |
|---|---|---|
| Forma de pago | Opción única: Transferencia bancaria / Domiciliación / Efectivo en secretaría | Sí |
| He leído el importe de la cuota y la forma de pago | Casilla de verificación | Sí |

*Cabecera de sección:* "La cuota del curso 2026–2027 es de **XX €** por
familia. [Ajustar al importe aprobado en asamblea.]"

*Texto de ayuda en "Forma de pago":*
> Si eliges **transferencia**, te enviaremos el número de cuenta al confirmar
> el alta.
> Si eliges **domiciliación**, necesitamos la orden SEPA firmada: te la
> haremos llegar para que la entregues en secretaría.

> ⚠ **No pidas el IBAN en este formulario.** Un Google Form no es el sitio para
> datos bancarios: la orden de domiciliación SEPA necesita firma y un
> tratamiento distinto. Que la familia solo indique *cómo* quiere pagar; el
> número de cuenta se recoge en el PDF firmado.

---

#### Sección 4 — Comisiones de trabajo (opcional)

Esta sección es **la más importante del formulario después de los datos de
contacto**, porque es la que convierte el alta en participación real.

*Cabecera de sección:*
> Nuestro trabajo se organiza en comisiones. Marca las que te interesen y te
> avisaremos solo cuando surja algo de esas: no es un compromiso ni un cargo,
> es una lista de avisos. Puedes marcar varias, o ninguna.

| Campo | Tipo | Obligatorio |
|---|---|---|
| ¿En qué comisiones te gustaría participar? | Casillas, una por comisión (lista abajo) | No |
| ¿Cuándo te viene mejor? | Casillas: Mañanas · Tardes · Fines de semana | No |
| Si quieres, cuéntanos qué puedes aportar | Párrafo | No |

**Las casillas deben ser exactamente estas nueve**, las mismas que aparecen en
la página de La AFA:

- Actividades Extraescolares
- Fiestas y eventos
- Actividades en Familia
- Huerto y Medioambiente
- Movilidad e Infraestructuras
- Comunicación
- Convivencia
- Comedor
- Senderismo

Y añade una décima opción, que ahorra malentendidos:

- Ahora mismo no puedo, pero avisadme si hace falta algo puntual

> ⚠ **Que las tres listas coincidan.** Los nombres de las comisiones aparecen
> en tres sitios: la página de La AFA, estas casillas y los grupos a los que
> luego escribís. Si divergen, la columna de la hoja de respuestas deja de
> servir para filtrar. Cuando cambiéis una comisión, cambiadla en los tres.

**Por qué esto es tan útil:** al ser casillas, en la hoja de respuestas te queda
una columna con los nombres marcados. Filtrando por "Fiestas y eventos" tienes
en dos clics la lista de correos a la que escribir cuando toque preparar
Carnaval, en lugar de mandar un correo genérico a todas las familias que casi
nadie contesta.

---

#### Sección 5 — Consentimientos

Aquí hay que tener cuidado: **el consentimiento para publicar imágenes debe ser
independiente y voluntario.** Si lo metes en la misma casilla que el alta, no es
un consentimiento válido, porque la familia no puede asociarse sin aceptarlo.

| Campo | Tipo | Obligatorio |
|---|---|---|
| Acepto el tratamiento de mis datos para la gestión de mi condición de socio y para recibir información de la AFA | Casilla | **Sí** |
| Autorizo la publicación de imágenes en las que aparezcan mis hijos/as, tomadas en actividades de la AFA, en su web y redes sociales | Opción única: Sí, lo autorizo / No lo autorizo | **Sí** (pero ambas respuestas son válidas) |
| Quiero recibir los avisos de la AFA por WhatsApp | Opción única: Sí / No | No |
| ¿Algo más que quieras contarnos? | Párrafo | No |

---

### 3.3 Ajustes del formulario en Google Forms

En la rueda de **Configuración** (los nombres exactos pueden variar según la
versión):

- **Recopilar direcciones de correo**: actívalo. Si te da a elegir, escoge la
  opción en la que **la persona escribe su correo** (no la "verificada"), para no
  obligar a tener cuenta de Google. Muchas familias no la tienen o no están
  identificadas en el navegador del móvil.
- **No** limites a una respuesta por persona: eso obliga a iniciar sesión.
- **Enviar copia de la respuesta a quien responde**: actívalo. Le sirve de
  justificante del alta y te ahorra el "¿seguro que lo mandé?".
- **Mensaje de confirmación** personalizado. Propuesta:

  > ¡Gracias! Hemos recibido tu solicitud de alta en la AFA Atalaya.
  >
  > Te escribiremos en unos días para confirmarla y darte los datos del pago de
  > la cuota. Si en una semana no has recibido nada, avísanos a
  > colegioatalaya.afa@gmail.com.

- **Notificaciones**: en la pestaña de *Respuestas*, activa que te avise por
  correo cuando llegue una nueva. Si no, hay que acordarse de mirar.
- **Vincular a hoja de cálculo**: crea la hoja de respuestas desde la pestaña
  de *Respuestas*.
- **Cerrar el formulario** cuando termine el plazo de altas (desactivar
  "Aceptar respuestas"), con un mensaje explicando cuándo se reabre.

### 3.4 La hoja de respuestas contiene datos personales

Tres reglas:

1. **No la compartas con "cualquiera con el enlace".** Compártela solo con las
   personas concretas que la necesiten: secretaría y tesorería.
2. **No la subas nunca al repositorio de la web.** El `.gitignore` del proyecto
   ya bloquea `.xlsx` y `.csv` por si acaso, pero mejor no llegar a probarlo.
3. Cuando acabe el plazo de conservación, se borra. Los datos de socios no se
   guardan indefinidamente "por si acaso".

### 3.5 Conectarlo a la web

1. En el formulario, pulsa **Enviar** → pestaña del **enlace** → copia la URL
   (puedes marcar "acortar URL").
2. Pega esa URL en `js/config.js`:

```js
enlaces: {
  altaSocio: "https://docs.google.com/forms/d/e/…/viewform",
  inscripcionActividad: "",
  autorizacionImagen: "",
  propuestas: ""
},
```

3. Sube el cambio. Con esa única línea se activan **los 20 botones de alta del
   sitio**: el del header, el del hero de la portada, el del menú móvil, el del
   bloque final de cada página y el de la página de Formularios. Todos abren el
   Google Form en una pestaña nueva. No hay que tocar el HTML.

> **Una consideración de diseño, por si la queréis revisar.** Con esto, el botón
> "Hazte socio" del header lleva directamente al Google Form, sin pasar por la
> página de Formularios donde se explica la cuota y qué hace la AFA. Es lo más
> directo para quien ya viene decidido, pero se pierde la oportunidad de
> convencer a quien todavía duda.
>
> Si en algún momento preferís que el botón del header y el del hero pasen
> primero por la página informativa, basta con quitarles el atributo
> `data-enlace="altaSocio"` en `index.html` y en el header de las demás
> páginas. Los de la página de Formularios se dejan como están.

---

## 3.6 Cómo usar las comisiones en el día a día

Una vez tengáis las respuestas del alta con las comisiones marcadas:

1. **En la hoja de respuestas**, crea una pestaña por comisión con un filtro,
   o usa el filtro de la columna. Google Sheets permite filtrar por "el texto
   contiene" → "Fiestas y eventos".
2. **Cuando toque una actividad de esa comisión**, copias esa columna de correos
   y escribes solo a esas familias. El mensaje pasa de ser una petición genérica
   a una convocatoria dirigida, y la tasa de respuesta cambia por completo.
3. **Nombra a una persona de referencia por comisión**, aunque no sea de la
   junta. Sin alguien que convoque, la lista se queda en una lista.
4. **Revísalo al empezar cada curso**: quien se apuntó el año pasado puede
   seguir o no, y hay familias nuevas.

> **Consejo sobre el número de comisiones.** Nueve son bastantes para arrancar.
> Si al cabo de unos meses hay tres con gente y seis vacías, no pasa nada: se
> marcan las vacías como «en formación» en la web (hay una clase CSS preparada
> para eso) o se agrupan. Es más honesto que mantener nueve comisiones que
> existen solo en el organigrama.

## 4. Los otros tres formularios

Mismo mecanismo: creas el Google Form, pegas su URL en el apartado `enlaces`
de `config.js` y el botón correspondiente se activa solo.

### Inscripción a actividades (`inscripcionActividad`)

**Usad Google Forms, no el formulario propio.** La razón no es estética, es qué
pasa con los datos después:

| | Formulario propio (Web3Forms) | Google Forms |
|---|---|---|
| Qué produce | **Un correo por cada inscripción** | **Una fila por cada inscripción** |
| Para saber quién viene | Contar correos en la bandeja | Mirar la hoja de cálculo |
| Para saber si quedan plazas | Contar correos a mano | Mirar el número de filas |
| Lista para el día de la actividad | Copiar y pegar de los correos | Imprimir la hoja |
| Compartirla con quien organiza | Reenviar correos | Compartir la hoja |

Una inscripción **no es un mensaje: es una lista**. Web3Forms manda mensajes y
Google Forms construye listas. Con veinte familias apuntadas a un taller, la
diferencia entre las dos columnas es una tarde de trabajo.

#### Un solo formulario para todo el curso

No creéis un formulario por actividad: creadlo **una vez** con una pregunta
desplegable de "actividad a la que te inscribes" y actualizad esa lista cada
trimestre. Así la URL no cambia nunca y `inscripcionActividad` en
`js/config.js` se configura una sola vez.

#### Campos

| Campo | Tipo | Obligatorio |
|---|---|---|
| Actividad a la que te inscribes | Desplegable (se actualiza cada trimestre) | Sí |
| Nombre y apellidos de la persona de contacto | Respuesta corta | Sí |
| Correo electrónico | Respuesta corta (validación: correo) | Sí |
| Teléfono móvil | Respuesta corta | Sí |
| Nombre y curso del alumnado que participa | Párrafo | Sí |
| Número de personas que asistiréis en total | Número | Sí |
| ¿Sois familia socia de la AFA? | Sí / No / No lo sé | Sí |
| Algo que debamos tener en cuenta | Párrafo | No |

El campo del **número total de asistentes** es el que os permite controlar el
aforo de verdad: doce inscripciones pueden ser treinta personas.

#### El control de aforo hay que montarlo

Google Forms **no cierra el formulario solo al llegar a X respuestas** — no
trae esa opción de serie. Tres formas de resolverlo, de menos a más esfuerzo:

1. **Cerrarlo a mano.** En la pestaña *Respuestas*, desactivar "Aceptar
   respuestas" cuando se llene. Es lo más simple y para un AFA suele bastar.
2. **Cerrarlo por fecha** con el complemento *formLimiter*, que además permite
   cerrar al alcanzar un número de respuestas.
3. **Aceptar de más y gestionar lista de espera**, avisando en la cabecera de
   que las plazas se asignan por orden de inscripción.

> **Truco que ahorra la mitad de los correos:** poned en la cabecera del
> formulario el aforo y la frase *"las plazas se asignan por orden de
> inscripción; si te quedas fuera te avisamos"*. Y activad el envío de copia de
> la respuesta, que sirve de comprobante. Sin eso, os llegarán diez mensajes de
> "¿me habéis cogido?".

#### ⚠ Cuidado con las alergias

Si la actividad incluye comida o merienda, la tentación es preguntar por
alergias. Ten en cuenta que **los datos de salud son categoría especial en el
RGPD**, con más obligaciones que un nombre o un teléfono. Recomendaciones:

- Pregunta lo mínimo: *"alergias o intolerancias alimentarias que debamos tener
  en cuenta"*, y solo si la actividad lo requiere.
- No lo mezcles con el alta de socio: pídelo por actividad, no de forma
  permanente.
- **Borra esa columna cuando la actividad haya pasado.** No hay razón para
  conservarla todo el curso.
- Que la hoja la vean solo las personas que organizan esa actividad.

#### Cuándo sí valdría el formulario propio

Si la actividad **no tiene aforo ni necesitáis lista** — una charla abierta, por
ejemplo — un correo por persona es suficiente y podéis usar el formulario de
contacto sin más. En la práctica, casi cualquier actividad con niños necesita
lista.

#### Por qué no incrustar el Google Form en la web

Se puede meter con un `iframe` para que la familia no salga del sitio, pero:
carga los servidores de Google en nuestra página (el mismo motivo por el que no
incrustamos el mapa), el diseño no se puede adaptar, y en móvil da problemas de
altura. Es más limpio enlazar y que se abra en una pestaña nueva, que es lo que
ya hace `enlaces-externos.js`.

### Autorización de imagen (`autorizacionImagen`)

Solo tiene sentido como formulario aparte para las familias que **ya son
socias** y quieren cambiar lo que respondieron en el alta, o para actividades
concretas. Campos: nombre de la persona que autoriza, alumnado al que se
refiere, y la autorización Sí / No con fecha.

Si prefieres no duplicarlo, quítalo de la web y gestiona los cambios por correo:
está todo en la respuesta original del alta.

### Propuestas y sugerencias (`propuestas`)

Este **no lo montes**. El formulario de contacto de la web ya tiene "Propuesta o
sugerencia" en el desplegable de motivo, y así todo entra por el mismo sitio.
Deja `propuestas` vacío en la configuración: el botón seguirá llevando a la
página de Contacto, que es donde queremos que vaya.

---

## 5. Checklist de puesta en marcha

### Cuentas
- [x] Decidir el correo público definitivo: `colegioatalaya.afa@gmail.com`
- [x] Ponerlo en `email` dentro de `js/config.js`
- [ ] Activar el reenvío automático del Gmail técnico al correo público
- [ ] Añadir a otra persona de la junta como recuperación de la cuenta de Google
- [ ] Guardar la contraseña del Gmail donde la junta pueda recuperarla

### Formulario de contacto
- [x] Crear la Access Key en web3forms.com con `colegioatalaya.afa.web@gmail.com`
- [x] Rellenar `formulario.endpoint` y `formulario.accessKey` en `config.js`
- [ ] **Publicar la web y hacer un envío de prueba real**
- [ ] Comprobar que el correo llega al Gmail (mirar también la carpeta de spam)
- [ ] Comprobar que al responder a ese correo, la respuesta va a la familia

### Alta de socio
- [ ] Confirmar el importe de la cuota en asamblea
- [ ] Ajustar la lista de cursos del colegio
- [ ] Crear el Google Form de alta con los campos de la sección 3
- [ ] Vincularlo a una hoja de cálculo y restringir con quién se comparte
- [ ] Activar las notificaciones de respuestas
- [ ] Pegar su URL en `enlaces.altaSocio` (activa los 20 botones del sitio)
- [ ] Preparar el PDF de la orden SEPA para las domiciliaciones
