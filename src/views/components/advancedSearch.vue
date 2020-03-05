<!--高级搜索组件-->
<template>
  <el-dialog :title="modalObj.title" :visible.sync="modalShow" width="1000px" center :before-close="modalClose">
    <el-form :model="item">
      <el-row>
        <el-col span="20">
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
            <!--        <el-input v-model="form.name" autocomplete="off"></el-input>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="8">
          <!--  单个条件查询需要显示的字段开始 -->
          <el-form-item :label="$t('advanceSearch.nameLabel')" :label-width="formLabelWidth">
            <el-select v-model="item.name" :title="$t('advanceSearch.nameTitle')" style="width: 190px;">
              <el-option label="备注" value="remark" />
              <el-option label="创建时间" value="createTime" />
              <el-option label="更新时间" value="updateTime" />
              <el-option label="创建人" value="creatorNum" />
              <el-option label="更新人" value="updaterNum" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item :label="$t('advanceSearch.searchTypeLabel')" :label-width="formLabelWidth">
            <el-select v-model="item.searchType" :title="$t('advanceSearch.searchTypeTitle')" style="width: 190px;">
              <el-option label="≈≈≈" value="0" :title="$t('advanceSearch.searchTypeTitle0')" />
              <el-option label="=" value="1" :title="$t('advanceSearch.searchTypeTitle1')" />
              <el-option label="a < x < b" value="2" :title="$t('advanceSearch.searchTypeTitle2')" />
              <el-option label="!=" value="3" :title="$t('advanceSearch.searchTypeTitle3')" />
              <el-option label="<" value="4" :title="$t('advanceSearch.searchTypeTitle4')" />
              <el-option label="<=" value="5" :title="$t('advanceSearch.searchTypeTitle5')" />
              <el-option label=">" value="6" :title="$t('advanceSearch.searchTypeTitle6')" />
              <el-option label=">=" value="7" :title="$t('advanceSearch.searchTypeTitle7')" />
              <el-option label="IS NULL" value="8" :title="$t('advanceSearch.searchTypeTitle8')" />
              <el-option label="NOT NULL" value="9" :title="$t('advanceSearch.searchTypeTitle9')" />
              <el-option label="≈==" value="10" :title="$t('advanceSearch.searchTypeTitle10')" />
              <el-option label="==≈" value="11" :title="$t('advanceSearch.searchTypeTitle11')" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <!-- 多个条件查询额外需要显示的字段 -->
          <el-form-item v-show="globalType != 0" :label="$t('advanceSearch.orderLabel')" :label-width="formLabelWidth">
            <el-input v-model.number="item.order" width="120px" :title="$t('advanceSearch.orderTitle')"
                      style="width: 190px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="8">
          <!-- 类型为8和9是不需要值的 -->
          <el-form-item v-show="item.searchType != 8 && item.searchType != 9" :label="$t('advanceSearch.valLabel')"
                        :label-width="formLabelWidth">
            <el-input v-model="item.val" :title="$t('advanceSearch.val1Title')" style="width: 190px;" />
            <!--            <el-input v-show="item.searchType == 2" v-model="item.val2" :title="$t('advanceSearch.val2Title')" style="width: 190px;" />-->
          </el-form-item>
        </el-col>
        <el-col span="8">
          <!-- 类型为8和9是不需要值的 -->
          <el-form-item v-show="item.searchType == 2" :label="$t('advanceSearch.val2Label')"
                        :label-width="formLabelWidth">
            <el-input v-show="item.searchType == 2" v-model="item.val2" :title="$t('advanceSearch.val2Title')"
                      style="width: 190px;" />
          </el-form-item>
        </el-col>
        <el-col span="8">
          <!-- 多个条件查询额外需要显示的字段 -->
          <el-form-item v-show="globalType != 0" :label="$t('advanceSearch.logicalTypeLabel')"
                        :label-width="formLabelWidth">
            <el-select v-model="item.logicalType" :title="$t('advanceSearch.logicalTypeTitle')">
              <el-option :label="$t('advanceSearch.andLabel')" value="1" :title="$t('advanceSearch.andTitle')" />
              <el-option :label="$t('advanceSearch.orLabel')" value="0" :title="$t('advanceSearch.orTitle')" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 单个条件查询需要显示的字段结束 -->
      <el-row>
        <!-- 分组条件查询额外需要显示的字段开始 -->
        <el-col span="8">
          <el-form-item v-show="globalType == 2" :label="$t('advanceSearch.bracketsGroupLabel')"
                        :label-width="formLabelWidth">
            <el-select v-model="item.bracketsGroup" :title="$t('advanceSearch.bracketsGroupTitle')">
              <el-option :label="$t('advanceSearch.GroupItemDefault')" value="DEFAULT_NO_GROUP"
                         :title="$t('advanceSearch.defaultGroupTitle')" />
              <el-option :label="$t('advanceSearch.GroupItemOther')" value="OTHER_GROUP"
                         :title="$t('advanceSearch.otherGroupTitle')" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item v-show="globalType == 2" :label="$t('advanceSearch.logicalTypeGroupLabel')"
                        :label-width="formLabelWidth">
            <el-select v-model="item.logicalTypeGroup" :title="$t('advanceSearch.logicalTypeGroupTitle')">
              <el-option :label="$t('advanceSearch.andLabel')" value="1" :title="$t('advanceSearch.andTitle')" />
              <el-option :label="$t('advanceSearch.orLabel')" value="0" :title="$t('advanceSearch.orTitle')" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 分组条件查询额外需要显示的字段结束 -->
        <el-col>
          <el-col span="8">
            <el-form-item label=" " :label-width="formLabelWidth">
              <el-button size="mini" type="primary" @click="handleItemAdd(item)">加入条件区</el-button>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>

    <!-- 显示已经加入进来的查询条件 -->
    <el-table
      :data="conditions.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%" height="300"
    >
      <el-table-column label="条件名称" prop="name" fixed width="120" />
      <el-table-column label="查询方式" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.searchType == 0">{{ '≈≈≈' }}</span>
          <span v-else-if="scope.row.searchType == 1">{{ '=' }}</span>
          <span v-else-if="scope.row.searchType == 2">{{ 'a < x < b' }}</span>
          <span v-else-if="scope.row.searchType == 3">{{ '!=' }}</span>
          <span v-else-if="scope.row.searchType == 4">{{ '<' }}</span>
          <span v-else-if="scope.row.searchType == 5">{{ '<=' }}</span>
          <span v-else-if="scope.row.searchType == 6">{{ '>' }}</span>
          <span v-else-if="scope.row.searchType == 7">{{ '>=' }}</span>
          <span v-else-if="scope.row.searchType == 8">{{ 'IS NULL' }}</span>
          <span v-else-if="scope.row.searchType == 9">{{ 'NOT NULL' }}</span>
          <span v-else-if="scope.row.searchType == 10">{{ '≈==' }}</span>
          <span v-else-if="scope.row.searchType == 11">{{ '==≈' }}</span>
          <span v-else>{{ '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值" prop="val" width="120" />
      <el-table-column label="结束值" prop="val2" width="120" />
      <el-table-column v-if="globalType != 0" label="参数顺序" prop="order" width="80" />
      <el-table-column v-if="globalType != 0" label="满足状况" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.logicalType == 0">{{ $t('advanceSearch.orLabel') }}</span>
          <span v-else>{{ $t('advanceSearch.andLabel') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="globalType == 2" label="所属组" prop="bracketsGroup" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.bracketsGroup == 'DEFAULT_NO_GROUP'">{{ $t('advanceSearch.GroupItemDefault') }}</span>
          <span v-else>{{ $t('advanceSearch.GroupItemOther') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="globalType == 2" label="组关系" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.logicalTypeGroup == 0">{{ $t('advanceSearch.orLabel') }}</span>
          <span v-else>{{ $t('advanceSearch.andLabel') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="right" width="120">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleItemDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button @click="modalShow = false">{{ $t('advanceSearch.btnCancel') }}</el-button>
      <el-button type="danger" @click="handleItemsClear()">{{ $t('advanceSearch.btnReset') }}</el-button>
      <el-button type="primary" @click="modalShow = false">{{ $t('advanceSearch.btnSearch') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    modalObj: Object,
    modalShow: Boolean
  },
  data() {
    return {
      inputVal: '',
      dataList: {},
      queryParam: {currentPage: 1, pageSize: 20},
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      globalType: 0, // 全局类型，0 单个条件;1 多条件; 2 分组
      // 每个条件拥有的属性,详见：https://github.com/vip-efactory/ejpa-example/blob/master/docs/%E5%85%B3%E4%BA%8E%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD.md
      item: {
        name: '',
        searchType: '0',
        val: '',
        val2: '',
        order: 0,
        logicalType: '0',
        bracketsGroup: 'DEFAULT_NO_GROUP',
        logicalTypeGroup: '0'
      },
      formLabelWidth: '125px',
      search: '', // 条件表里的条件搜索
      conditions: [
        {
          name: 'remark',
          searchType: '0',
          val: '测试',
          val2: '',
          order: 0,
          logicalType: '0',
          bracketsGroup: 'DEFAULT_NO_GROUP',
          logicalTypeGroup: '0'
        }
      ] // 存放生成的条件集合
    }
  },
  computed: {
    tableHeight() {
      return document.body.clientHeight - 200
    }
  },
  // 这个地方需要监听modalShow的变化,如果modalShow发生变化后,触发父组件对modal-show的更新
  watch: {
    modalShow: function (val) {
      this.$emit('update:modalShow', val)
    }
  },
  methods: {
    modalClose() {
      this.modalShow = false
    },
    getData() {
      const that = this
      that.queryParam[that.modalObj.condition] = that.inputVal
      that.$http.post(Global.baseUrl + that.modalObj.url, that.queryParam).then(function (resp) {
        that.dataList = resp.data
      }).catch(function (e) {
        console.log(e)
      })
    },

    // 对要加入列表的数据进行有效性检查
    handleItemChk(item) {
      // 条件名称不允许为空
      if (item.name == '') {
        this.$message('条件名称不允许为空！', 'warning');
        return false;
      }
      // 不是非空查询的时候，不允许值为空
      if (item.searchType != 8 && item.searchType != 9 && item.val == '') {
        this.$message('请输入查询参数值!', 'warning');
        return false;
      }
      // 如果是范围查询，开始值不能比结束值小！！
      if (item.searchType == 2) {
        if (item.val2 == '') {
          this.$message('区间查询时结束值不允许为空!', 'warning');
          return false;
        } else if (item.val > item.val2) {
          this.$message('开始值不应比结束值大！', 'warning');
          return false;
        }
      }

      // 检查是否为单条件查询
      if (this.globalType == 0 && this.conditions.length > 0) {
        this.$message('单条件查询不允许加入多个条件!', 'warning');
        return false;
      }

      return true; // 检查通过！
    },
    // 将条件加入到列表里
    handleItemAdd(item) {
      // 加入列表前检查是否合法
      if (this.handleItemChk(item)) {
        this.conditions.push(item)    //将条件push到数组的最后面

        // 然后重置初始化条件
        this.item = {
          name: '',
          searchType: '0',
          val: '',
          val2: '',
          order: 0,
          logicalType: '0',
          bracketsGroup: 'DEFAULT_NO_GROUP',
          logicalTypeGroup: '0'
        }
      }
    },
    // 条件列表里的条件删除
    handleItemDelete(index, row) {
      this.conditions.splice(index, 1)    //删除指定索引的对象
    },
    // 清除所有的查询条件
    handleItemsClear() {
      this.conditions = []
    }
  }
}
</script>

<style scoped>

</style>
