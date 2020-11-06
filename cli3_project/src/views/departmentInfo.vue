<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>院系信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片布局-->
        <el-card shadow="always">
            <!--搜索框加按钮-->
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-input v-model="queryInfo.condition" placeholder="请输入系名进行查询" clearable @clear="selectDepartmentByPageAndCondition">
                        <el-button slot="append" icon="el-icon-search" @click="selectDepartmentByPageAndCondition"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4" :offset="12">
                    <el-button type="primary" @click="judgeGrade()">添加院系</el-button>
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
                        prop="dno"
                        label="系编号">
                </el-table-column>
                <el-table-column
                        prop="dname"
                        label="系名">
                </el-table-column>
                <el-table-column
                        prop="dmanager"
                        label="系主任">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showInfo(scope.row.dno)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDepartment(scope.row.dno)"></el-button>
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

        <!--添加学院对话框-->
        <el-dialog title="添加学院" :visible.sync="dialogFormVisible" @close="resetDialog">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="系编号" :label-width="formLabelWidth" prop="dno">
                    <el-input v-model="form.dno" placeholder="请输入系编号" clearable></el-input>
                </el-form-item>
                <el-form-item label="系名" :label-width="formLabelWidth" prop="dname">
                    <el-input v-model="form.dname" placeholder="请输入系名" clearable></el-input>
                </el-form-item>
                <el-form-item label="系主任" :label-width="formLabelWidth" prop="dmanager">
                    <el-input v-model="form.dmanager" placeholder="请输入系主任" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetDialog">取 消</el-button>
                <el-button type="primary" @click="addDepartment('form')">确 定</el-button>
            </div>
        </el-dialog>

        <!--查看学院信息-->
        <el-dialog title="修改学院信息" :visible.sync="infoDialog" @close="resetInfoDialog">
            <el-form :model="InfoForm" ref="InfoForm" :rules="rules">
                <el-form-item label="系编号" :label-width="formLabelWidth" prop="dno">
                    <el-input v-model="InfoForm.dno" clearable></el-input>
                </el-form-item>
                <el-form-item label="系名" :label-width="formLabelWidth" prop="dname">
                    <el-input v-model="InfoForm.dname"></el-input>
                </el-form-item>
                <el-form-item label="系主任" :label-width="formLabelWidth" prop="dmanager">
                    <el-input v-model="InfoForm.dmanager"></el-input>
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
        name: "departmentInfo",
        data(){
            return {
                rules:{
                    dname:[{required:true,message:'请填写系名',trigger:'blur'},
                        {pattern:/^[一-龥]{0,}$/,message:'请输入中文',trigger:'blur'}],
                    dmanager:[{required:true,message:'请填写系主任',trigger:'blur'},
                        {pattern:/^[一-龥]{0,}$/,message:'请输入中文',trigger:'blur'}],
                    dno:[{ require:true,message:'请输入系编号',trigger:'blur'},
                        {pattern:/\b\d{8}\b/,message:'请输入8位数字的系编号',trigger:'blur'}]
                },
                multipleSelection:[],
                selectNos:[],
                formLabelWidth: '120px',
                queryInfo:{
                    condition:'',
                    currentPage:1,
                    pageSize:10
                },
                total:0,
                form:{
                    dno:'',
                    dname:'',
                    dmanager:''
                },
                InfoForm:{
                    dno:'',
                    dname:'',
                    dmanager:'',
                },
                tableData:[],
                dialogFormVisible:false,
                infoDialog:false,
            }
        },
        created(){
            this.selectDepartmentByPageAndCondition();
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
            changeInfo(formName){
                //修改院系信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //校验通过
                        this.common.changeInfo(this,this.apiUrl.updateDepartmentInfo);
                    }
                });

            },
            showInfo(dno){
                //根据dno显示院系信息
                this.common.selectDetailInfo(this,this.apiUrl.selectDepartmentByNo,dno);
            },
            resetInfoDialog(){
                //重置信息框
                this.$refs['InfoForm'].resetFields();
                this.infoDialog=false;
            },
            deleteDepartment(dno){
                this.common.deletes(this,this.apiUrl.deleteDepartment,this.apiUrl.deleteMultipleDepartment,"院系",dno);
            },
            addDepartment(formName){
                //添加学院
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //校验通过
                        this.common.addOne(this,this.apiUrl.addDepartment);
                    }
                });

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
                this.selectDepartmentByPageAndCondition();
            },
            handleCurrentChange(val) {
                //监听currentPage
                this.queryInfo.currentPage=val;
                this.selectDepartmentByPageAndCondition();
            },
            selectDepartmentByPageAndCondition(){
                //分页条件查看学院信息
                this.common.getAllDataByConditionAndPage(this,this.apiUrl.selectDepartmentByPageAndCondition);
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