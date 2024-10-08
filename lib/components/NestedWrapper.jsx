// @flow
import React from "react";
import PropTypes from "prop-types";
import { useEventListener } from "ahooks";
import { isDragging, getMoveDragging } from "../nestedUtils";

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
    if (isDragging()) {
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
