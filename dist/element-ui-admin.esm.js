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
      } else if (typeof v2 == "undefined") {
        temp[k] = this.copyObj(v1);
      } else {
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
   * 将 data 只有所有符合 options 规则的 int 值转为 string
   * @param {Object} data 
   * @param {Object} options 
   * @example
   *    Helper.getFixedData([
   *      {
   *        id : 1,
   *        name : "教程",
   *        list : [
   *          {
   *            id : 12,
   *            name : "数学",
   *          },
   *        ],
   *      },
   *      {
   *        id : 2,
   *        name : "影视",
   *      },
   *    ], {
   *      keys : ["id"],          // 所有 id, int -> string
   *    })
   * 
   *    Helper.getFixedData({
   *      permisson : [1, 2, 3],
   *    }, {
   *      lists : ["permisson"],  // 所有 permisson，intArray -> stringArray
   *    })
   */
  getFixedData(data, options) {
    if (!options) {
      return data;
    }

    data = this.copyObj(data);

    if (Array.isArray(data)) {
      return data.map(item => {
        return this.getFixedData(item, options);
      });
    }

    if (typeof data != "object") {
      return data;
    }

    Object.keys(data).forEach(key => {
      let value = data[key];

      if ((options.keys || []).includes(key) && typeof value == "number") {
        data[key] = String(value);
      } else if ((options.lists || []).includes(key) && Array.isArray(value)) {
        data[key] = value.map(item => {
          if (typeof item == "number") {
            return String(item);
          }

          return item;
        });
      } else if (typeof value == "object") {
        data[key] = this.getFixedData(value, options);
      }
    });
    return data;
  }

}; // debug

window.ElementUiAdminHelper = Helper;

var script = {
  name: "el-checkbox-string",
  template: `
  <el-checkbox-group
    v-model="fixedValue"
    :min="min"
    :max="max"
    @change="onChange">
    <el-checkbox 
      v-for="(item_option, index_option) in fixedOptions" 
      :key="index_option"
      :label="item_option[value_id]">
      {{item_option[value_name]}}
    </el-checkbox>
  </el-checkbox-group>
  `,
  props: {
    value: {
      default: ""
    },
    options: {
      default() {
        return [];
      }

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

  data() {
    return {
      fixedValue: []
    };
  },

  computed: {
    fixedOptions() {
      let options = Helper.getFixedData(this.options, {
        keys: [this.value_id]
      });
      return options;
    }

  },
  methods: {
    update() {
      if (!this.value) {
        this.fixedValue = [];
        return;
      }

      this.fixedValue = this.value.split(",");
    },

    onChange() {
      // v-model
      this.$emit('input', this.fixedValue.join(","));
      this.$emit('change', this.fixedValue.join(","));
    },

    init() {
      this.update();
    }

  },

  mounted() {
    this.init();
  },

  watch: {
    value(value) {
      this.update();
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

/* script */
const __vue_script__ = script;
/* template */

/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = "data-v-0067d74e";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

var script$1 = {
  name: "el-select-multiple-string",
  template: `
  <el-select 
    v-model="fixedValue"
    multiple
    :placeholder="placeholder"
    @change="onChange">
    <el-option 
      v-for="(item_option, index_option) in fixedOptions" 
      :key="index_option"
      :label="item_option[value_name]"
      :value="item_option[value_id]">
    </el-option>
  </el-select>
  `,
  props: {
    value: {
      default: ""
    },
    options: {
      default() {
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
    }
  },

  data() {
    return {
      fixedValue: []
    };
  },

  computed: {
    fixedOptions() {
      return Helper.getFixedData(this.options, {
        keys: [this.value_id]
      });
    }

  },
  methods: {
    update() {
      if (!this.value) {
        this.fixedValue = [];
        return;
      }

      this.fixedValue = this.value.split(",");
    },

    onChange() {
      // v-model
      this.$emit('input', this.fixedValue.join(","));
      this.$emit('change', this.fixedValue.join(","));
    },

    init() {
      this.update();
    }

  },

  mounted() {
    this.init();
  },

  watch: {
    value(value) {
      this.update();
    }

  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */

/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = "data-v-228f94d9";
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var script$2 = {
  name: "el-date-picker-second",
  template: `
  <el-date-picker
    v-model="fixedValue"
    value-format="timestamp"
    :type="type"
    :placeholder="placeholder"
    @change="onChange"
    @focus="onFocus">
  </el-date-picker>
  `,
  props: {
    value: {
      default: ""
    },
    type: {
      default: "datetime"
    },
    placeholder: {
      default: "选择时间"
    }
  },

  data() {
    return {
      fixedValue: ""
    };
  },

  methods: {
    update() {
      if (!this.value) {
        this.fixedValue = "";
        return;
      }

      this.fixedValue = this.value * 1000;
    },

    onChange() {
      // v-model
      this.$emit('input', Math.floor(this.fixedValue / 1000));
      this.$emit('change', Math.floor(this.fixedValue / 1000));
    },

    // 不手动设置时，默认为 1970 年?
    onFocus() {
      if (!this.fixedValue) {
        this.fixedValue = new Date().getTime();
      }
    },

    init() {
      this.update();
    }

  },

  mounted() {
    this.init();
  },

  watch: {
    value(value) {
      this.update();
    }

  }
};

/* script */
const __vue_script__$2 = script$2;
/* template */

/* style */

const __vue_inject_styles__$2 = undefined;
/* scoped */

const __vue_scope_id__$2 = "data-v-11812d8a";
/* module identifier */

const __vue_module_identifier__$2 = undefined;
/* functional template */

const __vue_is_functional_template__$2 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$2 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

var script$3 = {
  name: "el-textarea-comma",
  template: `
  <el-input
    v-model="fixedValue"
    :rows="rows"
    :resize="resize"
    @change="onChange"
    @blur="onBlur"
    type="textarea">
  </el-input>
  `,
  props: {
    value: {
      default: ""
    },
    rows: {
      default: 3
    },
    resize: {
      default: "none"
    },
    disabled: {
      default: false
    },
    distinct: {
      // blur 时是否排重
      default: false
    },
    filteempty: {
      // blur 时是否过滤掉空行
      default: true
    },
    sep: {
      default: ","
    }
  },

  data() {
    return {
      fixedValue: ""
    };
  },

  methods: {
    update() {
      this.fixedValue = (this.value || "").split(this.sep).join("\n");
    },

    onChange() {
      let value = this.fixedValue.split("\n").join(this.sep);
      this.$emit('input', value);
      this.$emit('change', value);
    },

    onBlur() {
      if (this.filteempty) {
        this.fixedValue = this.fixedValue.split("\n").filter(_ => _).join("\n");
      }

      if (this.distinct) {
        let temp = {};
        this.fixedValue.split("\n").forEach(line => {
          temp[line] = true;
        });
        this.fixedValue = Object.keys(temp).join("\n");
      }

      this.onChange();
    },

    init() {
      this.update();
    }

  },

  mounted() {
    this.init();
  },

  watch: {
    value(value) {
      this.update();
    }

  }
};

/* script */
const __vue_script__$3 = script$3;
/* template */

/* style */

const __vue_inject_styles__$3 = undefined;
/* scoped */

const __vue_scope_id__$3 = "data-v-2717d5ce";
/* module identifier */

const __vue_module_identifier__$3 = undefined;
/* functional template */

const __vue_is_functional_template__$3 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$3 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ElCheckboxString: __vue_component__,
  ElSelectMultipleString: __vue_component__$1,
  ElDatePickerSecond: __vue_component__$2,
  ElTextareaComma: __vue_component__$3
});

// Import vue components

const install = function installElementUiAdmin(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(component.name, component);
  });
}; // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install on non-es builds, when vue is found

export default plugin;
export { __vue_component__ as ElCheckboxString, __vue_component__$2 as ElDatePickerSecond, __vue_component__$1 as ElSelectMultipleString, __vue_component__$3 as ElTextareaComma };
