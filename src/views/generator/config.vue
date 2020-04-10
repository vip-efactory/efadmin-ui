<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-col style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">{{ $t('genConfig.tblFieldConfig') }}：{{ tableName }}</span>
            <el-button
              :loading="genLoading"
              icon="el-icon-s-promotion"
              size="mini"
              style="float: right; padding: 6px 9px;"
              type="success"
              @click="toGen"
            >{{ $t('genConfig.saveAndGenerate') }}</el-button>
            <el-button
              :loading="columnLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px;margin-right: 9px"
              type="primary"
              @click="saveColumnConfig"
            >{{ $t('crud.save') }}</el-button>
            <el-tooltip class="item" effect="dark" :content="$t('codegen.syncTips')" placement="top-start">
              <el-button
                :loading="syncLoading"
                icon="el-icon-refresh"
                size="mini"
                style="float: right; padding: 6px 9px;"
                type="info"
                @click="sync"
              >{{ $t('codegen.synchronizeBtn') }}</el-button>
            </el-tooltip>
          </div>
          <el-form size="small" label-width="90px">
            <el-table v-loading="loading" :data="data" :max-height="tableHeight" size="small" style="width: 100%;margin-bottom: 15px">
              <el-table-column prop="columnName" :label="$t('genConfig.fieldName')" />
              <el-table-column prop="columnType" :label="$t('genConfig.fieldType')" />
              <el-table-column prop="remark" :label="$t('genConfig.fieldDescription')">
                <template slot-scope="scope">
                  <el-input v-model="data[scope.$index].remark" size="mini" class="edit-input" />
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('genConfig.isRequired')" width="80px">
                <template slot-scope="scope">
                  <el-checkbox v-model="data[scope.$index].notNull" />
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('genConfig.inList')" width="70px">
                <template slot-scope="scope">
                  <el-checkbox v-model="data[scope.$index].listShow" />
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('genConfig.inForm')" width="70px">
                <template slot-scope="scope">
                  <el-checkbox v-model="data[scope.$index].formShow" />
                </template>
              </el-table-column>
              <el-table-column :label="$t('genConfig.inputType')">
                <template slot-scope="scope">
                  <el-select v-model="data[scope.$index].formType" filterable class="edit-input" clearable size="mini" :placeholder="$t('genConfig.selectPlaceholder')">
                    <el-option
                      :label="$t('genConfig.formInput')"
                      value="Input"
                    />
                    <el-option
                      :label="$t('genConfig.formTextarea')"
                      value="Textarea"
                    />
                    <el-option
                      :label="$t('genConfig.formRadio')"
                      value="Radio"
                    />
                    <el-option
                      :label="$t('genConfig.formSelect')"
                      value="Select"
                    />
                    <el-option
                      :label="$t('genConfig.formDate')"
                      value="Date"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('genConfig.queryType')">
                <template slot-scope="scope">
                  <el-select v-model="data[scope.$index].queryType" filterable class="edit-input" clearable size="mini" :placeholder="$t('genConfig.selectPlaceholder')">
                    <el-option
                      label="="
                      value="="
                    />
                    <el-option
                      label="!="
                      value="!="
                    />
                    <el-option
                      label=">="
                      value=">="
                    />
                    <el-option
                      label="<="
                      value="<="
                    />
                    <el-option
                      label="Like"
                      value="Like"
                    />
                    <el-option
                      label="NotNull"
                      value="NotNull"
                    />
                    <el-option
                      label="BetWeen"
                      value="BetWeen"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('genConfig.dateAnnotation')">
                <template slot-scope="scope">
                  <el-select v-model="data[scope.$index].dateAnnotation" filterable class="edit-input" clearable size="mini" :placeholder="$t('genConfig.selectPlaceholder')">
                    <el-option
                      :label="$t('genConfig.autoCreateTime')"
                      value="CreationTimestamp"
                    />
                    <el-option
                      :label="$t('genConfig.autoUpdateTime')"
                      value="UpdateTimestamp"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('genConfig.linkDict')">
                <template slot-scope="scope">
                  <el-select v-model="data[scope.$index].dictName" filterable class="edit-input" clearable size="mini" :placeholder="$t('genConfig.selectPlaceholder')">
                    <el-option v-for="item in dicts" :key="item.id" :label="item.remark === '' ? item.name : item.remark" :value="item.name" />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-card>
      </el-col>
      <el-col>
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">{{ $t('genConfig.generateConfigure') }}</span>
            <el-button
              :loading="configLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="doSubmit"
            >{{ $t('crud.save') }}</el-button>
          </div>
          <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
            <el-form-item :label="$t('genConfig.author')" prop="author">
              <el-input v-model="form.author" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('genConfig.authorTips') }}</span>
            </el-form-item>
            <el-form-item :label="$t('genConfig.moduleName')" prop="moduleName">
              <el-input v-model="form.moduleName" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('genConfig.moduleNameTips') }}</span>
            </el-form-item>
            <el-form-item :label="$t('genConfig.pack')" prop="pack">
              <el-input v-model="form.pack" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('genConfig.packTips') }}</span>
            </el-form-item>
            <el-form-item :label="$t('genConfig.apiAlias')" prop="apiAlias">
              <el-input v-model="form.apiAlias" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('genConfig.apiAliasTips') }}</span>
            </el-form-item>
            <el-form-item :label="$t('genConfig.path')" prop="path">
              <el-input v-model="form.path" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('genConfig.pathTips') }}</span>
            </el-form-item>
            <!--            <el-form-item label="接口目录">-->
            <!--              <el-input v-model="form.apiPath" style="width: 40%" />-->
            <!--              <span style="color: #C0C0C0;margin-left: 10px;">Api存放路径[src/api]，为空则自动生成路径</span>-->
            <!--            </el-form-item>-->
            <el-form-item :label="$t('genConfig.prefix')" prop="prefix">
              <el-input v-model="form.prefix" :placeholder="$t('genConfig.prefixTips')" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('genConfig.prefixTips') }}</span>
            </el-form-item>
            <el-form-item :label="$t('genConfig.cover')" prop="cover">
              <el-radio-group v-model="form.cover" size="mini" style="width: 40%">
                <el-radio-button label="true">{{ $t('bool.true') }}</el-radio-button>
                <el-radio-button label="false">{{ $t('bool.false') }}</el-radio-button>
              </el-radio-group>
              <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('genConfig.coverTips') }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import { update, get } from '@/api/generator/genConfig'
import { save, sync, generator } from '@/api/generator/generator'
import { getDicts } from '@/api/system/dict'
import i18n from '../../lang'

export default {
  name: 'GeneratorConfig',
  components: {},
  mixins: [crud],
  data() {
    return {
      activeName: 'first', tableName: '', tableHeight: 550, columnLoading: false, configLoading: false, dicts: [], syncLoading: false, genLoading: false,
      form: { id: null, tableName: '', author: '', pack: '', path: '', moduleName: '', cover: 'false', apiPath: '', prefix: '', apiAlias: null },
      rules: {
        author: [
          { required: true, message: i18n.t('genConfig.authorRequired'), trigger: 'blur' }
        ],
        pack: [
          { required: true, message: i18n.t('genConfig.packRequired'), trigger: 'blur' }
        ],
        moduleName: [
          { required: true, message: i18n.t('genConfig.moduleNameRequired'), trigger: 'blur' }
        ],
        path: [
          { required: true, message: i18n.t('genConfig.pathRequired'), trigger: 'blur' }
        ],
        apiAlias: [
          { required: true, message: i18n.t('genConfig.apiAliasRequired'), trigger: 'blur' }
        ],
        cover: [
          { required: true, message: i18n.t('genConfig.coverRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.tableHeight = document.documentElement.clientHeight - 385
    this.tableName = this.$route.params.tableName
    this.$nextTick(() => {
      this.init()
      get(this.tableName).then(r => {
        this.form = r.data
        this.form.cover = this.form.cover.toString()
      })
      getDicts().then(r => {
        this.dicts = r.data
      })
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/generator/columns'
      const tableName = this.tableName
      this.params = { tableName }
      return true
    },
    saveColumnConfig() {
      this.columnLoading = true
      save(this.data).then(res => {
        if (res.code === 0) {
          this.notify(i18n.t('genConfig.saveOK'), 'success')
          this.columnLoading = false
        } else {
          this.columnLoading = false
          crud.notify(res.msg, 'error')
        }
      }).catch(err => {
        this.columnLoading = false
        console.log(err.response.data.message)
      })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.configLoading = true
          update(this.form).then(res => {
            if (res.code === 0) {
              this.notify(i18n.t('genConfig.saveOK'), 'success')
              this.form = res.data
              this.form.cover = this.form.cover.toString()
              this.configLoading = false
            } else {
              this.configLoading = false
              crud.notify(res.msg, 'error')
            }
          }).catch(err => {
            this.configLoading = false
            console.log(err.response.data.message)
          })
        }
      })
    },
    sync() {
      this.syncLoading = true
      sync([this.tableName]).then(r => {
        if (r.code === 0) {
          this.init()
          this.notify(i18n.t('codegen.syncOK'), 'success')
          this.syncLoading = false
        } else {
          this.syncLoading = false
          crud.notify(r.msg, 'error')
        }
      }).then(() => {
        this.syncLoading = false
      })
    },
    toGen() {
      this.genLoading = true
      save(this.data).then(res => {
        if (res.code === 0) {
          this.notify(i18n.t('genConfig.saveOK'), 'success')
          // 生成代码
          generator(this.tableName, 0).then(r => {
            if (r.code === 0) {
              this.genLoading = false
              this.notify(i18n.t('codegen.generateOK'), 'success')
            } else {
              this.genLoading = false
              crud.notify(r.msg, 'error')
            }
          }).catch(err => {
            this.genLoading = false
            console.log(err.response.data.message)
          })
        } else {
          this.genLoading = false
          crud.notify(res.msg, 'error')
        }
      }).catch(err => {
        this.genLoading = false
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .edit-input {
    .el-input__inner {
      border: 1px solid #e5e6e7;
    }
  }
</style>

<style scoped>
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
