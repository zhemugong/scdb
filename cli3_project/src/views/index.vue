<template>
        <el-container class="all">
            <el-header>
                <div class="left_header">
                    <img src="../assets/images/logo_school.png" width="150" height="40">
                    <span>学生选课管理系统</span>
                </div>
                <div class="right_header">
                    <el-image :src="photo"  style="width:50px; height:50px;margin-right:10px;" fit="contain"></el-image>
                    <el-dropdown @command="handleCommand">
                            <span class="el-dropdown-link">
                                {{sname}} <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">个人信息</el-dropdown-item>
                            <el-dropdown-item command="b">修改密码</el-dropdown-item>
                            <el-dropdown-item command="c">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <el-aside width="220px">
                    <el-menu
                            background-color="#2d2f36"
                            text-color="#fff"
                            active-text-color="#409EFF"
                            unique-opened
                            router>
                        <el-submenu :index="''+item.id" v-for="item in menuItems" :key="item.id">
                            <template slot="title">
                                <i :class="item.type"></i>
                                <span>{{item.name}}</span>
                            </template>

                            <el-menu-item :index="''+per.path" v-if="showHiddenItem(per.canSee)"  v-for="per in item.children" :key="per.id">
                                <template slot="title">
                                    <i :class="per.type"></i>
                                    <span>{{per.name}}</span>
                                </template>
                            </el-menu-item>

                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>

            <!--弹出个人信息对话框-->
            <el-dialog title="修改个人信息" :visible.sync="dialogFormVisible" width="40%" @close="resetDialogForm">
                <el-form :model="form" ref="form" :rules="rules">
                    <el-form-item label="学号" :label-width="labelWidth" >
                        <el-input v-model="form.sno" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" :label-width="labelWidth">
                        <el-input v-model="form.sname" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="labelWidth">
                        <el-input v-model="form.ssex" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" :label-width="labelWidth">
                        <el-input v-model="form.sage" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="学院" :label-width="labelWidth">
                        <el-input v-model="form.sdept" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="身份证" prop="sid" :label-width="labelWidth">
                        <el-input v-model="form.sid" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="身份" :label-width="labelWidth">
                        <el-input v-model="form.power" disabled></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetDialogForm">取 消</el-button>
                    <el-button type="primary" @click="changeSidBySno('form')">确 定</el-button>
                </div>
            </el-dialog>

            <!--修改密码框-->
            <el-dialog title="修改密码" :visible.sync="changePasswordDialogVisible"
                       width="35%" @close="resetChangePasswordDialog">
                <el-form :model="changePasswordForm" ref="changePasswordForm" :rules="rules">
                    <el-form-item label="输入原密码" :label-width="labelWidth" prop="previewPassword">
                        <el-input type="password" v-model="changePasswordForm.previewPassword" placeholder="请输入原来密码" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="设置新密码":label-width="labelWidth" prop="newPassword">
                        <el-input v-model="changePasswordForm.newPassword" type="password" placeholder="请输入密码" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" :label-width="labelWidth" prop="confirmPassword">
                        <el-input v-model="changePasswordForm.confirmPassword" type="password" placeholder="请确认密码" clearable></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetChangePasswordDialog">取 消</el-button>
                    <el-button type="primary" @click="changePassword">确 定</el-button>
                </div>
            </el-dialog>
        </el-container>
</template>

<script>
    export default {
        name: "index",
        data(){
            //用于验证两次输入密码
            let validatePass2 = (rule, value, callback) => {
                if (value !== this.changePasswordForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                rules:{
                    sno:[{required:true,message:'请输入学号',trigger:'blur'},
                        ],
                    previewPassword:[{required:true,message:'请输入密码',trigger:'blur'},
                        { min: 5, max: 20, message: '长度在 5到 20个字符', trigger: 'blur'}],
                    newPassword:[{required:true,message:'请输入密码',trigger:'blur'},
                        { min: 5, max: 20, message: '长度在 5到 20个字符', trigger: 'blur'}],
                    confirmPassword:[{required:true,message:'请输入密码',trigger:'blur'},
                        { min: 5, max: 20, message: '长度在 5到 20个字符', trigger: 'blur'},
                        {validator:validatePass2,trigger:'blur'}],
                    sid:[{required:true,message:'请输入身份证号',trigger:'blur'},
                        {pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,message:'请输入正确的身份证号码',trigger:'blur'}
                        ],
                },
                changePasswordForm:{
                    previewPassword:'',
                    newPassword:'',
                    confirmPassword:''
                },
                photo:require("../assets/images/me.png"),
                sname:'',
                form:{
                    sno:'',
                    sname:'',
                    ssex:'',
                    sage:0,
                    sdept:'',
                    sid:'',
                    power:''
                },
                dialogFormVisible:false,
                changePasswordDialogVisible:false,
                labelWidth:'100px',

            }
        },
        created(){
            //判断是否登录
            if(localStorage.getItem('token')!=undefined){
                //显示用户名
                this.sname=JSON.parse(localStorage.getItem('user')).sname;
                //显示左侧导航栏
                this.menuItems=this.$store.state.menuItems;
            }else{
                this.$message({
                    type:'error',
                    message:'请重新登录'
                })
                this.$router.push("/");
            }
        },
        methods:{
            resetDialogForm(){
                //重置个人信息密码对话框
                this.$refs['form'].resetFields();
                this.dialogFormVisible=false;
            },
            changeSidBySno(formName){
                //根据学号修改身份证号
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //校验通过
                        let that=this;
                        let formData=new FormData();
                        formData.append('sno',JSON.parse(localStorage.getItem('user')).sno);
                        formData.append("sid",this.form.sid);
                        this.$axios({
                            method:'post',
                            data:formData,
                            url:this.apiUrl.changeSidBySno
                        }).then(response=>{
                            if(response.data.status==200){
                                //修改成功
                                that.$message({
                                    type:'success',
                                    message:response.data.data.detailMessage
                                })
                                that.dialogFormVisible=false;
                            }else{
                                //修改失败
                                that.common.errorReturn(that,response.data.data.detailMessage);
                            }
                        }).catch(error=>{
                            console.log('---error----',error);
                        })
                    }
                })
            },
            showHiddenItem(canSee){
                //显示隐藏的侧边栏选项

                if(JSON.parse(localStorage.getItem('user')).power=='学生管理员'){
                    return true;
                }
                return canSee;
            },
            showStudentInfo(){
                //显示学生个人信息
                let that=this;
                let params={
                    sno:JSON.parse(localStorage.getItem('user')).sno
                }
                this.$axios.get(this.apiUrl.selectStudentInfoBySno,{
                    params:params
                }).then(response=>{
                    that.form=response.data.data.data;
                }).catch(error=>{
                    console.log('---error--',error);
                })
            },

            changePassword(){
                //修改密码
                let that=this;
                let formData=new FormData();
                formData.append('sno',JSON.parse(localStorage.getItem('user')).sno);
                formData.append('newPassword',this.changePasswordForm.newPassword);
                formData.append('previewPassword',this.changePasswordForm.previewPassword);
                this.$axios({
                    method:'post',
                    data:formData,
                    url:this.apiUrl.updatePasswordByPreviewPassword
                }).then(response=>{
                    if(response.data.status==200){
                        //修改成功
                        that.$message({
                            type:'success',
                            message:response.data.data.detailMessage
                        })
                        that.changePasswordDialogVisible=false;
                    }else {
                        //修改失败
                        that.common.errorReturn(that,response.data.data.detailMessage);
                    }
                }).catch(error=>{
                    console.log('---error---',error);
                })
            },
            resetChangePasswordDialog(){
                //重置修改密码对话框
                this.$refs['changePasswordForm'].resetFields();
                this.changePasswordDialogVisible=false;
            },
            handleCommand(command){
                //点击下拉列表项时触发此事件
                switch (command) {
                    case 'a':
                        //点击查看个人信息，弹出对话框查看个人信息
                        this.showStudentInfo();
                        this.dialogFormVisible=true;
                        break;
                    case 'b':
                        //点击修改密码对话框
                        this.changePasswordDialogVisible=true;
                        break;
                    case 'c':
                        //点击退出登录,弹出确认对话框
                        this.$confirm('是否退出登录', '退出登录', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        })
                            .then(() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                this.$message({
                                    type: 'success',
                                    message: '退出成功'
                                });
                                this.$router.push("/");
                            })
                            .catch(action => {

                            });
                        break;
                }
            },
        }
    };
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        border:1px solid black;
    }
    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
    .all{
        height:100%;
    }
    .el-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #24262e;
        color: #fff;
    }
    .left_header{
        display: flex;
        align-items: center;
        font-size:20px;
    }
    .right_header{
        display: flex;
        align-items: center;
        margin-right:20px;

    }
    .left_header>span{
        margin-left:10px;
    }
    .el-menu span{
        font-size:15px;
    }
    .el-aside{
        background:#2d2f36;
        color: #ccc;
    }
    .el-main{
        background: rgb(241, 241, 241);
        overflow: hidden;
    }
    .el-menu{
        border-right:none;
    }
    .el-dropdown-link{
        cursor: pointer;
        display: flex;
        align-items: center;
        color: #fff;
        font-size:18px;
    }
</style>