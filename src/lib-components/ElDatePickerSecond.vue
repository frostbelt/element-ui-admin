<script>
export default {
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
  props : {
    value : {
      default : "",
    },
    type : {
      default : "datetime",
    },
    placeholder : {
      default : "选择时间",
    },
  },
  data () {
    return {
      fixedValue : "",
    };
  },
  methods : {
    update () {
      if(!this.value){
        this.fixedValue = "";
        return;
      }
      this.fixedValue = this.value * 1000;
    },

    onChange () {
      // v-model
      this.$emit('input', Math.floor(this.fixedValue / 1000));
      this.$emit('change', Math.floor(this.fixedValue / 1000));
    },

    // 不手动设置时，默认为 1970 年?
    onFocus () {
      if(!this.fixedValue){
        this.fixedValue = new Date().getTime();
      }
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