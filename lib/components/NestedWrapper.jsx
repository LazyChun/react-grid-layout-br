// @flow
import React from "react";
import PropTypes from "prop-types";
import { useEventListener } from "ahooks";
import {
  isDragging,
  getMoveDragging,
  updateMoveDragging,
  getMoveDraggingField,
  getCurrentLayoutLevel,
  LAYOUT_LEVEL_KEY,
  ORIGIN_CLASS_KEY
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

const NestedWrapper = ({ children, uniqueLayoutClass }) => {
  useEventListener("mousemove", e => {
    // 拖拽启动布局
    const originUniqueClass = getMoveDraggingField(ORIGIN_CLASS_KEY);
    if (isDragging() && originUniqueClass !== uniqueLayoutClass) {
      const currentLayoutEle =
        document.getElementsByClassName(uniqueLayoutClass)?.[0];
      if (currentLayoutEle) {
        const layoutRect = currentLayoutEle.getBoundingClientRect();
        const moveDragging = getMoveDragging();
        // 拖拽进入判断点
        const dragPointers = getDragPointers(
          moveDragging.layerX,
          moveDragging.layerY,
          moveDragging.rectWidth,
          moveDragging.rectHeight
        );
        const itemX = layoutRect.left;
        const itemY = layoutRect.top;
        const itemW = layoutRect.width;
        const itemH = layoutRect.height;
        const basePointer = { x: itemX || 0, y: itemY || 0 };
        const endPointer = { x: itemX + itemW, y: itemY + itemH };
        // 是否已在该布局中
        const inLayout = !!dragPointers.find(
          pointer =>
            pointer.x > basePointer.x &&
            pointer.y > basePointer.y &&
            pointer.x < endPointer.x &&
            pointer.y < endPointer.y
        );
        if (inLayout) {
          if (
            getMoveDraggingField("targetUniqueLayoutClass") !==
            uniqueLayoutClass
          ) {
            // const currentLayoutLevel = getCurrentLayoutLevel(uniqueLayoutClass);
            console.log(
              "inLayout==========================GG==========llllllll1111",
              getMoveDraggingField("targetUniqueLayoutClass"),
              uniqueLayoutClass
            );
            updateMoveDragging({
              targetUniqueLayoutClass: uniqueLayoutClass
            });
            console.log(
              "inLayout==========================GG==========llllllll",
              getMoveDraggingField("targetUniqueLayoutClass"),
              uniqueLayoutClass
            );
          }
        }
      }
      console.log(
        "mousemove==========================",
        e.layerX,
        e.layerY,
        e,
        uniqueLayoutClass
      );
    }
  });
  return <>{children}</>;
};

NestedWrapper.propTypes = {
  children: PropTypes.element,
  // 唯一layoutClass
  uniqueLayoutClass: PropTypes.string
};

export default NestedWrapper;
