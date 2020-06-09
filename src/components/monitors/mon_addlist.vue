<template>
  <div class="view" v-loading="loading">
    <!--搜索-->
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="search"
      prefix-icon="el-icon-search">
    </el-input>    
    <!--表格-->
    <el-table
      :data="tables.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      :default-sort = "{prop: 'adddata'}"
      >
      <el-table-column
        prop="adddate"
        label="日期"
        sortable 
        width="180">
      </el-table-column>
      <el-table-column
        prop="userid"
        label="学号"
        sortable 
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        sortable 
        label="姓名"
        width="180">
      </el-table-column>
       <el-table-column
        prop="addname"
        label="加分名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="addtype"
        label="加分类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="addmark"
        label="分值"
        width="100">
      </el-table-column>
      <el-table-column
        prop="adddesc"
        label="加分说明"
        width="300">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="是否审批"
        align="center">
      </el-table-column>
      <el-table-column
        prop="addpath"
        label="加分证明"
        width="150"> 
        <template slot-scope="scope">
           <el-popover
            placement="left"
            trigger="click">
            <el-image slot="reference" :src="scope.row.addpath" style="width: 100px; height: 100px"></el-image>
            <el-image  :src="scope.row.addpath" style="width: 700px; height: 700px"></el-image>
           </el-popover>
        </template>
      </el-table-column>  
      <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
          <el-button @click="showEditView(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="pass(scope.row)" type="success" size="small">通过</el-button>
          <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑对话框-->
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="加分名称">
            <el-input prefix-icon="el-icon-edit" v-model="form.addname"></el-input>
          </el-form-item>
          <el-form-item label="加分类型">
            <el-select v-model="form.addtype" placeholder="加分类型" style="width: 100%;">
              <el-option label="专业技能" value="专业技能"></el-option>
              <el-option label="创造能力" value="创造能力"></el-option>
              <el-option label="组织管理能力" value="组织管理能力"></el-option>
              <el-option label="文体能力" value="文体能力"></el-option>
              <el-option label="社会实践能力" value="社会实践能力"></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="分值">
            <el-input prefix-icon="el-icon-s-data" v-model="form.addmark"></el-input>
          </el-form-item>
          <el-form-item label="加分说明">
            <el-input prefix-icon="el-icon-edit-outline" v-model="form.adddesc"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="update()">确 定</el-button>
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
      tableData: [],//后台拿来数据
      form:{//编辑的数据
        no:'',
        addname:'',
        addtype:'',
        addmark:'',
        adddesc:''
      },
        currentPage: 1, // 当前页码
        pageSize: 5, // 每页的数据条数
        dialogVisible: false, //对话框
        search: '',
        loading: false
      }
    },
    methods: {
       //当前页改变时触发 跳转其他页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      pass(row) {//确认加分有效
         this.$confirm('此操作将表示加分有效是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.getRequest("/monitor/pass/"+row.no).then(resp=> {
            if (resp && resp.status == 200) {
              this.getList()
            }
          })
        }).catch(() => {
        }); 
      },
      remove(row) {//删除
       this.$confirm('此操作将永久删除是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/monitor/delete/"+row.no).then(resp=>{
            if (resp && resp.status == 200) {
              this.getList()
            }
           })
        }).catch(() => {
        });
      },
      getList(){//获取数据
        this.loading = true;
        this.getRequest("/monitor/list").then(resp=> {
          if (resp && resp.status == 200) {
            this.loading = false;
           this.tableData = resp.data
          }
        })    
      },
      handleClose(done) { //关闭提醒
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          }).catch(_ => {});
      },
      showEditView(row){//编辑对话
        this.dialogVisible=true
        this.form.no=row.no
        this.form.addname=row.addname
        this.form.addtype=row.addtype
        this.form.adddesc=row.adddesc
        this.form.addmark=row.addmark
      },
      update(){//保存编辑后更新数据
        this.putRequest("/monitor/update", this.form).then(resp => {
           this.dialogVisible=false
            if (resp && resp.status == 200) {
              this.getList()
            }
         })
      }
    },
    mounted: function () {
      this.getList()
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
  }
</script>

<style>

</style>