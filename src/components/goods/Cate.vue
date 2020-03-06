<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索按钮区域-->
      <el-card>
        <el-row>
          <el-col>
            <el-button type="primary">添加分类</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!--分类列表区域-->
      <el-card>
        <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border >
          <!--是否有效的模板-->
          <template slot="isOk" slot-scope="scope">
            <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
            <i class="el-icon-error" style="color: red" v-else></i>
          </template>
          <!--排序的模板-->
          <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
            <el-tag type="warning" v-else size="mini">三级</el-tag>
          </template>
          <!--操作模板-->
          <template slot="opt" slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" @click="showEditDialog(scope.row.id)" icon="el-icon-edit" size="mini">编辑</el-button>
            <!--删除按钮-->
            <el-button type="danger" @click="removeCateById(scope.row)" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </tree-table>
        <!--分页插件区域-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表 默认为空
      cateList: [],
      total: 0,
      // 为table 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败!')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showEditDialog (id) {
      return undefined
    },
    removeCateById () {
      return null
    }
  }
}
</script>

<style lang="less" scoped>

</style>
