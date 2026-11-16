# spypr

Site estático do projeto Vercel `spy`.

Produção: https://spy-eight-mauve.vercel.app/

## Estrutura

- `public/`: arquivos publicados, incluindo página inicial, redirect, upsells educativos, login demonstrativo e biblioteca.
- `public/membros/`: quatro aulas em texto, materiais e progresso salvo no navegador.
- `scripts/`: utilitários de preparação e verificações. Alguns utilitários históricos dependem das capturas locais de referência, não incluídas neste repositório.
- `unpublished/`: cópia da área de membros preservada durante as alterações; excluída do deploy por `.vercelignore`.
- `vercel.json`: publicação estática do diretório `public`.

## Estado atual

A página inicial foi restaurada visualmente conforme a referência enviada. Seus contadores e depoimento são conteúdo de exemplo; a interação abre uma identificação de demonstração. As demais páginas mantêm a adaptação educativa. Não existe acesso a mensagens ou contas privadas, checkout ativo ou autenticação real. O login aceita e-mail como identificação local; não comprova identidade nem compra. O progresso não é sincronizado entre dispositivos.

## Desenvolvimento

Sirva `public/` com um servidor HTTP estático. Não é necessário compilar o site.

Os testes DOM usam jsdom, instalado separadamente:

```sh
npm ci --prefix scripts/qa --ignore-scripts
node scripts/check-members.cjs
node scripts/check-dashboard.cjs
```

Alguns testes e geradores em `scripts/` documentam versões anteriores; não execute geradores históricos antes de revisar seus efeitos. A pasta `public/` representa o conteúdo atual.

## Publicação

Confirme o destino antes de publicar:

```sh
vercel link --project spy --scope moon-e5ad
vercel project inspect --non-interactive --scope moon-e5ad
vercel deploy --prod --scope moon-e5ad
```

Credenciais, configuração local da Vercel, dependências instaladas e capturas temporárias são excluídas do Git. Nenhuma integração automática GitHub–Vercel foi configurada por este envio.