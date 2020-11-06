<template>
    <div>
            <!--面包屑-->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>学生信息</el-breadcrumb-item>
            </el-breadcrumb>

            <!--卡片布局-->
            <el-card shadow="always">
                <!--搜索框加按钮-->
                <el-row :gutter="10">
                    <el-col :span="8">
                        <!--@clear="selectStudentByConditionAndPage()"-->
                        <el-input v-model="queryInfo.condition" placeholder="请输入姓名进行查询" clearable @clear="selectStudentByConditionAndPage()">
                            <el-button slot="append" icon="el-icon-search" @click="selectStudentByConditionAndPage()"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="3" :offset="1">
                        <el-button type="primary" @click="dialogFormVisible=true">单个添加</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-upload
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :before-remove="beforeRemove"
                                :limit="1"
                                :auto-upload=false
                                :on-change="changeFile"
                                accept=".xls,.xlsx">
                            <el-button type="primary">批量添加</el-button>
                        </el-upload>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary"
                                   @click="uploadFile()">数据上传</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="success" @click="exportToExcel()">数据导出</el-button>
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
                            prop="sno"
                            label="学号" width="120">
                    </el-table-column>
                    <el-table-column
                            prop="spassword"
                            label="密码" width="150">
                    </el-table-column>
                    <el-table-column
                            prop="sname"
                            label="姓名" width="70">
                    </el-table-column>
                    <el-table-column
                            prop="ssex"
                            label="性别"  width="40">
                    </el-table-column>
                    <el-table-column
                            prop="sage"
                            label="年龄"  width="40">
                    </el-table-column>
                    <el-table-column
                            prop="sdept"
                            label="学院" width="170">
                    </el-table-column>
                    <el-table-column
                            prop="sid"
                            label="身份证" width="165">
                    </el-table-column>
                    <el-table-column prop="power" label="身份" width="100">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.power=='普通学生'" type="success">普通学生</el-tag>
                            <el-tag v-else type="danger">学生管理员</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showInfo(scope.row.sno)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" @click="deleteStudent(scope.row.sno)" size="mini"></el-button>
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

            <!--添加学生对话框-->
            <el-dialog title="添加学生" :visible.sync="dialogFormVisible" @close="resetDialog">
                <el-form :model="form" ref="form" :rules="rules">
                    <el-form-item label="学号" :label-width="formLabelWidth" prop="sno">
                        <el-input v-model="form.sno" placeholder="请输入学号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth" prop="spassword">
                        <el-input v-model="form.spassword" placeholder="请输入密码" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" :label-width="formLabelWidth" prop="sname">
                        <el-input v-model="form.sname" placeholder="请输入姓名" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="身份证" :label-width="formLabelWidth" prop="sid">
                        <el-input v-model="form.sid" placeholder="请输入身份证" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth" prop="ssex">
                        <el-select v-model="form.ssex" placeholder="请选择性别" clearable style="width:100%;">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年龄" :label-width="formLabelWidth" prop="sage">
                        <el-input v-model="form.sage" placeholder="请输入年龄" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="学院" :label-width="formLabelWidth" prop="sdept">
                        <el-select v-model="form.sdept" placeholder="请选择学院" clearable style="width:100%;">
                            <el-option :label="item.dname" v-for="item in allDepartment" :value="item.dname"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="等级" :label-width="formLabelWidth" prop="power">
                        <!-- <el-input v-model="form.sdept" placeholder="请输入学院"></el-input>-->
                        <el-select v-model="form.power" placeholder="请选择等级" clearable style="width:100%;">
                            <el-option label="普通学生" value="普通学生"></el-option>
                            <el-option label="学生管理员" value="学生管理员"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetDialog">取 消</el-button>
                    <el-button type="primary" @click="addOneStudent('form')">确 定</el-button>
                </div>
            </el-dialog>

            <!--修改学生信息对话框-->
            <el-dialog title="修改学生信息" :visible.sync="infoDialog" @close="resetInfoDialog">
                <el-form :model="InfoForm" ref="InfoForm" :rules="rules">
                    <el-form-item label="学号" :label-width="formLabelWidth" prop="sno">
                        <el-input v-model="InfoForm.sno" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth" prop="spassword">
                        <el-input v-model="InfoForm.spassword" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" :label-width="formLabelWidth" prop="sname">
                        <el-input v-model="InfoForm.sname" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth" prop="ssex">
                        <el-select v-model="InfoForm.ssex" placeholder="请选择性别" clearable style="width: 100%;">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年龄" :label-width="formLabelWidth" prop="sage">
                        <el-input v-model="InfoForm.sage" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="学院" :label-width="formLabelWidth" prop="sdept">
                        <el-select v-model="InfoForm.sdept" placeholder="请选择学院" clearable style="width: 100%;">
                            <el-option :label="item.dname" v-for="item in allDepartment" :value="item.dname"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="身份证" :label-width="formLabelWidth" prop="sid">
                        <el-input v-model="InfoForm.sid" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="身份" :label-width="formLabelWidth" prop="power">
                        <el-select v-model="InfoForm.power" placeholder="请选择身份" clearable>
                            <el-option label="普通学生" value="普通学生"></el-option>
                            <el-option label="学生管理员" value="学生管理员"></el-option>
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
        name: "studentInfo",
        data(){
            return {
                rules:{
                    sno:[{required:true,message:'请输入学号',trigger:'blur'},
                        {pattern:/\b\d{12}\b/,message:'请输入12位数字的学号',trigger:'blur'}
                    ],
                    spassword:[{required:true,message:'请输入密码',trigger:'blur'},
                        { min: 5, max: 20, message: '长度在 5到 20个字符', trigger: 'blur'}],
                    sid:[{required:true,message:'请输入身份证号',trigger:'blur'},
                        {pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,message:'请输入正确的身份证号码',trigger:'blur'}
                    ],
                    sname:[{required:true,message:'请输入姓名',trigger:'blur'},
                        {pattern:/^[一-龥]{0,}$/,message:'请输入中文',trigger:'blur'}],
                    ssex:[{required:true,message:'请选择性别',trigger:'change'}],
                    sage:[{required:true,message:'请输入年龄',trigger:'blur'},
                        {pattern:/\b\d{2}\b/,message:'请输入2位数的数字',trigger:'blur'}],
                    sdept:[{required:true,message:'请选择学院',trigger:'change'}],
                    power:[{required:true,message:'请选择身份',trigger:'change'}]
                },
                allDepartment:[],
                form:{
                    sno:'',
                    sname:'',
                    spassword:'',
                    ssex:'',
                    sage:'',
                    sdept:'',
                    sid:'',
                    power:''
                },
                InfoForm:{
                    sno:'',
                    sname:'',
                    spassword:'',
                    ssex:'',
                    sage:'',
                    sdept:'',
                    sid:'',
                    power:''
                },
                dialogFormVisible:false,//添加用户对话框
                infoDialog:false,//个人信息对话框
                formLabelWidth: '120px',
                selectNos:[],
                tableData:[],       //分页查询所有数据
                queryInfo:{
                    condition:'',
                    currentPage:1,
                    pageSize:5
                },
                total:0,
                file:null,
                allTableData:[],     //表格所有数据
                multipleSelection:[]
            }
        },
        created(){
            this.selectStudentByConditionAndPage();//分页条件获取所有学生信息
            this.getAllStudent();//获取所有学生信息
            this.getAllDepartment();//获取所有部门信息
        },
        methods:{
            changeInfo(formName){
                //修改学生信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //校验通过
                        this.common.changeInfo(this,this.apiUrl.updateInfo);
                    }
                })
            },
            resetInfoDialog(){
                //重置信息框
                this.$refs['InfoForm'].resetFields();
                this.infoDialog=false;
            },
            showInfo(sno){
                //根据学号显示学生信息
                this.common.selectDetailInfo(this,this.apiUrl.selectStudentByNo,sno);
                //方便修改学生信息时使用
            },
            exportToExcel () {
                //导出excel
                require.ensure([], () => {
                    let { exportJsonToExcel } = require("../excel/Export2Excel.js");
                    // 表头
                    let tHeader = [
                        "学号",
                        "密码",
                        "姓名",
                        "性别",
                        "年龄",
                        "学院"
                    ];
                    //表头对应字段名，要和下面数据key对应
                    let filterVal = [
                        "sno",
                        "spassword",
                        "sname",
                        "ssex",
                        "sage",
                        "sdept"
                    ];
                    // 数据来源
                    let list = this.allTableData;
                    let data = this.formatJson(filterVal, list); //数据格式化
                    var index1 = "所有学生信息"; //导出时文件名
                    exportJsonToExcel(tHeader, data, index1); //导出文件
                });
            },
            formatJson(filterVal, jsonData) {
                // 导出excel数据格式化
                return jsonData.map(v => filterVal.map(j => v[j]));
            },
            uploadFile(){
                //上传文件
                //显示正在加载中
               this.common.uploadData(this,this.apiUrl.addMultipleStudent);
            },
            addOneStudent(formName){
                //手动添加学生
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //校验通过
                        this.common.addOne(this,this.apiUrl.addStudent);
                    }
                })

            },
            resetDialog(){
                //重置对话框
                this.$refs['form'].resetFields();
                this.dialogFormVisible=false;
            },
            deleteStudent(sno){
                //删除学生
                this.common.deletes(this,this.apiUrl.deleteStudentByNo,this.apiUrl.deleteMultipleStudent,"学生",sno);
            },
            handleSelectionChange(val){
                //监听多选框值动态变化的事件
                this.multipleSelection = val;
            },
            selectStudentByConditionAndPage(){
                //分页条件获取所有学生信息
                this.common.getAllDataByConditionAndPage(this,this.apiUrl.selectStudentByConditionAndPage);
            },
            changeFile(file){
                //改变文件触发事件
                this.file=file;
            },
            beforeRemove(file) {
                //移除文件触发事件
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleSizeChange(val) {
                //监听pageSize
                this.queryInfo.pageSize=val;
                this.selectStudentByConditionAndPage();
            },
            handleCurrentChange(val) {
                //监听currentPage
                this.queryInfo.currentPage=val;
                this.selectStudentByConditionAndPage();
            },
            getAllDepartment(){
                //用于修改所属学院信息
                let that=this;
                this.$axios.get(this.apiUrl.selectAllDepartment).then(response=>{
                    if(response.data.status==200){
                        that.allDepartment=response.data.data.data;
                    }
                }).catch(error=>{
                    console.log('---error---',error);
                })
            },
            getAllStudent(){
                //用于excel的导出
                this.common.getAllData(this,this.apiUrl.selectAllStudents);
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