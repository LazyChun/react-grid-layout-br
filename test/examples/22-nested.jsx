// @flow
import * as React from "react";
import _ from "lodash";
import Responsive from '../../lib/ResponsiveReactGridLayout';
import WidthProvider from '../../lib/components/WidthProvider';
import type {Layout, LayoutItem, ReactChildren} from '../../lib/utils';
import type {Breakpoint, OnLayoutChangeCallback} from '../../lib/responsiveUtils';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

type Props = {|
  className: string,
  onLayoutChange: Function,
  rowHeight: number,
|};
type State = {|
  currentBreakpoint: string,
  
  mounted: boolean,
  resizeHandles: string[],
  layouts: {[string]: Layout}
|};

const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];

// 默认布局
const DEFAULT_LAYOUTS = [
  {i:'item1',x:0,y:0,w:4,h:4,resizeHandles:'se'},
  {i:'layout1',x:4,y:0,w:8,h:10,isLayout:true,resizeHandles:'se'},
  {i:'layout2',x:12,y:0,w:8,h:12,isLayout:true,resizeHandles:'se'},
  {i:'item2',x:20,y:0,w:4,h:6,resizeHandles:'se'},
  {i:'item3',x:0,y:5,w:4,h:4,resizeHandles:'se'}
];


export default class NestedLayout extends React.Component<Props, State> {
  static defaultProps: Props = {
    onLayoutChange: function() {},
  };

  state: State = {
    currentBreakpoint: "lg",
    resizeHandles: ['se'],
    mounted: false,
    layouts:DEFAULT_LAYOUTS
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM(): ReactChildren {
    return _.map(this.state.layouts, function(l, i) {
      return (
        <div key={l.i} style={{ background: l.isLayout ? 'yellow' : undefined }} className={l.isLayout ? "layout" : ""}>
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



  onResizeTypeChange: () => void = () => {
    const resizeHandles = this.state.resizeHandles === availableHandles ? ['se'] : availableHandles;
    this.setState({resizeHandles, layouts: this.generateLayout(resizeHandles)});
  };


  onLayoutChange: OnLayoutChangeCallback = (layout, layouts) => {
     console.log("layouts=======00000",layout)
     this.props.onLayoutChange(layout, layouts);
  };

  onNewLayout: EventHandler = () => {
    this.setState({
      layouts: this.generateLayout(this.state.resizeHandles)
    });
  };

  onDrop: (layout: Layout, item: ?LayoutItem, e: Event) => void = (elemParams) => {
    alert(`Element parameters: ${JSON.stringify(elemParams)}`);
  };

 generateLayout() {
    const layouts = _.map(this.state.layouts, function(item, i) {
      return {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        i: item.i,
        isLayout:item.isLayout,
        resizeHandles:['se']
      };
    });
    return layouts
  }

  render(): React.Node {

    // eslint-disable-next-line no-unused-vars
    return (
      <div>
        <h1>Case For Nested</h1>
        <ResponsiveReactGridLayout
          className="layout"
          rowHeight={16}
          cols={{ lg: 24, md: 24, sm: 24, xs: 24,xxs:24 }}
          style={{height:'100vh'}}
          layouts={{ lg: this.generateLayout(), md:this.generateLayout(), sm: this.generateLayout(), xs: this.generateLayout(), xxs: this.generateLayout() }}
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



if (process.env.STATIC_EXAMPLES === true) {
  import("../test-hook.jsx").then(fn => fn.default(NestedLayout));
}
