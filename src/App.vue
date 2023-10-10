<template>
  <div id="app">
    <SearchBar
      @onSelectDataChange="handleSelectDataChange"
      :configList="configList"
    />
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
            value: "order1",
          },
          {
            label: "任务令2",
            value: "order2",
          },
        ],
        show: true,
      },
      {
        fieldKey: "class",
        fieldName: "班次",
        comType: "radio",
        selectList: [
          {
            label: "白班",
            value: "白班",
          },
          {
            label: "夜班",
            value: "夜班",
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

    function handleSelectDataChange(val) {
      console.log(val);
    }
    return {
      configList,
      handleSelectDataChange,
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
