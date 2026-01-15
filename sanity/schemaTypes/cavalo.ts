import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cavalo',
  title: 'Cavalos',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome do Cavalo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Link do Site)',
      type: 'slug',
      options: {
        source: 'nome',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fotografiaPrincipal',
      title: 'Fotografia Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    // === NOVOS CAMPOS ADICIONADOS ===
    defineField({
      name: 'galeria',
      title: 'Galeria de Fotos (Extra)',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'preco',
      title: 'Preço (Ex: 15000)',
      type: 'number',
    }),
    defineField({
      name: 'idade',
      title: 'Ano de Nascimento (Ex: 2019)',
      type: 'string',
    }),
    defineField({
      name: 'altura',
      title: 'Altura (Ex: 1.65)',
      type: 'number',
    }),
    defineField({
      name: 'genero',
      title: 'Género',
      type: 'string',
      options: {
        list: [
          { title: 'Macho (Garanhão)', value: 'Macho' },
          { title: 'Égua', value: 'Égua' },
          { title: 'Castrado', value: 'Castrado' },
        ],
      },
    }),
    defineField({
      name: 'localizacao',
      title: 'Localização (Ex: Lisboa, Portugal)',
      type: 'string',
    }),
    defineField({
      name: 'disciplina',
      title: 'Disciplina (Ex: Dressage, Lazer)',
      type: 'string',
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição Completa / História',
      type: 'text',
    }),
  ],
})