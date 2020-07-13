<template>
  <div class="app-container">
    <el-form :inline="true" :model="dataForm" size="small" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="operationName" placeholder="操作名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getByName()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:operation:delete')" type="danger" :disabled="dataListSelections.length <= 0"
          @click="deleteHandle()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border size="small" style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" />
      <el-table-column type="index" header-align="center" align="center"  label="ID" />
      <el-table-column prop="operationId" header-align="center" align="center" label="操作ID" />
      <el-table-column prop="operationGrade" header-align="center" align="center" label="等级" />
      <el-table-column prop="operationNumber" header-align="center" align="center"  label="编号" />
      <el-table-column prop="operationName" header-align="center" align="center" label="名称" />
      <el-table-column prop="operationType" header-align="center" align="center" label="类型" />
      <el-table-column prop="operationInfo" header-align="center" align="center" label="信息" />
      <el-table-column prop="operationDeletetype" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.operationDeletetype === 'true'" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operationDeletetype" header-align="center" align="center" label="是否删除" />
      <el-table-column prop="operationFoundtime" header-align="center" align="center" :formatter="formatDateTime" width="180"
        label="创建时间" />
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.operationId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.operationId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>
<script>
  import AddOrUpdate from './operation-add-or-update'
  // import { treeDataTranslate } from '@/utils/tree'
  import {
    getoperations,
    deleteoperation,
    selectLikeNamePage
  } from '@/api/operation'
  export default {
    components: {
      AddOrUpdate
    },
    data() {
      return {
        operationName: "",
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
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
        getoperations().then(data => {
          this.dataList = data.body.operations
          this.totalPage = data.body.total
          this.dataListLoading = false
        })
      },
      // 获取数据列表
      getByName() {
        this.dataListLoading = true
        selectLikeNamePage(
          this.operationName
        ).then(data => {
          this.dataList = data.body.operations
          this.totalPage = data.body.total
          this.dataListLoading = false
        })
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
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteoperation(id).then(data => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          })
        }).catch(() => {})
      }
    }
  }
</script>
