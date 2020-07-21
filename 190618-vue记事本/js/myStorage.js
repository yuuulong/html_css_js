//localStorage的封装，用来在浏览器存数据
;(function () {
  window.ms = {
    set: set,
    get: get,
  };
  function set(key,val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
  function get(key) {
    var json = localStorage.getItem(key);
    if(json) {
      return JSON.parse(json);
    }
  }
  })();

  // ms.set('name', 'wanghuahua');
  // var name = ms.get('name');
  // console.log('name:', name);