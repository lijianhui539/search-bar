<template>
  <div class="search-bar-inner">
    <div
      class="search-bar_item"
      v-for="item in searchBarIemList"
      :key="item.fieldKey"
    >
      <el-popover
        placement="bottom"
        trigger="click"
        :disabled="popoverDisabled(item)"
      >
        <div slot="reference" class="field-item">
          <div class="field-item_title">{{ item.fieldName }}：</div>
          <div class="field-item_content">
            <div class="content-select" v-if="item.comType === 'select'">
              {{ renderCnNameData[item.fieldKey] }}
            </div>

            <div class="content-select" v-else-if="item.comType === 'input'">
              <el-input
                v-model.trim="selectData[item.fieldKey]"
                size="mini"
                @change="handleItemDataChange"
              ></el-input>
            </div>

            <div class="content-select" v-else-if="item.comType === 'date'">
              <el-date-picker
                v-model="selectData[item.fieldKey]"
                size="mini"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                @change="handleItemDataChange"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="field-item_opr">
            <i
              @click.stop="handleFieldRemove(item)"
              class="el-icon-circle-close delete-icon"
            />
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
/**
 * @file 搜索框字段区域
 */

// utils
import { ref, inject, set, onMounted } from "@vue/composition-api";
// import { cloneDeep } from "lodash";

export default {
  name: "SearchBarItem",
  props: {
    searchBarIemList: {
      type: Array,
      default: () => [],
    },
    configList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const selectData = ref({});
    const renderCnNameData = ref({});
    const { removeFieldItem, handleSelectDataChange } =
      inject("parentComMethod");
    console.log(props.searchBarIemList);

    function handleItemDataChange() {
      handleSelectDataChange(selectData.value);
    }

    function handleFieldRemove(item) {
      const arrayComType = ["input", "date"];
      removeFieldItem(item);
      if (arrayComType.includes(item.comType)) {
        selectData.value[item.fieldKey] = [];
      } else {
        selectData.value[item.fieldKey] = "";
      }
      renderCnNameData.value[item.fieldKey] = "";
      handleSelectDataChange(selectData.value);
    }

    function popoverDisabled(item) {
      const disabledComType = ["input", "date"];
      return disabledComType.includes(item.comType);
    }

    /**
     * 初始化所有字段值
     */
    function initializeSelectData() {
      const arrayComType = ["select", "date"];

      props.configList.forEach((item) => {
        if (arrayComType.includes(item.comType)) {
          set(selectData.value, item.fieldKey, []);
        } else {
          set(selectData.value, item.fieldKey, "");
        }
      });
    }

    onMounted(() => {
      initializeSelectData();
    });

    return {
      popoverDisabled,
      handleFieldRemove,
      handleItemDataChange,
      renderCnNameData,
      selectData,
    };
  },
};
</script>

<style lang="scss" scoped>
$custon-blue: #3f51b5;
.search-bar-inner {
  display: flex;
  margin-right: 15px;

  .search-bar_item {
    cursor: pointer;
    & + .search-bar_item {
      margin-left: 10px;
    }
    .field-item {
      display: flex;
      align-items: center;
      padding: 2px 5px;
      border-radius: 4px;
      min-height: 32px;
      background: #ccc;

      &_opr {
        .delete-icon {
          vertical-align: bottom;
        }
        &:hover {
          .delete-icon {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>