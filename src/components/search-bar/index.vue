<template>
  <div class="search-bar">
    <SearchBarInner
      v-bind="$attrs"
      :searchBarIemList="searchBarIemList"
      :configList="deepConfigList"
    />
    <div class="search-bar_add">
      <el-popover
        placement="bottom"
        trigger="click"
        v-model="showSelectField"
        :disabled="selectFieldDisabled"
      >
        <WaitingList
          :fieldList="deepConfigList"
          @onFieldClick="handleFieldClick"
        />
        <div class="search-bar_add-text" slot="reference">
          <div v-if="!selectFieldDisabled">
            <el-button
              class="search-operation"
              type="primary"
              icon="el-icon-plus"
              >添加筛选</el-button
            >
          </div>
          <div v-else>
            <el-button class="search-operation" type="info"
              >无可选字段</el-button
            >
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
/**
 * @file 搜索栏
 */

// utils
import { ref, watch, provide } from "@vue/composition-api";
import { cloneDeep } from "lodash";

// components
import WaitingList from "@/components/search-bar/components/waiting-list.vue";
import SearchBarInner from "@/components/search-bar/components/search-bar-inner.vue";

export default {
  name: "SearchBar",
  props: {
    configList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    SearchBarInner,
    WaitingList,
  },
  setup(props, { emit }) {
    const deepConfigList = ref([]);
    const searchBarIemList = ref([]);
    const showSelectField = ref(false);
    const selectFieldDisabled = ref(false);

    const parentComMethod = {
      removeFieldItem: removeFieldItem,
      handleSelectDataChange: handleSelectDataChange,
    };
    provide("parentComMethod", parentComMethod);

    watch(
      () => props.configList,
      (newVal) => {
        deepConfigList.value = cloneDeep(newVal);
        getShowItem(deepConfigList.value);
      },
      {
        immediate: true,
        deep: true,
      }
    );

    /**
     * 待选列表点击事件
     */
    function handleFieldClick(val) {
      let targetIndex = 0;
      deepConfigList.value = deepConfigList.value.map((item, index) => {
        if (item.fieldKey === val.fieldKey) {
          targetIndex = index;
          item.show = true;
        }
        return item;
      });

      // 选中字段放到最后
      deepConfigList.value.push(deepConfigList.value.splice(targetIndex, 1)[0]);

      getShowItem(deepConfigList.value);
      showSelectField.value = false;

      // 所有字段勾选完 禁用
      let isAllShow = deepConfigList.value.every((item) => item.show);
      if (isAllShow) {
        selectFieldDisabled.value = true;
      }
    }

    /**
     * 获取需要显示的字段
     */
    function getShowItem(data) {
      searchBarIemList.value = data.filter((item) => item.show);
    }

    /**
     * 移除某个字段
     */
    function removeFieldItem(val) {
      // 当所有字段选择完禁用选择字段 并且移除某个字段后 取消禁用
      if (selectFieldDisabled.value) {
        selectFieldDisabled.value = false;
      }
      deepConfigList.value.forEach((item) => {
        if (item.fieldKey === val.fieldKey) {
          item.show = false;
        }
      });
      getShowItem(deepConfigList.value);
    }

    /**
     * 子组件值变化emit业务方
     */
    function handleSelectDataChange(val) {
      emit("onSelectDataChange", val);
    }

    return {
      searchBarIemList,
      deepConfigList,
      selectFieldDisabled,
      showSelectField,
      handleFieldClick,
    };
  },
};
</script>

<style lang="scss" scoped>
$custom-blue: #3f51b5;
.search-bar {
  width: 100%;
  display: flex;

  &_add {
    margin-bottom: 10px;
    min-height: 32px;
    line-height: 32px;
    cursor: pointer;

    .search-operation {
      padding-top: 0;
      padding-bottom: 0;
      height: 36px;
      line-height: 36px;
    }

    &:hover {
      color: $custom-blue;
    }
  }
}
</style>