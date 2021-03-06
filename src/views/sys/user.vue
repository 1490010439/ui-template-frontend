<template>
  <div class="app-container">
    <el-form :inline="true" :model="dataForm" size="small" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="userName" placeholder="用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getByUserName()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="danger" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      size="mini"
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        label="ID"
      />
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="用户ID"
      />
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名"
      />
      <el-table-column
        prop="userMail"
        header-align="center"
        align="center"
        label="邮箱"
      />
      <el-table-column
        prop="userPhone"
        header-align="center"
        align="center"
        label="手机号"
      />
      <el-table-column
        prop="userType"
        header-align="center"
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.userDeletetype === 'true'" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="userDeletetype"
        header-align="center"
        align="center"
        label="是否被删除"
      />
      <el-table-column
        prop="userUpdatetime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
      />
      <el-table-column

        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import { getUserList, deleteUser, selectUserName } from '@/api/user'
export default {
  name: 'User',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {},
      userName: '',
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      getUserList({
        'pageNum': this.pageIndex,
        'pageSize': this.pageSize,
        'userName': this.userName
      }).then(data => {
        this.dataList = data.body.users
        this.totalPage = data.body.total
        this.dataListLoading = false
      })
    },
    // 获取数据列表
    getByUserName() {
      this.dataListLoading = true
      selectUserName(
        this.userName
      ).then(data => {
        this.dataList = data.body.users
        this.totalPage = data.body.total
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      var userNos = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({
          'userNos': userNos
        }).then(data => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataForm.pageIndex = 1
              this.getDataList()
            }
          })
        })
      }).catch(() => {
      })
    }
  }
}
</script>
