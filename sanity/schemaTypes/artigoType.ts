import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Schema para artigos do Jornal Lusitano (redesenhado)
 * Suporta artigos longos e crónicas curtas, PT/EN, com fontes verificadas
 */
export const artigoType = defineType({
  name: "artigo",
  title: "Artigo Jornal",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Título (PT)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Título (EN)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slugLegacy",
      title: "ID Legado",
      type: "string",
      description: "ID numérico antigo (1-6) para redirects",
    }),
    defineField({
      name: "contentType",
      title: "Tipo de Conteúdo",
      type: "string",
      options: {
        list: [
          { title: "Artigo (longo)", value: "article" },
          { title: "Crónica (curta)", value: "post" },
        ],
      },
      initialValue: "article",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Destaque",
      type: "boolean",
      initialValue: false,
      description: "Artigo em destaque na listagem",
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo (PT)",
      type: "string",
    }),
    defineField({
      name: "subtitleEn",
      title: "Subtítulo (EN)",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Descrição SEO (PT)",
      type: "text",
      description: "Meta description para motores de busca",
    }),
    defineField({
      name: "descriptionEn",
      title: "Descrição SEO (EN)",
      type: "text",
    }),
    defineField({
      name: "keywords",
      title: "Palavras-chave (SEO)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Data de Publicação",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "estimatedReadTime",
      title: "Tempo de Leitura (minutos)",
      type: "number",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "categories",
      title: "Categorias",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
    }),
    defineField({
      name: "category",
      title: "Categoria (PT - texto)",
      type: "string",
      description: "Categoria em texto livre (PT)",
    }),
    defineField({
      name: "categoryEn",
      title: "Categoria (EN - texto)",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Imagem de Capa",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Texto Alternativo",
        },
      ],
    }),
    defineField({
      name: "body",
      title: "Conteúdo (PT)",
      type: "blockContent",
      description: "Conteúdo principal do artigo em Português",
    }),
    defineField({
      name: "bodyEn",
      title: "Conteúdo (EN)",
      type: "blockContent",
      description: "Conteúdo principal do artigo em Inglês",
    }),
    defineField({
      name: "sources",
      title: "Fontes e Referências",
      type: "array",
      description: "Lista de fontes verificadas (regra fundamental do projecto)",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Descrição", type: "string", validation: (Rule) => Rule.required() },
            { name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Data de Publicação (mais recente)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      media: "image",
      contentType: "contentType",
    },
    prepare({ title, subtitle, media, contentType }) {
      const typeLabel = contentType === "post" ? "Crónica" : "Artigo";
      return {
        title: title || "Sem título",
        subtitle: `[${typeLabel}] ${subtitle || ""}`,
        media,
      };
    },
  },
});
