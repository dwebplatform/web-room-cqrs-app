export function getRoomOfferTitle(searchRoomAmountVariants:any[], 
  currentSearchRoomAmountVariants:any[]){
  const normilezedItems = [];
  for(let el of searchRoomAmountVariants){
    let finded = currentSearchRoomAmountVariants.find(item=>item.id===el.id);
    if(finded){
      normilezedItems.push(finded.value);
    } else{
      normilezedItems.push(null);
    }
  }
  normilezedItems.push(null);
  let blackList:any[] = [];
  let res = [];
  for(let i=0;i<normilezedItems.length;i++){
    if(blackList.find(el=>el ===i)){
      continue;
    }
   
    if(normilezedItems[i]!==null && normilezedItems[i+1] === null){
        blackList.push(i);
        res.push(searchRoomAmountVariants[i].showValue);
    } else if(normilezedItems[i]!==null && normilezedItems[i+1]!==null && normilezedItems[i+2]===null){
      blackList.push(i);
      blackList.push(i+1);
      
      res.push(`${searchRoomAmountVariants[i].showValue},${searchRoomAmountVariants[i+1].showValue}`);
      
    } else if(normilezedItems[i]!==null && normilezedItems[i+1]!==null && normilezedItems[i+2]!==null){
      // находим тот который равен null
      let startPoint = i;
      let endPoint = normilezedItems.findIndex((el, index)=>{
        return el === null && index>i
      });
      for(let x = startPoint; x<endPoint;x++){
        blackList.push(x);
      }
      res.push(`${searchRoomAmountVariants[startPoint].showValue} - ${searchRoomAmountVariants[endPoint-1].showValue}`);
    }
  }
  let finalString = '';
  finalString = '';
  if(res.length === 0){
    finalString = 'Комнат';
  } 
  if(currentSearchRoomAmountVariants.length === 1 && currentSearchRoomAmountVariants[0].value!==6){
    finalString = currentSearchRoomAmountVariants[0].showValue + ' - комнантую';
  } else if(currentSearchRoomAmountVariants.length === 1 && currentSearchRoomAmountVariants[0].value===6){
    finalString = currentSearchRoomAmountVariants[0].showValue + ' комн.';
  } else if(currentSearchRoomAmountVariants.length>1){
    finalString =  res.join(',') + ' комн.';
  }
  return finalString;
}
