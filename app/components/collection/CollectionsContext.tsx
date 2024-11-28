import { Dispatch, SetStateAction, createContext } from 'react';

interface CollectionBase {
  groupId: string;
  id: string;
  name: string;
}

export interface CollectionItem extends CollectionBase {
  logo: string;
  url: string;
}

export interface CollectionGroup extends CollectionBase {
  children: CollectionItem[];
}

export type Collection = CollectionGroup | CollectionItem;

export interface CollectionsProviderProps {
  collections: Collection[];
  dragItem: Collection | null;
  dragEnterItem: Collection | null;
  dragEnterTimer: { current: NodeJS.Timeout | null };
  openedGroup: CollectionGroup | null;
  isShaking: boolean;
  setCollections: Dispatch<SetStateAction<Collection[]>>;
  setDragItem: Dispatch<SetStateAction<Collection | null>>;
  setDragEnterItem: Dispatch<SetStateAction<Collection | null>>;
  setIsShaking: Dispatch<SetStateAction<boolean>>;
  setOpenedGroup: Dispatch<SetStateAction<CollectionGroup | null>>;
}

export const CollectionsContext = createContext<CollectionsProviderProps>({
  collections: [],
  dragEnterItem: null,
  dragEnterTimer: { current: null },
  dragItem: null,
  isShaking: false,
  openedGroup: null,
  setCollections: () => {},
  setDragEnterItem: () => {},
  setDragItem: () => {},
  setIsShaking: () => {},
  setOpenedGroup: () => {},
});

export const computedShakingAnimate = (isShaking: boolean) => {
  return {
    rotate: isShaking ? (Math.random() < 0.5 ? [2.4, -2.4] : [-2.4, 2.4]) : [0, 0],
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse',
    },
    translateX: isShaking ? (Math.random() < 0.5 ? [0.25, -0.25] : [-0.25, 0.25]) : [0, 0],
    translateY: isShaking ? (Math.random() < 0.5 ? [0.25, -0.25] : [-0.25, 0.25]) : [0, 0],
  };
};

export const computedNewGroup = (data: Collection, dragItem: Collection) => {
  const { children } = data as CollectionGroup & CollectionItem;

  return !!children
    ? {
        ...data,
        children: [...children, { ...(dragItem as CollectionItem) }],
      }
    : {
        children: [
          { ...(data as CollectionItem) },
          {
            ...(dragItem as CollectionItem),
          },
        ],
        groupId: '0',
        id: new Date().getTime().toString(),
        name: '新建分组',
      };
};

export const SearchEngines = [
  {
    logo: '/logo/Baidu.png',
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd=',
  },
  {
    logo: '/logo/google.png',
    name: 'Google',
    url: 'https://www.google.com/search?q=',
  },
  {
    logo: '/logo/bing.png',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
  },
];

export const Favorites = [
  {
    logo: '/logo/Baidu.png',
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd=',
  },
  {
    logo: '/logo/google.png',
    name: 'Google',
    url: 'https://www.google.com/search?q=',
  },
  {
    logo: '/logo/bing.png',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
  },
  {
    logo: '/logo/bing.png',
    name: 'BingBingBingBingBingBing',
    url: 'https://www.bing.com/search?q=',
  },
  {
    logo: '/logo/bing.png',
    name: 'BingBingBingBingBingBing1',
    url: 'https://www.bing.com/search?q=',
  },
];

export const Collections: Collection[] = [
  {
    groupId: '0',
    id: '2',
    logo: '/logo/Baidu.png',
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd=',
  },
  {
    children: [
      {
        groupId: '1',
        id: '1-1',
        logo: '/logo/Baidu.png',
        name: 'Baidu',
        url: 'https://www.baidu.com/s?wd=',
      },
      {
        groupId: '1',
        id: '1-2',
        logo: '/logo/google.png',
        name: 'Google',
        url: 'https://www.google.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-3',
        logo: '/logo/bing.png',
        name: 'Bing',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-4',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-5',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing1',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-6',
        logo: '/logo/google.png',
        name: 'Google',
        url: 'https://www.google.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-7',
        logo: '/logo/bing.png',
        name: 'Bing',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-8',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-9',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing1',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-10',
        logo: '/logo/Baidu.png',
        name: 'Baidu',
        url: 'https://www.baidu.com/s?wd=',
      },
      {
        groupId: '1',
        id: '1-11',
        logo: '/logo/google.png',
        name: 'Google',
        url: 'https://www.google.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-12',
        logo: '/logo/bing.png',
        name: 'Bing',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-13',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-14',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing1',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-15',
        logo: '/logo/google.png',
        name: 'Google',
        url: 'https://www.google.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-16',
        logo: '/logo/bing.png',
        name: 'Bing',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-17',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing',
        url: 'https://www.bing.com/search?q=',
      },
      {
        groupId: '1',
        id: '1-18',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing1',
        url: 'https://www.bing.com/search?q=',
      },
    ],
    groupId: '0',
    id: '1',
    name: '收藏',
  },
  {
    groupId: '0',
    id: '3',
    logo: '/logo/google.png',
    name: 'Google',
    url: 'https://www.google.com/search?q=',
  },
  {
    groupId: '0',
    id: '4',
    logo: '/logo/bing.png',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
  },
  {
    groupId: '0',
    id: '5',
    logo: '/logo/bing.png',
    name: 'BingBingBingBingBingBing',
    url: 'https://www.bing.com/search?q=',
  },
  {
    groupId: '0',
    id: '6',
    logo: '/logo/bing.png',
    name: 'BingBingBingBingBingBing1',
    url: 'https://www.bing.com/search?q=',
  },
  {
    groupId: '0',
    id: '7',
    logo: '/logo/Baidu.png',
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd=',
  },
  {
    groupId: '0',
    id: '8',
    logo: '/logo/google.png',
    name: 'Google',
    url: 'https://www.google.com/search?q=',
  },
  {
    groupId: '0',
    id: '9',
    logo: '/logo/bing.png',
    name: 'BingBingBingBingBingBing',
    url: 'https://www.bing.com/search?q=',
  },
  {
    groupId: '0',
    id: '10',
    logo: '/logo/bing.png',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
  },
  {
    groupId: '0',
    id: '11',
    logo: '/logo/bing.png',
    name: 'BingBingBingBingBingBing1',
    url: 'https://www.bing.com/search?q=',
  },
];
