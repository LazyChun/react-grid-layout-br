// @flow
import React from "react";
import PropTypes from "prop-types";
import { useEventListener } from "ahooks";
import _ from "lodash";

import {
  isDragging,
  getMoveDragging,
  updateMoveDragging,
  getMoveDraggingField,
  getDraggingId,
  getCurrentLayoutLevel,
  LAYOUT_LEVEL_KEY,
  ORIGIN_CLASS_KEY,
  isParentLayout,
  TARGET_LAYOUT_KEY,
  NO_TARGET_LAYOUT,
  CANCEL_DROP_CODE
} from "../nestedUtils";

const getDragPointers = (x: Number, y: Number, w: Number, h: Number) => {
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

// 获取开始结束判断点位
const getBasePointerAndEndPointer = (
  uniqueLayoutClass: string
): [{ x: Number, y: Number }, { x: Number, y: Number }] => {
  const currentLayoutEle =
    document.getElementsByClassName(uniqueLayoutClass)?.[0];
  if (currentLayoutEle) {
    const layoutRect = currentLayoutEle.getBoundingClientRect();

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

const NestedWrapper = ({ children, uniqueLayoutClass, onRemoveItem }) => {
  useEventListener("mousemove", e => {
    // 不在拖拽状态下无响应
    if (!isDragging()) {
      return;
    }
    // 拖拽启动布局
    const originUniqueClass = getMoveDraggingField(ORIGIN_CLASS_KEY);
    // 如果是目标布局的父布局，不响应
    if (
      isParentLayout(uniqueLayoutClass) &&
      getMoveDraggingField(TARGET_LAYOUT_KEY) !== NO_TARGET_LAYOUT
    ) {
      return null;
    }
    if (originUniqueClass !== uniqueLayoutClass) {
      const pointers = getBasePointerAndEndPointer(uniqueLayoutClass);
      if (!_.isEmpty(pointers)) {
        const [basePointer, endPointer] = pointers;
        const moveDragging = getMoveDragging();
        // 拖拽进入判断点
        const dragPointers = getDragPointers(
          moveDragging.layerX,
          moveDragging.layerY,
          moveDragging.rectWidth,
          moveDragging.rectHeight
        );
        // 是否已在该布局中
        const inLayout = !!dragPointers.find(
          pointer =>
            pointer.x > basePointer.x &&
            pointer.y > basePointer.y &&
            pointer.x < endPointer.x &&
            pointer.y < endPointer.y
        );
        if (inLayout) {
          if (getMoveDraggingField(TARGET_LAYOUT_KEY) !== uniqueLayoutClass) {
            updateMoveDragging({
              [TARGET_LAYOUT_KEY]: uniqueLayoutClass
            });
          }
          // 发送拖拽事件
          const currentLayoutEle =
            document.getElementsByClassName(uniqueLayoutClass)?.[0];
          const event = new DragEvent("dragover", {
            bubbles: true,
            cancelable: true,
            clientX: e.layerX,
            clientY: e.layerY
          });
          console.log(
            "dragover==========================",
            e.layerX,
            e.layerY,
            currentLayoutEle
          );
          currentLayoutEle.dispatchEvent(event);
        } else {
          // 如果拖进后又拖出了该布局，重置目标布局样式
          if (getMoveDraggingField(TARGET_LAYOUT_KEY) !== NO_TARGET_LAYOUT) {
            updateMoveDragging({
              [TARGET_LAYOUT_KEY]: NO_TARGET_LAYOUT
            });
          }
        }
      }

      // console.log(
      //   "mousemove==========================",
      //   e.layerX,
      //   e.layerY,
      //   e,
      //   uniqueLayoutClass
      // );
    } else {
      // 判断是否拖出了当前目标布局
      const pointers = getBasePointerAndEndPointer(uniqueLayoutClass);
      if (!_.isEmpty(pointers)) {
        const [basePointer, endPointer] = pointers;
        const moveDragging = getMoveDragging();
        // 拖拽离开判断点
        const dragPointers = getDragPointers(
          moveDragging.layerX,
          moveDragging.layerY,
          moveDragging.rectWidth,
          moveDragging.rectHeight
        );
        // 是否已离开该布局
        const outLayout = !!dragPointers.find(
          pointer =>
            pointer.x < basePointer.x ||
            pointer.y < basePointer.y ||
            pointer.x > endPointer.x ||
            pointer.y > endPointer.y
        );
        if (outLayout) {
          // 如果拖出了该布局，更新目标布局
          if (getMoveDraggingField(TARGET_LAYOUT_KEY) !== NO_TARGET_LAYOUT) {
            updateMoveDragging({
              [TARGET_LAYOUT_KEY]: NO_TARGET_LAYOUT
            });
          }
        } else {
          const targetLayoutClass = getMoveDraggingField(TARGET_LAYOUT_KEY);
          // 如果回到了该布局，更新目标布局
          if (targetLayoutClass !== uniqueLayoutClass) {
            const event = new DragEvent("drop", {
              bubbles: true,
              cancelable: true,
              detail: CANCEL_DROP_CODE
            });
            const targetLayoutEle =
              document.getElementsByClassName(targetLayoutClass)?.[0];
            targetLayoutEle?.dispatchEvent(event);
            updateMoveDragging({
              [TARGET_LAYOUT_KEY]: uniqueLayoutClass
            });
          }
        }
      }
    }
  });

  useEventListener("mouseup", e => {
    // 不在拖拽状态下无响应
    if (!isDragging()) {
      return;
    }
    // 拖拽启动布局
    const originUniqueClass = getMoveDraggingField(ORIGIN_CLASS_KEY);
    const targetLayoutClass = getMoveDraggingField(TARGET_LAYOUT_KEY);
    if (originUniqueClass === uniqueLayoutClass) {
      if (originUniqueClass !== targetLayoutClass) {
        onRemoveItem(getDraggingId());
      }
    } else {
      console.log("goood");
    }
  });
  return <>{children}</>;
};

NestedWrapper.propTypes = {
  children: PropTypes.element,
  // 唯一layoutClass
  uniqueLayoutClass: PropTypes.string,
  // 删除元素
  onRemoveItem: PropTypes.func
};

export default NestedWrapper;
