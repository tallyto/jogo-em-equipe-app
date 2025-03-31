# Casais App - Melhorias e Próximos Passos

Este arquivo rastreia as melhorias planejadas e o status de implementação para o Casais App.

## Melhorias na Experiência do Usuário (UX)

- [x] **Exibir Pontos do Usuário no Header:** Mostrar a quantidade de pontos do usuário diretamente no header da tela de detalhes do desafio.
- [ ] **Feedback Visual Mais Rico:**
  - [ ] **Animações:** Adicionar pequenas animações ao interagir com tarefas e recompensas.
  - [ ] **Notificações Detalhadas:** Mostrar ganhos/gastos de pontos em notificações de conclusão/resgate.
  - [-] **Estados de Carregamento Mais Sutis:** Avaliar e melhorar os indicadores de carregamento em diversas telas.
- [ ] **Filtros e Ordenação:**
  - [ ] **Lista de Tarefas:** Filtrar por status (pendentes, concluídas), ordenar por pontos.
  - [ ] **Lista de Recompensas:** Ordenar por custo de pontos.
- [ ] **Detalhes da Tarefa/Recompensa:** Tela com descrição completa e detalhes ao tocar em um item.
- [ ] **Interface Mais Personalizada:**
  - [ ] **Foto de Perfil do Usuário:** Exibir no header ou perfil.
  - [ ] **Nível ou Barra de Progresso de Pontos:** Mostrar visualmente o progresso.
- [ ] **Mensagens de Estado Vazio Mais Informativas:** Dicas sobre como criar itens ou o que esperar.

## Novas Funcionalidades

- [ ] **Histórico de Pontos:** Tela para visualizar ganhos e gastos detalhados.
- [ ] **Conquistas (Achievements):** Sistema de conquistas desbloqueáveis.
- [ ] **Ranking (Leaderboard):** Listagem dos usuários com mais pontos (se aplicável).
- [ ] **Desafios por Tempo Limitado:** Desafios especiais com prazos e recompensas maiores.
- [ ] **Recompensas Exclusivas/Limitadas:** Recompensas com disponibilidade restrita.
- [ ] **Integração com Outras Funcionalidades:** Usar pontos em outras áreas do aplicativo.
- [ ] **Notificações Push:** Alertas para novas tarefas, recompensas ou atingimento de metas de pontos.
- [-] **Implementar completamente a funcionalidade de recompensas:**
  - [x] Criação de recompensas com custo em pontos e nome (backend já existe, frontend em progresso).
  - [-] Listagem de recompensas disponíveis (funcionalidade básica implementada).
  - [x] Resgate de recompensas (incluindo atualização de pontos do usuário).
- [x] **Adicionar a funcionalidade de marcar tarefas como concluídas e atualizar os pontos do usuário.**

## Melhorias Técnicas

- [-] **Melhor Tratamento de Erros:** Revisar e aprimorar as mensagens de erro e o tratamento de falhas em diferentes fluxos.
- [-] **Otimização de Performance:**
  - [ ] **Paginação:** Implementar paginação em listas longas (tarefas, recompensas, desafios).
  - [ ] **Caching:** Implementar mecanismos de cache para dados da API.
- [ ] **Testes:** Escrever testes unitários e de integração.
- [ ] **Melhorias no Hook `useFetchData`:** Avaliar e refinar a configuração e flexibilidade do hook.
- [ ] **Segurança:** Realizar uma análise de segurança do código e das chamadas à API.
- [ ] **Implementar internacionalização (i18n).**

## Ideias Mais Abstratas

- [ ] **Personalização de Desafios:** Permitir que usuários criem seus próprios desafios pessoais.
- [ ] **Sistema de Troca de Pontos:** Possibilidade limitada de troca de pontos entre usuários (se aplicável).
- [ ] **Impacto Social (Opcional):** Usar pontos para contribuir para causas.

---

**Legenda de Status:**

- `[ ]`: Não implementado
- `[x]`: Implementado
- `[-]`: Em progresso ou parcialmente implementado

Este arquivo será atualizado conforme o desenvolvimento do aplicativo avança.
