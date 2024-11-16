/**
 * 判断box1、box2是否相交
 * @param box1
 * @param box2
 * @returns
 */
export const intersect = (box1: HTMLElement, box2: HTMLElement): boolean => {
  const { height: box1H, width: box1W, x: box1X, y: box1Y } = box1.getBoundingClientRect();
  const { height: box2H, width: box2W, x: box2X, y: box2Y } = box2.getBoundingClientRect();

  return !(
    (
      box1X > box2X + box2W || // box1在box2右侧
      box1X + box1W < box2X || // box1在box2左侧
      box1Y > box2Y + box2H || // box1在box2下方
      box1Y + box1H < box2Y
    ) // box1在box2上方
  );
};

/**
 * 判断box1是否在box2内
 * @param box1
 * @param box2
 * @returns
 */
export const inside = (box1: HTMLElement, box2: HTMLElement): boolean => {
  const { height: box1H, width: box1W, x: box1X, y: box1Y } = box1.getBoundingClientRect();
  const { height: box2H, width: box2W, x: box2X, y: box2Y } = box2.getBoundingClientRect();

  return (
    box1X >= box2X && // box1的左边界在box2的左边界右侧或重合
    box1X + box1W <= box2X + box2W && // box1的右边界在box2的右边界左侧或重合
    box1Y >= box2Y && // box1的上边界在box2的上边界下方或重合
    box1Y + box1H <= box2Y + box2H // box1的下边界在box2的下边界上方或重合
  );
};
