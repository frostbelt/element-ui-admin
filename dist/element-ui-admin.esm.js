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
    // props 变化
    update() {
      if (!this.value) {
        this.fixedValue = [];
        return;
      }

      this.fixedValue = this.value.split(",");
    },

    // 选择时间
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
    this.init(); // debug
    // window.ElCheckboxString = this;
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

const __vue_scope_id__ = "data-v-4ad362f6";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ElCheckboxString: __vue_component__
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
export { __vue_component__ as ElCheckboxString };
