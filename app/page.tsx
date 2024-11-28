'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { on } from '@/utils/dom';

import { CollContainer } from './components/collection/CollectionsContainer';
import {
  Collection,
  CollectionGroup,
  Collections,
  CollectionsContext,
  Favorites,
  SearchEngines,
} from './components/collection/CollectionsContext';

export default function Home() {
  // Search
  const [searchEngineIndex, setSearchEngineIndex] = useState(0);
  const searchEngine = SearchEngines[searchEngineIndex];

  const [keyword, setKeyword] = useState('');
  const [isComposed, setIsComposed] = useState(false);

  const changeSearchEngine = useCallback(() => {
    setSearchEngineIndex(searchEngineIndex < SearchEngines.length - 1 ? searchEngineIndex + 1 : 0);
  }, [searchEngineIndex]);

  // Collections context
  const [collections, setCollections] = useState<Collection[]>(() => [...Collections]);
  const [dragEnterItem, setDragEnterItem] = useState<Collection | null>(null);
  const [dragItem, setDragItem] = useState<Collection | null>(null);
  const [openedGroup, setOpenedGroup] = useState<CollectionGroup | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const dragEnterTimer = useRef<NodeJS.Timeout | null>(null);

  // Keydown event
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keywordTrimed = keyword.trim();

    if (e.nativeEvent.key === 'Enter' && !isComposed && keywordTrimed) {
      e.nativeEvent.preventDefault();

      const keywordEncoded = encodeURIComponent(keywordTrimed);
      const url = `${searchEngine.url}${keywordEncoded}`;

      window.open(url);
      setKeyword('');
    }
  };

  const onClick = () => {
    setIsShaking(false);
  };

  useEffect(() => {
    const offKeydown = on(window, 'keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          changeSearchEngine();
          break;
        case 'Escape':
          setIsShaking(false);
          break;
        default:
          break;
      }
    });

    return () => {
      offKeydown();
    };
  }, [changeSearchEngine]);

  return (
    <motion.div
      className="HomeWrapper"
      animate={{
        opacity: 1,
      }}
      initial={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      onClick={onClick}
    >
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
                  onKeyDown={onKeyDown}
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
          <CollectionsContext.Provider
            value={{
              collections,
              dragEnterItem,
              dragEnterTimer,
              dragItem,
              isShaking,
              openedGroup,
              setCollections,
              setDragEnterItem,
              setDragItem,
              setIsShaking,
              setOpenedGroup,
            }}
          >
            <CollContainer />
          </CollectionsContext.Provider>
          <div className="RecommendSites w-1/3 h-full bg-green-200">RecommendSites</div>
        </div>
      </main>
    </motion.div>
  );
}
