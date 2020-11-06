<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
            <el-breadcrumb-item>教师报表</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="totalAndCircle">
            <el-card shadow="always" class="totalCard">
                <!--教师总数显示-->
                <p class="title">教师总数:{{total}}</p>
                <div class="photoAndNums">
                    <el-image style="width:80px;height:80px" :src="boyTeacher" fit="contain"></el-image>
                    <p>{{man}}</p>
                    <el-image style="width:80px;height:80px" :src="girlTeacher" fit="contain"></el-image>
                    <p>{{woman}}</p>
                </div>
            </el-card>

            <el-card shadow="always" class="detailCard" id="teacher_teb">
                <!--教师学历显示-->
            </el-card>
        </div>

        <el-card shadow="always" id="teacher_tpt">
            <!--每个学院男女比例显示-->
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "teacherStatistic",
        data(){
            return {
                girlTeacher:require("../assets/images/girlTeacher.png"),
                boyTeacher:require("../assets/images/boyTeacher.png"),
                total:0,     //教师总数,
                woman:0,      //女教师
                man:0,        //男教师
                teacher_tebBarData:[ ['product', '男', '女']],   //教师学历柱状图显示数据
                teacher_tptBarData:[['product', '男', '女']],     //教师职称柱状图显示数据
            }
        },
        mounted(){
            this.getAllTeacherCount();
            this.selectTeacherOrderByTeb();
            this.selectTeacherOrderByTpt();
        },
        methods:{
            getAllTeacherCount(){
                let that=this;
                //获取教师总数量
                this.$axios.get(this.apiUrl.teacherCounts).then(response=>{
                    that.total=JSON.parse(response.data.data.data).total;
                    that.man=JSON.parse(response.data.data.data).man;
                    that.woman=JSON.parse(response.data.data.data).woman
                }).catch(error=>{
                    console.log('--error--',error);
                })

            },
            selectTeacherOrderByTeb(){
                //显示教师学历男女比例
                let that=this;
                this.$axios.get(this.apiUrl.selectTeacherOrderByTeb).then(response=>{
                    let datas=JSON.parse(response.data.data.data);
                    for(let i=0;i<datas.length;i++){
                        let arr=new Array();
                        arr.push(datas[i].teb);
                        arr.push(datas[i].man);
                        arr.push(datas[i].woman);
                        that.teacher_tebBarData.push(arr);
                    }
                    that.showTeacher_tebBar();
                }).catch(error=>{
                    console.log('---error---',error);
                })
            },
            selectTeacherOrderByTpt(){
                //显示教师职称男女比例
                let that=this;
                this.$axios.get(this.apiUrl.selectTeacherOrderByTpt).then(response=>{
                    let datas=JSON.parse(response.data.data.data);
                    for(let i=0;i<datas.length;i++){
                        let arr=new Array();
                        arr.push(datas[i].tpt);
                        arr.push(datas[i].man);
                        arr.push(datas[i].woman);
                        that.teacher_tptBarData.push(arr);
                    }

                    that.showTeacher_tptBar();
                }).catch(error=>{
                    console.log('---error----',error);
                })
            },
            showTeacher_tebBar(){
                //显示教师学历比例柱状图
                let data=this.getData();
                let myChart = this.$echarts.init(document.getElementById('teacher_teb'),"light");
                let option={
                    title: {
                        text: '各学历男女比例',
                        left: 'right'
                    },
                    legend:{},
                    tooltip: {},
                    dataset: {
                        source:data.teacher_tebBarData
                    },
                    xAxis: {type: 'category'},
                    yAxis: {},
                    series: [
                        {
                            type: 'bar',
                        },
                        {
                            type: 'bar',
                        }
                    ]
                }
                myChart.setOption(option);
            },
            showTeacher_tptBar(){
                //显示教师职称男女比例柱状图
                let data=this.getData();
                let myChart = this.$echarts.init(document.getElementById('teacher_tpt'),"light");
                let option={
                    title: {
                        text: '各职称男女比例',
                        left: 'left'
                    },
                    legend:{},
                    tooltip: {},
                    dataset: {
                        source:data.teacher_tptBarData
                    },
                    xAxis: {type: 'category'},
                    yAxis: {},
                    series: [
                        {
                            type: 'bar',
                        },
                        {
                            type: 'bar',
                        }
                    ]
                }
                myChart.setOption(option);
            },
            getData(){
                //获取教师学历男女比例数据
                //console.log('--12-1--',this.teacher_tebBarData)
                return {
                    teacher_tebBarData:this.teacher_tebBarData,
                    teacher_tptBarData:this.teacher_tptBarData
                }
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
    #teacher_tpt{
        width: 98%;
        height:300px;
        margin: 0 10px;
        padding:20px;
    }
    .totalCard,.detailCard{
        width: 50%;
        margin:10px;
        padding:5px;
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
</style>