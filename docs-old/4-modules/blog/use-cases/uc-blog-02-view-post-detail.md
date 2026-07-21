# [UC-BLOG-02] View Technical Article Detail

**Module:** Blog (Technical Writing)  
**Main Actor:** Visitor  
**Description:** El visitante hace clic en un post y lee el contenido interactivo completo en formato MDX y Once UI.

---

## 1. Preconditions

* El `slug` proporcionado en la ruta coincide con un archivo físico `.mdx` existente.
* La ruta del post está activa en la compilación estática (`generateStaticParams`).

---

## 2. Main Flow (Happy Path)

1. El visitante hace clic en una tarjeta o navega a `/[locale]/blog/[slug]`.
2. La vista invoca de forma asíncrona al ViewModel `getBlogPostViewModel(slug, locale)`.
3. El ViewModel solicita al Repositorio el post por su slug (`mdxBlogRepository.getBySlug(slug)`).
4. El Repositorio lee el archivo MDX, procesa frontmatter, e instancia la entidad de dominio `BlogPost`.
5. El ViewModel valida los invariantes, calcula el tiempo de lectura, traduce la metadata e inyecta la variable del diccionario modular `d` en el scope del compilador MDX.
6. El compilador de MDXRemote renderiza el contenido, e intercepta los enlaces mediante `createCustomLink` para mantenerlos localizados.
7. La Vista visualiza el post formateado con cabecera de autor, fecha formateada y tipografía premium.

---

## 3. Alternate Flows / Exceptions

### A1 - Slug inexistente o inválido
1. El Repositorio devuelve `null` al no encontrar el archivo físico.
2. El ViewModel lanza una redirección automática a la página 404 estática localizada.
3. El visitante es informado de que el artículo no existe.

---

## 4. Postconditions

* **Success:** El visitante lee el post completamente localizado, con interactividad JSX segura y enlaces relativos auto-enrutados al locale actual.

---

[back](./index.md)
