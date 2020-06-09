<template>
<div class="view">
  <el-form ref="form" :model="sizeForm" label-width="80px" size="medium" style="margin-top:20px">
    <el-form-item label="加分名称">
      <el-input v-model="sizeForm.addname" prefix-icon="el-icon-edit"></el-input>
    </el-form-item>
    <el-form-item label="加分类型">
      <el-select v-model="sizeForm.addtype" placeholder="请选择加分类型" style="width: 100%;">
        <el-option label="专业技能" value="专业技能"></el-option>
        <el-option label="创造能力" value="创造能力"></el-option>
        <el-option label="组织管理能力" value="组织管理能力"></el-option>
        <el-option label="文体能力" value="文体能力"></el-option>
        <el-option label="社会实践能力" value="社会实践能力"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="加分时间">
      <el-col :span="11">
        <el-date-picker type="date" placeholder="选择日期" v-model="sizeForm.adddate" value-format="yyyy-MM-dd" style="width: 218%;">
        </el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="加分分值">
          <el-slider v-model="sizeForm.addmark" show-input> </el-slider>
    </el-form-item>
    <el-form-item label="加分说明">
      <el-input type="textarea" v-model="sizeForm.adddesc"></el-input>
    </el-form-item>
    <el-form-item label="加分证明">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/student/upload"
        accept="image/*"
        :class="{hide:hideUpload}"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-change="handleOnchang"
        :file-list="fileList"
        list-type="picture-card"
        :auto-upload="false">
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">只能上传图片文件</div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item size="large" style="margin-top:20px">
      <el-button  size="large" type="success" @click="submitUpload">上传证明</el-button>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</div>  
</template> 

<script>
  export default {

    data() {
      return {
        sizeForm: {
          userid:JSON.parse(window.localStorage.getItem('user')).userid,
          addname: '',
          addtype: '',
          adddate: '',
          addmark: 0,
          adddesc: '',
          addpath: '',
          tag:'否'
        },
        fileList:[],
        dialogImageUrl: '',
        dialogVisible: false,
        hideUpload: false,
        limitCount:1
      };
    },
    methods: {
      onSubmit() {
        var _this = this
        if (!_this.sizeForm.addname&& !_this.sizeForm.adddesc
        &&!_this.sizeForm.addtype&& !_this.sizeForm.addmark&& !_this.sizeForm.adddate) {
          this.$message.error('请输入完整信息');
        }else if(this.sizeForm.addpath == ''){
          this.$message.error('请先上传证明');
        }else{
        console.log(_this.sizeForm);
          this.postRequest('/student/add',this.sizeForm).then(resp=> {
            if (resp && resp.status == 200) {
              _this.$router.push({ path:'/students/addhistory'});
              
            }
          }); 
        }
    },
      submitUpload() {//文件上传
        this.$refs.upload.submit();
    },
      handleRemove(file, fileList) {
        this.hideUpload = fileList.length >= this.limitCount;
        console.log(file, fileList);
    },
      handleSuccess(response, file, fileList) {
        if (response) {
          this.$message({type: 'success', message:"上传成功"});
          console.log(response);
          this.sizeForm.addpath = response;
        }
    },
      handleError(err, file, fileList) {
         this.$message({type: 'error', message: "上传失败"});
    },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
       handleOnchang(file, fileList) {
          this.hideUpload = fileList.length >= this.limitCount;
      }              
    }
  };
</script>
<style>
.hide .el-upload--picture-card {
    display: none;
}
</style>