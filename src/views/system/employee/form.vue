<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="姓名" >
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="编号" prop="code">
        <el-input v-model="form.code" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="住址" >
        <el-input v-model="form.address" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="头像" >
        <el-input v-model="form.avatar" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="生日" >
        <el-input v-model="form.birthday" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="身份证号" >
        <el-input v-model="form.idNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="状态" >
        <el-input v-model="form.status" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="部门id" >
        <el-input v-model="form.deptId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="职位id" >
        <el-input v-model="form.jobId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="备注" >
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/employee'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        address: '',
        avatar: '',
        birthday: '',
        code: '',
        email: '',
        idNumber: '',
        name: '',
        phone: '',
        status: '',
        deptId: '',
        jobId: '',
        remark: ''
        // createTime: '',
        // creatorNum: '',
        // updateTime: '',
        // updaterNum: ''
      },
      rules: {
        code: [
          { required: true, message: 'please enter', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'please enter', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'please enter', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        address: '',
        avatar: '',
        birthday: '',
        code: '',
        email: '',
        idNumber: '',
        name: '',
        phone: '',
        status: '',
        deptId: '',
        jobId: '',
        remark: '',
        createTime: '',
        creatorNum: '',
        updateTime: '',
        updaterNum: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
