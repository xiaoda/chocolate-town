import {places} from './data.js';

// 仅用于展示的空间配置，不代表实际街区坐标或尺寸。
export const stageLayout={
 width:36.8,depth:26.6,
 board:[-8.9,10.6],
 // 灯柱移至各店侧边的空隙，不放在橱窗和店门的中轴线上。
 lamps:places.filter(p=>p.width).map(p=>{
  const x=(p.kind==='bear'?1:-1)*(p.width/2+.7),z=({book:2.2,post:2.2,bakery:3})[p.id]||2.6,c=Math.cos(p.rotation),s=Math.sin(p.rotation);
  return [p.position[0]+c*x+s*z,p.position[1]-s*x+c*z];
 }),
 plants:[[-16.2,5],[-16.4,7.7],[15.8,8.7],[6.8,-2.7]],
 route:[[-11,5.4],[-8,.5],[-2,-2.5],[4,-1.2],[9,5.8]],
 overview:[-10.5,26,45],
 aerial:[0,53,8]
};

/** 将立面完整放入未被详情面板覆盖的区域，所有计算均为模型单位。 */
export function focusView(place,{width,height,availableWidth=width,availableHeight=height}){
 const visibleW=Math.max(120,Math.min(width,availableWidth));
 const visibleH=Math.max(120,Math.min(height,availableHeight));
 const buildingHeight=place.height||4.2,buildingWidth=place.width||3.2;
 const tan=Math.tan(36*Math.PI/360);
 const distance=Math.max((buildingHeight+.85)*height/(2*tan*visibleH),(buildingWidth+.9)*height/(2*tan*visibleW))*1.16;
 const target=[0,buildingHeight/2+.15,1.35];
 return {
  target,
  position:[distance*.055,target[1]+distance*.23,target[2]+distance],
  offsetX:(width-visibleW)/2,
  offsetY:(height-visibleH)/2
 };
}
