<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>教师信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片布局-->
        <el-card shadow="always">
            <!--搜索框加按钮-->
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-input v-model="queryInfo.condition" placeholder="请输入姓名进行查询" clearable @clear="selectTeacherByPageAndCondition()">
                        <el-button slot="append" icon="el-icon-search" @click="selectTeacherByPageAndCondition()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4" :offset="1">
                    <el-button type="success" @click="exportToExcel()">数据导出</el-button>
                </el-col>
                <el-col :span="4" :offset="7">
                    <el-button type="primary" @click="judgeGrade()">添加老师</el-button>
                </el-col>

            </el-row>

            <!--表格-->
            <el-table
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column  type="selection" width="40">
                </el-table-column>
                <el-table-column
                        prop="tno"
                        label="工号">
                </el-table-column>
                <el-table-column
                        prop="tname"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="tage"
                        label="年龄" width="50">
                </el-table-column>
                <el-table-column
                        prop="tsex"
                        label="性别" width="50">
                </el-table-column>
                <el-table-column
                        prop="tpt"
                        label="职称" width="70">
                </el-table-column>
                <el-table-column
                        prop="teb"
                        label="学历" width="60">
                </el-table-column>
                <el-table-column
                        prop="c1_name"
                        label="主讲课程一">
                </el-table-column>
                <el-table-column
                        prop="c2_name"
                        label="主讲课程二">
                </el-table-column>
                <el-table-column
                        prop="c3_name"
                        label="主讲课程三">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showInfo(scope.row.tno)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTeacher(scope.row.tno)"></el-button>
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

        <!--添加老师对话框-->
        <el-dialog title="添加老师" :visible.sync="dialogFormVisible" @close="resetDialog">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="工号" :label-width="formLabelWidth" prop="tno">
                    <el-input v-model="form.tno" placeholder="请输入学号" clearable></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="tname">
                    <el-input v-model="form.tname" placeholder="请输入姓名" clearable></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" prop="tsex">
                    <el-select v-model="form.tsex" placeholder="请选择性别" clearable>
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄" :label-width="formLabelWidth" prop="tage">
                    <el-input v-model="form.tage" placeholder="请输入年龄" clearable></el-input>
                </el-form-item>
                <el-form-item label="学历" :label-width="formLabelWidth" prop="teb">
                    <el-select v-model="form.teb" placeholder="请选择学院" clearable>
                        <el-option label="学士" value="学士"></el-option>
                        <el-option label="硕士" value="硕士"></el-option>
                        <el-option label="博士" value="博士"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职称" :label-width="formLabelWidth" prop="tpt">
                    <el-select v-model="form.tpt" placeholder="请选择学院" clearable>
                        <el-option label="助教" value="助教"></el-option>
                        <el-option label="讲师" value="讲师"></el-option>
                        <el-option label="副教授" value="副教授"></el-option>
                        <el-option label="教授" value="教授"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主讲课程一" :label-width="formLabelWidth" prop="cno1">
                    <el-select v-model="form.cno1" placeholder="请选择课程一" clearable>
                        <el-option  v-for="item in allCourse" :label="item.cname"  :value="item.cno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主讲课程二" :label-width="formLabelWidth" prop="cno2">
                    <el-select v-model="form.cno2" placeholder="请选择课程二" clearable>
                        <el-option  v-for="item in allCourse" :label="item.cname"  :value="item.cno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主讲课程三" :label-width="formLabelWidth" prop="cno3">
                    <el-select v-model="form.cno3" placeholder="请选择课程三" clearable>
                        <el-option  v-for="item in allCourse" :label="item.cname"  :value="item.cno"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetDialog">取 消</el-button>
                <el-button type="primary" @click="addTeacher('form')">确 定</el-button>
            </div>
        </el-dialog>

        <!--修改老师信息对话框-->
        <el-dialog title="修改老师信息" :visible.sync="infoDialog" @close="resetInfoDialog">
            <el-form :model="InfoForm" ref="InfoForm" :rules="rules">
                <el-form-item label="工号" :label-width="formLabelWidth" prop="tno">
                    <el-input v-model="InfoForm.tno" clearable></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="tname">
                    <el-input v-model="InfoForm.tname"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" prop="tsex">
                    <el-select v-model="InfoForm.tsex" placeholder="请选择性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄" :label-width="formLabelWidth" prop="tage">
                    <el-input v-model="InfoForm.tage"></el-input>
                </el-form-item>
                <el-form-item label="职称" :label-width="formLabelWidth" prop="tpt">
                    <el-select v-model="InfoForm.tpt" >
                        <el-option  label="助教" value="助教"></el-option>
                        <el-option  label="讲师" value="讲师"></el-option>
                        <el-option  label="副教授" value="副教授"></el-option>
                        <el-option  label="教授" value="教授"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学历" :label-width="formLabelWidth" prop="teb">
                    <el-select v-model="InfoForm.teb" >
                        <el-option  label="学士" value="学士"></el-option>
                        <el-option  label="硕士" value="硕士"></el-option>
                        <el-option  label="博士" value="博士"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主讲课程一" :label-width="formLabelWidth" prop="cno1">
                        <el-select v-model="InfoForm.cno1" clearable @clear="clearNo1()">
                            <el-option v-for="item in allCourse" :label="item.cname" :value="item.cno"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="主讲课程二" :label-width="formLabelWidth" prop="cno2">
                        <el-select v-model="InfoForm.cno2" clearable @clear="clearNo2()">
                            <el-option v-for="item in allCourse" :label="item.cname" :value="item.cno"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="主讲课程三" :label-width="formLabelWidth" prop="cno3">
                        <el-select v-model="InfoForm.cno3" clearable @clear="clearNo3()">
                            <el-option v-for="item in allCourse" :label="item.cname" :value="item.cno"></el-option>
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
        name: "teacherInfo",
        data(){
            return {
                rules:{
                    tno:[{required:true,message:'请填写工号',trigger:'blur'},
                        {pattern:/\b\d{8}\b/,message:'请输入8位数字的工号',trigger:'blur'}],
                    tname:[{required:true,message:'请填写教师姓名',trigger:'blur'},
                        {pattern:/^[一-龥]{0,}$/,message:'请输入中文',trigger:'blur'}],
                    tsex:[{required:true,message:'请选择性别',trigger:'change'}],
                    tage:[{required:true,message:'请输入年龄',trigger:'blur'},
                        {pattern:/\b\d{2}\b/,message:'请输入2位数的数字',trigger:'blur'}],
                    tpt:[{required:true,message:'请选择职称',trigger:'change'}],
                    teb:[{required:true,message:'请选择学历',trigger:'change'}],
                },
                allCourse:[],//所有课程信息
                multipleSelection:[],
                selectNos:[],
                form:{
                    tno:'',
                    tname:'',
                    tsex:'',
                    tage:'',
                    tpt:'',
                    teb:''
                },
                formLabelWidth: '120px',
                queryInfo:{
                    condition:'',
                    currentPage:1,
                    pageSize:10
                },
                InfoForm:{
                    tno:'',
                    tname:'',
                    tsex:'',
                    tage:'',
                    tpt:'',
                    teb:''
                },
                total:0,
                allTableData:[],     //表格所有数据
                tableData:[],       //分页查询所有数据
                dialogFormVisible:false,    //添加老师对话框
                infoDialog:false,           //老师信息对话框
            }
        },
        created(){
            this.selectTeacherByPageAndCondition();
            this.getAllCourse();//获取所有课程用于添加教师信息
            this.getAllTeacher();//获取所有教师信息，用于导出excel数据
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
            clearNo1(){
                //删除cno，方便修改信息
                delete this.InfoForm['cno1'];
            },
            clearNo2(){
                //删除cno，方便修改信息
                delete this.InfoForm['cno2'];
            },
            clearNo3(){
                //删除cno，方便修改信息
                delete this.InfoForm['cno3'];
            },
            changeInfo(formName){
                // 修改教师信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //校验通过
                        this.common.changeInfo(this,this.apiUrl.updateTeacherInfo);
                    }
                })

            },
            showInfo(tno){
                //根据tno显示教师信息
                this.common.selectDetailInfo(this,this.apiUrl.selectTeacherBytno,tno);
            },
            deleteTeacher(tno){
                //删除老师
                this.common.deletes(this,this.apiUrl.deleteTeacherByNo,this.apiUrl.deleteMultipleTeacher,"老师",tno)
            },
            exportToExcel () {
                //导出excel
                require.ensure([], () => {
                    let { exportJsonToExcel } = require("../excel/Export2Excel.js");
                    // 表头
                    let tHeader = [
                        "工号",
                        "姓名",
                        "年龄",
                        "性别",
                        "职称",
                        "学历",
                        "主讲课程一",
                        "主讲课程二",
                        "主讲课程三"
                    ];
                    //表头对应字段名，要和下面数据key对应
                    let filterVal = [
                        "tno",
                        "tname",
                        "tage",
                        "tsex",
                        "tpt",
                        "teb",
                        "c1_name",
                        "c2_name",
                        "c3_name"
                    ];
                    // 数据来源
                    let list = this.allTableData;
                    let data = this.formatJson(filterVal, list); //数据格式化
                    var index1 = "所有老师信息"; //导出时文件名
                    exportJsonToExcel(tHeader, data, index1); //导出文件
                });
            },
            formatJson(filterVal, jsonData) {
                // 导出excel数据格式化
                return jsonData.map(v => filterVal.map(j => v[j]));
            },
            addTeacher(formName){
                //单个添加老师
                let that=this;
                if((this.form.cno1==this.form.cno2)&&this.form.cno1!=undefined&&this.form.cno2!=undefined){
                    //(this.form.cno1==this.form.cno2)&&this.form.cno1!=undefined&&this.form.cno2!=undefined
                    this.$message({
                        type:'error',
                        message:'主讲课程不能重复'
                    })
                }else if((this.form.cno1==this.form.cno3)&&this.form.cno1!=undefined&&this.form.cno3!=undefined){
                    this.$message({
                        type:'error',
                        message:'主讲课程不能重复'
                    })
                }else if((this.form.cno2==this.form.cno3)&&this.form.cno2!=undefined&&this.form.cno3!=undefined){
                    this.$message({
                        type:'error',
                        message:'主讲课程不能重复'
                    })
                }else{
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            //校验通过
                            this.common.addOne(this,this.apiUrl.addTeacher)
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
                    console.log('--error---',error);
                })
            },
            resetInfoDialog(){
                //重置信息框
                this.$refs['InfoForm'].resetFields();
                this.infoDialog=false;
            },
            resetDialog(){
                //重置对话框
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
                this.selectTeacherByPageAndCondition();
            },
            handleCurrentChange(val) {
                //监听currentPage
                this.queryInfo.currentPage=val;
                this.selectTeacherByPageAndCondition();
            },
            selectTeacherByPageAndCondition(){
                this.common.getAllDataByConditionAndPage(this,this.apiUrl.selectTeacherByPageAndCondition);
            },
            getAllTeacher(){
                //获取所有教师信息
                this.common.getAllData(this,this.apiUrl.selectAllTeacher);
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