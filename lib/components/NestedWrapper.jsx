import React from "react";
import PropTypes from "prop-types";
import { useEventListener } from "ahooks";

const NestedWrapper = ({ children }) => {
  useEventListener("mousemove", e => {
    console.log("mousemove==========================", e.layerX, e.layerY);
  });
  return <>{children}</>;
};

NestedWrapper.propTypes = {
  children: PropTypes.element
};

export default NestedWrapper;
