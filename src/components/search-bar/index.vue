<template>
  <div class="search-bar">
    <SearchBarItem v-for="item in deepConfigList" :key="item.fieldKey" />
    <div class="search-bar_add">
      <el-popover placement="bottom" trigger="click" v-model="showSelectField">
        <WaitingList
          :fieldList="deepConfigList"
          @onFieldClick="handleFieldClick"
        />
        <div class="search-bar_add-text" slot="reference">
          <i class="el-icon-plus"></i>
          <span>添加筛选</span>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
/**
 * 搜索栏
 */

// utils
import { ref, watch } from "@vue/composition-api";
import { cloneDeep } from "lodash";

// components
import WaitingList from "@/components/search-bar/components/waiting-list.vue";
import SearchBarItem from "@/components/search-bar/components/search-bar-item.vue";

export default {
  name: "SearchBar",
  props: {
    configList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    SearchBarItem,
    WaitingList,
  },
  setup(props) {
    const deepConfigList = ref([]);
    const showSelectField = ref(false);

    watch(
      () => props.configList,
      (newVal) => {
        deepConfigList.value = cloneDeep(newVal);
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
      deepConfigList.value = deepConfigList.value.map((item) => {
        if (item.fieldKey === val.fieldKey) {
          item.show = true;
        }
        return item;
      });
      showSelectField.value = false;
    }

    return {
      deepConfigList,
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
    cursor: pointer;

    &:hover {
      color: $custom-blue;
    }
  }
}
</style>