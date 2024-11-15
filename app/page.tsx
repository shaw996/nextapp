'use client';

import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [searchEngineIndex, setSearchEngineIndex] = useState(0);
  const searchEngine = SearchEngines[searchEngineIndex];
  // 切换搜索引擎
  const changeSearchEngine = () => {
    setSearchEngineIndex(searchEngineIndex < SearchEngines.length - 1 ? searchEngineIndex + 1 : 0);
  };

  const [keyword, setKeyword] = useState('');

  const [isComposed, setIsComposed] = useState(false);
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

const Collections: RootCollection = [
  {
    children: [
      {
        id: '1-1',
        logo: '/logo/Baidu.png',
        name: 'Baidu',
        type: 'item',
        url: 'https://www.baidu.com/s?wd=',
      },
      {
        id: '1-2',
        logo: '/logo/google.png',
        name: 'Google',
        type: 'item',
        url: 'https://www.google.com/search?q=',
      },
      {
        id: '1-3',
        logo: '/logo/bing.png',
        name: 'Bing',
        type: 'item',
        url: 'https://www.bing.com/search?q=',
      },
      {
        id: '1-4',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing',
        type: 'item',
        url: 'https://www.bing.com/search?q=',
      },
      {
        id: '1-5',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing1',
        type: 'item',
        url: 'https://www.bing.com/search?q=',
      },
      {
        id: '1-6',
        logo: '/logo/google.png',
        name: 'Google',
        type: 'item',
        url: 'https://www.google.com/search?q=',
      },
      {
        id: '1-7',
        logo: '/logo/bing.png',
        name: 'Bing',
        type: 'item',
        url: 'https://www.bing.com/search?q=',
      },
      {
        id: '1-8',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing',
        type: 'item',
        url: 'https://www.bing.com/search?q=',
      },
      {
        id: '1-9',
        logo: '/logo/bing.png',
        name: 'BingBingBingBingBingBing1',
        type: 'item',
        url: 'https://www.bing.com/search?q=',
      },
    ],
    id: '1',
    name: '收藏',
    type: 'group',
  },
  {
    id: '2',
    logo: '/logo/Baidu.png',
    name: 'Baidu',
    type: 'item',
    url: 'https://www.baidu.com/s?wd=',
  },
  {
    id: '2-2',
    logo: '/logo/google.png',
    name: 'Google',
    type: 'item',
    url: 'https://www.google.com/search?q=',
  },
  {
    id: '2-3',
    logo: '/logo/bing.png',
    name: 'Bing',
    type: 'item',
    url: 'https://www.bing.com/search?q=',
  },
  {
    id: '2-4',
    logo: '/logo/bing.png',
    name: 'BingBingBingBingBingBing',
    type: 'item',
    url: 'https://www.bing.com/search?q=',
  },
  {
    groupId: '2',
    id: '2-5',
    logo: '/logo/bing.png',
    name: 'BingBingBingBingBingBing1',
    type: 'item',
    url: 'https://www.bing.com/search?q=',
  },
  {
    id: '3-1',
    logo: '/logo/Baidu.png',
    name: 'Baidu',
    type: 'item',
    url: 'https://www.baidu.com/s?wd=',
  },
  {
    id: '3-2',
    logo: '/logo/google.png',
    name: 'Google',
    type: 'item',
    url: 'https://www.google.com/search?q=',
  },
  {
    id: '3-3',
    logo: '/logo/bing.png',
    name: 'Bing',
    type: 'item',
    url: 'https://www.bing.com/search?q=',
  },
  {
    id: '3-4',
    logo: '/logo/bing.png',
    name: 'BingBingBingBingBingBing',
    type: 'item',
    url: 'https://www.bing.com/search?q=',
  },
  {
    id: '3-5',
    logo: '/logo/bing.png',
    name: 'BingBingBingBingBingBing1',
    type: 'item',
    url: 'https://www.bing.com/search?q=',
  },
];

interface CollectionItem {
  groupId?: string;
  id: string;
  logo: string;
  name: string;
  type: 'item';
  url: string;
}

interface CollectionGroup {
  children: CollectionItem[];
  id: string;
  name: string;
  type: 'group';
}

type RootCollection = (CollectionItem | CollectionGroup)[];

const CollectionGroup = ({ data }: { data: CollectionGroup }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { children, name } = data;
  const childrenOutlined = children.slice(0, 9);

  return (
    <>
      <li className="CollectionGroup flex items-center justify-center px-[25%] w-full h-full cursor-pointer outline-none">
        <motion.figure
          ref={ref}
          className="CollectionGroupFigure flex-col items-center justify-center w-full"
          whileHover={{ scale: 1.05 }}
          transition={{
            damping: 20,
            stiffness: 260,
            type: 'spring',
          }}
          onClick={onOpen}
        >
          <ul className="ChildrenOutline grid grid-cols-3 grid-rows-3 p-[10%] w-full bg-white/40 rounded-lg pointer-events-none shadow-md overflow-hidden">
            {childrenOutlined.map((item) => (
              <li className="CollectionItem p-[12%] w-full h-full" key={item.id}>
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={32}
                  height={32}
                  className="rounded-sm"
                />
              </li>
            ))}
          </ul>
          <figcaption className="CollectionGroupName mt-1 text-center text-xs text-gray-500 truncate">
            {name}
          </figcaption>
        </motion.figure>
        <Modal
          isOpen={isOpen}
          backdrop="blur"
          classNames={{
            base: 'bg-transparent shadow-none',
            header: 'justify-center',
          }}
          hideCloseButton={true}
          radius="lg"
          size="5xl"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            <ModalHeader>
              <h1 className="mb-4 text-center text-white text-2xl font-semibold">{name}</h1>
            </ModalHeader>
            <ModalBody>
              <ul className="CollectionsList flex-1 grid grid-cols-8 grid-rows-5 gap-6 p-8 w-full bg-white/40 rounded-3xl">
                {children.map((item) => (
                  <CollectionItem data={item} key={item.id} />
                ))}
              </ul>
            </ModalBody>
          </ModalContent>
        </Modal>
      </li>
    </>
  );
};

const CollectionItem = ({ data }: { data: CollectionItem }) => {
  const { logo, name, url } = data;
  const openCollectionItem = () => {
    window.open(url);
  };

  return (
    <li
      className="CollectionItem flex items-center justify-center px-[25%] w-full h-full cursor-pointer"
      onClick={openCollectionItem}
    >
      <motion.figure
        className="CollectionItemFigure flex-col items-center justify-center w-full"
        whileHover={{ scale: 1.05 }}
        transition={{
          damping: 20,
          stiffness: 260,
          type: 'spring',
        }}
      >
        <Image
          src={logo}
          alt={name}
          width={32}
          height={32}
          className="w-full rounded-lg pointer-events-none shadow-md"
        />
        <figcaption className="CollectionItemName mt-1 text-center text-xs text-gray-500 truncate">
          {name}
        </figcaption>
      </motion.figure>
    </li>
  );
};

const CollectionsContainer = () => {
  return (
    <div className="Collections flex-none flex flex-col px-8 py-4 w-2/3 bg-blue-200">
      <div className="CollectionsSearch flex items-center justify-center mb-4">
        <input
          className="px-4 w-1/3 h-8 rounded-md focus:outline-none text-sm"
          placeholder="搜索收藏夹"
          type="text"
        />
      </div>
      <ul className="CollectionsList flex-1 grid grid-cols-10 grid-rows-4 mx-auto p-4 w-full h-0 bg-yellow-200">
        {Collections.map((item) =>
          item.type === 'group' ? (
            <CollectionGroup data={item} key={item.id} />
          ) : (
            <CollectionItem data={item} key={item.id} />
          ),
        )}
      </ul>
    </div>
  );
};
