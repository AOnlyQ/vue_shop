<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 警告条 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 级联选择器 -->
              <el-cascader expandTrigger="hover" v-model="addForm.goods_cat" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传的后台API地址 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGood" class="btnAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="picPreviewVisible" width="50%">
      <img :src="this.previewPath" class="previewPic" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      // 当前激活的Tab栏
      activeIndex: '0',
      // 添加商品列表数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 级联框选择的一二三级数组的id值
        goods_cat: [],
        // 图片的数组
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 添加商品表单验证规则对象
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }]
      },
      // 商品分类列表
      cateList: [],
      // 级联选择框的配置属性
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 图片上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 手动为上传图片设置token
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      previewPath: '',
      // 控制图片预览对话框的显示与隐藏
      picPreviewVisible: false
    }
  },

  methods: {
    // 获取商品列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败！')
      }
      this.cateList = res.data
      // console.log(res.data)
    },
    // 监听级联选择器的变化
    handleChange() {
      // console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 切换标签之前的钩子
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // tab 被选中时触发
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数数据失败！')
        }

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        // console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数数据失败！')
        }

        this.onlyTableData = res.data
        // console.log(this.onlyTableData)
      }
    },
    // 上传图片的图片预览处理函数
    handlePreview(file) {
      // console.log(file);
      this.previewPath = file.response.data.url
      this.picPreviewVisible = true
    },
    // 上传项移除的处理函数
    handleRemove(file) {
      console.log(file)
      // 1.找到要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.找到该路径的在pics数组中对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      console.log(i)
      // 3.根据索引删除数组中的该元素
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 图片上传成功后的操作
    handleSuccess(response) {
      // console.log(response)
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加商品的处理函数
    addGood() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }

        // lodash包下的cloneDeep进行进行深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join('')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // console.log(form)
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewPic {
  width: 100%;
}
.btnAdd {
  margin-top: 10px;
}
</style>
