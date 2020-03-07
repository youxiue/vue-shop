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
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
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

      <!-- 添加分类的对话框-->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" prop="cat_name">
            <!--options 用来指定数据源 -->
            <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
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
      ],
      // 控制添加对话框是否显示
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        // 分类等级
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称!', trigger: 'blur' }
        ]
      },
      // 父级分类的数组
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 次级菜单展开方式
        expandTrigger: 'hover',
        // 可以选择任意一级的节点, 替换旧版属性change-on-select
        checkStrictly: true,
        // 选中项绑定值
        value: 'cat_id',
        // 展示值
        label: 'cat_name',
        // 级联属性
        children: 'children'
      },
      selectedKeys: []
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
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类列表失败!')
      this.parentCateList = res.data
    },
    // 选择项发生变化触发时间
    parentCateChange () {
      // 如果有选择项
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      // 对表单进行预校验
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败!')
        this.$message.success('添加分类成功!')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>

</style>
