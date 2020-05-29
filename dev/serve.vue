<template>
  <div id="app">
    <el-checkbox-string
      v-model="tags"
      :options="options">
    </el-checkbox-string>

    <hr>

    <el-select-multiple-string
      v-model="tags"
      :options="options">
    </el-select-multiple-string>

    <hr>

    <el-textarea-comma
      v-model="tags">
    </el-textarea-comma>

    <hr>

    <el-date-picker-second
      v-model="begin_time">
    </el-date-picker-second>

  </div>
</template>

<script>
import Vue from 'vue'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element)

import ElementUiAdmin from '@/entry';
Vue.use(ElementUiAdmin);

export default Vue.extend({
  name: 'ServeDev',
  data () {
    return {
      tags : "1,2",
      options : [
        {
          id : 1,
          name : "电影",
        },
        {
          id : 2,
          name : "电视剧",
        },
        {
          id : 3,
          name : "综艺",
        },
      ],
      begin_time : 1590724163,
    }
  },
  methods : {
    init () {
      // test
      window.ServeDev = this;
    },
  },
  mounted () {
    this.init();
  }
});
</script>
