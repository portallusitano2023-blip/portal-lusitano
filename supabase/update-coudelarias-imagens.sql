-- =============================================
-- ATUALIZAR IMAGENS DAS COUDELARIAS
-- Executar no Supabase SQL Editor depois de
-- colocar as imagens em public/images/coudelarias/
-- =============================================
-- Formato esperado:
--   Capa:    public/images/coudelarias/<slug>/capa.jpg
--   Galeria: public/images/coudelarias/<slug>/galeria-1.jpg, galeria-2.jpg, etc.
-- =============================================

-- 1. Alter Real
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/alter-real/capa.jpg',
  galeria = ARRAY['/images/coudelarias/alter-real/galeria-1.jpg', '/images/coudelarias/alter-real/galeria-2.jpg', '/images/coudelarias/alter-real/galeria-3.jpg']
WHERE slug = 'alter-real';

-- 2. Companhia das Lezírias
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/companhia-das-lezirias/capa.jpg',
  galeria = ARRAY['/images/coudelarias/companhia-das-lezirias/galeria-1.jpg', '/images/coudelarias/companhia-das-lezirias/galeria-2.jpg', '/images/coudelarias/companhia-das-lezirias/galeria-3.jpg']
WHERE slug = 'companhia-das-lezirias';

-- 3. Coudelaria Veiga
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/coudelaria-veiga/capa.jpg',
  galeria = ARRAY['/images/coudelarias/coudelaria-veiga/galeria-1.jpg', '/images/coudelarias/coudelaria-veiga/galeria-2.jpg', '/images/coudelarias/coudelaria-veiga/galeria-3.jpg']
WHERE slug = 'coudelaria-veiga';

-- 4. Coudelaria Andrade
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/coudelaria-andrade/capa.jpg',
  galeria = ARRAY['/images/coudelarias/coudelaria-andrade/galeria-1.jpg', '/images/coudelarias/coudelaria-andrade/galeria-2.jpg', '/images/coudelarias/coudelaria-andrade/galeria-3.jpg']
WHERE slug = 'coudelaria-andrade';

-- 5. Fonte Boa dos Nabos
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/fonte-boa-dos-nabos/capa.jpg',
  galeria = ARRAY['/images/coudelarias/fonte-boa-dos-nabos/galeria-1.jpg', '/images/coudelarias/fonte-boa-dos-nabos/galeria-2.jpg', '/images/coudelarias/fonte-boa-dos-nabos/galeria-3.jpg']
WHERE slug = 'fonte-boa-dos-nabos';

-- 6. Coudelaria Lusitanus
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/coudelaria-lusitanus/capa.jpg',
  galeria = ARRAY['/images/coudelarias/coudelaria-lusitanus/galeria-1.jpg', '/images/coudelarias/coudelaria-lusitanus/galeria-2.jpg', '/images/coudelarias/coudelaria-lusitanus/galeria-3.jpg']
WHERE slug = 'coudelaria-lusitanus';

-- 7. Herdade do Pinheiro
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/herdade-do-pinheiro/capa.jpg',
  galeria = ARRAY['/images/coudelarias/herdade-do-pinheiro/galeria-1.jpg', '/images/coudelarias/herdade-do-pinheiro/galeria-2.jpg', '/images/coudelarias/herdade-do-pinheiro/galeria-3.jpg']
WHERE slug = 'herdade-do-pinheiro';

-- 8. Monte Velho
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/monte-velho/capa.jpg',
  galeria = ARRAY['/images/coudelarias/monte-velho/galeria-1.jpg', '/images/coudelarias/monte-velho/galeria-2.jpg', '/images/coudelarias/monte-velho/galeria-3.jpg', '/images/coudelarias/monte-velho/galeria-4.jpg', '/images/coudelarias/monte-velho/galeria-5.jpg', '/images/coudelarias/monte-velho/galeria-6.jpg', '/images/coudelarias/monte-velho/galeria-7.jpg', '/images/coudelarias/monte-velho/galeria-8.jpg', '/images/coudelarias/monte-velho/galeria-9.jpg', '/images/coudelarias/monte-velho/galeria-10.jpg', '/images/coudelarias/monte-velho/galeria-11.jpg']
WHERE slug = 'monte-velho';

-- 9. Quinta da Foz
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/quinta-da-foz/capa.jpg',
  galeria = ARRAY['/images/coudelarias/quinta-da-foz/galeria-1.jpg', '/images/coudelarias/quinta-da-foz/galeria-2.jpg', '/images/coudelarias/quinta-da-foz/galeria-3.jpg']
WHERE slug = 'quinta-da-foz';

-- 10. Morgado Lusitano
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/morgado-lusitano/capa.jpg',
  galeria = ARRAY['/images/coudelarias/morgado-lusitano/galeria-1.jpg', '/images/coudelarias/morgado-lusitano/galeria-2.jpg', '/images/coudelarias/morgado-lusitano/galeria-3.jpg']
WHERE slug = 'morgado-lusitano';

-- 11. Vale de Água
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/vale-de-agua/capa.jpg',
  galeria = ARRAY['/images/coudelarias/vale-de-agua/galeria-1.jpg', '/images/coudelarias/vale-de-agua/galeria-2.jpg', '/images/coudelarias/vale-de-agua/galeria-3.jpg']
WHERE slug = 'vale-de-agua';

-- 12. São Tiago
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/sao-tiago/capa.jpg',
  galeria = ARRAY['/images/coudelarias/sao-tiago/galeria-1.jpg', '/images/coudelarias/sao-tiago/galeria-2.jpg', '/images/coudelarias/sao-tiago/galeria-3.jpg']
WHERE slug = 'sao-tiago';

-- 13. Quinta do Brejo
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/quinta-do-brejo/capa.jpg',
  galeria = ARRAY['/images/coudelarias/quinta-do-brejo/galeria-1.jpg', '/images/coudelarias/quinta-do-brejo/galeria-2.jpg', '/images/coudelarias/quinta-do-brejo/galeria-3.jpg']
WHERE slug = 'quinta-do-brejo';

-- 14. Coudelaria Rocim
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/coudelaria-rocim/capa.jpg',
  galeria = ARRAY['/images/coudelarias/coudelaria-rocim/galeria-1.jpg', '/images/coudelarias/coudelaria-rocim/galeria-2.jpg', '/images/coudelarias/coudelaria-rocim/galeria-3.jpg']
WHERE slug = 'coudelaria-rocim';

-- 15. Barroca d'Alva
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/barroca-dalva/capa.jpg',
  galeria = ARRAY['/images/coudelarias/barroca-dalva/galeria-1.jpg', '/images/coudelarias/barroca-dalva/galeria-2.jpg', '/images/coudelarias/barroca-dalva/galeria-3.jpg']
WHERE slug = 'barroca-dalva';

-- 16. Quinta dos Lobos
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/quinta-dos-lobos/capa.jpg',
  galeria = ARRAY['/images/coudelarias/quinta-dos-lobos/galeria-1.jpg', '/images/coudelarias/quinta-dos-lobos/galeria-2.jpg', '/images/coudelarias/quinta-dos-lobos/galeria-3.jpg']
WHERE slug = 'quinta-dos-lobos';

-- 17. Malhadinha Nova
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/malhadinha-nova/capa.jpg',
  galeria = ARRAY['/images/coudelarias/malhadinha-nova/galeria-1.jpg', '/images/coudelarias/malhadinha-nova/galeria-2.jpg', '/images/coudelarias/malhadinha-nova/galeria-3.jpg']
WHERE slug = 'malhadinha-nova';

-- 18. Quinta do Gradil
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/quinta-do-gradil/capa.jpg',
  galeria = ARRAY['/images/coudelarias/quinta-do-gradil/galeria-1.jpg', '/images/coudelarias/quinta-do-gradil/galeria-2.jpg', '/images/coudelarias/quinta-do-gradil/galeria-3.jpg']
WHERE slug = 'quinta-do-gradil';

-- 19. Coudelaria Raposa
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/coudelaria-raposa/capa.jpg',
  galeria = ARRAY['/images/coudelarias/coudelaria-raposa/galeria-1.jpg', '/images/coudelarias/coudelaria-raposa/galeria-2.jpg', '/images/coudelarias/coudelaria-raposa/galeria-3.jpg']
WHERE slug = 'coudelaria-raposa';

-- 20. Solar dos Marcos
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/solar-dos-marcos/capa.jpg',
  galeria = ARRAY['/images/coudelarias/solar-dos-marcos/galeria-1.jpg', '/images/coudelarias/solar-dos-marcos/galeria-2.jpg', '/images/coudelarias/solar-dos-marcos/galeria-3.jpg']
WHERE slug = 'solar-dos-marcos';

-- 21. Ortigão Costa
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/ortigao-costa/capa.jpg',
  galeria = ARRAY['/images/coudelarias/ortigao-costa/galeria-1.jpg', '/images/coudelarias/ortigao-costa/galeria-2.jpg', '/images/coudelarias/ortigao-costa/galeria-3.jpg', '/images/coudelarias/ortigao-costa/galeria-4.jpg', '/images/coudelarias/ortigao-costa/galeria-5.jpg', '/images/coudelarias/ortigao-costa/galeria-6.jpg', '/images/coudelarias/ortigao-costa/galeria-7.jpg', '/images/coudelarias/ortigao-costa/galeria-8.jpg', '/images/coudelarias/ortigao-costa/galeria-9.jpg', '/images/coudelarias/ortigao-costa/galeria-10.jpg', '/images/coudelarias/ortigao-costa/galeria-11.jpg', '/images/coudelarias/ortigao-costa/galeria-12.jpg', '/images/coudelarias/ortigao-costa/galeria-13.jpg']
WHERE slug = 'ortigao-costa';

-- 22. João Pedro Rodrigues
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/joao-pedro-rodrigues/capa.jpg',
  galeria = ARRAY['/images/coudelarias/joao-pedro-rodrigues/galeria-1.jpg', '/images/coudelarias/joao-pedro-rodrigues/galeria-2.jpg', '/images/coudelarias/joao-pedro-rodrigues/galeria-3.jpg']
WHERE slug = 'joao-pedro-rodrigues';

-- 23. Cavalos na Areia
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/cavalos-na-areia/capa.jpg',
  galeria = ARRAY['/images/coudelarias/cavalos-na-areia/galeria-1.jpg', '/images/coudelarias/cavalos-na-areia/galeria-2.jpg', '/images/coudelarias/cavalos-na-areia/galeria-3.jpg']
WHERE slug = 'cavalos-na-areia';

-- 19. Lusitanos d'Atela
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/lusitanos-datela/capa.jpg',
  galeria = ARRAY['/images/coudelarias/lusitanos-datela/capa.jpg']
WHERE slug = 'lusitanos-datela';

-- 20. Veiga Teixeira
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/veiga-teixeira/capa.jpg',
  galeria = ARRAY['/images/coudelarias/veiga-teixeira/galeria-1.jpg', '/images/coudelarias/veiga-teixeira/galeria-2.jpg', '/images/coudelarias/veiga-teixeira/galeria-3.jpg']
WHERE slug = 'veiga-teixeira';

-- 21. Casa Cadaval
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/casa-cadaval/capa.jpg',
  galeria = ARRAY['/images/coudelarias/casa-cadaval/galeria-1.jpg', '/images/coudelarias/casa-cadaval/galeria-2.jpg', '/images/coudelarias/casa-cadaval/galeria-3.jpg']
WHERE slug = 'casa-cadaval';

-- 22. Herdade do Pinheiro
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/herdade-do-pinheiro/capa.jpg',
  galeria = ARRAY['/images/coudelarias/herdade-do-pinheiro/galeria-1.jpg', '/images/coudelarias/herdade-do-pinheiro/galeria-2.jpg', '/images/coudelarias/herdade-do-pinheiro/galeria-3.jpg']
WHERE slug = 'herdade-do-pinheiro';

-- 23. Pedro Passanha
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/pedro-passanha/capa.jpg',
  galeria = ARRAY['/images/coudelarias/pedro-passanha/galeria-1.jpg', '/images/coudelarias/pedro-passanha/galeria-2.jpg', '/images/coudelarias/pedro-passanha/galeria-3.jpg']
WHERE slug = 'pedro-passanha';

-- 24. Henrique Abecasis
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/henrique-abecasis/capa.jpg',
  galeria = ARRAY['/images/coudelarias/henrique-abecasis/galeria-1.jpg', '/images/coudelarias/henrique-abecasis/galeria-2.jpg', '/images/coudelarias/henrique-abecasis/galeria-3.jpg']
WHERE slug = 'henrique-abecasis';

-- 25. João Lynce
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/joao-lynce/capa.jpg',
  galeria = ARRAY['/images/coudelarias/joao-lynce/galeria-1.jpg', '/images/coudelarias/joao-lynce/galeria-2.jpg', '/images/coudelarias/joao-lynce/galeria-3.jpg']
WHERE slug = 'joao-lynce';

-- 26. Fundação Eugénio de Almeida
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/fundacao-eugenio-almeida/capa.jpg',
  galeria = ARRAY['/images/coudelarias/fundacao-eugenio-almeida/galeria-1.jpg', '/images/coudelarias/fundacao-eugenio-almeida/galeria-2.jpg', '/images/coudelarias/fundacao-eugenio-almeida/galeria-3.jpg']
WHERE slug = 'fundacao-eugenio-almeida';

-- 27. Ferraz da Costa
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/ferraz-da-costa/capa.jpg',
  galeria = ARRAY['/images/coudelarias/ferraz-da-costa/galeria-1.jpg', '/images/coudelarias/ferraz-da-costa/galeria-2.jpg', '/images/coudelarias/ferraz-da-costa/galeria-3.jpg']
WHERE slug = 'ferraz-da-costa';

-- 28. Santa Margarida
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/santa-margarida/capa.jpg',
  galeria = ARRAY['/images/coudelarias/santa-margarida/galeria-1.jpg', '/images/coudelarias/santa-margarida/galeria-2.jpg', '/images/coudelarias/santa-margarida/galeria-3.jpg']
WHERE slug = 'santa-margarida';

-- 29. Jupiter Classical Dressage
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/jupiter-classical-dressage/capa.jpg',
  galeria = ARRAY['/images/coudelarias/jupiter-classical-dressage/galeria-1.jpg', '/images/coudelarias/jupiter-classical-dressage/galeria-2.jpg', '/images/coudelarias/jupiter-classical-dressage/galeria-3.jpg']
WHERE slug = 'jupiter-classical-dressage';

-- 30. Quinta Madre de Água
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/quinta-madre-de-agua/capa.jpg',
  galeria = ARRAY['/images/coudelarias/quinta-madre-de-agua/galeria-1.jpg', '/images/coudelarias/quinta-madre-de-agua/galeria-2.jpg', '/images/coudelarias/quinta-madre-de-agua/galeria-3.jpg']
WHERE slug = 'quinta-madre-de-agua';

-- 31. Mascarenhas Cardoso
UPDATE coudelarias SET
  foto_capa = '/images/coudelarias/mascarenhas-cardoso/capa.jpg',
  galeria = ARRAY['/images/coudelarias/mascarenhas-cardoso/galeria-1.jpg', '/images/coudelarias/mascarenhas-cardoso/galeria-2.jpg', '/images/coudelarias/mascarenhas-cardoso/galeria-3.jpg']
WHERE slug = 'mascarenhas-cardoso';

-- =============================================
-- NOTA: Ajusta o número de imagens na galeria
-- conforme as fotos que tiveres disponíveis.
-- Se tiveres 5 fotos, adiciona galeria-4.jpg e galeria-5.jpg
-- Se tiveres só 2 fotos, remove galeria-3.jpg
-- =============================================
