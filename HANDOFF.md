# RAYO — Eyewear Case (Collection 01) · site

Visualizador de deck em tela cheia da apresentação Canva "Presentation - RAYO".
Os **12 slides aprovados** são exibidos exatamente como no Canva — nada recortado,
nada reinterpretado.

## Estrutura

- `src/assets/slides/01–12.jpg` — export dos 12 slides do Canva (3840×2160, re-comprimido).
  Substitua estes arquivos se o deck for atualizado (mesmo nome, mesma ordem).
- `src/lib/slides.ts` — lista dos slides + `alt` (SEO/leitor de tela) + `label`.
  O slide 02 tem `video: "/media/case"` (loop do estojo girando).
- `public/media/case.mp4` (H.264) + `case.webm` (VP9) — transcodificados de
  `../case eyewear.mp4` (o original é H.265 e **não roda** em Chrome/Firefox).
- `src/components/Deck.astro` + `src/scripts/deck.ts` — o visualizador.
- `src/layouts/Layout.astro` — `<head>`, fonte Space Grotesk self-hosted.

## Interação

Site de **rolagem** (scroll): cada slide é uma seção de tela cheia, com
`scroll-snap` de proximidade e um leve fade/scale ao entrar na viewport.
Rolagem do mouse/trackpad, swipe no celular, setas ↑/↓ e contador no rodapé,
`PageUp`/`PageDown`/`Home`/`End`, barra de progresso presa no topo, tela cheia
(`F` ou botão ⤢), deep-link por hash (`/#s7`). O vídeo do slide 02 dá play só
quando o slide está visível e pausa ao sair. Respeita `prefers-reduced-motion`
(sem snap, sem animação).

## Deploy (Vercel)

`vercel.json` já configurado (`framework: astro`, output `dist/`). Só conectar o
repositório na Vercel — build automático. `npm run build` gera `dist/` estático.

## Carrossel dos estojos (seção 13)

Depois dos 12 slides do Canva, uma seção própria "04 — Os estojos": carrossel
horizontal com 7 renders de produto. Arraste, setas, teclado ←/→, contador,
snap por card. Fotos em `src/assets/carousel/01–07.jpg` — **para trocar/reordenar,
substitua os arquivos** (mantendo os nomes) e ajuste `src/lib/carousel.ts`
(nome + linha de spec). Fonte dos renders atuais (pasta Downloads):

| # | arquivo do site | origem |
|---|---|---|
| 01 Carbon | 01-carbon.jpg | magnific_faca-o-case-fechado-preto_MBvEsdLDCm.png |
| 02 Bolt | 02-bolt.jpg | magnific_faca-o-case-aberto-manten_xSPyH6SjfW.png |
| 03 Amber | 03-amber.jpg | magnific_product-photograph-of-a-f_JNA0EQ6Oq4.png |
| 04 Marine | 04-marine.jpg | magnific_product-photograph-of-a-f_vQklzUta47.png |
| 05 Graphite | 05-origami.jpg | magnific_monochrome-colourfield-pr_DoaHsZXpcl.png |
| 06 Brasil Edition | 06-brasil.jpg | magnific_photorealistic-product-ph_dtEFQJfXSL.png |
| 07 Red Edition | 07-red.jpg | magnific_light-a-single-hard-5600k_YMofexMWeC.png |

> O Canva foi atualizado para 14 slides (2 novos). Não consegui exportar a versão
> nova — quando você reexportar, dá para trocar `src/assets/slides/` e conferir se
> algum slide de estojo mudou.

## Animação (edição de rolagem)

- Foto de cada slide entra com **clip-reveal** (varredura da esquerda) + settle de
  escala; o 1º slide entra na hora, sem varredura.
- **Parallax** sutil: a foto desliza ~5% da altura da viewport conforme rola.
- Carrossel: título e specs entram em stagger; imagem do card com clip-reveal.
- Tudo desligado sob `prefers-reduced-motion`.

## Pendências

- **Domínio**: preencher `site` em `astro.config.mjs` quando existir → ativa
  canonical e OG absolutos.
- **Bilíngue PT/EN**: os slides aprovados são só em inglês. Para PT seria preciso
  uma segunda leva de slides (rota `/pt`), fácil de somar depois.
- **Favicon**: ainda o padrão da base (`public/favicon.svg`). Trocar pelo símbolo RAYO.
- **OG image**: nenhuma definida (sem domínio). Adicionar `public/og.jpg` (1200×630).
