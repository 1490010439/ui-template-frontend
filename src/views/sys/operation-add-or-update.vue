<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="名称" prop="operationName">
        <el-input v-model="dataForm.operationName" placeholder="名称" />
      </el-form-item>
      <el-form-item label="等级" prop="operationGrade">
        <el-input v-model="dataForm.operationGrade" placeholder="等级" />
      </el-form-item>
      <el-form-item label="类型" prop="operationType">
        <el-input v-model="dataForm.operationType" placeholder="类型" />
      </el-form-item>
      <el-form-item label="信息" prop="operationInfo">
        <el-input v-model="dataForm.operationInfo" placeholder="信息" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {
    getoperationInfo,
    addOrUpdate
  } from '@/api/operation'
  export default {
    data() {
      return {
        visible: false,
        dataForm: {
          id: 0,
          operationId: '',
          operationName: '',
          operationInfo: '',
          operationType: '',
          operationGrade: '',
          operationNumber: '',
          operationDeletetype: '',
          operationFoundtime: '',
          menuIds: []
        },
        dataRule: {
          operationName: [{
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }]
        },
        tempKey: 6666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0

          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })

          if (this.dataForm.id) {
            getoperationInfo(this.dataForm.id).then(data => {
              console.log(data);
              this.dataForm.operationId = data.body.operationId
              this.dataForm.operationName = data.body.operationName
              this.dataForm.operationInfo = data.body.operationInfo
              this.dataForm.operationType = data.body.operationType
              this.dataForm.operationGrade = data.body.operationGrade
              this.dataForm.operationNumber = data.body.operationNumber || ""
              this.dataForm.operationDeletetype = data.body.operationDeletetype || ""
              this.dataForm.operationFoundtime = data.body.operationFoundtime || ""
            })
          }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addOrUpdate(this.dataForm.id, {
              'operationId': this.dataForm.operationId || undefined,
              'operationName': this.dataForm.operationName,
              'operationType': this.dataForm.operationType,
              'operationInfo': this.dataForm.operationInfo,
              'operationGrade': this.dataForm.operationGrade,
              'operationNumber': this.dataForm.operationNumber || "",
              'operationDeletetype': this.dataForm.operationDeletetype || "",
              'operationFoundtime': this.dataForm.operationFoundtime || ""
            }).then(data => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            })
          }
        })
      }
    }
  }
</script>
