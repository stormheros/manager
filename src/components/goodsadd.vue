<template>
    <el-card class="card">
        <my-bread level1="商品管理" level2="商品列表"></my-bread>
        <el-alert title="添加商品信息" type="info" center show-icon class="alert" :closable="false">
        </el-alert>
        <el-steps :active="active-0" align-center>
            <el-step title="基本信息" ></el-step>
            <el-step title="商品参数" ></el-step>
            <el-step title="商品属性" ></el-step>
            <el-step title="商品图片" ></el-step>
            <el-step title="商品内容" ></el-step>
        </el-steps>
        <el-form class="form" label-position="top" label-width="80px" :model="goodsInfo">
            <el-tabs tab-position="left"  v-model="active" @tab-click="getdynamic">
              <el-tab-pane name="1" label="基本信息">
                <el-form-item label="商品名称">
                  <el-input v-model="goodsInfo.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                  <el-input v-model="goodsInfo.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                  <el-input v-model="goodsInfo.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                  <el-input v-model="goodsInfo.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                <el-cascader expand-trigger="hover" :props="defaultProps" :options="options" v-model="selectedOptions2" @change="handleChange" clearable>
                </el-cascader>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name="2" label="商品参数">
                <el-form-item :label="item.attr_name" v-for="(item,i) in dynamic" :key="i">
                    <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox :label="item2" border  v-for="(item2,i) in item.attr_vals" :key="i"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name="3" label="商品属性">
                  <el-form-item :label="item3.attr_name" v-for="(item3,i) in static" :key="i">
                  <el-input v-model="item3.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name="4" label="商品图片">
                  <el-upload
                     class="upload-demo"
                     action="http://localhost:8888/api/private/v1/upload"
                     :on-success="handleSuccess"
                     :on-remove="handleRemove"
                     list-type="picture"
                     :headers="headers"
                     >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                   </el-upload>
              </el-tab-pane>
              <el-tab-pane name="5" label="商品内容">
                   <el-form-item>
                       <el-button type="primary" @click="addgoods">添加商品</el-button>
                       <quill-editor v-model="goodsInfo.goods_introduce"></quill-editor>
                   </el-form-item>
              </el-tab-pane>
            </el-tabs>
          
        </el-form>
       
    </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
    data(){
        return{
            active: '1',
            goodsInfo:{
                pics:[],
                attrs:[]
            },
            selectedOptions2: [1, 3, 6],
            options:[],
            defaultProps:{
                children:'children',
                value: "cat_id",
                label:'cat_name',
            },
            dynamic:[],
            static:[],
            headers:{
                Authorization : localStorage.getItem('token')
            },
            production:''
        }
    },
    components: {
        quillEditor
    },
    created(){
        this.getInfo()
    },
    methods:{
        async getInfo(){
            const res = await this.$http.get(`categories`)
            this.options = res.data.data
        },
        handleChange(){
            console.log(this.selectedOptions2[2])
        },
        async getdynamic(){
            if(this.active === '2'){
                if(this.selectedOptions2.length !== 3){
                    this.$message.warning('请选择商品的三级分类')
                }else{
                const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=many`)
                this.dynamic = res.data.data
                this.dynamic.forEach((item)=>{
                    item.attr_vals = item.attr_vals.length === 3 ? [] :  item.attr_vals.trim().split(",");
                })
                }
            }
            if(this.active === '3'){
                const res2 = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=only`)
                this.static = res2.data.data
            }
        },
        handleSuccess(response){
            this.goodsInfo.pics.push({pic:response.data.tmp_path})
        },
        handleRemove(file){
            const index = this.form.pics.findIndex(item => {
            return item.pic === file.response.data.tmp_path;
            });
            this.goodsInfo.pics.splice(index, 1);
        },
        async addgoods(){
            const  dynamicArry =  this.dynamic
            const newdynamicArry = dynamicArry.map((item)=>{
                return {attr_id:item.attr_id ,attr_value:item.attr_vals}
            })
            const staticArry = this.static
            const newstaticArry = staticArry.map((item)=>{
                return {attr_id:item.attr_id ,attr_value:item.attr_vals}
            })
            const goodsArry = [...newdynamicArry, ...newstaticArry]
            this.goodsInfo.attrs = (goodsArry)
            this.goodsInfo.goods_cat = this.selectedOptions2.join(',')
            const res = await this.$http.post(`goods`,this.goodsInfo)
            this.$message.success(res.data.meta.msg)
            this.$router.push({
                path:'/goods'
            })
        }
    }

}
</script>

<style>
.card{
    height: 100%;
}
.alert{
    margin-top: 20px;
    margin-bottom: 20px;
}
.form{
    height: 400px;
    overflow: auto;
}
.ql-editor{
    height: 300px;
}
</style>
