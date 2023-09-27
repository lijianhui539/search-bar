<template>
  <div class="waiting-list">
    <template v-if="deepFieldList.length">
      <div
        class="waiting-list_item"
        v-for="item in deepFieldList"
        :key="item.fieldKey"
        @click="handleFieldClick(item)"
      >
        {{ item.fieldName }}
      </div>
    </template>
  </div>
</template>

<script>
/**
 * @file 添加筛选 - 待选字段列表
 */

// utils
import { ref, watch } from "@vue/composition-api";
import { cloneDeep } from "lodash";

export default {
  name: "WaitingList",
  props: {
    fieldList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const deepFieldList = ref([]);

    watch(
      () => props.fieldList,
      (newVal) => {
        deepFieldList.value = cloneDeep(newVal).filter((item) => !item.show);
      },
      {
        immediate: true,
      }
    );

    function handleFieldClick(item) {
      emit("onFieldClick", item);
    }

    return {
      deepFieldList,
      handleFieldClick,
    };
  },
};
</script>

<style lang="scss" scoped>
$custom-blue: #3f51b5;
.waiting-list {
  width: 100%;
  max-height: 200px;
  overflow-y: scroll;

  &_item {
    display: block;
    min-height: 20px;
    line-height: 20px;
    padding: 8px 12px;
    cursor: pointer;

    &:hover {
      background: #f2f2f3;
    }
  }

  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #ccc;
  }
}
</style>