import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

//请求拦截器
axios.interceptors.request.use(config => {
    //如果存在那么之后的请求将携带这个token
    if (window.sessionStorage.getItem("tokenStr")) {
        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    }
    return config;
}, error => {
    console.log(error)
})

// success指的是成功发送了请求,相应拦截器
axios.interceptors.response.use(success => {
    //请求确实发过去了，但是我的逻辑是错的，可能是要删除一个有子部门
    //业务逻辑错误
    //成功调用了接口
    //这是后端发过来的
    if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
        Message.error({ message: success.data.message });
        return;
    }
    if (success.data.message) {
        Message.success({ message: success.data.message });
    }
    return success.data
}, error => {
    if (error.response.code == 504 ) {
        Message.error({ message: '服务器不行了' })
    } else if(error.response.code == 404){
        Message.error({message:'not found!'})
    }
    else if (error.response.code == 403) {
        Message.error({ message: '权限不足' })
    } else if (error.response.code == 401) {
        Message.error({ message: "未登录,请登录" })
        router.replace('/')
    } else {
        if (error.response.data.message) {
            Message.error({ message: error.response.data.message })
        } else {
            Message.error({ message: '未知错误' })
        }
    }
    return;
});

let base = '';

export const postRequest = (url, params) => {
        console.log('请求开始');
        return axios({
            method: 'post',
            url: `${base}${url}`,
            data: params
        })
    }
    //put请求
export const putRequest = (url, params) => {
        return axios({
            method: 'put',
            url: `${base}${url}`,
            data: params
        })
    }
    //get请求
export const getRequest = (url, params) => {
        return axios({
            method: 'get',
            url: `${base}${url}`,
            data: params
        })
    }
    //delete请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}