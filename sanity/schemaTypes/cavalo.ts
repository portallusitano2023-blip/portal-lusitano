import { defineType, defineField } from 'sanity'

export const cavalo = defineType({
  name: 'cavalo',
  title: 'Cavalo',
  type: 'document',
  groups: [
    {name: 'identificacao', title: 'Identificação'},
    {name: 'detalhes', title: 'Detalhes Técnicos'},
    {name: 'comercial', title: 'Dados Comerciais'},
    {name: 'genealogia', title: 'Genealogia'},
    {name: 'multimedia', title: 'Multimédia'},
  ],
  fields: [
    // --- GRUPO: IDENTIFICAÇÃO ---
    defineField({
      name: 'nome',
      title: 'Nome do Cavalo',
      type: 'string',
      group: 'identificacao',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Link)',
      type: 'slug',
      group: 'identificacao',
      options: { source: 'nome', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),

    // --- GRUPO: DETALHES TÉCNICOS ---
    defineField({
      name: 'disciplina',
      title: 'Disciplina Principal',
      type: 'string',
      group: 'detalhes',
      options: {
        list: [
          { title: 'Adestramento (Dressage)', value: 'adestramento' },
          { title: 'Equitação de Trabalho', value: 'trabalho' },
          { title: 'Saltos', value: 'saltos' },
          { title: 'Atrelagem', value: 'atrelagem' },
          { title: 'Modelo e Andamentos', value: 'modelo' },
          { title: 'Lazer', value: 'lazer' },
        ],
      },
    }),
    defineField({
      name: 'sexo',
      title: 'Sexo',
      type: 'string',
      group: 'detalhes',
      options: {
        list: [
          { title: 'Garanhão', value: 'garahnao' },
          { title: 'Égua', value: 'egua' },
          { title: 'Castrado', value: 'castrado' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'dataNascimento',
      title: 'Data de Nascimento',
      description: 'A idade será calculada automaticamente no site.',
      type: 'date',
      group: 'detalhes',
    }),
    defineField({
      name: 'altura',
      title: 'Altura (em metros)',
      description: 'Exemplo: 1.65',
      type: 'number',
      group: 'detalhes',
    }),

    // --- GRUPO: DADOS COMERCIAIS ---
    defineField({
      name: 'estado',
      title: 'Estado',
      type: 'string',
      group: 'comercial',
      options: {
        list: [
          { title: 'À Venda', value: 'venda' },
          { title: 'Vendido', value: 'vendido' },
          { title: 'Reprodutor', value: 'reprodutor' },
        ],
      },
    }),
    defineField({
      name: 'preco',
      title: 'Preço (€)',
      type: 'number',
      group: 'comercial',
      description: 'Deixa em branco se for "Preço sob consulta"',
    }),
    defineField({
      name: 'localizacao',
      title: 'Localização (Cidade, País)',
      type: 'string',
      group: 'comercial',
      initialValue: 'Golegã, Portugal',
    }),
    defineField({
      name: 'coudelaria',
      title: 'Coudelaria / Criador',
      type: 'reference',
      group: 'comercial',
      to: [{ type: 'empresa' }],
    }),

    // --- GRUPO: GENEALOGIA ---
    defineField({
      name: 'pai',
      title: 'Pai',
      type: 'reference',
      group: 'genealogia',
      to: [{ type: 'cavalo' }],
    }),
    defineField({
      name: 'mae',
      title: 'Mãe',
      type: 'reference',
      group: 'genealogia',
      to: [{ type: 'cavalo' }],
    }),

    // --- GRUPO: MULTIMÉDIA ---
    defineField({
      name: 'fotografiaPrincipal',
      title: 'Fotografia de Capa',
      type: 'image',
      group: 'multimedia',
      options: { hotspot: true },
    }),
    defineField({
      name: 'galeria',
      title: 'Galeria de Fotos',
      type: 'array',
      group: 'multimedia',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'video',
      title: 'Link do Vídeo',
      type: 'url',
      group: 'multimedia',
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição',
      type: 'array',
      group: 'multimedia',
      of: [{type: 'block'}]
    }),
  ],
})