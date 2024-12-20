import { AnimationControls, motion } from 'framer-motion';
import { useContext, useEffect, useRef } from 'react';

import { nextTick } from '@/utils/dom';
import mcn from '@/utils/mcn';

import CollItem from './CollectionItem';
import {
  CollectionGroup,
  CollectionsContext,
  computedNewGroup,
  computedShakingAnimate,
} from './CollectionsContext';

export function CollGroup({
  data,
  // wrapRef,
}: {
  data: CollectionGroup;
  // wrapRef: RefObject<HTMLUListElement>;
}) {
  const { children, id, name } = data;

  const {
    collections,
    dragEnterItem,
    dragEnterTimer,
    dragItem,
    isShaking,
    // openedGroup,
    setCollections,
    setDragEnterItem,
    setDragItem,
    setIsShaking,
    setOpenedGroup,
  } = useContext(CollectionsContext);

  const isDragging = dragItem && dragItem.id === id;
  const isDraggingGroup = dragItem && !!(dragItem as CollectionGroup).children;
  const isDragEnter = dragEnterItem && dragEnterItem.id === id;
  const isShouldShaking = !isDragging && !isDragEnter && isShaking;
  // const isOpened = openedGroup && openedGroup.id === id;

  const shakingAnimate = computedShakingAnimate(isShouldShaking);

  const draggableRef = useRef<HTMLLIElement>(null);
  const firstAnchorRef = useRef<HTMLLIElement>(null);
  const lastAnchorRef = useRef<HTMLLIElement>(null);
  const mousedownTimer = useRef<NodeJS.Timeout | null>(null);

  // Processing flags
  const isLongPress = useRef<boolean>(false);

  // Click event
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (isLongPress.current) {
      isLongPress.current = false;

      return;
    }

    setOpenedGroup(data);
  };

  // Mouse down event
  const onMouseDown = () => {
    if (!!dragItem) {
      return;
    }

    clearMousedownTimer();
    mousedownTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setIsShaking(true);
    }, 500);
  };

  // Mouse up event
  const onMouseUp = () => {
    clearMousedownTimer();
  };

  // Drag start event
  const onDragStart = () => {
    clearMousedownTimer();
    setDragItem(data);
  };

  // Drag enter event
  const onDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    if (e.relatedTarget !== draggableRef.current) return;

    if (!dragItem && isDragEnter) return;

    if (!isDragging && !isDraggingGroup) {
      if (dragEnterTimer.current) {
        clearTimeout(dragEnterTimer.current);
        dragEnterTimer.current = null;
      }

      dragEnterTimer.current = setTimeout(() => {
        setDragEnterItem(data);
        // isEntering.current = true;
        dragEnterTimer.current = null;
      }, 500);
    }
  };

  // Drag leave event
  const onDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    if (e.relatedTarget !== draggableRef.current) return;

    clearMousedownTimer();

    if (isDragEnter) {
      setDragEnterItem(null);
    }
  };

  // Drop event
  const onDrop = () => {
    if (!isDraggingGroup && isDragEnter) {
      const newGroup: CollectionGroup = computedNewGroup(data, dragItem!);

      nextTick(() => {
        const newCollections = [...collections];
        const removeItemIndex = newCollections.findIndex((item) => item.id === dragItem!.id);

        newCollections.splice(removeItemIndex, 1);

        const newGroupIndex = newCollections.findIndex((item) => item.id === id);

        newCollections.splice(newGroupIndex, 1, newGroup);
        setCollections(newCollections);
      });
    }

    setDragItem(null);
    setDragEnterItem(null);
  };

  // Clear mousedown timer
  const clearMousedownTimer = () => {
    if (mousedownTimer.current) {
      clearTimeout(mousedownTimer.current);
      mousedownTimer.current = null;
    }
  };

  useEffect(() => {
    if (isDragEnter) {
      lastAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      firstAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isDragEnter]);

  return (
    <>
      <motion.li
        className={mcn(
          'CollectionGroup flex items-center justify-center relative float-left p-[12.5%] w-full',
          // isOpened &&
          //   wrapRef.current &&
          //   `p-0 w-[${wrapRef.current.clientWidth}px] w-[${wrapRef.current.clientHeight}px]`,
        )}
        ref={draggableRef}
        exit={{
          opacity: 0,
          width: 0,
        }}
        transition={{
          duration: 0.2,
        }}
        onDragStartCapture={onDragStart}
        onDragEnterCapture={onDragEnter}
        onDragLeaveCapture={onDragLeave}
        onDropCapture={onDrop}
      >
        <motion.figure
          className={mcn(
            'CollectionGroupDraggable flex-none relative w-full bg-transparent cursor-pointer select-none',
          )}
          animate={shakingAnimate as unknown as AnimationControls}
          onClick={onClick}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          <div
            className={mcn(
              'flex items-center justify-center relative w-full shadow-md rounded-[22%] overflow-hidden transition-all duration-100 ease-linear',
              isDragEnter && 'scale-125',
            )}
          >
            <div className="relative p-[12.5%] w-full aspect-square bg-white/50 backdrop-blur-3xl shadow-md rounded-[22%] overflow-hidden">
              <ul className="grid grid-cols-3 grid-rows-auto auto-rows-max gap-[8%] w-full h-full overflow-hidden">
                {children.map((item, i) => (
                  <CollItem
                    key={item.id}
                    ref={
                      i === 0 ? firstAnchorRef : i === children.length - 1 ? lastAnchorRef : null
                    }
                    allowDragEnter={false}
                    data={item}
                    size="sm"
                  />
                ))}
              </ul>

              <div
                className={mcn(
                  'absolute inset-0 bg-black/20 opacity-0',
                  isDragging && 'opacity-100',
                )}
              ></div>
            </div>
          </div>
          <figcaption
            className={mcn(
              'CollectionGroupName hidden md:block mt-[10%] text-center text-xs text-gray-500 truncate transition-opacity duration-100 ease-linear',
              isDragEnter && 'opacity-0',
            )}
          >
            {name}
          </figcaption>
        </motion.figure>
      </motion.li>
      {/* <CollectionGroupModal data={data} isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </>
  );
}
