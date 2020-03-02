<!--高级搜索组件-->
<template>
  <el-dialog :title="modalObj.title" :visible.sync="modalShow" width="60%" center :before-close="modalClose">
    <el-form :model="item">
      <el-form-item :label="$t('advanceSearch.globalTypeLabel')" :label-width="formLabelWidth">
        <template>
          <el-radio-group v-model="globalType">
            <el-radio :label="0" :title="$t('advanceSearch.globalTypeTitle0')">{{ $t('advanceSearch.typeSingle') }}</el-radio>
            <el-radio :label="1" :title="$t('advanceSearch.globalTypeTitle1')">{{ $t('advanceSearch.typeMulti') }}</el-radio>
            <el-radio :label="2" :title="$t('advanceSearch.globalTypeTitle2')">{{ $t('advanceSearch.typeGroup') }}</el-radio>
          </el-radio-group>
        </template>
        <!--        <el-input v-model="form.name" autocomplete="off"></el-input>-->
      </el-form-item>
      <!--  单个条件查询需要显示的字段开始 -->
      <el-form-item :label="$t('advanceSearch.nameLabel')" :label-width="formLabelWidth">
        <el-select v-model="item.name" :title="$t('advanceSearch.nameTitle')">
          <el-option label="备注" value="remark"></el-option>
          <el-option label="创建时间" value="createTime"></el-option>
          <el-option label="更新时间" value="updateTime"></el-option>
          <el-option label="创建人" value="creatorNum"></el-option>
          <el-option label="更新人" value="updaterNum"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('advanceSearch.searchTypeLabel')" :label-width="formLabelWidth">
        <el-select v-model="item.searchType" :title="$t('advanceSearch.searchTypeTitle')">
          <el-option label="≈≈≈" value="0" :title="$t('advanceSearch.searchTypeTitle0')"></el-option>
          <el-option label="=" value="1" :title="$t('advanceSearch.searchTypeTitle1')"></el-option>
          <el-option label="a < x < b" value="2" :title="$t('advanceSearch.searchTypeTitle2')"></el-option>
          <el-option label="!=" value="3" :title="$t('advanceSearch.searchTypeTitle3')"></el-option>
          <el-option label="<" value="4" :title="$t('advanceSearch.searchTypeTitle4')"></el-option>
          <el-option label="<=" value="5" :title="$t('advanceSearch.searchTypeTitle5')"></el-option>
          <el-option label=">" value="6" :title="$t('advanceSearch.searchTypeTitle6')"></el-option>
          <el-option label=">=" value="7" :title="$t('advanceSearch.searchTypeTitle7')"></el-option>
          <el-option label="IS NULL" value="8" :title="$t('advanceSearch.searchTypeTitle8')"></el-option>
          <el-option label="NOT NULL" value="9" :title="$t('advanceSearch.searchTypeTitle9')"></el-option>
          <el-option label="≈==" value="10" :title="$t('advanceSearch.searchTypeTitle10')"></el-option>
          <el-option label="==≈" value="11" :title="$t('advanceSearch.searchTypeTitle11')"></el-option>
        </el-select>
      </el-form-item>
      <!-- 类型为8和9是不需要值的 -->
      <el-form-item v-show="item.searchType != 8 && item.searchType != 9" :label="$t('advanceSearch.valLabel')" :label-width="formLabelWidth">
        <el-input v-model="item.val" :title="$t('advanceSearch.val1Title')"></el-input>
        <el-input v-show="item.searchType == 2" v-model="item.val2" :title="$t('advanceSearch.val2Title')"></el-input>
      </el-form-item>
      <!-- 单个条件查询需要显示的字段结束 -->
      <!-- 多个条件查询额外需要显示的字段开始 -->
      <el-form-item v-show="globalType != 0" :label="$t('advanceSearch.orderLabel')" :label-width="formLabelWidth">
        <el-input v-model="item.order" width="120px" :title="$t('advanceSearch.orderTitle')"></el-input>
      </el-form-item>
      <el-form-item v-show="globalType != 0" :label="$t('advanceSearch.logicalTypeLabel')" :label-width="formLabelWidth">
        <el-select v-model="item.logicalType" :title="$t('advanceSearch.logicalTypeTitle')">
          <el-option :label="$t('advanceSearch.andLabel')" value="1" :title="$t('advanceSearch.andTitle')"></el-option>
          <el-option :label="$t('advanceSearch.orLabel')" value="0" :title="$t('advanceSearch.orTitle')"></el-option>
        </el-select>
      </el-form-item>
      <!-- 多个条件查询额外需要显示的字段结束 -->
      <!-- 分组条件查询额外需要显示的字段开始 -->
      <el-form-item v-show="globalType == 2" :label="$t('advanceSearch.bracketsGroupLabel')" :label-width="formLabelWidth">
        <el-select v-model="item.bracketsGroup" :title="$t('advanceSearch.bracketsGroupTitle')">
          <el-option :label="$t('advanceSearch.GroupItemDefault')" value="DEFAULT_NO_GROUP" :title="$t('advanceSearch.defaultGroupTitle')"></el-option>
          <el-option :label="$t('advanceSearch.GroupItemOther')" value="OTHER_GROUP" :title="$t('advanceSearch.otherGroupTitle')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="globalType == 2" :label="$t('advanceSearch.logicalTypeGroupLabel')" :label-width="formLabelWidth">
        <el-select v-model="item.logicalTypeGroup" :title="$t('advanceSearch.logicalTypeGroupTitle')">
          <el-option :label="$t('advanceSearch.andLabel')" value="1" :title="$t('advanceSearch.andTitle')"></el-option>
          <el-option :label="$t('advanceSearch.orLabel')" value="0" :title="$t('advanceSearch.orTitle')"></el-option>
        </el-select>
      </el-form-item>
      <!-- 分组条件查询额外需要显示的字段结束 -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="modalShow = false">{{ $t('advanceSearch.btnCancel') }}</el-button>
      <el-button @click="modalShow = false">{{ $t('advanceSearch.btnReset') }}</el-button>
      <el-button type="primary" @click="modalShow = false">{{ $t('advanceSearch.btnSearch') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "Modal",
  props: {
    modalObj: Object,
    modalShow: Boolean
  },
  data() {
    return {
      inputVal: '',
      dataList: {},
      queryParam: {currentPage: 1, pageSize: 20 },
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
      conditions: [] // 存放生成的条件集合
    }
  },
  methods: {
    modalClose() {
      this.modalShow = false;
    },
    getData() {
      let that = this;
      that.queryParam[that.modalObj.condition] = that.inputVal;
      that.$http.post(Global.baseUrl + that.modalObj.url, that.queryParam).then(function (resp) {
        that.dataList = resp.data;
      }).catch(function (e) {
        console.log(e);
      });
    }
  },
  computed: {
    tableHeight() {
      return document.body.clientHeight - 200;
    }
  },
  //这个地方需要监听modalShow的变化,如果modalShow发生变化后,触发父组件对modal-show的更新
  watch: {
    modalShow: function (val) {
      this.$emit('update:modalShow', val);
    }
  }
}
</script>

<style scoped>

</style>
