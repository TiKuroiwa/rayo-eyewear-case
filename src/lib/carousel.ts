import type { ImageMetadata } from "astro";

import c01 from "../assets/carousel/01-carbon.jpg";
import c02 from "../assets/carousel/02-bolt.jpg";
import c03 from "../assets/carousel/03-amber.jpg";
import c04 from "../assets/carousel/04-marine.jpg";
import c05 from "../assets/carousel/05-origami.jpg";
import c06 from "../assets/carousel/06-brasil.jpg";
import c07 from "../assets/carousel/07-red.jpg";

export interface CaseItem {
  src: ImageMetadata;
  name: string;
  spec: string;
  alt: string;
}

export const cases: CaseItem[] = [
  {
    src: c01,
    name: "Carbon",
    spec: "Casco rígido · textura carbono · emblema RAYO",
    alt: "Estojo rígido preto com textura de carbono e etiqueta RAYO em relevo, fundo claro.",
  },
  {
    src: c02,
    name: "Bolt",
    spec: "Forro metálico · lente espelhada azul-violeta",
    alt: "Estojo com forro metálico aberto e óculos esportivos de lente espelhada azul e violeta, brilho azul.",
  },
  {
    src: c03,
    name: "Amber",
    spec: "Origami dobrável · forro camurça amarela",
    alt: "Estojo origami preto aberto com forro de camurça amarela e óculos de armação branca sobre pedra.",
  },
  {
    src: c04,
    name: "Marine",
    spec: "Origami dobrável · forro camurça azul",
    alt: "Estojo origami cinza aberto com forro de camurça azul e óculos de lente azul sobre pedra.",
  },
  {
    src: c05,
    name: "Graphite",
    spec: "Uma folha, uma dobra · sem ferragem",
    alt: "Estojo origami grafite entreaberto, flutuando, em estúdio cinza.",
  },
  {
    src: c06,
    name: "Brasil Edition",
    spec: "Verde fora, amarelo dentro · numerada",
    alt: "Estojo origami verde e amarelo aberto, brilho azul ao fundo.",
  },
  {
    src: c07,
    name: "Red Edition",
    spec: "Preto e vermelho · faixa elástica",
    alt: "Estojo preto com faixa elástica vermelha, iluminação dramática vermelha.",
  },
];
