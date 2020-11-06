<template>
    <!--学生信息统计-->
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
            <el-breadcrumb-item>学生报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--打印按钮-->
        <!--<el-row>
            <el-col :span="3" :offset="22">
                <el-button type="primary" @click="prints()">打印</el-button>
            </el-col>
        </el-row>-->

        <!--卡片布局-->
        <div id="total">
            <el-card shadow="always" class="total">
                <p>学生总人数</p>
                <div class="photoAndNums">
                    <el-image style="width:100px;height:100px" :src="peopleIcon" fit="contain"></el-image>
                    <p>{{total}}</p>
                </div>
            </el-card>
            <div class="boyAndGirl">
                <el-card shadow="always">
                    <p>男生总人数</p>
                    <div class="photoAndNums">
                        <el-image style="width:100px;height:100px" :src="boyIcon" fit="contain"></el-image>
                        <p>{{boy}}</p>
                    </div>
                </el-card>
                <el-card shadow="always">
                    <p>女生总人数</p>
                    <div class="photoAndNums">
                        <el-image style="width:100px;height:100px" :src="girlIcon" fit="contain"></el-image>
                        <p>{{girl}}</p>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "studentStatistic",
        data(){
            return {
                peopleIcon:require("../assets/images/people.png"),
                boyIcon:require("../assets/images/boy.png"),
                girlIcon:require("../assets/images/girl.png"),
                total:0,    //总人数
                boy:0,      //男生人数
                girl:0      //女生人数
            }
        },
        created(){
            this.getStudentStatistic();
        },
        methods:{
            getStudentStatistic(){
                //获取学生报表数据
                let that=this;
                this.$axios.get(this.apiUrl.studentStatistic).then(response=>{
                    that.total=JSON.parse(response.data.data.data).total ;
                    that.boy=JSON.parse(response.data.data.data).boy;
                    that.girl=JSON.parse(response.data.data.data).girl;

                   /* that.total=JSON.parse(response.data.data.data.total);
                    that.boy=JSON.parse(response.data.data.data.boy);
                    that.girl=JSON.parse(response.data.data.data.girl);*/
                }).catch(error=>{
                    console.log('---error---',error);
                })
            }
        }
    }
</script>

<style scoped>

    .el-breadcrumb{
        margin-bottom: 15px;
    }
    .el-card{
        width:45%;
    }
    .total{
        margin:20px auto;
    }
    .photoAndNums{
        width: 30%;
        margin: 10px auto;
        text-align: center;
        font-size:30px;
    }
    .boyAndGirl{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
</style>