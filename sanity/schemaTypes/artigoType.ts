import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Schema para artigos do Jornal Lusitano
 * Estrutura preparada para migração futura do articlesData.tsx
 */
export const artigoType = defineType({
  name: "artigo",
  title: "Artigo Jornal",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "id",
      title: "ID (slug numérico)",
      type: "string",
      description: "Identificador único do artigo (ex: 1, 2, 3)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Título (Inglês)",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo",
      type: "string",
    }),
    defineField({
      name: "subtitleEn",
      title: "Subtítulo (Inglês)",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Descrição (SEO)",
      type: "text",
      description: "Meta description para motores de busca",
    }),
    defineField({
      name: "descriptionEn",
      title: "Descrição (Inglês, SEO)",
      type: "text",
    }),
    defineField({
      name: "keywords",
      title: "Palavras-chave (SEO)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "date",
      title: "Data de publicação",
      type: "string",
    }),
    defineField({
      name: "readTime",
      title: "Tempo de leitura",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Categoria",
      type: "string",
    }),
    defineField({
      name: "categoryEn",
      title: "Categoria (Inglês)",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Imagem de capa",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Texto alternativo",
        },
      ],
    }),
    defineField({
      name: "body",
      title: "Conteúdo",
      type: "blockContent",
      description: "Conteúdo principal do artigo (Portable Text)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      id: "id",
      media: "image",
    },
    prepare({ title, id }) {
      return {
        title: title || `Artigo ${id}`,
        subtitle: `ID: ${id}`,
      };
    },
  },
});
