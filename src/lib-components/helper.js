const Helper = {
  /**
   * 深度合并两个对象
   * @param {Object} obj1 
   * @param {Object} obj2 
   * @return {Object}
   */
  mergeObj(obj1, obj2) {
    if (!obj1 && !obj2) {
      return null;
    }
    if (!obj1) {
      return this.copyObj(obj2);
    }
    if (!obj2) {
      return this.copyObj(obj1);
    }

    let temp = {};
    Object.keys(obj1).forEach(k => {
      let v1 = obj1[k];
      let v2 = obj2[k];
      if (typeof v2 == "object" && typeof v2 == "object") {
        temp[k] = this.mergeObj(v1, v2);
      }
      else if (typeof v2 == "undefined") {
        temp[k] = this.copyObj(v1);
      }
      else {
        temp[k] = this.copyObj(v2);
      }
    });
    Object.keys(obj2).forEach(k => {
      if (typeof obj1[k] != "undefined") {
        return;
      }
      temp[k] = this.copyObj(obj2[k]);
    });
    return temp;
  },
  /**
   * 深度拷贝一个对象
   * @param {Object} obj
   * @return {Object} 
   */
  copyObj(obj) {
    if (typeof obj == "undefined") {
      return undefined;
    }
    if (typeof obj != "object") {
      return obj;
    }
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * 将 data 只有所有符合 options 规则的值转为 string
   * @param {Object} data 
   * @param {Object} options 
   * @example
   *    Helper.getFixedData([
   *      {
   *        id : 1,
   *        name : "教程",
   *      },
   *    ], {
   *      keys : ["id"],          // 所有 id, int -> string
   *      lists : ["permisson"],  // 所有 permisson，intArray -> stringArray
   *    })
   */
  getFixedData (data, options) {
    if(!options){
      return data;
    }
    data = this.copyObj(data);

    if(Array.isArray(data)){
      return data.map(item => {
        return this.getFixedData(item, options);
      });
    }

    if(typeof data != "object"){
      return data;
    }

    Object.keys(data).forEach(key => {
      let value = data[key];
      if((options.keys || []).includes(key) && typeof value == "number"){
        data[key] = String(value);
      }
      else if((options.lists || []).includes(key) && Array.isArray(value)){
        data[key] = value.map(item => {
          if(typeof item == "number"){
            return String(item);
          }
          return item;
        });
      }
      else if(typeof value == "object"){
        data[key] = this.getFixedData(value, options);
      }
    });

    return data;
  },
}

// debug
window.ElementUiAdminHelper = Helper;

export default Helper;