<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>课程信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片布局-->
        <el-card shadow="always">
            <!--搜索框加按钮-->
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-input v-model="queryInfo.condition" placeholder="请输入课程名进行查询" clearable @clear="selectCourseByConditionAndPage">
                        <el-button slot="append" icon="el-icon-search" @click="selectCourseByConditionAndPage"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button type="primary" @click="judgeGrade()">添加课程</el-button>
                </el-col>
                <el-col :span="2" :offset="8">
                    <el-button type="success" @click="exportToExcel">导出课程</el-button>
                </el-col>
            </el-row>

            <!--表格-->
            <el-table
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column  type="selection" width="40">
                </el-table-column>
                <el-table-column
                        prop="cno"
                        label="课程号" width="150">
                </el-table-column>
                <el-table-column
                        prop="cname"
                        label="课程名" width="150">
                </el-table-column>
                <el-table-column
                        prop="tname"
                        label="教师" width="100">
                </el-table-column>
                <el-table-column
                        prop="ccredit"
                        label="学分" width="100">
                </el-table-column>
                <el-table-column
                        prop="pre_cno"
                        label="先行课编号" width="100">
                </el-table-column>
                <el-table-column
                        prop="pre_cname"
                        label="先行课名" width="100">
                </el-table-column>
                <el-table-column
                        prop="pre_ccredit"
                        label="先行课学分" width="100">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-thumb" size="mini" @click="chooseCourse(scope.row.cno,scope.row.tno)"></el-button>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showInfo(scope.row.cno)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCourse(scope.row.cno)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.currentPage"
                    :page-sizes="[1,2,5,10]"
                    :page-size="queryInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--添加课程-->
        <el-dialog title="添加课程" :visible.sync="dialogFormVisible" @close="resetDialog">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="课程号" :label-width="formLabelWidth" prop="cno">
                    <el-input v-model="form.cno" placeholder="请输入课程号" clearable></el-input>
                </el-form-item>
                <el-form-item label="课程名" :label-width="formLabelWidth" prop="cname">
                    <el-input v-model="form.cname" placeholder="请输入系名" clearable></el-input>
                </el-form-item>
                <el-form-item label="学分" :label-width="formLabelWidth" prop="ccredit">
                    <el-input v-model="form.ccredit" placeholder="请输入学分" clearable></el-input>
                </el-form-item>
                <el-form-item label="先行课" :label-width="formLabelWidth" prop="cpno">
                    <el-select v-model="form.cpno" placeholder="请选择先行课">
                        <el-option v-for="item in allCourse" :label="item.cname" :value="item.cno" :key="item.cno"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetDialog">取 消</el-button>
                <el-button type="primary" @click="addCourse('form')">确 定</el-button>
            </div>
        </el-dialog>

        <!--修改课程信息对话框-->
        <el-dialog title="修改课程信息" :visible.sync="infoDialog" @close="resetInfoDialog">
            <el-form :model="InfoForm" ref="InfoForm" :rules="rules">
                <el-form-item label="课程号" :label-width="formLabelWidth" prop="cno">
                    <el-input v-model="InfoForm.cno" clearable></el-input>
                </el-form-item>
                <el-form-item label="课程名" :label-width="formLabelWidth" prop="cname">
                    <el-input v-model="InfoForm.cname" clearable=""></el-input>
                </el-form-item>
                <el-form-item label="教师" :label-width="formLabelWidth" >
                    <el-input v-model="InfoForm.tname" disabled></el-input>
                </el-form-item>
                <el-form-item label="学分" :label-width="formLabelWidth" prop="cname">
                    <el-input v-model="InfoForm.ccredit" clearable=""></el-input>
                </el-form-item>
                <el-form-item label="先行课" :label-width="formLabelWidth" prop="cpno">
                    <el-select v-model="InfoForm.pre_cno">
                        <el-option :label="item.cname" v-for="item in allCourse" :value="item.cno" :key="item.cno"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetInfoDialog">取 消</el-button>
                <el-button type="primary" @click="changeInfo('InfoForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        inject:['reload'],
        name: "courseInfo",
        data(){
            return {
                rules:{
                    // {pattern:/\b\d{8}\b/,message:'请输入8位数字的课程号',trigger:'blur'}
                    cno:[{require:true,message:'请输入课程编号',trigger:'blur'},
                       ],
                    cname:[{required:true,message:'请填写课程名',trigger:'blur'}],
                    ccredit:[{required:true,message:'请输入学分',trigger:'blur'},
                        {pattern:/^[0-9]*$/,message:'请输入数字',trigger:'blur'}]
                },
                allCourse:[],
                multipleSelection:[],
                selectNos:[],
                formLabelWidth: '120px',
                queryInfo:{
                    condition:'',
                    currentPage:1,
                    pageSize:10
                },
                InfoForm:{
                    cno:'',
                    cname:'',
                    ccredit:''
                },
                total:0,
                form:{
                    cno:'',
                    cname:'',
                    ccredit:''
                },
                tableData:[],
                allTableData:[],     //表格所有数据
                dialogFormVisible:false,
                infoDialog:false,//课程信息对话框
            }
        },
        created(){
            this.selectCourseByConditionAndPage();
            this.getAllCourse();//获取所有课程信息用于先行课的选择
            this.selectAllCourse();//获取所有课程信息用于excel的导出
        },
        methods:{
            judgeGrade(){
                //判断身份
                if(JSON.parse(localStorage.getItem('user')).power=='学生管理员'){
                    this.dialogFormVisible=true;
                }else{
                    this.$notify({
                        title: '警告',
                        message: '你不具有添加的权利',
                        type: 'warning'
                    });
                }
            },
            chooseCourse(cno,tno){
               if(tno==undefined){
                   this.$message({
                       type:'error',
                       message:'该课程还未开放'
                   })
               }else{
                   let that=this;
                   let params={
                       cno:cno,
                       tno:tno,
                       sno:JSON.parse(localStorage.getItem('user')).sno
                   }
                   this.$axios.get(this.apiUrl.addSct,{
                       params:params
                   }).then(response=>{
                       if(response.data.status==200){
                           that.$message({
                               type:'success',
                               message:'选课成功'
                           })
                       }else{
                           that.common.errorReturn(that,response.data.data.detailMessage);
                       }
                   }).catch(error=>{
                       console.log('---error---',error);
                   })
               }

            },
            changeInfo(formName){
                //修改课程信息
                let that=this;
                if(this.InfoForm.cno==this.InfoForm.pre_cno){
                    this.$message({
                        type:'error',
                        message:'先行课不能与要修改的课程相同'
                    })
                }else {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            //校验通过
                            this.common.changeInfo(this,this.apiUrl.updateCourseInfo);
                        }
                    })

                }
            },
            showInfo(cno){
                //根据课程号查询详细信息
                this.common.selectDetailInfo(this,this.apiUrl.selectCourseByCno,cno);
            },
            resetInfoDialog(){
                //重置信息框
                this.$refs['InfoForm'].resetFields();
                this.infoDialog=false;
            },
            deleteCourse(cno){
                //删除课程
                this.common.deletes(this,this.apiUrl.deleteCourseByNo,this.apiUrl.deleteMultipleCourse,"课程",cno);
            },
            exportToExcel () {
                //导出excel
                require.ensure([], () => {
                    let { exportJsonToExcel } = require("../excel/Export2Excel.js");
                    // 表头
                    let tHeader = [
                        "课程号",
                        "课程名",
                        "学分",
                        "先行课编号",
                        "先行课名",
                        "先行课学分"
                    ];
                    //表头对应字段名，要和下面数据key对应
                    let filterVal = [
                        "cno",
                        "cname",
                        "ccredit",
                        "pre_cno",
                        "pre_cname",
                        "pre_ccredit"
                    ];
                    // 数据来源
                    let list = this.allTableData;
                    let data = this.formatJson(filterVal, list); //数据格式化
                    var index1 = "所有课程信息"; //导出时文件名
                    exportJsonToExcel(tHeader, data, index1); //导出文件
                });
            },
            formatJson(filterVal, jsonData) {
                // 导出excel数据格式化
                return jsonData.map(v => filterVal.map(j => v[j]));
            },
            addCourse(formName){
                //添加一门课程
                if(this.form.cpno==this.form.cno){
                    this.$message({
                        type:'error',
                        message:'先行课不能与要添加的课程相同'
                    })
                }else{
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            //校验通过
                            this.common.addOne(this,this.apiUrl.addCourse);
                        }
                    })

                }
            },
            getAllCourse(){
                //获取所有课程信息
                let that=this;
                this.$axios.get(this.apiUrl.selectAllCourse).then(response=>{
                    that.allCourse=response.data.data.data;
                }).catch(error=>{
                    console.log('--error--',error);
                })
            },
            resetDialog(){
                //重置表单
                this.$refs['form'].resetFields();
                this.dialogFormVisible=false;
            },
            handleSelectionChange(val){
                //监听多选框值动态变化的事件
                this.multipleSelection = val;
            },
            handleSizeChange(val) {
                //监听pageSize
                this.queryInfo.pageSize=val;
                this.selectCourseByConditionAndPage();
            },
            handleCurrentChange(val) {
                //监听currentPage
                this.queryInfo.currentPage=val;
                this.selectCourseByConditionAndPage();
            },
            selectCourseByConditionAndPage(){
                //条件分页查询所有课程信息
                this.common.getAllDataByConditionAndPage(this,this.apiUrl.selectCourseByPageAndCondition);
            },
            selectAllCourse(){
                //获取所有课程信息用于excel导出
                this.common.getAllData(this,this.apiUrl.selectAllCourses);
            }
        }
    }
</script>

<style scoped>
    .el-breadcrumb{
        margin-bottom: 15px;
    }
    .el-table{
        margin:50px 0;
    }
    .el-pagination{
        margin-top:30px;
    }
</style>