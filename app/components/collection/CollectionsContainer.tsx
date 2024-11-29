import { AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';

import mcn from '@/utils/mcn';

import { CollGroup } from './CollectionGroup';
import CollItem from './CollectionItem';
import { CollectionGroup, CollectionItem, CollectionsContext } from './CollectionsContext';

export function CollContainer() {
  // Collections context
  const {
    collections,
    dragEnterTimer,
    // openedGroup,
    setCollections,
    setDragEnterItem,
    setDragItem,
  } = useContext(CollectionsContext);

  // const collectionsOnPage = openedGroup ? openedGroup.children : collections;

  // DOM
  const collectionsListRef = useRef<HTMLUListElement>(null);

  // Sortable
  const sortableInst = useRef<Sortable | null>(null);

  const onDragEnd = () => {
    setDragItem(null);
    setDragEnterItem(null);
  };

  useEffect(() => {
    if (!collectionsListRef.current) return;

    if (sortableInst.current) {
      sortableInst.current.destroy();
      sortableInst.current = null;
    }

    sortableInst.current = new Sortable(collectionsListRef.current, {
      animation: 250,
      easing: 'ease-in',
      group: {
        name: 'Collections',
        put: false,
      },
      onChange: () => {
        if (dragEnterTimer.current) {
          clearTimeout(dragEnterTimer.current);
          dragEnterTimer.current = null;
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
  }, [collections, dragEnterTimer, setCollections, setDragEnterItem, setDragItem]);

  return (
    <div className="Collections flex-none flex p-8 w-2/3 bg-blue-200">
      <ul
        ref={collectionsListRef}
        className={mcn(
          'CollectionsList w-full h-full grid auto-rows-max mx-auto grid-cols-5 gap-2 md:grid-cols-7 md:gap-4 lg:grid-cols-9 lg:gap-6',
        )}
        onDragEnd={onDragEnd}
      >
        <AnimatePresence>
          {collections.map((item) =>
            (item as CollectionGroup).children ? (
              <CollGroup
                key={item.id}
                data={item as CollectionGroup}
                // wrapRef={collectionsListRef}
              />
            ) : (
              <CollItem key={item.id} allowDragEnter={true} data={item as CollectionItem} />
            ),
          )}
        </AnimatePresence>
      </ul>

      {/* {openedGroup && (
        <ul
          ref={collectionsListRef}
          className="CollectionsList flex-1 grid auto-rows-max mx-auto grid-cols-5 gap-2 md:grid-cols-7 md:gap-4 lg:grid-cols-9 lg:gap-6 bg-white/50 backdrop-blur-3xl shadow-md rounded-3xl"
          onDragEnd={onDragEnd}
        >
          <AnimatePresence>
            {openedGroup.children.map((item) => (
              <CollItem key={item.id} allowDragEnter={false} data={item as CollectionItem} />
            ))}
          </AnimatePresence>
        </ul>
      )} */}
    </div>
  );
}
