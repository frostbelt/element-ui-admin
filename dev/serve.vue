<script>
import Vue from 'vue';
import { ElementUiAdminSample } from '@/entry';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    ElementUiAdminSample,
  }
});
</script>

<template>
  <div id="app">
    <element-ui-admin-sample />
  </div>
</template>
