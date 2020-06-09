<template>
    <div class="view" v-loading="loading">
        <el-tabs v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane label="教师管理" name="teacher" ></el-tab-pane>
            <el-tab-pane label="学生管理" name="student" ></el-tab-pane>
        </el-tabs>

        <el-row>
          <el-col :span="3">          
            <el-input placeholder="输入关键字进行过滤" v-model="search" prefix-icon="el-icon-search"
            style="width: 300px;margin: 0px;padding: 0px;" size="small"></el-input>
          </el-col>
          <el-col :span="15" :push=8>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddView">添加用户</el-button>
          </el-col>
          <el-col :span="3" :push="1">          
            <el-upload
             :show-file-list="false"
             accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
             action="/manage/import"
             :on-success="fileUploadSuccess"
             :on-error="fileUploadError">
                    <el-button type="success" size="small">导入用户</el-button>
            </el-upload>
          </el-col>
        </el-row>  

    <!--表格-->
    <el-table
      v-loading="loading"
      :data="tables.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      :default-sort = "{prop: 'date'}"
      >
      <el-table-column
        prop="userid"
        label="账号"
        sortable 
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="gradename"
        label="班级">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150">
        <template slot-scope="scope">
          <el-button @click="removeuser(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="22%"
      :before-close="handleClose">
      <section>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="账号">
            <el-input prefix-icon="el-icon-edit" v-model="form.userid"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input prefix-icon="el-icon-edit-outline" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-select v-model="form.gradeid" filterable placeholder="请选择" size="medium">    
              <el-option
                v-for="item in gradeinfo"
                :key="item.gradeid"
                :label="item.gradename"
                :value="item.gradeid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="form.perms" placeholder="用户类型" style="width: 100%;">
              <el-option label="学生" value="0"></el-option>
              <el-option label="教师" value="10"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser()">确 定</el-button>
      </span>
    </el-dialog>

    <!--分页-->
    <div class="block" style="margin-top:15px;">
            <el-pagination align='center' @current-change="handleCurrentChange" 
            :current-page="currentPage" 
            :page-size="pageSize" 
            layout="total, prev, pager, next, jumper" 
            :total="tableData.length">
            </el-pagination>
    </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'teacher',
        tableData: [],//后台拿来数据
        currentPage: 1, // 当前页码
        pageSize: 5, // 每页的数据条数
        search: '',
        loading: false,
        dialogVisible:false,
        form:{
          userid:'',
          username:'',
          gradeid: '',
          perms:''
        },
        gradeinfo: [],
      };
    },
    methods: {
      handleClick(tab, event) {
          if(tab.name=='student'){
              this.getstudent()
          }else{
              this.getteacher()
          }
      },
      formatter(row, column) {//格式化
        return row.addname;
      },
       //当前页改变时触发 跳转其他页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      handleClose(done) { //关闭提醒
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          }).catch(_ => {});
      },
      showAddView(){//编辑对话
        this.dialogVisible=true
        this.getgarde()
      },
      adduser(){//添加用户
        this.dialogVisible=false
        this.postRequest('/manage/user',this.form).then(resp=> {
          if (resp && resp.status == 200) { 
          }
        }); 
      },
      removeuser(row) {
       this.$confirm('此操作将永久删除是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/manage/user/"+row.userid).then(resp=>{
            if (resp && resp.status == 200) {
            
            }
           })
        }).catch(() => {
        });
      },
      getstudent(){
        this.loading=true
        this.getRequest('/manage/student').then(resp=> {  
          if (resp && resp.status == 200) {       
            this.loading = false
            this.tableData=resp.data
          }
         })
      },
      getteacher(){
        this.loading=true
        this.getRequest('/manage/teacher').then(resp=> {  
          if (resp && resp.status == 200) {       
            this.loading = false
            this.tableData=resp.data
          }
         })
      },
      getgarde(){
        this.getRequest("/monitor/grade").then(resp=> {
          if (resp && resp.status == 200) {
           this.gradeinfo = resp.data
          }
        })   
      },
      fileUploadError(err, file, fileList) {
        this.$message({type: 'error', message: "导入失败!"});
      },
      fileUploadSuccess(response, file, fileList) {
         this.$message({type: 'success', message: "导入成功!"});
      }
    },
    mounted: function () {
      this.getteacher()
    },
    computed: {
    // 模糊搜索
      tables () {
        var search = this.search
        if (search) {
          // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
          // 注意： filter() 不会对空数组进行检测。
          // 注意： filter() 不会改变原始数组。
          return this.tableData.filter(data => {
            // some() 方法用于检测数组中的元素是否满足指定条件;
            // some() 方法会依次执行数组的每个元素：
            // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
            // 如果没有满足条件的元素，则返回false。
            // 注意： some() 不会对空数组进行检测。
            // 注意： some() 不会改变原始数组。
            return Object.keys(data).some(key => {
              // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
              // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
              return String(data[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData
      }
    }
  };
</script>