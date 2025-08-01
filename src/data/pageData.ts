// src/data/pageData.ts

export interface PageData {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export const pages: PageData[] = [
  {
    id: 'background',
    title: 'Background',
    description: "",
    position: [0, 1.6, 0], // Top face
    rotation: [-Math.PI / 2, 0, 0],
  },
  {
    id: 'work',
    title: 'Work',
    description: "",
    position: [1.6, 0, 0], // Right face
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: 'thoughts',
    title: 'Thoughts',
    description: '',
    position: [0, 0, 1.6], // Front face
    rotation: [0, 0, 0],
  },
];

