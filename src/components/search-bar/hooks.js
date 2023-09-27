/**
 * @file 搜索栏相关方法
 */

// utils
import { ref } from "@vue/composition-api";

/**
 * 过滤字段待选列表中所需展示字段列表
 * @param {Array} sourceData 待选列表
 * @returns {Array} 待选列表中未选择字段
 */
export function filterFieldList(sourceData) {
    return sourceData.filter(item => !item.show);
}