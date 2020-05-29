## element-ui-admin

### 说明
针对后台开发的 element-ui 扩展组件

### 引入
```
npm install element-ui-admin --save-dev

import ElementUiAdmin from "element-ui-admin"
Vue.use(ElementUiAdmin);
```

### 使用
#### 值为逗号分隔的字符串的 checkbox
```
<el-checkbox-string
  v-model="tags"
  :options="options">
</el-checkbox-string>

data {
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
  ]
}

其它 props:
value_name : "name"
value_id : "id"
min : 0                       // 限制可选数量，见 el-checkbox-group
max : Infinity
```