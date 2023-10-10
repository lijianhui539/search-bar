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
        <el-select
          v-model="selectData[item.fieldKey]"
          :multiple="item.comType === 'select'"
          collapse-tags
          :placeholder="'请选择' + item.fieldName"
          @change="(val) => onSelectChange(val, item)"
        >
          <el-option
            v-for="item in item.selectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <div slot="reference" class="field-item">
          <div class="field-item_title">{{ item.fieldName }}：</div>
          <div class="field-item_content">
            <div
              class="content-select"
              v-if="['select', 'radio'].includes(item.comType)"
            >
              <div
                class="select-tag"
                v-for="fieldNameItem in renderCnNameData[item.fieldKey]"
                :key="fieldNameItem.value"
              >
                <div class="select-tag_value">
                  {{ fieldNameItem.label }}
                </div>
                <div class="select-tag_operation">
                  <i
                    class="el-icon-close"
                    @click.stop="onFieldRemove(item, fieldNameItem)"
                  />
                </div>
              </div>
            </div>

            <div class="content-inner" v-else-if="item.comType === 'input'">
              <el-input
                v-model.trim="selectData[item.fieldKey]"
                size="mini"
                @change="handleItemDataChange"
              ></el-input>
            </div>

            <div class="content-inner" v-else-if="item.comType === 'date'">
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
      const arrayComType = ["select", "date"];
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

    function onFieldRemove(fieldDataItem, removeItem) {
      renderCnNameData.value[fieldDataItem.fieldKey] = renderCnNameData.value[
        fieldDataItem.fieldKey
      ].filter((item) => item.value !== removeItem.value);
      if (fieldDataItem.comType === "radio") {
        selectData.value[fieldDataItem.fieldKey] = "";
        return;
      }
      selectData.value[fieldDataItem.fieldKey] = selectData.value[
        fieldDataItem.fieldKey
      ].filter((item) => item !== removeItem.value);
    }

    /**
     * 下拉框选择事件
     */
    function onSelectChange(selection, fieldItem) {
      // 置空已选回显项
      set(renderCnNameData.value, fieldItem.fieldKey, []);

      // 下拉数据源
      let sourceData = fieldItem.selectList;

      // 单选下拉
      if (fieldItem.comType === "radio") {
        let currentData = sourceData.find(
          (sourceItem) => sourceItem.value === selection
        );
        renderCnNameData.value[fieldItem.fieldKey].push(currentData);
        return;
      }

      // 获取label设置回显
      selection.forEach((item) => {
        let currentData = sourceData.find(
          (sourceItem) => sourceItem.value === item
        );
        renderCnNameData.value[fieldItem.fieldKey].push(currentData);
      });
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
      onSelectChange,
      onFieldRemove,
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
  flex-wrap: wrap;
  margin-right: 15px;

  .search-bar_item {
    margin-bottom: 10px;
    margin-right: 10px;
    cursor: pointer;

    .field-item {
      &_content {
        .content-select {
          display: flex;
          padding: 0 10px;

          .select-tag {
            display: flex;
            align-items: center;
            margin-right: 5px;
            background: #fff;

            &_operation {
              margin-top: 4px;
              vertical-align: bottom;
            }
          }
        }
      }
    }

    .field-item {
      display: flex;
      align-items: center;
      padding: 2px 20px;
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