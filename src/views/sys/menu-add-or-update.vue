<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="名称" prop="menuName">
        <el-input v-model="dataForm.menuName" placeholder="名称" />
      </el-form-item>
      <el-form-item label="等级" prop="menuGrade">
        <el-input v-model="dataForm.menuGrade" placeholder="等级" />
      </el-form-item>
      <el-form-item label="类型" prop="menuType">
        <el-input v-model="dataForm.menuType" placeholder="类型" />
      </el-form-item>
      <el-form-item label="信息" prop="menuInfo">
        <el-input v-model="dataForm.menuInfo" placeholder="信息" />
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-checkbox-group v-model="dataForm.menuIds">
          <el-checkbox v-for="operation in operations" :key="operation.operationId" :label="operation.operationId">{{ operation.operationName }}</el-checkbox>
        </el-checkbox-group>
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
    getoperations
  } from '@/api/operation'
  import {
    getMenuInfo,
    addOrUpdate
  } from '@/api/menu'
  export default {
    data() {
      return {
        visible: false,
        operations: [],
        dataForm: {
          id: 0,
          menuId: '',
          menuName: '',
          menuInfo: '',
          menuType: '',
          menuGrade: '',
          menuNumber: '',
          menuDeletetype: '',
          menuFoundtime: '',
          menuIds: []
        },
        dataRule: {
          menuName: [{
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
        getoperations().then(data => {
          this.operations = data.body.operations
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            getMenuInfo(this.dataForm.id).then(data => {
              this.dataForm.menuId = data.body.menuId
              this.dataForm.menuName = data.body.menuName
              this.dataForm.menuInfo = data.body.menuInfo
              this.dataForm.menuType = data.body.menuType
              this.dataForm.menuGrade = data.body.menuGrade
              this.dataForm.menuNumber = data.body.menuNumber || ""
              this.dataForm.menuDeletetype = data.body.menuDeletetype || ""
              this.dataForm.menuFoundtime = data.body.menuFoundtime || ""
              this.dataForm.menuIds = data.body.menuIds || ""
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addOrUpdate(this.dataForm.id, {
              'menuId': this.dataForm.menuId || undefined,
              'menuName': this.dataForm.menuName,
              'menuType': this.dataForm.menuType,
              'menuInfo': this.dataForm.menuInfo,
              'menuGrade': this.dataForm.menuGrade,
              'menuNumber': this.dataForm.menuNumber || "",
              'menuDeletetype': this.dataForm.menuDeletetype || "",
              'menuFoundtime': this.dataForm.menuFoundtime || ""
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
