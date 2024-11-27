'use client';

import type { Dispatch, SetStateAction } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Sortable from 'sortablejs';

import { nextTick, on } from '@/utils/dom';
import mcn from '@/utils/mcn';

export default function Home() {
  const [searchEngineIndex, setSearchEngineIndex] = useState(0);
  const searchEngine = SearchEngines[searchEngineIndex];

  const [keyword, setKeyword] = useState('');
  const [isComposed, setIsComposed] = useState(false);

  // 切换搜索引擎
  const changeSearchEngine = () => {
    setSearchEngineIndex(searchEngineIndex < SearchEngines.length - 1 ? searchEngineIndex + 1 : 0);
  };

  // 监听输入框Enter事件
  const listenInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keywordTrimed = keyword.trim();

    if (e.nativeEvent.key === 'Enter' && !isComposed && keywordTrimed) {
      e.nativeEvent.preventDefault();

      const keywordEncoded = encodeURIComponent(keywordTrimed);
      const url = `${searchEngine.url}${keywordEncoded}`;

      window.open(url);
      setKeyword('');
    }
  };

  // 监听Tab事件
  const listenTab = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      changeSearchEngine();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', listenTab);

    return () => {
      window.removeEventListener('keydown', listenTab);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeSearchEngine]);

  return (
    <motion.div
      className="HomeWrapper min-h-screen"
      animate={{
        opacity: 1,
      }}
      initial={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
    >
      <header className="HomeHeader sticky top-0 left-0 flex items-center w-full h-[54px] px-8 bg-[radial-gradient(transparent 1px, #fff 1px)] bg-[length:4px_4px] backdrop-blur-sm backdrop-saturate-50 shadow-sm">
        <h3 className="text-lg font-semibold"></h3>
        <Image
          aria-hidden
          src="/you.jpg"
          alt="User avatar"
          className="flex-none ml-auto w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
      </header>
      <main className="HomeMain grid grid-rows-[164px_1fr] w-full">
        <div className="HomeMainTop flex flex-col justify-center items-center w-full h-full bg-amber-200">
          <div className="Search w-full text-center">
            <div className="SearchFormWrapper relative inline-block w-2/3 md:w-1/3 h-10">
              <form className="SearchForm w-full h-full">
                <input
                  className="w-full h-full px-12 rounded-md focus:outline-none text-sm"
                  placeholder="按Enter键搜索 | 按Tab切换搜索引擎"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => listenInputEnter(e)}
                  onCompositionStart={() => setIsComposed(true)}
                  onCompositionEnd={() => setIsComposed(false)}
                />
              </form>
              <button
                className="absolute left-1 top-0 flex items-center justify-center w-10 h-10 border-none outline-none"
                onClick={changeSearchEngine}
              >
                <Image
                  src={searchEngine.logo}
                  alt={searchEngine.name}
                  width={32}
                  height={32}
                  className="w-6 h-6 border-none border-transparent"
                />
              </button>
              <motion.button
                className="absolute right-1 top-0 flex items-center justify-center w-10 h-10 border-none outline-none text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setKeyword('')}
                animate={{
                  opacity: keyword ? 1 : 0,
                }}
                transition={{
                  duration: 0.15,
                  ease: 'easeInOut',
                }}
              >
                <i className="iconfont icon-close"></i>
              </motion.button>
            </div>
          </div>
          <div className="Favorites w-full text-center">
            <ul className="FavoritesList inline-flex flex-wrap items-center justify-start w-2/3 md:w-1/3">
              {Favorites.map((item) => (
                <li
                  className="FavoritesItem flex-none flex items-center justify-center mt-2"
                  key={item.name}
                >
                  <a
                    className="inline-flex items-center justify-center mx-1 max-w-24 pl-1 pr-2 py-0.5 text-xs text-gray-500 bg-white/60 backdrop-blur-md rounded-full"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      className="mr-1 w-5 h-5 rounded-full"
                      src={item.logo}
                      alt={item.name}
                      width={32}
                      height={32}
                    />
                    <span className="FavoritesItemName flex-1 truncate">{item.name}</span>
                  </a>
                </li>
              ))}
              <button className="MoreFavoritesItem flex-none flex items-center justify-center mt-2">
                <span className="inline-flex items-center justify-center mx-1 max-w-24 px-2 py-0.5 leading-5 text-xs text-gray-500 bg-white/80 backdrop-blur-md rounded-full">
                  更多
                </span>
              </button>
            </ul>
          </div>
        </div>
        <div className="HomeMainContent flex w-full h-[calc(100vh-218px)]">
          <div className="Advertisment w-1/3 h-full bg-red-200">Advertisment</div>
          <CollectionsContainer />
          <div className="RecommendSites w-1/3 h-full bg-green-200">RecommendSites</div>
        </div>
      </main>
    </motion.div>
  );
}

const SearchEngines = [
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

const Favorites = [
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

interface CollectionBase {
  groupId: string;
  id: string;
  name: string;
}

interface CollectionItem extends CollectionBase {
  logo: string;
  url: string;
}

interface CollectionGroup extends CollectionBase {
  children: CollectionItem[];
}

type Collection = CollectionGroup | CollectionItem;

interface ItemLayout {
  width: number;
  height: number;
  mx: number;
  pages: number;
}

const Collections: Collection[] = [
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

let dragEnterTimer: NodeJS.Timeout | null = null;

const CollectionItem = ({ data }: { data: Collection }) => {
  const { children, id, logo, name } = data as CollectionGroup & CollectionItem;

  const {
    collections,
    dragEnterItem,
    dragItem,
    itemLayout,
    setCollections,
    setDragEnterItem,
    setDragItem,
  } = useContext(CollectionsContext);

  const isGroup = !!children;
  const isDragging = dragItem && dragItem.id === id;
  const isDragEnter = dragEnterItem && dragEnterItem.id === id;

  const { height, mx, width } = itemLayout!;

  const draggableRef = useRef<HTMLLIElement>(null);
  const firstAnchorRef = useRef<HTMLLIElement>(null);
  const lastAnchorRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isDragEnter) {
      lastAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      firstAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isDragEnter]);

  useEffect(() => {
    if (!draggableRef.current) return;

    const offDragStart = on(draggableRef.current, 'dragstart', () => {
      setDragItem(data);
    });

    const offDragEnter = on(draggableRef.current, 'dragenter', () => {
      if (dragItem && dragItem.id !== id && !(dragItem as CollectionGroup).children) {
        if (dragEnterTimer) {
          clearTimeout(dragEnterTimer);
          dragEnterTimer = null;
        }

        dragEnterTimer = setTimeout(() => {
          setDragEnterItem(data);
          dragEnterTimer = null;
        }, 500);
      }
    });

    const offDrop = on(draggableRef.current, 'drop', () => {
      if (
        dragItem &&
        dragItem.id !== id &&
        !(dragItem as CollectionGroup).children &&
        dragEnterItem &&
        dragEnterItem.id === id
      ) {
        const newGroup: CollectionGroup = isGroup
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

        nextTick(() => {
          const newCollections = [...collections];
          const removeItemIndex = newCollections.findIndex((item) => item.id === dragItem.id);

          newCollections.splice(removeItemIndex, 1);

          const newGroupIndex = newCollections.findIndex((item) => item.id === id);

          newCollections.splice(newGroupIndex, 1, newGroup);
          setCollections(newCollections);
        });

        setDragItem(null);
        setDragEnterItem(null);
      }
    });

    return () => {
      if (dragEnterTimer) {
        clearTimeout(dragEnterTimer);
        dragEnterTimer = null;
      }

      offDragStart();
      offDragEnter();
      offDrop();
    };
  }, [
    children,
    collections,
    data,
    dragEnterItem,
    dragItem,
    id,
    isGroup,
    setCollections,
    setDragEnterItem,
    setDragItem,
  ]);

  return (
    <motion.li
      className="CollectionItem flex items-center justify-center float-left"
      ref={draggableRef}
      style={{
        height: height,
        marginLeft: mx,
        marginRight: mx,
        width: width,
      }}
      layout
      exit={{
        opacity: 0,
        width: 0,
      }}
      transition={{
        duration: 0.1,
      }}
    >
      <figure
        className={mcn('CollectionItemDraggable flex-none w-full bg-transparent select-none')}
      >
        <div
          className={mcn(
            'flex items-center justify-center relative mb-[10%] w-full shadow-md rounded-[22%] overflow-hidden transition-all duration-100 ease-linear',
            isDragEnter && 'scale-125',
            isDragEnter &&
              !isGroup &&
              'p-[10.5%] rounded-[32%] bg-white/50 backdrop-blur-3xl shadow-md',
          )}
        >
          {!isGroup ? (
            <div className="relative w-full aspect-square bg-white rounded-[22%] pointer-events-none overflow-hidden">
              <Image
                src={logo}
                alt={name}
                width={32}
                height={32}
                className="w-full aspect-square"
              />

              <div
                className={mcn(
                  'absolute inset-0 bg-black/20 opacity-0',
                  (isDragEnter || isDragging) && 'opacity-100',
                )}
              ></div>
            </div>
          ) : (
            <div className="relative p-[12.5%] w-full aspect-square bg-white/50 backdrop-blur-3xl shadow-md rounded-[22%] overflow-hidden">
              <ul className="grid grid-cols-3 grid-rows-auto auto-rows-max gap-[8%] w-full h-full overflow-hidden">
                {children.map((item, i) => (
                  <li
                    key={item.id}
                    className="CollectionItemChild flex-none w-full aspect-square rounded-[22%] shadow-md overflow-hidden"
                    ref={
                      i === 0 ? firstAnchorRef : i === children.length - 1 ? lastAnchorRef : null
                    }
                  >
                    <Image
                      src={item.logo}
                      alt={item.name}
                      width={32}
                      height={32}
                      className="w-full bg-white pointer-events-none"
                    />
                  </li>
                ))}
              </ul>

              <div
                className={mcn(
                  'absolute inset-0 bg-black/20 opacity-0',
                  isDragging && 'opacity-100',
                )}
              ></div>
            </div>
          )}
        </div>
        <figcaption
          className={mcn(
            'CollectionItemName text-center text-xs text-gray-500 truncate transition-opacity duration-100 ease-linear',
            isDragEnter && 'opacity-0',
          )}
        >
          {name}
        </figcaption>
      </figure>
    </motion.li>
  );
};

interface CollectionsProviderProps {
  collections: Collection[];
  dragItem: Collection | null;
  dragEnterItem: Collection | null;
  itemLayout: ItemLayout | null;
  setCollections: Dispatch<SetStateAction<Collection[]>>;
  setDragItem: Dispatch<SetStateAction<Collection | null>>;
  setDragEnterItem: Dispatch<SetStateAction<Collection | null>>;
  setItemLayout: (itemLayout: ItemLayout) => void;
}

const CollectionsContext = createContext<CollectionsProviderProps>({
  collections: [],
  dragEnterItem: null,
  dragItem: null,
  itemLayout: null,
  setCollections: () => {},
  setDragEnterItem: () => {},
  setDragItem: () => {},
  setItemLayout: () => {},
});

const CollectionsContainer = () => {
  const collectionsListRef = useRef<HTMLUListElement>(null);
  const sortableInst = useRef<Sortable | null>(null);

  const [collections, setCollections] = useState<Collection[]>(() => [...Collections]);
  const [dragEnterItem, setDragEnterItem] = useState<Collection | null>(null);
  const [dragItem, setDragItem] = useState<Collection | null>(null);
  const [itemLayout, setItemLayout] = useState<ItemLayout | null>(null);

  useEffect(() => {
    if (!collectionsListRef.current) return;

    const { height: rootHeight, width: rootWidth } =
      collectionsListRef.current!.getBoundingClientRect();

    const cols = 9;
    const colsWidth = rootWidth / cols;
    const colsHeight = colsWidth;
    const rows = Math.floor(rootHeight / colsWidth);
    const pages = Math.ceil(collections.length / (cols * rows));
    const width = (colsWidth / 5) * 3;

    setItemLayout({
      height: colsHeight,
      mx: (colsWidth - width) / 2,
      pages,
      width: width,
    });
  }, [collections]);

  useEffect(() => {
    if (!collectionsListRef.current) return;

    if (sortableInst.current) {
      sortableInst.current.destroy();
      sortableInst.current = null;
    }

    sortableInst.current = new Sortable(collectionsListRef.current, {
      animation: 150,
      group: {
        name: 'Collections',
        pull: 'clone',
        put: false,
      },
      onChange: () => {
        if (dragEnterTimer) {
          clearTimeout(dragEnterTimer);
          dragEnterTimer = null;
        }

        setDragEnterItem(null);
      },
      onEnd: (evt) => {
        const { newDraggableIndex, oldDraggableIndex } = evt;
        const newCollections = [...collections];

        newCollections.splice(
          newDraggableIndex!,
          0,
          newCollections.splice(oldDraggableIndex!, 1)[0],
        );
        setCollections(newCollections);
        setDragItem(null);
        setDragEnterItem(null);
      },
      swapThreshold: 0.05,
      touchStartThreshold: 10,
    });
  }, [collections]);

  useEffect(() => {
    if (!collectionsListRef.current) return;

    const offDragEnd = on(collectionsListRef.current, 'dragend', () => {
      setDragItem(null);
      setDragEnterItem(null);
    });

    return () => {
      offDragEnd();
    };
  }, []);

  return (
    <div className="Collections flex-none flex flex-col p-8 w-2/3 bg-blue-200">
      <CollectionsContext.Provider
        value={{
          collections,
          dragEnterItem,
          dragItem,
          itemLayout,
          setCollections,
          setDragEnterItem,
          setDragItem,
          setItemLayout,
        }}
      >
        <ul
          ref={collectionsListRef}
          className="CollectionsList flex-1 mx-auto w-full h-0 bg-yellow-200"
        >
          <AnimatePresence>
            {itemLayout &&
              collections.map((item) =>
                item.groupId === '0' ? <CollectionItem key={item.id} data={item} /> : null,
              )}
          </AnimatePresence>
        </ul>
      </CollectionsContext.Provider>
    </div>
  );
};
