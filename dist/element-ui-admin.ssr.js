'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var Helper = {
  /**
   * 深度合并两个对象
   * @param {Object} obj1 
   * @param {Object} obj2 
   * @return {Object}
   */
  mergeObj: function mergeObj(obj1, obj2) {
    var _this = this;

    if (!obj1 && !obj2) {
      return null;
    }

    if (!obj1) {
      return this.copyObj(obj2);
    }

    if (!obj2) {
      return this.copyObj(obj1);
    }

    var temp = {};
    Object.keys(obj1).forEach(function (k) {
      var v1 = obj1[k];
      var v2 = obj2[k];

      if (_typeof(v2) == "object" && _typeof(v2) == "object") {
        temp[k] = _this.mergeObj(v1, v2);
      } else if (typeof v2 == "undefined") {
        temp[k] = _this.copyObj(v1);
      } else {
        temp[k] = _this.copyObj(v2);
      }
    });
    Object.keys(obj2).forEach(function (k) {
      if (typeof obj1[k] != "undefined") {
        return;
      }

      temp[k] = _this.copyObj(obj2[k]);
    });
    return temp;
  },

  /**
   * 深度拷贝一个对象
   * @param {Object} obj
   * @return {Object} 
   */
  copyObj: function copyObj(obj) {
    if (typeof obj == "undefined") {
      return undefined;
    }

    if (_typeof(obj) != "object") {
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
  getFixedData: function getFixedData(data, options) {
    var _this2 = this;

    if (!options) {
      return data;
    }

    data = this.copyObj(data);

    if (Array.isArray(data)) {
      return data.map(function (item) {
        return _this2.getFixedData(item, options);
      });
    }

    if (_typeof(data) != "object") {
      return data;
    }

    Object.keys(data).forEach(function (key) {
      var value = data[key];

      if ((options.keys || []).includes(key) && typeof value == "number") {
        data[key] = String(value);
      } else if ((options.lists || []).includes(key) && Array.isArray(value)) {
        data[key] = value.map(function (item) {
          if (typeof item == "number") {
            return String(item);
          }

          return item;
        });
      } else if (_typeof(value) == "object") {
        data[key] = _this2.getFixedData(value, options);
      }
    });
    return data;
  }
};var script = {
  name: "el-checkbox-string",
  template: "\n  <el-checkbox-group\n    v-model=\"fixedValue\"\n    :min=\"min\"\n    :max=\"max\"\n    @change=\"onChange\">\n    <el-checkbox \n      v-for=\"(item_option, index_option) in fixedOptions\" \n      :key=\"index_option\"\n      :label=\"item_option[value_id]\">\n      {{item_option[value_name]}}\n    </el-checkbox>\n  </el-checkbox-group>\n  ",
  props: {
    value: {
      default: ""
    },
    options: {
      default: function _default() {
        return [];
      }
    },
    placeholder: {
      default: "请选择"
    },
    value_name: {
      default: "name"
    },
    value_id: {
      default: "id"
    },
    min: {
      default: 0
    },
    max: {
      default: Infinity
    }
  },
  data: function data() {
    return {
      fixedValue: []
    };
  },
  computed: {
    fixedOptions: function fixedOptions() {
      var options = Helper.getFixedData(this.options, {
        keys: [this.value_id]
      });
      return options;
    }
  },
  methods: {
    // props 变化
    update: function update() {
      if (!this.value) {
        this.fixedValue = [];
        return;
      }

      this.fixedValue = this.value.split(",");
    },
    // 选择时间
    onChange: function onChange() {
      // v-model
      this.$emit('input', this.fixedValue.join(","));
      this.$emit('change', this.fixedValue.join(","));
    },
    init: function init() {
      this.update();
    }
  },
  mounted: function mounted() {
    this.init(); // test

    window.ElCheckboxString = this;
  },
  watch: {
    value: function value(_value) {
      this.update();
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}/* script */
var __vue_script__ = script;
/* template */

/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = "data-v-c57f1336";
/* module identifier */

var __vue_module_identifier__ = "data-v-c57f1336";
/* functional template */

var __vue_is_functional_template__ = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);/* eslint-disable import/prefer-default-export */var components=/*#__PURE__*/Object.freeze({__proto__:null,ElCheckboxString: __vue_component__});var install = function installElementUiAdmin(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        componentName = _ref2[0],
        component = _ref2[1];

    Vue.component(component.name, component);
  });
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Default export is library as a whole, registered via Vue.use()
exports.ElCheckboxString=__vue_component__;exports.default=plugin;