var storage = chrome.storage.local;
function arr_delete( arr, id ){
  if(arr.constructor === Array){
    if (Number.isInteger(id) && id > 0 ) {
      for (var i = arr.length - 1; i >= 0; i--) {
        if(!(Number.isInteger(arr[i].id) && arr[i].id > 0) || arr[i].id == id){
          arr.splice(i, 1);
        }
      }
      for (var i = arr.length - 1; i >= 0; i--) {
        arr[i].id = i + 1;
      }
    }
    return arr;
  }
  else{
    return [];
  }
}

function arr_insert( arr, item ){
  if(!(arr.constructor === Array)){arr = Array();}
  if(typeof item == 'object'){
    item.id = arr.length + 1;
    item_to_insert = item;
  }
  else{
    item_to_insert = {id: (arr.length + 1), item}
  }
  arr.push(item);
  return arr;
}

