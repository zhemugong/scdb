<template>
    <!--我的选课信息-->
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>我的选课信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片布局-->
        <el-card shadow="always">
            <!--搜索框加按钮-->
            <el-row>
                <el-col :span="8">
                    <el-input v-model="queryInfo.condition" placeholder="请输入课程名进行查询" clearable @clear="selectSctByConditionAndPage">
                        <el-button slot="append" icon="el-icon-search" @click="selectSctByConditionAndPage"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3" :offset="13">
                    <el-button type="success" @click="exportToExcel">数据导出</el-button>
                </el-col>
            </el-row>

            <!--表格-->
            <el-table
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
               <!-- <el-table-column  type="selection" width="40">
                </el-table-column>-->
                <el-table-column
                        prop="sname"
                        label="学生" width="140">
                </el-table-column>
                <el-table-column
                        prop="tname"
                        label="教师" width="140">
                </el-table-column>
                <el-table-column
                        prop="cno"
                        label="课程编号">
                </el-table-column>
                <el-table-column
                        prop="cname"
                        label="课程名">
                </el-table-column>
                <el-table-column
                        prop="ccredit"
                        label="学分">
                </el-table-column>
                <el-table-column
                        prop="grade"
                        label="成绩">
                </el-table-column>
                <!--<el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showInfo(scope.row.sno,scope.row.tno,scope.row.cno)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deleteSct(scope.row.sno,scope.row.tno,scope.row.cno)" size="mini"></el-button>
                    </template>
                </el-table-column>-->
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

        <!--修改选课信息对话框-->
        <el-dialog title="修改选课信息" :visible.sync="infoDialog" @close="resetInfoDialog">
            <el-form :model="InfoForm" ref="InfoForm">
                <el-form-item label="学生" :label-width="formLabelWidth" prop="sno">
                    <el-input v-model="InfoForm.sname" disabled></el-input>
                </el-form-item>
                <el-form-item label="老师" :label-width="formLabelWidth" prop="spassword">
                    <el-input v-model="InfoForm.tname" disabled></el-input>
                </el-form-item>
                <el-form-item label="课程编号" :label-width="formLabelWidth" prop="sname">
                    <el-input v-model="InfoForm.cno" disabled></el-input>
                </el-form-item>
                <el-form-item label="课程名" :label-width="formLabelWidth" prop="ssex">
                    <el-input v-model="InfoForm.cname" disabled></el-input>
                </el-form-item>
                <el-form-item label="学分" :label-width="formLabelWidth" prop="sage">
                    <el-input v-model="InfoForm.ccredit" disabled></el-input>
                </el-form-item>
                <el-form-item label="成绩" :label-width="formLabelWidth" prop="sdept">
                    <el-input v-model="InfoForm.grade"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetInfoDialog">取 消</el-button>
                <el-button type="primary" @click="changeInfo()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        inject:['reload'],
        name: "MySctInfo",
        data(){
            return {
                infoDialog:false,//选课信息对话框
                formLabelWidth: '120px',
                InfoForm:{
                    sno:'',
                    tno:'',
                    cno:'',
                    cname:'',
                    ccredit:'',
                    grade:''
                },
                selectNos:[],
                tableData:[],       //分页查询所有数据
                queryInfo:{
                    condition:'',
                    currentPage:1,
                    pageSize:10
                },
                total:0,
                allTableData:[],     //表格所有数据
                multipleSelection:[]
            }
        },
        created(){
            this.selectSctByConditionAndPage();
            this.selectAllSct();
        },
        methods:{
            changeInfo(){
                //修改选课信息的成绩
                let that=this;
                let formData=new FormData();
                formData.append('grade',this.InfoForm.grade);
                formData.append('sno',this.InfoForm.sno);
                formData.append('cno',this.InfoForm.cno);
                formData.append('tno',this.InfoForm.tno);
                this.$axios({
                    method:'post',
                    data:formData,
                    url:this.apiUrl.changeGradeByNos
                }).then(response=>{
                    if(response.data.status==200){
                        that.$message({
                            type:'success',
                            message:'修改成功'
                        })
                        that.infoDialog=false;
                        that.reload();
                    }else {
                        that.common.errorReturn(that,response.data.data.detailMessage);
                    }
                }).catch(error=>{
                    console.log('--error---',error);
                })
            },
            showInfo(sno,tno,cno){
                //根据学号、课程号、工号显示选课信息
                if(JSON.parse(localStorage.getItem('user')).power=='学生管理员'){
                    this.infoDialog=true;
                    let that=this;
                    let params={
                        sno:sno,
                        cno:cno,
                        tno:tno
                    }
                    this.$axios.get(this.apiUrl.selectSctByNos,{
                        params:params
                    }).then(response=>{
                        if(response.data.status==200){
                            that.InfoForm=response.data.data.data;
                        }
                    }).catch(error=>{
                        console.log('----error---',error);
                    })
                }else {
                    this.$notify({
                        title: '警告',
                        message: '你不具有修改的权利',
                        type: 'warning'
                    });
                }
            },
            resetInfoDialog(){
                //重置信息框
                this.$refs['InfoForm'].resetFields();
                this.infoDialog=false;
            },
            deleteSct(sno,tno,cno){
                if(JSON.parse(localStorage.getItem('user')).power=='学生管理员'){
                    //删除选课信息
                    if(this.multipleSelection.length>1){
                        //删除多个选课信息
                        this.$confirm('是否删除选中的选课信息?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            //点击确定
                            let that = this;
                            let formData=new FormData();
                            formData.append('sctArrays',this.multipleSelection);
                            this.$axios({
                                method:'post',
                                data:this.multipleSelection,
                                contentType : "application/json; charset=utf-8",
                                dataType:'json',
                                url:this.apiUrl.deleteMultipleSct
                            }).then(res=>{
                                if(res.data.status==200){
                                    that.$message({
                                        message: '删除成功',
                                        type: 'success '
                                    });
                                    that.reload();
                                }else{
                                    that.common.errorReturn(that,res.data.data.detailMessage);
                                }
                            }).catch(error=>{
                                console.log('---error---',error);
                            })
                        }).catch(() => {
                            //点击取消
                        });
                    }else {
                        //删除一个选课信息
                        this.$confirm('是否删除该选课信息?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            //点击确定
                            let that = this;
                            let params = {
                                sno: sno,
                                tno:tno,
                                cno:cno
                            };
                            this.$axios.get(this.apiUrl.deleteSctBySno, {
                                params: params
                            }).then(response => {
                                if (response.data.status == 200) {
                                    that.$message({
                                        message: '删除成功',
                                        type: 'success '
                                    });
                                } else {
                                    that.common.errorReturn(that, response.data.data.detailmessage);
                                }
                                that.reload();
                            }).catch(error => {
                                console.log("--error--", error);
                            })
                        }).catch(() => {
                            //点击取消
                        });
                    }
                }else {
                    this.$notify({
                        title: '警告',
                        message: '你不具有删除的权利',
                        type: 'warning'
                    });
                }

            },
            exportToExcel () {
                //导出excel
                require.ensure([], () => {
                    let { exportJsonToExcel } = require("../excel/Export2Excel.js");
                    // 表头
                    let tHeader = [
                        "学生",
                        "教师",
                        "课程编号",
                        "课程名",
                        "学分",
                        "成绩"
                    ];
                    //表头对应字段名，要和下面数据key对应
                    let filterVal = [
                        "sname",
                        "tname",
                        "cno",
                        "cname",
                        "ccredit",
                        "grade"
                    ];
                    // 数据来源
                    let list = this.allTableData;
                    let data = this.formatJson(filterVal, list); //数据格式化
                    var index1 = "我的所有选课信息"; //导出时文件名
                    exportJsonToExcel(tHeader, data, index1); //导出文件
                });
            },
            formatJson(filterVal, jsonData) {
                // 导出excel数据格式化
                return jsonData.map(v => filterVal.map(j => v[j]));
            },
            handleSelectionChange(val){
                //监听多选框值动态变化的事件
                this.multipleSelection = val;
            },
            handleSizeChange(val) {
                //监听pageSize
                this.queryInfo.pageSize=val;
                this.selectSctByConditionAndPage();
            },
            handleCurrentChange(val) {
                //监听currentPage
                this.queryInfo.currentPage=val;
                this.selectSctByConditionAndPage();
            },
            selectSctByConditionAndPage(){
                //this.common.getAllDataByConditionAndPage(this,this.apiUrl.selectSctByPageAndConditionAndSno);
                let that=this;
                let params={
                    sno:JSON.parse(localStorage.getItem('user')).sno,
                    condition:this.queryInfo.condition,
                    currentPage:this.queryInfo.currentPage,
                    pageSize:this.queryInfo.pageSize
                }
                this.$axios.get(this.apiUrl.selectSctByPageAndConditionAndSno,{
                    params:params
                }).then(response=>{
                    that.tableData = response.data.data.data;
                    that.total = response.data.data.total;
                }).catch(error=>{
                    console.log('--error--',error);
                })
            },
            selectAllSct(){
                let that=this;
                let params={
                    sno:JSON.parse(localStorage.getItem('user')).sno
                }
                this.$axios.get(this.apiUrl.selectAllSctByNo,{
                    params:params
                }).then(response=>{
                    that.allTableData=response.data.data.data;
                }).catch(error=>{
                    console.log('---error--',error);
                })

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