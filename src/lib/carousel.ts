import type { ImageMetadata } from "astro";

import c01 from "../assets/carousel/01.jpg";
import c02 from "../assets/carousel/02.jpg";
import c03 from "../assets/carousel/03.jpg";
import c04 from "../assets/carousel/04.jpg";
import c05 from "../assets/carousel/05.jpg";
import c06 from "../assets/carousel/06.jpg";
import c07 from "../assets/carousel/07.jpg";
import c08 from "../assets/carousel/08.jpg";

export interface Shot {
  src: ImageMetadata;
  alt: string;
}

// Language-neutral: images only, no captions.
export const shots: Shot[] = [
  { src: c01, alt: "Estojo origami RAYO aberto com forro azul e óculos de lente espelhada azul." },
  { src: c02, alt: "Estojo RAYO antracite aberto com forro de camurça azul e óculos esportivos azuis." },
  { src: c03, alt: "Estojo RAYO flutuando com óculos de lente azul, brilho azul ao fundo." },
  { src: c04, alt: "Estojo rígido preto RAYO em forma de seixo ao lado de óculos de armação branca." },
  { src: c05, alt: "Estojo RAYO antracite aberto com óculos de lente azul, fundo azul e reflexo." },
  { src: c06, alt: "Estojo origami grafite RAYO entreaberto com relevo do símbolo, estúdio cinza." },
  { src: c07, alt: "Estojo RAYO preto aberto com forro de camurça amarela e óculos brancos sobre pedra." },
  { src: c08, alt: "Estojo RAYO preto com faixa elástica vermelha sobre fundo vermelho." },
];
