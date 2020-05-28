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
   *    Helper.getFixedData({
   *      
   *    })
   */
  getFixedData (data, options) {
    return data;
  },
}

export default Helper;