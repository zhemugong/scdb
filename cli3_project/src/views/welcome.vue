<template>
    <!--欢迎页面-->
    <div class="title">
      欢迎登录肇庆学院学生选课管理系统
        <el-carousel :interval="4000" type="card" height="250px">
            <el-carousel-item v-for="item in urls" :key="item">
                <el-image :src="require('../assets/images/'+item+'.jpg')"
                          fit="fill"
                          style="width: 100%;height:100%;" lazy>
                </el-image>
            </el-carousel-item>
        </el-carousel>
    </div>

</template>

<script>
    export default {
        name: "welcome",
        data(){
            return {
                urls:[
                    "art",
                    "music",
                    "firstClass",
                    "squre",
                    "threeClass",
                    "gym",
                    "library"
                ],
            }
        }
    }
</script>

<style scoped>
.title{
    text-align: center;
    font-family:"微软雅黑";
    font-size:35px;
    color:#3091f2;
    transform:translateY(50px);
}
.el-carousel{
    margin:50px 0;
}
.el-carousel__item h3 {
    opacity: 0.75;
    padding: 0;
}
.el-carousel__item:nth-child(2n) {
    background-color: #d3dce6;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>