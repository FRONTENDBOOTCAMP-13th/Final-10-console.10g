import type { Story } from '@/types/story';
import conan from './conan';
import atashinchi from './atashinchi';
import chiikawa from './chiikawa';

const storyMap: Record<string, Story> = {
  atashinchi,
  chiikawa,
  conan,
};

export default storyMap;
