<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
            <el-breadcrumb-item>课程报表</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="totalAndCircle">
            <el-card shadow="always" class="totalCard">
                <!--课程总数显示-->
                <p class="title">课程总数</p>
                <div class="photoAndNums">
                    <el-image style="width:100px;height:100px" :src="courseIcon" fit="contain"></el-image>
                    <p>{{total}}</p>
                </div>
            </el-card>

            <el-card shadow="always" class="detailCard" id="selectCourseGroupByCcredit">
                <!--根据学分划分课程-->
            </el-card>
        </div>
        <el-card shadow="always" id="boyAndGirl_rate">
            <!--显示热门课程排行榜-->
            <p class="title">热门课程排行榜</p>
            <el-carousel type="card" height="200px">
                <el-carousel-item v-for="item in courseData" :key="item.cno">
                    <h3>课程名:{{ item.cname}}</h3>
                    <h3>教师名:{{ item.tname}}</h3>
                    <h3>选择人数:{{ item.total}}</h3>
                </el-carousel-item>
            </el-carousel>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "courseStatistic",
        data(){
            return {
                courseIcon:require("../assets/images/course.png"),
                courseGroupByCredit:[],         //根据学分划分课程数据总量
                legendData:[],                  //用于legend显示
                seriesData:[],         //饼状图要显示的数据
                total:0,
                courseData:[],
                gold:require("../assets/images/gold.png"),
                sliver:require("../assets/images/sliver.png"),
                copper:require("../assets/images/copper.png")
            }
        },
        mounted(){
            this.getAllCourse();
            this.selectCourseGroupByCcredit();
            this.studyCourseFromStudent();
        },
        methods:{
            getAllCourse(){
                let that=this;
                this.$axios.get(this.apiUrl.courseCounts).then(response=>{
                    that.total=JSON.parse(response.data.data.total);
                }).catch(error=>{
                    console.log('---error--',error);
                })
            },
            selectCourseGroupByCcredit(){
                //根据学分划分课程
                let that=this;
                this.$axios.get(this.apiUrl.selectCourseGroupByCcredit).then(response=>{
                      that.courseGroupByCredit=JSON.parse(response.data.data.data);
                      for(let i=0;i< that.courseGroupByCredit.length;i++){
                          that.legendData[i]=that.courseGroupByCredit[i].ccredit
                      }
                      that.showPie();
                }).catch(error=>{
                    console.log('--error--',error);
                })
            },
            getData(){
                //获取饼状图数据
                for(let i=0;i<this.courseGroupByCredit.length;i++){
                    this.seriesData.push({
                        name:this.courseGroupByCredit[i].ccredit,
                        value:this.courseGroupByCredit[i].total
                    })
                }
                return {
                    legendData:this.legendData,
                    seriesData:this.seriesData
                }
            },
            showPie(){
                //生成饼状图
                let data=this.getData();
                let myChart = this.$echarts.init(document.getElementById('selectCourseGroupByCcredit'),"light");
                let option={
                    title: {
                        text: '各学分的课程数目',
                        left: 'right'
                    },
                    tooltip: {
                        //当鼠标移动到扇形图的每一项显示内容
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        //扇形组成部分(位于最左侧)
                        orient: 'vertical',
                        left: 'left',
                        data:data.legendData
                    },
                    series: [
                        {
                            name: '访问来源',//点击扇形的某一项是显示的标题
                            type: 'pie',    //数据类型
                            radius:["50%", "70%"],
                            center: ['50%', '60%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: "center"
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: "30",
                                        fontWeight: "bold"
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:data.seriesData,
                            emphasis: {
                                //点击具体某一项时出现阴影效果
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option);
            },
            studyCourseFromStudent(){
                //每门课程多少学生修
                let that=this;
                let params={
                    condition:"",
                    currentPage:1,
                    pageSize:3
                }
                this.$axios.get(this.apiUrl.studyCourseFromStudent,{
                    params:params
                }).then(response=>{
                    that.courseData=response.data.data.data;
                }).catch(error=>{
                    console.log('---error--',error);
                })
            }
        }
    }
</script>

<style scoped>
    .title{
        font-size: 20px;
        font-weight: bold;
    }
    .el-breadcrumb{
        margin-bottom: 15px;
    }
    #boyAndGirl_rate{
        width: 98%;
        height:300px;
        margin:0 10px;
        padding:15px;
    }
    .totalCard,.detailCard{
        width: 50%;
        margin:10px;
        padding:10px;
    }
    .photoAndNums{
        width: 30%;
        margin: 10px auto;
        text-align: center;
        font-size:30px;
    }
    .totalAndCircle{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-bottom:10px;
    }
    .el-carousel__item h3 {
        /*#475669*/
        color:#303133;
        font-size: 18px;
        opacity: 0.75;
        text-align: center;
    }
    .el-carousel__item:nth-child(2n),.el-carousel__item:nth-child(2n+1){
      /*  background-color: #99a9bf;*/
        /*#d3dce6*/
        /*  -webkit-linear-gradient(left,#EF33B1,hsla(0,0%,59%,0),#F6E6BC) no-repeat; */
        background:  linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);
        box-shadow: -5px -5px 5px 5px rgba(0, 0, 0, .05);
        -webkit-box-shadow: #d4d2d2 5px 5px 10px;
        -moz-box-shadow: #d4d2d2 5px 5px 10px;
    }
</style>