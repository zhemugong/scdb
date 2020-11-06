/*
* 引入vue和路由
* */

import Vue from 'vue'
import Router from 'vue-router'

/*import login from '../views/login'
import index from '../views/index'
import help from '../views/help'
import teacherInfo from '../views/teacherInfo'
import studentInfo from '../views/studentInfo'
import departmentInfo from '../views/departmentInfo'
import courseInfo from '../views/courseInfo'
import sctInfo from '../views/sctInfo'
import studentStatistic from '../views/studentStatistic'
import departmentStatistic from '../views/departmentStatistic'
import teacherStatistic from '../views/teacherStatistic'
import courseStatistic from '../views/courseStatistic'
import sctStatistic from '../views/sctStatistic'
import MySctInfo from '../views/MySctInfo'
import welcome from '../views/welcome'*/

const login=()=>import("../views/login")
const index=()=>import("../views/index")
const help=()=>import("../views/help")
const teacherInfo=()=>import("../views/teacherInfo")
const studentInfo=()=>import("../views/studentInfo")
const departmentInfo=()=>import("../views/departmentInfo")
const courseInfo=()=>import("../views/courseInfo")
const sctInfo=()=>import("../views/sctInfo")
const studentStatistic=()=>import("../views/studentStatistic")
const departmentStatistic=()=>import("../views/departmentStatistic")
const teacherStatistic=()=>import("../views/teacherStatistic")
const courseStatistic=()=>import("../views/courseStatistic")
const sctStatistic=()=>import("../views/sctStatistic")
const MySctInfo=()=>import("../views/MySctInfo")
const welcome=()=>import("../views/welcome")

Vue.use(Router)     //安装路由插件

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default new Router({
    mode:'history',
    routes:[
        {
            path:'/login',
            component: login,
            name:'login'
        },
        {
            path:'/',
            component: login,
            name:'login'
        },
        {
            path:'/index',
            component:index,
            name:'',
            redirect:'/welcome',
            children:[
                {
                    path:'/welcome',
                    component:welcome,
                    name:'welcome'
                },
                {
                    path:'/help',
                    component:help,
                    name:'help'
                },
                {
                    path:'/studentInfo',
                    component:studentInfo,
                    name:'studentInfo'
                },
                {
                    path:'/teacherInfo',
                    component:teacherInfo,
                    name:'teacherInfo'
                },{
                    path:'/departmentInfo',
                    component:departmentInfo,
                    name:'departmentInfo'
                },{
                    path:'/courseInfo',
                    component:courseInfo,
                    name:'courseInfo'
                },{
                    path:'/sctInfo',
                    component:sctInfo,
                    name:'sctInfo'
                },{
                    path:'/studentStatistic',
                    component:studentStatistic,
                    name:'studentStatistic'
                },{
                    path:'/departmentStatistic',
                    component:departmentStatistic,
                    name:'departmentStatistic'
                },
                {
                    path:'/teacherStatistic',
                    component:teacherStatistic,
                    name:'teacherStatistic'
                },
                {
                    path:'/courseStatistic',
                    component:courseStatistic,
                    name:'courseStatistic'
                },{
                    path:'/sctStatistic',
                    component:sctStatistic,
                    name:'sctStatistic'
                },{
                    path:'/MySctInfo',
                    component:MySctInfo,
                    name:'MySctInfo'
                }
            ]
        }
    ]
})