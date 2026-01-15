import { defineField, defineType } from 'sanity'

export const subscritor = defineType({
  name: 'subscritor',
  title: 'Subscritores da Newsletter',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'dataInscricao',
      title: 'Data de Inscrição',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
})