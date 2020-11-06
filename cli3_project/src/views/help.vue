<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>使用帮助</el-breadcrumb-item>
            <el-breadcrumb-item>帮助手册</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片布局-->
        <el-card shadow="always">
            <h1>一 :登录页面</h1>
                <h2>1.登录</h2>
                    <h3>输入学号和密码点击登录</h3>
                <h2>2.找回密码</h2>
                     <h3>输入学号和身份证号找回密码</h3>

            <h1>二:首页</h1>
                <h2>信息管理模块:</h2>
                    <h3>
                        <el-image :src="require('@/assets/images/photo.png')"
                                 style="width:80%; height:400px;margin-bottom:10px;" fit="fill"></el-image>
                        <h3>1.点击单个添加</h3>
                        <h3>
                            <strong>2.批量添加:</strong>首先点击批量添加，选择excel文件进行上传，上传完毕之后点击数据上传即可<br/>
                            <p style="text-indent:6em;">注意:<span style="color:red;">excel表中的数据类型要与页面上表格数据类型对应且一致，否则容易报错</span></p>
                        </h3>
                        <h3>3.导出excel:点击数据导出，系统自动将页面中表格数据导出到excel表中</h3>
                        <h3>4.普通学生不具有新增、修改、删除权限，但具有查询的权限。学生管理员具有所有权限</h3>
                    </h3>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "help",
        data(){
            return {

            }
        }
    }
</script>

<style scoped>
    .el-breadcrumb{
        margin-bottom: 15px;
    }
    h1{
        margin:20px 0;
    }
    h2{
        text-indent: 2em;
        margin:10px 0;
    }
    h3{
        margin:5px 0;
        text-indent: 4em;
    }
</style>