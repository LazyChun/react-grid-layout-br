// @flow
import * as React from "react";
import _ from "lodash";
import Responsive from '../../lib/ResponsiveReactGridLayout';
import WidthProvider from '../../lib/components/WidthProvider';
import type {CompactType, Layout, LayoutItem, ReactChildren} from '../../lib/utils';
import type {Breakpoint, OnLayoutChangeCallback} from '../../lib/responsiveUtils';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

type Props = {|
  className: string,
  cols: {[string]: number},
  onLayoutChange: Function,
  rowHeight: number,
|};
type State = {|
  currentBreakpoint: string,
  compactType: CompactType,
  mounted: boolean,
  resizeHandles: string[],
  layouts: {[string]: Layout}
|};

const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];

export default class ShowcaseLayout extends React.Component<Props, State> {
  static defaultProps: Props = {
    className: "layout",
    rowHeight: 16,
    onLayoutChange: function() {},
    cols:{ lg: 24, md: 24, sm: 24, xs: 24 }
  };

  state: State = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    resizeHandles: ['se'],
    mounted: false,
    layouts: { lg: generateLayout(['se']) }
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM(): ReactChildren {
    return _.map(this.state.layouts.lg, function(l, i) {
      return (
        <div key={i} style={{ background: l.isLayout ? 'yellow' : undefined }} className={l.isLayout ? "layout" : ""}>
          {l.isLayout ? (
            <span
              className="text"
              title="This item is layout and cannot be removed or resized."
            >
              Layout - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  }

  onBreakpointChange: (Breakpoint) => void = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  onCompactTypeChange: () => void = () => {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    this.setState({ compactType });
  };

  onResizeTypeChange: () => void = () => {
    const resizeHandles = this.state.resizeHandles === availableHandles ? ['se'] : availableHandles;
    this.setState({resizeHandles, layouts: {lg: generateLayout(resizeHandles)}});
  };


  onLayoutChange: OnLayoutChangeCallback = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
  };

  onNewLayout: EventHandler = () => {
    this.setState({
      layouts: { lg: generateLayout(this.state.resizeHandles) }
    });
  };

  onDrop: (layout: Layout, item: ?LayoutItem, e: Event) => void = (elemParams) => {
    alert(`Element parameters: ${JSON.stringify(elemParams)}`);
  };

  render(): React.Node {
    // eslint-disable-next-line no-unused-vars
    return (
      <div>
        <h1>Case For Nested</h1>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          onDrop={this.onDrop}
          measureBeforeMount={false}
          useCSSTransforms={true}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

function generateLayout(resizeHandles) {
  const layouts = _.map(_.range(0, 5), function(item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    // 是否是内嵌的layout
    const isLayout = Math.random() < 0.4;
    return {
      x: Math.round(Math.random() * 5) * 2,
      y: Math.floor(i / 6) * y,
      w: isLayout ? 8 : 4,
      h:  isLayout ?y*4: y*2,
      i: i.toString(),
      isLayout: isLayout,
      resizeHandles
    };
  });
  // 保证至少有一个是layout
  if(layouts.find(item=>item.isLayout)) {
    return layouts
  }
  return generateLayout(resizeHandles)
}

if (process.env.STATIC_EXAMPLES === true) {
  import("../test-hook.jsx").then(fn => fn.default(ShowcaseLayout));
}
