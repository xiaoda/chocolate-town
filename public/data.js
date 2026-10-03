export const photos = [
  ['月亮展墙','moon','星点与月亮构成的展墙，和街区的连接位置未知。'],
  ['书虫书店','book','BOOKWORM 的书籍、画框与木质橱窗。'],
  ['饰品店橱窗','ornament','蕾丝帘、银器与绿色座椅。'],
  ['饰品店立面','ornament','深色转角门面与蓝紫色上层灯光。'],
  ['裁缝店','tailor','弧形橱窗里的缝纫机、礼帽与人台。'],
  ['裁缝店近景','tailor','Tailor Made 店牌与复古路灯。'],
  ['面包店','bakery','HYLAEA BAKERY，红色店牌与面包陈列。'],
  ['小镇邮局','post','墨绿色立面、信箱墙与凸出的橱窗。'],
  ['可可餐厅','restaurant','奶油色窗框、可可主题招牌与餐具。'],
  ['暖灯长街','restaurant','同框可见餐厅、邮局与面包店的一部分。'],
  ['红色巴士','bus','BN 101 巴士造景，旁边是公告栏与餐厅。'],
  ['可可品酒屋','wine','品酒屋与相邻的红色橱窗。'],
  ['品酒屋近景','wine','木框门窗、暖光陈列与街灯。'],
  ['转角小巷','tailor','裁缝店、饰品店、玩具店与书店共同入镜。'],
  ['书店街角','book','饰品店与玩具店、书店之间的转角。'],
  ['品酒小巷','wine','品酒屋、红色橱窗与小镇集市指示牌。'],
  ['小镇公告栏','bus','砖墙上的公告栏，巴士照片中可确认其邻接。'],
  ['木质楼梯','stairs','木墙、折返楼梯与灯带；与街区连接未知。'],
  ['楼梯全景','stairs','同一楼梯的另一机位。']
].map(([title,place,caption],i)=>({id:i+1,src:`./photos/${String(i+1).padStart(2,'0')}.jpg`,title,place,caption,sourceIndex:i+41}));

export const places = [
 {id:'tailor',name:'裁缝店',sign:'Tailor Made',photos:[5,6,14],position:[-14.95,0.65],rotation:0.8,width:3.6,height:5.8,color:'#72593f',trim:'#aa895a',kind:'tailor',description:'一扇圆弧橱窗，把缝纫机、礼帽和人台收在暖光里。',evidence:'照片 14 中可见裁缝店旁的饰品店及前方书店街角。'},
 {id:'ornament',name:'饰品店',sign:'ORNAMENT SHOP',photos:[3,4,15,14],position:[-11.7,-4.55],rotation:0.48,width:3.9,height:5.6,color:'#59474e',trim:'#795a4c',kind:'ornament',description:'深木色的转角立面，白色蕾丝窗帘背后是银器与一把绿色椅子。',evidence:'照片 15 确认饰品店与玩具店、书店相对的街角关系；角度与间距为推定。'},
 {id:'toy',name:'玩具店',sign:'TOYS',photos:[14,15,2],position:[-7.28,-7.02],rotation:0.13,width:2.5,height:5.65,color:'#684b4f',trim:'#773736',kind:'toy',description:'书店旁的小小红色橱窗，陈列着圣诞树与玩具。',evidence:'照片 14、15 中可见其与 BOOKWORM 书店直接相邻；完整店名不清晰。'},
 {id:'book',name:'书虫书店',sign:'BOOKWORM',photos:[2,15,14],position:[-2.73,-7.41],rotation:0,width:4.35,height:5.7,color:'#65564f',trim:'#69503e',kind:'book',description:'书脊、相框、摊开的书页。BOOKWORM 是街角最容易辨认的一扇窗。',evidence:'照片 2 记录店面细节，照片 15 记录书店、玩具店与饰品店的同框关系。'},
 {id:'restaurant',name:'可可餐厅',sign:'Cocoa Restaurant',photos:[9,10,11],position:[4.55,-7.41],rotation:0,width:4.5,height:6.2,color:'#a79377',trim:'#d5be88',kind:'restaurant',description:'奶油色凸窗与山花，窗内是带着可可意象的餐具陈列。',evidence:'照片 10 确认从左到右为餐厅、邮局、面包店；与另一街区的连接未完整拍到。'},
 {id:'post',name:'小镇邮局',sign:'POST OFFICE',photos:[8,10],position:[9.685,-6.37],rotation:-0.36,width:2.9,height:5.7,color:'#7f7061',trim:'#244b49',kind:'post',description:'墨绿色门面与白色凸窗。旧信箱、地球仪和电话，留住了另一种通信速度。',evidence:'照片 10 明确邮局位于餐厅与面包店之间。'},
 {id:'bakery',name:'面包店',sign:'HYLAEA BAKERY',photos:[7,10],position:[13.13,-3.25],rotation:-0.7,width:3.6,height:5.4,color:'#a49480',trim:'#983e2a',kind:'bakery',description:'红色招牌下，圆面包与长棍面包排满橱窗。',evidence:'照片 7 为正面细节，照片 10 的右侧可见它与邮局相邻。'},
 {id:'wine',name:'可可品酒屋',sign:'COCOA WINE TASTING',photos:[12,13,16],position:[14.04,2.73],rotation:-1.1,width:4.2,height:5.7,color:'#997d66',trim:'#563c30',kind:'wine',description:'深色木框、成排木桶与暖光。顺着窄巷，能看到红幕布后的熊。',evidence:'照片 12、13、16 确认品酒屋与红色橱窗相邻；其与主街的相对位置为推定。'},
 {id:'bear',name:'红色橱窗',sign:'红色橱窗',photos:[12,13,16],position:[14.8,8.5],rotation:-1.8,width:2.8,height:3.6,color:'#783d35',trim:'#8e302b',kind:'bear',description:'红色帷幕里的一只熊，为这段小巷添上一个小小的舞台。',evidence:'照片 16 可见该橱窗；不据模糊招牌推断完整名称。'},
 {id:'bus',name:'红色巴士',sign:'BN 101',photos:[11,17],position:[-13,8.3],rotation:0.65,kind:'bus',description:'一辆红色双层巴士造景，黄色腰线、复古车头，旁边是贴满记录的公告栏。',evidence:'照片 11 确认巴士、公告栏与餐厅同框。为避免遮挡店铺，展示中将巴士移至左前侧；该位置不是实地定位，车辆也非真实尺寸。'},
 {id:'moon',name:'月亮展墙',photos:[1],kind:'unlocated',description:'一面安静的星月展墙。',evidence:'缺少与街区衔接的照片，暂不放入主模型。'},
 {id:'stairs',name:'木质楼梯',photos:[18,19],kind:'unlocated',description:'木墙包裹的折返楼梯，灯带描出安静的方形轮廓。',evidence:'有两张相近机位照片，但无法确定它与街区的连接位置。'}
];
export const getPhoto = id => photos.find(p=>p.id===id);
export const getPlace = id => places.find(p=>p.id===id);
