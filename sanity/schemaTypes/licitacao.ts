export default {
  name: 'licitacao',
  title: 'Licitações Recebidas',
  type: 'document',
  fields: [
    {
      name: 'nome',
      title: 'Nome do Investidor',
      type: 'string',
    },
    {
      name: 'email',
      title: 'E-mail',
      type: 'string',
    },
    {
      name: 'telefone',
      title: 'Telefone',
      type: 'string',
    },
    {
      name: 'valor',
      title: 'Valor da Proposta (€)',
      type: 'number',
    },
    {
      name: 'cavalo',
      title: 'Exemplar Licidado',
      type: 'string',
    },
    {
      name: 'dataHora',
      title: 'Data e Hora',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
    },
  ],
}