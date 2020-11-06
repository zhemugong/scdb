<!--院系报表-->
<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
            <el-breadcrumb-item>院系报表</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="totalAndCircle">
            <el-card shadow="always" class="totalCard">
                <!--学院总数显示-->
                <p class="title">学院总数</p>
                <div class="photoAndNums">
                    <el-image style="width:100px;height:100px" :src="departmentIcon" fit="contain"></el-image>
                    <p>{{total}}</p>
                </div>
            </el-card>

            <el-card shadow="always" class="detailCard" id="departmentContainStudent">
                <!--每个学院人数显示-->
            </el-card>
        </div>

        <el-card shadow="always" id="boyAndGirl_rate">
                <!--每个学院男女比例显示-->
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "departmentStatistic",
        data(){
            return {
                departmentIcon:require("../assets/images/department.png"),
                total:0,     //学院总数
                departmentStatistic:[],  //各学院人数及学院男女比例
                departments:[],        //显示有哪些学院
                seriesData:[],         //饼状图要显示的数据
                barData:[ ['product', '男', '女']]              //柱状图显示数据
            }
        },
        mounted(){
            this.getAllDepartment();
            this.selectDepartmentRate();
        },
        methods:{
            getAllDepartment(){
                let that=this;
                //获取学院总数量
                this.$axios.get(this.apiUrl.departmentCount).then(response=>{
                    that.total=JSON.parse(response.data.data.total);
                }).catch(error=>{
                    console.log('--error--',error);
                })
            },
            selectDepartmentRate(){
                //查看各学院总人数和男女比例
                let that=this;
                this.$axios.get(this.apiUrl.selectDepartmentRate).then(response=>{
                    that.departmentStatistic=JSON.parse(response.data.data.data);
                    for(let i=0;i<that.departmentStatistic.length;i++){
                        that.departments[i]=that.departmentStatistic[i].department
                        let arr=new Array();
                        arr.push(that.departmentStatistic[i].department);
                        arr.push(that.departmentStatistic[i].boy);
                        arr.push(that.departmentStatistic[i].girl);
                        that.barData.push(arr);
                    }
                    that.showPie();
                    that.showBar();
                }).catch(error=>{
                    console.log('--error--',error);
                })
            },
            showPie(){
               //显示饼状图
                let data=this.getData();
                //展示echart饼状数据
                let myChart = this.$echarts.init(document.getElementById('departmentContainStudent'),"light");
                let option={
                    title: {
                        text: '各学院人数',
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
                            radius: '60%',  //扇形面积多大
                            center: ['50%', '60%'], //扇形位置
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
            getData(){
                //获取饼状图和柱状图所需数据
                let legendData=this.departments;
                for(let i=0;i<this.departmentStatistic.length;i++){
                    this.seriesData.push(
                        {
                            name:this.departmentStatistic[i].department,
                            value:this.departmentStatistic[i].total
                        }
                    )
                }
                return {
                    legendData:legendData,
                    seriesData: this.seriesData,
                    barData:this.barData
                }
            },
            showBar(){
                //显示柱状图  boyAndGirl_rate
                let data=this.getData();
                let myChart = this.$echarts.init(document.getElementById('boyAndGirl_rate'),"light");
                let option={
                    //'#61a0a8','#d48265'
                    color: ['#61a0a8','#d48265'],
                    title: {
                        text: '各学院男女比例',
                        left: 'left'
                    },
                    legend:{},
                    tooltip: {},
                    dataset: {
                        source:data.barData
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
        margin: 0 10px;
        height:300px;
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