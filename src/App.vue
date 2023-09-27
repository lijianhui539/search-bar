<template>
  <div id="app">
    <SearchBar :configList="configList" />
  </div>
</template>

<script>
// utils
import { ref } from "@vue/composition-api";

// components
import SearchBar from "@/components/search-bar/index.vue";

export default {
  name: "App",
  components: {
    SearchBar,
  },
  setup() {
    const configList = ref([
      {
        fieldKey: "workOrder",
        fieldName: "任务令",
        comType: "select",
        selectList: [
          {
            label: "任务令1",
            value: "任务令1",
          },
          {
            label: "任务令2",
            value: "任务令2",
          },
        ],
        show: true,
      },
      {
        fieldKey: "status",
        fieldName: "流程状态",
        comType: "select",
        selectList: [
          {
            label: "Open",
            value: "1",
          },
          {
            label: "Tracking",
            value: "2",
          },
          {
            label: "Close",
            value: "3",
          },
        ],
        show: true,
      },
      {
        fieldKey: "createdTime",
        fieldName: "创建时间",
        comType: "date",
        selectList: [],
        show: false,
      },
      {
        fieldKey: "description",
        fieldName: "描述",
        comType: "input",
        selectList: [],
        show: false,
      },
    ]);
    return {
      configList,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
