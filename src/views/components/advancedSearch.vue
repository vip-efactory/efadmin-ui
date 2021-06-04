<!--高级搜索组件-->
<template>
  <el-dialog v-dialogDrag :title="modalObj.title" :visible.sync="showAdSearchDialog" width="1000px" center :before-close="modalClose">
    <el-form :model="item">
      <el-row>
        <el-col :span="16">
          <el-form-item :label="$t('advanceSearch.globalTypeLabel')" :label-width="formLabelWidth">
            <template>
              <el-radio-group v-model="globalType">
                <el-radio :label="0" :title="$t('advanceSearch.globalTypeTitle0')">{{ $t('advanceSearch.typeSingle') }}
                </el-radio>
                <el-radio :label="1" :title="$t('advanceSearch.globalTypeTitle1')">{{ $t('advanceSearch.typeMulti') }}
                </el-radio>
                <el-radio :label="2" :title="$t('advanceSearch.globalTypeTitle2')">{{ $t('advanceSearch.typeGroup') }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-link href="https://docs.efactory.vip:1443/ejpa/adsearchQD.html" target="_blank"><b> -- ? -- </b></el-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!--  单个条件查询需要显示的字段开始 -->
          <el-form-item :label="$t('advanceSearch.nameLabel')" :label-width="formLabelWidth">
            <el-select v-model="item.name" :title="$t('advanceSearch.nameTitle')" style="width: 190px;" filterable @change="currentSelect">
              <el-option v-for="field in adSearchFields" :key="field.fieldName" :label="field.labelName" :value="field.fieldName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('advanceSearch.searchTypeLabel')" :label-width="formLabelWidth">
            <el-select v-model="item.searchType" :title="$t('advanceSearch.searchTypeTitle')" style="width: 190px;">
              <!-- 规则二: 字典模糊查询是没有意义 -->
              <el-option v-if="currentFieldType !== 'dict'" label="≈≈≈" :value="0" :title="$t('advanceSearch.searchTypeTitle0')" />
              <el-option label="=" :value="1" :title="$t('advanceSearch.searchTypeTitle1')" />
              <!-- 规则一: 范围查询只能针对数字和日期类型,针对文本和字典是没有意义的 -->
              <el-option v-if="currentFieldType !== 'dict' && currentFieldType !== 'text'" label="a ≤ x ≤ b" :value="2" :title="$t('advanceSearch.searchTypeTitle2')" />
              <el-option label="!=" :value="3" :title="$t('advanceSearch.searchTypeTitle3')" />
              <el-option v-if="currentFieldType !== 'dict' && currentFieldType !== 'text'" label=" < " :value="4" :title="$t('advanceSearch.searchTypeTitle4')" />
              <el-option v-if="currentFieldType !== 'dict' && currentFieldType !== 'text'" label=" <= " :value="5" :title="$t('advanceSearch.searchTypeTitle5')" />
              <el-option v-if="currentFieldType !== 'dict' && currentFieldType !== 'text'" label=" > " :value="6" :title="$t('advanceSearch.searchTypeTitle6')" />
              <el-option v-if="currentFieldType !== 'dict' && currentFieldType !== 'text'" label=" >= " :value="7" :title="$t('advanceSearch.searchTypeTitle7')" />
              <el-option label="IS NULL" :value="8" :title="$t('advanceSearch.searchTypeTitle8')" />
              <el-option label="NOT NULL" :value="9" :title="$t('advanceSearch.searchTypeTitle9')" />
              <el-option v-if="currentFieldType !== 'dict'" label="≈==" :value="10" :title="$t('advanceSearch.searchTypeTitle10')" />
              <el-option v-if="currentFieldType !== 'dict'" label="==≈" :value="11" :title="$t('advanceSearch.searchTypeTitle11')" />
              <!-- 规则三: 字典类型值只能手选(因为值用户通常是不知道),支持in查询是没有意义的 -->
              <el-option v-if="currentFieldType !== 'dict'" label="∈" :value="12" :title="$t('advanceSearch.searchTypeTitle12')" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 多个条件查询额外需要显示的字段 -->
          <el-form-item v-show="globalType !== 0" :label="$t('advanceSearch.orderLabel')" :label-width="formLabelWidth">
            <el-input
              v-model.number="item.order"
              type="Number"
              width="120px"
              :title="$t('advanceSearch.orderTitle')"
              style="width: 190px;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 处理不同类型值的输入 text和number类型值 -->
        <el-col :span="8">
          <!-- 类型为12(in查询时),一直显示,手动进行输入 -->
          <el-form-item
            v-if="item.searchType === 12"
            :label="$t('advanceSearch.valLabel')"
            :label-width="formLabelWidth"
          >
            <el-input v-model="item.val" type="text" :title="$t('advanceSearch.val1Title')" style="width: 190px;" />
          </el-form-item>
          <!-- 类型为8和9是不需要值的,仅当text和number的时候才显示 -->
          <el-form-item
            v-else-if="item.searchType !== 8 && item.searchType !== 9 && (currentFieldType === 'text' || currentFieldType === 'number') "
            :label="$t('advanceSearch.valLabel')"
            :label-width="formLabelWidth"
          >
            <el-input v-model="item.val" :type="currentFieldType" :title="$t('advanceSearch.val1Title')" style="width: 190px;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 类型为8和9是不需要值的 -->
          <el-form-item
            v-if="item.searchType === 2 && (currentFieldType === 'text' || currentFieldType === 'number')"
            :label="$t('advanceSearch.val2Label')"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="item.val2"
              :type="currentFieldType"
              :title="$t('advanceSearch.val2Title')"
              style="width: 190px;"
            />
          </el-form-item>
        </el-col>
        <!--   日期类型选择     -->
        <el-col v-if="item.searchType !== 8 && item.searchType !== 9 && item.searchType !== 12 && item.searchType !== 2 && currentFieldType ==='date'" :span="8">
          <el-form-item :label="$t('advanceSearch.valLabel')" :label-width="formLabelWidth">
            <el-date-picker
              v-model="item.val"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="$t('advanceSearch.selectDate')"
              style="width: 190px;"
            />
          </el-form-item>
        </el-col>
        <!--   日期时间类型选择     -->
        <el-col v-if="item.searchType !== 8 && item.searchType !== 9 && item.searchType !== 12 && item.searchType !== 2 && currentFieldType ==='datetime'" :span="8">
          <el-form-item :label="$t('advanceSearch.valLabel')" :label-width="formLabelWidth">
            <el-date-picker
              v-model="item.val"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :placeholder="$t('advanceSearch.selectDate')"
              style="width: 190px;"
            />
          </el-form-item>
        </el-col>
        <!--   日期类型区间筛选     -->
        <el-col v-if="item.searchType !== 8 && item.searchType !== 9 && item.searchType !== 12 &&item.searchType ===2 && (currentFieldType ==='date' || currentFieldType ==='datetime')" :span="20">
          <el-form-item :label="$t('advanceSearch.valLabel')" :label-width="formLabelWidth">
            <el-date-picker
              v-model="item.val"
              type="daterange"
              align="right"
              unlink-panels
              :range-separator="$t('advanceSearch.to')"
              :start-placeholder="$t('advanceSearch.startDate')"
              :end-placeholder="$t('advanceSearch.endDate')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions"
              style="width: 508px;"
            />
          </el-form-item>
        </el-col>
        <!--   字典下拉选择     -->
        <el-col v-if="item.searchType !== 8 && item.searchType !== 9 && item.searchType !== 12 && currentFieldType ==='dict'" :span="20">
          <el-form-item :label="$t('advanceSearch.valLabel')" :label-width="formLabelWidth">
            <el-select v-model="item.val" filterable :placeholder="$t('advanceSearch.pleaseSelect')" style="width: 190px;">
              <el-option
                v-for="(d, index) in dicts"
                :key="d.label + index"
                :label="d.label"
                :value="d.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 多个条件查询额外需要显示的字段 -->
          <el-form-item
            v-show="globalType != 0"
            :label="$t('advanceSearch.logicalTypeLabel')"
            :label-width="formLabelWidth"
          >
            <el-select v-model="item.logicalType" :title="$t('advanceSearch.logicalTypeTitle')">
              <el-option :label="$t('advanceSearch.andLabel')" :value="1" :title="$t('advanceSearch.andTitle')" />
              <el-option :label="$t('advanceSearch.orLabel')" :value="0" :title="$t('advanceSearch.orTitle')" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 单个条件查询需要显示的字段结束 -->
      <el-row>
        <!-- 分组条件查询额外需要显示的字段开始 -->
        <el-col :span="8">
          <el-form-item
            v-show="globalType == 2"
            :label="$t('advanceSearch.bracketsGroupLabel')"
            :label-width="formLabelWidth"
          >
            <el-select v-model="item.bracketsGroup" :title="$t('advanceSearch.bracketsGroupTitle')">
              <el-option
                :label="$t('advanceSearch.GroupItemDefault')"
                value="DEFAULT_NO_GROUP"
                :title="$t('advanceSearch.defaultGroupTitle')"
              />
              <el-option
                :label="$t('advanceSearch.GroupItemOther')"
                value="OTHER_GROUP"
                :title="$t('advanceSearch.otherGroupTitle')"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            v-show="globalType == 2"
            :label="$t('advanceSearch.logicalTypeGroupLabel')"
            :label-width="formLabelWidth"
          >
            <el-select v-model="item.logicalTypeGroup" :title="$t('advanceSearch.logicalTypeGroupTitle')">
              <el-option :label="$t('advanceSearch.andLabel')" :value="1" :title="$t('advanceSearch.andTitle')" />
              <el-option :label="$t('advanceSearch.orLabel')" :value="0" :title="$t('advanceSearch.orTitle')" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 分组条件查询额外需要显示的字段结束 -->
        <el-col>
          <el-col :span="8">
            <el-form-item label=" " :label-width="formLabelWidth">
              <el-button size="mini" type="primary" @click="handleItemAdd(item)">{{ $t('advanceSearch.btnAddItem') }}</el-button>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>

    <!-- 显示已经加入进来的查询条件 -->
    <el-table
      :data="conditions.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
      height="300"
    >
      <el-table-column :label="$t('advanceSearch.nameLabel')" prop="name" fixed width="120" />
      <el-table-column :label="$t('advanceSearch.searchTypeLabel')" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.searchType == 0">{{ '≈≈≈' }}</span>
          <span v-else-if="scope.row.searchType == 1">{{ ' = ' }}</span>
          <span v-else-if="scope.row.searchType == 2">{{ ' a ≤ x ≤ b ' }}</span>
          <span v-else-if="scope.row.searchType == 3">{{ ' != ' }}</span>
          <span v-else-if="scope.row.searchType == 4">{{ ' &lt; ' }}</span>
          <span v-else-if="scope.row.searchType == 5">{{ ' &le; ' }}</span>
          <span v-else-if="scope.row.searchType == 6">{{ ' > ' }}</span>
          <span v-else-if="scope.row.searchType == 7">{{ ' >= ' }}</span>
          <span v-else-if="scope.row.searchType == 8">{{ 'IS NULL' }}</span>
          <span v-else-if="scope.row.searchType == 9">{{ 'NOT NULL' }}</span>
          <span v-else-if="scope.row.searchType == 10">{{ '≈==' }}</span>
          <span v-else-if="scope.row.searchType == 11">{{ '==≈' }}</span>
          <span v-else-if="scope.row.searchType == 12">{{ ' ∈ ' }}</span>
          <span v-else>{{ '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('advanceSearch.valLabel')" prop="val" width="140" />
      <el-table-column :label="$t('advanceSearch.val2Label')" prop="val2" width="140" />
      <el-table-column :label="$t('advanceSearch.orderLabel')" prop="order" width="80" />
      <el-table-column :label="$t('advanceSearch.logicalTypeLabel')" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.logicalType == 0">{{ $t('advanceSearch.orLabel') }}</span>
          <span v-else>{{ $t('advanceSearch.andLabel') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('advanceSearch.bracketsGroupLabel')" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.bracketsGroup == 'DEFAULT_NO_GROUP'">{{ $t('advanceSearch.GroupItemDefault') }}</span>
          <span v-else>{{ $t('advanceSearch.GroupItemOther') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('advanceSearch.logicalTypeGroupLabel')" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.logicalTypeGroup == 0">{{ $t('advanceSearch.orLabel') }}</span>
          <span v-else>{{ $t('advanceSearch.andLabel') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="right" fixed="right" width="120">
        <template slot="header">
          <el-input v-model="search" size="mini" :placeholder="$t('advanceSearch.tbSearchPlaceholder')" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleItemDelete(scope.$index, scope.row)">X</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button @click="showAdSearchDialog = false">{{ $t('advanceSearch.btnCancel') }}</el-button>
      <el-button type="danger" @click="handleItemsClear()">{{ $t('advanceSearch.btnReset') }}</el-button>
      <el-button type="primary" @click="handleSearch()">{{ $t('advanceSearch.btnSearch') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import i18n from '../../lang'

export default {
  name: 'Modal',
  props: {
    modalObj: Object
  },
  data() {
    return {
      adSearchFields: this.$parent.crud.adSearchFields,
      globalType: 0, // 全局类型，0 单个条件;1 多条件; 2 分组
      // 每个条件拥有的属性,详见：https://github.com/vip-efactory/ejpa-example/blob/master/docs/%E5%85%B3%E4%BA%8E%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD.md
      item: {
        name: '',
        searchType: 0,
        val: '',
        val2: '',
        order: 0,
        logicalType: 0,
        bracketsGroup: 'DEFAULT_NO_GROUP',
        logicalTypeGroup: 0
      },
      formLabelWidth: '125px',
      search: '', // 条件表里的条件搜索
      conditions: [], // 存放生成的条件集合
      currentFieldType: 'text', // 当前选中的条件的数据类型,支持text,number,date,dict
      dicts: [], // 存放当前条件的字典类型的字典项
      // 时间范围的默认选择项
      pickerOptions: {
        shortcuts: [{
          text: i18n.t('advanceSearch.recentWeek'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: i18n.t('advanceSearch.recentMonth'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: i18n.t('advanceSearch.recent3Month'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    tableHeight() {
      return document.body.clientHeight - 200
    },
    showAdSearchDialog: { // 控制高级搜索框的显示和隐藏 参考https://blog.csdn.net/qq_34119437/article/details/85319066
      get: function() {
        return this.$parent.crud.showAdSearchDialog
      },
      set: function() {
        this.$parent.crud.showAdSearchDialog = false
      }
    }
  },
  // 这个地方需要监听showAdSearchDialog的变化,如果showAdSearchDialog发生变化后,触发父组件对showAdSearchDialog的更新
  watch: {
    showAdSearchDialog: function(val) {
      this.$emit('update:showAdSearchDialog', val)
    }
  },
  methods: {
    // 关闭高级搜索框
    modalClose() {
      this.showAdSearchDialog = false
    },
    // 对要加入列表的数据进行有效性检查
    handleItemChk(item) {
      // 条件名称不允许为空
      if (item.name === '') {
        this.$message(i18n.t('advanceSearch.nameChk'), 'warning')
        return false
      }
      // 不是非空查询的时候，不允许值为空
      if (item.searchType !== 8 && item.searchType !== 9 && item.val === '') {
        this.$message(i18n.t('advanceSearch.valueEmptyChk'), 'warning')
        return false
      }
      // 如果是范围查询
      if (item.searchType === 2) {
        // 如果是时间范围,因为时间选择值在一个字段里,所以分别取值赋值为开始和结束的值
        if (this.currentFieldType === 'date') {
          const value = item.val
          item.val = value[0]
          item.val2 = value[1]
        }
        if (item.val2 === '') {
          this.$message(i18n.t('advanceSearch.endValueEmptyChk'), 'warning')
          return false
        }
      }

      // 检查是否为单条件查询
      if (this.globalType === 0 && this.conditions.length > 0) {
        this.$message(i18n.t('advanceSearch.singleItemChk'), 'warning')
        return false
      }

      return true // 检查通过！
    },
    // 将条件加入到列表里
    handleItemAdd(item) {
      // 加入列表前检查是否合法
      if (this.handleItemChk(item)) {
        this.conditions.push(item) // 将条件push到数组的最后面
        // 然后重置初始化条件
        this.item = {
          name: '',
          searchType: 0,
          val: '',
          val2: '',
          order: 0,
          logicalType: 0,
          bracketsGroup: 'DEFAULT_NO_GROUP',
          logicalTypeGroup: 0
        }
      }
    },
    // 条件列表里的条件删除
    handleItemDelete(index, row) {
      this.conditions.splice(index, 1) // 删除指定索引的对象
    },
    // 清除所有的查询条件
    handleItemsClear() {
      this.conditions = [] // 清除当前对话框里的查询条件
      const crud = this.$parent.crud
      crud.adSearchConditions = [] // 清空crud里面的保存的高级查询条件！
    },
    // 执行搜索
    handleSearch() {
      const crud = this.$parent.crud
      // 将处理后的条件数据，赋予父组件的crud.adSearchConditions属性
      crud.adSearchConditions = this.conditions
      crud.toQuery() // 触发查询请求
      // 关闭对话框
      this.modalClose()
    },
    // 当前选择的条件类型,以便使用不同的组件方便用户进行输入
    currentSelect(val) {
      this.adSearchFields.filter((item) => {
        if (item.fieldName === val) {
          // 支持外部不传入类型,不传入默认为text类型
          if (item.type !== undefined) {
            this.currentFieldType = item.type
          } else {
            this.currentFieldType = 'text'
          }
          if (item.type === 'dict') { // 字典类型的处理
            this.item.searchType = 1
            this.dicts = item.dicts
          }
          this.item.val = ''
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
