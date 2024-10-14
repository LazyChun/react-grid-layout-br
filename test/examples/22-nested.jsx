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
  {i:'l2',x:10,y:0,w:10,h:32,resizeHandles:'se'},
  {i:'i2',x:20,y:0,w:4,h:6,resizeHandles:'se'},
  {i:'i3',x:0,y:5,w:4,h:4,resizeHandles:'se'},
  {i:'l1',x:4,y:0,w:6,h:12,resizeHandles:'se'},
];


export default class NestedLayout extends React.Component<Props, State> {
  static defaultProps: Props = {
    onLayoutChange: function() {},
  };

  state: State = {
    currentBreakpoint: "lg",
    resizeHandles: ['se'],
    mounted: false,
    droppingItem:undefined,
    layouts:DEFAULT_LAYOUTS,
    l1Layouts:[{  x: 0,
      y: 0,
      w: 4,
      h: 4,
      i: "c1",}],
    l2Layouts:[
    ]
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM(renderLayouts?: Layout,draggableHandle?: string): ReactChildren {
    const onL1Change = this.onL1Change.bind(this);
    const onL1Drop = this.onL1Drop.bind(this);
    const onL2Change = this.onL2Change.bind(this);
    const onL2Drop = this.onL2Drop.bind(this);
    const l1Layouts = this.state.l1Layouts;
    const l2Layouts = this.state.l2Layouts;
    const generateChildrenDOM = this.generateDOM.bind(this);
    
    console.log("l1Layouts======GG",l1Layouts)
    return _.map(renderLayouts||this.state.layouts, function(l, i) {
      //const isDraggable = l.i === "l2";
      return (
        <div key={l.i} style={{ background: l.i.startsWith('l') ? 'yellow' : undefined }} className={l.i.startsWith('l') ? "layout" : ""}>
          <div className={draggableHandle||"draggableField"} style={{background:'purple',color:'white'}} draggable={false}  >Drag</div>
          {l.i.startsWith('l') ? (<>
            <ResponsiveReactGridLayout
            className="layout"
            style={{height:'calc(100% - 21px)',background:'green',marginTop: 0}}
            cols={{ lg: l.w, md: l.w , sm: l.w , xs: l.w ,xxs:l.w  }}
            measureBeforeMount={false}
            containerPadding={[0, 0]}
            rowHeight={16}
            onDrop={l.i === "l1" ? onL1Drop : onL2Drop}
            onLayoutChange={l.i ==="l1"?onL1Change: onL2Change}
            isBounded={false}
            isDroppable={true}
            isDraggable={true}
            isResizable={true}
            useCSSTransforms={true}
            draggableHandle={'.draggableField'+l.i}
            layouts={{lg:l.i === "l1"?l1Layouts:l2Layouts}}
          >
            {generateChildrenDOM(l.i === "l1"?l1Layouts:l2Layouts,'draggableField'+l.i)}   
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
     console.log("change==================AGGG",layout)
     this.setState({layouts:layout})
  };

  onL1Change: OnLayoutChangeCallback = (layout, layouts) => {
    console.log("onL1Change",layout,layouts)
    this.setState({l1Layouts:layout})
  }

  onL2Change: OnLayoutChangeCallback = (layout, layouts) => {
    console.log("onL2Change",layout,layouts)

    this.setState({l2Layouts:layout})
  }

  onNewLayout: EventHandler = () => {
    this.setState({
      layouts: this.generateLayout(this.state.resizeHandles)
    });
  };

  onDrop: (layout: Layout, item: ?LayoutItem, e: Event) => void = (layout) => {
    console.log("onDrop================GGDAKKKK",layout)
    const newLayouts = layout.map(l=>{
      
      if(l.i === '-1') {
        l.i = "i"+Math.floor(Math.random()*1000)
      }
      return {...l}
     })
   
     this.setState({layouts:newLayouts, droppingItem:undefined})
  };

  onL1Drop: (layout: Layout, item: ?LayoutItem, e: Event) => void = (layout, item, e) => {
    console.log("onDrop================L1",layout)
    const newLayouts = layout.map(l=>{
      
      if(l.i === '-1') {
        l.i = "i"+Math.floor(Math.random()*1000)
      }
      return {...l}
     })
     this.setState({l1Layouts:newLayouts, droppingItem:undefined})
  }

  onL2Drop: (layout: Layout, item: ?LayoutItem, e: Event) => void = (layout, item, e) => {
    console.log("onDrop================L1",layout)
    const newLayouts = layout.map(l=>{
     
      if(l.i === '-1') {
        l.i = "i"+Math.floor(Math.random()*1000)
      }
      return {...l}
     })
     this.setState({l2Layouts:newLayouts, droppingItem:undefined})
  }


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
        <div
          className="droppable-element"
          draggable={true}
          // this is a hack for firefox
          // Firefox requires some kind of initialization
          // which we can do by adding this attribute
          // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
          onDragStart={e =>{e.dataTransfer.setData("text/plain", "");this.setState({droppingItem:{i:'-1',w:4,h:4}})} }
        >
          Droppable Element (Drag me!)
        </div>
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
          isBounded={true}
          isDroppable={true}
          isDraggable={true}
          isResizable={true}
          droppingItem={this.state.droppingItem}
          draggableHandle={'.draggableField'}
          newItemId={"-1"}
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
