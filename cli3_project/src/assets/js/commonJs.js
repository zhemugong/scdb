/*封装常用的js函数*/
export function errorReturn(currentObject,message) {
    //success为1时，返回错误内容
    /*
    *currentObject是传入当前对象，message后端返回的错误码
    * */
    if (message == '请重新登录') {
        //重新登录
        currentObject.$message({
            type: 'error',
            message: '请重新登录'
        });
        currentObject.$router.push('/');
    } else {
        //非重新登录
        currentObject.$message({
            type: 'error',
            message: message
        });
    }
}

export function uploadData(currentObject,api) {
    //上传数据
    /*
    * currentObject当前对象，api传入接口
    * */
    if(currentObject.file==null){
        currentObject.$message({
            type:'error',
            message:'请点击批量添加上传excel'
        })
    }else{
        const loading=currentObject.$loading({
            body:true,
            fullscreen:true,
            lock:true,
            text:'正在上传中',
            spinner:'el-icon-loading',
            background:'rgba(0, 0, 0, 0.8)'
        })
        //上传excel文件
        let that=currentObject;
        let formData=new FormData();
        formData.append('file',currentObject.file.raw)
        currentObject.$axios({
            method: 'post',
            url:api,
            headers:{
                'Content-Type':'multipart/form-data'
            },
            data:formData
        }).then(response=>{
            if(response.data.status==200){
                that.$message({
                    type:'success',
                    message:'上传成功'
                })
                that.reload();
            }else{
                that.common.errorReturn(that,response.data.data.detailMessage);
            }
            loading.close();    //关闭加载中
        }).catch(error=>{
            console.log('-----请求失败----',error);
        });
    }

}

export function getAllDataByConditionAndPage(currentObject,api) {
    //获取所有数据的公共接口
    let that=currentObject;
    let params={
        condition:currentObject.queryInfo.condition,
        currentPage:currentObject.queryInfo.currentPage,
        pageSize:currentObject.queryInfo.pageSize
    }
    currentObject.$axios.get(api,{
        params:params
    }).then(response=> {
        if (response.data.status == 200) {
            //成功
            that.tableData = response.data.data.data;
            that.total = response.data.data.total;
        } else {
            that.common.errorReturn(that,response.data.detailMessage);
        }
    })
}

export function getAllData(currentObject,api) {
    let that=currentObject;
    currentObject.$axios.get(api).then(response=>{
        if(response.data.status==200){
            that.allTableData=response.data.data.data;
        }else{
            that.common.errorReturn(that,response.data.data.detaiMessage);
        }
    }).catch(error=>{
        console.log('---error---',error);
    })
}

export function selectDetailInfo(currentObject,api,no) {
    //根据no获取详细信息
    if(JSON.parse(localStorage.getItem('user')).power=='学生管理员'){
        currentObject.infoDialog=true;
        let that=currentObject;
        let params={
            sno:no,
            tno:no,
            dno:no,
            cno:no
        }
        currentObject.$axios.get(api,{
            params:params
        }).then(response=>{
            if(response.data.status==200){
                that.InfoForm=response.data.data.data;
                that.InfoForm["studentNo"]=no;
                that.InfoForm["teacherNo"]=no;
                that.InfoForm["departmentNo"]=no;
                that.InfoForm["courseNo"]=no;
            }
        }).catch(error=>{
            console.log('----error---',error);
        })
    }else {
        currentObject.$notify({
            title: '警告',
            message: '你不具有修改的权利',
            type: 'warning'
        });
    }

}

export function changeInfo(currentObject,api) {
    //currentObject.qs.stringify(currentObject.InfoForm),
    let that=currentObject;
    currentObject.$axios({
        method:'post',
        data:currentObject.qs.stringify(currentObject.InfoForm),
        url:api
    }).then(response=>{
        if(response.data.status==200){
            that.$message({
                type:'success',
                message:'修改成功'
            })
            that.infoDialog=false;
            that.reload();
        }else{
            that.common.errorReturn(that,response.data.data.detailMessage)
        }
    }).catch(error=>{
        console.log('---error---',error);
    })
}

export function addOne(currentObject,api){
    //手动添加一个
        let that=currentObject;
        currentObject.$axios({
            method:'post',
            data:currentObject.qs.stringify(currentObject.form),
            url:api
        }).then(res=>{
            if(res.data.status==200){
                that.$message({
                    type:'success',
                    message:'添加成功'
                })
                that.dialogFormVisible=false;
                that.reload();
            }else{
                that.common.errorReturn(that,res.data.data.detailMessage)
            }
        }).catch(error=>{
            console.log('---error--',error);
        })
}

export function deletes(currentObject,api_one,api_multiple,deleteObject,no){
    //删除

    if(JSON.parse(localStorage.getItem('user')).power=='学生管理员'){
        if(currentObject.multipleSelection.length>1){
            for(let i=0;i<currentObject.multipleSelection.length;i++){
                if(currentObject.multipleSelection[i].sno!=undefined){
                    currentObject.selectNos[i]=currentObject.multipleSelection[i].sno;
                }
                if(currentObject.multipleSelection[i].tno!=undefined){
                    if(currentObject.multipleSelection[i].cno==undefined){
                        currentObject.selectNos[i]=currentObject.multipleSelection[i].tno;
                    }
                }
                if(currentObject.multipleSelection[i].dno!=undefined){
                    currentObject.selectNos[i]=currentObject.multipleSelection[i].dno;
                }
                if(currentObject.multipleSelection[i].cno!=undefined){
                    currentObject.selectNos[i]=currentObject.multipleSelection[i].cno;
                }
            }
            currentObject.$confirm('是否删除选中的'+deleteObject+'信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
            }).then(() => {
                //点击确定
                let that = currentObject;
                let formData=new FormData();
                formData.append('snoArrays',currentObject.selectNos);
                formData.append('tnoArrays',currentObject.selectNos);
                formData.append("dnoArrays",currentObject.selectNos);
                formData.append("cnoArrays",currentObject.selectNos);
                currentObject.$axios({
                    method:'post',
                    data:formData,
                    url:api_multiple
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
        }else{
            //删除单个学生
            currentObject.$confirm('是否删除该学生信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
            }).then(() => {
                //点击确定
                let that = currentObject;
                let params = {
                    sno:no,
                    tno:no,
                    dno:no,
                    cno:no
                };
                currentObject.$axios.get(api_one, {
                    params: params
                }).then(response => {
                    if (response.data.status == 200) {
                        that.$message({
                            message: '删除成功',
                            type: 'success '
                        });
                    } else {
                        that.common.errorReturn(that, response.data.data.detailMessage);
                    }
                    that.reload();
                }).catch(error => {
                    console.log("--error--", error);
                })
            }).catch(() => {
                //点击取消
            });
        }
    }else{
        currentObject.$notify({
            title: '警告',
            message: '你不具有删除的权利',
            type: 'warning'
        });
    }

}

export function judgeIsLogin() {
    if(!localStorage.getItem('token')){
        this.$router.push("/");
    }
}