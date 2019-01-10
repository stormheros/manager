<template>
    <el-card class="card">
        <my-bread level1="商品管理" level2="分类参数"></my-bread>
        <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning" show-icon :closable="false"></el-alert>
         <el-form class="form" label-position="left" :model="goodsInfo">
            <el-form-item label="请选择商品分类">
                <el-cascader expand-trigger="hover" :props="defaultProps" :options="options" v-model="selectedOptions2" @change="handleChange" clearable>
            </el-cascader>
            <el-tabs type="border-card" class="tab"  v-model="active" @tab-click="handleChange()">
                <el-tab-pane label="动态参数" name="1"   >
                      <el-button type="primary" :disabled="selectedOptions2.length !== 3">设置动态参数</el-button>
                      <el-table :data="tableDataD" border style="width: 100%">  
                      
                        <el-table-column
                             type="expand">
                             <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(scope.row,item)">{{item}}</el-tag>
                                <el-input
                                  class="input-new-tag"
                                  v-if="inputVisible"
                                  v-model="inputValue"
                                  ref="saveTagInput"
                                  size="small"
                                  @keyup.enter.native="handleInputConfirm(scope.row)"
                                  @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                             </template>
                         </el-table-column>
                        <el-table-column
                            type="index"
                           label="#">
                         </el-table-column>
                        <el-table-column
                            prop="attr_name"
                            label="属性名称">
                          </el-table-column>
                           <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <el-button  plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                                <el-button  plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态参数" name="2">
                    <el-button type="primary" :disabled="selectedOptions2.length !== 3">设置静态参数</el-button>
                    <el-table :data="tableDataS" border style="width: 100%">  
                        <el-table-column
                            type="index"
                           label="#">
                         </el-table-column>
                        <el-table-column
                            prop="attr_name"
                            label="属性名称">
                          </el-table-column>
                          <el-table-column
                            prop="attr_vals"
                            label="属性名称">
                          </el-table-column>
                           <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <el-button  plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                                <el-button  plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                            </template>
                          </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-form-item>
        </el-form>

    </el-card>
</template>

<script>
export default {
data(){
    return{
        goodsInfo:{},
        defaultProps:{
                children:'children',
                value: "cat_id",
                label:'cat_name',
            },
        selectedOptions2:[],
        options:[],
        tableDataD:[],
        tableDataS:[],
        active:'1',
        inputValue:"",
        inputVisible:false
    }
},
created(){
    this.getSelect()
},
methods:{
    async getSelect(){
        const res = await this.$http.get(`categories`)
        this.options = res.data.data
    },
    async handleChange(){
        const id = this.selectedOptions2[2]
        if(this.selectedOptions2.length === 3 && this.active === '1'){
            const res = await this.$http.get(`categories/${id}/attributes?sel=many`)
            this.tableDataD = res.data.data
            this.tableDataD.forEach((item)=>{
                    item.attr_vals = item.attr_vals.length === 3 ? [] :  item.attr_vals.trim().split(",");
                })
        }else if(this.selectedOptions2.length === 3 && this.active === '2'){
            const res = await this.$http.get(`categories/${id}/attributes?sel=only`)
            this.tableDataS = res.data.data
        }
    },
    async handleInputConfirm(attr) {
        let inputValue = this.inputValue;
        if (inputValue) {
           attr.attr_vals.push(inputValue);
        }
        const putData = {
          attr_name: attr.attr_name, 
          attr_sel: attr.attr_sel, 
          attr_vals: attr.attr_vals.join(",") 
        };
        const res = await this.$http.put(
          `categories/${this.selectedOptions2[2]}/attributes/${attr.attr_id}`,
          putData
        );
        console.log(res)
        this.inputVisible = false;
        this.inputValue = '';
      },
      showInput(){
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      async handleClose(attr,item){
          console.log(attr,item)
          attr.attr_vals.splice(attr.attr_vals.indexOf(item),1)
        const putData = {
        attr_name: attr.attr_name, 
        attr_sel: attr.attr_sel, 
        attr_vals: attr.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions2[2]}/attributes/${attr.attr_id}`,
        putData
      );
      console.log(res);

      },
}
}
</script>

<style>
.card{
    height: 100%;
}
.alert{
    margin:  20px 0;
}
.tab{
    margin-top: 20px;
}
.el-tag{
    margin: 0 5px;
}
</style>
