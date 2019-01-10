<template>
    <el-card class="card">
           <my-bread level1="商品管理" level2="商品分类"></my-bread>
           <el-button type="primary" class="btn" @click="addCate">添加分类</el-button>
           <el-table
      height="450px"
      border
      stripe
      :data="list"
      style="width: 100%">
            <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
      ></el-tree-grid>

      <el-table-column
        label="级别">
        <template slot-scope="scope">
           <span v-if="scope.row.cat_level === 0">一</span>
           <span v-if="scope.row.cat_level === 1">二</span>
           <span v-if="scope.row.cat_level === 2">三</span>
        </template>
      </el-table-column>

      <el-table-column
        label="是否有效">
        <template slot-scope="scope">
           <span v-if="scope.row.cat_deleted">无效</span>
           <span v-if="!scope.row.cat_deleted">有效</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作" width="100">
        <template slot-scope="scope">
        <el-button  plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
        <el-button  plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
  </el-table>
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleCate">
  <el-form>
    <el-form-item label="分类名称" label-width="200">
        <el-input v-model="insertInfo"></el-input>
    </el-form-item>
    <el-form-item label="分类" label-width="200">
     <el-cascader
    :props="defaultProps"
    :options="options"
    v-model="selectedOptions"
     expand-trigger="hover"
    @change="handleChange">
  </el-cascader>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleCate = false">取 消</el-button>
    <el-button type="primary" @click="sendAdd">确 定</el-button>
  </div>
</el-dialog>
    </el-card>
</template>

<script>
const ElTreeGrid = require('element-tree-grid');
export default {
    components:{
        ElTreeGrid
    },
data(){
    return{
        list:[],
        pagenum:-1,
        pagesize:2,
        total:10,
        dialogFormVisibleCate:false,
        insertInfo:'',
        defaultProps:{
                children:'children',
                value: "cat_id",
                label:'cat_name',
            },
        selectedOptions:[],
        options:[],
    }
},methods:{
    handleSizeChange(){

    },handleCurrentChange(){

    },async getInfo(){
        const res = await this.$http.get(`categories`)
        console.log(res)
        this.list = res.data.data
    },async getCheckSection(){
            const res = await this.$http.get(`categories?type=2`)
            console.log(res)
            this.options = res.data.data
    },addCate(){
    this.dialogFormVisibleCate = true
    this.getCheckSection()
    },
    async sendAdd(){
        const sendData = {
        cat_pid	: this.selectedOptions.length===0 ? 0: this.selectedOptions[this.selectedOptions.length-1],
        cat_name : this.insertInfo,
        cat_level : this.selectedOptions.length
        }
        const res = await this.$http.post(`categories`,sendData)
        this.insertInfo = ''
        this.dialogFormVisibleCate = false
    },handleChange(){

    }
},created(){
    this.getInfo()
}
}
</script>

<style>
.card{
    height: 100%;
}
.btn{
    margin: 20px 0;
}
</style>
