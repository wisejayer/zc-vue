<template>
<div class="view" v-loading="loading"> 
    <el-row>
        <el-col :span="1"> 
            <el-button type="primary" size="mini"  @click="showAddView">添加班级</el-button>
        </el-col>
    </el-row>     

    <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        height="500"
        width='500'>
        <el-table-column
        fixed
        sortable
        prop="gradeid"
        label="班级编号"
        width="150">
        </el-table-column>
        <el-table-column
        prop="gradename"
        label="班级名字"
        width="120">
        </el-table-column>
        <el-table-column
        label="操作"
        width="80">
            <template slot-scope="scope">
                <el-button type="danger" size="small" @click="removegrade(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog
      title="添加班级"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="班级编号">
            <el-input prefix-icon="el-icon-edit" v-model="form.gradeid"></el-input>
          </el-form-item>
          <el-form-item label="班级名称">
            <el-input prefix-icon="el-icon-edit-outline" v-model="form.gradename"></el-input>
          </el-form-item>
          <el-form-item label="系别名称">
            <el-select v-model="form.deptid" placeholder="请选择系别" style="width: 100%;">
              <el-option label="网络技术系" value="2"></el-option>
              <el-option label="软件工程系" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addgrade()">确 定</el-button>
      </span>
    </el-dialog>

    </div> 
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        loading:false,
        dialogVisible: false, //对话框
        form:{
          gradeid:'',
          gradename:'',
          deptid:''
        }
      }
    },
    methods:{
      handleClose(done) { //关闭提醒
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          }).catch(_ => {});
      },
      showAddView(){//编辑对话
        this.dialogVisible=true
      },
      addgrade(){//添加班级
        this.dialogVisible=false
        this.postRequest('/manage/grade',this.form).then(resp=> {
          if (resp && resp.status == 200) { 
          }
        }); 
      },
      removegrade(row){
        this.$confirm('此操作将永久删除是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteRequest("/manage/grade/"+row.gradeid).then(resp=>{
              if (resp && resp.status == 200) {
                this.getList()
              }
            })
          }).catch(() => {
        });
      },
      getgarde(){
           this.loading = true;
        this.getRequest("/monitor/grade").then(resp=> {
          if (resp && resp.status == 200) {
           this.loading = false;
           this.tableData = resp.data
          }
        })   
      } 
    },
    mounted: function () {
      this.getgarde()
    }, 
  }
</script>