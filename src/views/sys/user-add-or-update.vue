<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号" />
      </el-form-item>
      <el-form-item label="密码" prop="userPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.userPassword" type="password" placeholder="请输入8-16位密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码" />
      </el-form-item>
      <el-form-item label="邮箱" prop="userMail">
        <el-input v-model="dataForm.userMail" placeholder="邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="userPhone">
        <el-input v-model="dataForm.userPhone" placeholder="手机号" />
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIds">
        <el-checkbox-group v-model="dataForm.roleIds">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
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
import { isEmail, isMobile } from '@/utils/validate'
import { getRoles } from '@/api/role'
import { getInfoById, addOrUpdate } from '@/api/user'
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (this.notNullJudge(value)) {
        if (this.lengthNotAvalidenabled(value)) {
          callback(new Error('请输入8-16位的密码'))
        } else if (this.regexSprit1(value)) {
          callback(new Error('密码种类应该超过三种'))
        } else if (this.notThreeEuqChar(value)) {
          callback(new Error('密码不能同时存在三个相同字符'))
        } else if (!this.noNumCharThree(value)) {
          callback(new Error('密码中不能存在三个连续数字 ，字母，特殊字符'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.userPassword !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      dataForm: {
        id: 0,
        userName: '',
        userPassword: '',
        comfirmPassword: '',
        userMail: '',
        userPhone: '',
        roleIds: [],
        userType: 1,
        userDeletetype: ''
      },
      dataRule: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        userPassword: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        userMail: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    lengthNotAvalidenabled(newPassword) {
      if (this.notNullJudge(newPassword)) {
        if (newPassword.length < 8 || newPassword.length > 16) {
          return true
        } else {
          return false
        }
      }
    },
    notNullJudge(newPassword) {
      if (this.dataForm.id && !/\S/.test(newPassword)) {
        return false
      } else {
        return true
      }
    },
    noNumCharThree(newPassword) {
      var inputString = '1234567890abcdefghijklmopqrstuvwxyz!@#$%^&*()'
      for (var i = 0; i < newPassword.length - 3; i++) {
        var sprintString = newPassword.substring(i, i + 3)

        if (inputString.indexOf(sprintString.toLowerCase()) >= 0) {
          return false
        }
      }
      return true
    },
    notThreeEuqChar(newPassword) {
      var input = /(\w).{0,}\1.{0,}\1/
      if (!input.test(newPassword)) {
        return false
      } else {
        return true
      }
    },
    regexSprit1(newPassword) {
      // eslint-disable-next-line
        var reg = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[=\\\\~!@#$%^&*()\-+|\\[{\\]}:;\"',\<.\>?/_-])[\\\\0-9a-zA-Z ~!@#$%^&*()\-_=+|\\[{\\]\}:;\"',\<.\>?/]{8,16}"
      var regExp = new RegExp(reg)
      if (regExp.test(newPassword)) {
        return false
      } else {
        return true
      }
    },
    init(id) {
      this.dataForm.id = id || 0
      getRoles().then(data => {
        this.roleList = data.body
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (this.dataForm.id) {
          getInfoById(this.dataForm.id).then(data => {
            this.dataForm.userName = data.body.userName
            this.dataForm.userMail = data.body.userMail
            this.dataForm.userPhone = data.body.userPhone
            this.dataForm.roleIds = data.body.roleIds || []
            this.dataForm.userType = data.body.userType
            this.dataForm.userDeletetype = data.body.userDeletetype
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addOrUpdate(this.dataForm.id, {
            'userId': this.dataForm.id || undefined,
            'userName': this.dataForm.userName,
            'userPassword': this.dataForm.userPassword,
            'userMail': this.dataForm.userMail,
            'userPhone': this.dataForm.userPhone,
            'userType': this.dataForm.userType,
            'roleIds': this.dataForm.roleIds,
            'userDeletetype': this.dataForm.userDeletetype
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
