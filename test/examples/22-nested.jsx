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
  {i:'i1',x:0,y:0,w:4,h:4,resizeHandles:'se'},
  {i:'l2',x:12,y:0,w:8,h:32,isLayout:false,resizeHandles:'se'},
  {i:'i2',x:20,y:0,w:4,h:6,resizeHandles:'se'},
  {i:'i3',x:0,y:5,w:4,h:4,resizeHandles:'se'},
  {i:'l1',x:4,y:0,w:8,h:20,isLayout:true,resizeHandles:'se'},
];


export default class NestedLayout extends React.Component<Props, State> {
  static defaultProps: Props = {
    onLayoutChange: function() {},
  };

  state: State = {
    currentBreakpoint: "lg",
    resizeHandles: ['se'],
    mounted: false,
    layouts:DEFAULT_LAYOUTS,
    l1Layouts:[{  x: 0,
      y: 0,
      w: 4,
      h: 4,
      i: "c1",}]
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM(): ReactChildren {
    const onL1Change = this.onL1Change.bind(this);
    const l1Layouts = this.state.l1Layouts;
    console.log("l1Layouts======GG",l1Layouts)
    return _.map(this.state.layouts, function(l, i) {
      return (
        <div key={l.i} style={{ background: l.isLayout ? 'yellow' : undefined }} className={l.isLayout ? "layout" : ""}>
          <div className={"draggableField"} style={{background:'purple',color:'white'}} draggable={false}  >Drag</div>
          {l.isLayout ? (<>
            <ResponsiveReactGridLayout
            className="layout"
            style={{height:'100%',background:'green',marginTop: 0}}
            cols={{ lg: l.w, md: l.w , sm: l.w , xs: l.w ,xxs:l.w  }}
            measureBeforeMount={false}
            containerPadding={[0, 0]}
            rowHeight={16}
            onLayoutChange={onL1Change}
            isBounded={false}
            isDroppable={true}
            isDraggable={true}
            isResizable={true}
            useCSSTransforms={true}
            layouts={{lg:l1Layouts}}
          >
           {l1Layouts.map(item=>(<div key={item.i}>{item.i}</div>))}
            
          </ResponsiveReactGridLayout>
          </>
          ) : (
            <span className="text">{l.i}</span>
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

  onL1Change: OnLayoutChangeCallback = (layout, layouts) => {
    console.log("onL1Change",layout,layouts)
    this.setState({l1Layouts:layout})
  }

  onNewLayout: EventHandler = () => {
    this.setState({
      layouts: this.generateLayout(this.state.resizeHandles)
    });
  };

  onDrop: (layout: Layout, item: ?LayoutItem, e: Event) => void = (elemParams) => {
    console.log("onDrop================",elemParams)
  };

  onDragStop: (layout: Layout, oldItem: LayoutItem, newItem: LayoutItem, placeholder: LayoutItem, e: Event) => void = (layout, oldItem, newItem, placeholder, e) => {
    console.log("layouts=======00000======DragStop",layout)
  }

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
      <div className={"nested===="}>
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
          onDragStop={this.onDragStop}
          measureBeforeMount={false}
          useCSSTransforms={true}
          isDroppable={true}
          isDraggable={true}
          isResizable={true}
          draggableHandle={'.draggableField'}
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
