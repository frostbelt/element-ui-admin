<template>
  <div>
    111
  </div>
</template>
<script>
import Helper from "./helper"

export default {
  name: "el-checkbox-string",
  props : {
    value : {
      default : "",
    },
    options : {
      default () {
        return [];
      },
    },
    placeholder : {
      default : "请选择",
    },
    value_name : {
      default : "name",
    },
    value_id : {
      default : "id",
    },
    min : {
      default : 0,
    },
    max : {
      default : Infinity,
    },
  },
  data () {
    return {
      fixedValue : [],
    };
  },
  computed : {
    fixedOptions () {
      let options = Helper.getFixedData(this.options);

      return options;
    },
  },
  methods : {
    // props 变化
    update () {
      if(!this.value){
        this.fixedValue = [];
        return;
      }
      this.fixedValue = this.value.split(",");
    },

    // 选择时间
    onChange () {
      // v-model
      this.$emit('input', this.fixedValue.join(","));
      // @change
      this.$emit('change', this.fixedValue.join(","));
    },

    init () {
      this.update();  
    },
  },
  mounted () {
    this.init();
  },
  watch : {
    value (value) {
      this.update();
    },
  }
}
</script>
<style lang="scss" scoped>
</style>