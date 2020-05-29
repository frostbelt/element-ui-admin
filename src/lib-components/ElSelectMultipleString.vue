<script>
export default {
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
  },
  data () {
    return {
      fixedValue : [],
    };
  },
  computed : {
    fixedOptions () {
      return this.$helper.getFixedDataList(this.options);
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

    onChange () {
      // v-model
      this.$emit('input', this.fixedValue.join(","));
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