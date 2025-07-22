export interface ContentBlock {
  title: string;
  content: string;
  imageUrl: string;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  date: Date;
  description: string;
  coverImageUrl: string;
  contentBlocks: ContentBlock[];
  closing: string;
  mainCharacter: MainCharacter;
}

export interface MainCharacter {
  name: string;
  description: string;
  imageUrl: string;
}
