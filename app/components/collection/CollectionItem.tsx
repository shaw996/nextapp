import { AnimationControls, motion } from 'framer-motion';
import Image from 'next/image';
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef } from 'react';

import { nextTick } from '@/utils/dom';
import mcn from '@/utils/mcn';

import {
  CollectionGroup,
  CollectionItem,
  CollectionsContext,
  computedNewGroup,
  computedShakingAnimate,
} from './CollectionsContext';

const CollItem = forwardRef(function CollItem(
  {
    allowDragEnter,
    data,

    size,
  }: {
    allowDragEnter: boolean;
    data: CollectionItem;
    size?: 'sm';
  },
  ref?: React.Ref<HTMLLIElement | null>,
) {
  const { id, logo, name, url } = data;

  const {
    collections,
    dragEnterItem,
    dragEnterTimer,
    dragItem,
    isShaking,
    setCollections,
    setDragEnterItem,
    setDragItem,
    setIsShaking,
  } = useContext(CollectionsContext);

  const isSm = size === 'sm';
  const isDragging = dragItem && dragItem.id === id;
  const isDragEnter = dragEnterItem && dragEnterItem.id === id;
  const isShouldShaking = !isDragging && !isDragEnter && isShaking;

  const shakingAnimate = computedShakingAnimate(isShouldShaking);

  const draggableRef = useRef<HTMLLIElement | null>(null);

  useImperativeHandle(ref, () => draggableRef.current);

  const firstAnchorRef = useRef<HTMLLIElement>(null);
  const lastAnchorRef = useRef<HTMLLIElement>(null);
  const mousedownTimer = useRef<NodeJS.Timeout | null>(null);

  // Processing flags
  const isLongPress = useRef<boolean>(false);

  const removeItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  // Click event
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (isLongPress.current) {
      isLongPress.current = false;

      return;
    }

    window.open(url);
    setIsShaking(false);
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

    if (!dragItem) return;

    if (!isDragging && allowDragEnter) {
      if (dragEnterTimer.current) {
        clearTimeout(dragEnterTimer.current);
        dragEnterTimer.current = null;
      }

      dragEnterTimer.current = setTimeout(() => {
        setDragEnterItem(data);
        dragEnterTimer.current = null;
      }, 500);
    }
  };

  // Drag leave event
  const onDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    if (e.relatedTarget !== draggableRef.current) return;

    clearMousedownTimer();

    if (dragEnterItem && dragEnterItem.id === id) {
      setDragEnterItem(null);
    }
  };

  // Drop event
  const onDrop = () => {
    if (isDragEnter) {
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
    <motion.li
      className={mcn(
        'CollectionItem flex items-center justify-center float-left p-[12.5%] w-full',
        isSm && 'p-0',
      )}
      ref={draggableRef}
      layout
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
          'CollectionItemDraggable flex-none relative w-full bg-transparent cursor-pointer select-none',
        )}
        animate={shakingAnimate as unknown as AnimationControls}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div
          className={mcn(
            'flex items-center justify-center relative w-full shadow-md rounded-[22%] overflow-hidden transition-all duration-100 ease-linear',
            isDragEnter &&
              'p-[10.5%] rounded-[32%] bg-white/50 backdrop-blur-3xl shadow-md scale-125 ',
          )}
        >
          <div className="relative w-full aspect-square bg-white rounded-[22%] pointer-events-none overflow-hidden">
            <Image src={logo} alt={name} width={32} height={32} className="w-full aspect-square" />

            <div
              className={mcn(
                'absolute inset-0 bg-black/20 opacity-0',
                (isDragEnter || isDragging) && 'opacity-100',
              )}
            ></div>
          </div>
        </div>

        {!isSm && (
          <figcaption
            className={mcn(
              'CollectionItemName hidden md:block mt-[10%] text-center text-xs text-gray-500 truncate transition-opacity duration-100 ease-linear',
              isDragEnter && 'opacity-0',
            )}
          >
            {name}
          </figcaption>
        )}

        {!isSm && isShouldShaking && (
          <motion.button
            className="flex items-center justify-center absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-1 aspect-square md:w-3 lg:w-5 text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full border-none outline-none shadow-sm"
            exit={{
              opacity: 0,
              width: 0,
            }}
            transition={{
              duration: 0.1,
            }}
            onClick={removeItem}
          >
            <i className="iconfont icon-close text-[0.2rem] md:text-[0.4rem] lg:text-[0.6rem] font-bold"></i>
          </motion.button>
        )}
      </motion.figure>
    </motion.li>
  );
});

export default CollItem;
