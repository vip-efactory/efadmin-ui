<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :title="$t('storage.qiniuConfigTitle')" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="120px">
      <el-form-item label="Access Key" prop="accessKey">
        <el-input v-model="form.accessKey" style="width: 95%" :placeholder="$t('storage.accessKeyPlaceholder')" />
      </el-form-item>
      <el-form-item label="Secret Key" prop="secretKey">
        <el-input v-model="form.secretKey" type="password" style="width: 95%;" :placeholder="$t('storage.secretKeyPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('storage.bucket')" prop="bucket">
        <el-input v-model="form.bucket" style="width: 95%;" :placeholder="$t('storage.bucketPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('storage.host')" prop="host" :title="$t('storage.hostPlaceholder')">
        <el-input v-model="form.host" style="width: 95%;" :placeholder="$t('storage.hostPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('storage.zone')" prop="zone" :title="$t('storage.zonePlaceholder')">
        <el-select v-model="form.zone" :placeholder="$t('storage.zonePlaceholder')">
          <el-option
            v-for="item in zones"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('storage.bucketType')" prop="type">
        <el-radio v-model="form.type" label="公开">{{ $t('storage.typePublic') }}</el-radio>
        <el-radio v-model="form.type" label="私有">{{ $t('storage.typePrivate') }}</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="dialog = false">{{ $t('crud.cancel') }}</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">{{ $t('crud.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { get, update } from '@/api/tools/qiniu'
import i18n from '../../../../lang'

export default {
  data() {
    return {
      zones: ['华东', '华北', '华南', '北美', '东南亚'], dialog: false,
      loading: false, form: { accessKey: '', secretKey: '', bucket: '', host: '', zone: '', type: '' },
      rules: {
        accessKey: [
          { required: true, message: i18n.t('storage.accessKeyRequired'), trigger: 'blur' }
        ],
        secretKey: [
          { required: true, message: i18n.t('storage.secretKeyRequired'), trigger: 'blur' }
        ],
        bucket: [
          { required: true, message: i18n.t('storage.bucketRequired'), trigger: 'blur' }
        ],
        host: [
          { required: true, message: i18n.t('storage.hostRequired'), trigger: 'blur' }
        ],
        type: [
          { required: true, message: i18n.t('storage.bucketTypeRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init() {
      get().then(res => {
        if (res.code === 0) {
          this.form = res.data
        }
      })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          update(this.form).then(res => {
            if (res.code === 0) {
              this.$notify({
                title: i18n.t('crud.editSuccess'),
                type: 'success',
                duration: 2500
              })
              this.$parent.crud.toQuery()
              this.loading = false
              this.dialog = false
            }
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
