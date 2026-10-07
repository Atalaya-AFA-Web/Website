# Contexto: carnet de socio virtual de la AFA Atalaya

Fichero de traspaso para continuar el proyecto en Claude Cowork. Guárdalo en la raíz de
`C:\PERSONAL\AFA Atalaya\Website`. No se publica en la web, porque `.vercelignore` excluye los `*.md` y
`vercel.json` redirige cualquier `.md` a la portada.

**Propuesta completa (documento compartible):**
https://claude.ai/code/artifact/a81c10f3-0129-4d5c-8deb-74610b69637d

**Forma de trabajar:** ante cualquier duda, parar y preguntar antes de decidir.

---

## 1. Objetivo

Crear un carnet de socio virtual y gratuito para que las familias socias obtengan descuentos en comercios
locales de Santander. El sistema tiene que:

- dejar que el comercio valide el carnet de forma sencilla;
- ser difícil de falsificar;
- evitar la suplantación, cotejando el nombre del carnet con el DNI;
- cumplir el RGPD y la LOPDGDD;
- no generar coste a la AFA ni a los comercios.

## 2. Decisiones tomadas

| Tema | Decisión |
| --- | --- |
| Titulares | Un carnet por adulto (progenitor o tutor), cada uno con su nombre, máximo 2 por familia. Vale igual para familias que conviven, separadas, monoparentales o con dos madres o dos padres. La cuota es por familia: 18 €/año. |
| Vigencia | Por curso escolar. Caduca el 31 de agosto, que es el cierre del ejercicio (art. 29 de los Estatutos). |
| Validación | QR firmado digitalmente. El comercio lo escanea con la cámara de su móvil, sin app, y se abre `/validar/` en la web de la AFA, que muestra VÁLIDO o NO VÁLIDO con el nombre, el curso y un reloj en marcha. |
| Antisuplantación | El comercio pide el DNI y coteja el nombre. El DNI no se anota ni aparece en el carnet. |
| Firma | RSA 2048 con SHA-256 (RSASSA-PKCS1-v1_5). Se eligió porque Apps Script lo firma con `Utilities.computeRsaSha256Signature` y el navegador lo verifica con WebCrypto, sin librerías. |
| Emisión | Google Sheet de socios con un Apps Script (menú *Carnets → Emitir pendientes*) que firma y envía el enlace por Gmail desde la cuenta de la AFA. Gmail gratuito admite unos 100 destinatarios al día, así que el envío se reparte en varios días. |
| Bajas | Fichero público solo con números de carnet. Para dar de baja se edita y se hace push, y Vercel lo publica en un minuto. |
| Infraestructura | Web estática actual en Vercel (plan Hobby gratuito), sin base de datos ni funciones serverless. |
| Datos | En el carnet solo van número, nombre y apellidos, curso y caducidad. Ni DNI, ni hijos, ni correo. |
| Gestión | La Secretaría, que lleva el fichero de asociados (art. 13 de los Estatutos). |

**Alternativa descartada por ahora:** una función de Vercel con base de datos para consultar las bajas en vivo.
Solo compensa si hay muchas bajas a mitad de curso.

## 3. Diseño técnico

### Formato del carnet (token)

```
token = base64url(JSON payload UTF-8) + "." + base64url(firma RSA-SHA256 del payload)

payload = {
  "v": 1,                      // versión del formato
  "id": "2627-0042-A",         // nº de carnet: curso-familia-adulto (A/B)
  "n": "Nombre Apellido Apellido",
  "c": "2627",                 // curso → elige la clave pública
  "exp": "2027-08-31"
}
```

- Carnet del socio: `https://afacolegioatalaya.es/carnet/#<token>`
- URL del QR: `https://afacolegioatalaya.es/validar/#<token>`
- Los datos van después de `#`, así que el navegador no los envía al servidor y Vercel no registra nombres.
- Los nombres llevan tildes: hay que codificar en UTF-8 antes de pasar a base64url, en Apps Script y en el navegador.

### Piezas a construir

1. **`/carnet/index.html`.** Muestra el carnet con el nombre de la AFA, el nombre en grande, "Socio/a · curso
   2026-2027", "Válido hasta 31/08/2027", el nº de carnet y el QR. Guarda el token en el almacenamiento
   del propio navegador para poder abrirlo desde la pantalla de inicio. Incluye instrucciones para "Añadir a pantalla de inicio".
2. **`/validar/index.html`.** Lee el token del `#`, elige la clave por `c`, verifica la firma con WebCrypto y
   comprueba `exp` y `bajas.json`. Muestra en grande VÁLIDO (verde) o NO VÁLIDO (rojo) con el motivo (falso
   o alterado, caducado, baja), el nombre, el curso y la hora con segundos avanzando. Si no puede leer
   `bajas.json`, lo avisa.
3. **`/carnet/claves/2627.pem`.** Clave pública del curso.
4. **`/carnet/bajas.json`.** Lista de números de carnet dados de baja, por ejemplo `["2627-0042-A"]`.
5. **Librería de QR copiada en el propio proyecto** (por ejemplo, qrcode-generator, MIT). La web no carga nada de
   terceros y hay que mantenerlo así.
6. **Apps Script en el Google Sheet de socios.** Asigna el nº de carnet, compone el payload, lo firma con la clave
   de las Propiedades del script, envía el correo con el enlace, marca la fila como emitida y controla el
   cupo diario de Gmail. El correo incluye la información básica de privacidad.
7. **Página "Descuentos para socios"** con la lista de comercios adheridos, enlazada desde el menú.
8. **Hoja de una página para comercios:** escanear siempre con su móvil, comprobar la dirección
   afacolegioatalaya.es, comprobar que la hora avanza, cotejar con el DNI y no guardar datos.

Las páginas nuevas siguen las convenciones de la web: una carpeta por página, el mismo header y footer, rutas
`../../`, CSS en `styles.css`/`paginas.css`, JS propio por página y «la AFA» en femenino.

### Columnas nuevas del Sheet de socios

Una fila por adulto, con `familia`, `nombre`, `apellidos`, `correo`, `cuota_pagada_curso`, `n_carnet`, `estado`
(pendiente / emitido / baja) y `fecha_envio`.

## 4. Generación de claves (cada septiembre)

1. Generar el par de claves con OpenSSL (en Windows viene con Git for Windows y se usa desde Git Bash):
   ```
   openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out privada-2627.pem
   openssl pkey -in privada-2627.pem -pubout -out publica-2627.pem
   ```
2. La clave privada va a *Apps Script → Configuración del proyecto → Propiedades del script*, como
   `CLAVE_PRIVADA_2627`. Nunca en celdas del Sheet, en el repositorio ni en carpetas compartidas.
3. La clave pública va a `/carnet/claves/2627.pem`, y se publica con un push.
4. Después, borrar `privada-2627.pem` del ordenador. No se hace copia: si se pierde, se genera otra y se reemite.
5. El curso siguiente se repite con `2728` y se retira la clave pública antigua, con lo que los carnets viejos dejan de validar.

Sobre la custodia: quien edita el Sheet puede ver la clave privada. Hay que limitar los editores a Secretaría y
Tesorería y proteger la cuenta de Google de la AFA con verificación en dos pasos.

Si la clave se filtra, se genera un par nuevo, se sustituye la propiedad del script y el `.pem` público, y se reemiten los carnets.

**Pendiente de decidir:** si se hace una página HTML local (fuera del despliegue) que genere las claves con un botón
mediante WebCrypto, para miembros de la Junta que no usen consola.

## 5. Contexto de la web

- Web estática: HTML, CSS y JS sin frameworks ni compilación. Desplegada en Vercel. Dominio: afacolegioatalaya.es.
- `js/config.js` es el único fichero de configuración: el formulario de contacto (Web3Forms), los enlaces a Google Forms y las redes.
- El alta de socio se hace con un Google Form, cuyas respuestas van a un Sheet. **Ahora solo recoge un adulto**: hay que añadir
  el segundo adulto (nombre, apellidos y correo).
- Correo público: colegioatalaya.afa@gmail.com. Cuenta técnica de formularios: colegioatalaya.afa.web@gmail.com.
- La cuota la cobra el colegio junto con sus recibos.
- `paginas/privacidad/` tiene una tabla de tratamientos, a la que hay que añadir "Carnet de socio". La web no usa cookies ni analítica, y debe seguir así.
- Los Estatutos están en `docs/estatutos-afa-atalaya.pdf`. Artículos relevantes: 13 (Secretaría), 23 (socios: padres o tutores) y 29 (ejercicio hasta el 31 de agosto).

## 6. Plan

1. **Datos.** Ampliar el Google Form de alta con el segundo adulto y añadir las columnas nuevas al Sheet.
2. **Construir.** Hacer `/carnet/`, `/validar/`, las claves, `bajas.json`, el Apps Script y la página de descuentos.
3. **Piloto.** Probarlo con la Junta (6 carnets) y un comercio de confianza durante 2 semanas, en iPhone y Android, con buena y mala cobertura.
4. **Lanzamiento.** Actualizar la privacidad, publicar los descuentos, emitir los carnets y repartir la hoja a los comercios.

## 7. Decisiones abiertas

- [ ] ¿Confirma la Junta que los dos adultos de una familia son socios (art. 23) con un único pago de cuota?
- [ ] ¿Cómo llega a la AFA el listado de familias que han pagado, si la cuota la cobra el colegio?
- [ ] ¿Quién custodia la clave y la cuenta de Google desde la que se emiten los carnets?
- [ ] ¿Se emiten carnets en altas a mitad de curso, con la misma caducidad?
- [ ] ¿Qué comercios participan en el piloto?
- [ ] ¿Se mantiene Vercel Hobby, pensado para uso no comercial? Si no, la alternativa es GitHub Pages o Cloudflare Pages.
- [ ] ¿Se hace la página generadora de claves?

## 8. Siguiente paso sugerido en Cowork

> Lee `contexto-carnet-afa.md`. Empezamos por el paso 2: construye `/validar/` y `/carnet/` siguiendo las
> convenciones de la web, con un par de claves de prueba. Pregúntame cualquier duda antes de decidir.
