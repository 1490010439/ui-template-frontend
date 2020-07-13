<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="名称" />
      </el-form-item>
      <el-form-item label="等级" prop="roleGrade">
        <el-input v-model="dataForm.roleGrade" placeholder="等级" />
      </el-form-item>
      <el-form-item label="类型" prop="roleType">
        <el-input v-model="dataForm.roleType" placeholder="类型" />
      </el-form-item>
      <el-form-item label="信息" prop="roleInfo">
        <el-input v-model="dataForm.roleInfo" placeholder="信息" />
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-checkbox-group v-model="dataForm.menuIds">
          <el-checkbox v-for="menu in menus" :key="menu.menuId" :label="menu.menuId">{{ menu.menuName }}</el-checkbox>
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
    getMenus
  } from '@/api/menu'
  import {
    getRoleInfo,
    addOrUpdate
  } from '@/api/role'
  export default {
    data() {
      return {
        visible: false,
        menus: [],
        dataForm: {
          id: 0,
          roleId: '',
          roleName: '',
          roleInfo: '',
          roleType: '',
          roleGrade: '',
          roleNumber: '',
          roleDeletetype: '',
          roleFoundtime: '',
          menuIds: []
        },
        dataRule: {
          roleName: [{
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
        getMenus().then(data => {
          this.menus = data.body.menus
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            getRoleInfo(this.dataForm.id).then(data => {
              this.dataForm.roleId = data.body.roleId
              this.dataForm.roleName = data.body.roleName
              this.dataForm.roleInfo = data.body.roleInfo
              this.dataForm.roleType = data.body.roleType
              this.dataForm.roleGrade = data.body.roleGrade
              this.dataForm.roleNumber = data.body.roleNumber || ""
              this.dataForm.roleDeletetype = data.body.roleDeletetype || ""
              this.dataForm.roleFoundtime = data.body.roleFoundtime || ""
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
              'roleId': this.dataForm.roleId || undefined,
              'roleName': this.dataForm.roleName,
              'roleType': this.dataForm.roleType,
              'roleInfo': this.dataForm.roleInfo,
              'roleGrade': this.dataForm.roleGrade,
              'roleNumber': this.dataForm.roleNumber || "",
              'roleDeletetype': this.dataForm.roleDeletetype || "",
              'roleFoundtime': this.dataForm.roleFoundtime || ""
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
