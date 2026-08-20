# Documentos públicos del AFA

Los PDF que se descargan desde la web van en esta carpeta.

## Cómo publicar un documento

1. Sube el PDF aquí (en github.com puedes arrastrarlo dentro de la carpeta).
2. Abre `paginas/formularios/index.html`, busca el enlace de ese documento y
   quita la clase `is-pending` y el atributo `aria-disabled="true"`.
3. Confirma los cambios. En un par de minutos está publicado.

## Nombres de fichero esperados

La web ya apunta a estos nombres exactos. Si usas otros, hay que cambiar
también el `href` en `paginas/formularios/index.html`.

| Fichero | Contenido |
|---|---|
| `estatutos-afa-atalaya.pdf` | Estatutos de la asociación |
| `acta-constitucion-junta-2026-03-20.pdf` | Acta de constitución de la junta |
| `memoria-curso-2025-2026.pdf` | Memoria del curso anterior |
| `bases-concursos-2026-2027.pdf` | Bases de los concursos |

## Convención de nombres

- Sin tildes, sin eñes y sin espacios (usa guiones).
- Todo en minúsculas.
- Fechas en formato `AAAA-MM-DD`, así se ordenan solas:
  `acta-asamblea-2026-10-10.pdf`.

## Qué NO subir aquí

El repositorio es público y **el historial de Git conserva los ficheros
incluso después de borrarlos**. No subas nunca:

- Listados de socios o de familias.
- Actas o documentos con NIF, direcciones o teléfonos.
- Datos bancarios ni órdenes de domiciliación firmadas.
- Fotografías de menores sin consentimiento por escrito.

Si necesitáis compartir alguno de esos documentos con las familias asociadas,
hacedlo por correo o por una carpeta privada de Drive, no por la web.

## Límites técnicos

GitHub Pages admite hasta 1 GB de sitio publicado y 100 MB por fichero, con un
límite blando de 100 GB de tráfico al mes. Para documentos del AFA es de sobra.
Si algún día hay vídeo, mejor enlazarlo a Drive o YouTube.
