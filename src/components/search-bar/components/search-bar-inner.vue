<template>
  <div class="search-bar-inner">
    <div
      class="search-bar_item"
      v-for="(item, index) in searchBarIemList"
      :key="index"
    >
      <el-popover
        placement="bottom"
        trigger="click"
        :disabled="popoverDisabled(item)"
      >
        <el-select
          v-model="selectData[item.fieldKey]"
          v-if="['select', 'radio'].includes(item.comType)"
          :multiple="item.comType === 'select'"
          collapse-tags
          clearable
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

        <el-cascader
          v-model="selectData[item.fieldKey]"
          v-else-if="item.comType === 'cascader'"
          :ref="item.fieldKey + 'CascaderRef'"
          :options="item.selectList"
          :props="{ expandTrigger: 'hover' }"
          clearable
          @change="(val) => onSelectChange(val, item)"
        ></el-cascader>

        <div slot="reference" class="field-item">
          <div class="field-item_title">{{ item.fieldName }}：</div>
          <div class="field-item_content">
            <div
              class="content-select"
              v-if="['select', 'radio', 'cascader'].includes(item.comType)"
            >
              <div
                class="select-tag"
                v-for="(fieldNameItem, fieldIndex) in renderCnNameData[
                  item.fieldKey
                ]"
                :key="fieldIndex"
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
import { ref, inject, set, onMounted, nextTick } from "@vue/composition-api";
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
    defaultSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { refs }) {
    const selectData = ref({});
    const renderCnNameData = ref({});
    const { removeFieldItem, handleSelectDataChange } =
      inject("parentComMethod");

    /**
     * 设置默认回显项
     */
    function setDefaultData() {
      for (const [key, val] of Object.entries(props.defaultSelection)) {
        selectData.value[key] = val;
        let currentFieldData = props.configList.find(
          (item) => item.fieldKey === key
        );

        // 级联选择器设置回显
        if (currentFieldData.comType === "cascader") {
          nextTick(() => {
            let currentCascaderRef =
              refs?.[currentFieldData.fieldKey + "CascaderRef"]?.[0];

            // 调用组件生成回显中文方法
            currentCascaderRef.computePresentText();
            let valCnName = currentCascaderRef.presentText;
            let cascaderCnNameData = [
              {
                label: valCnName,
                value: val.join("-"),
              },
            ];
            set(
              renderCnNameData.value,
              currentFieldData.fieldKey,
              cascaderCnNameData
            );
          });
        }

        // 单选下拉
        if (currentFieldData.comType === "radio") {
          renderCnNameData.value[currentFieldData.fieldKey] = [];
          let currentData = currentFieldData.selectList.find(
            (sourceItem) => sourceItem.value === val
          );
          renderCnNameData.value[currentFieldData.fieldKey].push(currentData);
          return;
        }

        // 下拉框设置回显
        if (currentFieldData.comType === "select") {
          renderCnNameData.value[currentFieldData.fieldKey] = [];
          val.forEach((item) => {
            let currentData = currentFieldData.selectList.find(
              (sourceItem) => sourceItem.value === item
            );
            renderCnNameData.value[currentFieldData.fieldKey].push(currentData);
          });
        }
      }
    }

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
      } else if (fieldDataItem.comType === "cascader") {
        selectData.value[fieldDataItem.fieldKey] = [];
      } else {
        selectData.value[fieldDataItem.fieldKey] = selectData.value[
          fieldDataItem.fieldKey
        ].filter((item) => item !== removeItem.value);
      }
      handleSelectDataChange(selectData.value);
    }

    /**
     * 通过val获取树对应节点
     */
    function findNodeByValue(tree, value) {
      for (let node of tree) {
        if (node.value === value) {
          return [node];
        }
        if (node.children) {
          const result = findNodeByValue(node.children, value);
          if (result) {
            return [node, ...result];
          }
        }
      }
      return null;
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

      // 级联下拉
      if (fieldItem.comType === "cascader") {
        if (selection.length) {
          nextTick(() => {
            let currentCascaderRef =
              refs?.[fieldItem.fieldKey + "CascaderRef"]?.[0];
            let valCnName = currentCascaderRef.presentText;
            renderCnNameData.value[fieldItem.fieldKey] = [
              {
                label: valCnName,
                value: selection.join("-"),
              },
            ];
          });
          return;
        }
        renderCnNameData.value[fieldItem.fieldKey] = [];
        return;
      }

      // 获取label设置回显
      selection.forEach((item) => {
        let currentData = sourceData.find(
          (sourceItem) => sourceItem.value === item
        );
        renderCnNameData.value[fieldItem.fieldKey].push(currentData);
      });
      console.log(renderCnNameData.value);
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
      // 设置回显项
      setDefaultData();
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
      setDefaultData,
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