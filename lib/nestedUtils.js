import _ from 'lodash';
// @flow
// 嵌套layout统一类名
export const NESTED_LAYOUT_CLASSNAME = "[nested-react-grid-layout]";

// 移动拖拽信息 key
export const MOVE_DRAGGING_KEY = "react_grid_layout_move_dragging";

// 布局优先级KEY
export const LAYOUT_LEVEL_KEY = "layoutLevel";

// 原始拖拽样式key
export const ORIGIN_CLASS_KEY = "originUniqueClassName";

// 目标布局layoutKey
export const TARGET_LAYOUT_KEY = "targetUniqueLayoutClass";

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
 * 更新移动拖拽信息  key  itemId, layoutLevel,originUniqueClassName, targetUniqueLayoutClass layerX,layerY,rectWidth,rectHeight
 * @param {*} key
 * @param {*} value
 */
export function updateMoveDragging(dragging: { [key: string]: string }): void {
  const draggingProps = window[MOVE_DRAGGING_KEY];
  if(draggingProps) {
    for(const key in dragging) {
      if(draggingProps[key]!== dragging[key]) {
          draggingProps[key] = dragging[key]
      }
    }
  }else {
    window[MOVE_DRAGGING_KEY] = dragging
  }
}

/**
 * 清除移动拖拽信息
 */
export function clearMoveDragging(uniqueLayoutClass?: string): void {
  if (uniqueLayoutClass) {
      const targetUniqueLayoutClass = getMoveDraggingField(TARGET_LAYOUT_KEY)
      if (targetUniqueLayoutClass === uniqueLayoutClass) {
        window[MOVE_DRAGGING_KEY] = {};
      }
  }else {
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
  return  getMoveDragging()[key];
}

/**
 * 是否在拖拽中
 */
export function isDragging(): boolean {
  return !_.isEmpty(_.keys(getMoveDragging()));
}

/**
 * 是否是父布局
 * @param {*} layoutUniqueClassName 
 * @returns 
 */
export function isParentLayout(layoutUniqueClassName: String): boolean {
  const targetLayoutClass = getMoveDraggingField(TARGET_LAYOUT_KEY);
  const currentLayoutEle = document.getElementsByClassName(
    targetLayoutClass
  )?.[0];
  let isParent = false;
  if(currentLayoutEle) {
   
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
  return isParent
}
