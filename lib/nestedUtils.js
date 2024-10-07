
// 嵌套layout统一类名
export const NESTED_LAYOUT_CLASSNAME = "[nested-react-grid-layout]"

/**
 * 判断是否是顶级布局
 * @param {*} layoutUniqueClassName
 */
export function isTopLayout(
    layoutUniqueClassName:string
  ): Boolean {
    const currentLayoutEle = document.getElementsByClassName(layoutUniqueClassName)?.[0];
    // 还没有渲染时，返回false
    if(!currentLayoutEle) {
        return false
    }
    let parent = currentLayoutEle?.parentElement;
    while(parent) {
     const parentClassName = parent?.className || '';
     if(parentClassName?.indexOf(NESTED_LAYOUT_CLASSNAME) >= 0){
        return false
     }
     parent = parent?.parentElement   
    }
    return true
}

/**
 * 获取当前布局的层级
 * @param {*} layoutUniqueClassName 
 */
export function getCurrentLayoutLevel(layoutUniqueClassName:string):Number {
    const currentLayoutEle = document.getElementsByClassName(layoutUniqueClassName)?.[0];
     // 还没有渲染时，返回-1
     if(!currentLayoutEle) {
        return -1
    }
    let level = 0;
    let parent = currentLayoutEle?.parentElement;
    while(parent) {
        const parentClassName = parent?.className || '';
        if(parentClassName?.indexOf(NESTED_LAYOUT_CLASSNAME) >= 0){
           level++;
        }
        parent = parent?.parentElement;   
       }
    return level;
}





