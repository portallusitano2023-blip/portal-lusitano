import {defineType, defineArrayMember} from 'sanity'
import {ImageIcon, InfoOutlineIcon, BarChartIcon, BlockElementIcon, WarningOutlineIcon} from '@sanity/icons'

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
        {title: 'Lead Paragraph', value: 'leadParagraph'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    // Info Box
    defineArrayMember({
      name: 'infoBox',
      title: 'Info Box',
      type: 'object',
      icon: InfoOutlineIcon,
      fields: [
        {name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required()},
        {name: 'titleEn', title: 'Título (EN)', type: 'string'},
        {name: 'icon', title: 'Ícone (nome Lucide)', type: 'string', description: 'Ex: BookOpen, AlertTriangle, Shield'},
        {name: 'variant', title: 'Variante', type: 'string', options: {list: ['default', 'warning']}, initialValue: 'default'},
        {name: 'content', title: 'Conteúdo (PT)', type: 'blockContent'},
        {name: 'contentEn', title: 'Conteúdo (EN)', type: 'blockContent'},
      ],
      preview: {
        select: {title: 'title'},
        prepare({title}) {
          return {title: title || 'Info Box', subtitle: 'Info Box'}
        },
      },
    }),
    // Stat Card Group
    defineArrayMember({
      name: 'statCardGroup',
      title: 'Stat Cards',
      type: 'object',
      icon: BarChartIcon,
      fields: [
        {name: 'title', title: 'Título do Grupo', type: 'string'},
        {name: 'icon', title: 'Ícone (nome Lucide)', type: 'string'},
        {
          name: 'cards',
          title: 'Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'value', title: 'Valor', type: 'string', validation: (Rule) => Rule.required()},
                {name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required()},
                {name: 'titleEn', title: 'Título (EN)', type: 'string'},
                {name: 'subtitle', title: 'Subtítulo', type: 'string'},
                {name: 'subtitleEn', title: 'Subtítulo (EN)', type: 'string'},
                {name: 'description', title: 'Descrição', type: 'text'},
                {name: 'descriptionEn', title: 'Descrição (EN)', type: 'text'},
                {name: 'highlight', title: 'Destaque', type: 'boolean', initialValue: false},
              ],
              preview: {
                select: {title: 'title', value: 'value'},
                prepare({title, value}) {
                  return {title: title || 'Card', subtitle: value}
                },
              },
            },
          ],
        },
      ],
      preview: {
        select: {title: 'title'},
        prepare({title}) {
          return {title: title || 'Stat Cards', subtitle: 'Stat Card Group'}
        },
      },
    }),
    // Pillar Card Group
    defineArrayMember({
      name: 'pillarCardGroup',
      title: 'Pillar Cards',
      type: 'object',
      icon: BlockElementIcon,
      fields: [
        {
          name: 'cards',
          title: 'Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'icon', title: 'Ícone (nome Lucide)', type: 'string'},
                {name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required()},
                {name: 'titleEn', title: 'Título (EN)', type: 'string'},
                {name: 'content', title: 'Conteúdo (PT)', type: 'blockContent'},
                {name: 'contentEn', title: 'Conteúdo (EN)', type: 'blockContent'},
              ],
              preview: {
                select: {title: 'title'},
                prepare({title}) {
                  return {title: title || 'Pillar Card'}
                },
              },
            },
          ],
        },
      ],
      preview: {
        prepare() {
          return {title: 'Pillar Cards', subtitle: 'Pillar Card Group'}
        },
      },
    }),
    // Article Section Divider
    defineArrayMember({
      name: 'articleSection',
      title: 'Section Divider',
      type: 'object',
      icon: BlockElementIcon,
      fields: [
        {name: 'title', title: 'Título (PT)', type: 'string', validation: (Rule) => Rule.required()},
        {name: 'titleEn', title: 'Título (EN)', type: 'string'},
      ],
      preview: {
        select: {title: 'title'},
        prepare({title}) {
          return {title: title || 'Section', subtitle: 'Section Divider'}
        },
      },
    }),
    // Warning Box
    defineArrayMember({
      name: 'warningBox',
      title: 'Warning Box',
      type: 'object',
      icon: WarningOutlineIcon,
      fields: [
        {name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required()},
        {name: 'titleEn', title: 'Título (EN)', type: 'string'},
        {name: 'icon', title: 'Ícone (nome Lucide)', type: 'string'},
        {name: 'content', title: 'Conteúdo (PT)', type: 'blockContent'},
        {name: 'contentEn', title: 'Conteúdo (EN)', type: 'blockContent'},
      ],
      preview: {
        select: {title: 'title'},
        prepare({title}) {
          return {title: title || 'Warning', subtitle: 'Warning Box'}
        },
      },
    }),
  ],
})
