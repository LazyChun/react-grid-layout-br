// @flow
import _ from "lodash";
import { LayoutItem } from "./utils";

// 嵌套layout统一类名
export const NESTED_LAYOUT_CLASSNAME = "[nested-react-grid-layout]";

// 是否bounded
export const BOUNDED_CLASSNAME = "[bounded]";

// 移动拖拽信息 key
export const MOVE_DRAGGING_KEY = "react_grid_layout_move_dragging";

// 布局优先级KEY
export const LAYOUT_LEVEL_KEY = "layoutLevel";

// 原始拖拽样式key
export const ORIGIN_CLASS_KEY = "originUniqueClassName";

// 目标布局layoutKey
export const TARGET_LAYOUT_KEY = "targetUniqueLayoutClass";

export const CLOSEST_BOUNDED_LAYOUT_KEY = "closestBoundedLayout";

// 无布标类标识
export const NO_TARGET_LAYOUT = "noTargetLayout";

// 取消drop标识
export const CANCEL_DROP_CODE = 5201314;

/**
 * 判断是否是顶级布局
 * @param {*} layoutUniqueClassName
 */
export function isTopLayout(layoutUniqueClassName: string): Boolean {
  const currentLayoutEle = document.getElementsByClassName(
    layoutUniqueClassName
  )?.[0];
  // 还没有渲染时，返回false
  if (!currentLayoutEle) {
    return false;
  }
  let parent = currentLayoutEle?.parentElement;
  while (parent) {
    const parentClassName = parent?.className || "";
    if (parentClassName?.indexOf(NESTED_LAYOUT_CLASSNAME) >= 0) {
      return false;
    }
    parent = parent?.parentElement;
  }
  return true;
}

/**
 * 获取当前布局的层级
 * @param {*} layoutUniqueClassName
 */
export function getCurrentLayoutLevel(layoutUniqueClassName: string): Number {
  const currentLayoutEle = document.getElementsByClassName(
    layoutUniqueClassName
  )?.[0];
  // 还没有渲染时，返回-1
  if (!currentLayoutEle) {
    return -1;
  }
  let level = 0;
  let parent = currentLayoutEle?.parentElement;
  while (parent) {
    const parentClassName = parent?.className || "";
    if (parentClassName?.indexOf(NESTED_LAYOUT_CLASSNAME) >= 0) {
      level++;
    }
    parent = parent?.parentElement;
  }
  return level;
}

/**
 * 更新移动拖拽信息  key
 * itemId  当前拖动元素的id
 * isNew 是否是新建的元素
 * layoutLevel  当前拖动元素的层级
 * originUniqueClassName 当前拖动元素开始拖动时的layout唯一类名
 * targetUniqueLayoutClass 当前拖动元素所在layout的唯一类名
 * droppingItemI 当前拖动元素的id
 * droppingItemW 当前拖动元素的宽度
 * droppingItemH 当前拖动元素的高度
 * layerX
 * layerY
 * rectWidth
 * rectHeight
 * closestBoundedLayout 最近的bounded的父布局
 * boundedMinTop 移动的最小高度
 * boundedMaxTop 移动的最大高度
 * boundedMinLeft 移动的最小left
 * boundedMaxLeft 移动的最大left
 * @param {*} key
 * @param {*} value
 */
export function updateMoveDragging(dragging: { [key: string]: string }): void {
  const draggingProps = window[MOVE_DRAGGING_KEY];
  if (draggingProps) {
    for (const key in dragging) {
      if (draggingProps[key] !== dragging[key]) {
        draggingProps[key] = dragging[key];
      }
    }
  } else {
    window[MOVE_DRAGGING_KEY] = dragging;
  }
}

export function getDraggingId(): string {
  return getMoveDraggingField("itemId");
}

/**
 * 清除移动拖拽信息
 */
export function clearMoveDragging(uniqueLayoutClass?: string): void {
  if (uniqueLayoutClass) {
    const targetUniqueLayoutClass = getMoveDraggingField(TARGET_LAYOUT_KEY);
    if (targetUniqueLayoutClass === uniqueLayoutClass) {
      window[MOVE_DRAGGING_KEY] = {};
    }
  } else {
    window[MOVE_DRAGGING_KEY] = {};
  }
}

/**
 * 获取移动拖拽信息
 */
export function getMoveDragging(): { [key: string]: string } {
  return window[MOVE_DRAGGING_KEY] || {};
}

/**
 * 获取移动拖拽信息
 * @param {*} key
 */
export function getMoveDraggingField(key: string): string {
  return getMoveDragging()[key];
}

/**
 * 是否在拖拽中
 */
export function isDragging(): boolean {
  return !_.isEmpty(_.keys(getMoveDragging()));
}

/**
 * 是否是外部新建的组件
 */
export function isNewItem(): boolean {
  return isDragging() && !!getMoveDraggingField("isNew");
}

/**
 * 是否是父布局
 * @param {*} layoutUniqueClassName
 * @returns
 */
export function isParentLayout(layoutUniqueClassName: String): boolean {
  const targetLayoutClass = getMoveDraggingField(TARGET_LAYOUT_KEY);
  const currentLayoutEle =
    document.getElementsByClassName(targetLayoutClass)?.[0];
  let isParent = false;
  if (currentLayoutEle) {
    let parentEle = currentLayoutEle?.parentElement;
    while (parentEle) {
      const parentClassName = parentEle?.className || "";
      if (parentClassName?.indexOf(layoutUniqueClassName) >= 0) {
        isParent = true;
        break;
      }
      parentEle = parentEle?.parentElement;
    }
  }
  return isParent;
}

// 获取droppingItem
export function getDroppingItem(droppingItem: LayoutItem): LayoutItem {
  return !getMoveDraggingField("droppingItemI")
    ? droppingItem
    : {
        i: getMoveDraggingField("droppingItemI"),
        w: getMoveDraggingField("droppingItemW"),
        h: getMoveDraggingField("droppingItemH")
      };
}

// 获取bounded 的layout
export function getClosestBoundedParentLayout(
  widgetUniqueClassName: string
): HTMLElement | null {
  const widgetLayoutEle = document.getElementsByClassName(
    widgetUniqueClassName
  )?.[0];
  if (widgetLayoutEle) {
    let parentEle = widgetLayoutEle?.parentElement;
    while (parentEle) {
      const parentClassName = parentEle?.className || "";
      if (parentClassName?.indexOf(BOUNDED_CLASSNAME) >= 0) {
        break;
      }
      parentEle = parentEle?.parentElement;
    }
    return parentEle;
  }
  return null;
}

// 获取拖拽判断点位
export const getDragPointers = (x: Number, y: Number, w: Number, h: Number) => {
  return [
    { x, y },
    { x: x + w / 5, y },
    { x: x + (2 * w) / 5, y },
    { x: x + (3 * w) / 5, y },
    { x: x + (4 * w) / 5, y },
    { x: x + w, y },
    { x, y: y + h },
    { x: x + w / 5, y: y + h },
    { x: x + (2 * w) / 5, y: y + h },
    { x: x + (3 * w) / 5, y: y + h },
    { x: x + (4 * w) / 5, y: y + h },
    { x: x + w, y: y + h }
  ];
};

// 获取html开始结束判断点位
export const getBasePointerAndEndPointerByEle = (
  element: HTMLElement
): [{ x: Number, y: Number }, { x: Number, y: Number }] => {
  if (element) {
    const layoutRect = element.getBoundingClientRect();
    const itemX = layoutRect.left;
    const itemY = layoutRect.top;
    const itemW = layoutRect.width;
    const itemH = layoutRect.height;
    const basePointer = { x: itemX || 0, y: itemY || 0 };
    const endPointer = { x: itemX + itemW, y: itemY + itemH };
    return [basePointer, endPointer];
  }
  return [];
};

// 获取开始结束判断点位
export const getBasePointerAndEndPointer = (
  uniqueLayoutClass: string
): [{ x: Number, y: Number }, { x: Number, y: Number }] => {
  const currentLayoutEle =
    document.getElementsByClassName(uniqueLayoutClass)?.[0];
  if (currentLayoutEle) {
    return getBasePointerAndEndPointerByEle(currentLayoutEle);
  }
  return [];
};

export const getGridItemBoundedLeftAndTop = (
  left: number,
  top: number,
  e: Event,
  node: HTMLElement
) => {
  let newLeft = left;
  let newTop = top;
  const boundedLayout = getMoveDraggingField(CLOSEST_BOUNDED_LAYOUT_KEY);
  if (!boundedLayout) {
    return [];
  }
  // const boundedLayoutStyle = window.getComputedStyle(boundedLayout);
  const boundedTop = getMoveDraggingField("boundedMinTop");
  // 上边界限制
  // 如果没有，初始化一下
  if (!boundedTop) {
    updateMoveDragging({ boundedMinTop: top - e.layerY });
  }
  const minTop = getMoveDraggingField("boundedMinTop");
  const mTop = top - e.layerY;
  if (e.layerY < e.y && mTop !== minTop) {
    updateMoveDragging({ boundedMinTop: mTop });
  }

  const newMinTop = getMoveDraggingField("boundedMinTop");
  if (newTop < newMinTop) {
    newTop = newMinTop;
  }

  // 左边界限制
  const boundedLeft = getMoveDraggingField("boundedMinLeft");
  // 如果没有，初始化一下
  if (!boundedLeft) {
    updateMoveDragging({ boundedMinLeft: left - e.layerX });
  }
  const minLeft = getMoveDraggingField("boundedMinLeft");
  const mLeft = left - e.layerX;
  if (e.layerX < e.x && mLeft !== minLeft) {
    updateMoveDragging({ boundedMinLeft: mLeft });
  }

  const newMinTLeft = getMoveDraggingField("boundedMinLeft");
  if (newLeft < newMinTLeft) {
    newLeft = newMinTLeft;
  }

  // 下边界限制
  const boundedBottom = getMoveDraggingField("boundedMaxTop");
  // 如果没有，初始化一下
  if (!boundedBottom) {
    const boundedLayoutHeight = boundedLayout.clientHeight;
    updateMoveDragging({
      boundedMaxTop:
        boundedLayoutHeight - (e.layerY - e.offsetY) - node.clientHeight
    });
  }
  const maxTop = getMoveDraggingField("boundedMaxTop");
  if (newTop > maxTop) {
    newTop = maxTop;
  }
  // 右边界限制
  const boundedRight = getMoveDraggingField("boundedMaxLeft");
  // 如果没有，初始化一下
  if (!boundedRight) {
    const boundedLayoutWidth = boundedLayout.clientWidth;
    console.log(
      "boundedWidth====+++++",
      newLeft,
      boundedLayoutWidth,
      e.layerX,
      node.clientWidth
    );
    updateMoveDragging({
      boundedMaxLeft:
        boundedLayoutWidth - (e.layerX - e.offsetX) - node.clientWidth
    });
  }
  const maxLeft = getMoveDraggingField("boundedMaxLeft");
  if (newLeft > maxLeft) {
    newLeft = maxLeft;
  }

  console.log(
    newLeft,
    "boundedWidth====+++++outTopLayout=======AGGG",
    e,
    //outTopLayout,
    //boundedLayoutStyle.marginTop,
    maxLeft,
    e.layerX

    // e,
    // minTop
    // moveDragging.layerY,
    // basePointer.y
  );

  //newLeft += outLeftLayout;
  //newTop += outTopLayout;

  return [newLeft, newTop];
};
