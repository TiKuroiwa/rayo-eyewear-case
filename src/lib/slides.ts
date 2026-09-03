import type { ImageMetadata } from "astro";

import s01 from "../assets/slides/01.jpg";
import s02 from "../assets/slides/02.jpg";
import s03 from "../assets/slides/03.jpg";
import s04 from "../assets/slides/04.jpg";
import s05 from "../assets/slides/05.jpg";
import s06 from "../assets/slides/06.jpg";
import s07 from "../assets/slides/07.jpg";
import s08 from "../assets/slides/08.jpg";
import s10 from "../assets/slides/10.jpg";
import s11 from "../assets/slides/11.jpg";

export interface Slide {
  src: ImageMetadata;
  alt: string;
  label: string;
  video?: string;
}

// Full-bleed Canva slides, in order. (Canva slide 9 — the pebble case — was
// dropped: that shot lives in the gallery. The finale red pair is composed
// separately in Deck.astro.)
export const slides: Slide[] = [
  {
    src: s01,
    label: "RAYO Eyewear",
    alt: "RAYO Eyewear — capa. Rodrygo de boné e óculos de sol dourados. Rótulo: BY RODRYGO / EYEWEAR CASE.",
  },
  {
    src: s02,
    label: "The case",
    alt: "Estojo rígido preto da RAYO com o símbolo em relevo, girando sobre fundo preto com brilho azul.",
    video: "/media/case",
  },
  {
    src: s03,
    label: "The second before",
    alt: "THE SECOND BEFORE / THE LIGHT. Óculos esportivos azuis e brancos na chuva sobre pedra molhada.",
  },
  {
    src: s04,
    label: "The mark",
    alt: "Estojo rígido preto da RAYO com emblema cromado do símbolo, fundo preto e brilho azul.",
  },
  {
    src: s05,
    label: "See the opening form",
    alt: "SEE THE OPENING FORM. Estojo rígido com forro metálico aberto, óculos esportivos de lente espelhada azul e roxa.",
  },
  {
    src: s06,
    label: "A second of total clarity",
    alt: "A SECOND OF TOTAL CLARITY. Símbolo da RAYO vazado e aceso em azul sobre o estojo plano, com óculos de lente azul.",
  },
  {
    src: s07,
    label: "Eyewear case",
    alt: "EYEWEAR CASE. Estojo origami verde fechado com relevo do símbolo e, ao lado, aberto com forro amarelo e óculos brancos.",
  },
  {
    src: s08,
    label: "Brasil Edition",
    alt: "BRASIL EDITION / LIMITED. Estojo verde e amarelo com faixa elástica e RAYO em relevo; aberto; e desdobrado plano em camurça amarela.",
  },
  {
    src: s10,
    label: "The light does the branding",
    alt: "THE LIGHT DOES THE BRANDING. Estojo rígido texturizado em carbono com etiqueta RAYO em relevo e clamshell aberto com óculos brancos.",
  },
  {
    src: s11,
    label: "Red Edition",
    alt: "Edição vermelha: estojo preto com faixa elástica vermelha e o estojo desdobrado plano em camurça vermelha.",
  },
];

export const meta = {
  title: "RAYO — Eyewear Case · Collection 01",
  description:
    "A apresentação dos estojos RAYO Eyewear (Collection 01), por Rodrygo — do estojo rígido à Red Edition.",
};
