<template>
    <div class="login">
        <div class="info">
            <span class="title">欢迎登录学生选课管理系统</span><br><br>
            <el-row :gutter="10">
                <el-switch
                    style="display: block"
                    v-model="pageMode"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="登录"
                    inactive-text="注册">
                </el-switch>
            </el-row>
            
            
            

            
            <el-form :model="login_Form" ref="login_Form" :rules="rules" class="demo-ruleForm" v-if="pageMode"> 
                <el-form-item prop="sno">
                    <el-input type="text" v-model="login_Form.sno" class="login_item" placeholder="请输入学号" clearable></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="login_Form.password" class="login_item" placeholder="请输入密码" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="login_item" @click="login('login_Form')">登录</el-button>
                </el-form-item>
                <el-link :underline="false"  type="primary" @click="findPasswordDialogVisible=true">找回密码<i class="el-icon-view el-icon--right"></i></el-link>
            </el-form>

            <el-form :model="login_Form" ref="register_Form" :rules="rules" class="demo-ruleForm" v-if="!pageMode">
                <el-form-item>
                    <el-input type="text" v-model="register_Form.sno" class="login_item" placeholder="请输入学号" clearable></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input type="password" v-model="register_Form.password" class="login_item" placeholder="请输入密码" clearable></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input type="password" v-model="register_Form.repassword" class="login_item" placeholder="再次输入密码" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="login_item" @click="register()">注册</el-button>
                </el-form-item>
                <el-link :underline="false"  type="primary" @click="findPasswordDialogVisible=true">找回密码<i class="el-icon-view el-icon--right"></i></el-link>
            </el-form>
        </div>

        <!--找回密码对话框-->
        <el-dialog title="找回密码" :visible.sync="findPasswordDialogVisible"
                   width="35%" @close="resetFindPasswordDialog">
            <el-form :model="findPasswordForm" ref="findPasswordForm" :rules="rules">
                <el-form-item label="学号" :label-width="labelWidth" prop="sno">
                    <el-input v-model="findPasswordForm.sno" placeholder="请输入学号" clearable></el-input>
                </el-form-item>
                <el-form-item label="身份证号" :label-width="labelWidth" prop="sid">
                    <el-input v-model="findPasswordForm.sid" placeholder="请输入身份证号" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetFindPasswordDialog">取 消</el-button>
                <el-button type="primary" @click="findPassword('findPasswordForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return {
                pageMode: true,
                findPasswordForm:{
                    sno:'',
                    sid:''
                },
                findPasswordDialogVisible:false,
                labelWidth:'100px',
                rules:{
                    //  {pattern:/\b\d{12}\b/,message:'请输入12位数字的学号',trigger:'blur'}
                    //  {pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,message:'请输入正确的身份证号码',trigger:'blur'}

                    sno:[{required:true,message:'请输入学号',trigger:'blur'},
                        {pattern:/\b\d{12}\b/,message:'请输入12位数字的学号',trigger:'blur'}
                        ],
                    password:[{required:true,message:'请输入密码',trigger:'blur'},
                        { min: 5, max: 20, message: '长度在 5到 20个字符', trigger: 'blur'}],
                    sid:[{required:true,message:'请输入身份证号',trigger:'blur'},
                        {pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,message:'请输入正确的身份证号码',trigger:'blur'}
                        ],
       
                },
                login_Form: {
                    sno: '',
                    password: ''
                },
                register_Form: {
                    sno: '',
                    password: '',
                    repassword:''
                }
            };
        },
        methods:{
            register() {
                var relForm;
                if(this.register_Form.password === this.register_Form.repassword) {
                    relForm = {
                        sno: this.register_Form.sno,
                        password: this.register_Form.password
                    }

                    this.$axios({
                        method:'post',
                        url:this.apiUrl.login,
                        data:formData
                    })
                }
            },
            findPassword(formName){
                //找回密码
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //校验通过
                        let that=this;
                        let formData=new FormData();
                        formData.append('sno',this.findPasswordForm.sno);
                        formData.append('sid',this.findPasswordForm.sid);
                        this.$axios({
                            method:'post',
                            data:formData,
                            url:this.apiUrl.findPassword
                        }).then(response=>{
                            if(response.data.status==200){
                                this.$notify({
                                    title: '找回密码',
                                    message: response.data.data.detailMessage,
                                    type: 'success'
                                });
                                that.findPasswordDialogVisible=false;
                            }else{
                                that.common.errorReturn(that,response.data.data.detailMessage);
                            }
                        }).catch(error=>{
                            console.log('---error---',error);
                        })
                    }
                })

            },
            resetFindPasswordDialog(){
                this.$refs['findPasswordForm'].resetFields();
                this.findPasswordDialogVisible=false;
            },
            login(formName){
                //登录
                let formData=new FormData();
                formData.append("sno",this.login_Form.sno);
                formData.append('spassword',this.login_Form.password);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //校验通过
                        let that=this;
                        this.$axios({
                            method:'post',
                            url:this.apiUrl.login,
                            data:formData
                        }).then(response=>{
                            if(response.data.status==200){
                                //登录成功
                                that.$message({
                                    message:'登录成功',
                                    type:'success '
                                });

                                localStorage.setItem('user',JSON.stringify(response.data.data.data));
                                that.$router.push("/index");
                            }else{
                                that.common.errorReturn(that,response.data.data.detailMessage);
                            }
                        }).catch(err=>{
                            console.log('----err---',err);
                        })
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        min-width: 800px;
        min-height:600px;
        background-image: url("../assets/images/logo.jpg");
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
    }
    .info{
        padding:40px;
        background-color: #24262e;
        position: absolute;
        right:10%;
        top:20%;
        border-radius:15px;
    }
    .demo-ruleForm{
        display: flex;
        flex-direction: column;
        padding:20px 40px 20px 20px;
    }
    .login_item{
        width:100%;
        height:45px;
        font-size:18px;
    }
    .title{
        font-family:"Hiragino Sans GB";
        font-size:25px;
        color:#fff;
    }
</style>