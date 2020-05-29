<script>
import Helper from "./helper"

export default {
  name: "el-checkbox-string",
  template : `
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
  props : {
    value : {
      default : "",
    },
    options : {
      default () {
        return [];
      },
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
      let options = Helper.getFixedData(this.options, {
        keys : [this.value_id],
      });

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