<script>
export default {
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
  props : {
    value : {
      default : "",
    },
    rows : {
      default : 3,
    },
    resize : {
      default : "none",
    },
    disabled : {
      default : false,
    },
    distinct : {            // blur 时是否排重
      default : false,
    },
    filteempty : {          // blur 时是否过滤掉空行
      default : true,
    },
    sep : {
      default : ",",
    },
  },
  data () {
    return {
      fixedValue : "",
    };
  },
  methods : {
    update () {
      this.fixedValue = (this.value || "").split(this.sep).join("\n");
    },

    onChange () {
      let value = this.fixedValue.split("\n").join(this.sep);
      this.$emit('input', value);
      this.$emit('change', value);
    },

    onBlur () {
      if(this.filteempty){
        this.fixedValue = this.fixedValue.split("\n").filter(_ => _).join("\n");
      }
      if(this.distinct){
        let temp = {};
        this.fixedValue.split("\n").forEach(line => {
          temp[line] = true;
        });
        this.fixedValue = Object.keys(temp).join("\n");
      }
      this.onChange();
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