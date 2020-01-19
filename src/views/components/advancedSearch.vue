<!--高级搜索组件-->
<template>
  <el-dialog :title="modalObj.title" :visible.sync="modalShow" width="60%" center :before-close="modalClose">
    <el-form :model="form">
      <el-form-item label="条件类型" :label-width="formLabelWidth">
        <template>
          <el-radio-group v-model="radio">
            <el-radio :label="0">单个</el-radio>
            <el-radio :label="1">多个</el-radio>
            <el-radio :label="2">分组</el-radio>
          </el-radio-group>
        </template>
<!--        <el-input v-model="form.name" autocomplete="off"></el-input>-->
      </el-form-item>
      <el-form-item label="条件" :label-width="formLabelWidth">
<!--        <el-select v-model="form.region" placeholder="请选择活动区域">-->
<!--          <el-option label="区域一" value="shanghai"></el-option>-->
<!--          <el-option label="区域二" value="beijing"></el-option>-->
<!--        </el-select>-->
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="modalShow = false">取 消</el-button>
      <el-button type="primary" @click="modalShow = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "Modal",
    props: {
      modalObj : Object,
      modalShow : Boolean
    },
    data(){
      return {
        inputVal:'',
        dataList : {},
        queryParam : {currentPage:1,pageSize:20},
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
        formLabelWidth: '120px',
        radio: 0,
      }
    },
    methods:{
      modalClose(){
        this.modalShow = false;
      },
      getData(){
        let that = this;
        that.queryParam[that.modalObj.condition] = that.inputVal;
        that.$http.post(Global.baseUrl+that.modalObj.url,that.queryParam).then(function (resp) {
          that.dataList = resp.data;
        }).catch(function (e){
          console.log(e);
        });
      }
    },
    computed:{
      tableHeight(){
        return document.body.clientHeight - 200;
      }
    },
    //这个地方需要监听modalShow的变化,如果modalShow发生变化后,触发父组件对modal-show的更新
    watch:{
      modalShow : function (val) {
        this.$emit('update:modalShow', val);
      }
    }
  }
</script>

<style scoped>

</style>
