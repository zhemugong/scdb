<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
            <el-breadcrumb-item>选课报表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card shadow="always" id="studyCourseFromStudent">
            <el-row>
                <el-col :span="8">
                    <!--搜索框-->
                    <el-input v-model="queryInfo.condition" placeholder="请输入课程名/学生姓名进行查询" clearable >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5" :offset="3">
                    <!--下拉选择题-->
                    <el-select v-model="value" placeholder="请选择" @change="changeSelect">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3" :offset="5">
                    <el-button type="success" @click="exportToExcel">数据导出</el-button>
                </el-col>
            </el-row>


            <!--表格-->
            <!-- //选择每门课程有多少人选-->
            <el-table
                    v-if="judgeSelection"
                    stripe
                    border
                    :data="courseData">
                <el-table-column
                        prop="tname"
                        label="教师"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="cname"
                        label="课程名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="ccredit"
                        label="学分">
                </el-table-column>
                <el-table-column
                        prop="total"
                        label="选的人数">
                </el-table-column>
            </el-table>

            <!--//选择每个学生修了多少门课程-->
            <el-table
                   v-else
                    stripe
                    border
                    :data="studentData">
                <el-table-column
                        prop="sname"
                        label="学生"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="total_course"
                        label="总共修了多少课程"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="total_ccredit"
                        label="总共修了多少学分">
                </el-table-column>
            </el-table>

            <!--分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="this.currentPage"
                    :page-sizes="[1,2,5,10]"
                    :page-size="this.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>


        </el-card>
    </div>
</template>

<script>
    export default {
        name: "sctStatistic",
        data(){
            return {
                total:0,
                queryInfo:{
                    condition:'',
                    currentPage:1,
                    pageSize:5
                },
                courseData: [],
                options: [{
                    value: '每门课程有多少人选',
                    label: '每门课程有多少人选'
                }, {
                    value: '每个学生修了多少门课',
                    label: '每个学生修了多少门课'
                }],
                value: '每门课程有多少人选',
                line_x_data:[],     //折线图横坐标
                line_y_data:[],     //折线图纵坐标
                studentData:[],
            }
        },
        computed:{
            //表格一开始的内容显示
            judgeSelection:function () {
                if(this.value=='每门课程有多少人选'){
                    //选择每门课程有多少人选
                    this.studyCourseFromStudent();
                    return true;
                }else{
                    this.studentStudyCourse();
                    return false;
                }
            }
        },
        methods:{
            handleSizeChange(val){
                //监听pageSize
                this.page.pageSize=val;
                if(this.value=='每门课程有多少人选'){
                    //每门课程有多少人选
                    this.studyCourseFromStudent();
                }else{
                    //每个学生修了多少门课程
                    this.studentStudyCourse();
                }
            },
            handleCurrentChange(val) {
                //监听currentPage
                this.page.currentPage=val;
                if(this.value=='每门课程有多少人选'){
                    //每门课程有多少人选
                    this.studyCourseFromStudent();
                }else{
                    //每个学生修了多少门课程
                    this.studentStudyCourse();
                }
            },
            changeSelect(val){
               //select绑定事件
                if(val=='每门课程有多少人选'){
                    //选择每门课程有多少人选
                    this.studyCourseFromStudent();
                }else {
                    //每个学生修了多少门课
                    this.studentStudyCourse();
                }
            },
            studyCourseFromStudent(){
                //每门课程多少学生修
                let that=this;
                let params={
                    condition:this.queryInfo.condition,
                    currentPage:this.queryInfo.currentPage,
                    pageSize:this.queryInfo.pageSize
                }
                this.$axios.get(this.apiUrl.studyCourseFromStudent,{
                    params:params
                }).then(response=>{
                    that.total=response.data.data.total;
                    that.courseData=response.data.data.data;

                }).catch(error=>{
                    console.log('---error--',error);
                })
            },
            studentStudyCourse(){
                //每个学生修了多少门课
                let that=this;
                let params={
                    condition:this.queryInfo.condition,
                    currentPage:this.queryInfo.currentPage,
                    pageSize:this.queryInfo.pageSize
                }
                this.$axios.get(this.apiUrl.studentStudyCourse,{
                    params:params
                }).then(response=>{
                    that.total=response.data.data.total;
                    that.studentData=response.data.data.data;
                }).catch(error=>{
                    console.log('----error---',error);
                })
            },
            exportToExcel(){
                //导出excel
                if(this.value=='每门课程有多少人选'){
                    //每门课程有多少人选
                    this.studyCourseFromStudentToExcel();
                }else{
                    //每个学生修了多少门课
                    this.studentStudyCourseToExcel();
                }
            },
            showLine(){
                //折线图显示
                let data=this.getData();
                let myChart = this.$echarts.init(document.getElementById('studyCourseFromStudent'),"light");
                let option = {
                    title: {
                        text: '每门课程多少学生修',
                        left: 'center'
                    },
                    xAxis: {
                        type: "category",
                        data: data.line_x_data
                    },
                    yAxis: {},
                    series: [{
                        data: data.line_y_data,
                        type: "line"
                    }]
                }
                myChart.setOption(option);
            },

            studyCourseFromStudentToExcel(){
                //每门课程多少学生修,用于导出excel
                require.ensure([], () => {
                    let { exportJsonToExcel } = require("../excel/Export2Excel.js");
                    // 表头
                    let tHeader = [
                        "教师",
                        "课程名",
                        "学分",
                        "选的人数",
                    ];
                    //表头对应字段名，要和下面数据key对应
                    let filterVal = [
                        "tname",
                        "cname",
                        "ccredit",
                        "total",
                    ];
                    // 数据来源
                    let list = this.courseData;
                    let data = this.formatJson(filterVal, list); //数据格式化
                    var index1 = "每门课程选的人数"; //导出时文件名
                    exportJsonToExcel(tHeader, data, index1); //导出文件
                });
            },

            studentStudyCourseToExcel(){
                //每个学生修了多少门课，用于导出excel的数据
                require.ensure([], () => {
                    let { exportJsonToExcel } = require("../excel/Export2Excel.js");
                    // 表头
                    let tHeader = [
                        "学生",
                        "总共修了多少课程",
                        "总共修了多少学分",
                    ];
                    //表头对应字段名，要和下面数据key对应
                    let filterVal = [
                        "sname",
                        "total_course",
                        "total_ccredit",
                    ];
                    // 数据来源
                    let list = this.studentData;
                    let data = this.formatJson(filterVal, list); //数据格式化
                    var index1 = "学生修的课程数"; //导出时文件名
                    exportJsonToExcel(tHeader, data, index1); //导出文件
                });
            },
            formatJson(filterVal, jsonData) {
                // 导出excel数据格式化
                return jsonData.map(v => filterVal.map(j => v[j]));
            },
        }
    }
</script>

<style scoped>
    .el-table{
        margin:15px auto;
    }
    .el-card{
        margin:15px 0;
        padding:10px;
    }
</style>