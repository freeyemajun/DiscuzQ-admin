/**
 * 后台登录页面JS
 */

import { mapMutations } from 'vuex';
import browserDb from "../../../../helpers/webDbHelper";

export default {
  data:function () {
    return {
      checked:false,
      form: {
        user: '',
        password: '',
      },
      rules:{
        user:[
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      tokenId:'',
      loginLoading:false
    }
  },
  methods:{
    ...mapMutations({
      setLoginState:'login/SET_LOGIN_STATE'
    }),

    adminLogin(formName){
      this.loginLoading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postLogin().then(res=>{
            if (res.errors){
              if (res.errors[0].detail){
                this.$message.error(res.errors[0].code + '\n' + res.errors[0].detail[0])
              } else {
                this.$message.error(res.errors[0].code);
              }
              this.loginLoading = false;
            } else {
              if (res.Code !== 0) {
                this.$message.error(res.Message);
                this.loginLoading = false;
                return
              }
              // this.tokenId = res.data.id;
              let token = res.Data.accessToken;
              let tokenId = res.Data.id;
              let refreshToken = res.Data.refreshToken;
              browserDb.setLItem('Authorization', token);
              browserDb.setLItem('tokenId', tokenId);
              browserDb.setLItem('refreshToken', refreshToken);

              if (token && tokenId) {
                this.getUserInfo(tokenId).then(res => {
                  if (res.errors) {
                    if (res.errors[0].detail) {
                      this.$message.error(res.errors[0].code + '\n' + res.errors[0].detail[0])
                    } else {
                      this.$message.error(res.errors[0].code);
                    }
                    this.loginLoading = false;
                  } else {
                    let groupId = res.Data.group.pid;
                    browserDb.setLItem('username', res.Data.username);
                    if (groupId === 1) {
                      this.$router.push({path: '/admin'});
                      this.$message({
                        message: '登录成功！',
                        type: 'success'
                      });
                      this.loginLoading = false;
                    } else {
                      this.$message.error('权限不足！');
                      this.loginLoading = false;
                    }
                  }
                })
              } else {
                if (res.errors) {
                  if (res.errors[0].detail) {
                    this.$message.error(res.errors[0].code + '\n' + res.errors[0].detail[0])
                  } else {
                    this.$message.error(res.errors[0].code);
                  }
                  this.loginLoading = false;
                }
              }
            }
          }).catch((err)=>{
            if (err.errors){
              if (err.errors[0].detail){
                this.$message.error(err.errors[0].code + '\n' + err.errors[0].detail[0])
              } else {
                this.$message.error(err.errors[0].code);
              }
              this.loginLoading = false;
            }
            this.loginLoading = false;
          })

        } else {
          this.loginLoading = false;
          return false;
        }
      });
    },

   /* user(){
      this.$router.push('/user/userview')
    },*/


    /*
    * 接口请求
    * */
    postLogin(){
      return this.appFetch({
        url:'login_post_v3',
        method:'post',
        data:{
          "username": this.form.user,
          "password": this.form.password
        }
      }).then(res=>{
          return res
      }).catch(err=>{
      })
    },
    getUserInfo(id){
      return this.appFetch({
        url:'user_get_v3',
        method:'get',
        // splice:'/' + id,
        data:{
          userId: id,
        }
      }).then(res=>{
        return res
      }).catch(err=>{
      })
    }
  },
  created(){
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    localStorage.clear();
    token && localStorage.setItem('access_token', token);
    userId && localStorage.setItem('user_id', userId);
  }
}
