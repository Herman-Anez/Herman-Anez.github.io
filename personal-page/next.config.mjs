import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita la compilación estática nativa (HTML/CSS/JS puros) apta para CDNs como GitHub Pages
  output: "export",
  //  basePath: "/herman-personal-blog",  eliminado para hacer funcionar el sitio como dominio raiz, razon: las imagenes no cargaban
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    // Deshabilita la optimización dinámica en caliente al no contar con un servidor de Node en producción
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  // Genera rutas estructuradas como '/ruta/index.html' en vez de '/ruta.html' para evitar fallos 404 al refrescar
  trailingSlash: true,
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default withMDX(nextConfig);
